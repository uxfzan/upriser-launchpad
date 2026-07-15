
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import projectNova from "@/assets/project-nova.jpg";
import projectPulse from "@/assets/project-pulse.jpg";
import projectAtlas from "@/assets/project-atlas.jpg";
import projectZoonRun from "@/assets/project-zoonrun.jpg";
import projectSultanWarriors from "@/assets/project-sultan-warriors.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const EASE = [0.22, 1, 0.36, 1] as const;
const CALENDLY_URL = "https://calendly.com/upriserstudio/intro-call";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
} as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
} as const;

/* -------------------------------------------------------------------------- */
/*                                     NAV                                    */
/* -------------------------------------------------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const hero = document.getElementById("hero");
      if (hero) {
        setOnHero(y < hero.offsetHeight - 80);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links: Array<[string, string]> = [
    ["Services", "services"],
    ["Work", "work"],
    ["Process", "process"],
    ["Tools", "tools"],
    ["FAQ", "faq"],
    ["Contact", "contact"],
  ];

  const light = onHero;
  const textCls = light ? "text-white" : "text-ink";
  const mutedCls = light ? "text-white/70 hover:text-white" : "text-subtle hover:text-ink";
  const ctaCls = light
    ? "border-white/25 text-white hover:bg-white hover:text-brand"
    : "border-ink/15 text-ink hover:bg-ink hover:text-white";
  const border = scrolled
    ? light
      ? "border-b border-white/10 bg-brand/60 backdrop-blur-md"
      : "border-b border-hairline bg-white/80 backdrop-blur-md"
    : "border-b border-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${border}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <a href="#hero" className={`text-[17px] font-medium tracking-tight ${textCls}`}>
          Upriser<span className={light ? "text-white/50" : "text-subtle"}>®</span>
        </a>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-9 text-[15px]">
            {links.map(([label, id]) => (
              <li key={label}>
                <a href={`#${id}`} className={`transition-colors ${mutedCls}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={CALENDLY_URL}
          target="_blank"
          className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[14px] font-medium transition-colors ${ctaCls} ${textCls}`}
        >
          Book a Call
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*                          ELASTIC DIGITAL FABRIC                            */
/* -------------------------------------------------------------------------- */
function ElasticFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    const mouse = { x: -9999, y: -9999, active: false };

    type P = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };
    let cols = 0, rows = 0, spacing = 0;
    let points: P[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      spacing = Math.max(38, Math.min(56, W / 30));
      cols = Math.ceil(W / spacing) + 2;
      rows = Math.ceil(H / spacing) + 2;
      points = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const ox = i * spacing - spacing;
          const oy = j * spacing - spacing;
          points.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
        }
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const radius = 160;
    const stiffness = 0.06;
    const damping = 0.82;
    const pull = 0.22;

    let raf = 0;
    const tick = () => {
      // Update
      if (!reduce) {
        for (const p of points) {
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < radius * radius) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / radius) * pull;
              // Pull toward mouse (elastic drape)
              p.vx -= (dx / d) * f * 6;
              p.vy -= (dy / d) * f * 6;
            }
          }
          // Spring back to origin
          p.vx += (p.ox - p.x) * stiffness;
          p.vy += (p.oy - p.y) * stiffness;
          p.vx *= damping;
          p.vy *= damping;
          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // Draw
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.09)";

      // horizontal lines
      for (let j = 0; j < rows; j++) {
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
          const p = points[j * cols + i];
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      // vertical lines
      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          const p = points[j * cols + i];
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // dots
      for (const p of points) {
        const dx = p.x - p.ox;
        const dy = p.y - p.oy;
        const disp = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 40);
        const a = 0.15 + disp * 0.55;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 + disp * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

/* -------------------------------------------------------------------------- */
/*                                   HERO                                     */
/* -------------------------------------------------------------------------- */
function Hero() {
  return (
    <section id="hero" className="relative min-h-[92vh] w-full overflow-hidden bg-brand text-white">
      <ElasticFabric />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,20,52,0.55)_100%)]" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-[1400px] flex-col justify-between px-6 pb-16 pt-40 md:px-10 md:pb-24 md:pt-48">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-[1100px]"
        >
          <motion.div variants={fadeUp} className="mb-10 flex items-center gap-3 text-[13px] uppercase tracking-[0.22em] text-white/60">
            <span className="h-px w-8 bg-white/40" />
            Design & Development Studio
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[52px] font-medium leading-[1.02] tracking-[-0.03em] text-white sm:text-[64px] md:text-[80px] lg:text-[96px]"
          >
            Design and build<br />
            partner for<br />
            <span className="italic font-light text-white/85">growing businesses.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-10 max-w-2xl text-[19px] leading-[1.55] text-white/70 md:text-[20px]"
          >
            We help ambitious companies build stronger brands, better digital products,
            and websites that drive growth.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[15px] font-medium text-brand transition-transform hover:-translate-y-0.5"
            >
              Book a Call
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Our Services
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-24 flex items-end justify-between text-[13px] text-white/50"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Available for new projects — 2026
          </div>
          <div className="hidden md:block">Scroll to explore</div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SECTION                                   */
