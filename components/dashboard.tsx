"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Flame, Scale, TrendingDown, Calendar, Trophy, ChevronRight, Droplets, Zap } from "lucide-react"
import { DAYS, DayName } from "@/lib/data"
import { getDayProgressReal, calcStreak, fmtDate, WeightEntry, DayEval, pad } from "@/lib/helpers"

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

/* ── WHOOP ARC ── */
function WhoopArc({ pct, size = 180 }: { pct: number; size?: number }) {
  const sw = 11
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75
  const offset = arc - (pct / 100) * arc
  const color = pct === 100 ? "#EEFF99" : "#1A9597"

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(135deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="rgba(26,149,151,0.12)" strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`} />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [.4,0,.2,1], delay: .2 }}
          style={{ filter: `drop-shadow(0 0 10px ${color}99)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: .75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: .5 }}
          className="text-5xl font-black tracking-tight"
          style={{ color: pct === 100 ? "#EEFF99" : "#FDFDFE",
            textShadow: pct === 100 ? "0 0 30px rgba(238,255,153,.5)" : "none" }}
        >
          {pct}%
        </motion.span>
        <span className="font-mono text-[9px] uppercase tracking-[2.5px] mt-1"
          style={{ color: "rgba(238,242,243,.4)" }}>
          dieta hoje
        </span>
      </div>
    </div>
  )
}

/* ── MINI WEIGHT CHART ── */
function WeightLine({ weights }: { weights: WeightEntry[] }) {
  const s = [...weights].sort((a,b) => a.date.localeCompare(b.date)).slice(-8)
  if (s.length < 2) return null
  const vals = s.map(w => w.val)
  const min = Math.min(...vals) - .3
  const max = Math.max(...vals) + .3
  const W = 260, H = 60, pad = 12
  const x = (i: number) => pad + (i/(s.length-1))*(W-pad*2)
  const y = (v: number) => H - pad - ((v-min)/(max-min))*(H-pad*2)
  const pts = s.map((w,i) => `${x(i)},${y(w.val)}`).join(" ")
  const area = `${x(0)},${H-pad} ${pts} ${x(s.length-1)},${H-pad}`
  const last = s[s.length-1]
  const prev = s[s.length-2]
  const diff = last && prev ? (last.val - prev.val) : 0

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-black" style={{ color: "#FDFDFE" }}>{last?.val ?? "--"}</span>
        <span className="text-xs font-medium" style={{ color: "rgba(238,242,243,.4)" }}>kg</span>
        {diff !== 0 && (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: diff < 0 ? "rgba(26,149,151,.15)" : "rgba(240,160,48,.12)",
              color: diff < 0 ? "#1A9597" : "#f0a030",
            }}>
            {diff > 0 ? "+" : ""}{diff.toFixed(1)}kg
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A9597" stopOpacity=".4"/>
            <stop offset="100%" stopColor="#1A9597" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#wg)"/>
        <polyline points={pts} fill="none" stroke="#1A9597" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round"/>
        <circle cx={x(s.length-1)} cy={y(last.val)} r="4.5" fill="#1A9597"
          style={{ filter: "drop-shadow(0 0 6px #1A9597)" }}/>
        <circle cx={x(s.length-1)} cy={y(last.val)} r="2" fill="#000022"/>
      </svg>
    </div>
  )
}

