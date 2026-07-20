import Link from "next/link";
import { getStoreSettings } from "@/lib/settings";
import { getCatalogCategories } from "@/lib/catalog";
import { buildWaLink } from "@/lib/whatsapp";
import HomeMotion from "@/components/store/HomeMotion";
import CategoryImage from "@/components/store/CategoryImage";

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default async function HomePage() {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCatalogCategories(3),
  ]);

  const waLink = settings.whatsappNumber
    ? buildWaLink(settings.whatsappNumber, settings.whatsappGreeting)
    : "#checkout";

  // Marquee items blended from real categories + denominations.
  const marqueeItems: { text: string; accent?: boolean }[] = [];
  for (const c of categories) {
    marqueeItems.push({ text: c.name });
    if (c.labels.length) {
      marqueeItems.push({ text: c.labels.join(" · "), accent: true });
    }
  }
  marqueeItems.push(
    { text: "Epic Games" },
    { text: "Battle.net" },
    { text: "Riot Points" },
    { text: "Nintendo eShop" },
    { text: "PlayStation Store" },
  );

  return (
    <>
      <HomeMotion />

      {/* HERO */}
      <header className="relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--color-primary) 13%, transparent), transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-20 lg:pt-28 lg:pb-28 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <div
                className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-8 flex items-center gap-3"
                data-reveal
              >
                <span className="inline-block w-6 h-px bg-primary/60" />
                Game credits · WhatsApp checkout
              </div>

              <h1
                className="font-display font-semibold tracking-tight text-[2.6rem] sm:text-6xl lg:text-[5rem] leading-[0.95] mb-8 cursor-target"
                data-reveal
                data-delay="0.05"
              >
                Buy game credit
                <br />
                the way you&apos;d ask
                <br />
                <span className="display-italic text-primary">a friend.</span>
              </h1>

              <p
                className="text-base lg:text-lg text-base-content/65 max-w-xl leading-relaxed mb-10"
                data-reveal
                data-delay="0.1"
              >
                Steam Wallet codes, Xbox Gift Cards, PC game keys. Assemble your
                order, send it on WhatsApp, and a real person replies with your
                codes. No account. No card form. No checkout page.
              </p>

              <div className="flex flex-wrap items-center gap-3" data-reveal data-delay="0.15">
                <Link href="/catalog" className="btn btn-primary rounded-md gap-2 font-medium normal-case">
                  Browse products
                  <Arrow className="w-4 h-4" />
                </Link>
                <Link href="#how" className="btn btn-ghost rounded-md gap-2 font-medium text-base-content/80 normal-case">
                  How it works
                </Link>
              </div>

              <div
                className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-base-content/40"
                data-reveal
                data-delay="0.2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" />
                  online now
                </div>
                <div>avg reply &lt; 5 min</div>
                <div>no sign-up</div>
              </div>
            </div>

            {/* Live status card (decorative) */}
            <div className="lg:col-span-5 lg:mt-4" data-reveal data-delay="0.25">
              <div className="rounded-2xl border hairline bg-base-200/40 backdrop-blur-sm p-6 lg:p-7">
                <div className="flex items-center justify-between mb-6 pb-4 border-b hairline">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-success live-dot" />
                    <span className="font-mono text-xs uppercase tracking-wider text-base-content/60">
                      Live · today
                    </span>
                  </div>
                  <span className="font-mono text-xs text-base-content/40">WET</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="font-mono text-xs text-base-content/45 uppercase tracking-wider mb-1.5">
                      Avg reply time
                    </div>
                    <div className="font-display text-3xl font-semibold">4m 18s</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t hairline">
                    <div>
                      <div className="font-mono text-xs text-base-content/45 uppercase tracking-wider mb-1.5">
                        Orders today
                      </div>
                      <div className="font-display text-2xl font-semibold">47</div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-base-content/45 uppercase tracking-wider mb-1.5">
                        Codes sent
                      </div>
                      <div className="font-display text-2xl font-semibold">112</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t hairline">
                    <div className="font-mono text-xs text-base-content/45 uppercase tracking-wider mb-2">
                      Last delivery
                    </div>
                    <div className="font-mono text-sm text-base-content/70 space-y-1">
                      <div>2× Steam Wallet $20</div>
                      <div>1× Cyberpunk 2077 PC</div>
                      <div className="text-primary/80">→ delivered in 3m 42s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="border-y hairline py-5 marquee-mask overflow-hidden bg-base-200/30">
          <div className="marquee-track font-mono text-sm uppercase tracking-wider text-base-content/55">
            {[0, 1].map((dup) => (
              <span className="flex items-center" key={dup} aria-hidden={dup === 1}>
                {marqueeItems.map((item, i) => (
                  <span className="flex items-center" key={i}>
                    <span className={`px-6 ${item.accent ? "text-primary/70" : ""}`}>
                      {item.text}
                    </span>
                    <span className="text-base-content/25">/</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main>
        {/* HOW IT WORKS */}
        <section id="how" className="py-28 lg:py-36 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-12 mb-16 lg:mb-24" data-reveal>
              <div className="lg:col-span-5">
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-5 flex items-center gap-3">
                  <span className="inline-block w-6 h-px bg-primary/60" />
                  How it works
                </div>
                <h2 className="font-display font-semibold text-4xl lg:text-5xl leading-tight tracking-tight cursor-target">
                  Three steps. None of them are{" "}
                  <span className="italic text-base-content/55">
                    &apos;proceed to checkout.&apos;
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
                <p className="text-base-content/65 text-lg leading-relaxed">
                  The shortest path between wanting a top-up and having the code
                  in your clipboard. No middleware, no abandoned-cart emails, no
                  saved payment info.
                </p>
              </div>
            </div>

            <div className="border-t hairline">
              <div className="grid lg:grid-cols-3" data-stagger>
                {[
                  {
                    n: "01",
                    t: "Pick what you want",
                    d: "Browse Steam, Xbox, and PC catalogs. Tap to add. Your cart builds in the corner — no sign-in required.",
                  },
                  {
                    n: "02",
                    t: "Send the message",
                    d: "One tap opens WhatsApp with your order written out as a plain message. Edit it, send it, done. No form fields.",
                  },
                  {
                    n: "03",
                    t: "Get your codes",
                    d: "A real person reads your message, replies with your codes, and you pay them directly. That's the entire handoff.",
                  },
                ].map((step, i) => (
                  <div
                    key={step.n}
                    className={`py-10 lg:py-14 border-b lg:border-b-0 hairline ${
                      i < 2 ? "lg:border-r" : ""
                    } ${i === 0 ? "lg:pr-10" : i === 1 ? "lg:px-10" : "lg:pl-10"}`}
                    data-stagger-item
                  >
                    <div className="flex items-start gap-5">
                      <div className="font-mono text-sm text-primary/80 pt-1.5">
                        {step.n}
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-semibold mb-3">
                          {step.t}
                        </h3>
                        <p className="text-base-content/60 leading-relaxed">
                          {step.d}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CATALOG PREVIEW */}
        <section id="catalog" className="py-28 lg:py-36 border-t hairline bg-base-200/20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14" data-reveal>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-5 flex items-center gap-3">
                  <span className="inline-block w-6 h-px bg-primary/60" />
                  Catalog preview
                </div>
                <h2 className="font-display font-semibold text-4xl lg:text-5xl leading-tight tracking-tight max-w-2xl cursor-target">
                  Pick a shelf, mix across them.
                </h2>
              </div>
              <Link
                href="/catalog"
                className="font-mono text-sm text-base-content/70 hover:text-primary transition-colors flex items-center gap-2 shrink-0"
              >
                View all categories
                <Arrow className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6" data-stagger>
              {categories.length === 0 && (
                <div className="md:col-span-3 rounded-2xl border border-dashed hairline p-12 text-center text-base-content/60">
                  No categories yet.
                </div>
              )}
              {categories.map((c) => (
                <article
                  key={c.slug}
                  className="card bg-base-100 border hairline rounded-2xl hover:border-primary/40 transition-colors group overflow-hidden cursor-target"
                  data-stagger-item
                >
                  <div className="card-body p-0">
                    {c.imageUrl && (
                      <div className="w-full h-40 overflow-hidden bg-base-200">
                        <CategoryImage
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-7">
                      <div className="flex items-center justify-between mb-5">
                        <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 px-2.5 py-1 rounded border hairline">
                          {(c.platform ?? c.name).slice(0, 12)}
                        </span>
                        <span className="font-mono text-[10px] text-base-content/35">
                          {c.productCount} item{c.productCount === 1 ? "" : "s"}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-semibold mb-2">
                        {c.name}
                      </h3>
                      <p className="text-base-content/55 text-sm leading-relaxed mb-6">
                        {c.description ??
                          "Digital codes delivered as plain text over WhatsApp."}
                      </p>

                      {c.labels.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {c.labels.map((label, i) => (
                            <span
                              key={label}
                              className={`badge badge-sm font-mono ${
                                i === c.labels.length - 1
                                  ? "bg-primary/15 border border-primary/30 text-primary"
                                  : "bg-base-200 border hairline text-base-content/70"
                              }`}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="card-actions mt-auto pt-5 border-t hairline">
                        <Link
                          href={`/category/${c.slug}`}
                          className="font-mono text-sm text-base-content/80 group-hover:text-primary transition-colors flex items-center gap-2"
                        >
                          Browse {c.name}
                          <Arrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CHECKOUT / SIGNATURE */}
        <section id="checkout" className="py-28 lg:py-40 border-t hairline relative overflow-hidden scroll-mt-20">
          <div
            className="absolute top-1/2 right-0 w-[700px] h-[700px] rounded-full pointer-events-none opacity-50 -translate-y-1/2 translate-x-1/3"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--color-primary) 11%, transparent), transparent 65%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-6" data-reveal>
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-primary/80 mb-6 flex items-center gap-3">
                  <span className="inline-block w-6 h-px bg-primary/60" />
                  Checkout, reimagined
                </div>
                <h2 className="font-display font-semibold text-4xl lg:text-[3.4rem] leading-[1.05] tracking-tight mb-7 cursor-target">
                  Your cart isn&apos;t a modal.
                  <br />
                  It&apos;s a message you can read.
                </h2>
                <p className="text-base-content/65 text-lg leading-relaxed mb-8">
                  No &apos;proceed to checkout&apos; button. No billing-address
                  form. No 3-D Secure redirect. Your order is a plain WhatsApp
                  message — every line visible, editable before you send, read by
                  a person on the other end.
                </p>

                <div className="space-y-3 mb-10">
                  {[
                    "No account creation — your phone number is your identity.",
                    "No saved cards, no data-breach surface to speak of.",
                    "Pay the person directly — they confirm receipt, codes land in chat.",
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-3 text-base-content/75">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5 text-primary mt-0.5 shrink-0">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary rounded-md gap-2.5 font-medium normal-case"
                >
                  <WhatsAppGlyph className="w-4 h-4" />
                  Send an order
                </a>
              </div>

              {/* Phone mockup (decorative) */}
              <div className="lg:col-span-6">
                <div className="phone-frame max-w-[360px] mx-auto" data-reveal>
                  <div className="phone-screen">
                    <div className="flex items-center justify-between px-6 py-2 text-[10px] font-mono text-base-content/50">
                      <span>9:41</span>
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                          <path d="M2 22h20V2L2 22z" />
                        </svg>
                        <span>96%</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 border-b hairline bg-base-200/50">
                      <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                        <span className="font-display font-bold text-primary text-sm">
                          {settings.storeName.slice(0, 1).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-sm">
                          {settings.storeName}
                        </div>
                        <div className="text-[10px] text-success font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" />
                          online · typically &lt;5m
                        </div>
                      </div>
                      <WhatsAppGlyph className="w-4 h-4 text-success/80" />
                    </div>

                    <div className="chat-bg p-4 space-y-2.5 min-h-[440px]">
                      <div className="text-center my-3" data-bubble>
                        <span className="font-mono text-[10px] text-base-content/35 bg-base-200/60 px-3 py-1 rounded-full">
                          Today
                        </span>
                      </div>

                      <div className="flex" data-bubble>
                        <div className="bubble-in rounded-2xl rounded-tl-md px-3.5 py-2.5 max-w-[78%] text-sm">
                          Hey — what can I grab for you?
                        </div>
                      </div>

                      {[
                        { t: "2× Steam Wallet $20", p: "$40.00" },
                        { t: "1× Xbox Gift Card $15", p: "$15.00" },
                        { t: "1× Cyberpunk 2077 PC key", p: "$20.00" },
                      ].map((m) => (
                        <div className="flex justify-end" data-bubble key={m.t}>
                          <div className="bubble-out rounded-2xl rounded-tr-md px-3.5 py-2.5 max-w-[78%] text-sm font-mono">
                            {m.t}
                            <div className="text-[10px] text-base-content/45 mt-0.5">
                              {m.p}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="flex" data-bubble>
                        <div className="bubble-in rounded-2xl rounded-tl-md px-3.5 py-3 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 live-dot" />
                          <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 live-dot" style={{ animationDelay: "0.2s" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-base-content/40 live-dot" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>

                      <div className="flex" data-bubble data-bubble-total>
                        <div className="bubble-total rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
                          <div className="text-[10px] uppercase tracking-[0.15em] font-mono opacity-70 mb-1">
                            Total · 4 items
                          </div>
                          <div className="font-display text-3xl font-bold leading-none mb-1.5">
                            $75.00
                          </div>
                          <div className="text-xs opacity-85 leading-relaxed">
                            Confirm and I&apos;ll send the codes here. Pay when
                            you receive them.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2.5 border-t hairline bg-base-200/50">
                      <div className="flex-1 bg-base-100 rounded-full px-4 py-2 text-xs text-base-content/40 font-mono border hairline">
                        Type a message…
                      </div>
                      <span className="w-9 h-9 rounded-full bg-primary text-primary-content flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M3 20.5L21 12 3 3.5v7l13 1.5-13 1.5v7z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6 font-mono text-[11px] text-base-content/40 uppercase tracking-wider">
                  ↑ assembled as you scroll
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
