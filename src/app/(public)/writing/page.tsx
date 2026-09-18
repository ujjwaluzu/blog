import Image from "next/image";
import LatestPosts from "@/components/blog/LatestPosts";
import { getLatestPublishedPosts } from "@/lib/blog/queries";

export default async function WritingPage() {
  const result = await getLatestPublishedPosts(24);

  return (
    <main>
      <section className="border-b border-border py-[clamp(5rem,10vw,8rem)]">
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
        posts={result.data}
        error={result.error !== null}
        heading="ALL ARTICLES"
      />
    </main>
  );
}
