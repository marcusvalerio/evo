"use client"

import { motion } from "framer-motion"
import { SHOPPING } from "@/lib/data"

interface Props {
  shopChecked: Record<string, boolean>
  onToggle: (key: string) => void
  onClear: () => void
}

export function ShoppingList({ shopChecked, onToggle, onClear }: Props) {
  const total = SHOPPING.reduce((a, c) => a + c.items.length, 0)
  const done = Object.values(shopChecked).filter(Boolean).length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div style={{
        padding: '12px 16px', background: 'var(--container)',
        borderBottom: '1px solid rgba(66,71,105,0.35)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--f-title)', fontSize: '0.58rem',
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.3)', marginBottom: 4,
          }}>Itens marcados</div>
          <div style={{
            fontFamily: 'var(--f-body)', fontSize: '1.4rem',
            fontWeight: 300, color: 'var(--text)',
          }}>
            {done}<span style={{ fontSize: '0.7rem', color: 'var(--text-2)', marginLeft: 4 }}>/{total}</span>
          </div>
        </div>
        <button onClick={onClear} className="btn-ghost"
          style={{ padding: '8px 14px' }}>
          RESET
        </button>
      </div>

      {/* Progress */}
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%` }}/>
      </div>

      {/* Categories */}
      {SHOPPING.map((cat, ci) => {
        const catDone = cat.items.filter((_,i) => shopChecked[`${cat.category}__${i}`]).length
        return (
          <div key={cat.category} style={{ borderBottom: '1px solid #222' }}>
            <div style={{
              padding: '9px 16px', background: 'var(--container)',
              borderBottom: '1px solid rgba(66,71,105,0.2)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{
                fontFamily: 'var(--f-title)', fontSize: '0.6rem',
                textTransform: 'uppercase', letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.4)',
              }}>{cat.category}</span>
              <span style={{
                fontFamily: 'var(--f-body)', fontSize: '0.55rem',
                fontWeight: 300, color: 'rgba(255,255,255,0.2)',
              }}>{catDone}/{cat.items.length}</span>
            </div>
            {cat.items.map((item, i) => {
              const key = `${cat.category}__${i}`
              const on = !!shopChecked[key]
              return (
                <button key={i} onClick={() => onToggle(key)}
                  className="press"
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '11px 16px', background: 'transparent', border: 'none',
                    borderBottom: i < cat.items.length - 1 ? '1px solid #111' : 'none',
                  }}>
                  <div style={{
                    width: 18, height: 18, flexShrink: 0, borderRadius: 5,
                    border: `1px solid ${on ? '#E34B26' : '#2a2a2a'}`,
                    background: on ? '#E34B26' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {on && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="#000" strokeWidth="1.5"
                          strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontFamily: 'var(--f-body)', fontSize: '0.8rem', fontWeight: 300,
                    color: on ? 'var(--text-2)' : 'rgba(255,255,255,0.75)',
                    textDecoration: on ? 'line-through' : 'none',
                    textDecorationColor: '#2a2a2a',
                  }}>{item}</span>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
