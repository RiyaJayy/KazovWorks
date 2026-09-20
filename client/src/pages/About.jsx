import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function CarSilhouette({ reduceMotion }) {
  return (
    <motion.svg
      viewBox="0 0 600 220"
      className="w-full max-w-2xl text-steel"
      initial={reduceMotion ? false : { opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <path
        d="M40 150 C40 120 70 110 110 108 L150 70 C165 58 185 52 205 52 L370 52 C392 52 412 60 428 74 L468 108 C500 110 540 120 555 140 C562 148 560 160 552 165 L520 165 C520 138 498 116 471 116 C444 116 422 138 422 165 L200 165 C200 138 178 116 151 116 C124 116 102 138 102 165 L55 165 C46 165 40 158 40 150 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M175 70 L215 108 L360 108 L400 70" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <g className={reduceMotion ? "" : "animate-spin-slow"} style={{ transformOrigin: "151px 165px" }}>
        <circle cx="151" cy="165" r="26" fill="none" stroke="currentColor" className="text-burgundy" strokeWidth="2" />
        <circle cx="151" cy="165" r="10" fill="none" stroke="currentColor" className="text-burgundy" strokeWidth="1.5" />
      </g>
      <g className={reduceMotion ? "" : "animate-spin-slow"} style={{ transformOrigin: "471px 165px" }}>
        <circle cx="471" cy="165" r="26" fill="none" stroke="currentColor" className="text-burgundy" strokeWidth="2" />
        <circle cx="471" cy="165" r="10" fill="none" stroke="currentColor" className="text-burgundy" strokeWidth="1.5" />
      </g>
    </motion.svg>
  );
}

function BrakeDisc({ reduceMotion }) {
  const slots = Array.from({ length: 12 });
  return (
    <motion.svg
      viewBox="0 0 300 300"
      className="w-full max-w-xs text-steel"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <g className={reduceMotion ? "" : "animate-spin-slow"} style={{ transformOrigin: "150px 150px" }}>
        <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="150" cy="150" r="95" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        {slots.map((_, i) => {
          const angle = (i / slots.length) * Math.PI * 2;
          const x1 = 150 + Math.cos(angle) * 95;
          const y1 = 150 + Math.sin(angle) * 95;
          const x2 = 150 + Math.cos(angle) * 120;
          const y2 = 150 + Math.sin(angle) * 120;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" />;
        })}
        <circle cx="150" cy="150" r="34" fill="none" className="text-burgundy" stroke="currentColor" strokeWidth="2" />
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = 150 + Math.cos(angle) * 18;
          const y = 150 + Math.sin(angle) * 18;
          return <circle key={i} cx={x} cy={y} r="3.5" fill="currentColor" className="text-burgundy" />;
        })}
      </g>
      {/* caliper — stays fixed while the disc rotates beneath it */}
      <path d="M150 20 C168 20 182 34 182 52 L182 76 C182 88 172 96 160 96 L140 96 C128 96 118 88 118 76 L118 52 C118 34 132 20 150 20 Z" fill="#141414" stroke="currentColor" className="text-burgundy-light" strokeWidth="2" />
    </motion.svg>
  );
}

const expertise = [
  { title: "Engine Components", body: "Alternators, starters, timing kits, and cooling parts pulled from running vehicles and tested before listing." },
  { title: "Body & Exterior", body: "Bumpers, panels, lighting, and mirrors — inspected for structural condition, not just appearance." },
  { title: "Suspension & Brakes", body: "Struts, control arms, calipers, and discs checked for wear within safe, usable limits." },
];

const values = [
  { title: "Straight answers", body: "No inflated condition grades, no guesswork on compatibility — just what the part is and what it fits." },
  { title: "Fast to work with", body: "Contact us directly and get a real answer, not a ticket number." },
  { title: "Built on trust", body: "Dealers and mechanics come back because what they receive matches what was listed." },
];

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <SEO title="About" />

      {/* 1. BRAND INTRODUCTION */}
      <section className="relative overflow-hidden border-b border-steel bg-onyx py-24">
        <div className="pointer-events-none absolute inset-0 bg-burgundy-glow opacity-70" />
        <div className="section relative">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-xs font-medium tracking-[0.3em] text-burgundy-light"
          >
            ABOUT KAZOV WORKS
          </motion.p>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-alloy sm:text-5xl lg:text-6xl"
          >
            Quality used parts, <span className="text-burgundy">sourced with intent.</span>
          </motion.h1>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-ash"
          >
            KAZOV WORKS supplies quality used automotive parts — engine components and
            body parts — for both older and newer vehicles.
          </motion.p>
        </div>
      </section>

      {/* 2. VEHICLE VISUAL */}
      <section className="border-b border-steel bg-charcoal py-20">
        <div className="section flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-md"
          >
            <motion.h2 variants={fadeUp} className="font-display text-3xl font-medium text-alloy sm:text-4xl">
              Every part starts on a real vehicle.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm leading-relaxed text-ash">
              We work with mechanics and car dealers who need dependable parts and
              straight answers, without the runaround of a big marketplace.
            </motion.p>
          </motion.div>
          <CarSilhouette reduceMotion={reduceMotion} />
        </div>
      </section>

      {/* 3. COMPONENT DETAIL */}
      <section className="border-b border-steel bg-onyx py-20">
        <div className="section flex flex-col-reverse items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <BrakeDisc reduceMotion={reduceMotion} />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-md"
          >
            <motion.h2 variants={fadeUp} className="font-display text-3xl font-medium text-alloy sm:text-4xl">
              Condition checked down to the component.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm leading-relaxed text-ash">
              Before anything is listed, it's inspected — not just wiped down and
              photographed. What you see in the catalogue reflects real, working
              condition.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 4. EXPERTISE */}
      <section className="border-b border-steel bg-charcoal py-20">
        <div className="section">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-medium text-alloy sm:text-4xl"
          >
            What we work with
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid gap-6 sm:grid-cols-3"
          >
            {expertise.map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="panel panel-hover p-6">
                <h3 className="font-display text-lg font-medium text-alloy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. VALUES */}
      <section className="border-b border-steel bg-onyx py-20">
        <div className="section">
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-medium text-alloy sm:text-4xl"
          >
            What we stand on
          </motion.h2>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 grid gap-8 sm:grid-cols-3"
          >
            {values.map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="border-l-2 border-burgundy pl-5">
                <h3 className="font-display text-lg font-medium text-alloy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{v.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="bg-charcoal py-20">
        <div className="section flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-medium text-alloy">Browse the catalogue, find what you need.</h2>
            <p className="mt-2 max-w-md text-sm text-ash">Reach out directly — we'll take it from there.</p>
          </div>
          <Link to="/catalogue" className="btn-primary">Explore Parts</Link>
        </div>
      </section>
    </>
  );
}
