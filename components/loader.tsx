"use client";
import { motion, Variants } from "framer-motion";

const barVariants: Variants = {
  initial: {
    scaleY: 0.4,
    opacity: 0.3,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: 1000,
      repeatType: "mirror",
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export default function BarLoader() {
  return (
    <motion.div
      className="flex gap-1"
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: 0.15 }}
    >
      {[...Array(5)].map((_, idx) => (
        <motion.div
          key={idx}
          variants={barVariants}
          className="h-10 w-1 bg-black dark:bg-white rounded-md"
        />
      ))}
    </motion.div>
  );
}
