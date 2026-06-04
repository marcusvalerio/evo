"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  label?: string
  color?: "primary" | "success"
}

export function ProgressRing({
  progress,
  size = 56,
  strokeWidth = 3,
  className,
  showLabel = true,
  label,
  color = "primary",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const colorClass = color === "success" 
    ? "stroke-success" 
    : "stroke-primary"

  const textColorClass = color === "success"
    ? "text-success"
    : "text-primary"

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={colorClass}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showLabel && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-mono text-[10px] font-medium",
          textColorClass
        )}>
          {label ?? `${progress}%`}
        </div>
      )}
    </div>
  )
}
