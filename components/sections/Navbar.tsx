"use client";

import { useState, useEffect } from "react";
import { Menu, X, Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setIsOpen((v) => !v);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Education", href: "#education" },
    { name: "Projects", href: "#projects" },
    { name: "Certificates", href: "#certificates" },
    {name: "Blogs", href:"https://patch-umbrella-c3a.notion.site/System-Design-27c5af667d9680f0b6d2c5baa513f7ad"},
  ];

  return (
    <nav
      className="
        w-full sticky top-0 z-50 px-4 sm:px-6 py-3
        border-b border-black/10 dark:border-gray-700
        bg-white/70 dark:bg-black/70 backdrop-blur-md
        transition-colors duration-300
      "
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center cursor-pointer">
          <motion.img
            key={mounted ? theme : "default"}
            src={
              !mounted
                ? "/logo_light.svg"
                : theme === "dark"
                ? "/logo_dark.svg"
                : "/logo_light.svg"
            }
            alt="Silver logo"
            className="w-28 h-auto sm:w-32 md:w-36"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        <div
          className="hidden md:flex items-center px-2 font-mono relative gap-6"
          onMouseLeave={() => setHovered(null)}
        >
          {navItems.map((item) => (
            <div key={item.name} className="relative px-3 py-1.5 select-none">
              {hovered === item.name && (
                <motion.span
                  layoutId="hoverBg"
                  className="
                    absolute inset-0 rounded-full backdrop-blur-sm
                    bg-gray-200/70 border border-gray-300
                    dark:bg-gray-700/70 dark:border-gray-600
                  "
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                    mass: 0.6,
                  }}
                  initial={false}
                />
              )}

              <Link
                href={item.href}
                onMouseEnter={() => setHovered(item.name)}
                onFocus={() => setHovered(item.name)}
                className="
                  relative z-10 transition-colors
                  text-gray-700 hover:text-black
                  dark:text-gray-300 dark:hover:text-white
                "
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono">
          <a
            href="https://github.com/StealthSilver"
            target="_blank"
            rel="noopener noreferrer"
            className="
              rounded-full border p-2
              bg-white text-black border-black hover:bg-black hover:text-white
              dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black
              transition-colors
            "
          >
            <Github size={18} />
          </a>

          <ThemeToggle />

          <a
            href="#footer"
            className="
              bg-gray-900 text-white border border-gray-900 rounded-full px-6 py-1.5
              transition duration-300 hover:bg-white hover:text-black
              dark:bg-gray-100 dark:text-black dark:border-gray-100
              dark:hover:bg-black dark:hover:text-white
            "
          >
            Connect
          </a>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <div className="scale-90">
            <ThemeToggle />
          </div>

          <button
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-1.5 rounded-md"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col items-center space-y-5 py-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <a
              href="#footer"
              className="rounded-full border px-6 py-1.5 transition-colors bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-black dark:bg-gray-100 dark:text-black dark:border-gray-100 dark:hover:bg-black dark:hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Connect
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
