import { logout } from "@/lib/auth/actions";

export default function AdminHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 lg:px-8">
      <p className="eyebrow text-muted-foreground">Admin</p>

      <div className="flex items-center gap-4">
        <span className="font-display text-sm font-medium tracking-[0.22em]">
          UJJWALUZU
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="border border-border px-3 py-1.5 text-xs tracking-[0.08em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}