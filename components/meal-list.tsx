"use client"

import { motion } from "framer-motion"
import { MEALS, MEAL_ORDER, DayName } from "@/lib/data"
import { getMealProgress } from "@/lib/helpers"

const MEAL_LABEL: Record<string, string> = {
  "Cafe da Manha": "Café da Manhã",
  "Almoco": "Almoço",
  "Lanche da Tarde": "Lanche",
  "Jantar": "Jantar",
}

interface Props {
  dayName: DayName
  checked: Record<string, boolean>
  onToggle: (key: string) => void
}

export function MealList({ dayName, checked, onToggle }: Props) {
  return (
    <div style={{ borderTop: '1px solid #222' }}>
      {MEAL_ORDER.map((meal, mi) => {
        const items = MEALS[dayName][meal] || []
        const { done, total } = getMealProgress(dayName, meal, checked)
        const pct = total ? Math.round((done / total) * 100) : 0
        const allDone = done === total && total > 0

        return (
          <div key={meal} style={{ borderBottom: '1px solid rgba(66,71,105,0.35)' }}>
            {/* Meal header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'var(--container)',
              borderBottom: '1px solid rgba(66,71,105,0.35)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {allDone && (
                  <div style={{
                    width: 6, height: 6,
                    background: 'var(--gold)',
                    flexShrink: 0,
                  }}/>
                )}
                <span style={{
                  fontFamily: 'var(--f-head)',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: allDone ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                }}>
                  {MEAL_LABEL[meal] || meal}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--f-body)',
                fontSize: '0.58rem',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.12em',
              }}>
                {done}/{total}
              </span>
            </div>

            {/* 2px progress */}
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${pct}%` }}/>
            </div>

            {/* Items */}
            {items.map((it, i) => {
              const key = `${dayName}__${meal}__${i}`
              const on = !!checked[key]
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: mi * 0.05 + i * 0.02 }}
                  onClick={() => onToggle(key)}
                  className="press"
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', alignItems: 'center',
                    gap: 14, padding: '11px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: i < items.length - 1 ? '1px solid #111' : 'none',
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, flexShrink: 0, borderRadius: 5,
                    border: `1px solid ${on ? 'var(--gold)' : '#333'}`,
                    background: on ? 'var(--gold)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.1s',
                  }}>
                    {on && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="#000" strokeWidth="1.5"
                          strokeLinecap="square" strokeLinejoin="miter"/>
                      </svg>
                    )}
                  </div>

                  {/* Item text */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontFamily: 'var(--f-body)',
                      fontSize: '0.82rem',
                      fontWeight: 300,
                      color: on ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)',
                      textDecoration: on ? 'line-through' : 'none',
                      textDecorationColor: '#333',
                    }}>
                      {it.item}
                    </span>
                    {it.isCreatine && (
                      <span style={{
                        marginLeft: 8,
                        fontFamily: 'var(--f-body)',
                        fontSize: '0.48rem',
                        fontWeight: 400,
                        textTransform: 'uppercase',
                        letterSpacing: '0.18em',
                        color: '#FF6B00',
                        border: '1px solid var(--gold)',
                        borderRadius: 4,
                        padding: '1px 5px',
                        verticalAlign: 'middle',
                      }}>SUPL</span>
                    )}
                  </div>

                  {/* Qty */}
                  <span style={{
                    fontFamily: 'var(--f-body)',
                    fontSize: '0.62rem',
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.06em',
                    flexShrink: 0,
                  }}>
                    {it.qty}
                  </span>
                </motion.button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
