"use client";

import { motion } from "framer-motion";
import { BackgroundRippleEffect } from "@/components/ui/BackgroundRipple";

export default function CTA() {
  return (
    <section
      className="
        relative 
        px-4 sm:px-6 md:px-12
        py-12 sm:py-20 md:py-28
        mt-12 sm:mt-20 md:mt-28
        bg-white/70 dark:bg-black/70 
        backdrop-blur-md 
        overflow-x-hidden overflow-y-hidden
      "
    >
      <BackgroundRippleEffect />

      <div className="relative z-10 max-w-3xl sm:max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-6">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-sm sm:text-base md:text-lg font-mono text-gray-600 dark:text-gray-400"
        >
          Let’s connect amazing stuff together
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          className="
            text-2xl sm:text-4xl md:text-5xl 
            font-bold text-gray-900 dark:text-gray-100 
            mb-6 sm:mb-10
          "
        >
          Get in Touch
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href="#footer"
            className="
              px-5 sm:px-8 md:px-10 
              py-2 sm:py-3 
              rounded-full border
              bg-black text-white border-black
              hover:bg-white hover:text-black hover:border-black
              dark:bg-white dark:text-black dark:border-white
              dark:hover:bg-black dark:hover:text-white dark:hover:border-white
              transition-colors duration-300
              font-semibold text-sm sm:text-base
            "
          >
            Connect Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
