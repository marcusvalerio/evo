"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Utensils, TrendingUp, BookOpen, MoreHorizontal } from "lucide-react"

export type TabId = "home" | "dieta" | "progresso" | "reflexao" | "menu"

const TABS = [
  { id: "home"      as TabId, Icon: LayoutDashboard, label: "Home" },
  { id: "dieta"     as TabId, Icon: Utensils,        label: "Dieta" },
  { id: "progresso" as TabId, Icon: TrendingUp,      label: "Evolução" },
  { id: "reflexao"  as TabId, Icon: BookOpen,        label: "Reflexão" },
  { id: "menu"      as TabId, Icon: MoreHorizontal,  label: "Mais" },
]

export function Navigation({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="nav-bar pb-safe">
      {TABS.map(({ id, Icon, label }) => {
        const on = active === id
        return (
          <button key={id} onClick={() => onChange(id)} className="nav-item press">
            {on && (
              <motion.div
                layoutId="nav-mp176"
                className="nav-active-line"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <Icon size={17} style={{
              color: on ? "var(--gold)" : "var(--text-2)",
              strokeWidth: on ? 2 : 1.5,
              transition: "color 0.15s",
            }}/>
            <span style={{
              fontFamily: "var(--f-head)",
              fontSize: "0.5rem", textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: on ? "var(--gold)" : "var(--text-2)",
              transition: "color 0.15s",
            }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
