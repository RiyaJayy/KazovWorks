import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ease-premium ${
        scrolled ? "border-steel/80 bg-onyx/75 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="section flex h-20 items-center justify-between">
        <Link to="/" aria-label="KAZOV WORKS home"><Logo /></Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative font-display text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-burgundy after:transition-all after:duration-300 after:ease-premium ${
                  isActive ? "text-alloy after:w-full" : "text-ash after:w-0 hover:text-alloy hover:after:w-full"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center md:flex">
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>

        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} className="flex h-10 w-10 items-center justify-center border border-steel md:hidden">
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-alloy transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-alloy transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-alloy transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-steel bg-onyx md:hidden"
          >
            <div className="section flex flex-col gap-5 py-6">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `font-display text-lg font-medium ${isActive ? "text-burgundy" : "text-alloy"}`}
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">Contact Us</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
