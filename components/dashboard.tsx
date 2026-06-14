"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Flame, Target, TrendingUp, Calendar } from "lucide-react"
import { DAYS } from "@/lib/data"
import { getDayProgressReal, calcStreak, fmtDate, WeightEntry, DayEval } from "@/lib/helpers"

/* ══════════════════════════════════
   INCENTIVOS
══════════════════════════════════ */
const INCENTIVOS = [
  { text: "Músculo não cresce no treino. Cresce no descanso, no sono e na comida.", tag: "FISIOLOGIA" },
  { text: "Disciplina não é motivação acumulada. É uma decisão repetida quando a motivação sumiu.", tag: "CONSTÂNCIA" },
  { text: "Comida real não precisa de lista de ingredientes. Esse é o critério mais simples.", tag: "NUTRIÇÃO" },
  { text: "Treino com 60% de intensidade feito 5x supera treino com 100% feito 1x.", tag: "FREQUÊNCIA" },
  { text: "Peso na balança é dado, não julgamento. Use como ferramenta.", tag: "DADOS" },
  { text: "Hidratação, sono e proteína resolvem mais do que qualquer suplemento.", tag: "FUNDAMENTOS" },
  { text: "Você não precisa de mais informação. Precisa executar o que já sabe.", tag: "EXECUÇÃO" },
  { text: "A diferença entre quem chega e quem desiste está nos dias ruins.", tag: "RESILIÊNCIA" },
  { text: "Cada refeição é uma escolha. Não precisa ser perfeita — precisa ser intencional.", tag: "INTENÇÃO" },
  { text: "Não compare seu progresso. Os pontos de partida são diferentes.", tag: "AUTOCONHECIMENTO" },
]

/* ── ARCO SVG — índice de aderência ── */
function AdhArc({ pct }: { pct: number }) {
  const S = 148
  const sw = 7
  const r = (S - sw) / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.70
  const offset = arc - (pct / 100) * arc
  const isElite = pct >= 90

  return (
    <div style={{ position: "relative", width: S, height: S, flexShrink: 0 }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}
        style={{ transform: "rotate(144deg)" }}>
        {/* Track */}
        <circle cx={S / 2} cy={S / 2} r={r}
          fill="none"
          stroke="rgba(73,116,127,0.22)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`} />
        {/* Fill */}
        <motion.circle cx={S / 2} cy={S / 2} r={r}
          fill="none"
          stroke={isElite ? "#E34B26" : "rgba(73,116,127,0.55)"}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{
            filter: isElite
              ? "drop-shadow(0 0 7px rgba(227,75,38,0.50))"
              : "none",
          }} />
      </svg>
      {/* Label central */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 3,
      }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            fontFamily: "var(--f-body)",
            fontSize: "2.0rem",
            fontWeight: 300,
            color: isElite ? "var(--scoville)" : "var(--t1)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}>
          {pct}%
        </motion.span>
        <span style={{
          fontFamily: "var(--f-body)",
          fontSize: "0.52rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.20em",
          color: "var(--t3)",
        }}>ADH</span>
      </div>
    </div>
  )
}

/* ── LINHA MINI — histórico de peso ── */
function WeightSparkline({ weights }: { weights: WeightEntry[] }) {
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-7)
  if (sorted.length < 2) return null

  const vals = sorted.map(w => w.val)
  const min = Math.min(...vals) - 0.5
  const max = Math.max(...vals) + 0.5
  const W = 60, H = 24, pad = 3

  const x = (i: number) => pad + (i / (sorted.length - 1)) * (W - pad * 2)
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2)
  const pts = sorted.map((w, i) => `${x(i)},${y(w.val)}`).join(" ")

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height: H, overflow: "visible" }}>
      <polyline
        points={pts}
        fill="none"
        stroke="var(--scoville)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round" />
      <circle
        cx={x(sorted.length - 1)}
        cy={y(sorted[sorted.length - 1].val)}
        r="2.5"
        fill="var(--scoville)"
        style={{ filter: "drop-shadow(0 0 4px rgba(227,75,38,0.55))" }} />
    </svg>
  )
}

