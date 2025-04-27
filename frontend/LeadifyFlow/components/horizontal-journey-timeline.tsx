"use client"

import type React from "react"
import { Zap, MessageSquare, Users, Target, Search, CheckCircle } from "lucide-react"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface HorizontalJourneyTimelineProps {
  stages: { id: string; title: string; icon: React.ReactNode }[]
  currentStage: number
  processStatus: ProcessStatus
}

export function HorizontalJourneyTimeline({ stages, currentStage, processStatus }: HorizontalJourneyTimelineProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-slate-800 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-rose-500" />
          Your Journey
        </h2>

        {currentStage >= 4 && processStatus.stage === ProcessStage.Completed && (
          <div className="inline-flex items-center justify-center bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-medium">
            <CheckCircle size={12} className="mr-1" />
            Journey Completed
          </div>
        )}
      </div>

      <div className="relative">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 absolute top-5 left-0 right-0 z-0">
          <div
            className="h-1 bg-rose-500 transition-all duration-500"
            style={{ width: `${(Math.min(currentStage, stages.length - 1) / (stages.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Stage circles */}
        {/* <div className="flex justify-between relative z-10">
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
                      className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center"
                    >
                      <Check size={18} />
                    </motion.div>
                  ) : (
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        isCurrent
                          ? "bg-rose-500 text-white ring-4 ring-rose-100"
                          : isDisabled
                            ? "bg-slate-200 text-slate-400"
                            : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {getStageIcon(stage.id, isCurrent)}
                    </div>
                  )}

                  {isCurrent &&
                    processStatus.stage !== ProcessStage.Idle &&
                    processStatus.stage !== ProcessStage.Completed && (
                      <div className="absolute -right-1 -top-1">
                        <div className="w-4 h-4 rounded-full bg-rose-500 animate-ping opacity-75"></div>
                      </div>
                    )}
                </div>

                <span
                  className={cn(
                    "text-xs font-medium mt-1 text-center max-w-[80px]",
                    isCurrent ? "text-rose-700" : isCompleted ? "text-rose-600" : "text-slate-500",
                  )}
                >
                  {stage.title}
                </span>
              </div>
            )
          })}
        </div> */}

        <div className="grid grid-cols-5 gap-1 relative z-10">
          {[
            ProcessStage.KeywordExtraction,
            ProcessStage.QueryGeneration,
            ProcessStage.ProfileSearch,
            ProcessStage.ProfileRanking,
            ProcessStage.OutreachGeneration,
          ].map((stage, index) => {
            const isActive = processStatus.stage === stage
            const isCompleted =
              [
                ProcessStage.KeywordExtraction,
                ProcessStage.QueryGeneration,
                ProcessStage.ProfileSearch,
                ProcessStage.ProfileRanking,
                ProcessStage.OutreachGeneration,
              ].indexOf(processStatus.stage) >
              [
                ProcessStage.KeywordExtraction,
                ProcessStage.QueryGeneration,
                ProcessStage.ProfileSearch,
                ProcessStage.ProfileRanking,
                ProcessStage.OutreachGeneration,
              ].indexOf(stage)

            return (
              <div
                key={stage}
                className={`text-center p-1 rounded-lg ${
                  isActive
                    ? "bg-purple-100 text-purple-700"
                    : isCompleted
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                <div className="text-xs font-medium">
                  {index === 0 && "Keywords"}
                  {index === 1 && "Queries"}
                  {index === 2 && "Search"}
                  {index === 3 && "Ranking"}
                  {index === 4 && "Outreach"}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress indicator for current stage */}
        {processStatus.stage !== ProcessStage.Idle && processStatus.stage !== ProcessStage.Completed && (
          <div className="mt-4 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500">Processing: {processStatus.stage}</span>
              <span className="text-rose-600 font-medium">{processStatus.progress}%</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-1 bg-rose-500 transition-all duration-300"
                style={{ width: `${processStatus.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getStageIcon(stageId: string, isCurrent: boolean) {
  const size = 16
  const className = "text-current"

  switch (stageId) {
    case "welcome":
      return <MessageSquare size={size} className={className} />
    case "event-details":
      return <Target size={size} className={className} />
    case "audience":
      return <Users size={size} className={className} />
    case "goals":
      return <Target size={size} className={className} />
    case "processing":
      return <Search size={size} className={isCurrent ? "animate-pulse" : className} />
    case "results":
      return <CheckCircle size={size} className={className} />
    default:
      return <MessageSquare size={size} className={className} />
  }
}
