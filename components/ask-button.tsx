"use client"

import { motion } from "framer-motion"

function SparkSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <defs>
        <linearGradient id="sp" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FF3A3A"/>
          <stop offset="30%"  stopColor="#FF8C00"/>
          <stop offset="60%"  stopColor="#FFD600"/>
          <stop offset="100%" stopColor="#3A8FFF"/>
        </linearGradient>
      </defs>
      <path d="M8 0.5C8 0.5 9.2 5.8 13.5 8C9.2 10.2 8 15.5 8 15.5C8 15.5 6.8 10.2 2.5 8C6.8 5.8 8 0.5 8 0.5Z"
        fill="url(#sp)"/>
    </svg>
  )
}

export function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.25 }}
      whileTap={{ opacity: 0.7 }}
      className="ask-pill press"
      style={{
        position: 'fixed',
        top: 'max(env(safe-area-inset-top), 14px)',
        right: 16,
        marginTop: 10,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 14px',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <SparkSVG />
      <span style={{
        fontFamily: 'var(--f-body)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
      }}>
        Ask
      </span>
    </motion.button>
  )
}
