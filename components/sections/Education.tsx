"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, GraduationCap } from "lucide-react";
import { EDUCATION } from "../../data/education.data";

export default function Education() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="education"
      className="
        relative px-4 sm:px-6 md:px-12 
        py-10 sm:py-12 md:py-16 
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
        EDUCATION
      </motion.h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8">
        {EDUCATION.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="
              p-4 sm:p-6 
              rounded-2xl border border-gray-300/30 dark:border-gray-700/50 
              bg-white/60 dark:bg-black/60 backdrop-blur-md 
              hover:shadow-lg transition-all duration-300
            "
          >
            <div className="flex justify-between items-center">
              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-xl sm:text-2xl font-bold 
                  text-gray-900 dark:text-gray-100 
                  cursor-pointer
                "
              >
                {exp.company}
              </a>
            </div>

            <div
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="
                mt-3 cursor-pointer 
                flex justify-between items-center 
                p-2 sm:p-3 font-mono rounded-lg 
                hover:bg-gray-100 dark:hover:bg-gray-700/70 
                transition-colors w-full
              "
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <GraduationCap
                    size={18}
                    className="text-gray-700 dark:text-gray-300"
                  />

                  <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {exp.position}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {exp.duration} | {exp.location}
                </p>
              </div>

              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {openIndex === index ? (
                  <ChevronUp
                    size={20}
                    className="text-gray-800 dark:text-gray-200"
                  />
                ) : (
                  <ChevronDown
                    size={20}
                    className="text-gray-800 dark:text-gray-200"
                  />
                )}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.ul
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="
                    mt-3 sm:mt-4 
                    list-disc list-outside pl-4 sm:pl-6 
                    font-mono text-sm sm:text-base 
                    text-gray-700 dark:text-gray-300 
                    space-y-2 overflow-hidden
                  "
                >
                  {exp.details.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
