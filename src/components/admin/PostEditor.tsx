"use client";

import Link from "next/link";
import { useActionState, useRef, useState, type ReactNode } from "react";
import {
  createPost,
  updatePost,
  type PostFormState,
} from "@/lib/posts/actions";
import { slugify } from "@/lib/posts/slug";
import CoverImageField from "@/components/admin/CoverImageField";
import NewCoverImageField from "@/components/admin/NewCoverImageField";

export type CategoryOption = {
  id: string;
  name: string;
};

export type PostEditorValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  published_at: string | null;
  cover_image?: string | null;
};

const EMPTY_STATE: PostFormState = {};

type Mode = "new" | "edit";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow text-muted-foreground">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-2 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "w-full border border-border bg-surface px-3 py-2.5 text-sm transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none";

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function PostEditor({
  mode,
  postId,
  categories,
  initial,
}: {
  mode: Mode;
  postId?: string;
  categories: CategoryOption[];
  initial: PostEditorValues;
}) {
  const action = mode === "new" ? createPost : updatePost;
  const [state, formAction, pending] = useActionState(action, EMPTY_STATE);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [slugDirty, setSlugDirty] = useState(mode === "edit");
  const publishedAt = toDateTimeLocal(initial.published_at);
  const errors = state.errors ?? {};

  function handleTitleChange() {
    if (mode === "new" && !slugDirty && titleRef.current && slugRef.current) {
      slugRef.current.value = slugify(titleRef.current.value);
    }
  }

  return (
    <div className="space-y-10">
      {mode === "edit" && postId ? (
        <CoverImageField
          postId={postId}
          coverImagePath={initial.cover_image ?? null}
        />
      ) : null}

      <form action={formAction} className="space-y-10">
        {postId ? <input type="hidden" name="post_id" value={postId} /> : null}

        {state.message ? (
          <p role="alert" className="border border-border bg-muted px-4 py-3 text-sm">
            {state.message}
          </p>
        ) : null}

        {state.success ? (
          <p role="status" className="border border-border bg-muted px-4 py-3 text-sm">
            Saved.
          </p>
        ) : null}

        <Field label="Title" htmlFor="title" error={errors.title}>
          <input
            id="title"
            name="title"
            ref={titleRef}
            defaultValue={initial.title}
            onChange={handleTitleChange}
            placeholder="Article title"
            className={`${inputClass} text-lg`}
          />
        </Field>

        <Field label="Slug" htmlFor="slug" error={errors.slug}>
          <input
            id="slug"
            name="slug"
            ref={slugRef}
            defaultValue={initial.slug}
            onChange={() => setSlugDirty(true)}
            placeholder="building-repoteam"
            className={inputClass}
          />
          {mode === "new" ? (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Leave empty to generate from the title.
            </p>
          ) : null}
        </Field>

        <Field label="Excerpt" htmlFor="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={initial.excerpt}
            rows={3}
            placeholder="Short description for cards and previews (optional)."
            className={`${inputClass} resize-y`}
          />
        </Field>

        <Field label="Content" htmlFor="content" error={errors.content}>
          <textarea
            id="content"
            name="content"
            defaultValue={initial.content}
            rows={18}
            placeholder="Write in Markdown…"
            className={`${inputClass} min-h-[24rem] resize-y font-mono leading-relaxed`}
          />
        </Field>

        {mode === "new" ? <NewCoverImageField serverError={errors.cover_image} /> : null}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Topic" htmlFor="category_id" error={errors.category_id}>
            <select
              id="category_id"
              name="category_id"
              defaultValue={initial.category_id ?? ""}
              className={inputClass}
            >
              <option value="">Select a topic</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status" htmlFor="status" error={errors.status}>
            <select
              id="status"
              name="status"
              defaultValue={initial.status}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>

          <Field label="Published date" htmlFor="published_at">
            <input
              id="published_at"
              type="datetime-local"
              value={publishedAt}
              readOnly
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Set by the server when the article is first published.
            </p>
          </Field>

          <Field label="Featured" htmlFor="featured">
            <label className="flex h-[42px] cursor-pointer items-center gap-3">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                defaultChecked={initial.featured}
                className="size-4 accent-[var(--accent)]"
              />
              <span className="text-sm">Featured article</span>
            </label>
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <button
            type="submit"
            name="intent"
            value={mode === "new" ? "create" : "update"}
            disabled={pending}
            className="border border-border px-5 py-2.5 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : mode === "new" ? "Save article" : "Save changes"}
          </button>

          <Link
            href="/admin/posts"
            className="px-5 py-2.5 text-xs tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
