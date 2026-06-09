"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { DAYS, MEALS, MEAL_ORDER, DayName } from "@/lib/data"
import { getDayProgressReal, calcStreak, WeightEntry, fmtDate, pad } from "@/lib/helpers"

const MACRO_DB: Record<string, { kcal: number; ptn: number; cho: number; fat: number; agua?: number }> = {
  "Ovos mexidos":              { kcal:210,ptn:18,cho:2,fat:14 },
  "Omelete de frango":         { kcal:310,ptn:32,cho:2,fat:18 },
  "Pao integral":              { kcal:130,ptn:5,cho:24,fat:2 },
  "Cafe preto":                { kcal:4,ptn:0,cho:0,fat:0,agua:200 },
  "Cafe com leite desnatado":  { kcal:40,ptn:3,cho:5,fat:0,agua:200 },
  "Frango grelhado":           { kcal:220,ptn:44,cho:0,fat:5 },
  "Frango assado com temperos":{ kcal:220,ptn:44,cho:0,fat:5 },
  "Frango desfiado refogado":  { kcal:200,ptn:38,cho:0,fat:5 },
  "Arroz integral":            { kcal:130,ptn:3,cho:28,fat:1 },
  "Feijao":                    { kcal:120,ptn:8,cho:20,fat:1 },
  "Batata-doce cozida":        { kcal:120,ptn:2,cho:28,fat:0 },
  "Banana":                    { kcal:90,ptn:1,cho:23,fat:0 },
  "Iogurte zero":              { kcal:60,ptn:10,cho:6,fat:0 },
  "Creatina":                  { kcal:0,ptn:0,cho:0,fat:0 },
  "Amendoim":                  { kcal:170,ptn:7,cho:5,fat:14 },
  "Brocolis refogado":         { kcal:50,ptn:4,cho:6,fat:2 },
  "Batata-doce assada":        { kcal:130,ptn:2,cho:30,fat:0 },
  "Macarrao integral":         { kcal:280,ptn:10,cho:56,fat:2 },
  "Molho de tomate caseiro":   { kcal:45,ptn:1,cho:8,fat:1 },
  "Ovos cozidos":              { kcal:140,ptn:12,cho:1,fat:10 },
  "Panqueca de aveia e ovo":   { kcal:280,ptn:16,cho:32,fat:10 },
}

function getMacros(item: string) {
  return MACRO_DB[item] || { kcal:80, ptn:5, cho:8, fat:3 }
}

function getDayMacros(dayName: DayName, checked: Record<string, boolean>) {
  let kcal=0,ptn=0,cho=0,fat=0,agua=0,total=0,done=0
  MEAL_ORDER.forEach(meal => {
    ;(MEALS[dayName][meal] || []).forEach((it, i) => {
      total++
      if (checked[`${dayName}__${meal}__${i}`]) {
        done++
        const m = getMacros(it.item)
        kcal+=m.kcal; ptn+=m.ptn; cho+=m.cho; fat+=m.fat; agua+=m.agua||0
      }
    })
  })
  return { kcal,ptn,cho,fat,agua, adh: total ? Math.round((done/total)*100) : 0 }
}

async function handleShare(text: string) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try { await navigator.share({ title:"EVO_TELEMETRY", text, url: window.location.href }) }
    catch {}
  } else {
    try { await navigator.clipboard.writeText(`${text}\n${window.location.href}`) } catch {}
  }
}

const MEAL_TIMES: Record<string,string> = {
  "Cafe da Manha": "07:00",
  "Almoco": "12:30",
  "Lanche da Tarde": "15:30",
  "Jantar": "19:30",
}

interface Props {
  checked: Record<string, boolean>
  weights: WeightEntry[]
  userName?: string
  userGoal?: string
}

