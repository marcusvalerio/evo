"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, ChevronRight, Sparkles, Brain, UtensilsCrossed, ShoppingBag, Dumbbell } from "lucide-react"
import { WeightEntry, DayEval, fmtDate, calcStreak, getDayProgressReal } from "@/lib/helpers"
import { DAYS, DayName } from "@/lib/data"

interface Msg { role: "user" | "assistant"; content: string }



const QUICK = [
  { icon: UtensilsCrossed, label: "Montar minha dieta base", q: "Me ajuda a montar uma dieta base personalizada pra mim, com base na piramide alimentar brasileira. Foca em comida real." },
  { icon: ShoppingBag,     label: "Gerar lista de compras", q: "Com base na minha dieta, gera uma lista de compras objetiva pra semana, por categoria." },
  { icon: Dumbbell,        label: "Sugestao pre-treino",    q: "O que comer antes do treino? Quero algo pratico com comida real." },
  { icon: Brain,           label: "Como evoluir mais",      q: "Como posso melhorar minha evolucao fisica com base no meu progresso atual?" },
]

interface Props {
  onClose: () => void
  weights: WeightEntry[]
  evals: Record<string, DayEval>
  checked: Record<string, boolean>
  userName?: string
  userGoal?: string
}

export function IAModal({ onClose, weights, evals, checked, userName, userGoal }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const streak = calcStreak(checked)
  const pct = getDayProgressReal(DAYS[todayIdx], checked)
  const lastW = [...weights].sort((a,b) => b.date.localeCompare(a.date))[0]
  const recentEv = Object.entries(evals).sort(([a],[b]) => b.localeCompare(a)).slice(0,3)

  const system = `Voce e o EVO Coach — coach de evolucao fisica e alimentar do app EVO.

Filosofia: comida real, pirâmide alimentar brasileira, sem industrializados. Suplementacao apenas se mencionada pelo usuario (creatina e whey sao ok como excecao). Nao substitui medico nem nutricionista — mencione isso quando relevante, sem exagerar.

Perfil do usuario:
- Nome: ${userName || "nao informado"}
- Objetivo: ${userGoal || "nao informado"}
- Peso recente: ${lastW ? `${lastW.val}kg` : "nao registrado"}
- Streak: ${streak} dias
- Progresso hoje: ${pct}%
- Avaliacoes recentes: ${recentEv.length > 0 ? recentEv.map(([d,e]) => `${fmtDate(d)}: humor ${e.humor}, energia ${e.energia}`).join(" | ") : "sem avaliacao"}

Tom: direto, humano, como um coach de verdade. Sem enrolacao, sem frases feitas de app. Maximo 3 paragrafos curtos. Sem listas longas. Sem asteriscos. Sem markdown.

Se pedir dieta base: use a pirâmide alimentar brasileira (cereais, vegetais, frutas, leguminosas, laticinios, carnes, oleos). Avise que e sugestao e recomende acompanhamento com nutricionista.`

  async function send(text: string) {
    if (!text.trim() || loading) return
    const newMsgs = [...msgs, { role: "user" as const, content: text }]
    setMsgs(newMsgs)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system,
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMsgs(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Nao consegui responder agora." }])
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Erro de conexao. Tenta de novo." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col"
      style={{ background: "rgba(0,0,20,0.97)", backdropFilter: "blur(40px)" }}
    >
      {/* Header */}
      <div className="pt-safe flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid rgba(26,149,151,.15)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: "rgba(26,149,151,.12)", border: "1px solid rgba(26,149,151,.25)",
              boxShadow: "0 0 20px rgba(26,149,151,.15)" }}>
            <Sparkles size={18} style={{ color: "#1A9597", filter: "drop-shadow(0 0 6px #1A9597)" }}/>
          </div>
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[3px]"
              style={{ color: "rgba(238,242,243,.35)" }}>EVO</div>
            <div className="text-base font-black tracking-tight" style={{ color: "#FDFDFE" }}>Coach IA</div>
          </div>
        </div>
        <button onClick={onClose}
          className="press flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}>
          <X size={16} style={{ color: "rgba(238,242,243,.5)" }}/>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {msgs.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="glass rounded-3xl p-5">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(238,242,243,.65)" }}>
                {streak > 0
                  ? `${streak} dias no streak. Tô aqui pra te ajudar a evoluir.`
                  : "Pronto pra te ajudar. O que você quer saber?"}
              </p>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(238,242,243,.3)" }}>
                Lembrete: sou um auxilio inteligente, nao substituo medico ou nutricionista.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK.map(({ icon: Icon, label, q }) => (
                <button key={label} onClick={() => send(q)}
                  className="press glass rounded-2xl px-3 py-4 text-left flex flex-col gap-2 transition-all"
                  style={{ border: "1px solid rgba(26,149,151,.15)" }}>
                  <Icon size={16} style={{ color: "#1A9597" }}/>
                  <span className="font-mono text-[9px] uppercase tracking-wide leading-snug"
                    style={{ color: "rgba(238,242,243,.55)" }}>{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {msgs.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .22 }}
              className={`max-w-[88%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
              <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={m.role === "user"
                  ? { background: "#1A9597", color: "#000022", borderRadius: "1rem 1rem 0.25rem 1rem" }
                  : { background: "rgba(16,64,113,.4)", border: "1px solid rgba(26,149,151,.2)",
                      color: "#FDFDFE", borderRadius: "1rem 1rem 1rem 0.25rem" }}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-1.5 px-4 py-3 rounded-2xl w-fit mr-auto"
            style={{ background: "rgba(16,64,113,.4)", border: "1px solid rgba(26,149,151,.2)" }}>
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#1A9597" }}
                animate={{ opacity: [.3,1,.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i*.2 }}/>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pt-3 pb-safe pb-4"
        style={{ borderTop: "1px solid rgba(26,149,151,.12)",
          background: "rgba(0,0,20,.8)", backdropFilter: "blur(24px)" }}>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: "rgba(16,64,113,.2)", border: "1px solid rgba(26,149,151,.2)" }}>
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Pergunte qualquer coisa..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#FDFDFE", caretColor: "#1A9597" }}
          />
          <button onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="press flex h-8 w-8 items-center justify-center rounded-xl transition-opacity disabled:opacity-30"
            style={{ background: "#1A9597", boxShadow: "0 0 12px rgba(26,149,151,.4)" }}>
            <Send size={14} style={{ color: "#000022" }}/>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
