"use client"

import { DAYS, MEALS, MEAL_ORDER, DayName, MealItem } from "@/lib/data"

// Storage keys
const STORAGE_KEYS = {
  checked: "evol_checked",
  shopChecked: "evol_shop",
  purchases: "evol_purchases",
  weights: "evol_weights",
  evals: "evol_evals",
  prepStock: "evol_prep",
  finMeta: "evol_fin_meta",
} as const

// Helper functions
export function getTodayIdx(): number {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

export function getTodayName(): DayName {
  return DAYS[getTodayIdx()]
}

export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function pad(n: number): string {
  return String(n).padStart(2, "0")
}

export function fmtBRL(v: number): string {
  return (
    "R$ " +
    Number(v)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  )
}

export function fmtDate(str: string): string {
  if (!str) return ""
  const [, m, d] = str.split("-")
  return `${d}/${m}`
}

// Storage helpers
export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

// Progress calculations
export function getDayProgress(
  dayName: DayName,
  checked: Record<string, boolean>
): number {
  const dayMeals = MEALS[dayName]
  let total = 0
  let done = 0

  MEAL_ORDER.forEach((mealName) => {
    const items = dayMeals[mealName]
    if (items) {
      items.forEach((_, i) => {
        total++
        if (checked[`${dayName}__${mealName}__${i}`]) done++
      })
    }
  })

  return total === 0 ? 0 : Math.round((done / 100) * 100)
}

export function getMealProgress(
  dayName: DayName,
  mealName: string,
  checked: Record<string, boolean>
): { done: number; total: number } {
  const items = MEALS[dayName]?.[mealName as keyof typeof MEALS[typeof dayName]] || []
  let done = 0

  items.forEach((_, i) => {
    if (checked[`${dayName}__${mealName}__${i}`]) done++
  })

  return { done, total: items.length }
}

export function getDayProgressReal(
  dayName: DayName,
  checked: Record<string, boolean>
): number {
  const dayMeals = MEALS[dayName]
  let total = 0
  let done = 0

  MEAL_ORDER.forEach((mealName) => {
    const items = dayMeals[mealName]
    if (items) {
      items.forEach((_, i) => {
        total++
        if (checked[`${dayName}__${mealName}__${i}`]) done++
      })
    }
  })

  return total === 0 ? 0 : Math.round((done / total) * 100)
}

// Streak calculation
export function calcStreak(checked: Record<string, boolean>): number {
  let streak = 0
  const d = new Date()

  for (let i = 0; i < 365; i++) {
    const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1
    const dayName = DAYS[dayIdx]
    const prog = getDayProgressReal(dayName, checked)

    if (prog === 100) {
      streak++
      d.setDate(d.getDate() - 1)
    } else if (i === 0) {
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Types for state
export interface Purchase {
  id: string
  name: string
  cat: string
  val: number
  date: string
}

export interface WeightEntry {
  date: string
  val: number
}

export interface DayEval {
  humor: string
  energia: string
  fome: string
  nota: string
}

export { STORAGE_KEYS }
