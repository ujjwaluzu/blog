import type { Metadata } from "next";
import Image from "next/image";
import LatestPosts from "@/components/blog/LatestPosts";
import Pagination from "@/components/blog/Pagination";
import { getPublishedPostsPage } from "@/lib/blog/queries";
import {
  SITE_NAME,
  SITE_OG_IMAGE,
} from "@/lib/seo/site";

const PAGE_SIZE = 9;

const WRITING_TITLE = "Writing";
const WRITING_DESCRIPTION =
  "Explore articles and writing by Ujjwal Baunthiyal on development, projects, technology, and learning.";

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function generateMetadata(
  props: PageProps<"/writing">
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const page = parsePage(searchParams.page);
  const canonical = page > 1 ? `/writing?page=${page}` : "/writing";
  const title = page > 1 ? `${WRITING_TITLE} | Page ${page}` : WRITING_TITLE;

  return {
    title,
    description: WRITING_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description: WRITING_DESCRIPTION,
      images: [{ ...SITE_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: WRITING_DESCRIPTION,
      images: [SITE_OG_IMAGE.url],
    },
  };
}

export default async function WritingPage(props: PageProps<"/writing">) {
  const searchParams = await props.searchParams;
  const requestedPage = parsePage(searchParams.page);
  const result = await getPublishedPostsPage(requestedPage, PAGE_SIZE);

  return (
    <main>
      <section className="border-b border-border pt-[clamp(2rem,4vw,3rem)] pb-[clamp(5rem,10vw,8rem)]">
        <div className="page-container">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent">WRITING</p>
              <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[1.04] tracking-[-0.01em]">
                Notes from the work.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-[1.75] text-muted-foreground md:text-lg">
                Essays, experiments, and lessons from building software in
                public.
              </p>
            </div>
            <div className="lg:col-span-5">
              <Image
                src="/writing-main-hero.webp"
                alt="Writing illustration"
                width={1448}
                height={1086}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <LatestPosts
        posts={result.data.posts}
        error={result.error !== null}
        heading="ALL ARTICLES"
        className="pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(1.5rem,3vw,2.5rem)]"
        pagination={
          <Pagination
            page={result.data.page}
            totalPages={result.data.totalPages}
            basePath="/writing"
          />
        }
      />
    </main>
  );
}
