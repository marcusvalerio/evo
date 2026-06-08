"use client"

import { motion } from "framer-motion"
import { DAYS } from "@/lib/data"
import { getDayProgressReal, calcStreak, fmtDate, WeightEntry, DayEval, pad } from "@/lib/helpers"

/* ── WHOOP ARC — gold palette ── */
function GoldArc({ pct }: { pct: number }) {
  const S = 180, sw = 9, r = (S - sw) / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.72
  const offset = arc - (pct / 100) * arc
  const isElite = pct >= 90

  return (
    <div style={{ position: "relative", width: S, height: S }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ transform: "rotate(144deg)" }}>
        <circle cx={S/2} cy={S/2} r={r} fill="none"
          stroke="var(--border-color)" strokeWidth={sw} strokeLinecap="square"
          strokeDasharray={`${arc} ${circ}`}/>
        <motion.circle cx={S/2} cy={S/2} r={r} fill="none"
          stroke={isElite ? "var(--accent-primary)" : "var(--text-secondary)"}
          strokeWidth={sw} strokeLinecap="square"
          strokeDasharray={`${arc} ${circ}`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [.4,0,.2,1], delay: .2 }}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: "var(--f-body)",
            fontSize: "2.6rem", fontWeight: 300,
            color: isElite ? "var(--accent-primary)" : "var(--text-primary)",
            lineHeight: 1, letterSpacing: "-0.02em",
          }}>
          {pct}%
        </motion.div>
        <div style={{
          fontFamily: "var(--f-head)", fontSize: "0.5rem",
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "var(--text-secondary)", marginTop: 5,
        }}>ADH</div>
      </div>
    </div>
  )
}

/* ── VECTOR DIRECTIVE ── */
function VectorDirective({ adh }: { adh: number }) {
  const isStable = adh >= 90
  const msg = isStable
    ? "SISTEMA ESTÁVEL. A ESTRUTURA SUPORTA A CARGA ATUAL. MANTENHA A TRAÇÃO OPERACIONAL E O RITMO RÍGIDO."
    : "ALERTA DE DESVIO. A INÉRCIA ESTÁ AGINDO SOBRE O VETOR DE PERFORMANCE. RETOME A ROTA IMEDIATAMENTE."

  return (
    <div className="vector-directive">
      <div style={{
        fontFamily: "var(--f-head)",
        fontSize: "0.55rem", textTransform: "uppercase",
        letterSpacing: "0.2em", color: "var(--accent-primary)",
        marginBottom: 8,
      }}>
        DIRETRIZ DE VETOR // {isStable ? "ESTÁVEL" : "ALERTA"}
      </div>
      <p style={{
        fontFamily: "var(--f-body)", fontSize: "0.75rem",
        fontWeight: 300, color: "var(--text-primary)",
        lineHeight: 1.6, marginBottom: 10,
        letterSpacing: "0.02em",
      }}>
        {msg}
      </p>
      <div style={{
        fontFamily: "var(--f-body)", fontSize: "0.58rem",
        fontWeight: 300, color: "var(--text-secondary)",
        textTransform: "uppercase", letterSpacing: "0.14em",
      }}>
        EFICIÊNCIA MECÂNICA SISTÊMICA // VETOR DE ADERÊNCIA:{" "}
        <span style={{ color: "var(--accent-secondary)" }}>
          {adh >= 90 ? "ELITE" : adh >= 70 ? "OPERACIONAL" : "CRÍTICO"}
        </span>
      </div>
    </div>
  )
}

