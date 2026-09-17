"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { UUID_PATTERN } from "@/lib/posts/identity";
import {
  COVER_BUCKET,
  coverFileError,
  coverExtension,
  coverStoragePath,
  isCoverStoragePathForPost,
} from "@/lib/posts/storage";

export type CoverFormState = {
  success?: boolean;
  message?: string;
  cover_image?: string | null;
};

function randomToken() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase;
}

export async function uploadCover(
  prevState: CoverFormState,
  formData: FormData
): Promise<CoverFormState> {
  const postId = String(formData.get("post_id") ?? "").trim();

  if (!UUID_PATTERN.test(postId)) {
    return { message: "This post no longer exists." };
  }

  const supabase = await requireAdmin();
  if (!supabase) {
    return { message: "Your session has expired. Please sign in again." };
  }

  const { data: post, error: loadError } = await supabase
    .from("posts")
    .select("slug, cover_image")
    .eq("id", postId)
    .maybeSingle();

  if (loadError) {
    return { message: "Couldn't load this post. Please try again." };
  }
  if (!post) {
    return { message: "This post no longer exists." };
  }

  if (post.cover_image && !isCoverStoragePathForPost(post.cover_image, postId)) {
    return { message: "This post has an invalid cover image path." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { message: "Choose an image to upload." };
  }
  const fileError = coverFileError(file);
  if (fileError) return { message: fileError };

  const extension = coverExtension(file.type);
  if (!extension) {
    return { message: "Couldn't determine the image type. Try a different file." };
  }

  const path = coverStoragePath(postId, `cover-${randomToken()}.${extension}`);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: uploaded, error: uploadError } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { message: "Couldn't upload the image. Please try again." };
  }

  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update({ cover_image: path })
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedPost) {
    await supabase.storage.from(COVER_BUCKET).remove([path]);
    return { message: "Couldn't save the image. Please try again." };
  }

  const oldPath = post.cover_image;
  if (oldPath && oldPath !== path) {
    // Remove the old object only after the new one is safely stored.
    const { error: removeOldError } = await supabase.storage
      .from(COVER_BUCKET)
      .remove([oldPath]);

    if (removeOldError) {
      const { data: restored, error: restoreError } = await supabase
        .from("posts")
        .update({ cover_image: oldPath })
        .eq("id", postId)
        .select("id")
        .maybeSingle();

      if (restoreError || !restored) {
        revalidatePath("/");
        revalidatePath("/writing");
        revalidatePath("/(public)/writing/[slug]", "page");
        revalidatePath(`/writing/${post.slug}`);
        return {
          message:
            "The new image was saved, but the old image could not be cleaned up.",
          cover_image: path,
        };
      }

      await supabase.storage.from(COVER_BUCKET).remove([path]);
      return { message: "Couldn't complete the image replacement." };
    }
  }

  revalidatePath(`/admin/posts/${postId}/edit`);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/(public)/writing/[slug]", "page");
  revalidatePath(`/writing/${post.slug}`);

  return { success: true, cover_image: path };
}

export async function removeCover(
  prevState: CoverFormState,
  formData: FormData
): Promise<CoverFormState> {
  const postId = String(formData.get("post_id") ?? "").trim();

  if (!UUID_PATTERN.test(postId)) {
    return { message: "This post no longer exists." };
  }

  const supabase = await requireAdmin();
  if (!supabase) {
    return { message: "Your session has expired. Please sign in again." };
  }

  const { data: post, error: loadError } = await supabase
    .from("posts")
    .select("slug, cover_image")
    .eq("id", postId)
    .maybeSingle();

  if (loadError) {
    return { message: "Couldn't load this post. Please try again." };
  }
  if (!post) {
    return { message: "This post no longer exists." };
  }

  if (!post.cover_image) {
    return { success: true, cover_image: null };
  }

  if (!isCoverStoragePathForPost(post.cover_image, postId)) {
    return { message: "This post has an invalid cover image path." };
  }

  // Clear the database reference first. If this fails, the old object stays
  // available and the post remains consistent.
  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update({ cover_image: null })
    .eq("id", postId)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedPost) {
    return { message: "Couldn't save the change. Please try again." };
  }

  const { error: removeError } = await supabase.storage
    .from(COVER_BUCKET)
    .remove([post.cover_image]);

  if (removeError) {
    // Restore the reference while the old object still exists. This keeps a
    // storage failure from leaving an orphaned object and a lost reference.
    const { error: restoreError } = await supabase
      .from("posts")
      .update({ cover_image: post.cover_image })
      .eq("id", postId)
      .select("id")
      .maybeSingle();

    if (restoreError) {
      return { message: "Couldn't remove the image. Please try again." };
    }

    return { message: "Couldn't remove the image. Please try again." };
  }

  revalidatePath(`/admin/posts/${postId}/edit`);
  revalidatePath("/admin/posts");
  revalidatePath("/");
  revalidatePath("/writing");
  revalidatePath("/(public)/writing/[slug]", "page");
  revalidatePath(`/writing/${post.slug}`);

  return { success: true, cover_image: null };
}
