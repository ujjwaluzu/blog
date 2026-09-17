"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  removeCover,
  uploadCover,
  type CoverFormState,
} from "@/lib/posts/cover";
import {
  coverFileError,
  coverObjectUrl,
} from "@/lib/posts/storage";

const EMPTY_STATE: CoverFormState = {};

const inputBase =
  "inline-flex items-center gap-2 border border-border px-4 py-2 text-xs tracking-[0.08em] uppercase transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60";

export default function CoverImageField({
  postId,
  coverImagePath,
}: {
  postId: string;
  coverImagePath: string | null;
}) {
  const [uploadState, uploadAction, uploading] = useActionState(
    uploadCoverWithPreview,
    EMPTY_STATE
  );
  const [removeState, removeAction, removing] = useActionState(
    removeCoverWithPreview,
    EMPTY_STATE
  );

  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [currentCoverPath, setCurrentCoverPath] = useState(coverImagePath);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);

  async function uploadCoverWithPreview(
    prevState: CoverFormState,
    formData: FormData
  ): Promise<CoverFormState> {
    const nextState = await uploadCover(prevState, formData);
    if (nextState.cover_image !== undefined) {
      setCurrentCoverPath(nextState.cover_image);
      if (selectedUrl) {
        URL.revokeObjectURL(selectedUrl);
        setSelectedUrl(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    return nextState;
  }

  async function removeCoverWithPreview(
    prevState: CoverFormState,
    formData: FormData
  ): Promise<CoverFormState> {
    const nextState = await removeCover(prevState, formData);
    if (nextState.cover_image !== undefined) {
      setCurrentCoverPath(nextState.cover_image);
    }
    return nextState;
  }

  const presentedUrl = selectedUrl
    ? selectedUrl
    : currentCoverPath
      ? coverObjectUrl(currentCoverPath)
      : null;

  useEffect(() => {
    return () => {
      if (selectedUrl) URL.revokeObjectURL(selectedUrl);
    };
  }, [selectedUrl]);

  function handleFileChange() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setClientError(null);

    const fileError = coverFileError(file);
    if (fileError) {
      setClientError(fileError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selectedUrl) URL.revokeObjectURL(selectedUrl);
    setSelectedUrl(URL.createObjectURL(file));
    uploadFormRef.current?.requestSubmit();
  }

  const error = clientError ?? uploadState.message ?? removeState.message;

  return (
    <div>
      <label
        id="cover-image-label"
        htmlFor="cover-image-file"
        className="eyebrow text-muted-foreground"
      >
        Cover image
      </label>

      <div className="mt-2 flex flex-wrap items-start gap-6">
        <div className="w-56 shrink-0 overflow-hidden border border-border bg-muted aspect-[16/9] relative">
          {presentedUrl ? (
            selectedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedUrl}
                alt="Selected cover image preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={coverObjectUrl(currentCoverPath!)}
                alt="Current cover image"
                fill
                unoptimized
                className="object-cover"
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
              No cover image yet
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <form
            ref={uploadFormRef}
            action={uploadAction}
            className="flex flex-wrap gap-3"
          >
            <input type="hidden" name="post_id" value={postId} />
            <label
              htmlFor="cover-image-file"
              aria-describedby="cover-image-hint cover-image-error"
              className={inputBase}
            >
              <input
                ref={fileInputRef}
                id="cover-image-file"
                name="file"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                disabled={uploading || removing}
                onChange={handleFileChange}
                className="sr-only"
              />
              {uploading ? "Uploading…" : presentedUrl ? "Replace image" : "Upload image"}
            </label>
          </form>

          {currentCoverPath && !selectedUrl ? (
            <form action={removeAction}>
              <input type="hidden" name="post_id" value={postId} />
              <button
                type="submit"
                disabled={uploading || removing || !currentCoverPath}
                className="border border-border px-4 py-2 text-xs tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removing ? "Removing…" : "Remove image"}
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <p id="cover-image-hint" className="mt-2 text-xs text-muted-foreground">
        JPEG, PNG, WebP, or AVIF, up to 5 MB. The old image is replaced after
        the new one uploads.
      </p>

      {uploadState.success ? (
        <p role="status" className="mt-2 text-sm text-accent">
          Cover image saved.
        </p>
      ) : null}
      {removeState.success ? (
        <p role="status" className="mt-2 text-sm text-accent">
          Cover image removed.
        </p>
      ) : null}
      {error ? (
        <p id="cover-image-error" role="alert" className="mt-2 text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
