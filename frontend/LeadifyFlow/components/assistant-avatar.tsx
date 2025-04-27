"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface AssistantAvatarProps {
  journeyStage: number
  processStatus: ProcessStatus
}

export function AssistantAvatar({ journeyStage, processStatus }: AssistantAvatarProps) {
  const [showTip, setShowTip] = useState(false)
  const [tip, setTip] = useState("")
  const [expression, setExpression] = useState("neutral")

  // Change tips and expression based on current journey stage
  useEffect(() => {
    const tips = [
      "Hi! I'm Nova, your AI assistant. Tell me about your event and I'll help you find the perfect speakers and sponsors!",
      "The more details you share about your target audience, the better matches I can find for you.",
      "Clear goals help me understand what you're looking for in speakers and sponsors.",
      "I'm searching through thousands of potential matches to find the best ones for your event!",
      "I've found some great matches! Check out the Leads tab to see detailed recommendations.",
    ]

    // Set tip based on journey stage
    setTip(tips[Math.min(journeyStage, tips.length - 1)])

    // Set expression based on journey stage and process status
    if (processStatus.stage === ProcessStage.Completed) {
      setExpression("happy")
    } else if (processStatus.stage !== ProcessStage.Idle && journeyStage === 3) {
      setExpression("thinking")
    } else {
      setExpression("neutral")
    }

    // Show tip automatically when stage changes
    setShowTip(true)
    const timer = setTimeout(() => {
      setShowTip(false)
    }, 6000)

    return () => clearTimeout(timer)
  }, [journeyStage, processStatus])

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <button
          onClick={() => setShowTip(!showTip)}
          className="w-12 h-12 rounded-full bg-rose-100 p-0.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
        >
          <img
            src={`/nova-${expression}.png`}
            alt="Nova Assistant"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-slate-200">
            <MessageCircle size={12} className="text-rose-600" />
          </div>
        </button>
      </motion.div>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-16 w-64 bg-white rounded-lg shadow-sm border border-slate-200 p-4 z-10"
          >
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="text-rose-600 mt-1" />
              <p className="text-sm text-slate-600">{tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
