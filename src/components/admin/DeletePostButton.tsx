"use client";

import { useRef, useState, useTransition } from "react";
import { deletePost } from "@/lib/posts/actions";

export default function DeletePostButton({
  postId,
  postTitle,
}: {
  postId: string;
  postTitle: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const openDialog = () => {
    setMessage(null);
    dialogRef.current?.showModal();
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePost(postId);
      if (!result.ok) {
        setMessage("Couldn’t delete the post. Please try again.");
        return;
      }
      if (result.warning) {
        setMessage(result.warning);
      } else {
        dialogRef.current?.close();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="text-xs tracking-[0.08em] text-muted-foreground underline-offset-2 hover:underline hover:text-foreground"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-post-title"
        className="w-[min(90vw,24rem)] border border-border bg-background p-6 text-foreground backdrop:bg-foreground/40"
      >
        <h2 id="delete-post-title" className="font-display text-xl">
          Delete this post?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          &ldquo;{postTitle}&rdquo; will be permanently removed.
        </p>

        {message ? (
          <p role="alert" className="mt-3 text-sm text-accent">
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            disabled={pending}
            className="px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="border border-border px-4 py-1.5 text-xs transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </dialog>
    </>
  );
}
