"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, ease: "easeOut" }} className={className}>{children}</motion.div>;
}
