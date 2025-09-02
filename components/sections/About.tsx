"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, MapPin, Phone } from "lucide-react";

export default function About() {
  return (
    <section className="relative px-6 mt-[340px] bg-white/70 dark:bg-black/70 backdrop-blur-md overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="
          text-3xl md:text-4xl font-semibold flex items-center justify-center
          text-gray-900 dark:text-gray-100 mb-20
        "
      >
        ABOUT ME
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-start gap-16">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start space-y-6"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/profile_pic.png"
                alt="About Me"
                fill
                className="object-cover"
              />
            </div>

            <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Silver
            </div>

            <div className="flex items-center gap-3 text-lg md:text-xl text-gray-600 dark:text-gray-400">
              <span
                className="
                  rounded-full border p-2
                  bg-white text-black border-black
                  dark:bg-black dark:text-white dark:border-white
                  transition-colors
                "
              >
                <Briefcase size={18} />
              </span>
              Software Engineer
            </div>

            <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-400">
              <span
                className="
                  rounded-full border p-2
                  bg-white text-black border-black
                  dark:bg-black dark:text-white dark:border-white
                  transition-colors
                "
              >
                <MapPin size={18} />
              </span>
              Bengaluru, Karnataka, India
            </div>

            <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-gray-400">
              <span
                className="
                  rounded-full border p-2
                  bg-white text-black border-black
                  dark:bg-black dark:text-white dark:border-white
                  transition-colors
                "
              >
                <Phone size={18} />
              </span>
              +91 85339 22485
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col space-y-6 text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="
              text-lg md:text-xl font-mono leading-relaxed
              text-gray-700 dark:text-gray-300
            "
          >
            Hello, World! I’m a passionate{" "}
            <span className="font-semibold">Full Stack Developer</span> with 4
            years of industry experience building robust, scalable, and
            user-friendly web applications. I bring a problem-solving mindset to
            every project, thriving in fast-paced environments where innovation
            and efficiency matter.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="
              text-lg md:text-xl font-mono leading-relaxed
              text-gray-700 dark:text-gray-300
            "
          >
            From designing responsive frontends to architecting efficient
            backend systems, I specialize in delivering end-to-end solutions
            that solve real-world problems and create meaningful digital
            experiences. I’m constantly learning, pushing and innovating —
            ensuring that every project I work on is not just functional, but
            also intuitive, reliable, and impactful.
          </motion.p>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="
              text-xl md:text-2xl font-bold
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
