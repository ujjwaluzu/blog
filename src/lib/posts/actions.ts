"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isValidSlug, slugify } from "@/lib/posts/slug";
import { UUID_PATTERN } from "@/lib/posts/identity";
import {
  COVER_BUCKET,
  coverExtension,
  coverFileError,
  coverStoragePath,
  isCoverStoragePathForPost,
} from "@/lib/posts/storage";
import { isArticleTopicSlug } from "@/lib/topics";

const VALID_STATUS = ["draft", "published", "archived"] as const;

type PostFormState = {
  errors?: {
    title?: string;
    slug?: string;
    content?: string;
    category_id?: string;
    status?: string;
    cover_image?: string;
  };
  message?: string;
  success?: boolean;
};

type DeletePostResult = {
  ok: boolean;
  warning?: string;
};

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function revalidatePublicPost(slugs: string[] = []) {
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/(public)/writing/[slug]", "page");
  revalidatePath("/(public)/categories/[slug]", "page");
  revalidatePath("/(public)/tags/[slug]", "page");

  for (const slug of new Set(slugs)) {
    revalidatePath(`/writing/${slug}`);
    revalidatePath(`/posts/${slug}`);
  }
}

function readForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    category_id: String(formData.get("category_id") ?? "").trim(),
    statusRaw: String(formData.get("status") ?? "").trim(),
    featured: formData.get("featured") === "on",
    intent: String(formData.get("intent") ?? "").trim(),
  };
}

function readOptionalCoverFile(formData: FormData): File | null {
  const value = formData.get("cover_file");
  if (!(value instanceof File)) return null;
  if (!value.name && value.size === 0) return null;
  return value;
}

function newCoverPath(postId: string, mime: string): string | null {
  const extension = coverExtension(mime);
  if (!extension) return null;
  const token = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return coverStoragePath(postId, `cover-${token}.${extension}`);
}

async function resolveTopicId(
  supabase: ServerSupabase,
  categoryId: string
): Promise<{ id: string } | { error: string }> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) return { error: "Couldn't validate the selected topic." };
  if (!data || !isArticleTopicSlug(data.slug)) {
    return { error: "Choose Development, Projects, or Personal." };
  }

  return { id: data.id };
}

