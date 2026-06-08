"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Utensils, TrendingUp, BookOpen, MoreHorizontal } from "lucide-react"

export type TabId = "home" | "dieta" | "progresso" | "reflexao" | "menu"

const TABS = [
  { id: "home" as TabId,      Icon: LayoutDashboard, label: "Home" },
  { id: "dieta" as TabId,     Icon: Utensils,        label: "Dieta" },
  { id: "progresso" as TabId, Icon: TrendingUp,      label: "Evolução" },
  { id: "reflexao" as TabId,  Icon: BookOpen,        label: "Reflexão" },
  { id: "menu" as TabId,      Icon: MoreHorizontal,  label: "Mais" },
]

export function Navigation({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="nav-bar fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ maxWidth: 480, margin: '0 auto', left: 0, right: 0 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        {TABS.map(({ id, Icon, label }, i) => {
          const on = active === id
          return (
            <button key={id} onClick={() => onChange(id)}
              className="press"
              style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4, paddingTop: 12, paddingBottom: 10,
                background: 'transparent', border: 'none',
                borderRight: i < TABS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                cursor: 'pointer',
              }}>
              {/* Active line — orange 2px at top */}
              {on && (
                <motion.div
                  layoutId="nav-line"
                  style={{
                    position: 'absolute', top: -1, left: 0, right: 0,
                    height: 2, background: 'var(--orange)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <Icon
                size={17}
                style={{
                  color: on ? '#FFFFFF' : 'rgba(255,255,255,0.28)',
                  strokeWidth: on ? 2 : 1.5,
                  transition: 'color 0.15s',
                }}
              />
              <span style={{
                fontFamily: 'var(--f-body)',
                fontSize: '0.52rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: on ? '#FFFFFF' : 'rgba(255,255,255,0.22)',
                transition: 'color 0.15s',
              }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