/* ── WEEK GRID ── */
function WeekGrid({ checked }: { checked: Record<string, boolean> }) {
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const DAY_LABELS = ["SEG","TER","QUA","QUI","SEX","SAB","DOM"]

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
      borderTop: "1px solid var(--border-color)",
      borderBottom: "1px solid var(--border-color)",
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
            background: isToday ? "rgba(27,41,75,0.4)" : "transparent",
            borderRight: idx < 6 ? "1px solid var(--border-color)" : "none",
            borderTop: isToday ? "2px solid var(--accent-primary)" : "2px solid transparent",
          }}>
            <span style={{
              fontFamily: "var(--f-head)", fontSize: "0.46rem",
              textTransform: "uppercase", letterSpacing: "0.12em",
              color: isToday ? "var(--accent-secondary)" : "var(--text-secondary)",
              marginBottom: 5,
            }}>{DAY_LABELS[idx]}</span>
            <div style={{
              width: 20, height: 20,
              border: done
                ? "1px solid var(--accent-primary)"
                : isToday
                ? "1px solid var(--accent-secondary)"
                : "1px solid var(--border-color)",
              background: done ? "var(--accent-primary)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {done ? (
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5"
                    stroke="var(--canvas-bg)" strokeWidth="1.5"
                    strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
              ) : pct > 0 ? (
                <span style={{
                  fontFamily: "var(--f-body)", fontSize: "0.38rem",
                  fontWeight: 400, color: "var(--text-secondary)",
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
function MetricCell({
  label, value, unit, sub, accent, borderRight, viz,
}: {
  label: string; value: string; unit?: string; sub?: string
  accent?: boolean; borderRight?: boolean; viz?: React.ReactNode
}) {
  return (
    <div style={{
      padding: "16px",
      borderRight: borderRight ? "1px solid var(--border-color)" : "none",
      borderBottom: "1px solid var(--border-color)",
      background: "var(--card-bg)",
    }}>
      <div style={{
        fontFamily: "var(--f-head)", fontSize: "0.52rem",
        textTransform: "uppercase", letterSpacing: "0.2em",
        color: "var(--text-secondary)", marginBottom: 10,
      }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "flex-end",
        justifyContent: "space-between",
      }}>
        <div>
          <span style={{
            fontFamily: "var(--f-body)",
            fontSize: "2rem", fontWeight: 300,
            color: accent ? "var(--accent-primary)" : "var(--text-primary)",
            letterSpacing: "-0.02em", lineHeight: 1,
          }}>{value}</span>
          {unit && (
            <span style={{
              fontFamily: "var(--f-body)", fontSize: "0.6rem",
              fontWeight: 300, color: "var(--text-secondary)",
              marginLeft: 4,
            }}>{unit}</span>
          )}
          {sub && (
            <div style={{
              fontFamily: "var(--f-head)", fontSize: "0.48rem",
              textTransform: "uppercase", letterSpacing: "0.14em",
              color: "var(--text-secondary)", marginTop: 4,
            }}>{sub}</div>
          )}
        </div>
        {viz}
      </div>
    </div>
  )
}

/* ── MINI WEIGHT LINE ── */
function MiniLine({ weights }: { weights: WeightEntry[] }) {
  const s = [...weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-6)
  if (s.length < 2) return null
  const vals = s.map(w => w.val)
  const min = Math.min(...vals) - 0.3, max = Math.max(...vals) + 0.3
  const W = 72, H = 32, p = 4
  const x = (i: number) => p + (i / (s.length - 1)) * (W - p * 2)
  const y = (v: number) => H - p - ((v - min) / (max - min)) * (H - p * 2)
  const pts = s.map((w, i) => `${x(i)},${y(w.val)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H }}>
      <polyline points={pts} fill="none"
        stroke="var(--accent-primary)" strokeWidth="1.5"
        strokeLinejoin="miter" strokeLinecap="square"/>
      <rect
        x={x(s.length-1)-1.5} y={y(s[s.length-1].val)-1.5}
        width="3" height="3" fill="var(--accent-primary)"/>
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
  const sortedW = [...weights].sort((a, b) => b.date.localeCompare(a.date))
  const completedDays = DAYS.filter(d => getDayProgressReal(d, checked) === 100).length
  const statusLabel = adh >= 90 ? "ELITE / VETOR ESTÁVEL" : adh >= 70 ? "OPERACIONAL / DESVIO LEVE" : "CRÍTICO / RETOMAR ROTA"

  const DAY_NAMES_PT = ["DOM","SEG","TER","QUA","QUI","SEX","SAB"]
  const h = new Date().getHours()
  const period = h < 12 ? "ALPHA" : h < 18 ? "BETA" : "OMEGA"

  return (
    <div>

      {/* ── METRIC CONTROLLER ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          margin: "12px", padding: "20px",
          position: "relative",
        }}>
        {/* Corner marks */}
        {["TL","TR","BL","BR"].map(pos => (
          <div key={pos} style={{
            position: "absolute",
            top:    pos.includes("T") ? 6  : "auto",
            bottom: pos.includes("B") ? 6  : "auto",
            left:   pos.includes("L") ? 6  : "auto",
            right:  pos.includes("R") ? 6  : "auto",
            width: 8, height: 8,
            borderTop:    pos.includes("T") ? "1px solid var(--accent-primary)" : "none",
            borderBottom: pos.includes("B") ? "1px solid var(--accent-primary)" : "none",
            borderLeft:   pos.includes("L") ? "1px solid var(--accent-primary)" : "none",
            borderRight:  pos.includes("R") ? "1px solid var(--accent-primary)" : "none",
          }}/>
        ))}

        <div style={{
          fontFamily: "var(--f-head)", fontSize: "0.58rem",
          textTransform: "uppercase", letterSpacing: "0.2em",
          color: "var(--text-secondary)", marginBottom: 16,
        }}>
          ÍNDICE DE ADERÊNCIA ATUAL
        </div>

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          <GoldArc pct={adh}/>

          <div style={{ flex: 1, borderLeft: "1px solid var(--border-color)", paddingLeft: 16 }}>
            {/* Big metric */}
            <div style={{
              fontFamily: "var(--f-body)",
              fontSize: "2.8rem", fontWeight: 300,
              color: "var(--accent-primary)",
              lineHeight: 1, letterSpacing: "-0.03em",
              marginBottom: 4,
            }}>
              {adh}% <span style={{ fontSize: "1rem", color: "var(--accent-secondary)" }}>ADH</span>
            </div>
            <div style={{
              fontFamily: "var(--f-head)", fontSize: "0.52rem",
              textTransform: "uppercase", letterSpacing: "0.16em",
              color: "var(--accent-secondary)", marginBottom: 16,
            }}>
              STATUS: {statusLabel}
            </div>

            {/* Progress bars */}
            {[
              { l: "DIETA HOJE", v: adh },
              { l: "META SEMANAL", v: Math.round((completedDays / 7) * 100) },
              { l: "STREAK SCORE", v: Math.min(streak * 14, 100) },
            ].map(bar => (
              <div key={bar.l} style={{ marginBottom: 10 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: 5,
                }}>
                  <span style={{
                    fontFamily: "var(--f-head)", fontSize: "0.46rem",
                    textTransform: "uppercase", letterSpacing: "0.18em",
                    color: "var(--text-secondary)",
                  }}>{bar.l}</span>
                  <span style={{
                    fontFamily: "var(--f-body)", fontSize: "0.52rem",
                    fontWeight: 300, color: "var(--accent-secondary)",
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
              marginTop: 14,
              display: "inline-flex", alignItems: "center", gap: 6,
              border: "1px solid var(--technical-blue)",
              padding: "3px 8px",
            }}>
              <div style={{
                width: 4, height: 4, background: "var(--accent-primary)",
              }}/>
              <span style={{
                fontFamily: "var(--f-head)", fontSize: "0.48rem",
                textTransform: "uppercase", letterSpacing: "0.16em",
                color: "var(--accent-secondary)",
              }}>
                {DAY_NAMES_PT[new Date().getDay()]} // SESSÃO {period}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── VECTOR DIRECTIVE ── */}
      <VectorDirective adh={adh}/>

      {/* ── WEEK ── */}
      <WeekGrid checked={checked}/>

      {/* ── 2×2 METRIC GRID ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid var(--border-color)",
      }}>
        <MetricCell label="STREAK" value={String(streak)} unit="dias"
          accent={streak >= 7} borderRight
          viz={
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              {[...Array(Math.min(streak, 7) || 1)].map((_, i) => (
                <div key={i} style={{
                  width: 4, height: 6 + i * 5,
                  background: i < Math.min(streak, 7)
                    ? "var(--accent-primary)"
                    : "var(--border-color)",
                }}/>
              ))}
            </div>
          }/>
        <MetricCell label="PESO ATUAL"
          value={sortedW[0] ? String(sortedW[0].val) : "--"} unit="kg"
          viz={sortedW.length >= 2 ? <MiniLine weights={weights}/> : undefined}/>
        <MetricCell label="SEMANA" value={`${completedDays}`} unit="/7"
          sub={`${Math.round((completedDays / 7) * 100)}% DA META`} borderRight/>
        <MetricCell label="HOJE" value={`${adh}`} unit="%"
          accent={adh >= 90}
          sub={adh >= 90 ? "ELITE" : adh >= 70 ? "OPERACIONAL" : "CRÍTICO"}/>
      </div>

      {/* ── RECENT EVALS ── */}
      {Object.keys(evals).length > 0 && (
        <div style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="sec-head">AVALIAÇÕES RECENTES</div>
          {Object.entries(evals)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 3)
            .map(([date, ev], i) => (
              <div key={date} className="telem-row">
                <span style={{
                  fontFamily: "var(--f-body)", fontSize: "0.62rem",
                  fontWeight: 300, color: "var(--text-secondary)",
                  textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                  [{fmtDate(date)}]
                </span>
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
