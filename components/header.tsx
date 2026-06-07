"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ProgressRing } from "./progress-ring"
import { Bell } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
  progress?: number
  className?: string
  showBrand?: boolean
}

export function Header({ title, subtitle, progress, className, showBrand = false }: HeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-40 border-b border-border/40 glass-card-strong",
      "safe-area-pt",
      className
    )}>
      <div className="mx-auto max-w-md px-5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {showBrand ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary glow-green">
                  <span className="text-lg font-black text-primary-foreground tracking-tight">E</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-foreground leading-none">
                    {title}
                  </h1>
                  {subtitle && (
                    <div className="font-mono text-[8px] uppercase tracking-[2.5px] text-muted-foreground mt-0.5">
                      {subtitle}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {subtitle && (
                  <div className="font-mono text-[8px] uppercase tracking-[3px] text-muted-foreground">
                    {subtitle}
                  </div>
                )}
                <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  {title}
                </h1>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2.5"
          >
            {progress !== undefined && (
              <ProgressRing
                progress={progress}
                color={progress === 100 ? "success" : "primary"}
              />
            )}
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
