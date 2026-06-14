"use client"

import { motion } from "framer-motion"
import { ProgressRing } from "./progress-ring"

interface HeaderProps {
  title: string
  subtitle?: string
  progress?: number
  showBrand?: boolean
}

export function Header({ title, subtitle, progress, showBrand = false }: HeaderProps) {
  return (
    <header className="pt-safe" style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "rgba(0,28,42,0.88)",
      backdropFilter: "blur(32px)",
      WebkitBackdropFilter: "blur(32px)",
      borderBottom: "1px solid var(--border-soft)",
    }}>
      <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {showBrand ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34,
                borderRadius: 10,
                background: "var(--sco-dim)",
                border: "1px solid var(--border-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "var(--f-logo)", fontSize: "0.9rem", color: "var(--scoville)" }}>E</span>
              </div>
              <div>
                <div style={{ fontFamily: "var(--f-logo)", fontSize: "1.1rem", letterSpacing: "0.14em", color: "var(--feather)", lineHeight: 1 }}>{title}</div>
                {subtitle && (
                  <div style={{ fontFamily: "var(--f-body)", fontSize: "0.46rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--t3)", marginTop: 2 }}>{subtitle}</div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {subtitle && (
                <div style={{ fontFamily: "var(--f-body)", fontSize: "0.46rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--t3)", marginBottom: 2 }}>{subtitle}</div>
              )}
              <div style={{ fontFamily: "var(--f-title)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--t1)" }}>{title}</div>
            </div>
          )}
        </motion.div>

        {progress !== undefined && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25, delay: 0.1 }}>
            <ProgressRing progress={progress} color={progress === 100 ? "success" : "primary"} />
          </motion.div>
        )}
      </div>
    </header>
  )
}
