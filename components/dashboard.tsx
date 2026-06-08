"use client"

import { motion } from "framer-motion"
import { DAYS, DayName } from "@/lib/data"
import { getDayProgressReal, calcStreak, fmtDate, WeightEntry, DayEval, pad } from "@/lib/helpers"

/* ── WHOOP ARC — brutalista ── */
function BrutalArc({ pct }: { pct: number }) {
  const S = 180, sw = 8, r = (S - sw) / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.72
  const offset = arc - (pct / 100) * arc
  const done = pct === 100

  return (
    <div style={{ position: 'relative', width: S, height: S }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ transform: 'rotate(144deg)' }}>
        <circle cx={S/2} cy={S/2} r={r} fill="none"
          stroke="rgba(255,255,255,0.08)" strokeWidth={sw} strokeLinecap="square"
          strokeDasharray={`${arc} ${circ}`}/>
        <motion.circle cx={S/2} cy={S/2} r={r} fill="none"
          stroke={done ? 'var(--orange)' : '#FFFFFF'} strokeWidth={sw} strokeLinecap="square"
          strokeDasharray={`${arc} ${circ}`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [.4,0,.2,1], delay: 0.2 }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{
            fontFamily: 'var(--f-logo)', fontSize: '3rem', fontWeight: 700,
            color: done ? 'var(--orange)' : '#FFFFFF',
            letterSpacing: '-0.02em', lineHeight: 1,
          }}>
          {pct}%
        </motion.span>
        <span className="label" style={{ marginTop: 4 }}>dieta hoje</span>
      </div>
    </div>
  )
}

/* ── MINI LINE CHART ── */
function MiniLine({ weights }: { weights: WeightEntry[] }) {
  const s = [...weights].sort((a,b) => a.date.localeCompare(b.date)).slice(-8)
  if (s.length < 2) return <div style={{ height: 32 }}/>
  const vals = s.map(w => w.val)
  const min = Math.min(...vals) - 0.3, max = Math.max(...vals) + 0.3
  const W = 80, H = 32, p = 4
  const x = (i: number) => p + (i/(s.length-1))*(W-p*2)
  const y = (v: number) => H - p - ((v-min)/(max-min))*(H-p*2)
  const pts = s.map((w,i) => `${x(i)},${y(w.val)}`).join(' ')
  const diff = s[s.length-1].val - s[s.length-2].val

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H, overflow: 'visible' }}>
        <polyline points={pts} fill="none" stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="square"/>
        <rect x={x(s.length-1)-1} y={y(s[s.length-1].val)-1}
          width="3" height="3" fill={diff <= 0 ? 'var(--orange)' : '#FF3A3A'}/>
      </svg>
      <div style={{ marginTop: 2 }}>
        <span className="label" style={{
          color: diff <= 0 ? 'var(--orange)' : '#FF4444',
        }}>
          {diff > 0 ? '+' : ''}{diff.toFixed(1)}kg
        </span>
      </div>
    </div>
  )
}

