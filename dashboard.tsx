"use client"

import { motion } from "framer-motion"
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
} from "lucide-react"

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

function BentoCard({ children, className, delay = 0 }: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "rounded-3xl border border-border/50 bg-card p-5 card-hover",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface DashboardProps {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  evals: Record<string, DayEval>
}

export function Dashboard({ checked, weights, evals }: DashboardProps) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const todayName = DAYS[todayIdx]
  const todayProgress = getDayProgressReal(todayName, checked)
  const streak = calcStreak(checked)

  // Weight data
  const sortedWeights = [...weights].sort((a, b) => b.date.localeCompare(a.date))
  const latestWeight = sortedWeights[0]
  const prevWeight = sortedWeights[1]
  const weightDiff = latestWeight && prevWeight 
    ? (latestWeight.val - prevWeight.val).toFixed(1)
    : null

  // Week data
  const weekProgress = DAYS.map((day) => ({
    day: day.slice(0, 3),
    progress: getDayProgressReal(day, checked),
  }))
  
  const completedDays = weekProgress.filter(d => d.progress === 100).length

  return (
    <div className="space-y-4 px-4 pb-4">
      {/* Hero Card - Today's Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-6"
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1.5 mb-3">
                <Flame className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-semibold text-primary">{streak} dias de streak</span>
              </div>
              <h2 className="text-lg font-bold text-muted-foreground uppercase tracking-wide">Progresso Hoje</h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-6xl font-black text-gradient">{todayProgress}</span>
                <span className="text-2xl font-bold text-muted-foreground">%</span>
              </div>
            </div>
            <ProgressRing 
              progress={todayProgress} 
              size={80} 
              strokeWidth={6}
              color={todayProgress === 100 ? "success" : "primary"}
            />
          </div>
          
          <div className="mt-5">
            <div className="h-3 overflow-hidden rounded-full bg-border/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${todayProgress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className={cn(
                  "h-full rounded-full",
                  todayProgress === 100 
                    ? "bg-primary glow-primary" 
                    : "bg-gradient-to-r from-primary/80 to-primary"
                )}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bento Grid - Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak Card */}
        <BentoCard delay={0.1}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Trophy className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Streak
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-foreground">{streak}</span>
            <span className="text-sm font-medium text-muted-foreground">dias</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex -space-x-1">
              {[...Array(Math.min(streak, 5))].map((_, i) => (
                <div key={i} className="h-2 w-2 rounded-full bg-primary border border-card" />
              ))}
            </div>
            {streak > 5 && (
              <span className="font-mono text-[9px] text-primary">+{streak - 5}</span>
            )}
          </div>
        </BentoCard>

        {/* Weight Card */}
        <BentoCard delay={0.15}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
              <Scale className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Peso
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-foreground">
              {latestWeight ? latestWeight.val : "--"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">kg</span>
          </div>
          {weightDiff && (
            <div className={cn(
              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5",
              Number(weightDiff) < 0 ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
            )}>
              <TrendingDown className={cn(
                "h-3 w-3",
                Number(weightDiff) > 0 && "rotate-180"
              )} />
              <span className="font-mono text-[10px] font-semibold">
                {Number(weightDiff) > 0 ? "+" : ""}{weightDiff} kg
              </span>
            </div>
          )}
        </BentoCard>

        {/* Week Progress Card */}
        <BentoCard className="col-span-2" delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Esta Semana
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="font-mono text-xs font-semibold">{completedDays}/7</span>
              <span className="font-mono text-[9px] text-muted-foreground">completos</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekProgress.map((item, idx) => {
              const isToday = idx === todayIdx
              const isDone = item.progress === 100

              return (
                <div
                  key={item.day}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition-all",
                    isDone
                      ? "border-primary/40 bg-primary/10"
                      : isToday
                      ? "border-primary/60 bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/50 bg-secondary/30"
                  )}
                >
                  <span className={cn(
                    "font-mono text-[9px] uppercase font-medium",
                    isToday ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.day}
                  </span>
                  {isDone ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        "font-mono text-sm font-bold",
                        item.progress > 0 ? "text-primary" : "text-muted-foreground/30"
                      )}
                    >
                      {item.progress > 0 ? `${item.progress}%` : "-"}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </BentoCard>
      </div>

      {/* Recent evaluations */}
      {Object.keys(evals).length > 0 && (
        <BentoCard delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary">
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Avaliacoes
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {Object.entries(evals)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 3)
              .map(([date, ev]) => (
                <div
                  key={date}
                  className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {fmtDate(date)}
                  </span>
                  <div className="flex items-center gap-3">
                    {ev.humor && <span className="text-base">{ev.humor}</span>}
                    {ev.energia && <span className="text-base">{ev.energia}</span>}
                    {ev.fome && <span className="text-base">{ev.fome}</span>}
                  </div>
                </div>
              ))}
          </div>
        </BentoCard>
      )}

      {/* Weight chart */}
      {weights.length >= 2 && (
        <BentoCard delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                <TrendingDown className="h-4 w-4 text-primary" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Evolucao
              </span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">
              Ultimos {Math.min(weights.length, 12)} registros
            </span>
          </div>
          <WeightChart weights={weights} />
        </BentoCard>
      )}
    </div>
  )
}

function WeightChart({ weights }: { weights: WeightEntry[] }) {
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-12)
  const vals = sorted.map((w) => w.val)
  const min = Math.min(...vals) - 1
  const max = Math.max(...vals) + 1

  const W = 320
  const H = 100
  const pad = 20

  const x = (i: number) => pad + (i / (sorted.length - 1)) * (W - pad * 2)
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2)

  const pts = sorted.map((w, i) => `${x(i)},${y(w.val)}`).join(" ")
  const area =
    `${pad},${H - pad} ` +
    sorted.map((w, i) => `${x(i)},${y(w.val)}`).join(" ") +
    ` ${W - pad},${H - pad}`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#wg)" />
      <polyline
        points={pts}
        fill="none"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {sorted.map((w, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(w.val)} r="5" fill="#4ade80" />
          <circle cx={x(i)} cy={y(w.val)} r="3" fill="#0a1612" />
          <text
            x={x(i)}
            y={y(w.val) - 10}
            fill="#6b8a7e"
            fontSize="9"
            textAnchor="middle"
            fontFamily="monospace"
            fontWeight="600"
          >
            {w.val}
          </text>
        </g>
      ))}
    </svg>
  )
}
