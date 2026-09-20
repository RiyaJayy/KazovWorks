import { Link } from "react-router-dom";
import Logo from "./Logo";

const ADDRESS = import.meta.env.VITE_BUSINESS_ADDRESS || "Dayaji Park Shop No. 62, Opposite BRTS Workshop, Opposite National Kabadi Market No. 5, Narol, Ahmedabad";
const PHONE = import.meta.env.VITE_BUSINESS_PHONE || "+919313217425";
const EMAIL = import.meta.env.VITE_BUSINESS_EMAIL || "samkazokav1181@gmail.com";

export default function Footer() {
  return (
    <footer className="border-t border-steel bg-charcoal">
      <div className="section grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ash">Quality used automotive parts for dealers and mechanics.</p>
        </div>

        <div>
          <h4 className="font-display text-sm tracking-wide text-alloy">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-ash">
            <li><Link to="/" className="transition-colors hover:text-burgundy-light">Home</Link></li>
            <li><Link to="/catalogue" className="transition-colors hover:text-burgundy-light">Catalogue</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-burgundy-light">About</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-burgundy-light">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm tracking-wide text-alloy">Get in Touch</h4>
          <ul className="mt-4 space-y-2 text-sm text-ash">
            <li><a href={`mailto:${EMAIL}`} className="transition-colors hover:text-burgundy-light">{EMAIL}</a></li>
            <li><a href={`tel:${PHONE}`} className="transition-colors hover:text-burgundy-light">{PHONE}</a></li>
            <li className="max-w-xs">{ADDRESS}</li>
            <li>10:00 AM – 7:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-steel">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-ash sm:flex-row">
          <span>© {new Date().getFullYear()} KAZOV WORKS. All rights reserved.</span>
          <span className="font-display tracking-wide">KAZOV<span className="text-burgundy">.</span>WORKS</span>
        </div>
      </div>
    </footer>
  );
}
