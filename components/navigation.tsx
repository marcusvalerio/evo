"use client"

import { motion } from "framer-motion"
import { LayoutDashboard, Utensils, TrendingUp, Sparkles, Menu } from "lucide-react"

export type TabId = "home" | "dieta" | "progresso" | "ia" | "menu"

const TABS = [
  { id: "home" as TabId,      Icon: LayoutDashboard, label: "Home" },
  { id: "dieta" as TabId,     Icon: Utensils,        label: "Dieta" },
  { id: "progresso" as TabId, Icon: TrendingUp,      label: "Progresso" },
  { id: "ia" as TabId,        Icon: Sparkles,        label: "EVO IA" },
  { id: "menu" as TabId,      Icon: Menu,            label: "Menu" },
]

interface Props {
  active: TabId
  onChange: (t: TabId) => void
}

export function Navigation({ active, onChange }: Props) {
  return (
    <nav
      className="liquid-nav fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ maxWidth: 480, margin: "0 auto", left: 0, right: 0 }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {TABS.map(({ id, Icon, label }) => {
          const isActive = active === id
          const isIA = id === "ia"
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-col items-center gap-1 px-3 py-2 press"
            >
              {/* Active pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: isIA
                      ? "linear-gradient(135deg, rgba(238,255,153,0.18), rgba(26,149,151,0.18))"
                      : "rgba(26,149,151,0.15)",
                    border: `1px solid ${isIA ? "rgba(238,255,153,0.3)" : "rgba(26,149,151,0.3)"}`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {/* Icon */}
              <span
                className="relative z-10 transition-all duration-200"
                style={{
                  filter: isActive
                    ? isIA
                      ? "drop-shadow(0 0 8px #EEFF99) drop-shadow(0 0 20px rgba(238,255,153,0.4))"
                      : "drop-shadow(0 0 6px #1A9597) drop-shadow(0 0 16px rgba(26,149,151,0.4))"
                    : "none",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: isActive
                      ? isIA ? "#EEFF99" : "#1A9597"
                      : "rgba(238,242,243,0.38)",
                    strokeWidth: isActive ? 2.2 : 1.7,
                  }}
                />
              </span>
              {/* Label */}
              <span
                className="relative z-10 font-mono text-[8.5px] uppercase tracking-wider transition-all duration-200"
                style={{
                  color: isActive
                    ? isIA ? "#EEFF99" : "#1A9597"
                    : "rgba(238,242,243,0.3)",
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
