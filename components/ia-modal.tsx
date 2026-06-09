"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight } from "lucide-react"
import { WeightEntry, DayEval, fmtDate, calcStreak, getDayProgressReal } from "@/lib/helpers"
import { DAYS } from "@/lib/data"

interface Msg { role:"user"|"assistant"; content:string }

const QUICK = [
  {label:"MONTAR DIETA BASE",   q:"Me ajuda a montar uma dieta base personalizada com base na pirâmide alimentar brasileira. Foco em comida real, sem industrializados."},
  {label:"LISTA DE COMPRAS",    q:"Gera uma lista de compras objetiva para a semana, por categoria, baseada na minha dieta."},
  {label:"PRÉ-TREINO REAL",    q:"O que comer antes do treino? Algo prático com comida real, sem suplemento desnecessário."},
  {label:"OTIMIZAR EVOLUÇÃO",   q:"Como posso melhorar minha evolução física com base no meu progresso atual?"},
]

interface Props {
  onClose:()=>void; weights:WeightEntry[]; evals:Record<string,DayEval>
  checked:Record<string,boolean>; userName?:string; userGoal?:string
}

export function IAModal({onClose,weights,evals,checked,userName,userGoal}:Props) {
  const [msgs,setMsgs]=useState<Msg[]>([])
  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const todayIdx=new Date().getDay()===0?6:new Date().getDay()-1
  const streak=calcStreak(checked)
  const pct=getDayProgressReal(DAYS[todayIdx],checked)
  const lastW=[...weights].sort((a,b)=>b.date.localeCompare(a.date))[0]

  const system=`Você é o EVO Coach — sistema de orientação física de alta performance.
Filosofia: comida real, pirâmide alimentar brasileira. Suplementação só se mencionada (creatina/whey ok). Não substitui médico/nutricionista.
Perfil: ${userName||"não informado"} | Objetivo: ${userGoal||"não informado"} | Peso: ${lastW?`${lastW.val}kg`:"não registrado"} | Streak: ${streak}d | ADH hoje: ${pct}%
Tom: técnico, direto, sem enrolação. Máximo 3 parágrafos. Sem markdown.`

  async function send(text:string) {
    if(!text.trim()||loading) return
    const newMsgs=[...msgs,{role:"user" as const,content:text}]
    setMsgs(newMsgs); setInput(""); setLoading(true)
    try {
      const res=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system,messages:newMsgs.map(m=>({role:m.role,content:m.content}))})})
      const data=await res.json()
      setMsgs(prev=>[...prev,{role:"assistant",content:data.content?.[0]?.text||data.error||"Erro."}])
    } catch { setMsgs(prev=>[...prev,{role:"assistant",content:"Erro de conexão."}]) }
    finally { setLoading(false) }
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:80,background:"var(--canvas)",display:"flex",flexDirection:"column"}}>
      <div className="pt-safe" style={{padding:"14px 16px",borderBottom:"1px solid rgba(66,71,105,0.4)",background:"var(--container)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
        <div>
          <div style={{fontFamily:"var(--f-logo)",fontSize:"0.88rem",color:"var(--gold)",letterSpacing:"0.14em"}}>EVO</div>
          <div style={{fontFamily:"var(--f-head)",fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.16em",color:"var(--text)",marginTop:2}}>COACH // SISTEMA ATIVO</div>
        </div>
        <button onClick={onClose} className="btn-ghost press" style={{padding:"8px 12px"}}><X size={14}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        {msgs.length===0&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{borderLeft:"2px solid var(--gold)",paddingLeft:12,marginBottom:20}}>
              <p style={{fontFamily:"var(--f-body)",fontSize:"0.78rem",fontWeight:300,color:"var(--text-2)",lineHeight:1.65}}>
                {streak>0?`${streak} dias no streak. Sistema operacional.`:"Sistema pronto."}
              </p>
            </div>
            <div style={{fontFamily:"var(--f-head)",fontSize:"0.5rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)",marginBottom:10}}>DIRETRIZES RÁPIDAS</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {QUICK.map(({label,q})=>(
                <button key={label} onClick={()=>send(q)} className="press metal-btn"
                  style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",border:"none",textAlign:"left",cursor:"pointer"}}>
                  <span style={{fontFamily:"var(--f-head)",fontSize:"0.62rem",textTransform:"uppercase",letterSpacing:"0.12em",color:"var(--text)"}}>{label}</span>
                  <ArrowRight size={12} style={{color:"var(--gold)",flexShrink:0}}/>
                </button>
              ))}
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {msgs.map((m,i)=>(
            <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2}}
              style={{marginBottom:10,display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
              <div style={{
                maxWidth:"88%",padding:"10px 14px",borderRadius:8,
                background:m.role==="user"?"var(--gold)":"var(--container)",
                boxShadow:m.role==="user"
                  ? "inset 0 1px 0 rgba(255,255,255,0.15)"
                  : "0 0 0 1px rgba(66,71,105,0.5)",
                fontFamily:"var(--f-body)",fontSize:"0.8rem",fontWeight:300,
                color:m.role==="user"?"var(--canvas)":"var(--text)",lineHeight:1.6,
              }}>{m.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading&&(
          <div style={{display:"flex",gap:5,padding:"10px 14px",borderRadius:8,background:"var(--container)",boxShadow:"0 0 0 1px rgba(66,71,105,0.5)",width:"fit-content"}}>
            {[0,1,2].map(i=>(
              <motion.div key={i} style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)"}}
                animate={{opacity:[.3,1,.3]}} transition={{duration:1,repeat:Infinity,delay:i*.2}}/>
            ))}
          </div>
        )}
      </div>
      <div style={{borderTop:"1px solid rgba(66,71,105,0.4)",padding:"12px 16px",flexShrink:0,display:"flex",gap:8,background:"var(--container)"}} className="pb-safe">
        <input type="text" value={input} placeholder="Inserir diretriz..."
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send(input)}
          className="inp" style={{flex:1,padding:"10px 14px",fontSize:"0.82rem"}}/>
        <button onClick={()=>send(input)} disabled={!input.trim()||loading}
          style={{padding:"10px 14px",background:"var(--gold)",borderRadius:8,border:"none",cursor:"pointer",opacity:input.trim()&&!loading?1:0.3,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <ArrowRight size={15} style={{color:"var(--canvas)"}}/>
        </button>
      </div>
    </motion.div>
  )
}
