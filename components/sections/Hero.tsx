"use client";

import { motion } from "framer-motion";
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { Spotlight } from "../ui/Spotlight";
import { Download, MoveRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="
        relative px-4 sm:px-6 pt-28 sm:pt-36 md:pt-48 
        bg-white/70 dark:bg-black/70 backdrop-blur-md
        overflow-x-hidden
      "
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            flex flex-col md:flex-row items-center justify-center 
            text-4xl sm:text-5xl md:text-6xl font-bold
            text-gray-900 dark:text-gray-100
            gap-3 sm:gap-4
          "
        >
          <Spotlight />
          <span>Hi, I am</span>
          <div className="w-[200px] sm:w-[260px] md:w-[420px] md:h-[150px]">
            <TextHoverEffect text="Silver" duration={0.3} />
          </div>
        </motion.h1>

        {/* Subheading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="
            text-2xl sm:text-3xl md:text-4xl font-semibold
            text-gray-800 dark:text-gray-200
          "
        >
          Software Developer based in Bengaluru
        </motion.h2>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="
            max-w-xl sm:max-w-2xl text-base sm:text-lg md:text-xl font-mono leading-relaxed
            text-gray-600 dark:text-gray-400
          "
        >
          Enjoying and elevating the developer experience
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="
            flex flex-col sm:flex-row gap-4 sm:gap-8 mt-6
            w-full sm:w-auto justify-center
          "
        >
          <a
            href="#footer"
            className="
              px-6 sm:px-8 md:px-10 py-2 flex items-center justify-center gap-3 sm:gap-4 rounded-full border
              bg-black text-white border-black
              hover:bg-white hover:text-black
              dark:bg-white dark:text-black dark:border-white
              dark:hover:bg-black dark:hover:text-white
              transition-colors duration-300
            "
          >
            Connect now
            <MoveRight size={18} />
          </a>

          <a
            href="/Resume1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-8 md:px-10 py-2 rounded-full border
              bg-white text-black border-black
              hover:bg-black hover:text-white hover:border-white
              dark:bg-black dark:text-white dark:border-white
              dark:hover:bg-white dark:hover:text-black
              transition-colors duration-300
            "
          >
            My Resume
            <Download size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
