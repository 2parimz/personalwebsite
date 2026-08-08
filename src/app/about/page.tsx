import type { Metadata } from "next";
import Link from "next/link";
import { about, site } from "@/content/site";
import { Frame } from "@/components/Frame";
import { Reveal } from "@/components/Reveal";
import { Squiggle } from "@/components/LineArt";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: `About — ${site.name}`,
  description: about.standfirst,
};

/** The long version: a full profile spread on its own page. */
export default function AboutPage() {
  return (
    <>
      <article className="mx-auto max-w-[1000px] px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <Reveal>
          <Link href="/" className="kicker link-underline text-fg/50">
            ← Back to the issue
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="kicker mt-10 text-fg/50">Full profile</p>
          <h1 className="display mt-4 text-[clamp(3rem,11vw,8rem)]">
            {site.name}
            <span className="italic">,</span> at length
          </h1>
          <Squiggle className="mt-5 h-4 w-48 text-accent" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 font-display text-2xl italic leading-snug sm:text-3xl">
            {about.standfirst}
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-10">
          <Reveal className="col-span-12 sm:col-span-5" y={36}>
            <Frame photo={about.portrait} sizes="(max-width: 640px) 90vw, 40vw" />
          </Reveal>

          <div className="col-span-12 sm:col-span-7">
            {about.columns.map((paragraph, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p className={`column mb-5 ${i === 0 ? "column--dropcap" : ""}`}>{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-6">
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="kicker text-fg/45">{fact.label}</dt>
                    <dd className="mt-1 text-sm">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {site.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="kicker link-underline"
                  >
                    {social.label} ↗
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
