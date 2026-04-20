import { motion } from "framer-motion";

interface WaveAnimationProps {
  isPlaying: boolean;
}

export default function WaveAnimation({ isPlaying }: WaveAnimationProps) {
  const waveVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.8, 0.3, 0.8],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    initial: {
      scale: 1,
      opacity: 0.8,
    },
  };

  if (!isPlaying) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="absolute rounded-full border-2 border-black/60 dark:border-white/60"
        style={{ width: "100%", height: "100%" }}
        initial="initial"
        animate="animate"
        variants={{
          ...waveVariants,
          animate: {
            ...waveVariants.animate,
            transition: {
              ...waveVariants.animate.transition,
              delay: 0,
            },
          },
        }}
      />
      <motion.div
        className="absolute rounded-full border-2 border-black/40 dark:border-white/40"
        style={{ width: "100%", height: "100%" }}
        initial="initial"
        animate="animate"
        variants={{
          ...waveVariants,
          animate: {
            ...waveVariants.animate,
            transition: {
              ...waveVariants.animate.transition,
              delay: 0.2,
            },
          },
        }}
      />
    </div>
  );
}
