"use client"

import { motion } from "framer-motion"

function GoldSpark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <defs>
        <linearGradient id="gs" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#D7C485"/>
          <stop offset="50%"  stopColor="#B59E5F"/>
          <stop offset="100%" stopColor="#424769"/>
        </linearGradient>
      </defs>
      <path d="M7 0.5C7 0.5 8.2 5.2 11.5 7C8.2 8.8 7 13.5 7 13.5C7 13.5 5.8 8.8 2.5 7C5.8 5.2 7 0.5 7 0.5Z"
        fill="url(#gs)"/>
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
      className="ask-pill press gleam-on-load"
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
        border: "none",
      }}
    >
      <GoldSpark />
      <span style={{
        fontFamily: "var(--f-title)",
        fontSize: "0.6rem",
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--hushed)",
      }}>Ask</span>
    </motion.button>
  )
}
