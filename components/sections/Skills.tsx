"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TECH_STACK } from "../../data/tech.data";

export default function Skills() {
  return (
    <section
      id="skills"
      className="
        relative px-4 sm:px-6 md:px-12 
        mt-16 sm:mt-24 md:mt-32 
        bg-white/70 dark:bg-black/70 backdrop-blur-md 
        overflow-x-hidden
      "
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="
          text-2xl sm:text-3xl md:text-4xl 
          flex items-center justify-center
          text-gray-900 dark:text-gray-100 
          mb-10 sm:mb-16
        "
      >
        STACK
      </motion.h2>

      <div
        className="
          max-w-7xl mx-auto pb-6 
          grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 

          gap-4 sm:gap-6 md:gap-8
        "
      >
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
                absolute -top-7 sm:-top-8 opacity-0 
                group-hover:opacity-100 transition-opacity duration-300
                text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100
                bg-white/90 dark:bg-black/90 px-2 py-1 rounded-md shadow-md
                whitespace-nowrap
                pointer-events-none
              "
            >
              {tech.title}
            </span>

            <div
              className="
                relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
                rounded-xl overflow-hidden 
                bg-white dark:bg-black shadow-md
                flex items-center justify-center
                transition-transform duration-300
                group-hover:scale-110
              "
            >
              {tech.lightIcon ? (
                <>
                  <Image
                    src={`/icons/${tech.lightIcon}`}
                    alt={tech.title}
                    width={36}
                    height={36}
                    className="object-contain block dark:hidden"
                  />
                  <Image
                    src={`/icons/${tech.key}.svg`}
                    alt={tech.title}
                    width={36}
                    height={36}
                    className="object-contain hidden dark:block"
                  />
                </>
              ) : (
                <Image
                  src={`/icons/${tech.key}.svg`}
                  alt={tech.title}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
