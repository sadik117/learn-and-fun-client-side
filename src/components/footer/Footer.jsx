// src/components/layouts/Footer.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiHeart,
} from "react-icons/fi";

const links = {
  platform: [
    { label: "Learn", to: "/learn" },
    { label: "Lottery", to: "/playNwin" },
    { label: "Withdraw", to: "/myprofile" },
  ], 
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate">
      {/* Soft gradient glow behind footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1220] via-[#0b1220] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(80% 80% at 50% 50%, rgba(59,130,246,0.25), rgba(168,85,247,0.12) 60%, transparent 70%)",
        }}
      />

      {/* Wave divider */}
      <svg
        viewBox="0 0 1440 90"
        className="block w-full text-gray-900/0"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="#0b1220"
          d="M0,64L48,58.7C96,53,192,43,288,37.3C384,32,480,32,576,42.7C672,53,768,75,864,80C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
      </svg>

      {/* Main footer */}
      <div className="bg-[#0b1220] text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 grid place-items-center text-white font-bold">
                  L&E
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    Learn & Earn
                  </p>
                  <p className="text-xs text-gray-400">
                    Build skills. Play. Earn.
                  </p>
                </div>
              </motion.div>

              <p className="text-sm leading-relaxed text-gray-400">
                Learn digital skills, grow your network, play fair games, and
                manage payments—everything in one place.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <Social icon={<FiFacebook />} href="#" label="Facebook" />
                <Social icon={<FiInstagram />} href="#" label="Instagram" />
                <Social icon={<FiTwitter />} href="#" label="Twitter / X" />
                <Social icon={<FiYoutube />} href="#" label="YouTube" />
              </div>
            </div>

            {/* Platform links */}
            <div className="mx-0 md:mx-20">
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                {links.platform.map((l) => (
                  <li key={l.label}>
                    <FooterLink to={l.to}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Stay in the loop</h4>
              <p className="text-sm text-gray-400">
                Get updates on new courses, features & events.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = new FormData(e.currentTarget).get("email");
                  if (!email) return;
                  // Integrate with backend/mail provider if needed
                  alert(`Subscribed: ${email}`);
                  e.currentTarget.reset();
                }}
                className="relative"
              >
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-3 pr-12 outline-none ring-0 focus:border-blue-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-95"
                  aria-label="Subscribe"
                >
                  <FiSend />
                </button>
              </form>

              <div className="space-y-2 pt-2 text-sm">
                <p className="flex items-start gap-2">
                  <FiMail className="mt-0.5 text-gray-400" />
                  learnandearn460@gmail.com
                </p>
                <p className="flex items-start gap-2">
                  <FiPhone className="mt-0.5 text-gray-400" />
                  +880 1704-330646
                </p>
                <p className="flex items-start gap-2">
                  <FiMapPin className="mt-0.5 text-gray-400" />
                  Rangpur, Bangladesh
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
            <p className="text-gray-400">
              © {year} Learn & Fun. All rights reserved.
            </p>
            <p className="text-gray-400 flex items-center gap-1">
              Made with <FiHeart className="text-rose-500" /> for learners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Small helpers ---------- */

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-gray-400 hover:text-white transition gap-2 group"
    >
      <span>{children}</span>
      <span className="h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-6" />
    </Link>
  );
}

function Social({ icon, href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid place-items-center h-10 w-10 rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-gray-700 transition"
    >
      {icon}
    </a>
  );
}
