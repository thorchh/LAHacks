"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MessageCircle, X } from "lucide-react"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface AssistantCharacterProps {
  currentStep: number
  processStatus: ProcessStatus
}

export function AssistantCharacter({ currentStep, processStatus }: AssistantCharacterProps) {
  const [showTip, setShowTip] = useState(false)
  const [tip, setTip] = useState("")

  // Change tips based on current step
  useEffect(() => {
    const tips = [
      "Hi! I'm Genie, your AI assistant. I'll help you find the perfect speakers and sponsors!",
      "Make sure to provide detailed event information for better recommendations.",
      "The more specific you are about your target audience, the better matches we'll find.",
      "Clear goals help me understand what you're looking for in speakers and sponsors.",
      "I'm searching through thousands of potential matches to find the best ones for you!",
      "Here's an overview of what I found. You can explore speakers and sponsors in detail.",
      "These speakers match your event theme and audience preferences.",
      "These sponsors align with your event goals and target audience.",
      "You can export your results or start a new search anytime!",
    ]

    setTip(tips[currentStep])
    setShowTip(true)

    const timer = setTimeout(() => {
      setShowTip(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [currentStep])

  // Show different expressions based on process status
  const getCharacterImage = () => {
    if (processStatus.stage === ProcessStage.Completed) {
      return "/genie-happy.png"
    } else if (processStatus.stage !== ProcessStage.Idle && currentStep === 4) {
      return "/genie-thinking.png"
    } else {
      return "/genie-normal.png"
    }
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1 cursor-pointer"
          onClick={() => setShowTip(true)}
        >
          <img
            src={getCharacterImage() || "/placeholder.svg"}
            alt="Assistant Character"
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
            <Sparkles size={14} className="text-purple-500" />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-20 w-64 bg-white rounded-xl shadow-lg p-4 z-10"
          >
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="text-purple-500 mt-1" />
              <p className="text-sm text-slate-700">{tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