async function rollbackCreatedPost(
  supabase: ServerSupabase,
  postId: string,
  coverPath?: string
): Promise<boolean> {
  if (coverPath) {
    await supabase.storage.from(COVER_BUCKET).remove([coverPath]);
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  return !error;
}

// The homepage has a single featured slot. Setting a post as featured clears
// the flag on every other post so only one can ever be featured. Clearing
// happens before the target post is marked featured so the single-featured
// invariant holds at every step. Returns false only when the clear query errored.
async function clearOtherFeaturedPosts(
  supabase: ServerSupabase,
  keepPostId?: string
): Promise<boolean> {
  let query = supabase
    .from("posts")
    .update({ featured: false })
    .eq("featured", true);
  if (keepPostId) {
    query = query.neq("id", keepPostId);
  }
  const { error } = await query;
  return !error;
}

function resolveStatus(
  intent: string,
  statusRaw: string
): "draft" | "published" | "archived" | null {
  if (
    (intent === "create" || intent === "update") &&
    VALID_STATUS.includes(statusRaw as never)
  ) {
    return statusRaw as "draft" | "published" | "archived";
  }
  return null;
}

export async function deletePost(postId: string): Promise<DeletePostResult> {
  if (!UUID_PATTERN.test(postId)) {
    return { ok: false };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false };
  }

  const { data: post, error: loadError } = await supabase
    .from("posts")
    .select("slug, cover_image")
    .eq("id", postId)
    .maybeSingle();

  if (loadError || !post) {
    return { ok: false };
  }

  const { data: deleted, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (error || !deleted) {
    return { ok: false };
  }

  if (post.cover_image) {
    if (!isCoverStoragePathForPost(post.cover_image, postId)) {
      revalidatePath("/admin/posts");
      revalidatePath("/admin");
      revalidatePublicPost([post.slug]);
      return {
        ok: true,
        warning: "Post deleted, but its invalid cover path was not removed.",
      };
    }

    const { error: removeError } = await supabase.storage
      .from(COVER_BUCKET)
      .remove([post.cover_image]);

    if (removeError) {
      revalidatePath("/admin/posts");
      revalidatePath("/admin");
      revalidatePublicPost([post.slug]);
      return {
        ok: true,
        warning: "Post deleted, but its cover image could not be removed.",
      };
    }
  }

  revalidatePath("/admin/posts");
  revalidatePath("/admin");
  revalidatePublicPost([post.slug]);
  return { ok: true };
}

export async function createPost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const values = readForm(formData);
  const status = resolveStatus(values.intent, values.statusRaw);

  const errors: NonNullable<PostFormState["errors"]> = {};

  if (!values.title) {
    errors.title = "Title is required.";
  }

  let slug = values.slug;
  if (!slug) {
    slug = slugify(values.title);
  }
  if (!slug) {
    errors.slug = "Slug is required.";
  } else if (!isValidSlug(slug)) {
    errors.slug = "Use only lowercase letters, numbers, and hyphens.";
  }

  if (!values.content) {
    errors.content = "Content is required.";
  }

  if (values.category_id && !UUID_PATTERN.test(values.category_id)) {
    errors.category_id = "Choose a valid category.";
  } else if (!values.category_id) {
    errors.category_id = "Choose a topic.";
  }

  const coverFile = readOptionalCoverFile(formData);
  if (coverFile) {
    const coverError = coverFileError(coverFile);
    if (coverError) errors.cover_image = coverError;
  }

  if (!status) {
    errors.status = "Invalid status.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Your session has expired. Please sign in again." };
  }

  const topic = await resolveTopicId(supabase, values.category_id);
  if ("error" in topic) {
    return { errors: { category_id: topic.error } };
  }

  const { data: existingSlug } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    return {
      errors: {
        slug: "A post with this slug already exists. Please choose a different slug.",
      },
    };
  }

  // A selected cover is staged against a private draft first. This prevents a
  // requested published article from becoming public before its cover is ready.
  const stagingCover = Boolean(coverFile);
  const published_at =
    !stagingCover && status === "published" ? new Date().toISOString() : null;

  // Enforce a single featured article before inserting a newly featured post.
  if (!stagingCover && values.featured) {
    const cleared = await clearOtherFeaturedPosts(supabase);
    if (!cleared) {
      return { message: "Couldn't save the post. Please try again." };
    }
  }

  const { data: inserted, error } = await supabase
    .from("posts")
    .insert({
      title: values.title,
      slug,
      excerpt: values.excerpt || null,
      content: values.content,
      status: stagingCover ? "draft" : status,
      featured: stagingCover ? false : values.featured,
      category_id: topic.id,
      published_at,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        errors: {
          slug: "A post with this slug already exists. Please choose a different slug.",
        },
      };
    }
    if (error.code === "23503") {
      return { errors: { category_id: "That category no longer exists." } };
    }
    return { message: "Couldn't save the post. Please try again." };
  }

  if (coverFile) {
    const path = newCoverPath(inserted.id, coverFile.type);
    if (!path) {
      await rollbackCreatedPost(supabase, inserted.id);
      return { message: "Couldn't determine the cover image type. Please try again." };
    }

    const { error: uploadError } = await supabase.storage
      .from(COVER_BUCKET)
      .upload(path, coverFile, {
        cacheControl: "3600",
        contentType: coverFile.type,
        upsert: false,
      });

    if (uploadError) {
      const rolledBack = await rollbackCreatedPost(supabase, inserted.id);
      revalidatePath("/admin/posts");
      revalidatePath("/admin");
      return {
        message: rolledBack
          ? "Couldn't upload the cover image. The article was not saved."
          : "Couldn't upload the cover image. A draft article may remain and needs attention.",
      };
    }

    const { data: attached, error: attachError } = await supabase
      .from("posts")
      .update({ cover_image: path })
      .eq("id", inserted.id)
      .select("id")
      .maybeSingle();

    if (attachError || !attached) {
      const rolledBack = await rollbackCreatedPost(supabase, inserted.id, path);
      revalidatePath("/admin/posts");
      revalidatePath("/admin");
      return {
        message: rolledBack
          ? "Couldn't save the cover image. The article was not saved."
          : "Couldn't save the cover image. A draft article may remain and needs attention.",
      };
    }

    if (values.featured) {
      const cleared = await clearOtherFeaturedPosts(supabase, inserted.id);
      if (!cleared) {
        const rolledBack = await rollbackCreatedPost(supabase, inserted.id, path);
        revalidatePath("/admin/posts");
        revalidatePath("/admin");
        return {
          message: rolledBack
            ? "Couldn't finalize the article. The article was not saved."
            : "Couldn't finalize the article. A draft article may remain and needs attention.",
        };
      }
    }

    const { data: finalized, error: finalizeError } = await supabase
      .from("posts")
      .update({
        status,
        featured: values.featured,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", inserted.id)
      .select("id")
      .maybeSingle();

    if (finalizeError || !finalized) {
      const rolledBack = await rollbackCreatedPost(supabase, inserted.id, path);
      revalidatePath("/admin/posts");
      revalidatePath("/admin");
      return {
        message: rolledBack
          ? "Couldn't finalize the article. The article was not saved."
          : "Couldn't finalize the article. A draft article may remain and needs attention.",
      };
    }
  }

  revalidatePath("/admin/posts");
  revalidatePath("/admin");
  revalidatePublicPost([slug]);
  redirect(`/admin/posts/${inserted.id}/edit`);
}

export async function updatePost(
  _prevState: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const postId = String(formData.get("post_id") ?? "").trim();

  if (!UUID_PATTERN.test(postId)) {
    return { message: "This post no longer exists." };
  }

  const values = readForm(formData);
  const status = resolveStatus(values.intent, values.statusRaw);

  const errors: NonNullable<PostFormState["errors"]> = {};

  if (!values.title) {
    errors.title = "Title is required.";
  }
  if (!values.slug) {
    errors.slug = "Slug is required.";
  } else if (!isValidSlug(values.slug)) {
    errors.slug = "Use only lowercase letters, numbers, and hyphens.";
  }
  if (!values.content) {
    errors.content = "Content is required.";
  }

  if (values.category_id && !UUID_PATTERN.test(values.category_id)) {
    errors.category_id = "Choose a valid category.";
  } else if (!values.category_id) {
    errors.category_id = "Choose a topic.";
  }

  if (!status) {
    errors.status = "Invalid status.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: "Your session has expired. Please sign in again." };
  }

  const topic = await resolveTopicId(supabase, values.category_id);
  if ("error" in topic) {
    return { errors: { category_id: topic.error } };
  }

  const { data: existing, error: loadError } = await supabase
    .from("posts")
    .select("slug, status, published_at")
    .eq("id", postId)
    .maybeSingle();

  if (loadError) {
    return { message: "Couldn't load this post. Please try again." };
  }
  if (!existing) {
    return { message: "This post no longer exists." };
  }

  const { data: duplicate, error: dupError } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", values.slug)
    .neq("id", postId)
    .maybeSingle();

  if (dupError) {
    return { message: "Couldn't check this slug. Please try again." };
  }
  if (duplicate) {
    return {
      errors: {
        slug: "A post with this slug already exists. Please choose a different slug.",
      },
    };
  }

  const published_at =
    status === "published"
      ? existing.published_at ?? new Date().toISOString()
      : existing.published_at;

  // Enforce a single featured article before updating the post. The target
  // post keeps its own featured flag; only the other featured rows are cleared.
  if (values.featured) {
    const cleared = await clearOtherFeaturedPosts(supabase, postId);
    if (!cleared) {
      return { message: "Couldn't save the post. Please try again." };
    }
  }

  const { data: updated, error } = await supabase
    .from("posts")
    .update({
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt || null,
      content: values.content,
      status,
      featured: values.featured,
      category_id: topic.id,
      published_at,
    })
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return {
        errors: {
          slug: "A post with this slug already exists. Please choose a different slug.",
        },
      };
    }
    if (error.code === "23503") {
      return { errors: { category_id: "That category no longer exists." } };
    }
    return { message: "Couldn't save the post. Please try again." };
  }
  if (!updated) {
    return { message: "This post no longer exists." };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/admin");
  revalidatePath("/admin/posts/" + postId + "/edit");
  revalidatePublicPost([existing.slug, values.slug]);
  return { success: true };
}

export type { PostFormState };
