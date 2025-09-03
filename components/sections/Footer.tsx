"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="w-full mt-16 sm:mt-24 px-4 sm:px-6 overflow-x-hidden"
    >
      <div
        className="
          max-w-7xl mx-auto px-4 sm:px-6 py-6
          border-t border-l border-r
          border-black/10 dark:border-gray-700
          bg-white/70 dark:bg-black/70 backdrop-blur-md
          rounded-t-3xl
          transition-colors duration-300
          flex flex-col items-center text-center space-y-6
        "
      >
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
          width={140}
          height={140}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 sm:mt-10 w-32 sm:w-40 h-auto"
        />

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-6 mb-6">
          <a
            href="https://www.linkedin.com/in/rajat-saraswat-0491a3259/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              rounded-full border p-2.5 sm:p-3
              bg-white text-black border-black hover:bg-black hover:text-white
              dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black
              transition-colors
            "
          >
            <Linkedin size={20} />
          </a>

          <a
            href="https://github.com/StealthSilver"
            target="_blank"
            rel="noopener noreferrer"
            className="
              rounded-full border p-2.5 sm:p-3
              bg-white text-black border-black hover:bg-black hover:text-white
              dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black
              transition-colors
            "
          >
            <Github size={20} />
          </a>

          <a
            href="https://x.com/Rajat_0409"
            target="_blank"
            rel="noopener noreferrer"
            className="
              rounded-full border p-2.5 sm:p-3
              bg-white text-black border-black hover:bg-black hover:text-white
              dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black
              transition-colors
            "
          >
            <Twitter size={20} />
          </a>

          <a
            href="mailto:rajatsaraswat12@gmail.com"
            className="
              rounded-full border p-2.5 sm:p-3
              bg-white text-black border-black hover:bg-black hover:text-white
              dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black
              transition-colors
            "
          >
            <Mail size={20} />
          </a>
        </div>

        <div className="w-full max-w-5xl border-t border-gray-300 dark:border-gray-700" />

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-4">
          © {year} Silver. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
