"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index — multiplies the delay for sequential reveals. */
  index?: number;
  delay?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Fades + slides content up as it enters the viewport. Reduced-motion safe. */
export function Reveal({
  children,
  className,
  index = 0,
  delay = 0,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay: delay + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
