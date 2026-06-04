"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Checkbox } from "./checkbox"
import { SHOPPING } from "@/lib/data"
import { Trash2, Drumstick, Milk, Wheat, Salad, Apple, FlaskConical } from "lucide-react"

const CATEGORY_ICONS = {
  "Proteinas": Drumstick,
  "Laticinios": Milk,
  "Carboidratos": Wheat,
  "Legumes e Verduras": Salad,
  "Frutas": Apple,
  "Temperos e Extras": FlaskConical,
}

interface ShoppingListProps {
  shopChecked: Record<string, boolean>
  onToggle: (key: string) => void
  onClear: () => void
}

export function ShoppingList({ shopChecked, onToggle, onClear }: ShoppingListProps) {
  const totalItems = SHOPPING.reduce((acc, cat) => acc + cat.items.length, 0)
  const checkedCount = Object.values(shopChecked).filter(Boolean).length

  return (
    <div className="px-4 pb-4">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card p-4"
      >
        <div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            Itens marcados
          </div>
          <div className="font-mono text-lg text-foreground">
            {checkedCount} <span className="text-muted-foreground">/ {totalItems}</span>
          </div>
        </div>
        {checkedCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClear}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 font-mono text-[10px] text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Limpar
          </motion.button>
        )}
      </motion.div>

      {/* Categories */}
      <div className="space-y-3">
        {SHOPPING.map((category, catIdx) => {
          const Icon = CATEGORY_ICONS[category.cat as keyof typeof CATEGORY_ICONS] || FlaskConical
          const catChecked = category.items.filter((_, i) => shopChecked[`${category.cat}__${i}`]).length
          const allDone = catChecked === category.items.length

          return (
            <motion.div
              key={category.cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.05 }}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all duration-300",
                allDone
                  ? "border-success/30 bg-success/5"
                  : "border-border bg-card"
              )}
            >
              {/* Category header */}
              <div
                className={cn(
                  "flex items-center justify-between border-b px-4 py-3",
                  allDone ? "border-success/20" : "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      allDone ? "bg-success/20" : "bg-secondary"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", allDone ? "text-success" : "text-primary")} />
                  </div>
                  <span className={cn("text-sm font-medium", allDone ? "text-success" : "text-foreground")}>
                    {category.cat}
                  </span>
                </div>
                <span className={cn("font-mono text-[10px]", allDone ? "text-success" : "text-muted-foreground")}>
                  {catChecked}/{category.items.length}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border/50">
                {category.items.map((item, idx) => {
                  const key = `${category.cat}__${idx}`
                  const isChecked = !!shopChecked[key]

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
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "text-sm transition-all",
                              isChecked ? "text-muted-foreground line-through" : "text-foreground"
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
                        <span
                          className={cn(
                            "mt-0.5 block font-mono text-[9px]",
                            isChecked ? "text-muted-foreground/30" : "text-muted-foreground/60"
                          )}
                        >
                          {item.tip}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
