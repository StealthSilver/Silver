"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Globe, Figma, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { PROJECTS } from "../../data/project.data";
import {
  HoverEffect,
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/CardHover";

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section
      id="projects"
      className="
        relative 
        px-4 sm:px-6 md:px-12
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
        PROJECTS
      </motion.h2>

      <HoverEffect className="max-w-6xl mx-auto font-mono gap-3 sm:gap-4">
        <AnimatePresence>
          {(showAll ? PROJECTS : PROJECTS.slice(0, 6)).map((project, idx) => (
            <motion.div
              key={project.title + idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              layout
            >
              <Card className="relative w-full h-full group overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover opacity-20 group-hover:opacity-80 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-white/70 dark:bg-black/60 group-hover:bg-white/30 dark:group-hover:bg-black/30 transition-all duration-700"></div>

                <div className="relative z-20 flex flex-col justify-between h-full text-center px-4 sm:px-6 py-4 sm:py-6">
                  <div className="transition-opacity duration-500 group-hover:opacity-0">
                    <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-black dark:text-white">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm md:text-base text-black dark:text-white">
                      {project.description}
                    </CardDescription>
                  </div>

                  <div className="flex gap-3 sm:gap-4 justify-center mt-6 sm:mt-12">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border p-2 sm:p-3 bg-white text-black border-black hover:bg-black hover:text-white 
                                dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors"
                      >
                        <Globe size={18} />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border p-2 sm:p-3 bg-white text-black border-black hover:bg-black hover:text-white 
                                dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.figma && (
                      <a
                        href={project.figma}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border p-2 sm:p-3 bg-white text-black border-black hover:bg-black hover:text-white 
                                dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors"
                      >
                        <Figma size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </HoverEffect>

      {PROJECTS.length > 6 && (
        <div className="flex justify-center mt-8 sm:mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-3 border border-gray-700 dark:border-gray-300 rounded-full 
                       text-sm sm:text-base 
                       text-gray-900 dark:text-gray-100 
                       hover:bg-gray-900 hover:text-white 
                       dark:hover:bg-white dark:hover:text-black 
                       transition-colors"
          >
            {showAll ? "Show Less" : "Show More"}
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </section>
  );
}
