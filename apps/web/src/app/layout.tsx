import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PING77 // A Risk Market for Dead Projects",
  description:
    "Upload failed projects, extract death modes, price startup risk.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-[960px] mx-auto px-8 py-6 pb-20">
          <nav className="flex justify-between items-center border-b border-fg-dim pb-2 mb-8 text-[11px] text-fg-dim uppercase tracking-widest">
            <span>
              SYS://PING77 · STATUS:{" "}
              <span className="text-fg-bright">ONLINE</span>{" "}
              <span className="inline-block w-2 h-3 bg-fg animate-blink align-middle" />
            </span>
            <span className="flex gap-4">
              <a
                href="/"
                className="text-fg-bright border-none text-[11px] tracking-widest px-1.5 py-0.5 hover:bg-fg-bright hover:text-bg hover:shadow-[0_0_8px_var(--fg)] transition-all"
              >
                [HOME]
              </a>
              <a
                href="/projects"
                className="text-fg-bright border-none text-[11px] tracking-widest px-1.5 py-0.5 hover:bg-fg-bright hover:text-bg hover:shadow-[0_0_8px_var(--fg)] transition-all"
              >
                [PROJECTS]
              </a>
              <a
                href="/upload"
                className="text-fg-bright border-none text-[11px] tracking-widest px-1.5 py-0.5 hover:bg-fg-bright hover:text-bg hover:shadow-[0_0_8px_var(--fg)] transition-all"
              >
                [UPLOAD]
              </a>
              <a
                href="/query"
                className="text-fg-bright border-none text-[11px] tracking-widest px-1.5 py-0.5 hover:bg-fg-bright hover:text-bg hover:shadow-[0_0_8px_var(--fg)] transition-all"
              >
                [QUERY]
              </a>
            </span>
          </nav>
          {children}
          <footer className="mt-16 pt-4 border-t border-fg-dim text-[10px] text-fg-dim flex justify-between uppercase tracking-widest">
            <span>&copy; MMXXVI &middot; NO RIGHTS RESERVED</span>
            <span>
              BUILT FOR THOSE WHO FAILED{" "}
              <span className="inline-block w-2 h-3 bg-fg animate-blink align-middle" />
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
