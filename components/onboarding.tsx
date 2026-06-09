"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export interface OnboardingData {
  nome: string; peso: string; altura: string
  objetivo: "perder_gordura"|"ganhar_massa"|"manter"|"recomposicao"
  atividadeFisica: "sedentario"|"leve"|"moderado"|"intenso"
  restricoes: string; suplementos: string[]
}

const OBJETIVOS = [
  { id:"perder_gordura", label:"Perder gordura",  sub:"Déficit calórico" },
  { id:"ganhar_massa",   label:"Ganhar massa",    sub:"Superávit + proteína" },
  { id:"manter",        label:"Manter",           sub:"Equilíbrio" },
  { id:"recomposicao",  label:"Recomposição",     sub:"Gordura↓ / Músculo↑" },
] as const

const ATIVIDADES = [
  { id:"sedentario", label:"Sedentário", sub:"Sem atividade" },
  { id:"leve",       label:"Leve",       sub:"1–2x/semana" },
  { id:"moderado",   label:"Moderado",   sub:"3–4x/semana" },
  { id:"intenso",    label:"Intenso",    sub:"5x ou mais" },
] as const

const SUPLS = ["Creatina","Whey","Vitamina D","Ômega 3","Outro"]

export function Onboarding({ onComplete }: { onComplete: (d: OnboardingData) => void }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Partial<OnboardingData>>({ suplementos:[] })
  const TOTAL = 6

  const canNext = () => {
    if (step===1) return data.nome && data.peso && data.altura
    if (step===2) return !!data.objetivo
    if (step===3) return !!data.atividadeFisica
    return true
  }

  function Opt({ id,label,sub,active,onClick }:{id:string;label:string;sub:string;active:boolean;onClick:()=>void}) {
    return (
      <button onClick={onClick} className="press" style={{
        width:"100%",textAlign:"left",padding:"13px 14px",
        background: active ? "rgba(27,41,75,0.5)" : "var(--canvas)",
        borderRadius: 8,
        boxShadow: active
          ? "0 0 0 1px var(--gold), inset 0 1px 0 rgba(181,158,95,0.1)"
          : "0 0 0 1px var(--cobalt)",
        marginBottom:6,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div>
          <div style={{fontFamily:"var(--f-head)",fontSize:"0.82rem",textTransform:"uppercase",
            letterSpacing:"0.06em",color:active?"var(--gold-2)":"var(--text)"}}>{label}</div>
          <div style={{fontFamily:"var(--f-body)",fontSize:"0.6rem",fontWeight:300,
            color:"var(--text-2)",marginTop:2,textTransform:"uppercase",letterSpacing:"0.1em"}}>{sub}</div>
        </div>
        {active&&<Check size={14} style={{color:"var(--gold)",flexShrink:0}}/>}
      </button>
    )
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"var(--canvas)",display:"flex",flexDirection:"column"}}>
      {/* Progress bar */}
      <div style={{height:2,background:"var(--cobalt)",flexShrink:0}}>
        <motion.div animate={{width:`${((step+1)/TOTAL)*100}%`}} transition={{duration:.35}}
          style={{height:"100%",background:"var(--gold)"}}/>
      </div>
      {/* Header */}
      <div className="pt-safe" style={{padding:"14px 16px 0",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"var(--f-logo)",fontSize:"1.1rem",color:"var(--gold)",letterSpacing:"0.14em"}}>EVO</span>
        <span style={{fontFamily:"var(--f-head)",fontSize:"0.52rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)"}}>{step+1}/{TOTAL}</span>
      </div>
      {/* Content */}
      <div style={{flex:1,overflow:"hidden",position:"relative"}}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
            exit={{opacity:0,x:-20}} transition={{duration:.2}}
            style={{position:"absolute",inset:0,padding:"20px 16px 0",overflowY:"auto"}}>

            {step===0&&(
              <div>
                <div style={{fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.22em",color:"var(--text-2)",marginBottom:12}}>Sistema EVO</div>
                <h1 style={{fontFamily:"var(--f-head)",fontSize:"1.9rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--gold)",lineHeight:1.15,marginBottom:20}}>
                  Performance.<br/>Precisão.<br/>Evolução.
                </h1>
                <div style={{borderLeft:"2px solid var(--gold)",paddingLeft:14,marginBottom:20}}>
                  <p style={{fontFamily:"var(--f-body)",fontSize:"0.82rem",fontWeight:300,color:"var(--text-2)",lineHeight:1.65}}>
                    Telemetria de aderência alimentar baseada na pirâmide alimentar brasileira. Foco em comida real.
                  </p>
                </div>
                <div style={{padding:"10px 14px",background:"var(--container)",borderRadius:8,
                  boxShadow:"0 0 0 1px var(--cobalt)"}}>
                  <p style={{fontFamily:"var(--f-body)",fontSize:"0.62rem",fontWeight:300,color:"var(--text-2)",lineHeight:1.6,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                    Auxílio inteligente. Não substitui médico ou nutricionista.
                  </p>
                </div>
              </div>
            )}
            {step===1&&(
              <div>
                <div style={{fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)",marginBottom:12}}>Calibração do Sistema</div>
                <h2 style={{fontFamily:"var(--f-head)",fontSize:"1.4rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--text)",marginBottom:20}}>Parâmetros Iniciais</h2>
                {[
                  {key:"nome",label:"Identificação",placeholder:"Seu nome",type:"text"},
                  {key:"peso",label:"Peso Atual (kg)",placeholder:"92.5",type:"number"},
                  {key:"altura",label:"Altura (cm)",placeholder:"178",type:"number"},
                ].map(f=>(
                  <div key={f.key} style={{marginBottom:14}}>
                    <div style={{fontFamily:"var(--f-head)",fontSize:"0.52rem",textTransform:"uppercase",letterSpacing:"0.18em",color:"var(--text-2)",marginBottom:6}}>{f.label}</div>
                    <input type={f.type} placeholder={f.placeholder}
                      value={(data as any)[f.key]||""}
                      onChange={e=>setData(d=>({...d,[f.key]:e.target.value}))}
                      className="inp"/>
                  </div>
                ))}
              </div>
            )}
            {step===2&&(
              <div>
                <div style={{fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)",marginBottom:12}}>Vetor de Objetivo</div>
                <h2 style={{fontFamily:"var(--f-head)",fontSize:"1.4rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--text)",marginBottom:20}}>Defina o Alvo</h2>
                {OBJETIVOS.map(o=><Opt key={o.id} id={o.id} label={o.label} sub={o.sub} active={data.objetivo===o.id} onClick={()=>setData(d=>({...d,objetivo:o.id}))}/>)}
              </div>
            )}
            {step===3&&(
              <div>
                <div style={{fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)",marginBottom:12}}>Nível de Atividade</div>
                <h2 style={{fontFamily:"var(--f-head)",fontSize:"1.4rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--text)",marginBottom:20}}>Carga Atual</h2>
                {ATIVIDADES.map(a=><Opt key={a.id} id={a.id} label={a.label} sub={a.sub} active={data.atividadeFisica===a.id} onClick={()=>setData(d=>({...d,atividadeFisica:a.id}))}/>)}
              </div>
            )}
            {step===4&&(
              <div>
                <div style={{fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)",marginBottom:12}}>Parâmetros Adicionais</div>
                <h2 style={{fontFamily:"var(--f-head)",fontSize:"1.4rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--text)",marginBottom:8}}>Calibração Fina</h2>
                <p style={{fontFamily:"var(--f-body)",fontSize:"0.7rem",fontWeight:300,color:"var(--text-2)",marginBottom:18,textTransform:"uppercase",letterSpacing:"0.08em"}}>Opcional</p>
                <div style={{marginBottom:18}}>
                  <div style={{fontFamily:"var(--f-head)",fontSize:"0.52rem",textTransform:"uppercase",letterSpacing:"0.18em",color:"var(--text-2)",marginBottom:6}}>Restrições / Alergias</div>
                  <input type="text" placeholder="sem lactose, glúten..." className="inp"
                    value={data.restricoes||""}
                    onChange={e=>setData(d=>({...d,restricoes:e.target.value}))}/>
                </div>
                <div>
                  <div style={{fontFamily:"var(--f-head)",fontSize:"0.52rem",textTransform:"uppercase",letterSpacing:"0.18em",color:"var(--text-2)",marginBottom:10}}>Suplementos</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {SUPLS.map(s=>{
                      const on=data.suplementos?.includes(s)
                      return(
                        <button key={s} onClick={()=>setData(d=>({...d,suplementos:on?d.suplementos?.filter(x=>x!==s):[...(d.suplementos||[]),s]}))}
                          className={`chip press ${on?"chip-on":""}`}>{s}</button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            {step===5&&(
              <div>
                <div style={{fontFamily:"var(--f-head)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.2em",color:"var(--text-2)",marginBottom:12}}>Sistema Configurado</div>
                <h2 style={{fontFamily:"var(--f-head)",fontSize:"1.4rem",textTransform:"uppercase",letterSpacing:"0.05em",color:"var(--gold)",marginBottom:20}}>Telemetria Ativa</h2>
                <div className="metal-surface" style={{marginBottom:14}}>
                  {[
                    {l:"ID",v:data.nome||"—"},
                    {l:"PESO",v:data.peso?`${data.peso}kg`:"—"},
                    {l:"ALTURA",v:data.altura?`${data.altura}cm`:"—"},
                    {l:"OBJETIVO",v:data.objetivo?.replace("_"," ")||"—"},
                    {l:"ATIVIDADE",v:data.atividadeFisica||"—"},
                  ].map((r,i)=>(
                    <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"10px 14px",borderBottom:i<4?"1px solid rgba(66,71,105,0.3)":"none"}}>
                      <span style={{fontFamily:"var(--f-head)",fontSize:"0.52rem",textTransform:"uppercase",letterSpacing:"0.18em",color:"var(--text-2)"}}>{r.l}</span>
                      <span style={{fontFamily:"var(--f-body)",fontSize:"0.78rem",fontWeight:300,color:"var(--text)",textTransform:"capitalize"}}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <p style={{fontFamily:"var(--f-body)",fontSize:"0.65rem",fontWeight:300,color:"var(--text-2)",lineHeight:1.6,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                  Sugestão de ponto de partida. Consulte nutricionista para acompanhamento.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* CTA */}
      <div style={{padding:"14px 16px",borderTop:"1px solid rgba(66,71,105,0.4)",flexShrink:0}} className="pb-safe">
        <button className="btn-solid press" disabled={!canNext()}
          onClick={()=>{ if(step<TOTAL-1) setStep(s=>s+1); else onComplete(data as OnboardingData) }}
          style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>{step<TOTAL-1?"Continuar":`Iniciar Sistema — ${data.nome||"EVO"}`}</span>
          <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  )
}
