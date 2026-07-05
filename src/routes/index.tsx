import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  Layout,
  Code2,
  Presentation,
  Palette,
  Plus,
  Minus,
  Mail,
  Calendar,
  MapPin,
} from "lucide-react";
import heroImg from "@/assets/hero-landscape.jpg";
import projectNova from "@/assets/project-nova.jpg";
import projectPulse from "@/assets/project-pulse.jpg";
import projectAtlas from "@/assets/project-atlas.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} as const;

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: Array<[string, string]> = [
    ["Services", "#services"],
    ["Work", "#work"],
    ["Process", "#process"],
    ["Tools", "#tools"],
    ["FAQ", "#faq"],
    ["Contact", "#contact"],
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent"
          }`}
        >
          <a href="#" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-lime" />
            UPRISER
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  className="relative transition-colors hover:text-foreground after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            Book a Call
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </nav>
      </div>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const trust = ["Brand Identity", "Product Design", "Framer & Webflow", "Custom Development", "Pitch Decks"];

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden pt-32 pb-24">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <motion.img
          src={heroImg}
          alt="Mountain landscape at dawn"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </motion.div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-foreground/80"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
            Design. Build. Launch.
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.02] text-foreground max-w-5xl"
          >
            Design and development partner for{" "}
            <span className="italic font-normal text-foreground/70">ambitious startups</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            We help founders build brands, products, websites, and investor-ready stories that move businesses forward.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              Book a Call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#work"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5"
            >
              View Our Work
            </a>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            {trust.map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-lime-foreground bg-lime rounded-full p-0.5" strokeWidth={3} />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

const services = [
  {
    icon: Palette,
    title: "Brand Identity",
    body: "Build a memorable brand with strategy, visual identity, messaging, and design systems that create trust.",
  },
  {
    icon: Layout,
    title: "Product Design",
    body: "Design intuitive digital products that users love and businesses can scale.",
  },
  {
    icon: Sparkles,
    title: "Framer & Webflow",
    body: "High-performance marketing websites built for speed, flexibility, and conversions.",
  },
  {
    icon: Code2,
    title: "Custom Development",
    body: "Custom web applications and digital experiences built using modern technologies.",
  },
  {
    icon: Presentation,
    title: "Pitch Deck Design",
    body: "Clear, compelling investor presentations that help founders communicate their vision.",
  },
];

function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-widest text-muted-foreground">
            Services
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.05] text-foreground"
          >
            Everything you need to launch and grow
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground max-w-xl">
            From your first idea to your next funding round, we help you create experiences people remember.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((s, i) => {
            const Icon = s.icon;
            const featured = i === 0;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] ${
                  featured ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors group-hover:bg-lime">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl md:text-3xl font-semibold text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-md">{s.body}</p>
                <div className="mt-8 inline-flex items-center gap-1.5 text-sm text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

const projects = [
  {
    no: "01",
    name: "Nova AI",
    tags: ["Brand identity", "Website design", "Framer"],
    desc: "An AI workflow platform that needed a premium brand and launch-ready website.",
    img: projectNova,
  },
  {
    no: "02",
    name: "Pulse Health",
    tags: ["Product design", "Webflow"],
    desc: "A healthcare startup simplifying patient engagement through digital experiences.",
    img: projectPulse,
  },
  {
    no: "03",
    name: "Atlas Ventures",
    tags: ["Brand identity", "Investor deck"],
    desc: "A venture-backed startup preparing for fundraising and market expansion.",
    img: projectAtlas,
  },
];

function Work() {
  return (
    <section id="work" className="relative py-28 md:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <motion.p variants={fadeUp} className="text-sm uppercase tracking-widest text-muted-foreground">
              Selected Work
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.05]">
              A few we're proud of
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-md">
            Helping startups look credible, launch faster, and grow confidently.
          </motion.p>
        </motion.div>

        <div className="mt-16 space-y-6">
          {projects.map((p, i) => (
            <motion.a
              href="#"
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 rounded-3xl border border-border bg-card p-4 md:p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <div className="md:col-span-7 relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/10] bg-muted">
                <motion.img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-5 flex flex-col justify-between p-4 md:p-6">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Project {p.no}</span>
                    <span>2025</span>
                  </div>
                  <h3 className="mt-6 text-3xl md:text-4xl font-semibold text-foreground">{p.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  View Case Study
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { no: "01", title: "Discover", body: "We learn about your business, goals, users, and challenges." },
  { no: "02", title: "Define", body: "We create a roadmap, align priorities, and establish direction." },
  { no: "03", title: "Design & Build", body: "We design, iterate, and develop the solution." },
  { no: "04", title: "Launch & Support", body: "We help launch confidently and continue improving after release." },
];

function Process() {
  return (
    <section id="process" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-widest text-muted-foreground">
            How we work
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.05]">
            Simple process. Clear outcomes.
          </motion.h2>
        </motion.div>

        <div className="mt-16 relative">
          <div className="absolute left-0 right-0 top-8 h-px bg-border hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.no}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <span className="relative z-10 inline-flex h-4 w-4 items-center justify-center rounded-full bg-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                  </span>
                  <span className="text-sm text-muted-foreground tabular-nums">{s.no}</span>
                </div>
                <h3 className="mt-8 text-2xl md:text-3xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const toolCategories = [
  { cat: "Design", items: ["Figma", "Adobe CS", "Spline", "Rive"] },
  { cat: "Build", items: ["Framer", "Webflow", "React", "Next.js"] },
  { cat: "AI", items: ["OpenAI", "Claude", "Cursor", "Perplexity"] },
  { cat: "Automation", items: ["n8n", "Make", "Zapier"] },
  { cat: "Project", items: ["Notion", "Linear", "Slack"] },
  { cat: "Analytics", items: ["Google Analytics", "Hotjar"] },
];

function Tools() {
  return (
    <section id="tools" className="relative py-28 md:py-40 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-widest text-muted-foreground">
            Toolkit
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.05]">
            Built with modern tools
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {toolCategories.map((c) => (
            <motion.div
              key={c.cat}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-soft)]"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.cat}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-foreground transition-colors hover:bg-lime hover:border-lime"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "What types of clients do you work with?", a: "We primarily work with startups, founders, SaaS companies, and growing businesses." },
  { q: "Do you only work with funded startups?", a: "No. We work with businesses at different stages, from early ideas to established companies." },
  { q: "Can you handle both design and development?", a: "Yes. We provide end-to-end support from strategy and design through development and launch." },
  { q: "Do you work with Framer and Webflow?", a: "Absolutely. We build high-quality websites in both platforms depending on your needs." },
  { q: "How much does a project cost?", a: "Every project is different. Most engagements start from a few thousand dollars and scale based on scope. Book a call and we'll provide a tailored estimate." },
  { q: "How long does a project take?", a: "Most projects take between 2–8 weeks depending on complexity." },
  { q: "Can you help with investor pitch decks?", a: "Yes. We help founders craft clear, persuasive decks for fundraising and presentations." },
  { q: "Do you offer ongoing support?", a: "Yes. We offer post-launch support and long-term partnerships." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-widest text-muted-foreground">
            FAQ
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 text-4xl md:text-6xl font-semibold leading-[1.05]">
            Frequently asked questions
          </motion.h2>
        </motion.div>

        <div className="mt-14 divide-y divide-border rounded-3xl border border-border bg-card overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 md:px-8 py-6 text-left transition-colors hover:bg-secondary/40"
                >
                  <span className="text-lg md:text-xl font-medium text-foreground">{f.q}</span>
                  <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 md:px-8 pb-6 text-muted-foreground leading-relaxed max-w-2xl">{f.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-foreground text-primary-foreground px-6 py-20 md:px-16 md:py-32"
        >
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-lime/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-lime/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/60">Let's talk</p>
            <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05]">
              Tell us what you're building
            </h2>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed">
              Whether you're launching a startup, redesigning a product, or preparing for your next funding round, we'd love to hear your story.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-medium text-lime-foreground transition-all hover:-translate-y-0.5"
              >
                <Calendar className="h-4 w-4" />
                Book a Call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="mailto:hello@upriser.studio"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                <Mail className="h-4 w-4" />
                Send an Email
              </a>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/50">Typically responds within 24 hours.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <span className="inline-block h-2 w-2 rounded-full bg-lime" />
              UPRISER
            </div>
            <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
              Designing brands, products, and digital experiences for ambitious companies.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> Gulmarg, Kashmir
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Quick Links</p>
            <ul className="mt-5 space-y-3 text-foreground">
              {["Services", "Work", "Process", "FAQ", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="hover:text-muted-foreground transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Social</p>
            <ul className="mt-5 space-y-3 text-foreground">
              {["Dribbble", "LinkedIn", "X (Twitter)"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-muted-foreground transition-colors inline-flex items-center gap-1">
                    {l} <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
            <a
              href="mailto:hello@upriser.studio"
              className="mt-5 inline-block text-foreground hover:text-muted-foreground transition-colors"
            >
              hello@upriser.studio
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Upriser. All rights reserved.</p>
          <p>Made with care in Kashmir.</p>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Services />
      <Work />
      <Process />
      <Tools />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
