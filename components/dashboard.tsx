"use client"

import { motion } from "framer-motion"
import { DAYS } from "@/lib/data"
import { getDayProgressReal, calcStreak, fmtDate, WeightEntry, DayEval } from "@/lib/helpers"

/* ── GOLD ARC ── */
function GoldArc({ pct }: { pct: number }) {
  const S = 160, sw = 8, r = (S - sw) / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.72
  const offset = arc - (pct / 100) * arc
  const isElite = pct >= 90

  return (
    <div style={{ position: "relative", width: S, height: S }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ transform: "rotate(144deg)" }}>
        <circle cx={S/2} cy={S/2} r={r} fill="none"
          stroke="var(--cobalt)" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}/>
        <motion.circle cx={S/2} cy={S/2} r={r} fill="none"
          stroke={isElite ? "var(--gold)" : "var(--cobalt)"}
          strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [.4,0,.2,1], delay: .2 }}
          style={{ filter: isElite ? "drop-shadow(0 0 4px rgba(181,158,95,0.5))" : "none" }}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{
            fontFamily: "var(--f-body)", fontSize: "2.2rem", fontWeight: 300,
            color: isElite ? "var(--gold)" : "var(--text)",
            lineHeight: 1, letterSpacing: "-0.02em",
          }}>
          {pct}%
        </motion.span>
        <span style={{
          fontFamily: "var(--f-head)", fontSize: "0.46rem",
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "var(--text-2)", marginTop: 4,
        }}>ADH</span>
      </div>
    </div>
  )
}

/* ── VECTOR DIRECTIVE ── */
function VectorDirective({ adh }: { adh: number }) {
  const stable = adh >= 90
  return (
    <div className="vector-directive">
      <div style={{
        fontFamily: "var(--f-head)", fontSize: "0.55rem",
        textTransform: "uppercase", letterSpacing: "0.2em",
        color: "var(--gold)", marginBottom: 8,
      }}>
        DIRETRIZ DE VETOR // {stable ? "ESTÁVEL" : "ALERTA"}
      </div>
      <p style={{
        fontFamily: "var(--f-body)", fontSize: "0.75rem", fontWeight: 300,
        color: stable ? "var(--text)" : "var(--gold-2)",
        lineHeight: 1.6, marginBottom: 8,
      }}>
        {stable
          ? "SISTEMA ESTÁVEL. A ESTRUTURA SUPORTA A CARGA ATUAL. MANTENHA A TRAÇÃO OPERACIONAL E O RITMO RÍGIDO."
          : "ALERTA DE DESVIO. A INÉRCIA ESTÁ AGINDO SOBRE O VETOR DE PERFORMANCE. RETOME A ROTA IMEDIATAMENTE."}
      </p>
      <div style={{
        fontFamily: "var(--f-body)", fontSize: "0.58rem", fontWeight: 300,
        color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.12em",
      }}>
        EFICIÊNCIA MECÂNICA SISTÊMICA //{" "}
        <span style={{ color: stable ? "var(--gold-2)" : "var(--gold)" }}>
          {stable ? "[STATUS: STABLE VECTOR]" : "[STATUS: CRITICAL DEVIATION]"}
        </span>
      </div>
    </div>
  )
}

