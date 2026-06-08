"use client"

import { motion, AnimatePresence } from "framer-motion"

export type MenuTabId = "compras" | "receitas" | "gastos" | "extrato" | "perfil" | "config"

const ITEMS: { id: MenuTabId; label: string; sub: string }[] = [
  { id: "extrato",  label: "Extrato",          sub: "Telemetria de aderência" },
  { id: "compras",  label: "Lista de Compras",  sub: "Semana" },
  { id: "receitas", label: "Receitas",           sub: "Cozinha real" },
  { id: "gastos",   label: "Gastos",             sub: "Alimentação" },
  { id: "perfil",   label: "Perfil",             sub: "Dados" },
  { id: "config",   label: "Config",             sub: "Sistema" },
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              background: 'rgba(0,0,0,0.85)',
            }}/>
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: [.4,0,.2,1] }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              zIndex: 70, width: 260,
              background: '#000000',
              borderLeft: '1px solid #222',
              display: 'flex', flexDirection: 'column',
            }}>
            {/* Header */}
            <div className="pt-safe" style={{
              padding: '14px 16px', borderBottom: '1px solid #222',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--f-logo)', fontSize: '1rem',
                  letterSpacing: '0.14em', color: '#fff',
                }}>EVO</div>
                {userName && (
                  <div style={{
                    fontFamily: 'var(--f-body)', fontSize: '0.6rem',
                    fontWeight: 300, color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3,
                  }}>{userName}</div>
                )}
              </div>
              <button onClick={onClose} className="press btn-ghost"
                style={{ padding: '7px 11px', fontSize: '0.6rem' }}>
                ✕
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {ITEMS.map((item, i) => (
                <button key={item.id}
                  onClick={() => { onSelect(item.id); onClose() }}
                  className="press"
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '14px 16px',
                    background: 'transparent', border: 'none',
                    borderBottom: '1px solid #111',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--f-head)',
                      fontSize: '0.72rem', textTransform: 'uppercase',
                      letterSpacing: '0.12em', color: '#fff',
                    }}>{item.label}</div>
                    <div style={{
                      fontFamily: 'var(--f-body)', fontSize: '0.55rem',
                      fontWeight: 300, color: 'rgba(255,255,255,0.25)',
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3,
                    }}>{item.sub}</div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>→</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #222' }} className="pb-safe">
              <div style={{
                fontFamily: 'var(--f-body)', fontSize: '0.52rem',
                fontWeight: 300, color: 'rgba(255,255,255,0.15)',
                textTransform: 'uppercase', letterSpacing: '0.14em',
              }}>evo-weld.vercel.app</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
