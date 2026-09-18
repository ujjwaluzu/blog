import Link from "next/link";
import { login } from "@/lib/auth/actions";
import SubmitButton from "@/components/admin/SubmitButton";
import BrandLogo from "@/components/brand/BrandLogo";

export default async function AdminLoginPage(
  props: PageProps<"/admin/login">
) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <BrandLogo className="h-10 w-auto" />
        <h1 className="mt-3 font-display text-3xl">Admin</h1>

        <form action={login} className="mt-12 space-y-8">
          <div>
            <label htmlFor="email" className="eyebrow text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-3 w-full border-b border-border bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="eyebrow text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-3 w-full border-b border-border bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-accent">
              Invalid email or password. Please try again.
            </p>
          ) : null}

          <SubmitButton />
        </form>

        <p className="mt-12 text-sm text-muted-foreground">
          <Link href="/">Back to site</Link>
        </p>
      </div>
    </main>
  );
}