/* ── WEEK STRIP ── */
function WeekStrip({ checked }: { checked: Record<string, boolean> }) {
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const L = ["S","T","Q","Q","S","S","D"]
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
      borderBottom: "1px solid rgba(66,71,105,0.35)",
    }}>
      {DAYS.map((day, idx) => {
        const pct = getDayProgressReal(day, checked)
        const done = pct === 100
        const isToday = idx === today
        return (
          <div key={day} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "10px 0",
            background: isToday ? "rgba(27,41,75,0.3)" : "transparent",
            borderRight: idx < 6 ? "1px solid rgba(66,71,105,0.25)" : "none",
            borderTop: isToday ? "2px solid var(--gold)" : "2px solid transparent",
          }}>
            <span style={{
              fontFamily: "var(--f-head)", fontSize: "0.44rem",
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: isToday ? "var(--gold-2)" : "var(--text-2)", marginBottom: 5,
            }}>{L[idx]}</span>
            <div style={{
              width: 20, height: 20, borderRadius: 4,
              border: done ? "1px solid var(--gold)"
                : isToday ? "1px solid rgba(181,158,95,0.4)"
                : "1px solid var(--cobalt)",
              background: done ? "var(--gold)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {done ? (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="var(--canvas)"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : pct > 0 ? (
                <span style={{
                  fontFamily: "var(--f-body)", fontSize: "0.38rem",
                  fontWeight: 400, color: "var(--text-2)",
                }}>{pct}%</span>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── METRIC CELL ── */
function MetricCell({ label, value, unit, sub, accent, borderRight, viz }: {
  label: string; value: string; unit?: string; sub?: string
  accent?: boolean; borderRight?: boolean; viz?: React.ReactNode
}) {
  return (
    <div style={{
      padding: "16px",
      borderRight: borderRight ? "1px solid rgba(66,71,105,0.35)" : "none",
      borderBottom: "1px solid rgba(66,71,105,0.35)",
      background: "var(--container)",
    }}>
      <div style={{
        fontFamily: "var(--f-head)", fontSize: "0.5rem",
        textTransform: "uppercase", letterSpacing: "0.2em",
        color: "var(--text-2)", marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <span style={{
            fontFamily: "var(--f-body)", fontSize: "1.9rem", fontWeight: 300,
            color: accent ? "var(--gold)" : "var(--text)",
            letterSpacing: "-0.02em", lineHeight: 1,
          }}>{value}</span>
          {unit && <span style={{
            fontFamily: "var(--f-body)", fontSize: "0.58rem",
            fontWeight: 300, color: "var(--text-2)", marginLeft: 4,
          }}>{unit}</span>}
          {sub && <div style={{
            fontFamily: "var(--f-head)", fontSize: "0.46rem",
            textTransform: "uppercase", letterSpacing: "0.14em",
            color: "var(--text-2)", marginTop: 4,
          }}>{sub}</div>}
        </div>
        {viz}
      </div>
    </div>
  )
}

/* ── MINI LINE ── */
function MiniLine({ weights }: { weights: WeightEntry[] }) {
  const s = [...weights].sort((a,b) => a.date.localeCompare(b.date)).slice(-6)
  if (s.length < 2) return null
  const vals = s.map(w => w.val)
  const min = Math.min(...vals) - 0.3, max = Math.max(...vals) + 0.3
  const W = 64, H = 28, p = 4
  const x = (i: number) => p + (i/(s.length-1))*(W-p*2)
  const y = (v: number) => H - p - ((v-min)/(max-min))*(H-p*2)
  const pts = s.map((w,i) => `${x(i)},${y(w.val)}`).join(" ")
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <polyline points={pts} fill="none" stroke="var(--gold)"
        strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={x(s.length-1)} cy={y(s[s.length-1].val)} r="2.5"
        fill="var(--gold)" style={{ filter: "drop-shadow(0 0 3px rgba(181,158,95,0.6))" }}/>
    </svg>
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
  const adh = getDayProgressReal(todayName, checked)
  const streak = calcStreak(checked)
  const sortedW = [...weights].sort((a,b) => b.date.localeCompare(a.date))
  const completedDays = DAYS.filter(d => getDayProgressReal(d, checked) === 100).length
  const statusLabel = adh >= 90 ? "ELITE / VETOR ESTÁVEL" : adh >= 70 ? "OPERACIONAL" : "CRÍTICO"
  const DAY_NAMES = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"]
  const h = new Date().getHours()
  const period = h < 12 ? "ALPHA" : h < 18 ? "BETA" : "OMEGA"

  return (
    <div>

      {/* ── METRIC CONTROLLER ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="metal-surface gleam-on-load"
        style={{ margin: "12px", padding: "18px", position: "relative" }}>

        {/* Corner accent marks — liquid metal */}
        {[
          { top: 7, left: 7, borderTop: true, borderLeft: true },
          { top: 7, right: 7, borderTop: true, borderRight: true },
          { bottom: 7, left: 7, borderBottom: true, borderLeft: true },
          { bottom: 7, right: 7, borderBottom: true, borderRight: true },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute", width: 10, height: 10,
            top: "top" in pos ? pos.top : undefined,
            bottom: "bottom" in pos ? pos.bottom : undefined,
            left: "left" in pos ? pos.left : undefined,
            right: "right" in pos ? pos.right : undefined,
            borderTop: pos.borderTop ? "1px solid var(--gold)" : "none",
            borderBottom: pos.borderBottom ? "1px solid var(--gold)" : "none",
            borderLeft: pos.borderLeft ? "1px solid var(--gold)" : "none",
            borderRight: pos.borderRight ? "1px solid var(--gold)" : "none",
          }}/>
        ))}

        <div style={{
          fontFamily: "var(--f-head)", fontSize: "0.58rem",
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "var(--text-2)", marginBottom: 16,
        }}>
          ÍNDICE DE ADERÊNCIA ATUAL
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <GoldArc pct={adh}/>
          <div style={{ flex: 1, paddingLeft: 14,
            borderLeft: "1px solid rgba(66,71,105,0.4)" }}>
            {/* Big metric */}
            <div style={{
              fontFamily: "var(--f-body)", fontSize: "2.4rem", fontWeight: 300,
              color: "var(--gold)", lineHeight: 1, letterSpacing: "-0.03em",
              marginBottom: 4,
            }}>
              {adh}<span style={{ fontSize: "1rem" }}>%</span>{" "}
              <span style={{ fontSize: "0.85rem", color: "var(--gold-2)", letterSpacing: "0.04em" }}>
                ADH
              </span>
            </div>
            <div style={{
              fontFamily: "var(--f-head)", fontSize: "0.52rem",
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: "var(--gold-2)", marginBottom: 14,
            }}>
              STATUS: {statusLabel}
            </div>

            {/* Bars */}
            {[
              { l: "DIETA HOJE", v: adh },
              { l: "META SEMANAL", v: Math.round((completedDays/7)*100) },
              { l: "STREAK SCORE", v: Math.min(streak*14, 100) },
            ].map(bar => (
              <div key={bar.l} style={{ marginBottom: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{
                    fontFamily: "var(--f-head)", fontSize: "0.44rem",
                    textTransform: "uppercase", letterSpacing: "0.16em",
                    color: "var(--text-2)",
                  }}>{bar.l}</span>
                  <span style={{
                    fontFamily: "var(--f-body)", fontSize: "0.5rem",
                    fontWeight: 300, color: "var(--gold-2)",
                  }}>{bar.v}%</span>
                </div>
                <div className="prog-track">
                  <motion.div className="prog-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.v}%` }}
                    transition={{ duration: 1.4, ease: [.4,0,.2,1], delay: .4 }}/>
                </div>
              </div>
            ))}

            {/* Session tag */}
            <div style={{
              marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(27,41,75,0.5)",
              border: "1px solid rgba(27,41,75,0.8)",
              borderRadius: 6, padding: "3px 8px",
            }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)" }}/>
              <span style={{
                fontFamily: "var(--f-head)", fontSize: "0.46rem",
                textTransform: "uppercase", letterSpacing: "0.14em",
                color: "var(--gold-2)",
              }}>
                {DAY_NAMES[new Date().getDay()]} // SESSÃO {period}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── VECTOR DIRECTIVE ── */}
      <VectorDirective adh={adh}/>

      {/* ── WEEK ── */}
      <WeekStrip checked={checked}/>

      {/* ── 2×2 GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <MetricCell label="STREAK" value={String(streak)} unit="dias"
          accent={streak >= 7} borderRight
          viz={
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              {[...Array(Math.min(streak,7)||1)].map((_,i) => (
                <div key={i} style={{
                  width: 4, height: 6 + i*5, borderRadius: 2,
                  background: i < Math.min(streak,7) ? "var(--gold)" : "var(--cobalt)",
                }}/>
              ))}
            </div>
          }/>
        <MetricCell label="PESO ATUAL"
          value={sortedW[0] ? String(sortedW[0].val) : "--"} unit="kg"
          viz={sortedW.length >= 2 ? <MiniLine weights={weights}/> : undefined}/>
        <MetricCell label="SEMANA" value={`${completedDays}`} unit="/7"
          sub={`${Math.round((completedDays/7)*100)}% DA META`} borderRight/>
        <MetricCell label="HOJE" value={`${adh}`} unit="%"
          accent={adh >= 90}
          sub={adh >= 90 ? "ELITE" : adh >= 70 ? "OPERACIONAL" : "CRÍTICO"}/>
      </div>

      {/* ── EVALS ── */}
      {Object.keys(evals).length > 0 && (
        <div style={{ borderBottom: "1px solid rgba(66,71,105,0.35)" }}>
          <div className="sec-head">AVALIAÇÕES</div>
          {Object.entries(evals)
            .sort(([a],[b]) => b.localeCompare(a)).slice(0,3)
            .map(([date, ev]) => (
              <div key={date} className="telem-row">
                <span style={{
                  fontFamily: "var(--f-body)", fontSize: "0.6rem",
                  fontWeight: 300, color: "var(--text-2)",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                }}>[{fmtDate(date)}]</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {ev.humor && <span style={{ fontSize: "1rem" }}>{ev.humor}</span>}
                  {ev.energia && <span style={{ fontSize: "1rem" }}>{ev.energia}</span>}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
