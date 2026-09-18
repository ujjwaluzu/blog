export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.ujjwaluzu.in"
).replace(/\/+$/, "");

export const SITE_NAME = "Ujjwaluzu";

export const SITE_AUTHOR_NAME = "Ujjwal Baunthiyal";

export const SITE_AUTHOR_URL = `${SITE_URL}/`;

export const SITE_TITLE = "Ujjwaluzu — Ujjwal Baunthiyal's Blog";

export const SITE_DESCRIPTION =
  "Ujjwal Baunthiyal's blog about development, projects, technology, learning, and things worth building and sharing.";

export const SITE_OG_IMAGE = {
  url: "/main-char.webp",
  width: 1024,
  height: 1536,
  alt: "Ujjwaluzu — Ujjwal Baunthiyal's blog",
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function deriveDescription(
  excerpt: string | null,
  content: string,
  max = 155
): string {
  const source = excerpt?.trim() || stripMarkdown(content);
  if (!source) return SITE_DESCRIPTION;
  if (source.length <= max) return source;

  const truncated = source.slice(0, max - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated;
  return `${clipped.trimEnd()}…`;
}