/* ── WEEK ROW ── */
function WeekRow({ checked }: { checked: Record<string, boolean> }) {
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {DAYS.map((day, idx) => {
        const pct = getDayProgressReal(day, checked)
        const done = pct === 100
        const isToday = idx === today
        return (
          <div key={day} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '10px 0',
            borderRight: idx < 6 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            background: isToday ? 'rgba(255,255,255,0.03)' : 'transparent',
          }}>
            <span style={{
              fontFamily: 'var(--f-body)', fontSize: '0.48rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              color: isToday ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
              marginBottom: 6,
            }}>
              {day.slice(0,3)}
            </span>
            {done ? (
              <div style={{
                width: 20, height: 20,
                background: 'var(--orange)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="#000" strokeWidth="1.5"
                    strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              </div>
            ) : (
              <div style={{
                width: 20, height: 20,
                border: isToday ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {pct > 0 && (
                  <span style={{
                    fontFamily: 'var(--f-body)', fontSize: '0.42rem', fontWeight: 600,
                    color: 'rgba(255,255,255,0.5)',
                  }}>{pct}%</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── METRIC CELL — grid modular ── */
function Cell({ label, value, unit, sub, viz, borderRight, accent }: {
  label: string; value: string; unit?: string; sub?: string
  viz?: React.ReactNode; borderRight?: boolean; accent?: boolean
}) {
  return (
    <div style={{
      padding: '16px',
      borderRight: borderRight ? '1px solid rgba(255,255,255,0.06)' : 'none',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="label" style={{ marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <span style={{
            fontFamily: 'var(--f-logo)', fontSize: '2.2rem', fontWeight: 700,
            color: accent ? 'var(--orange)' : '#FFFFFF',
            letterSpacing: '-0.02em', lineHeight: 1,
          }}>{value}</span>
          {unit && (
            <span style={{
              fontFamily: 'var(--f-body)', fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.35)', marginLeft: 4,
            }}>{unit}</span>
          )}
          {sub && (
            <div className="label" style={{ marginTop: 4, color: 'rgba(255,255,255,0.2)' }}>{sub}</div>
          )}
        </div>
        {viz}
      </div>
    </div>
  )
}

/* ── PROGRESS BAR — 2px laranja ── */
function ProgressBar({ pct, label }: { pct: number; label: string }) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span className="label">{label}</span>
        <span className="label" style={{ color: 'rgba(255,255,255,0.45)' }}>{pct}%</span>
      </div>
      <div className="progress-track">
        <motion.div className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [.4,0,.2,1], delay: 0.3 }}/>
      </div>
    </div>
  )
}

/* ── MAIN ── */
interface Props {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  evals: Record<string, DayEval>
}

export function Dashboard({ checked, weights, evals }: Props) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const todayName = DAYS[todayIdx]
  const pct = getDayProgressReal(todayName, checked)
  const streak = calcStreak(checked)
  const sortedW = [...weights].sort((a,b) => b.date.localeCompare(a.date))
  const completedDays = DAYS.filter(d => getDayProgressReal(d, checked) === 100).length
  const days = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"]
  const h = new Date().getHours()
  const period = h < 12 ? "MANHÃ" : h < 18 ? "TARDE" : "NOITE"

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* ── HERO — arc + status ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'var(--surface)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Top status bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span className="label">{days[new Date().getDay()]} · {period}</span>
          {streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 4, height: 4, background: 'var(--orange)' }}/>
              <span className="label" style={{ color: 'var(--orange)' }}>
                {streak} {streak === 1 ? 'DIA' : 'DIAS'} STREAK
              </span>
            </div>
          )}
        </div>

        {/* Arc + bars */}
        <div style={{ padding: '24px 16px 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
          }}>
            {/* Arc */}
            <div style={{ flexShrink: 0 }}>
              <BrutalArc pct={pct}/>
            </div>

            {/* Right stats */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0,
              borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <ProgressBar pct={pct} label="Dieta hoje"/>
              <ProgressBar pct={Math.round((completedDays/7)*100)} label="Meta semanal"/>
              <ProgressBar pct={Math.min(streak * 14, 100)} label="Streak score"/>
            </div>
          </div>
        </div>

        {/* Week row */}
        <WeekRow checked={checked}/>
      </motion.div>

      {/* ── GRID TÉCNICO 2x2 ── */}
      <div style={{ background: 'var(--void)' }}>
        <div className="grid-2">
          <Cell label="Streak" value={String(streak)} unit="dias" borderRight
            accent={streak >= 7}
            viz={
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                {[...Array(Math.min(streak, 7) || 1)].map((_,i) => (
                  <div key={i} style={{
                    width: 4, background: i < Math.min(streak,7) ? 'var(--orange)' : 'rgba(255,255,255,0.1)',
                    height: 6 + i * 5,
                  }}/>
                ))}
              </div>
            }
          />
          <Cell label="Peso atual"
            value={sortedW[0] ? String(sortedW[0].val) : '--'} unit="kg"
            viz={sortedW.length >= 2 ? <MiniLine weights={weights}/> : undefined}
          />
          <Cell label="Semana" value={`${completedDays}`} unit="/7 dias" borderRight
            sub={`${Math.round((completedDays/7)*100)}% da meta`}
          />
          <Cell label="Dieta hoje" value={`${pct}`} unit="%"
            accent={pct === 100}
          />
        </div>
      </div>

      {/* ── AVALIACOES ── */}
      {Object.keys(evals).length > 0 && (
        <div style={{
          background: 'var(--void)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          marginTop: 1,
        }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="label">Avaliações recentes</span>
          </div>
          {Object.entries(evals)
            .sort(([a],[b]) => b.localeCompare(a)).slice(0,3)
            .map(([date, ev], i) => (
              <div key={date} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontFamily: 'var(--f-body)', fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
                  {fmtDate(date)}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ev.humor && <span style={{ fontSize: '1rem' }}>{ev.humor}</span>}
                  {ev.energia && <span style={{ fontSize: '1rem' }}>{ev.energia}</span>}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
