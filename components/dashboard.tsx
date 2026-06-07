"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DAYS, DayName } from "@/lib/data"
import {
  getDayProgressReal,
  calcStreak,
  fmtDate,
  WeightEntry,
  DayEval,
} from "@/lib/helpers"
import { ProgressRing } from "./progress-ring"
import {
  Flame,
  Scale,
  TrendingDown,
  Target,
  Calendar,
  Zap,
  Droplets,
  Activity,
  ChevronRight,
  Trophy,
  Sparkles,
  X,
  Send,
  Brain,
} from "lucide-react"

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  onClick?: () => void
}

function BentoCard({ children, className, delay = 0, onClick }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className={cn(
        "rounded-3xl glass-card p-5 card-hover",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

/* ===================== AI INSIGHTS MODAL ===================== */
interface InsightModalProps {
  onClose: () => void
  weights: WeightEntry[]
  streak: number
  todayProgress: number
  evals: Record<string, DayEval>
}

function InsightModal({ onClose, weights, streak, todayProgress, evals }: InsightModalProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)

  const latestWeight = [...weights].sort((a, b) => b.date.localeCompare(a.date))[0]
  const recentEvals = Object.entries(evals).sort(([a], [b]) => b.localeCompare(a)).slice(0, 3)

  const systemPrompt = `Voce e o EVO, coach de evolucao fisica e alimentar. Fale de forma direta, humana e motivadora — sem rodeios, sem frases feitas. Nada de linguagem generica de app.

Contexto do usuario:
- Streak atual: ${streak} dias consecutivos
- Progresso hoje: ${todayProgress}%
- Peso recente: ${latestWeight ? `${latestWeight.val}kg` : "nao registrado"}
- Dieta: baseada em comida real, proteina animal, vegetais, carboidratos integrais. Creatina e whey como excecao.
- Avaliacoes recentes: ${recentEvals.length > 0 ? recentEvals.map(([d, e]) => `${fmtDate(d)}: humor ${e.humor}, energia ${e.energia}`).join(" | ") : "sem avaliacoes"}

Responda de forma curta e precisa (max 3 paragrafos). Sem listas longas. Sem asteriscos. Sem markdown. Fale como coach, nao como assistente.`

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return
    const userMsg = { role: "user" as const, content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    setStarted(true)

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || "Nao consegui responder agora."
      setMessages(prev => [...prev, { role: "assistant", content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Erro de conexao. Tenta de novo." }])
    } finally {
      setLoading(false)
    }
  }

  const quickQuestions = [
    "Como evoluo mais rapido?",
    "O que comer pre-treino?",
    "Como melhorar minha resistencia?",
    "Dicas de recuperacao muscular",
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/15">
            <Brain className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[3px] text-muted-foreground">EVO</div>
            <div className="text-base font-bold text-foreground">Pergunte ao Coach</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {!started && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-3xl glass-card p-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {streak > 0 ? `${streak} dias no streak. Que pergunta voce tem hoje?` : "Pronto pra evoluir. O que voce quer saber?"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-2xl glass-card px-4 py-3 text-left font-mono text-[10px] text-muted-foreground active:scale-98 transition-all hover:border-primary/30 hover:text-primary"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "max-w-[88%]",
                msg.role === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "glass-card text-foreground rounded-bl-sm"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1.5 px-4 py-3 glass-card rounded-2xl rounded-bl-sm w-fit"
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 pb-8 pt-3 border-t border-border glass-nav">
        <div className="flex items-center gap-3 glass-card rounded-2xl px-4 py-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Pergunte qualquer coisa..."
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary disabled:opacity-40 transition-opacity"
          >
            <Send className="h-3.5 w-3.5 text-primary-foreground" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ===================== WEIGHT CHART ===================== */
function WeightChart({ weights }: { weights: WeightEntry[] }) {
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-10)
  if (sorted.length < 2) return null

  const vals = sorted.map(w => w.val)
  const min = Math.min(...vals) - 0.5
  const max = Math.max(...vals) + 0.5
  const W = 300
  const H = 80
  const pad = 16

  const x = (i: number) => pad + (i / (sorted.length - 1)) * (W - pad * 2)
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2)

  const pts = sorted.map((w, i) => `${x(i)},${y(w.val)}`).join(" ")
  const area = `${x(0)},${H - pad} ` + pts + ` ${x(sorted.length - 1)},${H - pad}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#39e07a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#39e07a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#wg2)" />
      <polyline points={pts} fill="none" stroke="#39e07a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {sorted.map((w, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(w.val)} r="4" fill="#39e07a" opacity="0.9" />
          <circle cx={x(i)} cy={y(w.val)} r="2" fill="#060d0a" />
          {i === sorted.length - 1 && (
            <text x={x(i)} y={y(w.val) - 9} fill="#39e07a" fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="700">
              {w.val}kg
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

/* ===================== WHOOP-STYLE ARC RING ===================== */
function WhoopArc({ progress, size = 160, label, sublabel, color = "#39e07a" }: {
  progress: number; size?: number; label: string; sublabel: string; color?: string
}) {
  const strokeWidth = 10
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  // Use only 270deg arc (like WHOOP)
  const arcLength = circ * 0.75
  const offset = arcLength - (progress / 100) * arcLength

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[135deg]">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(57,224,122,0.1)"
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circ}`}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color}
          strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circ}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-black text-foreground glow-text-green"
        >
          {label}
        </motion.span>
        <span className="font-mono text-[9px] uppercase tracking-[2px] text-muted-foreground mt-0.5">{sublabel}</span>
      </div>
    </div>
  )
}

/* ===================== MAIN DASHBOARD ===================== */
interface DashboardProps {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  evals: Record<string, DayEval>
}

export function Dashboard({ checked, weights, evals }: DashboardProps) {
  const [showInsights, setShowInsights] = useState(false)

  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const todayName = DAYS[todayIdx]
  const todayProgress = getDayProgressReal(todayName, checked)
  const streak = calcStreak(checked)

  const sortedWeights = [...weights].sort((a, b) => b.date.localeCompare(a.date))
  const latestWeight = sortedWeights[0]
  const prevWeight = sortedWeights[1]
  const weightDiff = latestWeight && prevWeight
    ? (latestWeight.val - prevWeight.val).toFixed(1)
    : null

  const weekProgress = DAYS.map((day, idx) => ({
    day: day.slice(0, 3),
    progress: getDayProgressReal(day, checked),
    isToday: idx === todayIdx,
  }))
  const completedDays = weekProgress.filter(d => d.progress === 100).length

  const getDayOfWeek = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
    return days[new Date().getDay()]
  }

  return (
    <>
      <AnimatePresence>
        {showInsights && (
          <InsightModal
            onClose={() => setShowInsights(false)}
            weights={weights}
            streak={streak}
            todayProgress={todayProgress}
            evals={evals}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4 px-4 pb-4 relative z-10">

        {/* ====== HERO — WHOOP-STYLE ARC ====== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] glass-card-strong p-6"
        >
          {/* Ambient glow behind arc */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[3px] text-muted-foreground">
                {getDayOfWeek()} · Hoje
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                Progresso
              </h2>
            </div>
            {streak > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 border border-primary/20"
              >
                <Flame className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[10px] font-bold text-primary">{streak}d</span>
              </motion.div>
            )}
          </div>

          <div className="flex items-center justify-center py-2">
            <WhoopArc
              progress={todayProgress}
              size={170}
              label={`${todayProgress}%`}
              sublabel="Dieta Hoje"
              color={todayProgress === 100 ? "#39e07a" : "#39e07a"}
            />
          </div>

          {/* AI Ask button */}
          <motion.button
            onClick={() => setShowInsights(true)}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-3 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-secondary/80 border border-border py-3.5 insight-pulse active:scale-98 transition-all"
          >
            <div className="relative">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[2px] text-foreground">
              Pergunte ao EVO
            </span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.button>
        </motion.div>

        {/* ====== BENTO GRID ====== */}
        <div className="grid grid-cols-2 gap-3">

          {/* Streak */}
          <BentoCard delay={0.1}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-foreground">{streak}</span>
              <span className="text-xs font-medium text-muted-foreground">dias</span>
            </div>
            <div className="mt-2 flex gap-1">
              {[...Array(Math.min(streak, 7))].map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full bg-primary"
                  style={{ opacity: 0.4 + (i / Math.min(streak, 7)) * 0.6 }}
                />
              ))}
              {streak === 0 && (
                <div className="h-1.5 flex-1 rounded-full bg-border" />
              )}
            </div>
          </BentoCard>

          {/* Weight */}
          <BentoCard delay={0.15}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
                <Scale className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Peso</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-foreground">
                {latestWeight ? latestWeight.val : "--"}
              </span>
              <span className="text-xs font-medium text-muted-foreground">kg</span>
            </div>
            {weightDiff && (
              <div className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                Number(weightDiff) < 0 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
              )}>
                <TrendingDown className={cn("h-3 w-3", Number(weightDiff) > 0 && "rotate-180")} />
                <span className="font-mono text-[9px] font-semibold">
                  {Number(weightDiff) > 0 ? "+" : ""}{weightDiff} kg
                </span>
              </div>
            )}
          </BentoCard>

          {/* Week Grid */}
          <BentoCard className="col-span-2" delay={0.2}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Esta Semana</span>
              </div>
              <span className="font-mono text-[10px] text-primary font-bold">{completedDays}/7</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {weekProgress.map((item) => {
                const isDone = item.progress === 100
                return (
                  <div
                    key={item.day}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-2xl py-2.5 transition-all border",
                      isDone
                        ? "border-primary/30 bg-primary/10"
                        : item.isToday
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/40 bg-secondary/20"
                    )}
                  >
                    <span className={cn(
                      "font-mono text-[8px] uppercase",
                      item.isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {item.day.slice(0, 3)}
                    </span>
                    {isDone ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <svg className="h-2.5 w-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <span className={cn(
                        "font-mono text-[9px] font-bold",
                        item.progress > 0 ? "text-primary" : "text-muted-foreground/25"
                      )}>
                        {item.progress > 0 ? `${item.progress}%` : "-"}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </BentoCard>
        </div>

        {/* ====== WEIGHT EVOLUTION ====== */}
        {weights.length >= 2 && (
          <BentoCard delay={0.25}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingDown className="h-4 w-4 text-primary" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Evolucao do Peso</span>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground">{Math.min(weights.length, 10)} registros</span>
            </div>
            <WeightChart weights={weights} />
          </BentoCard>
        )}

        {/* ====== RECENT EVALS ====== */}
        {Object.keys(evals).length > 0 && (
          <BentoCard delay={0.3}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Avaliacoes</span>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(evals)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 3)
                .map(([date, ev]) => (
                  <div key={date} className="flex items-center justify-between rounded-2xl bg-secondary/40 px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">{fmtDate(date)}</span>
                    <div className="flex items-center gap-2.5">
                      {ev.humor && <span className="text-base">{ev.humor}</span>}
                      {ev.energia && <span className="text-base">{ev.energia}</span>}
                      {ev.fome && <span className="text-base">{ev.fome}</span>}
                    </div>
                  </div>
                ))}
            </div>
          </BentoCard>
        )}
      </div>
    </>
  )
}
