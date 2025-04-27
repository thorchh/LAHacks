"use client"

import { motion } from "framer-motion"

interface LogoProps {
  size?: "small" | "medium" | "large"
  showText?: boolean
}

export function LeadifyFlowLogo({ size = "medium", showText = true }: LogoProps) {
  // Size mapping
  const sizeMap = {
    small: { logoSize: 28, fontSize: "text-xl", space: "space-x-1" },
    medium: { logoSize: 36, fontSize: "text-2xl", space: "space-x-2" },
    large: { logoSize: 48, fontSize: "text-3xl", space: "space-x-3" },
  }

  const { logoSize, fontSize, space } = sizeMap[size]

  return (
    <div className={`flex items-center ${space}`}>
      <div className="relative">
        <motion.div
          className="bg-blue-600 rounded-full flex items-center justify-center"
          style={{ width: logoSize, height: logoSize }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <motion.div
            className="absolute bg-white rounded-full"
            style={{ width: logoSize * 0.3, height: logoSize * 0.3, left: logoSize * 0.35 }}
            initial={{ y: logoSize * 0.25 }}
            animate={{ y: -logoSize * 0.25 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {showText && (
        <div className={`font-bold ${fontSize}`}>
          <span className="text-slate-800">Leadify</span>
          <span className="text-blue-600">Flow</span>
        </div>
      )}
    </div>
  )
}
