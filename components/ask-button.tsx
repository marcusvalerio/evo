"use client"

import { motion } from "framer-motion"

function SparkSVG() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="sg" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#D7C485"/>
          <stop offset="100%" stopColor="#B59E5F"/>
        </linearGradient>
      </defs>
      <path d="M7 0.5C7 0.5 8 5 11.5 7C8 9 7 13.5 7 13.5C7 13.5 6 9 2.5 7C6 5 7 0.5 7 0.5Z"
        fill="url(#sg)"/>
    </svg>
  )
}

export function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.2 }}
      whileTap={{ opacity: 0.6 }}
      className="press"
      style={{
        position: "fixed",
        top: "max(env(safe-area-inset-top), 14px)",
        right: 16,
        marginTop: 10,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 13px",
        background: "var(--card-bg)",
        border: "1px solid var(--accent-primary)",
        cursor: "pointer",
      }}
    >
      <SparkSVG />
      <span
        style={{
          fontFamily: "var(--f-head)",
          fontSize: "0.6rem",
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "var(--accent-secondary)",
        }}
      >
        Ask
      </span>
    </motion.button>
  )
}
