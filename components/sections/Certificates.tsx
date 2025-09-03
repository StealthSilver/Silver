"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { CERTIFICATE } from "../../data/certificate.data";

export default function Certificates() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="certificates"
      className="
        relative 
        px-4 sm:px-6 md:px-12
        mt-16 sm:mt-24 md:mt-32
        bg-white/70 dark:bg-black/70 backdrop-blur-md 
        overflow-x-hidden
      "
    >
      {/* Section Title */}
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
        CERTIFICATES
      </motion.h2>

      {/* Certificate List */}
      <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4 font-mono">
        {CERTIFICATE.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="
              p-3 sm:p-4 
              rounded-2xl border border-gray-300/30 dark:border-gray-700/50 
              bg-white/60 dark:bg-black/60 
              backdrop-blur-md 
              transition-all duration-300
            "
          >
            <div className="flex justify-between items-center gap-2">
              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer truncate"
              >
                {exp.company}
              </a>

              <a
                href={exp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Link2 size={20} className="sm:w-5 sm:h-5 w-4 h-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