/* ── STRIP SEMANAL ── */
function WeekStrip({ checked }: { checked: Record<string, boolean> }) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const letters = ["S", "T", "Q", "Q", "S", "S", "D"]

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      borderBottom: "1px solid var(--border-soft)",
    }}>
      {DAYS.map((day, idx) => {
        const pct = getDayProgressReal(day, checked)
        const done = pct === 100
        const isToday = idx === todayIdx
        const partial = pct > 0 && pct < 100

        return (
          <div key={day} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 0",
            background: isToday ? "rgba(0,36,52,0.50)" : "transparent",
            borderRight: idx < 6 ? "1px solid var(--border-soft)" : "none",
            borderTop: isToday
              ? "2px solid var(--scoville)"
              : "2px solid transparent",
          }}>
            {/* Letra do dia */}
            <span style={{
              fontFamily: "var(--f-body)",
              fontSize: "0.46rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: isToday ? "var(--hushed)" : "var(--t3)",
              marginBottom: 5,
            }}>{letters[idx]}</span>

            {/* Quadrado de status */}
            <div style={{
              width: 18, height: 18,
              borderRadius: 4,
              border: done
                ? "1px solid var(--scoville)"
                : isToday
                  ? "1px solid rgba(73,116,127,0.55)"
                  : "1px solid var(--border-soft)",
              background: done
                ? "var(--scoville)"
                : partial
                  ? "var(--sco-dim)"
                  : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {done ? (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2"
                    stroke="var(--canvas)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round" />
                </svg>
              ) : partial ? (
                <span style={{
                  fontFamily: "var(--f-body)",
                  fontSize: "0.36rem",
                  fontWeight: 500,
                  color: "var(--scoville)",
                }}>{pct}%</span>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── METRIC CARD — 2×2 grid ── */
function MetricCard({
  icon: Icon, label, value, unit, sub, accent, borderRight, viz,
}: {
  icon: React.ElementType
  label: string
  value: string
  unit?: string
  sub?: string
  accent?: boolean
  borderRight?: boolean
  viz?: React.ReactNode
}) {
  return (
    <div style={{
      padding: "14px 16px",
      borderRight: borderRight ? "1px solid var(--border-soft)" : "none",
      borderBottom: "1px solid var(--border-soft)",
      background: "var(--card)",
    }}>
      {/* Label com ícone */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        marginBottom: 10,
      }}>
        <Icon size={10} style={{ color: "var(--t3)", flexShrink: 0 }} />
        <span style={{
          fontFamily: "var(--f-body)",
          fontSize: "0.52rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--t3)",
        }}>{label}</span>
      </div>

      {/* Valor + viz */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 8,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{
              fontFamily: "var(--f-body)",
              fontSize: "1.75rem",
              fontWeight: 300,
              color: accent ? "var(--scoville)" : "var(--t1)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>{value}</span>
            {unit && (
              <span style={{
                fontFamily: "var(--f-body)",
                fontSize: "0.58rem",
                fontWeight: 300,
                color: "var(--t3)",
              }}>{unit}</span>
            )}
          </div>
          {sub && (
            <div style={{
              fontFamily: "var(--f-body)",
              fontSize: "0.48rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--t3)",
              marginTop: 4,
            }}>{sub}</div>
          )}
        </div>
        {viz}
      </div>
    </div>
  )
}

/* ── STREAK BARS ── */
function StreakBars({ count }: { count: number }) {
  const bars = Math.min(count, 7) || 1
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 3,
          height: 5 + i * 4,
          borderRadius: 2,
          background: count > 0
            ? `rgba(227,75,38,${0.4 + (i / bars) * 0.6})`
            : "var(--border)",
        }} />
      ))}
    </div>
  )
}

/* ── BARRA DE INCENTIVO ── */
function IncentivoBar() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const d = new Date()
    const seed = Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
    )
    setIdx(seed % INCENTIVOS.length)
  }, [])

  const item = INCENTIVOS[idx]
  const prev = () => setIdx(i => (i - 1 + INCENTIVOS.length) % INCENTIVOS.length)
  const next = () => setIdx(i => (i + 1) % INCENTIVOS.length)

  return (
    <div style={{
      margin: "0 12px 12px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(0,28,42,0.50)",
      border: "1px solid var(--border-soft)",
      borderLeft: "2px solid var(--scoville)",
      borderRadius: 'var(--radius)',
      padding: "11px 12px",
    }}>
      <button onClick={prev} className="press" style={{
        background: "none", border: "none",
        color: "var(--t4)", flexShrink: 0, padding: 2,
      }}>
        <ChevronLeft size={11} />
      </button>

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.18 }}
          style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.48rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.20em",
            color: "var(--scoville)",
            marginBottom: 4,
            opacity: 0.85,
          }}>{item.tag}</div>
          <p style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.70rem",
            fontWeight: 300,
            color: "var(--t2)",
            lineHeight: 1.55,
          }}>{item.text}</p>
        </motion.div>
      </AnimatePresence>

      <button onClick={next} className="press" style={{
        background: "none", border: "none",
        color: "var(--t4)", flexShrink: 0, padding: 2,
      }}>
        <ChevronRight size={11} />
      </button>
    </div>
  )
}

