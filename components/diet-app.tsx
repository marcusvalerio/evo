"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DAYS, DayName } from "@/lib/data"
import { load, save, getTodayIdx, getDayProgressReal, Purchase, WeightEntry, DayEval, pad } from "@/lib/helpers"
import { Navigation, TabId } from "@/components/navigation"
import { SideMenu, MenuTabId } from "@/components/side-menu"
import { Dashboard } from "@/components/dashboard"
import { IAModal } from "@/components/ia-modal"
import { DayPicker } from "@/components/day-picker"
import { MealList } from "@/components/meal-list"
import { ShoppingList } from "@/components/shopping-list"
import { RecipeList } from "@/components/recipe-list"
import { Finance } from "@/components/finance"

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

const KEYS = {
  checked: "evo2_checked",
  shopChecked: "evo2_shop",
  purchases: "evo2_purchases",
  weights: "evo2_weights",
  evals: "evo2_evals",
  budget: "evo2_budget",
}

type ActiveView = TabId | MenuTabId

export function DietApp() {
  const [tab, setTab]       = useState<TabId>("home")
  const [view, setView]     = useState<ActiveView>("home")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIA, setShowIA] = useState(false)
  const [selDay, setSelDay] = useState(getTodayIdx())
  const [checked, setChecked]     = useState<Record<string, boolean>>({})
  const [shopChk, setShopChk]     = useState<Record<string, boolean>>({})
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [weights, setWeights]     = useState<WeightEntry[]>([])
  const [evals, setEvals]         = useState<Record<string, DayEval>>({})
  const [budget, setBudget]       = useState(300)
  const [hydrated, setHydrated]   = useState(false)

  useEffect(() => {
    setChecked(load(KEYS.checked, {}))
    setShopChk(load(KEYS.shopChecked, {}))
    setPurchases(load(KEYS.purchases, []))
    setWeights(load(KEYS.weights, []))
    setEvals(load(KEYS.evals, {}))
    setBudget(load(KEYS.budget, 300))
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) save(KEYS.checked, checked) }, [checked, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.shopChecked, shopChk) }, [shopChk, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.purchases, purchases) }, [purchases, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.weights, weights) }, [weights, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.evals, evals) }, [evals, hydrated])
  useEffect(() => { if (hydrated) save(KEYS.budget, budget) }, [budget, hydrated])

  function handleTabChange(t: TabId) {
    if (t === "menu") { setMenuOpen(true); return }
    if (t === "ia") { setShowIA(true); return }
    setTab(t); setView(t)
  }
  function handleMenuSelect(id: MenuTabId) { setView(id) }

  const currentDay = DAYS[selDay]
  const dayPct = getDayProgressReal(currentDay, checked)

  if (!hydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#000022" }}>
        <div className="mesh-bg">
          <div className="mesh-orb orb-1"/><div className="mesh-orb orb-2"/>
          <div className="mesh-orb orb-3"/><div className="mesh-orb orb-4"/>
        </div>
        <div className="mesh-grain"/>
        <div className="relative z-10 text-center">
          <div className="evo-breathe text-7xl font-black tracking-tight"
            style={{ color: "#FDFDFE", textShadow: "0 0 60px rgba(26,149,151,.4)" }}>
            EVO
          </div>
          <div className="mt-3 font-mono text-[9px] uppercase tracking-[4px]"
            style={{ color: "rgba(238,242,243,.3)" }}>Carregando</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-dvh" style={{ maxWidth: 480, background: "transparent" }}>
      {/* Mesh */}
      <div className="mesh-bg"><div className="mesh-orb orb-1"/><div className="mesh-orb orb-2"/>
        <div className="mesh-orb orb-3"/><div className="mesh-orb orb-4"/></div>
      <div className="mesh-grain"/>

      {/* Header */}
      <header className="sticky top-0 z-40 pt-safe"
        style={{ background: "rgba(0,0,20,.7)", backdropFilter: "blur(32px)",
          borderBottom: "1px solid rgba(26,149,151,.1)" }}>
        <div className="px-5 pb-4 pt-3 flex items-center justify-between">
          <motion.div key={view} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .22 }}>
            {view === "home" ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl font-black text-lg"
                  style={{ background: "#1A9597", color: "#000022",
                    boxShadow: "0 0 20px rgba(26,149,151,.5)" }}>E</div>
                <div>
                  <div className="text-2xl font-black tracking-tight" style={{ color: "#FDFDFE" }}>EVO</div>
                  <div className="font-mono text-[8px] uppercase tracking-[2.5px]"
                    style={{ color: "rgba(238,242,243,.35)" }}>Evolua seu corpo</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-mono text-[8px] uppercase tracking-[3px]"
                  style={{ color: "rgba(238,242,243,.35)" }}>EVO</div>
                <div className="text-xl font-black tracking-tight" style={{ color: "#FDFDFE" }}>
                  {view === "dieta" ? currentDay
                   : view === "progresso" ? "Progresso"
                   : view === "compras" ? "Compras"
                   : view === "receitas" ? "Receitas"
                   : view === "gastos" ? "Gastos"
                   : view === "perfil" ? "Perfil"
                   : "Configuracoes"}
                </div>
              </div>
            )}
          </motion.div>
          {view === "dieta" && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full font-mono text-[10px] font-bold"
                style={{ background: dayPct === 100 ? "rgba(238,255,153,.15)" : "rgba(26,149,151,.1)",
                  border: `1px solid ${dayPct === 100 ? "rgba(238,255,153,.3)" : "rgba(26,149,151,.2)"}`,
                  color: dayPct === 100 ? "#EEFF99" : "#1A9597" }}>
                {dayPct}%
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 pb-28">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div key="home"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}
              className="pt-4">
              <Dashboard checked={checked} weights={weights} evals={evals} onAskAI={() => setShowIA(true)}/>
            </motion.div>
          )}
          {view === "dieta" && (
            <motion.div key="dieta"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}>
              <DayPicker selectedDay={selDay} onDayChange={setSelDay} checked={checked}/>
              <MealList dayName={currentDay} checked={checked} onToggle={k => setChecked(p => ({...p,[k]:!p[k]}))}/>
            </motion.div>
          )}
          {view === "progresso" && (
            <motion.div key="progresso"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}
              className="pt-4 px-4">
              {/* Progresso simples por hora */}
              <div className="glass rounded-3xl p-5 space-y-4">
                <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(238,242,243,.35)" }}>
                  Registrar Peso
                </div>
                <div className="flex gap-3">
                  <input type="number" step="0.1" placeholder="Ex: 92.5"
                    id="weight-input"
                    className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(16,64,113,.2)", border: "1px solid rgba(26,149,151,.2)",
                      color: "#FDFDFE" }}/>
                  <button
                    className="press rounded-2xl px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-wide"
                    style={{ background: "#1A9597", color: "#000022" }}
                    onClick={() => {
                      const inp = document.getElementById("weight-input") as HTMLInputElement
                      const val = parseFloat(inp?.value || "")
                      if (!isNaN(val) && val > 0) {
                        const d = new Date()
                        const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
                        setWeights(prev => {
                          const filtered = prev.filter(w => w.date !== date)
                          return [...filtered, { date, val }]
                        })
                        if (inp) inp.value = ""
                      }
                    }}>
                    Salvar
                  </button>
                </div>
                {weights.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {[...weights].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5).map(w => (
                      <div key={w.date} className="flex items-center justify-between px-4 py-2.5 rounded-2xl"
                        style={{ background: "rgba(255,255,255,.03)" }}>
                        <span className="font-mono text-[10px]" style={{ color: "rgba(238,242,243,.4)" }}>
                          {w.date.split("-").reverse().slice(0,2).join("/")}
                        </span>
                        <span className="font-bold text-sm" style={{ color: "#FDFDFE" }}>{w.val} kg</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {view === "compras" && (
            <motion.div key="compras"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}
              className="pt-4">
              <ShoppingList shopChecked={shopChk} onToggle={k => setShopChk(p => ({...p,[k]:!p[k]}))} onClear={() => setShopChk({})}/>
            </motion.div>
          )}
          {view === "receitas" && (
            <motion.div key="receitas"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}
              className="pt-4">
              <RecipeList/>
            </motion.div>
          )}
          {view === "gastos" && (
            <motion.div key="gastos"
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}
              className="pt-4">
              <Finance purchases={purchases}
                onAddPurchase={p => setPurchases(prev => [...prev, p])}
                onRemovePurchase={id => setPurchases(prev => prev.filter(p => p.id !== id))}
                budget={budget} onBudgetChange={setBudget}/>
            </motion.div>
          )}
          {(view === "perfil" || view === "config") && (
            <motion.div key={view}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: .2 }}
              className="pt-4 px-4">
              <div className="glass rounded-3xl p-5">
                <p className="text-sm" style={{ color: "rgba(238,242,243,.4)" }}>Em breve.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* IA Modal */}
      <AnimatePresence>
        {showIA && (
          <IAModal onClose={() => setShowIA(false)} weights={weights} evals={evals} checked={checked}/>
        )}
      </AnimatePresence>

      {/* Side Menu */}
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={handleMenuSelect}/>

      {/* Nav */}
      <Navigation active={tab} onChange={handleTabChange}/>
    </div>
  )
}
