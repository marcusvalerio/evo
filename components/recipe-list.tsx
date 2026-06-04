"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { RECIPES, Recipe } from "@/lib/data"
import { Snowflake, ChevronDown, Lightbulb } from "lucide-react"
import { useState } from "react"

const RECIPE_CATEGORIES = ["Todos", "Proteina", "Carboidrato", "Cafe da Manha", "Vegetal", "Outros"]

interface RecipeCardProps {
  recipe: Recipe
  isExpanded: boolean
  onToggle: () => void
}

function RecipeCard({ recipe, isExpanded, onToggle }: RecipeCardProps) {
  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">{recipe.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            {recipe.freeze && (
              <div className="flex items-center gap-1 rounded-md bg-chart-3/10 px-2 py-0.5">
                <Snowflake className="h-3 w-3 text-chart-3" />
                <span className="font-mono text-[8px] text-chart-3">Congela</span>
              </div>
            )}
            <span className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[8px] text-muted-foreground">
              {recipe.cat}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 p-4">
              {/* Ingredients */}
              <div>
                <div className="mb-2 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                  Ingredientes
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {recipe.ingr.replace(/-/g, " - ")}
                </p>
              </div>

              {/* Steps */}
              <div>
                <div className="mb-2 font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                  Preparo
                </div>
                <div className="space-y-2">
                  {recipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="shrink-0 font-mono text-[10px] text-primary">
                        {idx + 1}.
                      </span>
                      <p className="text-sm leading-relaxed text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2 rounded-lg border-l-2 border-primary/50 bg-primary/5 p-3">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  {recipe.tip}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-center gap-1 border-t border-border py-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary/50"
      >
        {isExpanded ? "Fechar" : "Ver receita"}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>
    </motion.div>
  )
}

export function RecipeList() {
  const [filter, setFilter] = useState("Todos")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const filteredRecipes =
    filter === "Todos"
      ? RECIPES
      : RECIPES.filter((r) => r.cat === filter)

  return (
    <div className="pb-4">
      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {RECIPE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-wider transition-all",
              filter === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipes */}
      <div className="space-y-3 px-4">
        <AnimatePresence mode="popLayout">
          {filteredRecipes.map((recipe, idx) => (
            <motion.div
              key={recipe.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
            >
              <RecipeCard
                recipe={recipe}
                isExpanded={!!expanded[recipe.name]}
                onToggle={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [recipe.name]: !prev[recipe.name],
                  }))
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
