"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Check } from "lucide-react"

export interface OnboardingData {
  nome: string
  peso: string
  altura: string
  objetivo: "perder_gordura" | "ganhar_massa" | "manter" | "recomposicao"
  atividadeFisica: "sedentario" | "leve" | "moderado" | "intenso"
  restricoes: string
  suplementos: string[]
}

interface Props {
  onComplete: (data: OnboardingData) => void
}

const OBJETIVOS = [
  { id: "perder_gordura", label: "Perder gordura", sub: "Déficit calórico controlado" },
  { id: "ganhar_massa",   label: "Ganhar massa",   sub: "Superávit com proteína alta" },
  { id: "manter",        label: "Manter",          sub: "Equilíbrio e saúde" },
  { id: "recomposicao",  label: "Recomposição",    sub: "Perder gordura e ganhar músculo" },
] as const

const ATIVIDADES = [
  { id: "sedentario", label: "Sedentário",   sub: "Sem atividade física" },
  { id: "leve",       label: "Leve",         sub: "1-2x por semana" },
  { id: "moderado",   label: "Moderado",     sub: "3-4x por semana" },
  { id: "intenso",    label: "Intenso",      sub: "5x ou mais por semana" },
] as const

const SUPLEMENTOS_OPT = ["Creatina", "Whey Protein", "Vitamina D", "Ômega 3", "Outro"]

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Partial<OnboardingData>>({
    suplementos: [],
  })

  const steps = [
    "Bem-vindo",
    "Dados básicos",
    "Objetivo",
    "Atividade",
    "Preferências",
    "Pronto",
  ]

  function next() { setStep(s => Math.min(s + 1, steps.length - 1)) }
  function canAdvance() {
    if (step === 1) return data.nome && data.peso && data.altura
    if (step === 2) return data.objetivo
    if (step === 3) return data.atividadeFisica
    return true
  }

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'var(--bg)' }}>

      {/* Mesh bg */}
      <div className="motion-bg">
        <div className="m-orb orb-navy"/><div className="m-orb orb-ocean"/>
        <div className="m-orb orb-teal"/><div className="m-orb orb-neon"/>
      </div>
      <div className="motion-grain"/>

      {/* Progress dots */}
      <div className="relative z-10 flex justify-center gap-2 pt-safe pt-16 pb-4">
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6,
            borderRadius: 100,
            background: i <= step ? 'var(--primary)' : 'var(--fg-3)',
            transition: 'all 0.3s',
          }}/>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            variants={slideVariants} initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col justify-center">

            {/* STEP 0 — Welcome */}
            {step === 0 && (
              <div className="text-center">
                <div style={{
                  fontFamily: 'var(--font-logo)', fontSize: '4rem',
                  color: 'var(--fg)', letterSpacing: '0.08em',
                  textShadow: '0 0 60px rgba(26,149,151,0.4)',
                  marginBottom: 16,
                }}>EVO</div>
                <h1 style={{
                  fontFamily: 'var(--font-title)', fontSize: '1.6rem',
                  color: 'var(--fg)', lineHeight: 1.2, marginBottom: 12,
                }}>Evolua seu corpo,<br/>do jeito certo</h1>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                  color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 32,
                }}>
                  Vamos montar sua dieta base com foco em comida real, baseada na pirâmide alimentar brasileira.
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                  color: 'var(--fg-3)', lineHeight: 1.5,
                }}>
                  Este app é um auxílio inteligente. Não substitui médico ou nutricionista.
                </p>
              </div>
            )}

            {/* STEP 1 — Dados */}
            {step === 1 && (
              <div>
                <div className="label-xs" style={{ marginBottom: 4 }}>Passo 2</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--fg)', marginBottom: 24 }}>
                  Seus dados
                </h2>
                {[
                  { key: 'nome', label: 'Como te chamamos?', placeholder: 'Seu nome', type: 'text' },
                  { key: 'peso', label: 'Peso atual (kg)',    placeholder: 'Ex: 92.5', type: 'number' },
                  { key: 'altura', label: 'Altura (cm)',      placeholder: 'Ex: 178', type: 'number' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                      fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input type={f.type} placeholder={f.placeholder}
                      value={(data as any)[f.key] || ''}
                      onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '12px 16px',
                        borderRadius: 14, outline: 'none',
                        background: 'var(--card)', border: '1px solid var(--border)',
                        color: 'var(--fg)', fontSize: '0.95rem',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2 — Objetivo */}
            {step === 2 && (
              <div>
                <div className="label-xs" style={{ marginBottom: 4 }}>Passo 3</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--fg)', marginBottom: 24 }}>
                  Qual seu objetivo?
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {OBJETIVOS.map(o => {
                    const on = data.objetivo === o.id
                    return (
                      <button key={o.id} onClick={() => setData(d => ({ ...d, objetivo: o.id }))}
                        className="press glass"
                        style={{
                          padding: '14px 16px', textAlign: 'left',
                          border: on ? '1px solid rgba(26,149,151,0.5)' : '1px solid var(--border)',
                          background: on ? 'rgba(26,149,151,0.12)' : undefined,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600,
                            fontSize: '0.9rem', color: 'var(--fg)' }}>{o.label}</div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                            color: 'var(--fg-3)', marginTop: 2 }}>{o.sub}</div>
                        </div>
                        {on && <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0 }}/>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 3 — Atividade */}
            {step === 3 && (
              <div>
                <div className="label-xs" style={{ marginBottom: 4 }}>Passo 4</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--fg)', marginBottom: 24 }}>
                  Nível de atividade
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ATIVIDADES.map(a => {
                    const on = data.atividadeFisica === a.id
                    return (
                      <button key={a.id} onClick={() => setData(d => ({ ...d, atividadeFisica: a.id }))}
                        className="press glass"
                        style={{
                          padding: '14px 16px', textAlign: 'left',
                          border: on ? '1px solid rgba(26,149,151,0.5)' : '1px solid var(--border)',
                          background: on ? 'rgba(26,149,151,0.12)' : undefined,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                        <div>
                          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600,
                            fontSize: '0.9rem', color: 'var(--fg)' }}>{a.label}</div>
                          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                            color: 'var(--fg-3)', marginTop: 2 }}>{a.sub}</div>
                        </div>
                        {on && <Check size={16} style={{ color: 'var(--primary)', flexShrink: 0 }}/>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 — Preferências */}
            {step === 4 && (
              <div>
                <div className="label-xs" style={{ marginBottom: 4 }}>Passo 5</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--fg)', marginBottom: 8 }}>
                  Preferências
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--fg-2)', marginBottom: 20 }}>
                  Opcional — nos ajuda a personalizar melhor
                </p>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                    fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>
                    Restrições ou alergias
                  </label>
                  <input type="text" placeholder="Ex: sem lactose, alergia a amendoim..."
                    value={data.restricoes || ''}
                    onChange={e => setData(d => ({ ...d, restricoes: e.target.value }))}
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 14, outline: 'none',
                      background: 'var(--card)', border: '1px solid var(--border)',
                      color: 'var(--fg)', fontSize: '0.9rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem',
                    fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>
                    Suplementos que usa ou quer incluir
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SUPLEMENTOS_OPT.map(s => {
                      const on = data.suplementos?.includes(s)
                      return (
                        <button key={s}
                          className="press"
                          onClick={() => setData(d => ({
                            ...d,
                            suplementos: on
                              ? d.suplementos?.filter(x => x !== s)
                              : [...(d.suplementos || []), s]
                          }))}
                          style={{
                            padding: '7px 14px', borderRadius: 100,
                            fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 500,
                            background: on ? 'rgba(26,149,151,0.15)' : 'var(--card)',
                            border: on ? '1px solid rgba(26,149,151,0.4)' : '1px solid var(--border)',
                            color: on ? 'var(--primary)' : 'var(--fg-2)',
                          }}>
                          {s}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 — Pronto */}
            {step === 5 && (
              <div className="text-center">
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(26,149,151,0.15)', border: '2px solid rgba(26,149,151,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 0 32px rgba(26,149,151,0.25)',
                }}>
                  <Check size={32} style={{ color: 'var(--primary)' }}/>
                </div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem',
                  color: 'var(--fg)', marginBottom: 12 }}>
                  Tudo pronto, {data.nome}!
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem',
                  color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 8 }}>
                  Sua dieta base foi preparada com base nos seus dados. Lembre: isso é uma sugestão de ponto de partida.
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                  color: 'var(--fg-3)', lineHeight: 1.5 }}>
                  Consulte um nutricionista para acompanhamento personalizado.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 px-6 pb-safe" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}>
        <button
          className="press"
          disabled={!canAdvance()}
          onClick={() => {
            if (step < steps.length - 1) {
              next()
            } else {
              onComplete(data as OnboardingData)
            }
          }}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 100, cursor: canAdvance() ? 'pointer' : 'not-allowed',
            background: canAdvance() ? 'var(--primary)' : 'var(--fg-3)',
            color: canAdvance() ? '#000022' : 'var(--fg-3)',
            fontFamily: 'var(--font-body)', fontWeight: 700,
            fontSize: '0.95rem', letterSpacing: '-0.01em',
            boxShadow: canAdvance() ? '0 0 24px rgba(26,149,151,0.4)' : 'none',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
          {step < steps.length - 1 ? 'Continuar' : 'Entrar no EVO'}
          <ChevronRight size={18}/>
        </button>
      </div>
    </div>
  )
}
