"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface JourneyTimelineProps {
  stages: { id: string; title: string; icon: React.ReactNode }[]
  currentStage: number
  processStatus: ProcessStatus
}

export function JourneyTimeline({ stages, currentStage, processStatus }: JourneyTimelineProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-200">
      <h2 className="font-semibold text-lg mb-4 flex items-center text-slate-800">Your Journey</h2>

      <div className="space-y-1">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStage
          const isCurrent = index === currentStage
          const isDisabled = index > currentStage + 1 || (index > 3 && processStatus.stage !== ProcessStage.Completed)

          return (
            <div
              key={stage.id}
              className={cn(
                "w-full px-3 py-2 rounded-md flex items-center text-sm transition-all",
                isCompleted ? "text-purple-700 font-medium" : "text-slate-700",
                isCurrent ? "bg-purple-50" : "hover:bg-slate-50",
                isDisabled ? "opacity-50" : "",
              )}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-medium shrink-0">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <Check size={14} />
                  </motion.div>
                ) : (
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      isCurrent ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700",
                    )}
                  >
                    {stage.icon}
                  </div>
                )}
              </div>
              <span>{stage.title}</span>

              {isCurrent &&
                processStatus.stage !== ProcessStage.Idle &&
                processStatus.stage !== ProcessStage.Completed && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
                  </div>
                )}
            </div>
          )
        })}
      </div>

      {currentStage >= 4 && processStatus.stage === ProcessStage.Completed && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium">
              <Check size={12} className="mr-1" />
              Journey Completed
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
