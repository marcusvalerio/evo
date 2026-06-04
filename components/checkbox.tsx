"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  variant?: "default" | "accent"
  className?: string
}

export function Checkbox({
  checked,
  onChange,
  variant = "default",
  className,
}: CheckboxProps) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      className={cn(
        "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
        checked
          ? "border-success bg-success"
          : variant === "accent"
          ? "border-primary/50 bg-transparent"
          : "border-border bg-transparent",
        "hover:border-primary/70",
        className
      )}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      >
        <Check className="h-3 w-3 text-background" strokeWidth={3} />
      </motion.div>
    </motion.button>
  )
}
