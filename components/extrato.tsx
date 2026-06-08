"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { DAYS, MEALS, MEAL_ORDER, DayName } from "@/lib/data"
import { getDayProgressReal, calcStreak, WeightEntry, pad } from "@/lib/helpers"

const MACRO_DB: Record<string, { kcal: number; ptn: number; cho: number; fat: number; agua?: number }> = {
  "Ovos mexidos": { kcal:210,ptn:18,cho:2,fat:14 },
  "Omelete de frango": { kcal:310,ptn:32,cho:2,fat:18 },
  "Pao integral": { kcal:130,ptn:5,cho:24,fat:2 },
  "Cafe preto": { kcal:4,ptn:0,cho:0,fat:0,agua:200 },
  "Cafe com leite desnatado": { kcal:40,ptn:3,cho:5,fat:0,agua:200 },
  "Frango grelhado": { kcal:220,ptn:44,cho:0,fat:5 },
  "Frango assado com temperos": { kcal:220,ptn:44,cho:0,fat:5 },
  "Frango desfiado refogado": { kcal:200,ptn:38,cho:0,fat:5 },
  "Arroz integral": { kcal:130,ptn:3,cho:28,fat:1 },
  "Feijao": { kcal:120,ptn:8,cho:20,fat:1 },
  "Batata-doce cozida": { kcal:120,ptn:2,cho:28,fat:0 },
  "Banana": { kcal:90,ptn:1,cho:23,fat:0 },
  "Iogurte zero": { kcal:60,ptn:10,cho:6,fat:0 },
  "Creatina": { kcal:0,ptn:0,cho:0,fat:0 },
  "Amendoim": { kcal:170,ptn:7,cho:5,fat:14 },
  "Brocolis refogado": { kcal:50,ptn:4,cho:6,fat:2 },
  "Salada de folhas": { kcal:10,ptn:1,cho:2,fat:0 },
  "Couve refogada": { kcal:40,ptn:3,cho:4,fat:2 },
  "Batata-doce assada": { kcal:130,ptn:2,cho:30,fat:0 },
  "Macarrao integral": { kcal:280,ptn:10,cho:56,fat:2 },
  "Tapioca com ovo mexido": { kcal:240,ptn:14,cho:36,fat:6 },
  "Molho de tomate caseiro": { kcal:45,ptn:1,cho:8,fat:1 },
  "Ovos cozidos": { kcal:140,ptn:12,cho:1,fat:10 },
  "Panqueca de aveia e ovo": { kcal:280,ptn:16,cho:32,fat:10 },
  "Ovos estrelados": { kcal:210,ptn:14,cho:1,fat:16 },
}

function getMacros(item: string) {
  return MACRO_DB[item] || { kcal:80,ptn:5,cho:8,fat:3 }
}

function getDayMacros(dayName: DayName, checked: Record<string, boolean>) {
  let kcal=0,ptn=0,cho=0,fat=0,agua=0,total=0,done=0
  MEAL_ORDER.forEach(meal => {
    (MEALS[dayName][meal]||[]).forEach((it,i) => {
      total++
      if (checked[`${dayName}__${meal}__${i}`]) {
        done++
        const m = getMacros(it.item)
        kcal+=m.kcal; ptn+=m.ptn; cho+=m.cho; fat+=m.fat; agua+=m.agua||0
      }
    })
  })
  return { kcal,ptn,cho,fat,agua, adh: total?Math.round((done/total)*100):0 }
}

async function handleShare(text: string) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try { await navigator.share({ title:"EVO_TELEMETRY", text, url: window.location.href }) }
    catch {}
  } else {
    try { await navigator.clipboard.writeText(`${text}\n${window.location.href}`) } catch {}
  }
}

interface Props {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  userName?: string
  userGoal?: string
}

