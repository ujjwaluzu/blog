import Link from "next/link";

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

const itemClass =
  "inline-flex h-10 min-w-10 items-center justify-center border border-border px-3 text-xs tracking-[0.08em] uppercase transition-colors duration-200";

export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link
          href={pageHref(basePath, page - 1)}
          className={`${itemClass} hover:border-foreground hover:bg-foreground hover:text-background`}
          rel="prev"
        >
          Prev
        </Link>
      ) : (
        <span className={`${itemClass} cursor-not-allowed text-muted-foreground/40`}>
          Prev
        </span>
      )}

      {pages.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="inline-flex h-10 min-w-10 items-center justify-center text-xs text-muted-foreground"
          >
            ...
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className={`${itemClass} border-foreground bg-foreground text-background`}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(basePath, item)}
            className={`${itemClass} hover:border-foreground hover:bg-foreground hover:text-background`}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={pageHref(basePath, page + 1)}
          className={`${itemClass} hover:border-foreground hover:bg-foreground hover:text-background`}
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span className={`${itemClass} cursor-not-allowed text-muted-foreground/40`}>
          Next
        </span>
      )}
    </nav>
  );
}
