"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { DAYS, DayName } from "@/lib/data"
import { getDayProgressReal } from "@/lib/helpers"

interface DayPickerProps {
  selectedDay: number
  onDayChange: (day: number) => void
  checked: Record<string, boolean>
}

export function DayPicker({ selectedDay, onDayChange, checked }: DayPickerProps) {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="grid grid-cols-7 gap-2 px-4 py-4">
      {DAYS.map((day, idx) => {
        const isSelected = idx === selectedDay
        const isToday = idx === todayIdx
        const progress = getDayProgressReal(day, checked)
        const isDone = progress === 100
        const isPartial = progress > 0 && progress < 100

        return (
          <motion.button
            key={day}
            onClick={() => onDayChange(idx)}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-xl border py-2 transition-all",
              isSelected
                ? "border-primary bg-secondary"
                : "border-border bg-transparent",
              isDone && "border-success/30 bg-success/5"
            )}
            whileTap={{ scale: 0.95 }}
          >
            {isToday && (
              <div className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
            )}
            <span
              className={cn(
                "font-mono text-[7px] uppercase tracking-wider",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            >
              {day.slice(0, 3)}
            </span>
            <span
              className={cn(
                "font-mono text-[8px]",
                isDone
                  ? "text-success"
                  : isPartial
                  ? "text-primary"
                  : "text-muted-foreground/50"
              )}
            >
              {isDone ? "100%" : isPartial ? `${progress}%` : "—"}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
