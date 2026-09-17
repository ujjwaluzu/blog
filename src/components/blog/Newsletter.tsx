export default function Newsletter() {
  return (
    <section className="border-b border-border" aria-label="Newsletter">
      <div className="page-container">
        <div className="section-space mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium leading-[1.15] text-balance md:text-[2.75rem]">
            STAY IN THE LOOP
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-[1.7] text-muted-foreground">
            Occasional notes about things I&apos;m building, learning, and
            discovering.
          </p>
          <div className="mx-auto mt-11 flex max-w-xl flex-col gap-6 text-left sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Your email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email address"
                className="w-full border-b border-border bg-transparent px-1 pb-3 pt-1 text-sm text-foreground transition-colors duration-200 placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="shrink-0 border border-border px-8 py-4 text-center text-foreground transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <span className="eyebrow">SUBSCRIBE</span>
            </button>
          </div>
          <p className="eyebrow mt-8 text-muted-foreground/80">
            NO SPAM. UNSUBSCRIBE ANYTIME.
          </p>
        </div>
      </div>
    </section>
  );
}