/* ══════════════════════════════════
   DASHBOARD — COMPONENTE PRINCIPAL
══════════════════════════════════ */
interface Props {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  evals: Record<string, DayEval>
  userName?: string
}

export function Dashboard({ checked, weights, evals, userName }: Props) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const todayName = DAYS[todayIdx]
  const adh = getDayProgressReal(todayName, checked)
  const streak = calcStreak(checked)
  const sortedW = [...weights].sort((a, b) => b.date.localeCompare(a.date))
  const completedDays = DAYS.filter(d => getDayProgressReal(d, checked) === 100).length
  const weekPct = Math.round((completedDays / 7) * 100)

  const statusLabel = adh >= 90
    ? "ELITE"
    : adh >= 70
      ? "OPERACIONAL"
      : "CRÍTICO"

  const h = new Date().getHours()
  const period = h < 12 ? "ALPHA" : h < 18 ? "BETA" : "OMEGA"
  const DAY_NAMES = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}>

      {/* ── CONTROLADOR CENTRAL — arco + barras ── */}
      <div style={{ padding: "12px 12px 0" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="metal-surface gleam-once"
          style={{ padding: "16px", position: "relative", overflow: "hidden" }}>

          {/* Corner marks */}
          {[
            { top: 6, left: 6, bT: true, bL: true },
            { top: 6, right: 6, bT: true, bR: true },
            { bottom: 6, left: 6, bB: true, bL: true },
            { bottom: 6, right: 6, bB: true, bR: true },
          ].map((pos, i) => (
            <div key={i} style={{
              position: "absolute",
              width: 9, height: 9,
              top: "top" in pos ? (pos as any).top : undefined,
              bottom: "bottom" in pos ? (pos as any).bottom : undefined,
              left: "left" in pos ? (pos as any).left : undefined,
              right: "right" in pos ? (pos as any).right : undefined,
              borderTop:    (pos as any).bT ? "1px solid rgba(227,75,38,0.55)" : "none",
              borderBottom: (pos as any).bB ? "1px solid rgba(227,75,38,0.55)" : "none",
              borderLeft:   (pos as any).bL ? "1px solid rgba(227,75,38,0.55)" : "none",
              borderRight:  (pos as any).bR ? "1px solid rgba(227,75,38,0.55)" : "none",
            }} />
          ))}

          {/* Eyebrow */}
          <div style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.52rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--t3)",
            marginBottom: 14,
          }}>ÍNDICE DE ADERÊNCIA</div>

          {/* Arco + métricas */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <AdhArc pct={adh} />

            <div style={{
              flex: 1,
              paddingLeft: 14,
              borderLeft: "1px solid var(--border-soft)",
            }}>
              {/* Status badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: adh >= 90
                  ? "var(--sco-dim)"
                  : "rgba(0,36,52,0.55)",
                border: `1px solid ${adh >= 90 ? "var(--border-accent)" : "var(--border-soft)"}`,
                borderRadius: 'var(--radius-s)',
                padding: "3px 8px",
                marginBottom: 12,
              }}>
                <div style={{
                  width: 4, height: 4,
                  borderRadius: "50%",
                  background: adh >= 90 ? "var(--scoville)" : "var(--hydro)",
                }} />
                <span style={{
                  fontFamily: "var(--f-body)",
                  fontSize: "0.48rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: adh >= 90 ? "var(--scoville)" : "var(--t2)",
                }}>{statusLabel}</span>
              </div>

              {/* Mini barras */}
              {[
                { l: "DIETA HOJE", v: adh },
                { l: "SEMANA", v: weekPct },
                { l: "STREAK", v: Math.min(streak * 14, 100) },
              ].map(bar => (
                <div key={bar.l} style={{ marginBottom: 8 }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}>
                    <span style={{
                      fontFamily: "var(--f-body)",
                      fontSize: "0.46rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      color: "var(--t3)",
                    }}>{bar.l}</span>
                    <span style={{
                      fontFamily: "var(--f-body)",
                      fontSize: "0.50rem",
                      fontWeight: 300,
                      color: "var(--t2)",
                    }}>{bar.v}%</span>
                  </div>
                  <div className="prog-track">
                    <motion.div className="prog-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.v}%` }}
                      transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.4 }} />
                  </div>
                </div>
              ))}

              {/* Sessão badge */}
              <div style={{
                marginTop: 10,
                fontFamily: "var(--f-body)",
                fontSize: "0.44rem",
                fontWeight: 300,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--t4)",
              }}>
                {DAY_NAMES[new Date().getDay()]} · SESSÃO {period}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── WEEK STRIP ── */}
      <div style={{ margin: "12px 12px 0" }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <WeekStrip checked={checked} />
        </div>
      </div>

      {/* ── DIRECTIVE — status do vetor ── */}
      <div style={{ margin: "12px 12px 0" }}>
        <div className="directive-stripe" style={{ borderRadius: 'var(--radius)' }}>
          <div style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.50rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "var(--scoville)",
            marginBottom: 7,
          }}>
            DIRETRIZ DE VETOR · {adh >= 90 ? "ESTÁVEL" : "ALERTA"}
          </div>
          <p style={{
            fontFamily: "var(--f-body)",
            fontSize: "0.72rem",
            fontWeight: 300,
            color: adh >= 90 ? "var(--t1)" : "var(--t2)",
            lineHeight: 1.60,
          }}>
            {adh >= 90
              ? "Sistema estável. A estrutura suporta a carga atual. Mantenha a tração e o ritmo."
              : "Desvio detectado. A inércia está agindo sobre o vetor de performance. Retome a rota."}
          </p>
        </div>
      </div>

      {/* ── MÉTRICAS 2×2 ── */}
      <div style={{
        margin: "12px 12px 0",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        border: "1px solid var(--border-soft)",
        borderRadius: 'var(--radius)',
        overflow: "hidden",
      }}>
        <MetricCard
          icon={Flame}
          label="STREAK"
          value={String(streak)}
          unit="dias"
          accent={streak >= 7}
          borderRight
          viz={<StreakBars count={streak} />}
        />
        <MetricCard
          icon={TrendingUp}
          label="PESO"
          value={sortedW[0] ? String(sortedW[0].val) : "—"}
          unit={sortedW[0] ? "kg" : ""}
          viz={sortedW.length >= 2 ? <WeightSparkline weights={weights} /> : undefined}
        />
        <MetricCard
          icon={Calendar}
          label="SEMANA"
          value={String(completedDays)}
          unit="/7"
          sub={`${weekPct}% DA META`}
          borderRight
        />
        <MetricCard
          icon={Target}
          label="HOJE"
          value={String(adh)}
          unit="%"
          accent={adh >= 90}
          sub={statusLabel}
        />
      </div>

      {/* ── INCENTIVO ── */}
      <div style={{ marginTop: 12 }}>
        <IncentivoBar />
      </div>

      {/* ── AVALIAÇÕES RECENTES ── */}
      {Object.keys(evals).length > 0 && (
        <div style={{
          margin: "0 12px 12px",
          border: "1px solid var(--border-soft)",
          borderRadius: 'var(--radius)',
          overflow: "hidden",
        }}>
          <div className="sec-head">AVALIAÇÕES RECENTES</div>
          {Object.entries(evals)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 3)
            .map(([date, ev]) => (
              <div key={date} className="telem-row">
                <span style={{
                  fontFamily: "var(--f-body)",
                  fontSize: "0.60rem",
                  fontWeight: 300,
                  color: "var(--t2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.10em",
                }}>[{fmtDate(date)}]</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {ev.humor && <span style={{ fontSize: "1rem" }}>{ev.humor}</span>}
                  {ev.energia && <span style={{ fontSize: "1rem" }}>{ev.energia}</span>}
                </div>
              </div>
            ))}
        </div>
      )}
    </motion.div>
  )
}
