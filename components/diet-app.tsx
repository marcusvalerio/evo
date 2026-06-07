"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DAYS, DayName } from "@/lib/data"
import {
  load,
  save,
  getTodayIdx,
  getDayProgressReal,
  Purchase,
  WeightEntry,
  DayEval,
} from "@/lib/helpers"
import { Navigation, TabId } from "@/components/navigation"
import { Header } from "@/components/header"
import { DayPicker } from "@/components/day-picker"
import { MealList } from "@/components/meal-list"
import { ShoppingList } from "@/components/shopping-list"
import { RecipeList } from "@/components/recipe-list"
import { Finance } from "@/components/finance"
import { Dashboard } from "@/components/dashboard"

const KEYS = {
  checked: "evo_checked",
  shopChecked: "evo_shop",
  purchases: "evo_purchases",
  weights: "evo_weights",
  evals: "evo_evals",
  finMeta: "evo_fin_meta",
}

export function DietApp() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard")
  const [selectedDay, setSelectedDay] = useState(getTodayIdx())
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [shopChecked, setShopChecked] = useState<Record<string, boolean>>({})
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [weights, setWeights] = useState<WeightEntry[]>([])
  const [evals, setEvals] = useState<Record<string, DayEval>>({})
  const [budget, setBudget] = useState(300)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setChecked(load(KEYS.checked, {}))
    setShopChecked(load(KEYS.shopChecked, {}))
    setPurchases(load(KEYS.purchases, []))
    setWeights(load(KEYS.weights, []))
    setEvals(load(KEYS.evals, {}))
    setBudget(load(KEYS.finMeta, 300))
    setIsHydrated(true)
  }, [])

  useEffect(() => { if (isHydrated) save(KEYS.checked, checked) }, [checked, isHydrated])
  useEffect(() => { if (isHydrated) save(KEYS.shopChecked, shopChecked) }, [shopChecked, isHydrated])
  useEffect(() => { if (isHydrated) save(KEYS.purchases, purchases) }, [purchases, isHydrated])
  useEffect(() => { if (isHydrated) save(KEYS.weights, weights) }, [weights, isHydrated])
  useEffect(() => { if (isHydrated) save(KEYS.evals, evals) }, [evals, isHydrated])
  useEffect(() => { if (isHydrated) save(KEYS.finMeta, budget) }, [budget, isHydrated])

  const toggleChecked = (key: string) => setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  const toggleShopChecked = (key: string) => setShopChecked(prev => ({ ...prev, [key]: !prev[key] }))
  const clearShopChecked = () => setShopChecked({})
  const addPurchase = (purchase: Purchase) => setPurchases(prev => [...prev, purchase])
  const removePurchase = (id: string) => setPurchases(prev => prev.filter(p => p.id !== id))

  const currentDay = DAYS[selectedDay]
  const dayProgress = getDayProgressReal(currentDay, checked)

  const getTitle = () => {
    switch (activeTab) {
      case "dashboard": return "EVO"
      case "dieta": return currentDay
      case "compras": return "Compras"
      case "receitas": return "Receitas"
      case "financeiro": return "Gastos"
      default: return "EVO"
    }
  }

  const getSubtitle = () => {
    switch (activeTab) {
      case "dashboard": return "Evolua seu corpo"
      case "dieta": return "Plano Alimentar"
      case "compras": return "Lista da Semana"
      case "receitas": return "Cozinha Real"
      case "financeiro": return "Controle"
      default: return ""
    }
  }

  if (!isHydrated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        {/* Gradient mesh on loading screen */}
        <div className="gradient-mesh">
          <div className="mesh-orb mesh-orb-1" />
          <div className="mesh-orb mesh-orb-2" />
          <div className="mesh-orb mesh-orb-3" />
        </div>
        <div className="relative z-10 text-center">
          <motion.div
            className="evo-breathe text-6xl font-black text-gradient tracking-tight"
          >
            EVO
          </motion.div>
          <div className="mt-3 font-mono text-[9px] uppercase tracking-[4px] text-muted-foreground">
            Carregando
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-md bg-background pb-24">
      {/* Animated gradient mesh background */}
      <div className="gradient-mesh">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
        <div className="mesh-orb mesh-orb-4" />
      </div>

      <Header
        title={getTitle()}
        subtitle={getSubtitle()}
        progress={activeTab === "dieta" ? dayProgress : undefined}
        showBrand={activeTab === "dashboard"}
      />

      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="pt-4"
            >
              <Dashboard checked={checked} weights={weights} evals={evals} />
            </motion.div>
          )}

          {activeTab === "dieta" && (
            <motion.div
              key="dieta"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
            >
              <DayPicker selectedDay={selectedDay} onDayChange={setSelectedDay} checked={checked} />
              <MealList dayName={currentDay} checked={checked} onToggle={toggleChecked} />
            </motion.div>
          )}

          {activeTab === "compras" && (
            <motion.div
              key="compras"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="pt-4"
            >
              <ShoppingList shopChecked={shopChecked} onToggle={toggleShopChecked} onClear={clearShopChecked} />
            </motion.div>
          )}

          {activeTab === "receitas" && (
            <motion.div
              key="receitas"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="pt-4"
            >
              <RecipeList />
            </motion.div>
          )}

          {activeTab === "financeiro" && (
            <motion.div
              key="financeiro"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
              className="pt-4"
            >
              <Finance
                purchases={purchases}
                onAddPurchase={addPurchase}
                onRemovePurchase={removePurchase}
                budget={budget}
                onBudgetChange={setBudget}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
