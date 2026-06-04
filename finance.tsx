"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { FIN_CATS, FinCategory } from "@/lib/data"
import { Purchase, fmtBRL, fmtDate, todayStr, pad } from "@/lib/helpers"
import { Plus, Trash2, TrendingUp, Calendar, PieChart, X } from "lucide-react"

interface FinanceProps {
  purchases: Purchase[]
  onAddPurchase: (purchase: Purchase) => void
  onRemovePurchase: (id: string) => void
  budget: number
  onBudgetChange: (budget: number) => void
}

export function Finance({
  purchases,
  onAddPurchase,
  onRemovePurchase,
  budget,
  onBudgetChange,
}: FinanceProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", cat: FIN_CATS[0], val: "" })
  const [selectedDate, setSelectedDate] = useState(todayStr())

  // Calculate week spend
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
  weekStart.setHours(0, 0, 0, 0)

  const weekPurchases = purchases.filter(
    (p) => new Date(p.date + "T00:00:00") >= weekStart
  )
  const weekSpend = weekPurchases.reduce((a, p) => a + p.val, 0)
  const budgetPct = Math.min(Math.round((weekSpend / budget) * 100), 100)

  // Category breakdown
  const catTotals = FIN_CATS.map((cat) => ({
    cat,
    total: weekPurchases
      .filter((p) => p.cat === cat)
      .reduce((a, p) => a + p.val, 0),
  })).filter((c) => c.total > 0)

  const maxCatTotal = Math.max(...catTotals.map((c) => c.total), 1)

  // Handle submit
  const handleSubmit = () => {
    if (!form.name || !form.val) return

    onAddPurchase({
      id: Date.now().toString(),
      name: form.name,
      cat: form.cat,
      val: parseFloat(form.val.replace(",", ".")),
      date: selectedDate,
    })

    setForm({ name: "", cat: FIN_CATS[0], val: "" })
    setShowForm(false)
  }

  // Day purchases
  const dayPurchases = purchases.filter((p) => p.date === selectedDate)

  return (
    <div className="space-y-4 px-4 pb-4">
      {/* Budget overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Gasto semanal
            </div>
            <div className="mt-1 font-mono text-2xl font-medium text-foreground">
              {fmtBRL(weekSpend)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Meta
            </div>
            <button
              onClick={() => {
                const newBudget = prompt("Nova meta semanal:", budget.toString())
                if (newBudget) onBudgetChange(parseFloat(newBudget))
              }}
              className="mt-1 font-mono text-lg text-primary hover:underline"
            >
              {fmtBRL(budget)}
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${budgetPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full transition-colors",
              budgetPct >= 100
                ? "bg-destructive"
                : budgetPct >= 80
                ? "bg-primary"
                : "bg-success"
            )}
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
          <span>{budgetPct}% da meta</span>
          <span>Restam {fmtBRL(Math.max(budget - weekSpend, 0))}</span>
        </div>
      </motion.div>

      {/* Category breakdown */}
      {catTotals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Por categoria
            </span>
          </div>
          <div className="space-y-3">
            {catTotals.map((item) => (
              <div key={item.cat} className="flex items-center gap-3">
                <span className="w-20 truncate font-mono text-[9px] uppercase text-muted-foreground">
                  {item.cat}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.total / maxCatTotal) * 100}%` }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <span className="w-16 text-right font-mono text-[9px] text-muted-foreground">
                  {fmtBRL(item.total)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add form toggle */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowForm(!showForm)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-2xl border p-4 transition-colors",
          showForm
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary/50"
        )}
      >
        {showForm ? (
          <X className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        <span className="font-mono text-[10px] uppercase tracking-wider">
          {showForm ? "Cancelar" : "Adicionar gasto"}
        </span>
      </motion.button>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="border-b border-border p-4">
              <span className="text-sm font-medium text-primary">Novo gasto</span>
            </div>
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary"
                    placeholder="Ex: Frango"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                    Valor
                  </label>
                  <input
                    type="text"
                    value={form.val}
                    onChange={(e) => setForm({ ...form, val: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                    Categoria
                  </label>
                  <select
                    value={form.cat}
                    onChange={(e) => setForm({ ...form, cat: e.target.value as FinCategory })}
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary"
                  >
                    {FIN_CATS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.val}
                className="w-full rounded-lg bg-primary py-3 font-mono text-[10px] uppercase tracking-wider text-primary-foreground transition-opacity disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Day purchases */}
      {dayPurchases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 border-b border-border p-4">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Gastos em {fmtDate(selectedDate)}
            </span>
          </div>
          <div className="divide-y divide-border/50">
            {dayPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <div className="text-sm text-foreground">{purchase.name}</div>
                  <div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                    {purchase.cat}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-primary">
                    {fmtBRL(purchase.val)}
                  </span>
                  <button
                    onClick={() => onRemovePurchase(purchase.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
