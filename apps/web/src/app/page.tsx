export default function Home() {
  return (
    <main>
      <pre className="font-mono text-lg font-bold leading-tight whitespace-pre text-fg-bright [text-shadow:0_0_3px_var(--fg)] my-8 overflow-hidden">
{` ____    ___   _   _    ____     _____   _____
|  _ \\  |_ _| | \\ | |  / ___|   |___  | |___  |
| |_) |  | |  |  \\| | | |  _       / /     / /
|  __/   | |  | |\\  | | |_| |     / /     / /
|_|     |___| |_| \\_|  \\____|    /_/     /_/   `}
      </pre>

      <div className="text-[13px] text-fg-dim uppercase tracking-[0.2em] mb-2">
        // A RISK MARKET FOR DEAD PROJECTS
      </div>
      <div className="text-amber text-[11px] mb-10">
        v0.0.1-alpha &middot; 2026.04 &middot; MIT License
      </div>

      <p className="my-3 max-w-[72ch]">
        Every founder, researcher, and trader has a pile of projects rotting on
        their hard drive.{" "}
        <strong className="text-fg-bright font-bold">
          These &ldquo;failures&rdquo; are the most underrated dataset in the world
        </strong>
        &mdash;they tell you precisely which paths don&rsquo;t work, in which
        month they break, and why.
      </p>

      <p className="my-3 text-fg-dim max-w-[72ch]">
        PING77 digs up these corpses, uses LLMs to extract death modes, packages
        them into tokens, and feeds them into a startup risk prediction market.
        For the first time, those who failed earn yield by contributing the
        lessons.
      </p>

      {/* Warning */}
      <div className="border border-dashed border-accent p-4 my-6 text-accent bg-[rgba(255,68,68,0.05)] text-xs before:content-['[!]_'] before:font-bold">
        This is an open-source thought experiment and reference implementation.
        If you see any token bearing this project&rsquo;s name, it is a
        community memorial meme&mdash;it represents no protocol equity,
        distributes no revenue, and may go to zero at any moment. Do not treat
        it as an investment. The protocol itself is forever free, open-source,
        and runs without any token.
      </div>

      {/* CTA */}
      <div className="border-2 border-fg-bright p-8 my-12 text-center bg-bg-alt relative">
        <div className="absolute -top-2.5 -left-2.5 text-fg-bright text-lg font-bold">+</div>
        <div className="absolute -bottom-2.5 -right-2.5 text-fg-bright text-lg font-bold">+</div>
        <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mb-3">
          READ THE CODE &middot; DEPLOY YOUR OWN
        </h2>
        <p className="text-fg-dim mx-auto my-2">
          No official deployment. No hosted version. No airdrop.
          <br />
          Just an open protocol spec and a minimum viable implementation.
        </p>
        <div className="flex gap-4 justify-center flex-wrap mt-5">
          <a
            href="https://github.com/PING77INC/PING77"
            target="_blank"
            rel="noopener"
            className="inline-block px-6 py-3 bg-fg-bright text-bg font-mono text-[13px] font-bold uppercase tracking-widest border border-fg-bright hover:bg-fg hover:shadow-[0_0_24px_var(--fg-bright)] transition-all"
          >
            [ GITHUB REPO &rarr; ]
          </a>
          <a
            href="/upload"
            className="inline-block px-6 py-3 border border-fg-bright text-fg-bright font-mono text-[13px] font-bold uppercase tracking-widest bg-transparent hover:bg-fg-bright hover:text-bg hover:shadow-[0_0_16px_var(--fg)] transition-all"
          >
            [ UPLOAD A FAILURE ]
          </a>
          <a
            href="/query"
            className="inline-block px-6 py-3 border border-fg-bright text-fg-bright font-mono text-[13px] font-bold uppercase tracking-widest bg-transparent hover:bg-fg-bright hover:text-bg hover:shadow-[0_0_16px_var(--fg)] transition-all"
          >
            [ QUERY RISK ]
          </a>
        </div>
      </div>

      {/* Core Mechanism */}
      <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mt-12 mb-4 pb-1 border-b border-fg-dim before:content-['>>_'] before:text-accent">
        Core Mechanism
      </h2>
      <p className="my-3">Three sentences:</p>
      <ol className="my-4 ml-6 list-decimal">
        <li className="my-2">
          <strong className="text-fg-bright">Upload</strong> &mdash; You drop a
          dead project&rsquo;s code, pitch, burn record, and post-mortem into the
          protocol.
        </li>
        <li className="my-2">
          <strong className="text-fg-bright">Extract</strong> &mdash; LLMs
          distill thousands of stories into reusable &ldquo;death modes.&rdquo;
        </li>
        <li className="my-2">
          <strong className="text-fg-bright">Price</strong> &mdash; New founders
          query risk; the market bets on &ldquo;how the next one will die.&rdquo;
          You collect.
        </li>
      </ol>

      {/* Data Flow */}
      <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mt-12 mb-4 pb-1 border-b border-fg-dim before:content-['>>_'] before:text-accent">
        Data Flow
      </h2>
      <pre className="font-mono text-[11px] leading-tight whitespace-pre p-4 border border-fg-dim bg-bg-alt overflow-x-auto my-6">
{`   +----------------+      +----------------+      +----------------+
   |   DEAD REPO    |      |     LLM        |      |   DEATH MODE   |
   |   pitch deck   | ---> |   extractor    | ---> |     tokens     |
   |   post-mortem  |      |                |      |                |
   +----------------+      +----------------+      +-------+--------+
                                                           |
                                                           v
   +----------------+      +----------------+      +----------------+
   |  CONTRIBUTOR   | <----|    MARKET      | <----|  NEW FOUNDER   |
   |   earns fees   |      |    prices      |      |    queries     |
   |   on matches   |      |    TTL bets    |      |     risk       |
   +----------------+      +----------------+      +----------------+`}
      </pre>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-fg-dim border border-fg-dim my-6">
        <div className="bg-bg p-4 text-center">
          <div className="text-[10px] text-fg-dim uppercase tracking-widest mb-2">
            Projects Buried
          </div>
          <div className="font-vt text-[32px] text-fg-bright [text-shadow:0_0_6px_var(--fg)] leading-none">
            --
          </div>
          <div className="text-[10px] text-amber mt-1">AWAITING SEED</div>
        </div>
        <div className="bg-bg p-4 text-center">
          <div className="text-[10px] text-fg-dim uppercase tracking-widest mb-2">
            Death Modes
          </div>
          <div className="font-vt text-[32px] text-fg-bright [text-shadow:0_0_6px_var(--fg)] leading-none">
            --
          </div>
          <div className="text-[10px] text-amber mt-1">AWAITING SEED</div>
        </div>
        <div className="bg-bg p-4 text-center">
          <div className="text-[10px] text-fg-dim uppercase tracking-widest mb-2">
            Protocol Status
          </div>
          <div className="font-vt text-[20px] text-fg-bright [text-shadow:0_0_6px_var(--fg)] leading-none pt-2">
            CONCEPT
          </div>
          <div className="text-[10px] text-amber mt-1">v0.0.1-ALPHA</div>
        </div>
      </div>

      {/* Self-host */}
      <h2 className="text-[15px] font-bold text-fg-bright uppercase tracking-[0.15em] mt-12 mb-4 pb-1 border-b border-fg-dim before:content-['>>_'] before:text-accent">
        Self-Host
      </h2>
      <div className="font-mono bg-bg-alt border-l-[3px] border-amber px-4 py-3 my-4 text-xs text-fg-bright overflow-x-auto before:content-['$_'] before:text-amber">
        git clone https://github.com/PING77INC/PING77.git
      </div>
      <div className="font-mono bg-bg-alt border-l-[3px] border-amber px-4 py-3 my-4 text-xs text-fg-bright overflow-x-auto before:content-['$_'] before:text-amber">
        cd ping77 &amp;&amp; make bootstrap
      </div>
    </main>
  );
}
