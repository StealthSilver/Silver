"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TECH_STACK } from "../../data/tech.data";

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative px-6 mt-[150px] bg-white/70 dark:bg-black/70 backdrop-blur-md overflow-hidden"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="
          text-3xl md:text-4xl flex items-center justify-center
          text-gray-900 dark:text-gray-100 mb-20
        "
      >
        STACK
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {TECH_STACK.map((tech, index) => (
          <motion.a
            key={tech.key}
            href={tech.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative flex flex-col items-center group"
          >
            <span
              className="
                absolute -top-6 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300
                text-sm font-medium text-gray-900 dark:text-gray-100
                bg-white/80 dark:bg-black/80 px-2 py-1 rounded-lg shadow-md
                whitespace-nowrap
              "
            >
              {tech.title}
            </span>

            <div
              className="
                relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden 
                bg-white dark:bg-black shadow-md
                flex items-center justify-center
                transition-transform duration-300
                group-hover:scale-110
              "
            >
              <Image
                src={`/icons/${tech.key}.svg`}
                alt={tech.title}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
