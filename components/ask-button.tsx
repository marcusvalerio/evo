"use client"

import { motion } from "framer-motion"

// Multicolor sparkle SVG (like the Ask reference images)
function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <defs>
        <linearGradient id="sg1" x1="11" y1="0" x2="11" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff4444"/>
          <stop offset="35%" stopColor="#ff8800"/>
          <stop offset="65%" stopColor="#ffdd00"/>
          <stop offset="100%" stopColor="#4488ff"/>
        </linearGradient>
        <linearGradient id="sg2" x1="0" y1="11" x2="22" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4488ff"/>
          <stop offset="100%" stopColor="#aa44ff"/>
        </linearGradient>
      </defs>
      {/* 4-pointed star shape */}
      <path
        d="M11 1 C11 1 12.5 7.5 18 11 C12.5 14.5 11 21 11 21 C11 21 9.5 14.5 4 11 C9.5 7.5 11 1 11 1Z"
        fill="url(#sg1)"
      />
      <path
        d="M11 4 C11 4 12 8.5 15.5 11 C12 13.5 11 18 11 18 C11 18 10 13.5 6.5 11 C10 8.5 11 4 11 4Z"
        fill="url(#sg2)"
        opacity="0.6"
      />
    </svg>
  )
}

interface Props {
  onClick: () => void
}

export function AskButton({ onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 320, damping: 24 }}
      whileTap={{ scale: 0.95 }}
      className="ask-pill press fixed z-40 flex items-center gap-2.5 px-4 py-2.5"
      style={{
        top: 'max(env(safe-area-inset-top), 14px)',
        right: 16,
        marginTop: 8,
      }}
    >
      <SparkleIcon />
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--fg-2)',
        letterSpacing: '-0.01em',
      }}>
        Ask
      </span>
    </motion.button>
  )
}
