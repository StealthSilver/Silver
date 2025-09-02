"use client";

import { motion } from "framer-motion";
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { Spotlight } from "../ui/Spotlight";
import { Download, MoveRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-6 pt-[200px] bg-white/70 dark:bg-black/70 backdrop-blur-md overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="
            flex flex-col md:flex-row items-center justify-center 
            text-5xl md:text-6xl font-bold
            text-gray-900 dark:text-gray-100
          "
        >
          <Spotlight />
          <span>Hi, I am</span>
          <div className="w-[280px] md:w-[420px] md:h-[150px]">
            <TextHoverEffect text="Silver" duration={0.3} />
          </div>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="
            text-3xl md:text-4xl font-semibold
            text-gray-800 dark:text-gray-200 mb-12
          "
        >
          Software Developer based in Bengaluru
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="
            max-w-2xl text-lg md:text-xl font-mono leading-relaxed
            text-gray-600 dark:text-gray-400 mb-12
          "
        >
          Enjoying and elevating the developer experience
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex gap-24"
        >
          <a
            href="#footer"
            className="
              px-10 py-2 flex items-center gap-6 rounded-full border
              bg-white text-black border-black
              hover:bg-black hover:text-white
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
            // download="Rajat-Saraswat-Resume.pdf"
            className="
              flex items-center gap-6 px-10 py-2 rounded-full border
              bg-black text-white border-white
              hover:bg-white hover:text-black hover:border-black
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
