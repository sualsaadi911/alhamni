"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        ease: [0.22, 1, 0.36, 1],
        duration: 0.8
      }}
    >
      {children}
    </motion.div>
  );
}
