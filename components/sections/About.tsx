"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Code, MapPin, Phone } from "lucide-react";

export default function About() {
  return (
    <section
      id="about"
      className="
        relative px-4 sm:px-6 md:px-12 
        mt-20 sm:mt-28 md:mt-40 lg:mt-84
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
        ABOUT ME
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start gap-10 sm:gap-14 md:gap-16">
        <div className="flex justify-center md:justify-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center md:items-start space-y-6"
          >
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/profile_pic.png"
                alt="About Me"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Silver
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 text-left w-full">
              <span
                className="
                         rounded-full border p-2
                         bg-white text-black border-black
                         dark:bg-black dark:text-white dark:border-white
                         transition-colors
                         shrink-0"
              >
                <Code size={18} />
              </span>
              <span className="flex-1">Software Engineer</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-400 text-left w-full">
              <span
                className="
                       rounded-full border p-2
                       bg-white text-black border-black
                       dark:bg-black dark:text-white dark:border-white
                       transition-colors
                            shrink-0"
              >
                <MapPin size={18} />
              </span>
              <span className="flex-1">Bengaluru, Karnataka, India</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg text-gray-600 dark:text-gray-400 text-left w-full">
              <span
                className="
                          rounded-full border p-2
                          bg-white text-black border-black
                          dark:bg-black dark:text-white dark:border-white
                          transition-colors
                          shrink-0"
              >
                <Phone size={18} />
              </span>
              <span className="flex-1">+91 85339 22485</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col space-y-6 text-center md:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="
              text-base sm:text-lg md:text-xl font-mono leading-relaxed
              text-gray-700 dark:text-gray-300
            "
          >
            Hello, World! I’m a passionate{" "}
            <span className="font-semibold">Full Stack Developer</span> with
            proven industry experience building robust, scalable, and
            user-friendly web applications. I bring a problem-solving mindset to
            every project, thriving in cutting-edge environments where
            innovation and performance matter.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="
              text-base sm:text-lg md:text-xl font-mono leading-relaxed
              text-gray-700 dark:text-gray-300
            "
          >
            From crafting seamless frontends to architecting intelligent backend
            systems, I specialize in delivering end-to-end solutions that solve
            complex problems and create transformative digital experiences.
            I&apos;m constantly evolving, experimenting and pioneering —
            ensuring that every project I work on is not just functional, but
            also elegant, performant, and game-changing.
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="
              text-lg sm:text-xl md:text-2xl font-bold
              text-gray-900 dark:text-gray-100 tracking-wide
            "
          >
            DESIGN | DEVELOP | DELIVER
          </motion.h3>
        </motion.div>
      </div>
    </section>
  );
}
