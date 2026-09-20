import { motion, useTransform } from "framer-motion";

/**
 * The hero's centerpiece: a wheel/rim emblem built from several
 * independently-moving layers (counter-rotating rings, a chasing light arc,
 * a pulsing glow core, and drifting speed-lines) so it reads as one cohesive
 * object with real depth rather than a flat spinning icon. Tilts gently
 * toward the cursor/touch point via spring-smoothed motion values passed
 * from the parent.
 */
export default function HeroWheel({ springX, springY, reduceMotion }) {
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const rotateY = useTransform(springX, [-1, 1], [-10, 10]);
  const liftX = useTransform(springX, [-1, 1], [-14, 14]);
  const liftY = useTransform(springY, [-1, 1], [-10, 10]);

  return (
    <div className="relative flex items-center justify-center" style={{ perspective: 900 }}>
      {/* glow core, pulses independently of the tilt */}
      <div className="hero-glow-core" />

      <motion.div
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* speed lines — drift left, staggered + irregular timing so the loop doesn't read as mechanical */}
        {!reduceMotion && (
          <div className="pointer-events-none absolute right-[58%] top-1/2 hidden -translate-y-1/2 flex-col gap-7 sm:flex">
            <span className="h-[2px] w-14 origin-left rounded-full bg-gradient-to-r from-transparent via-burgundy-light to-transparent animate-speed-line-1" />
            <span className="h-[2px] w-24 origin-left rounded-full bg-gradient-to-r from-transparent via-burgundy to-transparent animate-speed-line-2" />
            <span className="h-[2px] w-10 origin-left rounded-full bg-gradient-to-r from-transparent via-alloy/70 to-transparent animate-speed-line-3" />
            <span className="h-[2px] w-20 origin-left rounded-full bg-gradient-to-r from-transparent via-burgundy-light to-transparent animate-speed-line-1" style={{ animationDelay: "1.4s" }} />
          </div>
        )}

        <motion.div
          style={reduceMotion ? undefined : { x: liftX, y: liftY }}
          className="relative"
        >
          <svg viewBox="0 0 400 400" className="h-full w-full max-w-md text-steel drop-shadow-[0_0_40px_rgba(122,30,44,0.25)]">
            {/* outer static structure rings */}
            <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />

            {/* chasing light arc — fast, thin, high-contrast: the "energy" read */}
            {!reduceMotion && (
              <g className="animate-spin-fast" style={{ transformOrigin: "200px 200px" }}>
                <circle
                  cx="200" cy="200" r="150" fill="none"
                  stroke="url(#chaseGradient)" strokeWidth="2.5"
                  strokeDasharray="60 883" strokeLinecap="round"
                />
              </g>
            )}

            {/* spokes — slow counter-rotation for depth */}
            <g className={reduceMotion ? "" : "animate-spin-slow"} style={{ transformOrigin: "200px 200px" }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const x1 = 200 + Math.cos(angle) * 150;
                const y1 = 200 + Math.sin(angle) * 150;
                const x2 = 200 + Math.cos(angle) * 162;
                const y2 = 200 + Math.sin(angle) * 162;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" opacity="0.7" />;
              })}
            </g>

            {/* inner counter-rotating ring, opposite direction, different speed = parallax depth */}
            <g className={reduceMotion ? "" : "animate-spin-reverse"} style={{ transformOrigin: "200px 200px" }}>
              <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" className="text-burgundy" strokeWidth="1.5" strokeDasharray="4 10" opacity="0.6" />
            </g>

            <defs>
              <linearGradient id="chaseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7A1E2C" stopOpacity="0" />
                <stop offset="50%" stopColor="#C23A52" stopOpacity="1" />
                <stop offset="100%" stopColor="#7A1E2C" stopOpacity="0" />
              </linearGradient>
            </defs>

            <text
              x="200" y="212" textAnchor="middle"
              className="fill-alloy font-display text-6xl font-semibold"
              style={{ fontFamily: "Outfit" }}
            >
              KW
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