/* -------------------------------------------------------------------------- */
function SectionHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto mb-20 flex max-w-3xl flex-col items-center text-center">
      <div className="flex items-center gap-3 text-[13px] uppercase tracking-[0.22em] text-subtle">
        <span className="h-px w-6 bg-hairline" />
        {eyebrow}
        <span className="h-px w-6 bg-hairline" />
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mt-6 text-[40px] font-medium leading-[1.05] tracking-[-0.025em] text-ink sm:text-[48px] md:text-[56px]"
      >
        {title}
      </motion.h2>
      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="mt-6 max-w-2xl text-[19px] leading-[1.55] text-subtle"
        >
          {intro}
        </motion.p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  SERVICES                                  */
/* -------------------------------------------------------------------------- */
const SERVICES = [
  {
    title: "Brand Identity",
    description:
      "We craft identities that feel unmistakably yours — clear positioning, considered systems, and visual language that scales across every touchpoint.",
    items: ["Brand Strategy", "Visual Identity", "Logo Systems", "Brand Guidelines", "Naming"],
  },
  {
    title: "Product Design",
    description:
      "From first sketch to shipped product, we design digital experiences that are intuitive to use and a pleasure to look at.",
    items: ["UX Research", "Interaction Design", "Design Systems", "Prototyping", "Mobile & Web Apps"],
  },
  {
    title: "Framer & Webflow Development",
    description:
      "Marketing sites built on the tools your team can actually use — fast to launch, easy to update, and finished to a studio standard.",
    items: ["Framer Sites", "Webflow Sites", "CMS Setup", "SEO Foundations", "Handover & Training"],
  },
  {
    title: "Custom Development",
    description:
      "When off-the-shelf tools stop scaling, we build production-grade web apps with modern stacks and long-term maintainability in mind.",
    items: ["Web Applications", "React & Next.js", "API Integrations", "Performance", "Ongoing Support"],
  },
  {
    title: "Pitch Deck Design",
    description:
      "Investor-ready decks that tell a sharper story — clear narrative, considered typography, and visuals that earn attention in the room.",
    items: ["Narrative", "Deck Design", "Data Visualisation", "Investor Materials"],
  },
] as const;

