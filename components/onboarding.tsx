"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export interface OnboardingData {
  nome: string
  peso: string
  altura: string
  objetivo: "perder_gordura" | "ganhar_massa" | "manter" | "recomposicao"
  atividadeFisica: "sedentario" | "leve" | "moderado" | "intenso"
  restricoes: string
  suplementos: string[]
}

const OBJETIVOS = [
  { id: "perder_gordura", label: "Perder gordura",  sub: "Déficit calórico" },
  { id: "ganhar_massa",   label: "Ganhar massa",    sub: "Superávit com proteína" },
  { id: "manter",        label: "Manter",           sub: "Equilíbrio e saúde" },
  { id: "recomposicao",  label: "Recomposição",     sub: "Gordura ↓ / Músculo ↑" },
] as const

const ATIVIDADES = [
  { id: "sedentario", label: "Sedentário",  sub: "Sem atividade" },
  { id: "leve",       label: "Leve",        sub: "1–2x por semana" },
  { id: "moderado",   label: "Moderado",    sub: "3–4x por semana" },
  { id: "intenso",    label: "Intenso",     sub: "5x ou mais" },
] as const

const SUPLEMENTOS = ["Creatina", "Whey", "Vitamina D", "Ômega 3", "Outro"]

export function Onboarding({ onComplete }: { onComplete: (d: OnboardingData) => void }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Partial<OnboardingData>>({ suplementos: [] })

  const TOTAL = 6
  const canNext = () => {
    if (step === 1) return data.nome && data.peso && data.altura
    if (step === 2) return !!data.objetivo
    if (step === 3) return !!data.atividadeFisica
    return true
  }

  function OptionRow({ id, label, sub, active, onClick }: {
    id: string; label: string; sub: string; active: boolean; onClick: () => void
  }) {
    return (
      <button onClick={onClick} className="press" style={{
        width: '100%', textAlign: 'left',
        padding: '14px 16px',
        background: active ? 'var(--surface-2)' : 'var(--void)',
        border: `1px solid ${active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
        marginBottom: 6, cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--f-title)', fontSize: '0.85rem',
            textTransform: 'uppercase', letterSpacing: '0.06em', color: active ? '#FFF' : 'rgba(255,255,255,0.6)' }}>
            {label}
          </div>
          <div className="label" style={{ marginTop: 3 }}>{sub}</div>
        </div>
        {active && (
          <div style={{ width: 18, height: 18, background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5L4 7L8 3" stroke="#000" strokeWidth="1.5"
                strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
          </div>
        )}
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#000000', display: 'flex', flexDirection: 'column',
    }}>
      {/* Progress ruler */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'var(--orange)' }}/>
      </div>

      {/* Step counter */}
      <div className="pt-safe" style={{
        padding: '14px 16px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--f-logo)', fontSize: '1.1rem',
          letterSpacing: '0.12em', color: '#FFFFFF' }}>EVO</span>
        <span className="label">{step + 1} / {TOTAL}</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '0' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
            style={{
              position: 'absolute', inset: 0, padding: '24px 16px 0',
              overflowY: 'auto',
            }}>

            {/* STEP 0 */}
            {step === 0 && (
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Bem-vindo</div>
                <h1 style={{ fontFamily: 'var(--f-title)', fontSize: '2rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#FFFFFF', lineHeight: 1.15, marginBottom: 20 }}>
                  Evolua<br/>seu corpo<br/>do jeito certo
                </h1>
                <div style={{ borderLeft: '2px solid var(--orange)', paddingLeft: 14, marginBottom: 24 }}>
                  <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.82rem',
                    fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
                    Vamos montar sua dieta base com foco em comida real,
                    baseada na pirâmide alimentar brasileira.
                  </p>
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--surface)',
                  border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.65rem',
                    fontWeight: 300, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6,
                    textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Este app é um auxílio inteligente. Não substitui médico ou nutricionista.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Dados básicos</div>
                <h2 style={{ fontFamily: 'var(--f-title)', fontSize: '1.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#FFFFFF', marginBottom: 24 }}>Seus dados</h2>
                {[
                  { key: 'nome',   label: 'Nome',          placeholder: 'Como te chamamos', type: 'text' },
                  { key: 'peso',   label: 'Peso atual (kg)', placeholder: '92.5',           type: 'number' },
                  { key: 'altura', label: 'Altura (cm)',    placeholder: '178',              type: 'number' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <div className="label" style={{ marginBottom: 6 }}>{f.label}</div>
                    <input type={f.type} placeholder={f.placeholder}
                      value={(data as any)[f.key] || ''}
                      onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
                      className="input-brutal"/>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Objetivo</div>
                <h2 style={{ fontFamily: 'var(--f-title)', fontSize: '1.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#FFFFFF', marginBottom: 24 }}>Qual seu objetivo?</h2>
                {OBJETIVOS.map(o => (
                  <OptionRow key={o.id} id={o.id} label={o.label} sub={o.sub}
                    active={data.objetivo === o.id}
                    onClick={() => setData(d => ({ ...d, objetivo: o.id }))}/>
                ))}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Atividade</div>
                <h2 style={{ fontFamily: 'var(--f-title)', fontSize: '1.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#FFFFFF', marginBottom: 24 }}>Nível de atividade</h2>
                {ATIVIDADES.map(a => (
                  <OptionRow key={a.id} id={a.id} label={a.label} sub={a.sub}
                    active={data.atividadeFisica === a.id}
                    onClick={() => setData(d => ({ ...d, atividadeFisica: a.id }))}/>
                ))}
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Preferências</div>
                <h2 style={{ fontFamily: 'var(--f-title)', fontSize: '1.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#FFFFFF', marginBottom: 8 }}>Personalize</h2>
                <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.75rem', fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Opcional</p>
                <div className="label" style={{ marginBottom: 6 }}>Restrições / alergias</div>
                <input type="text" placeholder="sem lactose, alergia a glúten..."
                  value={data.restricoes || ''}
                  onChange={e => setData(d => ({ ...d, restricoes: e.target.value }))}
                  className="input-brutal" style={{ marginBottom: 20 }}/>
                <div className="label" style={{ marginBottom: 10 }}>Suplementos</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SUPLEMENTOS.map(s => {
                    const on = data.suplementos?.includes(s)
                    return (
                      <button key={s} onClick={() => setData(d => ({
                        ...d,
                        suplementos: on ? d.suplementos?.filter(x => x !== s) : [...(d.suplementos||[]), s]
                      }))}
                        className={`chip ${on ? 'chip-active' : ''} press`}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <div className="label" style={{ marginBottom: 12 }}>Pronto</div>
                <h2 style={{ fontFamily: 'var(--f-title)', fontSize: '1.5rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#FFFFFF', marginBottom: 20 }}>
                  Sistema configurado
                </h2>
                <div style={{ border: '1px solid rgba(255,255,255,0.08)',
                  background: 'var(--surface)', marginBottom: 16 }}>
                  {[
                    { l: 'Nome',      v: data.nome || '—' },
                    { l: 'Peso',      v: data.peso ? `${data.peso} kg` : '—' },
                    { l: 'Altura',    v: data.altura ? `${data.altura} cm` : '—' },
                    { l: 'Objetivo',  v: data.objetivo?.replace('_', ' ') || '—' },
                    { l: 'Atividade', v: data.atividadeFisica || '—' },
                  ].map((r, i) => (
                    <div key={r.l} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '10px 16px',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}>
                      <span className="label">{r.l}</span>
                      <span style={{ fontFamily: 'var(--f-body)', fontSize: '0.78rem',
                        color: '#FFFFFF', textTransform: 'capitalize' }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.68rem', fontWeight: 300,
                  color: 'rgba(255,255,255,0.3)', lineHeight: 1.6,
                  textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Sugestão de ponto de partida. Consulte um nutricionista para acompanhamento personalizado.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
        className="pb-safe">
        <button
          className="btn-orange press"
          disabled={!canNext()}
          onClick={() => {
            if (step < TOTAL - 1) setStep(s => s + 1)
            else onComplete(data as OnboardingData)
          }}
          style={{
            width: '100%', opacity: canNext() ? 1 : 0.3,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
          <span>{step < TOTAL - 1 ? 'Continuar' : `Entrar — ${data.nome || 'EVO'}`}</span>
          <ArrowRight size={16} strokeWidth={2}/>
        </button>
      </div>
    </div>
  )
}
