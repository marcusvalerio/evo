"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Utensils, ShoppingBag, Dumbbell, Brain } from "lucide-react"
import { WeightEntry, DayEval, fmtDate, calcStreak, getDayProgressReal } from "@/lib/helpers"
import { DAYS } from "@/lib/data"

interface Msg { role: "user" | "assistant"; content: string }

const QUICK = [
  { Icon: Utensils,    label: "Montar dieta base",       q: "Me ajuda a montar uma dieta base personalizada com base na pirâmide alimentar brasileira. Foco em comida real." },
  { Icon: ShoppingBag, label: "Lista de compras",         q: "Gera uma lista de compras objetiva para a semana, por categoria, baseada na dieta." },
  { Icon: Dumbbell,    label: "Pré-treino",               q: "O que comer antes do treino? Algo prático com comida real." },
  { Icon: Brain,       label: "Como evoluir mais",        q: "Como posso melhorar minha evolução física com base no meu progresso atual?" },
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

  const system = `Você é o EVO Coach — coach de evolução física e alimentar direto ao ponto.

Filosofia: comida real, pirâmide alimentar brasileira, sem industrializados. Suplementação só se o usuário mencionar (creatina e whey são ok). Não substitui médico ou nutricionista — mencione uma vez se relevante, sem repetir.

Perfil: Nome: ${userName||'não informado'} / Objetivo: ${userGoal||'não informado'} / Peso: ${lastW?`${lastW.val}kg`:'não registrado'} / Streak: ${streak} dias / Hoje: ${pct}%${recentEv.length>0?' / '+recentEv.map(([d,e])=>`${fmtDate(d)}: humor ${e.humor}`).join(', '):''}

Responda de forma direta e técnica. Máximo 3 parágrafos curtos. Sem listas longas. Sem asteriscos. Sem markdown. Tom: coach experiente, não app motivacional.`

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
      setMsgs(prev => [...prev, {
        role: "assistant",
        content: data.content?.[0]?.text || data.error || "Erro na resposta."
      }])
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Erro de conexão." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: '#000000', display: 'flex', flexDirection: 'column',
      }}>

      {/* Header */}
      <div className="pt-safe" style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div className="label" style={{ marginBottom: 2 }}>EVO IA</div>
          <h2 style={{ fontFamily: 'var(--f-title)', fontSize: '1.1rem',
            textTransform: 'uppercase', letterSpacing: '0.07em', color: '#FFFFFF' }}>
            Coach
          </h2>
        </div>
        <button onClick={onClose} className="btn-ghost press" style={{ padding: '8px 12px' }}>
          <X size={14}/>
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {msgs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{
              fontFamily: 'var(--f-body)', fontSize: '0.8rem', fontWeight: 300,
              color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 20,
              borderLeft: '2px solid rgba(255,255,255,0.12)', paddingLeft: 12,
            }}>
              {streak > 0 ? `${streak} dias no streak. O que você quer saber?` : 'Pronto para te ajudar.'}
            </p>

            <div className="label" style={{ marginBottom: 10 }}>Perguntas rápidas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {QUICK.map(({ Icon, label, q }) => (
                <button key={label} onClick={() => send(q)}
                  className="press"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', background: 'var(--surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'left', cursor: 'pointer',
                  }}>
                  <Icon size={14} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}/>
                  <span style={{ fontFamily: 'var(--f-body)', fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.6)', fontWeight: 400, flex: 1 }}>
                    {label}
                  </span>
                  <ArrowRight size={12} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}/>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {msgs.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                marginBottom: 12,
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
              <div style={{
                maxWidth: '86%',
                padding: '10px 14px',
                background: m.role === 'user' ? '#FFFFFF' : 'var(--surface)',
                border: `1px solid ${m.role === 'user' ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                fontFamily: 'var(--f-body)',
                fontSize: '0.82rem', fontWeight: m.role === 'user' ? 400 : 300,
                color: m.role === 'user' ? '#000000' : 'rgba(255,255,255,0.75)',
                lineHeight: 1.6,
              }}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div style={{
            display: 'flex', gap: 6, padding: '10px 14px',
            background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)',
            width: 'fit-content',
          }}>
            {[0,1,2].map(i => (
              <motion.div key={i}
                style={{ width: 4, height: 4, background: 'rgba(255,255,255,0.4)' }}
                animate={{ opacity: [0.3,1,0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i*0.22 }}/>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 16px', flexShrink: 0,
        display: 'flex', gap: 8,
      }} className="pb-safe">
        <input type="text" value={input} placeholder="Pergunte..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          className="input-brutal" style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}/>
        <button onClick={() => send(input)} disabled={!input.trim() || loading}
          className="btn-primary press"
          style={{ padding: '10px 16px', opacity: input.trim() && !loading ? 1 : 0.35 }}>
          <ArrowRight size={15}/>
        </button>
      </div>
    </motion.div>
  )
}
