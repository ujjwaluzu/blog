import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isProtectedAdminPath(pathname: string) {
  const isAdmin =
    pathname === "/admin" ||
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login"));

  return isAdmin;
}

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isProtected = isProtectedAdminPath(request.nextUrl.pathname);
  // All current admin POST endpoints are Server Actions. They authenticate
  // with their own server client, including no-JavaScript form submissions.
  const isServerAction = request.method === "POST";

  if (!supabaseUrl || !supabaseAnonKey) {
    // Without Supabase configured, the admin area is unreachable for
    // everyone; send unauthenticated requests to the login page.
    if (isProtected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next({ request });
  }

  // Server Actions authenticate with their own server client. Running a
  // second getUser() here can refresh the same single-use Supabase refresh
  // token twice when the access token is expired, causing the action to see
  // an invalid session and the proxy to redirect it to login. Leave the
  // action request to the action's authenticated client; page navigations
  // still use this proxy for session refresh and route protection.
  if (isServerAction) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
