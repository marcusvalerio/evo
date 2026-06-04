"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Checkbox } from "./checkbox"
import { MEALS, MEAL_ORDER, DayName, MealItem } from "@/lib/data"
import { getMealProgress } from "@/lib/helpers"
import { Coffee, UtensilsCrossed, Apple, Moon, Check, FlaskConical } from "lucide-react"

const MEAL_ICONS = {
  "Cafe da Manha": Coffee,
  "Almoco": UtensilsCrossed,
  "Lanche da Tarde": Apple,
  "Jantar": Moon,
}

interface MealCardProps {
  dayName: DayName
  mealName: string
  items: MealItem[]
  checked: Record<string, boolean>
  onToggle: (key: string) => void
}

function MealCard({ dayName, mealName, items, checked, onToggle }: MealCardProps) {
  const { done, total } = getMealProgress(dayName, mealName, checked)
  const isDone = done === total
  const Icon = MEAL_ICONS[mealName as keyof typeof MEAL_ICONS] || Coffee

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        isDone
          ? "border-success/30 bg-success/5"
          : "border-border bg-card"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-3",
          isDone ? "border-success/20" : "border-border"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              isDone ? "bg-success/20" : "bg-secondary"
            )}
          >
            {isDone ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Icon className={cn("h-4 w-4", "text-primary")} />
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              isDone ? "text-success" : "text-primary"
            )}
          >
            {mealName}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[10px]",
            isDone ? "text-success" : "text-muted-foreground"
          )}
        >
          {done}/{total}
        </span>
      </div>

      {/* Items */}
      <div className="divide-y divide-border/50">
        {items.map((item, idx) => {
          const key = `${dayName}__${mealName}__${idx}`
          const isChecked = !!checked[key]

          return (
            <motion.div
              key={key}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors",
                isChecked && "bg-success/5"
              )}
              onClick={() => onToggle(key)}
              whileTap={{ scale: 0.99 }}
            >
              <Checkbox checked={isChecked} onChange={() => onToggle(key)} />
              <div className="flex flex-1 items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-sm transition-all",
                    isChecked
                      ? "text-muted-foreground line-through"
                      : item.isCreatine
                      ? "text-chart-3 italic"
                      : "text-foreground"
                  )}
                >
                  {item.item}
                </span>
                <span
                  className={cn(
                    "shrink-0 font-mono text-[10px]",
                    isChecked ? "text-muted-foreground/50" : "text-muted-foreground"
                  )}
                >
                  {item.qty}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

interface MealListProps {
  dayName: DayName
  checked: Record<string, boolean>
  onToggle: (key: string) => void
}

export function MealList({ dayName, checked, onToggle }: MealListProps) {
  const dayMeals = MEALS[dayName]
  const allDone = MEAL_ORDER.every((mealName) => {
    const items = dayMeals[mealName]
    return items?.every((_, i) => checked[`${dayName}__${mealName}__${i}`])
  })

  return (
    <div className="space-y-3 px-4 pb-4">
      <AnimatePresence mode="wait">
        {MEAL_ORDER.map((mealName, idx) => {
          const items = dayMeals[mealName]
          if (!items) return null

          return (
            <motion.div
              key={mealName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <MealCard
                dayName={dayName}
                mealName={mealName}
                items={items}
                checked={checked}
                onToggle={onToggle}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Completion banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center"
          >
            <div className="mb-2 text-3xl">&#x1F525;</div>
            <div className="text-base font-semibold text-success">
              Dia completo!
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-success/70">
              Continue assim
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
