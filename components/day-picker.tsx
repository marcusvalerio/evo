"use client"

import { DAYS } from "@/lib/data"
import { getDayProgressReal } from "@/lib/helpers"

interface Props {
  selectedDay: number
  onDayChange: (d: number) => void
  checked: Record<string, boolean>
}

export function DayPicker({ selectedDay, onDayChange, checked }: Props) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const D = ['S','T','Q','Q','S','S','D']

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
      borderBottom: '1px solid rgba(66,71,105,0.35)',
      background: 'var(--canvas)',
    }}>
      {DAYS.map((day, idx) => {
        const sel = idx === selectedDay
        const today = idx === todayIdx
        const pct = getDayProgressReal(day, checked)
        const done = pct === 100

        return (
          <button key={day} onClick={() => onDayChange(idx)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 5, padding: '10px 0',
              background: sel ? 'rgba(27,41,75,0.25)' : 'transparent',
              border: 'none',
              borderRight: idx < 6 ? '1px solid rgba(66,71,105,0.2)' : 'none',
              borderTop: sel ? '2px solid var(--gold)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'background 0.1s',
            }}>
            <span style={{
              fontFamily: 'var(--f-head)',
              fontSize: '0.48rem', textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: today ? 'var(--text)' : 'var(--text-2)',
            }}>
              {D[idx]}
            </span>
            <div style={{
              width: 20, height: 20,
              border: done ? '1px solid var(--gold)' : sel ? '1px solid rgba(181,158,95,0.5)' : '1px solid var(--cobalt)',
              background: done ? 'var(--gold)' : 'transparent',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {done ? (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="var(--canvas)" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : pct > 0 ? (
                <span style={{
                  fontFamily: 'var(--f-body)', fontSize: '0.4rem',
                  fontWeight: 400, color: 'var(--text-2)',
                }}>{pct}%</span>
              ) : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}
