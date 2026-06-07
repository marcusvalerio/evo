"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Utensils,
  ShoppingCart,
  BookOpen,
  Wallet,
} from "lucide-react"

export type TabId = "dashboard" | "dieta" | "compras" | "receitas" | "financeiro"

interface Tab {
  id: TabId
  icon: LucideIcon
  label: string
}

const TABS: Tab[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Home" },
  { id: "dieta", icon: Utensils, label: "Dieta" },
  { id: "compras", icon: ShoppingCart, label: "Compras" },
  { id: "receitas", icon: BookOpen, label: "Receitas" },
  { id: "financeiro", icon: Wallet, label: "Gastos" },
]

interface NavigationProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav safe-area-pb">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-2 px-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-2xl px-4 py-2.5 transition-all",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-primary"
                    style={{ boxShadow: "0 0 20px rgba(57,224,122,0.3)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className={cn(
                  "relative z-10 h-[18px] w-[18px] transition-transform",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "relative z-10 font-mono text-[7.5px] uppercase tracking-wider font-medium",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
