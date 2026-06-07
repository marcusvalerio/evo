"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Utensils, TrendingUp, Menu, BookOpen } from "lucide-react"

export type TabId = "home" | "dieta" | "progresso" | "reflexao" | "menu"

const TABS = [
  { id: "home" as TabId,      Icon: LayoutDashboard, label: "Home" },
  { id: "dieta" as TabId,     Icon: Utensils,        label: "Dieta" },
  { id: "progresso" as TabId, Icon: TrendingUp,      label: "Evolução" },
  { id: "reflexao" as TabId,  Icon: BookOpen,        label: "Reflexão" },
  { id: "menu" as TabId,      Icon: Menu,            label: "Mais" },
]

export function Navigation({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    // Wrapper positioned fixed at bottom
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)', paddingLeft: 16, paddingRight: 16, paddingTop: 12 }}>
      {/* Pill container (ref 3 style) */}
      <div className="nav-pill flex items-center gap-1 px-2 py-2">
        {TABS.map(({ id, Icon, label }) => {
          const on = active === id
          return (
            <button key={id} onClick={() => onChange(id)}
              className="press relative flex flex-col items-center gap-1 px-3 py-2 rounded-[100px] transition-all"
              style={{ minWidth: 52 }}>
              {on && (
                <motion.div layoutId="nav-active"
                  className="absolute inset-0 rounded-[100px]"
                  style={{
                    background: 'rgba(26,149,151,0.14)',
                    border: '1px solid rgba(26,149,151,0.28)',
                  }}
                  transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                />
              )}
              {/* Icon with optional label expand when active (ref 3) */}
              <div className="relative z-10 flex items-center gap-1.5">
                <Icon size={18}
                  className={on ? 'glow-teal' : ''}
                  style={{
                    color: on ? 'var(--primary)' : 'var(--fg-3)',
                    strokeWidth: on ? 2.2 : 1.7,
                    transition: 'color .2s',
                  }}
                />
                {on && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.7rem', fontWeight: 600,
                      color: 'var(--primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden',
                    }}>
                    {label}
                  </motion.span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
