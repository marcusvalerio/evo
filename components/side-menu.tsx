"use client"

import { motion, AnimatePresence } from "framer-motion"

export type MenuTabId = "compras"|"receitas"|"gastos"|"extrato"|"perfil"|"config"

const ITEMS: {id:MenuTabId;label:string;sub:string}[] = [
  {id:"extrato",  label:"Extrato",          sub:"Telemetria de aderência"},
  {id:"compras",  label:"Lista de Compras",  sub:"Semana"},
  {id:"receitas", label:"Receitas",           sub:"Cozinha real"},
  {id:"gastos",   label:"Gastos",             sub:"Alimentação"},
  {id:"perfil",   label:"Perfil",             sub:"Dados"},
  {id:"config",   label:"Config",             sub:"Sistema"},
]

export function SideMenu({open,onClose,onSelect,userName}:{open:boolean;onClose:()=>void;onSelect:(id:MenuTabId)=>void;userName?:string}) {
  return (
    <AnimatePresence>
      {open&&(
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={onClose}
            style={{position:"fixed",inset:0,zIndex:60,background:"rgba(0,0,0,0.8)"}}/>
          <motion.div
            initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}}
            transition={{type:"tween",duration:0.22,ease:[.4,0,.2,1]}}
            className="side-panel"
            style={{position:"fixed",right:0,top:0,bottom:0,zIndex:70,width:260,display:"flex",flexDirection:"column",borderRadius:"16px 0 0 16px"}}>
            <div className="pt-safe" style={{padding:"14px 16px",borderBottom:"1px solid rgba(66,71,105,0.4)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"var(--f-logo)",fontSize:"1rem",color:"var(--gold)",letterSpacing:"0.14em"}}>EVO</div>
                {userName&&<div style={{fontFamily:"var(--f-body)",fontSize:"0.58rem",fontWeight:300,color:"var(--text-2)",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:3}}>{userName}</div>}
              </div>
              <button onClick={onClose} className="btn-ghost press" style={{padding:"7px 11px"}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto"}}>
              {ITEMS.map((item)=>(
                <button key={item.id} onClick={()=>{onSelect(item.id);onClose()}}
                  className="press"
                  style={{width:"100%",textAlign:"left",padding:"14px 16px",background:"transparent",border:"none",borderBottom:"1px solid rgba(66,71,105,0.25)",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
                  <div>
                    <div style={{fontFamily:"var(--f-head)",fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"0.12em",color:"var(--text)"}}>{item.label}</div>
                    <div style={{fontFamily:"var(--f-body)",fontSize:"0.55rem",fontWeight:300,color:"var(--text-2)",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:3}}>{item.sub}</div>
                  </div>
                  <span style={{color:"var(--gold)",fontSize:"0.8rem"}}>→</span>
                </button>
              ))}
            </div>
            <div style={{padding:"12px 16px",borderTop:"1px solid rgba(66,71,105,0.3)"}} className="pb-safe">
              <div style={{fontFamily:"var(--f-body)",fontSize:"0.5rem",fontWeight:300,color:"rgba(181,158,95,0.3)",textTransform:"uppercase",letterSpacing:"0.14em"}}>evo-weld.vercel.app</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
