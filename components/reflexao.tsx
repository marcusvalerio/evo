"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const REFLEXOES = [
  { texto: "Disciplina não é motivação acumulada. É uma decisão repetida quando a motivação sumiu.", fonte: "James Clear", tag: "CONSTÂNCIA" },
  { texto: "O corpo consegue quase qualquer coisa. É a mente que precisa ser convencida.", fonte: "Treino", tag: "MENTALIDADE" },
  { texto: "Você não falha por falta de força. Falha por falta de clareza no que realmente quer.", fonte: "Reflexão", tag: "FOCO" },
  { texto: "Comer bem não é punição. É o mínimo de respeito que você pode ter com o próprio corpo.", fonte: "Nutrição", tag: "ALIMENTAÇÃO" },
  { texto: "Progresso sem consistência é acidente. Consistência sem progresso é método errado.", fonte: "Processo", tag: "MÉTODO" },
  { texto: "A diferença entre quem chega e quem desiste está nos dias ruins. Nesses dias, aparecer já é suficiente.", fonte: "Continuidade", tag: "RESILIÊNCIA" },
  { texto: "Músculo não cresce no treino. Cresce no descanso, no sono e na comida. O treino é só o sinal.", fonte: "Fisiologia", tag: "RECUPERAÇÃO" },
  { texto: "Não compare seu progresso com o de ninguém. Os pontos de partida são diferentes.", fonte: "Individualidade", tag: "AUTOCONHECIMENTO" },
  { texto: "Cada refeição é uma escolha. Não precisa ser perfeita — precisa ser intencional.", fonte: "Dieta", tag: "INTENÇÃO" },
  { texto: "Você não precisa de mais informação. Precisa executar o que já sabe.", fonte: "Ação", tag: "EXECUÇÃO" },
  { texto: "Peso na balança é dado, não julgamento. Use como ferramenta, não como punição.", fonte: "Progresso", tag: "DADOS" },
  { texto: "Hidratação, sono e proteína resolvem mais do que qualquer suplemento.", fonte: "Fundamentos", tag: "BÁSICO" },
  { texto: "Treino com 60% de intensidade feito 5x por semana supera treino com 100% feito 1x.", fonte: "Frequência", tag: "CONSISTÊNCIA" },
  { texto: "Comida real não precisa de lista de ingredientes. Esse é o critério mais simples.", fonte: "Nutrição", tag: "COMIDA REAL" },
]

const DICAS = [
  { titulo: "Proteína em cada refeição", corpo: "Inclua uma fonte de proteína no café, almoço, lanche e jantar. Preserva massa e controla fome." },
  { titulo: "Sono é treino também", corpo: "Menos de 7h compromete recuperação, aumenta cortisol e reduz queima de gordura." },
  { titulo: "Creatina: 5g/dia, todo dia", corpo: "Suplemento com mais evidência científica. Independe de treino. Resultados após 2–4 semanas." },
  { titulo: "Hidrate antes da sede", corpo: "Desidratação de 2% reduz performance física e cognitiva. Água antes de sentir sede." },
  { titulo: "Pesagem: mesmas condições", corpo: "Sempre no mesmo horário, em jejum. O que importa é a tendência semanal, não o número isolado." },
]

export function Reflexao() {
  const [ri, setRi] = useState(0)
  const [di, setDi] = useState(0)

  useEffect(() => {
    const d = new Date()
    const day = Math.floor((d.getTime() - new Date(d.getFullYear(),0,0).getTime()) / 86400000)
    setRi(day % REFLEXOES.length)
    setDi(day % DICAS.length)
  }, [])

  const r = REFLEXOES[ri]
  const d = DICAS[di]

  return (
    <div>
      {/* Section header */}
      <div style={{
        padding: '10px 16px', background: '#0a0a0a',
        borderBottom: '1px solid #222',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--f-head)', fontSize: '0.58rem',
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
        }}>Reflexão do dia</span>
        <button onClick={() => setRi((ri+1)%REFLEXOES.length)}
          className="press btn-ghost" style={{ padding: '5px 10px', fontSize: '0.55rem' }}>
          PRÓXIMA
        </button>
      </div>

      {/* Main quote */}
      <AnimatePresence mode="wait">
        <motion.div key={ri}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
          style={{ borderBottom: '1px solid #222' }}>
          <div style={{ padding: '20px 16px' }}>
            <div style={{
              display: 'inline-block', marginBottom: 14,
              padding: '2px 8px', border: '1px solid #FF6B00',
              fontFamily: 'var(--f-body)', fontSize: '0.5rem',
              fontWeight: 400, textTransform: 'uppercase',
              letterSpacing: '0.2em', color: '#FF6B00',
            }}>{r.tag}</div>
            <p style={{
              fontFamily: 'var(--f-head)',
              fontSize: '1rem', letterSpacing: '0.04em',
              color: '#fff', lineHeight: 1.55,
              marginBottom: 16, textTransform: 'uppercase',
            }}>{r.texto}</p>
            <span style={{
              fontFamily: 'var(--f-body)', fontSize: '0.62rem',
              fontWeight: 300, color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>— {r.fonte}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dica */}
      <div style={{
        padding: '10px 16px', background: '#0a0a0a',
        borderBottom: '1px solid #222',
      }}>
        <span style={{
          fontFamily: 'var(--f-head)', fontSize: '0.58rem',
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
        }}>Dica da semana</span>
      </div>
      <div style={{ padding: '16px', borderBottom: '1px solid #222' }}>
        <div style={{
          fontFamily: 'var(--f-head)', fontSize: '0.8rem',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: '#fff', marginBottom: 10,
        }}>{d.titulo}</div>
        <p style={{
          fontFamily: 'var(--f-body)', fontSize: '0.8rem',
          fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
        }}>{d.corpo}</p>
      </div>

      {/* All reflexoes */}
      <div style={{
        padding: '10px 16px', background: '#0a0a0a',
        borderBottom: '1px solid #222',
      }}>
        <span style={{
          fontFamily: 'var(--f-head)', fontSize: '0.58rem',
          textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.3)',
        }}>Mais reflexões</span>
      </div>
      {REFLEXOES.filter((_,i) => i !== ri).slice(0,6).map((ref,i) => (
        <button key={i}
          onClick={() => setRi(REFLEXOES.indexOf(ref))}
          className="press"
          style={{
            width: '100%', textAlign: 'left',
            padding: '12px 16px', background: 'transparent', border: 'none',
            borderBottom: '1px solid #111',
            display: 'flex', alignItems: 'flex-start', gap: 14,
          }}>
          <div style={{
            width: 4, height: 4, background: '#333',
            flexShrink: 0, marginTop: 5,
          }}/>
          <div>
            <div style={{
              fontFamily: 'var(--f-body)', fontSize: '0.5rem', fontWeight: 400,
              textTransform: 'uppercase', letterSpacing: '0.16em',
              color: '#FF6B00', marginBottom: 4,
            }}>{ref.tag}</div>
            <p style={{
              fontFamily: 'var(--f-body)', fontSize: '0.75rem',
              fontWeight: 300, color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.45,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{ref.texto}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