/* ── WEEK ROW ── */
function WeekRow({ checked }: { checked: Record<string, boolean> }) {
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAYS.map((day, idx) => {
        const pct = getDayProgressReal(day, checked)
        const done = pct === 100
        const isToday = idx === today
        return (
          <div key={day}
            className="flex flex-col items-center gap-1.5 rounded-2xl py-3 transition-all"
            style={{
              background: done ? "rgba(238,255,153,.08)" : isToday ? "rgba(26,149,151,.08)" : "rgba(255,255,255,.03)",
              border: done ? "1px solid rgba(238,255,153,.25)" : isToday ? "1px solid rgba(26,149,151,.3)" : "1px solid rgba(255,255,255,.05)",
            }}>
            <span className="font-mono text-[7.5px] uppercase tracking-wide"
              style={{ color: isToday ? "#1A9597" : "rgba(238,242,243,.35)" }}>
              {day.slice(0,3)}
            </span>
            {done ? (
              <div className="flex h-5 w-5 items-center justify-center rounded-full"
                style={{ background: "#EEFF99", boxShadow: "0 0 8px rgba(238,255,153,.4)" }}>
                <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="#000022" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            ) : (
              <span className="font-mono text-[9px] font-bold"
                style={{ color: pct > 0 ? "#1A9597" : "rgba(238,242,243,.15)" }}>
                {pct > 0 ? `${pct}%` : "·"}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── CARD ── */
function Card({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: .98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .4, delay, ease: [.4,0,.2,1] }}
      className={`glass rounded-3xl p-5 ${className}`}
    >
      {children}
    </motion.div>
  )
}

/* ── LABEL ── */
function Label({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-xl"
        style={{ background: "rgba(26,149,151,.1)", border: "1px solid rgba(26,149,151,.2)" }}>
        <Icon size={13} style={{ color: "#1A9597" }}/>
      </div>
      <span className="font-mono text-[8.5px] uppercase tracking-widest"
        style={{ color: "rgba(238,242,243,.4)" }}>{text}</span>
    </div>
  )
}

/* ── MAIN ── */
interface Props {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  evals: Record<string, DayEval>
  onAskAI: () => void
}

export function Dashboard({ checked, weights, evals, onAskAI }: Props) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const todayName = DAYS[todayIdx]
  const pct = getDayProgressReal(todayName, checked)
  const streak = calcStreak(checked)
  const sortedW = [...weights].sort((a,b) => b.date.localeCompare(a.date))
  const completedDays = DAYS.filter(d => getDayProgressReal(d, checked) === 100).length
  const recentEvals = Object.entries(evals).sort(([a],[b]) => b.localeCompare(a)).slice(0,3)

  const days = ["Dom","Seg","Ter","Qua","Qui","Sex","Sab"]
  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return "Bom dia"
    if (h < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <div className="space-y-3 px-4 pb-4">

      {/* HERO — ARC */}
      <motion.div
        initial={{ opacity: 0, scale: .92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .5, ease: [.4,0,.2,1] }}
        className="glass-strong rounded-[2rem] p-6 relative overflow-hidden"
      >
        {/* Ambient */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-52 h-52 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(26,149,151,.08) 0%, transparent 70%)" }}/>
        </div>

        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="font-mono text-[8.5px] uppercase tracking-[3px]"
              style={{ color: "rgba(238,242,243,.35)" }}>
              {days[new Date().getDay()]} · {greet()}
            </div>
            <div className="text-2xl font-black tracking-tight mt-0.5" style={{ color: "#FDFDFE" }}>
              Progresso
            </div>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: .3 }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                background: "rgba(238,255,153,.1)",
                border: "1px solid rgba(238,255,153,.25)",
                boxShadow: "0 0 12px rgba(238,255,153,.1)",
              }}
            >
              <Flame size={13} style={{ color: "#EEFF99", filter: "drop-shadow(0 0 4px #EEFF99)" }}/>
              <span className="font-mono text-[10px] font-bold" style={{ color: "#EEFF99" }}>
                {streak}d streak
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-center py-3">
          <WhoopArc pct={pct} size={172}/>
        </div>

        {/* AI Ask button */}
        <motion.button
          onClick={onAskAI}
          whileTap={{ scale: .97 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .6 }}
          className="insight-pulse press w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5"
          style={{
            background: "rgba(26,149,151,.08)",
            border: "1px solid rgba(26,149,151,.2)",
          }}
        >
          <div style={{ color: "#1A9597", filter: "drop-shadow(0 0 6px #1A9597)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[2px] font-semibold"
            style={{ color: "#1A9597" }}>
            Pergunte ao EVO
          </span>
          <ChevronRight size={13} style={{ color: "rgba(26,149,151,.5)" }}/>
        </motion.button>
      </motion.div>

      {/* BENTO */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak */}
        <Card delay={.1}>
          <Label icon={Trophy} text="Streak"/>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black" style={{ color: "#FDFDFE" }}>{streak}</span>
            <span className="text-xs" style={{ color: "rgba(238,242,243,.35)" }}>dias</span>
          </div>
          <div className="mt-3 flex gap-1">
            {streak === 0
              ? <div className="h-1 flex-1 rounded-full" style={{ background: "rgba(255,255,255,.06)" }}/>
              : [...Array(Math.min(streak,7))].map((_,i) => (
                  <div key={i} className="h-1 flex-1 rounded-full"
                    style={{ background: "#EEFF99", opacity: .3 + (i/Math.min(streak,7))*.7,
                      boxShadow: i === Math.min(streak,7)-1 ? "0 0 6px rgba(238,255,153,.5)" : "none" }}/>
                ))}
          </div>
        </Card>

        {/* Peso */}
        <Card delay={.15}>
          <Label icon={Scale} text="Peso"/>
          {sortedW.length > 0 ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black" style={{ color: "#FDFDFE" }}>{sortedW[0].val}</span>
                <span className="text-xs" style={{ color: "rgba(238,242,243,.35)" }}>kg</span>
              </div>
              <div className="font-mono text-[9px] mt-1.5 uppercase tracking-wide"
                style={{ color: "rgba(238,242,243,.25)" }}>
                {fmtDate(sortedW[0].date)}
              </div>
            </div>
          ) : (
            <div className="text-sm font-medium" style={{ color: "rgba(238,242,243,.3)" }}>
              Sem registro
            </div>
          )}
        </Card>
      </div>

      {/* Semana */}
      <Card delay={.2}>
        <div className="flex items-center justify-between mb-4">
          <Label icon={Calendar} text="Esta Semana"/>
          <span className="font-mono text-[10px] font-bold" style={{ color: "#1A9597" }}>
            {completedDays}/7
          </span>
        </div>
        <WeekRow checked={checked}/>
      </Card>

      {/* Evolucao peso */}
      {weights.length >= 2 && (
        <Card delay={.25}>
          <Label icon={TrendingDown} text="Evolucao do Peso"/>
          <WeightLine weights={weights}/>
        </Card>
      )}

      {/* Avaliacoes */}
      {recentEvals.length > 0 && (
        <Card delay={.3}>
          <Label icon={Zap} text="Avaliacoes Recentes"/>
          <div className="space-y-2">
            {recentEvals.map(([date, ev]) => (
              <div key={date} className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)" }}>
                <span className="font-mono text-[10px]" style={{ color: "rgba(238,242,243,.4)" }}>
                  {fmtDate(date)}
                </span>
                <div className="flex gap-2">
                  {ev.humor && <span className="text-lg">{ev.humor}</span>}
                  {ev.energia && <span className="text-lg">{ev.energia}</span>}
                  {ev.fome && <span className="text-lg">{ev.fome}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
