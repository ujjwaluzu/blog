import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="space-y-6 text-[16px] leading-[1.85] text-foreground/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-12 font-display text-3xl font-medium leading-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-12 font-display text-2xl font-medium leading-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-10 font-display text-xl font-medium leading-tight first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6">{children}</ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-accent pl-5 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-foreground"
            >
              {children}
            </a>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto border border-border bg-surface p-5 text-sm leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ className, children }) => (
            <code
              className={
                className
                  ? `${className} font-mono text-[0.9em]`
                  : "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"
              }
            >
              {children}
            </code>
          ),
          hr: () => <hr className="border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
