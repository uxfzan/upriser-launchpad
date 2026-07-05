import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
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

/* -------------------------------------------------------------------------- */
/*                                     NAV                                    */
/* -------------------------------------------------------------------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["services", "work", "process", "tools", "faq", "contact"];
      const y = window.scrollY + 120;
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
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

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "pt-3" : "pt-6"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled
              ? "bg-white/70 backdrop-blur-xl border border-black/5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)]"
              : "bg-transparent"
          }`}
        >
          <a href="#" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-lime" />
            UPRISER
          </a>
          <ul className="hidden md:flex items-center gap-1 text-sm">
            {links.map(([label, id]) => (
              <li key={label}>
                <a
                  href={`#${id}`}
                  className={`relative px-3 py-1.5 rounded-full transition-colors ${
                    active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active === id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-secondary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{label}</span>
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

/* -------------------------------------------------------------------------- */
/*                          INTERACTIVE MESH GRADIENT                         */
/* -------------------------------------------------------------------------- */
function MeshGradient() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width);
      my.set((e.clientY - r.top) / r.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const b1x = useTransform(sx, [0, 1], ["10%", "35%"]);
  const b1y = useTransform(sy, [0, 1], ["5%", "25%"]);
  const b2x = useTransform(sx, [0, 1], ["70%", "50%"]);
  const b2y = useTransform(sy, [0, 1], ["55%", "35%"]);
  const b3x = useTransform(sx, [0, 1], ["30%", "55%"]);
  const b3y = useTransform(sy, [0, 1], ["70%", "55%"]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden bg-white">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ left: b1x, top: b1y }}
          className="absolute h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#a5f3fc,transparent_60%)]" />
        </motion.div>
        <motion.div
          style={{ left: b2x, top: b2y }}
          className="absolute h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#ddd6fe,transparent_60%)]" />
        </motion.div>
        <motion.div
          style={{ left: b3x, top: b3y }}
          className="absolute h-[45vw] w-[45vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[90px]"
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,#fbcfe8,transparent_60%)]" />
        </motion.div>
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[12%] h-[30vw] w-[30vw] rounded-full opacity-50 blur-[100px] bg-[radial-gradient(circle_at_center,#fde68a,transparent_60%)]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] bottom-[12%] h-[28vw] w-[28vw] rounded-full opacity-50 blur-[100px] bg-[radial-gradient(circle_at_center,#bef264,transparent_60%)]"
        />
      </motion.div>
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    HERO                                    */
/* -------------------------------------------------------------------------- */
function Hero() {
  const headlineLines = ["Design and development", "partner for", "ambitious startups"];

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden pt-32 pb-24 flex items-center">
      <MeshGradient />
      <div className="mx-auto max-w-6xl px-6 text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-foreground/80 bg-white/60 backdrop-blur-md border border-black/5"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
          Design. Build. Launch.
        </motion.div>

        <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.02] text-foreground max-w-5xl mx-auto">
          {headlineLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.35 + i * 0.12, ease: EASE }}
                className={`block ${i === 2 ? "italic font-normal text-foreground/70" : ""}`}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          We help founders build brands, products, websites, and investor-ready stories that move businesses forward.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 1.1 } } }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            variants={fadeUp}
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            Book a Call
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            variants={fadeUp}
            href="#work"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-foreground bg-white/70 backdrop-blur-md border border-black/5 transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            View Our Work
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                          ANIMATED SERVICE ICONS                            */
/* -------------------------------------------------------------------------- */
function AnimatedIcon({ type, active }: { type: string; active: boolean }) {
  const common = "h-full w-full";
  const stroke = "currentColor";
  if (type === "brand") {
    return (
      <svg viewBox="0 0 100 100" className={common} fill="none" stroke={stroke} strokeWidth="1.5">
        <motion.circle
          cx="50" cy="50" r="30"
          animate={active ? { r: [30, 34, 30] } : { r: 30 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50" cy="50" r="18"
          animate={active ? { r: [18, 14, 18] } : { r: 18 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle cx="50" cy="50" r="4" fill={stroke} />
      </svg>
    );
  }
  if (type === "product") {
    return (
      <svg viewBox="0 0 100 100" className={common} fill="none" stroke={stroke} strokeWidth="1.5">
        <rect x="20" y="20" width="60" height="60" rx="8" />
        <motion.line
          x1="20" y1="38" x2="80" y2="38"
          animate={active ? { x2: [80, 60, 80] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          x="30" y="48" width="20" height="6" rx="2" fill={stroke} opacity="0.6"
          animate={active ? { width: [20, 32, 20] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="30" y="60" width="40" height="4" rx="2" fill={stroke} opacity="0.3" />
      </svg>
    );
  }
  if (type === "framer") {
    return (
      <svg viewBox="0 0 100 100" className={common} fill="none" stroke={stroke} strokeWidth="1.5">
        <motion.path
          d="M25 25 L75 25 L50 50 L75 50 L50 75"
          animate={active ? { pathLength: [1, 0.4, 1] } : { pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }
  if (type === "code") {
    return (
      <svg viewBox="0 0 100 100" className={common} fill="none" stroke={stroke} strokeWidth="1.5">
        <motion.path
          d="M35 35 L20 50 L35 65"
          animate={active ? { x: [0, -4, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M65 35 L80 50 L65 65"
          animate={active ? { x: [0, 4, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          x1="55" y1="30" x2="45" y2="70"
          animate={active ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }
  if (type === "deck") {
    return (
      <svg viewBox="0 0 100 100" className={common} fill="none" stroke={stroke} strokeWidth="1.5">
        <rect x="18" y="24" width="64" height="44" rx="4" />
        <line x1="42" y1="68" x2="42" y2="80" />
        <line x1="58" y1="68" x2="58" y2="80" />
        <line x1="30" y1="80" x2="70" y2="80" />
        <motion.polyline
          points="28,58 40,46 52,52 72,34"
          animate={active ? { pathLength: [0, 1, 1], opacity: [0, 1, 1] } : { pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/*                                  SERVICES                                  */
/* -------------------------------------------------------------------------- */
const services = [
  {
    icon: "brand",
    fallback: Palette,
    title: "Brand Identity",
    desc: "Build a brand people remember and trust.",
    subs: ["Brand Strategy", "Visual Identity", "Logo Design", "Brand Guidelines", "Messaging", "Social Media Assets"],
  },
  {
    icon: "product",
    fallback: Layout,
    title: "Product Design",
    desc: "Design products that are intuitive, scalable, and user-focused.",
    subs: ["UX Design", "UI Design", "User Flows", "Wireframes", "Design Systems", "Product Audits"],
  },
  {
    icon: "framer",
    fallback: Sparkles,
    title: "Framer & Webflow Development",
    desc: "High-converting websites built for growth.",
    subs: ["Framer Websites", "Webflow Websites", "Landing Pages", "CMS Setup", "SEO Optimization", "Performance Optimization"],
  },
  {
    icon: "code",
    fallback: Code2,
    title: "Custom Development",
    desc: "Custom digital products built with modern technologies.",
    subs: ["React Development", "Next.js Applications", "SaaS Platforms", "Internal Tools", "API Integrations", "Custom Dashboards"],
  },
  {
    icon: "deck",
    fallback: Presentation,
    title: "Pitch Deck Design",
    desc: "Investor-ready presentations that tell a compelling story.",
    subs: ["Fundraising Decks", "Sales Decks", "Startup Storytelling", "Presentation Design", "Data Visualization", "Executive Summaries"],
  },
];

function Services() {
  const [open, setOpen] = useState<number | null>(0);
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
          className="mt-16 space-y-4"
        >
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                layout
                transition={{ layout: { duration: 0.5, ease: EASE } }}
                className={`group relative overflow-hidden rounded-3xl border transition-all ${
                  isOpen ? "border-foreground/20 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.15)]" : "border-black/8 bg-white hover:border-foreground/20 hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.12)]"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 md:px-10 py-8 md:py-10 flex items-center gap-6 md:gap-10"
                >
                  <div
                    className={`shrink-0 h-20 w-20 md:h-[92px] md:w-[92px] rounded-2xl flex items-center justify-center transition-colors ${
                      isOpen ? "bg-foreground text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-foreground group-hover:text-primary-foreground"
                    }`}
                  >
                    <div className="h-11 w-11 md:h-14 md:w-14">
                      <AnimatedIcon type={s.icon} active={isOpen} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground tabular-nums">
                      <span>0{i + 1}</span>
                      <span className="h-px w-8 bg-border" />
                    </div>
                    <h3 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                      {s.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="text-muted-foreground text-base md:text-lg max-w-2xl overflow-hidden"
                        >
                          {s.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <span
                    className={`shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                      isOpen ? "bg-foreground text-primary-foreground border-foreground rotate-180" : "border-border bg-white text-foreground"
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-10 pb-10 pl-[calc(1.5rem+80px+1.5rem)] md:pl-[calc(2.5rem+92px+2.5rem)]">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                          {s.subs.map((sub, j) => (
                            <motion.div
                              key={sub}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * j, duration: 0.4, ease: EASE }}
                              className="flex items-center gap-2.5 text-sm md:text-base text-foreground/80"
                            >
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime" />
                              {sub}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    WORK                                    */
/* -------------------------------------------------------------------------- */
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

function ProjectCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <motion.a
      ref={ref}
      href="#"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
      className="group grid grid-cols-1 md:grid-cols-12 gap-6 rounded-3xl border border-black/8 bg-white p-4 md:p-6 transition-all hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)]"
    >
      <div className="md:col-span-7 relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/10] bg-secondary">
        <motion.img
          src={p.img}
          alt={p.name}
          loading="lazy"
          width={1200}
          height={900}
          style={{ y: imgY, scale: 1.15 }}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-125"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
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
                className="rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground"
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
  );
}

function Work() {
  return (
    <section id="work" className="relative py-28 md:py-40 bg-white">
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
            <ProjectCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PROCESS TIMELINE                              */
/* -------------------------------------------------------------------------- */
const steps = [
  { no: "01", title: "Discover", body: "We learn about your business, goals, users, and challenges." },
  { no: "02", title: "Define", body: "We create a roadmap, align priorities, and establish direction." },
  { no: "03", title: "Design & Build", body: "We design, iterate, and develop the solution." },
  { no: "04", title: "Launch & Support", body: "We help launch confidently and continue improving after release." },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

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

        <div ref={ref} className="mt-20 relative">
          {/* Horizontal line desktop */}
          <div className="hidden md:block absolute left-0 right-0 top-6 h-px bg-border" />
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: "left" }}
            className="hidden md:block absolute left-0 right-0 top-6 h-px bg-foreground"
          />
          {/* Vertical line mobile */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-px bg-border" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="md:hidden absolute left-6 top-0 bottom-0 w-px bg-foreground"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.no}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="relative pl-16 md:pl-0"
              >
                <div className="absolute md:relative left-0 md:left-auto top-0 flex items-center gap-3">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 + 0.2, ease: EASE }}
                    className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-primary-foreground text-sm font-medium tabular-nums shadow-[0_8px_24px_-8px_rgba(15,23,42,0.35)]"
                  >
                    {s.no}
                    <span className="absolute inset-0 rounded-full bg-lime/30 blur-md -z-10" />
                  </motion.span>
                </div>
                <h3 className="mt-8 md:mt-10 text-2xl md:text-3xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              TOOLS ECOSYSTEM                               */
/* -------------------------------------------------------------------------- */
const toolCategories: Array<{ cat: string; items: Array<{ name: string; symbol: string; color: string }> }> = [
  {
    cat: "Design",
    items: [
      { name: "Figma", symbol: "◇", color: "#F24E1E" },
      { name: "Adobe", symbol: "A", color: "#DA1F26" },
      { name: "Spline", symbol: "◈", color: "#0F172A" },
      { name: "Rive", symbol: "▲", color: "#1D1D1D" },
    ],
  },
  {
    cat: "Build",
    items: [
      { name: "Framer", symbol: "F", color: "#0055FF" },
      { name: "Webflow", symbol: "W", color: "#146EF5" },
      { name: "React", symbol: "⚛", color: "#61DAFB" },
      { name: "Next.js", symbol: "N", color: "#000000" },
    ],
  },
  {
    cat: "AI",
    items: [
      { name: "OpenAI", symbol: "✳", color: "#10A37F" },
      { name: "Claude", symbol: "✦", color: "#D97757" },
      { name: "Cursor", symbol: "⌘", color: "#0F172A" },
      { name: "Perplexity", symbol: "✧", color: "#20B8CD" },
    ],
  },
  {
    cat: "Automation",
    items: [
      { name: "n8n", symbol: "n", color: "#EA4B71" },
      { name: "Make", symbol: "M", color: "#6D00CC" },
      { name: "Zapier", symbol: "Z", color: "#FF4A00" },
    ],
  },
  {
    cat: "Project Management",
    items: [
      { name: "Notion", symbol: "N", color: "#000000" },
      { name: "Linear", symbol: "L", color: "#5E6AD2" },
      { name: "Slack", symbol: "#", color: "#4A154B" },
    ],
  },
  {
    cat: "Research",
    items: [
      { name: "Google Analytics", symbol: "G", color: "#E37400" },
      { name: "Hotjar", symbol: "H", color: "#FD3A5C" },
    ],
  },
];

function ToolChip({ name, symbol, color, i }: { name: string; symbol: string; color: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = 140;
      if (dist < max) {
        const f = (1 - dist / max) * 18;
        x.set(-(dx / dist) * f);
        y.set(-(dy / dist) * f);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.3 }}
      className="flex flex-col items-center gap-2 group"
    >
      <div
        className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white border border-black/8 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)] flex items-center justify-center text-2xl md:text-3xl font-bold transition-transform group-hover:scale-110"
        style={{ color }}
      >
        {symbol}
      </div>
      <span className="text-xs text-muted-foreground">{name}</span>
    </motion.div>
  );
}

function Tools() {
  return (
    <section id="tools" className="relative py-28 md:py-40 bg-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,#e0f2fe,transparent_70%)] blur-3xl opacity-60" />
      </div>
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
          <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground max-w-xl">
            A carefully assembled ecosystem for design, engineering, AI, and automation.
          </motion.p>
        </motion.div>

        <div className="mt-16 space-y-14">
          {toolCategories.map((c, ci) => (
            <motion.div
              key={c.cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: ci * 0.05, ease: EASE }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">0{ci + 1}</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-semibold">{c.cat}</h3>
              </div>
              <div className="md:col-span-9 flex flex-wrap gap-6 md:gap-10 items-end">
                {c.items.map((t, i) => (
                  <ToolChip key={t.name} {...t} i={ci * 4 + i} />
                ))}
              </div>
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

        <div className="mt-14 divide-y divide-border rounded-3xl border border-black/8 bg-white overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 md:px-8 py-6 text-left transition-colors hover:bg-secondary"
                >
                  <span className="text-lg md:text-xl font-medium text-foreground">{f.q}</span>
                  <span className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all ${isOpen ? "bg-foreground text-primary-foreground border-foreground" : "border-border bg-white"}`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
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

/* -------------------------------------------------------------------------- */
/*                                  CONTACT                                   */
/* -------------------------------------------------------------------------- */
function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-foreground text-primary-foreground px-6 py-20 md:px-16 md:py-32"
        >
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-lime/40 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/15 blur-3xl"
          />

          <div className="relative max-w-4xl">
            <p className="text-sm uppercase tracking-widest text-primary-foreground/60">Let's talk</p>
            <h2 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.02] tracking-tight">
              Tell us what<br />you're building
            </h2>
            <p className="mt-8 text-lg md:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed">
              Whether you're launching a startup, redesigning a product, or preparing for your next funding round, we'd love to hear your story.
            </p>
            <div className="mt-12 flex flex-wrap gap-4 items-center">
              <a
                href="#"
                className="group relative inline-flex items-center gap-3 rounded-full bg-lime px-8 py-5 text-base md:text-lg font-semibold text-lime-foreground transition-all hover:-translate-y-1 hover:shadow-[0_20px_60px_-10px_rgba(190,242,100,0.5)]"
              >
                <span className="absolute inset-0 rounded-full bg-lime blur-xl opacity-40 -z-10 group-hover:opacity-70 transition-opacity" />
                <Calendar className="h-5 w-5" />
                Book a Call
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="mailto:hello@upriser.studio"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-6 py-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10 hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                Send an Email
              </a>
            </div>
            <p className="mt-8 text-sm text-primary-foreground/50">Typically responds within 24 hours.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   FOOTER                                   */
/* -------------------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-border py-16 bg-white">
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
    <main className="relative bg-white">
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
