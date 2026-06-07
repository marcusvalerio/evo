"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, BookOpen, Wallet, Settings, User, ChevronRight, LogOut } from "lucide-react"

export type MenuTabId = "compras" | "receitas" | "gastos" | "perfil" | "config"

const ITEMS = [
  { id: "compras" as MenuTabId,  Icon: ShoppingCart, label: "Lista de Compras", sub: "Semana organizada" },
  { id: "receitas" as MenuTabId, Icon: BookOpen,      label: "Receitas",          sub: "Cozinha real" },
  { id: "gastos" as MenuTabId,   Icon: Wallet,        label: "Controle de Gastos", sub: "Alimentacao" },
  { id: "perfil" as MenuTabId,   Icon: User,          label: "Perfil",            sub: "Seus dados" },
  { id: "config" as MenuTabId,   Icon: Settings,      label: "Configuracoes",     sub: "Preferencias" },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (id: MenuTabId) => void
  userName?: string
}

export function SideMenu({ open, onClose, onSelect, userName }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,20,0.7)", backdropFilter: "blur(8px)" }}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-80 flex flex-col"
            style={{
              background: "rgba(4, 4, 40, 0.96)",
              backdropFilter: "blur(40px)",
              borderLeft: "1px solid rgba(26,149,151,0.2)",
            }}
          >
            {/* Header */}
            <div className="pt-safe px-6 pb-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[9px] uppercase tracking-[3px] text-white/30">EVO</span>
                <button
                  onClick={onClose}
                  className="press flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <X size={16} className="text-white/50" />
                </button>
              </div>
              {userName && (
                <div>
                  <div className="text-xl font-black text-white tracking-tight">Oi, {userName}</div>
                  <div className="font-mono text-[10px] text-white/35 mt-0.5 uppercase tracking-wider">Bem-vindo de volta</div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              {ITEMS.map(({ id, Icon, label, sub }) => (
                <button
                  key={id}
                  onClick={() => { onSelect(id); onClose(); }}
                  className="press w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ background: "rgba(26,149,151,0.12)", border: "1px solid rgba(26,149,151,0.2)" }}
                  >
                    <Icon size={18} style={{ color: "#1A9597" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-white/85">{label}</div>
                    <div className="font-mono text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{sub}</div>
                  </div>
                  <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-safe pb-4 border-t border-white/5 pt-4">
              <button
                className="press w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
                style={{ background: "rgba(240,80,80,0.08)", border: "1px solid rgba(240,80,80,0.15)" }}
              >
                <LogOut size={16} style={{ color: "rgba(240,80,80,0.8)" }} />
                <span className="text-sm font-medium" style={{ color: "rgba(240,80,80,0.8)" }}>Sair</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
