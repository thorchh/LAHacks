"use client"

import { motion } from "framer-motion"
import { Check, MessageSquare, Users, Target, Search, CheckCircle } from "lucide-react"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface ProgressIndicatorProps {
  currentStage: number
  processStatus: ProcessStatus
}

export function ProgressIndicator({ currentStage, processStatus }: ProgressIndicatorProps) {
  const stages = [
    { id: "event-details", title: "Event Details", icon: <MessageSquare size={16} /> },
    { id: "audience", title: "Audience", icon: <Users size={16} /> },
    { id: "goals", title: "Goals", icon: <Target size={16} /> },
    { id: "processing", title: "Processing", icon: <Search size={16} /> },
    { id: "results", title: "Results", icon: <CheckCircle size={16} /> },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
      <h3 className="font-medium text-slate-700 mb-4 flex items-center">
        <div className="mr-2 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
        </div>
        Leadify Flow Progress
      </h3>
      <div className="relative">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 absolute top-5 left-0 right-0 z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(Math.min(currentStage, stages.length - 1) / (stages.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-1 bg-blue-500"
          ></motion.div>
        </div>

        {/* Stage circles */}
        <div className="flex justify-between relative z-10">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStage
            const isCurrent = index === currentStage
            const isDisabled = index > currentStage + 1 || (index > 3 && processStatus.stage !== ProcessStage.Completed)

            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div className="mb-2 relative">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center"
                    >
                      <Check size={18} />
                    </motion.div>
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCurrent
                          ? "bg-blue-500 text-white ring-4 ring-blue-100"
                          : isDisabled
                            ? "bg-slate-200 text-slate-400"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {stage.icon}
                    </div>
                  )}

                  {isCurrent &&
                    processStatus.stage !== ProcessStage.Idle &&
                    processStatus.stage !== ProcessStage.Completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                        className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-blue-500"
                      />
                    )}
                </div>

                <span
                  className={`text-xs font-medium mt-1 text-center max-w-[80px] ${
                    isCurrent ? "text-blue-700" : isCompleted ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  {stage.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Progress indicator for current stage */}
        {processStatus.stage !== ProcessStage.Idle && processStatus.stage !== ProcessStage.Completed && (
          <div className="mt-4 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500">Processing: {processStatus.stage.replace("_", " ")}</span>
              <span className="text-blue-600 font-medium">{processStatus.progress}%</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${processStatus.progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-1 bg-blue-500"
              ></motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
