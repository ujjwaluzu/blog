export const COVER_BUCKET = "blog-images";

export const MAX_COVER_SIZE = 5 * 1024 * 1024;

export const ALLOWED_COVER_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function isAllowedCoverType(mime: string): boolean {
  return (ALLOWED_COVER_MIME_TYPES as readonly string[]).includes(mime);
}

export function coverExtension(mime: string): string | null {
  return MIME_TO_EXT[mime] ?? null;
}

export function coverFileError(file: { type: string; size: number }): string | null {
  if (!isAllowedCoverType(file.type)) {
    return "That file type isn't supported. Use a JPEG, PNG, WebP, or AVIF image.";
  }
  if (file.size === 0) {
    return "That file is empty. Choose a different image.";
  }
  if (file.size > MAX_COVER_SIZE) {
    return "That image is larger than 5 MB. Choose a smaller image.";
  }
  return null;
}

export function coverStoragePath(postId: string, fileName: string): string {
  return `covers/${postId}/${fileName}`;
}

export function isCoverStoragePathForPost(
  path: string,
  postId: string
): boolean {
  const prefix = `covers/${postId}/`;
  if (!path.startsWith(prefix)) return false;

  const fileName = path.slice(prefix.length);
  return (
    fileName.length > 0 &&
    !fileName.includes("/") &&
    /\.(jpg|png|webp|avif)$/i.test(fileName)
  );
}

export function coverObjectUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${COVER_BUCKET}/${encoded}`;
}
