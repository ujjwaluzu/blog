"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full border border-border px-6 py-3.5 transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="eyebrow">{pending ? "SIGNING IN…" : "SIGN IN"}</span>
    </button>
  );
}