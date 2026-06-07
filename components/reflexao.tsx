"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, RefreshCw } from "lucide-react"

const REFLEXOES = [
  {
    texto: "Disciplina não é motivação acumulada. É uma decisão repetida quando a motivação sumiu.",
    fonte: "James Clear",
    tag: "Constância"
  },
  {
    texto: "O corpo consegue quase qualquer coisa. É a mente que precisa ser convencida.",
    fonte: "Treino",
    tag: "Mentalidade"
  },
  {
    texto: "Você não falha por falta de força. Você falha por falta de clareza no que realmente quer.",
    fonte: "Reflexão",
    tag: "Foco"
  },
  {
    texto: "Comer bem não é punição. É o mínimo de respeito que você pode ter com o próprio corpo.",
    fonte: "Nutrição",
    tag: "Alimentação"
  },
  {
    texto: "Progresso sem consistência é acidente. Consistência sem progresso é método errado. Revise os dois.",
    fonte: "Processo",
    tag: "Método"
  },
  {
    texto: "A diferença entre quem chega e quem desiste está nos dias ruins. Nesses dias, aparecer já é suficiente.",
    fonte: "Continuidade",
    tag: "Resiliência"
  },
  {
    texto: "Músculo não cresce no treino. Cresce no descanso, no sono e na comida. O treino é só o sinal.",
    fonte: "Fisiologia",
    tag: "Recuperação"
  },
  {
    texto: "Não compare seu progresso com o de ninguém. Os pontos de partida são diferentes. Os objetivos são diferentes. A genética é diferente.",
    fonte: "Individualidade",
    tag: "Autoconhecimento"
  },
  {
    texto: "Cada refeição é uma escolha. Não precisa ser perfeita — precisa ser intencional.",
    fonte: "Dieta",
    tag: "Alimentação"
  },
  {
    texto: "Você não precisa de mais informação. Você precisa executar o que já sabe.",
    fonte: "Ação",
    tag: "Execução"
  },
  {
    texto: "Peso na balança é dado, não julgamento. Use como ferramenta, não como punição.",
    fonte: "Progresso",
    tag: "Dados"
  },
  {
    texto: "Hidratação, sono e proteína resolvem mais do que qualquer suplemento.",
    fonte: "Fundamentos",
    tag: "Básico"
  },
  {
    texto: "Treino com 60% de intensidade feito 5x por semana supera treino com 100% feito 1x.",
    fonte: "Frequência",
    tag: "Consistência"
  },
  {
    texto: "Você não está atrasado. Está no tempo certo pra fazer diferente do que estava fazendo.",
    fonte: "Tempo",
    tag: "Perspectiva"
  },
  {
    texto: "Comida real não precisa de lista de ingredientes. Esse é o critério mais simples que existe.",
    fonte: "Nutrição",
    tag: "Alimentação"
  },
]

const DICAS = [
  { titulo: "Proteína em cada refeição", corpo: "Inclua uma fonte de proteína no café, almoço, lanche e jantar. Isso preserva massa muscular e controla a fome ao longo do dia." },
  { titulo: "Sono é treino também", corpo: "Menos de 7 horas de sono compromete a recuperação muscular, aumenta cortisol e reduz a capacidade de queimar gordura. Durma como prioridade." },
  { titulo: "Creatina funciona de verdade", corpo: "É o suplemento com mais evidência científica. 5g por dia, todo dia, independente de treino. Os efeitos aparecem após 2-4 semanas de uso contínuo." },
  { titulo: "Hidratação antes de tudo", corpo: "Desidratação de 2% já reduz performance física e cognitiva. Beba água antes de sentir sede — quando a sede aparece, o processo já começou." },
  { titulo: "Carboidrato não é inimigo", corpo: "É o combustível principal do treino. Cortar carboidrato sem orientação derruba energia, humor e performance. A questão é qualidade e quantidade, não eliminação." },
  { titulo: "Pesagem: mesmas condições", corpo: "Pese-se sempre no mesmo horário (preferencialmente manhã, em jejum). O peso varia 1-2kg ao longo do dia. O que importa é a tendência semanal, não o número isolado." },
]

export function Reflexao() {
  const [reflexaoIdx, setReflexaoIdx] = useState(0)
  const [dicaIdx, setDicaIdx] = useState(0)

  useEffect(() => {
    const d = new Date()
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
    setReflexaoIdx(dayOfYear % REFLEXOES.length)
    setDicaIdx(dayOfYear % DICAS.length)
  }, [])

  const r = REFLEXOES[reflexaoIdx]
  const dica = DICAS[dicaIdx]

  return (
    <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Header */}
      <div style={{ paddingTop: 8, paddingBottom: 4 }}>
        <div className="label-xs" style={{ marginBottom: 4 }}>Reflexão do dia</div>
        <h2 style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1.4rem', color: 'var(--fg)', lineHeight: 1.2,
        }}>Pensa nisso</h2>
      </div>

      {/* Reflexão principal */}
      <AnimatePresence mode="wait">
        <motion.div key={reflexaoIdx}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
          className="glass"
          style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative quote mark */}
          <div style={{
            position: 'absolute', top: 12, right: 16,
            fontFamily: 'Georgia, serif', fontSize: '5rem',
            color: 'var(--primary)', opacity: 0.12, lineHeight: 1,
            userSelect: 'none', pointerEvents: 'none',
          }}>"</div>

          <span className="label-xs" style={{ marginBottom: 12, display: 'block',
            color: 'var(--primary)', letterSpacing: '0.2em' }}>
            {r.tag}
          </span>
          <p style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.1rem', lineHeight: 1.55,
            color: 'var(--fg)', marginBottom: 16,
          }}>
            {r.texto}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              color: 'var(--fg-3)', fontWeight: 500 }}>
              — {r.fonte}
            </span>
            <button
              onClick={() => setReflexaoIdx((reflexaoIdx + 1) % REFLEXOES.length)}
              className="press"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--primary-bg)', border: '1px solid rgba(26,149,151,0.2)',
                borderRadius: 100, padding: '4px 10px', cursor: 'pointer',
              }}>
              <RefreshCw size={11} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--primary)',
                textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Outra
              </span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dica do dia */}
      <div className="label-xs" style={{ paddingTop: 4 }}>Dica da semana</div>
      <AnimatePresence mode="wait">
        <motion.div key={dicaIdx}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, delay: 0.05 }}
          className="glass" style={{ padding: '1.25rem' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            marginBottom: 10,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1rem', color: 'var(--fg)', lineHeight: 1.3, flex: 1,
            }}>
              {dica.titulo}
            </h3>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--fg-2)',
          }}>
            {dica.corpo}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Todas as reflexões */}
      <div className="label-xs" style={{ paddingTop: 4 }}>Mais reflexões</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {REFLEXOES.filter((_, i) => i !== reflexaoIdx).slice(0, 5).map((ref, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            onClick={() => setReflexaoIdx(REFLEXOES.indexOf(ref))}
            className="glass press"
            style={{
              padding: '0.9rem 1.1rem', textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
            <div style={{ flex: 1 }}>
              <span className="label-xs" style={{ color: 'var(--primary)', marginBottom: 4, display: 'block' }}>
                {ref.tag}
              </span>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem', color: 'var(--fg-2)', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {ref.texto}
              </p>
            </div>
            <ChevronRight size={14} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
