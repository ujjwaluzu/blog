export default function EditorialStatement() {
  return (
    <section>
      <div className="page-container">
        <div className="section-space mx-auto max-w-3xl text-center">
          <span aria-hidden="true" className="mx-auto block h-px w-10 bg-accent/60" />
          <p className="mt-10 font-display text-[clamp(2.125rem,5.5vw,4.25rem)] font-medium leading-[1.12] tracking-[-0.01em] text-balance">
            Ideas are easy.{" "}
            <em className="text-accent">Building them</em> is the interesting
            part.
          </p>
        </div>
      </div>
    </section>
  );
}