"use client";

import * as motion from "motion/react-client";

export default function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
}