export function Extrato({ checked, weights, userName, userGoal }: Props) {
  const now = new Date()
  const ts = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
  const todayIdx = now.getDay()===0?6:now.getDay()-1
  const DAY_LABELS = ["SEG","TER","QUA","QUI","SEX","SAB","DOM"]

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
  const delta = pesoAtual && sortedW.length > 1
    ? (pesoAtual - sortedW[sortedW.length-1].val).toFixed(1) : null
  const today = weekData[todayIdx]
  const statusLabel = adhSemanal>=90 ? "ELITE" : adhSemanal>=70 ? "OPERACIONAL" : "CRÍTICO"

  // 24h telemetry log — today's meals
  const todayName = DAYS[todayIdx]
  const logEntries: { time: string; label: string; status: string; ok: boolean }[] = []
  MEAL_ORDER.forEach(meal => {
    const items = MEALS[todayName][meal] || []
    const doneCount = items.filter((_,i) => checked[`${todayName}__${meal}__${i}`]).length
    const allDone = doneCount === items.length && items.length > 0
    logEntries.push({
      time: MEAL_TIMES[meal] || "--:--",
      label: meal.toUpperCase().replace(" DA ", "_").replace(" DE ", "_"),
      status: allDone ? "OK" : doneCount > 0 ? "PARCIAL" : "PENDENTE",
      ok: allDone,
    })
  })

  const shareText = [
    `EVO_TELEMETRY_REPORT`,
    `ID: ${(userName||"USUARIO").toUpperCase()}`,
    `TS: ${ts}`,
    ``,
    `ADERENCIA_SEMANAL: ${adhSemanal}% [${statusLabel}]`,
    `DIAS_COMPLETOS: ${diasOK}/7`,
    `STREAK: ${streak}d`,
    ``,
    `MACRO_ACUM (7d)`,
    `KCAL:${totals.kcal} | PTN:${totals.ptn}g | CHO:${totals.cho}g | FAT:${totals.fat}g`,
    pesoAtual ? `PESO_ATUAL: ${pesoAtual}kg${delta ? ` | DELTA: ${Number(delta)>0?"+":""}${delta}kg` : ""}` : null,
    ``,
    `LOG_24H:`,
    ...logEntries.map(e => `[${e.time}] ${e.label} ......... ${e.status}`),
    ``,
    `evo-weld.vercel.app`,
  ].filter(Boolean).join("\n")

  /* Reusable row */
  const TR = ({ l, v, u, accent, dim, indent=false }: {
    l:string; v:string|number; u?:string; accent?:boolean; dim?:boolean; indent?:boolean
  }) => (
    <div className="telem-row" style={{ paddingLeft: indent ? 28 : 16 }}>
      <span style={{
        fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",
        letterSpacing:"0.18em",color: dim?"rgba(136,136,136,0.5)":"var(--text-secondary)",
      }}>{l}</span>
      <span style={{
        fontFamily:"var(--f-body)",
        fontSize: accent?"0.9rem":"0.7rem",
        fontWeight: accent?400:300,
        color: accent?"var(--accent-primary)": dim?"rgba(136,136,136,0.4)":"var(--text-primary)",
      }}>
        {v}{u&&<span style={{fontSize:"0.52rem",color:"var(--text-secondary)",marginLeft:3}}>{u}</span>}
      </span>
    </div>
  )

  const SH = ({ l }: { l:string }) => (
    <div style={{
      padding:"9px 16px", background:"var(--card-bg)",
      borderBottom:"1px solid var(--border-color)",
      fontFamily:"var(--f-head)", fontSize:"0.6rem",
      textTransform:"uppercase", letterSpacing:"0.22em",
      color:"var(--accent-primary)",
    }}>{l}</div>
  )

  return (
    <div style={{ background:"var(--canvas-bg)", minHeight:"100%" }}>

      {/* HEADER */}
      <div style={{
        padding:"16px",
        display:"flex",justifyContent:"space-between",alignItems:"flex-end",
        borderBottom:"2px solid var(--gold)",
        background:"var(--container)",
        borderRadius:"10px 10px 0 0",
      }}>
        <div>
          <div style={{
            fontFamily:"var(--f-logo)",fontSize:"2rem",fontWeight:700,
            color:"var(--accent-primary)",letterSpacing:"0.14em",lineHeight:1,
          }}>EVO</div>
          <div style={{
            fontFamily:"var(--f-head)",fontSize:"0.52rem",
            textTransform:"uppercase",letterSpacing:"0.28em",
            color:"var(--text-secondary)",marginTop:5,
          }}>EXTRATO DE TELEMETRIA</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{
            fontFamily:"var(--f-body)",fontSize:"0.55rem",fontWeight:300,
            color:"var(--text-secondary)",letterSpacing:"0.08em",textTransform:"uppercase",
          }}>{ts}</div>
          {userName&&<div style={{
            fontFamily:"var(--f-body)",fontSize:"0.6rem",fontWeight:400,
            color:"var(--text-primary)",marginTop:3,
            textTransform:"uppercase",letterSpacing:"0.1em",
          }}>{userName}</div>}
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{
        display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
        background:"var(--card-bg)",borderBottom:"1px solid var(--border-color)",
      }}>
        {[
          { l:"ADERÊNCIA", v:`${adhSemanal}%`, acc:adhSemanal>=80 },
          { l:"DIAS OK",   v:`${diasOK}/7`,    acc:diasOK>=5 },
          { l:"STREAK",    v:`${streak}d`,      acc:streak>=5 },
        ].map((k,i) => (
          <div key={k.l} style={{
            padding:"14px 10px",textAlign:"center",
            borderRight:i<2?"1px solid var(--border-color)":"none",
          }}>
            <div style={{
              fontFamily:"var(--f-head)",fontSize:"0.48rem",
              textTransform:"uppercase",letterSpacing:"0.2em",
              color:"var(--text-secondary)",marginBottom:7,
            }}>{k.l}</div>
            <div style={{
              fontFamily:"var(--f-body)",fontSize:"1.5rem",fontWeight:300,
              color:k.acc?"var(--accent-primary)":"var(--text-primary)",
              lineHeight:1,letterSpacing:"-0.01em",
            }}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* TELEMETRY LOG — 24H */}
      <SH l="EXTRATO DE TELEMETRIA (ÚLTIMAS 24H)"/>
      {logEntries.map((e, i) => {
        const dots = ".".repeat(Math.max(4, 30 - e.label.length))
        return (
          <div key={i} className="telem-row">
            <span style={{
              fontFamily:"var(--f-body)",fontSize:"0.65rem",fontWeight:300,
              color:"var(--text-secondary)",letterSpacing:"0.08em",
            }}>
              [{e.time}] <span style={{color:"var(--text-primary)"}}>{e.label}</span>
              <span style={{color:"rgba(136,136,136,0.3)"}}> {dots} </span>
            </span>
            <span style={{
              fontFamily:"var(--f-head)",fontSize:"0.55rem",
              textTransform:"uppercase",letterSpacing:"0.14em",
              color: e.ok?"var(--accent-primary)" : e.status==="PARCIAL"?"var(--accent-secondary)":"var(--text-secondary)",
            }}>{e.status}</span>
          </div>
        )
      })}

      {/* MACROS TODAY */}
      <SH l={`TELEMETRIA — ${DAY_LABELS[todayIdx]} / HOJE`}/>
      <TR l="KCAL" v={today.kcal} u="kcal" accent={today.kcal>0}/>
      <TR l="PROTEÍNA" v={today.ptn} u="g" indent/>
      <TR l="CARBOIDRATO" v={today.cho} u="g" indent/>
      <TR l="GORDURA" v={today.fat} u="g" indent/>
      <TR l="ÁGUA EST." v={today.agua} u="ml" indent/>
      <TR l="ADERÊNCIA" v={`${today.adh}%`} accent={today.adh===100}/>

      {/* GRADE SEMANAL */}
      <SH l="GRADE SEMANAL"/>
      <div style={{
        display:"grid",gridTemplateColumns:"52px repeat(4,1fr)",
        background:"var(--card-bg)",borderBottom:"1px solid var(--border-color)",
      }}>
        {["","ADH","KCAL","PTN","CHO"].map((h,i)=>(
          <div key={h} style={{
            padding:"6px 8px",
            borderRight:i<4?"1px solid var(--border-color)":"none",
            fontFamily:"var(--f-head)",fontSize:"0.44rem",
            textTransform:"uppercase",letterSpacing:"0.16em",
            color:"var(--text-secondary)",textAlign:i?"right":"left",
          }}>{h}</div>
        ))}
      </div>
      {weekData.map((d,i)=>{
        const isToday=i===todayIdx; const done=d.pct===100
        return(
          <div key={d.day} style={{
            display:"grid",gridTemplateColumns:"52px repeat(4,1fr)",
            background:isToday?"rgba(27,41,75,0.3)":"transparent",
            borderBottom:"1px solid rgba(66,71,105,0.3)",
          }}>
            <div style={{
              padding:"9px 8px",borderRight:"1px solid var(--border-color)",
              display:"flex",alignItems:"center",gap:5,
            }}>
              {done&&<div style={{width:4,height:4,background:"var(--accent-primary)",flexShrink:0}}/>}
              <span style={{
                fontFamily:"var(--f-head)",fontSize:"0.5rem",
                textTransform:"uppercase",letterSpacing:"0.12em",
                color:isToday?"var(--accent-secondary)":done?"var(--text-primary)":"var(--text-secondary)",
              }}>{DAY_LABELS[i]}</span>
            </div>
            {[
              {v:`${d.adh}%`,acc:d.adh===100},
              {v:d.kcal,acc:false},
              {v:`${d.ptn}g`,acc:false},
              {v:`${d.cho}g`,acc:false},
            ].map((c,ci)=>(
              <div key={ci} style={{
                padding:"9px 8px",textAlign:"right",
                borderRight:ci<3?"1px solid rgba(66,71,105,0.3)":"none",
                fontFamily:"var(--f-body)",fontSize:"0.6rem",
                fontWeight:c.acc?400:300,
                color:c.acc?"var(--accent-primary)":d.adh===0?"rgba(136,136,136,0.25)":"var(--text-primary)",
              }}>{c.v}</div>
            ))}
          </div>
        )
      })}

      {/* ACUMULADO */}
      <SH l="ACUMULADO SEMANAL"/>
      <TR l="KCAL TOTAIS" v={totals.kcal} u="kcal" accent/>
      <TR l="PROTEÍNA" v={`${totals.ptn}`} u="g" indent/>
      <TR l="CARBOIDRATO" v={`${totals.cho}`} u="g" indent/>
      <TR l="GORDURA" v={`${totals.fat}`} u="g" indent/>
      <TR l="ÁGUA" v={totals.agua} u="ml"/>
      <TR l="MÉDIA KCAL/DIA" v={Math.round(totals.kcal/7)} u="kcal" dim/>

      {/* PESO */}
      {pesoAtual&&<>
        <SH l="REGISTRO DE PESO"/>
        <TR l="PESO ATUAL" v={`${pesoAtual}`} u="kg" accent/>
        {delta&&<TR l="VARIAÇÃO" v={`${Number(delta)>0?"+":""}${delta}`} u="kg" dim={Number(delta)===0}/>}
        {userGoal&&<TR l="OBJETIVO" v={userGoal.replace("_"," ")} dim/>}
      </>}

      {/* PROGRESS VISUAL */}
      <SH l="ADERÊNCIA SEMANAL — TELEMETRIA VISUAL"/>
      <div style={{ padding:"16px", borderBottom:"1px solid var(--border-color)" }}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
          <span style={{
            fontFamily:"var(--f-head)",fontSize:"0.52rem",
            textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-secondary)",
          }}>PROGRESSO</span>
          <span style={{
            fontFamily:"var(--f-body)",fontSize:"0.85rem",fontWeight:300,
            color:adhSemanal>=80?"var(--accent-primary)":"var(--text-primary)",
          }}>{adhSemanal}% <span style={{fontSize:"0.52rem",color:"var(--text-secondary)"}}>[{statusLabel}]</span></span>
        </div>
        <div className="prog-track">
          <motion.div
            initial={{width:0}} animate={{width:`${adhSemanal}%`}}
            transition={{duration:1.6,ease:[.4,0,.2,1],delay:.2}}
            style={{height:2,background:"var(--accent-primary)",position:"absolute",left:0,top:0}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
          {[0,25,50,75,100].map(t=>(
            <span key={t} style={{
              fontFamily:"var(--f-body)",fontSize:"0.42rem",
              fontWeight:300,color:"var(--text-secondary)",
            }}>{t}%</span>
          ))}
        </div>
      </div>

      {/* EXPORT */}
      <div style={{ borderTop:"2px solid var(--accent-primary)" }}>
        <button
          onClick={()=>handleShare(shareText)}
          className="btn-gold"
          style={{ padding:"16px 20px", fontSize:"0.7rem", borderRadius: 10 }}>
          EXPORT TELEMETRY
        </button>
        <div style={{
          padding:"10px 16px",borderTop:"1px solid var(--border-color)",
          background:"var(--card-bg)",
          display:"flex",justifyContent:"space-between",alignItems:"center",
        }}>
          <span style={{
            fontFamily:"var(--f-logo)",fontSize:"0.65rem",
            color:"rgba(181,158,95,0.35)",letterSpacing:"0.12em",
          }}>EVO</span>
          <span style={{
            fontFamily:"var(--f-body)",fontSize:"0.48rem",
            fontWeight:300,color:"var(--text-secondary)",
            textTransform:"uppercase",letterSpacing:"0.1em",
          }}>evo-weld.vercel.app</span>
        </div>
      </div>
    </div>
  )
}
