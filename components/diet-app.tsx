"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DAYS } from "@/lib/data"
import { load, save, getTodayIdx, getDayProgressReal, Purchase, WeightEntry, DayEval, pad } from "@/lib/helpers"
import { Navigation, TabId } from "@/components/navigation"
import { SideMenu, MenuTabId } from "@/components/side-menu"
import { Dashboard } from "@/components/dashboard"
import { IAModal } from "@/components/ia-modal"
import { AskButton } from "@/components/ask-button"
import { DayPicker } from "@/components/day-picker"
import { MealList } from "@/components/meal-list"
import { ShoppingList } from "@/components/shopping-list"
import { RecipeList } from "@/components/recipe-list"
import { Finance } from "@/components/finance"
import { Reflexao } from "@/components/reflexao"
import { Extrato } from "@/components/extrato"
import { Onboarding, OnboardingData } from "@/components/onboarding"

const K = {
  onboarded:"evo5_ob", userData:"evo5_ud",
  checked:"evo5_ch", shopChk:"evo5_sk",
  purchases:"evo5_pu", weights:"evo5_we",
  evals:"evo5_ev", budget:"evo5_bu",
}

type View = TabId | MenuTabId

export function DietApp() {
  const [hydrated,  setHydrated]  = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [userData,  setUserData]  = useState<OnboardingData|null>(null)
  const [tab,  setTab]  = useState<TabId>("home")
  const [view, setView] = useState<View>("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIA,   setShowIA]   = useState(false)
  const [selDay,   setSelDay]   = useState(getTodayIdx())
  const [checked,   setChecked]   = useState<Record<string,boolean>>({})
  const [shopChk,   setShopChk]   = useState<Record<string,boolean>>({})
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [weights,   setWeights]   = useState<WeightEntry[]>([])
  const [evals,     setEvals]     = useState<Record<string,DayEval>>({})
  const [budget,    setBudget]    = useState(300)

  useEffect(() => {
    setOnboarded(load(K.onboarded,false))
    setUserData(load(K.userData,null))
    setChecked(load(K.checked,{}))
    setShopChk(load(K.shopChk,{}))
    setPurchases(load(K.purchases,[]))
    setWeights(load(K.weights,[]))
    setEvals(load(K.evals,{}))
    setBudget(load(K.budget,300))
    setHydrated(true)
  },[])

  useEffect(()=>{if(hydrated)save(K.checked,checked)},[checked,hydrated])
  useEffect(()=>{if(hydrated)save(K.shopChk,shopChk)},[shopChk,hydrated])
  useEffect(()=>{if(hydrated)save(K.purchases,purchases)},[purchases,hydrated])
  useEffect(()=>{if(hydrated)save(K.weights,weights)},[weights,hydrated])
  useEffect(()=>{if(hydrated)save(K.evals,evals)},[evals,hydrated])
  useEffect(()=>{if(hydrated)save(K.budget,budget)},[budget,hydrated])

  function handleOnboard(data: OnboardingData) {
    setUserData(data); setOnboarded(true)
    if (data.peso) {
      const d = new Date()
      const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      const w = [{date, val: parseFloat(data.peso)}]
      setWeights(w); save(K.weights,w)
    }
    save(K.onboarded,true); save(K.userData,data)
  }

  function handleTab(t: TabId) {
    if (t==="menu") { setMenuOpen(true); return }
    setTab(t); setView(t)
  }

  const currentDay = DAYS[selDay]
  const dayPct = getDayProgressReal(currentDay, checked)

  const TITLES: Record<string,string> = {
    dieta: currentDay, progresso:'EVOLUÇÃO', reflexao:'REFLEXÃO',
    compras:'COMPRAS', receitas:'RECEITAS', gastos:'GASTOS',
    extrato:'EXTRATO', perfil:'PERFIL', config:'CONFIG',
  }

  if (!hydrated) return (
    <div style={{position:'fixed',inset:0,background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="breathe" style={{fontFamily:'var(--f-logo)',fontSize:'3rem',color:'#fff',letterSpacing:'0.18em'}}>EVO</div>
    </div>
  )

  if (!onboarded) return <Onboarding onComplete={handleOnboard}/>

  return (
    <div style={{maxWidth:480,margin:'0 auto',minHeight:'100dvh',background:'#000',position:'relative'}}>

      {/* HEADER */}
      <header className="pt-safe" style={{
        position:'sticky',top:0,zIndex:40,
        background:'#000000',
        borderBottom:'1px solid #222',
      }}>
        <div style={{
          display:'flex',justifyContent:'space-between',alignItems:'center',
          padding:'10px 16px',
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={view}
              initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              {view==='home' ? (
                <span style={{fontFamily:'var(--f-logo)',fontSize:'1.2rem',
                  letterSpacing:'0.14em',color:'#fff'}}>EVO</span>
              ) : (
                <span style={{fontFamily:'var(--f-title)',fontSize:'0.72rem',
                  textTransform:'uppercase',letterSpacing:'0.16em',
                  color:'rgba(255,255,255,0.7)'}}>
                  {TITLES[view]||view}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
          <div style={{width:72}}/>
        </div>
        {view==='dieta'&&(
          <div className="prog-track">
            <div className="prog-fill" style={{width:`${dayPct}%`}}/>
          </div>
        )}
      </header>

      {/* ASK */}
      <AskButton onClick={()=>setShowIA(true)}/>

      {/* MAIN */}
      <main style={{paddingBottom:72}}>
        <AnimatePresence mode="wait">
          {view==='home'&&(
            <motion.div key="home" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <Dashboard checked={checked} weights={weights} evals={evals}/>
            </motion.div>
          )}
          {view==='dieta'&&(
            <motion.div key="dieta" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <DayPicker selectedDay={selDay} onDayChange={setSelDay} checked={checked}/>
              <MealList dayName={currentDay} checked={checked}
                onToggle={k=>setChecked(p=>({...p,[k]:!p[k]}))}/>
            </motion.div>
          )}
          {view==='progresso'&&(
            <motion.div key="progresso" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <div style={{borderBottom:'1px solid #222'}}>
                <div style={{
                  padding:'10px 16px',background:'#0a0a0a',borderBottom:'1px solid #222',
                  display:'flex',justifyContent:'space-between',alignItems:'center',
                }}>
                  <span style={{fontFamily:'var(--f-title)',fontSize:'0.58rem',
                    textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)'}}>
                    Registrar peso
                  </span>
                </div>
                <div style={{padding:'12px 16px',display:'flex',gap:8,borderBottom:'1px solid #111'}}>
                  <input type="number" step="0.1" placeholder="92.5" id="w-in"
                    className="inp" style={{flex:1}}/>
                  <button className="btn-o press" id="w-btn"
                    style={{padding:'12px 16px',width:'auto'}}
                    onClick={()=>{
                      const el=document.getElementById('w-in') as HTMLInputElement
                      const val=parseFloat(el?.value||'')
                      if(!isNaN(val)&&val>0){
                        const d=new Date()
                        const date=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
                        setWeights(prev=>[...prev.filter(w=>w.date!==date),{date,val}])
                        if(el)el.value=''
                      }
                    }}>SALVAR</button>
                </div>
                {weights.length>0&&[...weights].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8).map((w,i)=>(
                  <div key={w.date} style={{
                    display:'flex',justifyContent:'space-between',alignItems:'baseline',
                    padding:'11px 16px',borderBottom:'1px solid #111',
                  }}>
                    <span style={{fontFamily:'var(--f-body)',fontSize:'0.62rem',
                      fontWeight:300,color:'rgba(255,255,255,0.25)',
                      textTransform:'uppercase',letterSpacing:'0.1em'}}>
                      {w.date.split('-').reverse().slice(0,2).join('/')}
                    </span>
                    <span style={{fontFamily:'var(--f-logo)',fontSize:'1.1rem',
                      color:'#fff',letterSpacing:'-0.01em'}}>
                      {w.val}<span style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.25)',marginLeft:3}}>kg</span>
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {view==='reflexao'&&(
            <motion.div key="reflexao" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <Reflexao/>
            </motion.div>
          )}
          {view==='extrato'&&(
            <motion.div key="extrato" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <Extrato checked={checked} weights={weights}
                userName={userData?.nome} userGoal={userData?.objetivo}/>
            </motion.div>
          )}
          {view==='compras'&&(
            <motion.div key="compras" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <ShoppingList shopChecked={shopChk}
                onToggle={k=>setShopChk(p=>({...p,[k]:!p[k]}))} onClear={()=>setShopChk({})}/>
            </motion.div>
          )}
          {view==='receitas'&&(
            <motion.div key="receitas" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <RecipeList/>
            </motion.div>
          )}
          {view==='gastos'&&(
            <motion.div key="gastos" initial={{opacity:0}} animate={{opacity:1}}
              exit={{opacity:0}} transition={{duration:0.15}}>
              <Finance purchases={purchases}
                onAddPurchase={p=>setPurchases(pr=>[...pr,p])}
                onRemovePurchase={id=>setPurchases(pr=>pr.filter(p=>p.id!==id))}
                budget={budget} onBudgetChange={setBudget}/>
            </motion.div>
          )}
          {(view==='perfil'||view==='config')&&(
            <motion.div key={view} initial={{opacity:0}} animate={{opacity:1}}
              transition={{duration:0.15}}>
              <div style={{padding:'16px',borderBottom:'1px solid #222'}}>
                <span style={{fontFamily:'var(--f-body)',fontSize:'0.7rem',
                  fontWeight:300,color:'rgba(255,255,255,0.25)',
                  textTransform:'uppercase',letterSpacing:'0.14em'}}>EM BREVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showIA&&(
          <IAModal onClose={()=>setShowIA(false)} weights={weights} evals={evals}
            checked={checked} userName={userData?.nome} userGoal={userData?.objetivo}/>
        )}
      </AnimatePresence>

      <SideMenu open={menuOpen} onClose={()=>setMenuOpen(false)}
        onSelect={(id:MenuTabId)=>{setView(id)}} userName={userData?.nome}/>

      <Navigation active={tab} onChange={handleTab}/>
    </div>
  )
}