function Services() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" className="border-t border-hairline bg-transparent py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Services"
          title="What we do."
          intro="A focused set of services for founders and product teams — brand, product, and web, delivered together."
        />

        <div className="mt-4 border-t border-hairline">
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.title} className="border-b border-hairline">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-center justify-between gap-8 py-8 text-left md:py-10"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-6 md:gap-10">
                    <span className="w-8 font-mono text-[13px] text-subtle md:w-12 md:text-[14px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[28px] font-medium tracking-[-0.02em] text-ink transition-colors group-hover:text-brand sm:text-[36px] md:text-[44px]">
                      {s.title}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="shrink-0 text-subtle"
                  >
                    <Plus className="h-6 w-6 md:h-7 md:w-7" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-10 pb-12 md:grid-cols-12 md:gap-16 md:pl-[calc(3rem+2.5rem)]">
                        <p className="text-[18px] leading-[1.6] text-subtle md:col-span-6 md:text-[19px]">
                          {s.description}
                        </p>
                        <ul className="grid gap-3 md:col-span-6 md:grid-cols-2">
                          {s.items.map((it) => (
                            <li key={it} className="flex items-center gap-3 text-[16px] text-ink">
                              <span className="text-brand">✦</span>
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    WORK                                    */
/* -------------------------------------------------------------------------- */
const PROJECTS = [
  // { title: "Nova AI", tag: "Brand & Product", year: "2025", img: projectNova, meta: "AI writing platform" },
  // { title: "Pulse Health", tag: "Product Design", year: "2025", img: projectPulse, meta: "Digital health app" },
  // { title: "Atlas Ventures", tag: "Brand & Web", year: "2024", img: projectAtlas, meta: "Early-stage VC firm" },
  {
    title: "Zoon Run",
    tag: "Brand & Web Development",
    year: "2026",
    img: projectZoonRun,
    meta: "Marathon festival — Baramulla, Kashmir",
    url: "https://zoonrun.in",
  },
  {
    title: "Sultan Warriors",
    tag: "Brand & Web Development",
    year: "2026",
    img: projectSultanWarriors,
    meta: "Cricket team — Baramulla, Kashmir",
    url: "https://sultanwarriors.com",
  },
] as const;

function ProjectCard({ p, i }: { p: typeof PROJECTS[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const href = "url" in p && p.url ? p.url : "#contact";
  const isExternal = href.startsWith("http");

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: EASE, delay: i * 0.05 }}
      className="group"
    >
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block overflow-hidden rounded-2xl border border-hairline bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(16,54,125,0.25)] md:p-5"
      >
        <div className="relative overflow-hidden rounded-xl bg-[#f5f5f5]" style={{ aspectRatio: "16/9" }}>
          <motion.img
            src={p.img}
            alt={p.title}
            style={{ y }}
            className="absolute inset-0 h-[112%] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex items-baseline justify-between gap-8 px-2 pb-2 pt-6">
          <div>
            <div className="flex items-center gap-4 text-[12px] uppercase tracking-[0.18em] text-subtle">
              <span>{p.tag}</span>
              <span className="h-px w-4 bg-hairline" />
              <span>{p.year}</span>
            </div>
            <h3 className="mt-3 text-[24px] font-medium tracking-[-0.02em] text-ink md:text-[26px]">
              {p.title}
            </h3>
            <p className="mt-1 text-[15px] text-subtle">{p.meta}</p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
        </div>
      </a>
    </motion.article>
  );
}

function Work() {
  return (
    <section id="work" className="border-t border-hairline bg-transparent py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Selected Work"
          title="Recent projects."
          intro="A few of the teams we've partnered with — from early-stage brands to funded startups shipping to real users."
        />
        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  PROCESS                                   */
/* -------------------------------------------------------------------------- */
const STEPS = [
  {
    title: "Discover",
    body: "We start by listening — understanding your business, users, and the outcomes that actually matter.",
    detail: "Stakeholder conversations, product audits, and market context so we start with a shared picture of reality.",
  },
  {
    title: "Define",
    body: "We turn research into direction: sharp strategy, clear scope, and a shared point of view.",
    detail: "Positioning, priorities, and a written brief that keeps design and engineering aligned from day one.",
  },
  {
    title: "Design & Build",
    body: "We move in tight loops between design and code, shipping the work in visible increments.",
    detail: "Weekly reviews, working prototypes, and production-ready code — never a slide deck standing in for the product.",
  },
  {
    title: "Launch & Grow",
    body: "We ship confidently, then stay close — iterating on real feedback once it's in the world.",
    detail: "Launch support, analytics, and follow-on iterations informed by how people actually use what we built.",
  },
] as const;

function ProcessCard({
  step,
  index,
  onActive,
}: {
  step: (typeof STEPS)[number];
  index: number;
  onActive: (i: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 75%", "end 35%"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (v > 0.2 && v < 0.9) onActive(index);
    });
  }, [scrollYProgress, index, onActive]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="group relative overflow-hidden rounded-[28px] border border-hairline bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_50px_-30px_rgba(16,54,125,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(16,54,125,0.28)] md:p-12"
    >
      {/* ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand/[0.06] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
      />
      {/* corner index chip */}
      <div className="relative mb-8 flex items-center justify-between">
        <div className="inline-flex items-center gap-3 rounded-full border border-hairline bg-white/70 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-subtle backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Phase {String(index + 1).padStart(2, "0")}
        </div>
        <div className="font-display text-[44px] font-medium leading-none tracking-[-0.04em] text-hairline transition-colors duration-500 group-hover:text-brand/50 md:text-[56px]">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="relative">
        <h3 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[38px]">
          {step.title}
        </h3>
        <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-ink/75 md:text-[18px]">{step.body}</p>
        <div className="mt-6 h-px w-12 bg-hairline transition-colors duration-500 group-hover:bg-brand/40" />
        <p className="mt-6 max-w-xl text-[15px] leading-[1.65] text-subtle">{step.detail}</p>
      </div>
    </motion.div>
  );
}

function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 55%", "end 45%"],
  });
  const [active, setActive] = useState(0);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" ref={sectionRef} className="border-t border-hairline bg-transparent py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="How We Work"
          title="A calm, considered process."
          intro="Four phases that keep the work moving without the noise."
        />

        <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* sticky left panel — desktop only */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 self-start">
              <div className="text-[12px] uppercase tracking-[0.18em] text-subtle">Process</div>
              <div className="mt-6 flex items-baseline gap-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="font-display text-[72px] font-medium leading-none tracking-[-0.04em] text-ink md:text-[96px]"
                  >
                    {String(active + 1).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[14px] text-subtle">/ {String(STEPS.length).padStart(2, "0")}</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={STEPS[active].title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="mt-4 text-[28px] font-medium tracking-[-0.02em] text-ink md:text-[32px]"
                >
                  {STEPS[active].title}
                </motion.h3>
              </AnimatePresence>

              <div className="mt-8 h-[2px] w-full max-w-[240px] overflow-hidden rounded-full bg-hairline">
                <motion.div style={{ width: progress }} className="h-full bg-brand" />
              </div>

              <ul className="mt-6 space-y-2">
                {STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    className={`flex items-center gap-3 text-[13px] transition-colors duration-300 ${i === active ? "text-ink" : "text-subtle/70"
                      }`}
                  >
                    <span
                      className={`h-[6px] w-[6px] rounded-full transition-colors duration-300 ${i <= active ? "bg-brand" : "bg-hairline"
                        }`}
                    />
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* right cards */}
          <div className="flex flex-col gap-6 md:gap-8 lg:col-span-8">
            {STEPS.map((s, i) => (
              <ProcessCard key={s.title} step={s} index={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                TESTIMONIALS                                */
/* -------------------------------------------------------------------------- */
const TESTIMONIALS = [
  {
    quote:
      "Upriser felt less like an agency and more like a founding design partner. They shaped our brand, product, and story with the same care we bring to the work.",
    name: "Ananya Rao",
    role: "Co-founder & CEO",
    company: "Nova Health",
  },
  {
    quote:
      "The clarity of thinking is what stood out. Every review moved the product forward — no fluff, no theatre, just the right decision at the right time.",
    name: "Marcus Bell",
    role: "Head of Product",
    company: "Pulse Finance",
  },
  {
    quote:
      "They shipped a website and identity system that finally matches how ambitious we actually are. Our conversion doubled in the first six weeks.",
    name: "Sofia Lindqvist",
    role: "Founder",
    company: "Atlas Studio",
  },
  {
    quote:
      "Rare combination of taste, speed, and engineering rigour. Upriser is now the first team we call whenever something important needs to be built well.",
    name: "Tufail Anayat",
    role: "CTO",
    company: "ZoonRun",
  },
] as const;

function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIALS.length;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [paused, count]);

  const t = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      className="border-t border-hairline bg-transparent py-28 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Testimonials"
          title="Kind words from founders."
          intro="A few of the teams we've had the privilege of building alongside."
        />

        <div className="relative mt-16 md:mt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-6 -top-10 font-display text-[220px] font-medium leading-none tracking-[-0.05em] text-hairline/70 md:text-[320px]"
          >
            "
          </div>

          <div className="relative mx-auto min-h-[280px] max-w-4xl md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative"
              >
                <p className="text-[26px] font-medium leading-[1.35] tracking-[-0.015em] text-ink md:text-[38px]">
                  {t.quote}
                </p>
                <footer className="mt-10 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-[14px] font-medium text-white">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[15px] font-medium text-ink">{t.name}</div>
                    <div className="text-[13px] text-subtle">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-12 flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="group h-2 overflow-hidden rounded-full bg-hairline transition-all duration-500"
                  style={{ width: i === index ? 40 : 16 }}
                >
                  <span
                    className={`block h-full origin-left rounded-full bg-brand transition-transform duration-[6000ms] ease-linear ${i === index && !paused ? "scale-x-100" : "scale-x-0"
                      }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 font-mono text-[13px] text-subtle">
              <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(count).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   TOOLS                                    */
/* -------------------------------------------------------------------------- */
type Tool = { name: string; slug: string; color: string; logo?: string };
// Adobe brand marks were removed from Simple Icons for trademark reasons;
// we source them from svgl.app which hosts official-style SVGs.
const SVGL = (n: string) => `https://svgl.app/library/${n}.svg`;
const TOOL_GROUPS: Array<{ title: string; tools: Tool[] }> = [
  {
    title: "Design",
    tools: [
      { name: "Figma", slug: "figma", color: "F24E1E" },
      { name: "Framer", slug: "framer", color: "0055FF" },
      { name: "Photoshop", slug: "photoshop", color: "31A8FF", logo: SVGL("photoshop") },
      { name: "Illustrator", slug: "illustrator", color: "FF9A00", logo: SVGL("illustrator") },
      { name: "Sketch", slug: "sketch", color: "F7B500" },
      { name: "After Effects", slug: "after-effects", color: "9999FF", logo: SVGL("after-effects") },
    ],
  },
  {
    title: "Build",
    tools: [
      { name: "React", slug: "react", color: "61DAFB" },
      { name: "Next.js", slug: "nextdotjs", color: "111111" },
      { name: "Webflow", slug: "webflow", color: "146EF5" },
      { name: "Tailwind", slug: "tailwindcss", color: "06B6D4" },
      { name: "TypeScript", slug: "typescript", color: "3178C6" },
      { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
    ],
  },
  {
    title: "Automation",
    tools: [
      { name: "Zapier", slug: "zapier", color: "FF4A00" },
      { name: "Make", slug: "make", color: "6D00CC" },
      { name: "n8n", slug: "n8n", color: "EA4B71" },
      { name: "Airtable", slug: "airtable", color: "FCB400" },
      { name: "Retool", slug: "retool", color: "3D3D3D" },
    ],
  },
];

function ToolLogo({ t }: { t: Tool }) {
  const primary = t.logo ?? `https://cdn.simpleicons.org/${t.slug}/${t.color}`;
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold text-white"
        style={{ backgroundColor: `#${t.color}` }}
        aria-label={t.name}
      >
        {t.name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={t.name}
      width={28}
      height={28}
      className="h-7 w-7 opacity-90 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      loading="eager"
      decoding="async"
      // @ts-expect-error - valid HTML attribute, not yet in React types everywhere
      fetchpriority="high"
      onError={() => {
        if (t.logo && src === t.logo) {
          setSrc(`https://cdn.simpleicons.org/${t.slug}/${t.color}`);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}

function ToolCard({ t }: { t: Tool }) {
  return (
    <div className="group mx-3 flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-hairline bg-white/70 px-4 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-300 hover:border-brand/40 hover:bg-brand/[0.04] hover:shadow-[0_12px_30px_-20px_rgba(16,54,125,0.18)]">
      <ToolLogo t={t} />
      <span className="text-[13px] font-medium text-ink/80 transition-colors group-hover:text-ink">
        {t.name}
      </span>
    </div>
  );
}

function ToolMarquee({ tools, reverse = false }: { tools: Tool[]; reverse?: boolean }) {
  const [paused, setPaused] = useState(false);
  const loop = useMemo(() => [...tools, ...tools, ...tools], [tools]);
  const duration = Math.max(18, tools.length * 4);

  return (
    <div
      className="group/marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex w-max py-2"
        animate={{ x: reverse ? ["-33.333%", "0%"] : ["0%", "-33.333%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {loop.map((t, i) => (
          <ToolCard key={`${t.name}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

function Tools() {
  return (
    <section id="tools" className="border-t border-hairline bg-transparent py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader
          eyebrow="Toolkit"
          title="Tools we work with."
          intro="A pragmatic stack — chosen for craft, speed, and the teams we hand off to."
        />

        <div className="space-y-14">
          {TOOL_GROUPS.map((g, gi) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="mx-auto mb-5 flex max-w-[1400px] items-baseline justify-between px-1">
                <h3 className="text-[13px] uppercase tracking-[0.22em] text-subtle">{g.title}</h3>
                <span className="font-mono text-[13px] text-subtle">{String(gi + 1).padStart(2, "0")}</span>
              </div>
              <ToolMarquee tools={g.tools} reverse={gi % 2 === 1} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* -------------------------------------------------------------------------- */
/*                                    FAQ                                     */
/* -------------------------------------------------------------------------- */
const FAQS = [
  { q: "How long does a typical project take?", a: "Most brand and website projects run 4–8 weeks. Product design and custom development engagements usually span 8–16 weeks, depending on scope. We'll give you an honest timeline before we start." },
  { q: "How do you price your work?", a: "We work on fixed-scope project pricing or monthly retainers. Every quote is transparent, tied to clear deliverables, and shared before any commitments are made." },
  { q: "Do you work with early-stage startups?", a: "Yes — a large part of our work is with pre-seed and seed-stage founders. We're used to moving quickly and making thoughtful trade-offs when the roadmap is still forming." },
  { q: "Can you work alongside our in-house team?", a: "Absolutely. We often collaborate with in-house designers, engineers, and founders. We'll shape our process around how your team already works." },
  { q: "What happens after launch?", a: "We stay close. Most clients continue with us on a lightweight retainer for iteration, improvements, and ongoing design and development support." },
] as const;

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="border-t border-hairline bg-transparent py-28 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeader eyebrow="FAQ" title="Common questions." />
        <div className="border-t border-hairline">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-hairline">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-8 py-7 text-left md:py-8"
                  aria-expanded={isOpen}
                >
                  <span className="text-[20px] font-medium tracking-[-0.01em] text-ink md:text-[22px]">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="shrink-0 text-subtle"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 text-[18px] leading-[1.65] text-subtle">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  CONTACT                                   */
/* -------------------------------------------------------------------------- */
function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-brand text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-32 md:px-10 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: EASE }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 text-[13px] uppercase tracking-[0.22em] text-white/60">
            <span className="h-px w-8 bg-white/40" />
            Let's Talk
          </div>
          <h2 className="mt-8 text-[44px] font-medium leading-[1.05] tracking-[-0.025em] text-white sm:text-[64px] md:text-[80px]">
            Have a project in mind?
          </h2>
          <p className="mt-8 max-w-xl text-[19px] leading-[1.55] text-white/70 md:text-[20px]">
            We'd love to hear about it. Send us a note or book an intro call —
            we usually reply within a day.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="mailto:upriserstudios@gmail.com"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[15px] font-medium text-brand transition-transform hover:-translate-y-0.5"
            >
              upriserstudios@gmail.com
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={CALENDLY_URL}
              target="_blank"
              className="inline-flex items-center gap-3 rounded-full border border-white/25 px-7 py-4 text-[15px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Book a Call
            </a>
          </div>
        </motion.div>

        <div className="mt-24 grid gap-10 border-t border-white/15 pt-12 text-[15px] text-white/60 md:grid-cols-4">
          <div>
            <div className="text-white">Upriser<span className="text-white/50">®</span></div>
            <p className="mt-2">Design & development studio</p>
          </div>
          <div>
            <div className="mb-3 text-[13px] uppercase tracking-[0.22em] text-white/40">Studio</div>
            <p>Remote — worldwide</p>
          </div>
          <div>
            <div className="mb-3 text-[13px] uppercase tracking-[0.22em] text-white/40">Contact</div>
            <p>upriserstudios@gmail.com</p>
          </div>
          <div>
            <div className="mb-3 text-[13px] uppercase tracking-[0.22em] text-white/40">Follow</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">Dribbble</a>
              <a href="https://www.linkedin.com/company/upriserstudio/" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between text-[13px] text-white/40">
          <div>© {new Date().getFullYear()} Upriser Studio</div>
          <div>All rights reserved</div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   LANDING                                  */
/* -------------------------------------------------------------------------- */
function Landing() {
  return (
    <main className="relative overflow-x-clip bg-background text-ink">
      {/* Ambient background — felt more than seen. Kept lightweight to avoid initial paint jank. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [transform:translateZ(0)]">
        <div className="absolute -top-40 left-1/2 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,54,125,0.05),transparent_70%)]" />
        <div className="absolute top-[55%] -left-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(16,54,125,0.04),transparent_70%)]" />
        <div className="absolute top-[80%] -right-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(255,154,0,0.035),transparent_70%)]" />
      </div>
      <Nav />
      <Hero />
      <Services />
      <Work />
      <Process />
      <Testimonials />
      <Tools />
      <FAQ />
      <Contact />
    </main>
  );
}
