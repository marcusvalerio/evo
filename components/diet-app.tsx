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

const KEYS = {
  onboarded:  "evo3_onboarded",
  userData:   "evo3_user",
  checked:    "evo3_checked",
  shopChk:    "evo3_shop",
  purchases:  "evo3_purchases",
  weights:    "evo3_weights",
  evals:      "evo3_evals",
  budget:     "evo3_budget",
}

type ActiveView = TabId | MenuTabId

export function DietApp() {
  const [hydrated,  setHydrated]  = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [userData,  setUserData]  = useState<OnboardingData | null>(null)
  const [tab,       setTab]       = useState<TabId>("home")
  const [view,      setView]      = useState<ActiveView>("home")
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [showIA,    setShowIA]    = useState(false)
  const [selDay,    setSelDay]    = useState(getTodayIdx())
  const [checked,   setChecked]   = useState<Record<string, boolean>>({})
  const [shopChk,   setShopChk]   = useState<Record<string, boolean>>({})
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [weights,   setWeights]   = useState<WeightEntry[]>([])
  const [evals,     setEvals]     = useState<Record<string, DayEval>>({})
  const [budget,    setBudget]    = useState(300)

  useEffect(() => {
    setOnboarded(load(KEYS.onboarded, false))
    setUserData(load(KEYS.userData, null))
    setChecked(load(KEYS.checked, {}))
    setShopChk(load(KEYS.shopChk, {}))
    setPurchases(load(KEYS.purchases, []))
    setWeights(load(KEYS.weights, []))
    setEvals(load(KEYS.evals, {}))
    setBudget(load(KEYS.budget, 300))
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) save(KEYS.checked, checked) }, [checked, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.shopChk, shopChk) }, [shopChk, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.purchases, purchases) }, [purchases, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.weights, weights) }, [weights, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.evals, evals) }, [evals, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.budget, budget) }, [budget, hydrated])

  function handleOnboardingComplete(data: OnboardingData) {
    setUserData(data)
    setOnboarded(true)
    // Save initial weight from onboarding
    if (data.peso) {
      const d = new Date()
      const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      const w = [{ date, val: parseFloat(data.peso) }]
      setWeights(w)
      save(KEYS.weights, w)
    }
    save(KEYS.onboarded, true)
    save(KEYS.userData, data)
  }

  function handleTabChange(t: TabId) {
    if (t === "menu") { setMenuOpen(true); return }
    setTab(t); setView(t)
  }

  const currentDay = DAYS[selDay]
  const dayPct = getDayProgressReal(currentDay, checked)

  // Loading
  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#000022' }}>
        <div className="motion-bg">
          <div className="m-orb orb-navy"/><div className="m-orb orb-ocean"/>
          <div className="m-orb orb-teal"/><div className="m-orb orb-neon"/>
        </div>
        <div className="motion-grain"/>
        <div className="relative z-10 text-center">
          <div className="evo-breathe"
            style={{ fontFamily: 'var(--font-logo)', fontSize: '4rem', color: '#FDFDFE',
              letterSpacing: '0.12em', textShadow: '0 0 60px rgba(26,149,151,0.5)' }}>
            EVO
          </div>
        </div>
      </div>
    )
  }

  // Onboarding
  if (!onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="relative mx-auto min-h-dvh" style={{ maxWidth: 480 }}>
      <div className="motion-bg">
        <div className="m-orb orb-navy"/><div className="m-orb orb-ocean"/>
        <div className="m-orb orb-teal"/><div className="m-orb orb-neon"/>
        <div className="m-orb orb-teal-2"/>
      </div>
      <div className="motion-grain"/>

      {/* Header — minimal, just EVO logo on left */}
      <header className="sticky top-0 z-40 pt-safe"
        style={{
          background: 'rgba(0,0,26,0.6)', backdropFilter: 'blur(32px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        <div style={{
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'var(--font-logo)', fontSize: '1.4rem',
            color: 'var(--fg)', letterSpacing: '0.12em',
          }}>
            EVO
          </div>
          {/* Spacer for Ask button */}
          <div style={{ width: 80 }}/>
        </div>
      </header>

      {/* Floating Ask button — top right */}
      <AskButton onClick={() => setShowIA(true)} />

      {/* Content */}
      <main className="relative z-10" style={{ paddingBottom: 100 }}>
        <AnimatePresence mode="wait">

          {view === "home" && (
            <motion.div key="home"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
              style={{ paddingTop: 8 }}>
              <Dashboard checked={checked} weights={weights} evals={evals} />
            </motion.div>
          )}

          {view === "dieta" && (
            <motion.div key="dieta"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}>
              <DayPicker selectedDay={selDay} onDayChange={setSelDay} checked={checked}/>
              <MealList dayName={currentDay} checked={checked}
                onToggle={k => setChecked(p => ({ ...p, [k]: !p[k] }))}/>
            </motion.div>
          )}

          {view === "progresso" && (
            <motion.div key="progresso"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
              style={{ padding: '8px 16px 0' }}>
              {/* Progress tab */}
              <div style={{ paddingTop: 8, marginBottom: 12 }}>
                <div className="label-xs" style={{ marginBottom: 4 }}>Evolução</div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', color: 'var(--fg)' }}>
                  Seu progresso
                </h2>
              </div>
              <div className="glass" style={{ padding: '1.1rem', marginBottom: 12 }}>
                <div className="label-xs" style={{ marginBottom: 10 }}>Registrar peso</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="number" step="0.1" placeholder="Ex: 92.5" id="w-input"
                    style={{
                      flex: 1, padding: '11px 14px', borderRadius: 12, outline: 'none',
                      background: 'var(--card-2, rgba(16,64,113,0.16))',
                      border: '1px solid var(--border)', color: 'var(--fg)', fontSize: '0.9rem',
                    }}/>
                  <button className="press"
                    style={{
                      padding: '11px 18px', borderRadius: 12,
                      background: 'var(--primary)', color: '#000022',
                      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem',
                    }}
                    onClick={() => {
                      const inp = document.getElementById('w-input') as HTMLInputElement
                      const val = parseFloat(inp?.value || '')
                      if (!isNaN(val) && val > 0) {
                        const d = new Date()
                        const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
                        setWeights(prev => [...prev.filter(w => w.date !== date), { date, val }])
                        if (inp) inp.value = ''
                      }
                    }}>
                    Salvar
                  </button>
                </div>
                {weights.length > 0 && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[...weights].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).map(w => (
                      <div key={w.date} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 12px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.03)',
                      }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--fg-2)' }}>
                          {w.date.split('-').reverse().slice(0,2).join('/')}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--fg)' }}>
                          {w.val} kg
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === "reflexao" && (
            <motion.div key="reflexao"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
              style={{ paddingTop: 8 }}>
              <Reflexao />
            </motion.div>
          )}

          {view === "compras" && (
            <motion.div key="compras"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
              style={{ paddingTop: 8 }}>
              <ShoppingList shopChecked={shopChk}
                onToggle={k => setShopChk(p => ({ ...p, [k]: !p[k] }))}
                onClear={() => setShopChk({})}/>
            </motion.div>
          )}

          {view === "receitas" && (
            <motion.div key="receitas"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
              style={{ paddingTop: 8 }}>
              <RecipeList />
            </motion.div>
          )}

          {view === "gastos" && (
            <motion.div key="gastos"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }}
              style={{ paddingTop: 8 }}>
              <Finance purchases={purchases}
                onAddPurchase={p => setPurchases(prev => [...prev, p])}
                onRemovePurchase={id => setPurchases(prev => prev.filter(p => p.id !== id))}
                budget={budget} onBudgetChange={setBudget}/>
            </motion.div>
          )}

          {(view === "perfil" || view === "config") && (
            <motion.div key={view}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{ padding: '16px' }}>
              <div className="glass" style={{ padding: '1.25rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--fg-2)' }}>
                  Em breve.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* IA Modal */}
      <AnimatePresence>
        {showIA && (
          <IAModal onClose={() => setShowIA(false)} weights={weights} evals={evals}
            checked={checked} userName={userData?.nome} userGoal={userData?.objetivo}/>
        )}
      </AnimatePresence>

      {/* Side menu */}
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)}
        onSelect={(id: MenuTabId) => { setView(id) }} userName={userData?.nome}/>

      {/* Nav pill */}
      <Navigation active={tab} onChange={handleTabChange}/>
    </div>
  )
}