export function Extrato({ checked, weights, userName, userGoal }: Props) {
  const now = new Date()
  const ts = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  const todayIdx = now.getDay()===0?6:now.getDay()-1
  const DAY_LABELS = ['SEG','TER','QUA','QUI','SEX','SAB','DOM']

  const weekData = useMemo(() => DAYS.map(day => ({
    day, ...getDayMacros(day, checked),
    pct: getDayProgressReal(day, checked),
  })), [checked])

  const totals = weekData.reduce((a,d) => ({
    kcal:a.kcal+d.kcal, ptn:a.ptn+d.ptn,
    cho:a.cho+d.cho, fat:a.fat+d.fat, agua:a.agua+d.agua,
  }), { kcal:0,ptn:0,cho:0,fat:0,agua:0 })

  const adhSemanal = Math.round(weekData.reduce((s,d)=>s+d.adh,0)/7)
  const diasOK = weekData.filter(d=>d.pct===100).length
  const streak = calcStreak(checked)
  const sortedW = [...weights].sort((a,b)=>b.date.localeCompare(a.date))
  const pesoAtual = sortedW[0]?.val
  const delta = pesoAtual && sortedW[1] ? (pesoAtual - sortedW[sortedW.length-1].val).toFixed(1) : null
  const today = weekData[todayIdx]

  const shareText = [
    `EVO_TELEMETRY_REPORT`,
    `ID: ${(userName||'USUARIO').toUpperCase()}`,
    `TS: ${ts}`,
    ``,
    `ADERENCIA_SEMANAL: ${adhSemanal}%`,
    `DIAS_COMPLETOS: ${diasOK}/7`,
    `STREAK: ${streak}d`,
    ``,
    `MACRO_ACUM (7d)`,
    `KCAL:${totals.kcal} PTN:${totals.ptn}g CHO:${totals.cho}g FAT:${totals.fat}g`,
    pesoAtual?`PESO:${pesoAtual}kg${delta?` DELTA:${Number(delta)>0?'+':''}${delta}kg`:''}`:null,
    ``,
    `evo-weld.vercel.app`,
  ].filter(Boolean).join('\n')

  // Reusable row
  const R = ({ l, v, u, accent, dim, indent=false }: {
    l:string; v:string|number; u?:string; accent?:boolean; dim?:boolean; indent?:boolean
  }) => (
    <div style={{
      display:'flex', justifyContent:'space-between', alignItems:'baseline',
      padding:`9px ${indent?24:16}px`,
      borderBottom:'1px solid #111',
    }}>
      <span style={{
        fontFamily:'var(--f-body)', fontSize:'0.58rem', fontWeight:300,
        textTransform:'uppercase', letterSpacing:'0.18em',
        color: dim?'rgba(255,255,255,0.18)':'rgba(255,255,255,0.38)',
      }}>{l}</span>
      <span style={{
        fontFamily:'var(--f-body)',
        fontSize: accent?'0.95rem':'0.72rem',
        fontWeight: accent?600:300,
        color: accent?'#FF6B00': dim?'rgba(255,255,255,0.2)':'#fff',
      }}>
        {v}{u&&<span style={{fontSize:'0.52rem',color:'rgba(255,255,255,0.2)',marginLeft:3}}>{u}</span>}
      </span>
    </div>
  )

  const SH = ({ l }: { l:string }) => (
    <div style={{
      padding:'9px 16px', background:'#0a0a0a', borderBottom:'1px solid #222',
      fontFamily:'var(--f-head)', fontSize:'0.58rem',
      textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(255,255,255,0.28)',
    }}>{l}</div>
  )

  return (
    <div style={{ background:'#000', minHeight:'100%' }}>

      {/* HEADER — logo + meta */}
      <div style={{
        padding:'16px', display:'flex',
        justifyContent:'space-between', alignItems:'flex-end',
        borderBottom:'2px solid #fff',
      }}>
        <div>
          <div style={{
            fontFamily:'var(--f-logo)', fontSize:'2rem',
            fontWeight:700, color:'#fff', letterSpacing:'0.14em', lineHeight:1,
          }}>EVO</div>
          <div style={{
            fontFamily:'var(--f-head)', fontSize:'0.52rem',
            textTransform:'uppercase', letterSpacing:'0.28em',
            color:'rgba(255,255,255,0.3)', marginTop:5,
          }}>EXTRATO DE ADERÊNCIA</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{
            fontFamily:'var(--f-body)', fontSize:'0.55rem',
            fontWeight:300, color:'rgba(255,255,255,0.25)',
            letterSpacing:'0.08em', textTransform:'uppercase',
          }}>{ts}</div>
          {userName&&<div style={{
            fontFamily:'var(--f-body)', fontSize:'0.6rem',
            fontWeight:400, color:'rgba(255,255,255,0.4)',
            marginTop:3, textTransform:'uppercase', letterSpacing:'0.1em',
          }}>{userName}</div>}
        </div>
      </div>

      {/* KPI ROW */}
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
        borderBottom:'1px solid #222',
      }}>
        {[
          { l:'ADERÊNCIA', v:`${adhSemanal}%`, acc: adhSemanal>=80 },
          { l:'DIAS OK',   v:`${diasOK}/7`,    acc: diasOK>=5 },
          { l:'STREAK',    v:`${streak}d`,      acc: streak>=5 },
        ].map((k,i) => (
          <div key={k.l} style={{
            padding:'14px 12px', textAlign:'center',
            borderRight: i<2?'1px solid #1a1a1a':'none',
          }}>
            <div style={{
              fontFamily:'var(--f-head)', fontSize:'0.48rem',
              textTransform:'uppercase', letterSpacing:'0.22em',
              color:'rgba(255,255,255,0.25)', marginBottom:7,
            }}>{k.l}</div>
            <div style={{
              fontFamily:'var(--f-logo)', fontSize:'1.6rem',
              fontWeight:700, color: k.acc?'#FF6B00':'#fff',
              lineHeight:1, letterSpacing:'-0.01em',
            }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* TODAY */}
      <SH l={`TELEMETRIA — ${DAY_LABELS[todayIdx]} / HOJE`}/>
      <R l="KCAL CONSUMIDAS" v={today.kcal} u="kcal" accent={today.kcal>0}/>
      <R l="PROTEÍNA" v={today.ptn} u="g" indent/>
      <R l="CARBOIDRATO" v={today.cho} u="g" indent/>
      <R l="GORDURA" v={today.fat} u="g" indent/>
      <R l="ÁGUA ESTIMADA" v={today.agua} u="ml" indent/>
      <R l="ADERÊNCIA HOJE" v={`${today.adh}%`} accent={today.adh===100}/>

      {/* GRADE SEMANAL */}
      <SH l="GRADE SEMANAL"/>
      {/* Col headers */}
      <div style={{
        display:'grid', gridTemplateColumns:'52px repeat(4,1fr)',
        background:'#080808', borderBottom:'1px solid #1a1a1a',
      }}>
        {['','ADH','KCAL','PTN','CHO'].map((h,i) => (
          <div key={h} style={{
            padding:'6px 8px', borderRight:i<4?'1px solid #1a1a1a':'none',
            fontFamily:'var(--f-head)', fontSize:'0.44rem',
            textTransform:'uppercase', letterSpacing:'0.18em',
            color:'rgba(255,255,255,0.2)', textAlign: i?'right':'left',
          }}>{h}</div>
        ))}
      </div>
      {weekData.map((d,i) => {
        const isToday = i===todayIdx
        const done = d.pct===100
        return (
          <div key={d.day} style={{
            display:'grid', gridTemplateColumns:'52px repeat(4,1fr)',
            background: isToday?'#0d0d0d':'transparent',
            borderBottom:'1px solid #111',
          }}>
            <div style={{
              padding:'9px 8px', borderRight:'1px solid #1a1a1a',
              display:'flex', alignItems:'center', gap:5,
            }}>
              {done&&<div style={{ width:4,height:4,background:'#FF6B00',flexShrink:0 }}/>}
              <span style={{
                fontFamily:'var(--f-head)', fontSize:'0.5rem',
                textTransform:'uppercase', letterSpacing:'0.12em',
                color: isToday?'#fff': done?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.2)',
              }}>{DAY_LABELS[i]}</span>
            </div>
            {[
              { v:`${d.adh}%`, accent:d.adh===100 },
              { v:d.kcal, accent:false },
              { v:`${d.ptn}g`, accent:false },
              { v:`${d.cho}g`, accent:false },
            ].map((c,ci) => (
              <div key={ci} style={{
                padding:'9px 8px', textAlign:'right',
                borderRight:ci<3?'1px solid #111':'none',
                fontFamily:'var(--f-body)',
                fontSize:'0.6rem', fontWeight: c.accent?600:300,
                color: c.accent?'#FF6B00': d.adh===0?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.5)',
              }}>{c.v}</div>
            ))}
          </div>
        )
      })}

      {/* ACUMULADO */}
      <SH l="ACUMULADO SEMANAL"/>
      <R l="KCAL TOTAIS" v={totals.kcal} u="kcal" accent/>
      <R l="PROTEÍNA" v={`${totals.ptn}`} u="g" indent/>
      <R l="CARBOIDRATO" v={`${totals.cho}`} u="g" indent/>
      <R l="GORDURA" v={`${totals.fat}`} u="g" indent/>
      <R l="ÁGUA ACUMULADA" v={totals.agua} u="ml"/>
      <R l="MÉDIA KCAL/DIA" v={Math.round(totals.kcal/7)} u="kcal/dia" dim/>

      {/* PESO */}
      {pesoAtual&&<>
        <SH l="REGISTRO DE PESO"/>
        <R l="PESO ATUAL" v={`${pesoAtual}`} u="kg" accent/>
        {delta&&<R l="VARIAÇÃO TOTAL" v={`${Number(delta)>0?'+':''}${delta}`} u="kg" dim={Number(delta)===0}/>}
        {userGoal&&<R l="OBJETIVO" v={userGoal.replace('_',' ')} dim/>}
      </>}

      {/* BARRA VISUAL */}
      <SH l="ADERÊNCIA SEMANAL — VISUAL"/>
      <div style={{ padding:'16px' }}>
        <div style={{
          display:'flex', justifyContent:'space-between', marginBottom:10,
        }}>
          <span style={{
            fontFamily:'var(--f-head)', fontSize:'0.52rem',
            textTransform:'uppercase', letterSpacing:'0.22em',
            color:'rgba(255,255,255,0.25)',
          }}>PROGRESSO</span>
          <span style={{
            fontFamily:'var(--f-logo)', fontSize:'0.9rem',
            color: adhSemanal>=80?'#FF6B00':'#fff',
          }}>{adhSemanal}%</span>
        </div>
        <div className="prog-track">
          <motion.div
            initial={{ width:0 }}
            animate={{ width:`${adhSemanal}%` }}
            transition={{ duration:1.6, ease:[.4,0,.2,1], delay:.2 }}
            style={{
              height:2, background:'#FF6B00',
              position:'absolute', left:0, top:0,
            }}/>
        </div>
        <div style={{
          display:'flex', justifyContent:'space-between', marginTop:6,
        }}>
          {[0,25,50,75,100].map(t => (
            <span key={t} style={{
              fontFamily:'var(--f-body)', fontSize:'0.42rem',
              fontWeight:300, color:'rgba(255,255,255,0.18)',
            }}>{t}%</span>
          ))}
        </div>
      </div>

      {/* EXPORT — bottom */}
      <div style={{ borderTop:'2px solid #fff' }}>
        <button
          onClick={() => handleShare(shareText)}
          style={{
            width:'100%', padding:'16px',
            background:'#000', border:'none',
            color:'#fff', cursor:'pointer',
            display:'flex', alignItems:'center',
            justifyContent:'space-between',
            fontFamily:'var(--f-body)',
            fontSize:'0.72rem', fontWeight:400,
            textTransform:'uppercase', letterSpacing:'0.22em',
            transition:'background 0.08s, color 0.08s',
          }}
          onMouseDown={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#000'}}
          onMouseUp={e=>{e.currentTarget.style.background='#000';e.currentTarget.style.color='#fff'}}
          onTouchStart={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#000'}}
          onTouchEnd={e=>{e.currentTarget.style.background='#000';e.currentTarget.style.color='#fff'}}
        >
          <span>EXPORT_TELEMETRY</span>
          <span style={{ fontSize:'0.9rem', fontWeight:300 }}>↗</span>
        </button>
        <div style={{
          padding:'10px 16px', borderTop:'1px solid #111',
          display:'flex', justifyContent:'space-between',
        }}>
          <span style={{
            fontFamily:'var(--f-logo)', fontSize:'0.65rem',
            color:'rgba(255,255,255,0.15)', letterSpacing:'0.1em',
          }}>EVO</span>
          <span style={{
            fontFamily:'var(--f-body)', fontSize:'0.5rem',
            fontWeight:300, color:'rgba(255,255,255,0.15)',
            textTransform:'uppercase', letterSpacing:'0.1em',
          }}>evo-weld.vercel.app</span>
        </div>
      </div>
    </div>
  )
}
