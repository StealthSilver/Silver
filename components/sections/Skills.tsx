"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, MapPin, Phone } from "lucide-react";

export default function About() {
  return (
    <section className="relative px-6 mt-[150px] bg-white/70 dark:bg-black/70 backdrop-blur-md overflow-hidden">
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
    </section>
  );
}
