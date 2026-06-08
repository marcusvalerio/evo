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
import { Onboarding, OnboardingData } from "@/components/onboarding"

const K = {
  onboarded: "evo4_ob", userData: "evo4_ud",
  checked: "evo4_ch", shopChk: "evo4_sk",
  purchases: "evo4_pu", weights: "evo4_we",
  evals: "evo4_ev", budget: "evo4_bu",
}

type View = TabId | MenuTabId

export function DietApp() {
  const [hydrated,  setHydrated]  = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [userData,  setUserData]  = useState<OnboardingData | null>(null)
  const [tab,       setTab]       = useState<TabId>("home")
  const [view,      setView]      = useState<View>("home")
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [showIA,    setShowIA]    = useState(false)
  const [selDay,    setSelDay]    = useState(getTodayIdx())
  const [checked,   setChecked]   = useState<Record<string,boolean>>({})
  const [shopChk,   setShopChk]   = useState<Record<string,boolean>>({})
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [weights,   setWeights]   = useState<WeightEntry[]>([])
  const [evals,     setEvals]     = useState<Record<string,DayEval>>({})
  const [budget,    setBudget]    = useState(300)

  useEffect(() => {
    setOnboarded(load(K.onboarded, false))
    setUserData(load(K.userData, null))
    setChecked(load(K.checked, {}))
    setShopChk(load(K.shopChk, {}))
    setPurchases(load(K.purchases, []))
    setWeights(load(K.weights, []))
    setEvals(load(K.evals, {}))
    setBudget(load(K.budget, 300))
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) save(K.checked,   checked)   }, [checked,   hydrated])
  useEffect(() => { if (hydrated) save(K.shopChk,   shopChk)   }, [shopChk,   hydrated])
  useEffect(() => { if (hydrated) save(K.purchases, purchases) }, [purchases, hydrated])
  useEffect(() => { if (hydrated) save(K.weights,   weights)   }, [weights,   hydrated])
  useEffect(() => { if (hydrated) save(K.evals,     evals)     }, [evals,     hydrated])
  useEffect(() => { if (hydrated) save(K.budget,    budget)    }, [budget,    hydrated])

  function handleOnboard(data: OnboardingData) {
    setUserData(data); setOnboarded(true)
    if (data.peso) {
      const d = new Date()
      const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      const w = [{ date, val: parseFloat(data.peso) }]
      setWeights(w); save(K.weights, w)
    }
    save(K.onboarded, true); save(K.userData, data)
  }

  function handleTab(t: TabId) {
    if (t === "menu") { setMenuOpen(true); return }
    setTab(t); setView(t)
  }

  const currentDay = DAYS[selDay]
  const dayPct = getDayProgressReal(currentDay, checked)

  /* LOADING */
  if (!hydrated) return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <div className="breathe" style={{ fontFamily: 'var(--f-logo)', fontSize: '3rem',
        color: '#FFFFFF', letterSpacing: '0.18em' }}>EVO</div>
    </div>
  )

  /* ONBOARDING */
  if (!onboarded) return <Onboarding onComplete={handleOnboard}/>

  const VIEW_TITLE: Record<string, string> = {
    home: '', dieta: currentDay, progresso: 'Evolução',
    reflexao: 'Reflexão', compras: 'Compras',
    receitas: 'Receitas', gastos: 'Gastos',
    perfil: 'Perfil', config: 'Config',
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100dvh',
      background: '#000000', position: 'relative' }}>

      {/* HEADER — linha fina, limpo */}
      <header className="pt-safe" style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: '#000000',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 16px',
        }}>
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}>
            {view === 'home' ? (
              <span style={{ fontFamily: 'var(--f-logo)', fontSize: '1.3rem',
                letterSpacing: '0.14em', color: '#FFFFFF' }}>EVO</span>
            ) : (
              <span style={{ fontFamily: 'var(--f-title)', fontSize: '0.9rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: '#FFFFFF' }}>{VIEW_TITLE[view] || view}</span>
            )}
          </motion.div>
          {/* Space for Ask button */}
          <div style={{ width: 80 }}/>
        </div>
        {/* Progress bar for dieta tab */}
        {view === 'dieta' && (
          <div className="progress-track" style={{ margin: '0', height: 2 }}>
            <motion.div className="progress-fill"
              initial={{ width: 0 }} animate={{ width: `${dayPct}%` }}
              transition={{ duration: 1.2 }}/>
          </div>
        )}
      </header>

      {/* ASK BUTTON */}
      <AskButton onClick={() => setShowIA(true)}/>

      {/* CONTENT */}
      <main style={{ paddingBottom: 80 }}>
        <AnimatePresence mode="wait">

          {view === 'home' && (
            <motion.div key="home"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Dashboard checked={checked} weights={weights} evals={evals}/>
            </motion.div>
          )}

          {view === 'dieta' && (
            <motion.div key="dieta"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <DayPicker selectedDay={selDay} onDayChange={setSelDay} checked={checked}/>
              <MealList dayName={currentDay} checked={checked}
                onToggle={k => setChecked(p => ({...p,[k]:!p[k]}))}/>
            </motion.div>
          )}

          {view === 'progresso' && (
            <motion.div key="progresso"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div style={{ padding: '0' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Registrar peso</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" step="0.1" placeholder="Ex: 92.5" id="w-in"
                      className="input-brutal" style={{ flex: 1 }}/>
                    <button className="btn-primary press"
                      style={{ padding: '12px 16px', flexShrink: 0 }}
                      onClick={() => {
                        const el = document.getElementById('w-in') as HTMLInputElement
                        const val = parseFloat(el?.value || '')
                        if (!isNaN(val) && val > 0) {
                          const d = new Date()
                          const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
                          setWeights(prev => [...prev.filter(w => w.date !== date), { date, val }])
                          if (el) el.value = ''
                        }
                      }}>
                      Salvar
                    </button>
                  </div>
                </div>
                {weights.length > 0 && (
                  <div>
                    {[...weights].sort((a,b) => b.date.localeCompare(a.date)).slice(0,8).map((w,i) => (
                      <div key={w.date} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <span style={{ fontFamily: 'var(--f-body)', fontSize: '0.7rem',
                          fontWeight: 300, color: 'rgba(255,255,255,0.3)' }}>
                          {w.date.split('-').reverse().slice(0,2).join('/')}
                        </span>
                        <span style={{ fontFamily: 'var(--f-logo)', fontSize: '1.1rem',
                          color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                          {w.val} <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>kg</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'reflexao' && (
            <motion.div key="reflexao"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Reflexao/>
            </motion.div>
          )}

          {view === 'compras' && (
            <motion.div key="compras" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <ShoppingList shopChecked={shopChk}
                onToggle={k => setShopChk(p => ({...p,[k]:!p[k]}))} onClear={() => setShopChk({})}/>
            </motion.div>
          )}
          {view === 'receitas' && (
            <motion.div key="receitas" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <RecipeList/>
            </motion.div>
          )}
          {view === 'gastos' && (
            <motion.div key="gastos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <Finance purchases={purchases}
                onAddPurchase={p => setPurchases(pr => [...pr, p])}
                onRemovePurchase={id => setPurchases(pr => pr.filter(p => p.id !== id))}
                budget={budget} onBudgetChange={setBudget}/>
            </motion.div>
          )}
          {(view === 'perfil' || view === 'config') && (
            <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}>
              <div style={{ padding: 16 }}>
                <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                  letterSpacing: '0.1em', fontWeight: 300 }}>Em breve.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {showIA && (
          <IAModal onClose={() => setShowIA(false)} weights={weights} evals={evals}
            checked={checked} userName={userData?.nome} userGoal={userData?.objetivo}/>
        )}
      </AnimatePresence>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)}
        onSelect={(id: MenuTabId) => { setView(id) }} userName={userData?.nome}/>

      <Navigation active={tab} onChange={handleTab}/>
    </div>
  )
}
