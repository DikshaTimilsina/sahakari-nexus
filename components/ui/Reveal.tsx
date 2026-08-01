"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  // Content placed between <Reveal> and </Reveal>.
  children: ReactNode;

  // Optional delay, measured in seconds.
  delay?: number;
};

export function Reveal({ children, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}