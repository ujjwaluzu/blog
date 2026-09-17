"use client";

import { useEffect, useRef, useState } from "react";
import { coverFileError } from "@/lib/posts/storage";

const inputBase =
  "inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background";

export default function NewCoverImageField({
  serverError,
}: {
  serverError?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const fileError = coverFileError(file);
    if (fileError) {
      setError(fileError);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <div>
      <label
        id="new-cover-image-label"
        htmlFor="new-cover-image-file"
        className="eyebrow text-muted-foreground"
      >
        Cover image
      </label>

      <div className="mt-2 flex flex-wrap items-start gap-6">
        <div className="relative aspect-[16/9] w-56 shrink-0 overflow-hidden border border-border bg-muted">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected cover image preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
              No cover image selected
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="new-cover-image-file"
            aria-describedby="new-cover-image-hint new-cover-image-error"
            className={inputBase}
          >
            <input
              ref={fileInputRef}
              id="new-cover-image-file"
              name="cover_file"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleFileChange}
              className="sr-only"
            />
            {previewUrl ? "Replace image" : "Choose image"}
          </label>
          {previewUrl ? (
            <button
              type="button"
              onClick={() => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setError(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="border border-border px-4 py-2 text-xs tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:border-foreground hover:text-foreground"
            >
              Remove image
            </button>
          ) : null}
        </div>
      </div>

      <p id="new-cover-image-hint" className="mt-2 text-xs text-muted-foreground">
        JPEG, PNG, WebP, or AVIF, up to 5 MB. It uploads only after the article is created.
      </p>
      {error ?? serverError ? (
        <p id="new-cover-image-error" role="alert" className="mt-2 text-sm text-accent">
          {error ?? serverError}
        </p>
      ) : null}
    </div>
  );
}
