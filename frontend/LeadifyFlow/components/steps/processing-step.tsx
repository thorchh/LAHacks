"use client"

import { motion } from "framer-motion"
import { Loader2, Search, Database, BarChart4, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface ProcessingStepProps {
  processStatus: ProcessStatus
}

export function ProcessingStep({ processStatus }: ProcessingStepProps) {
  const getStageInfo = () => {
    switch (processStatus.stage) {
      case ProcessStage.EventIntake:
        return {
          icon: <Loader2 className="animate-spin" size={24} />,
          title: "Processing Event Details",
          description: "Analyzing your event information to understand the context and requirements...",
          color: "text-purple-600",
        }
      case ProcessStage.QueryGeneration:
        return {
          icon: <Database className="animate-pulse" size={24} />,
          title: "Generating Search Queries",
          description: "Creating optimized search queries based on your event details, audience, and goals...",
          color: "text-blue-600",
        }
      case ProcessStage.Searching:
        return {
          icon: <Search className="animate-bounce" size={24} />,
          title: "Searching for Leads",
          description: "Finding potential speakers and sponsors that match your criteria...",
          color: "text-indigo-600",
        }
      case ProcessStage.Ranking:
        return {
          icon: <BarChart4 className="animate-pulse" size={24} />,
          title: "Ranking Results",
          description: "Evaluating and ranking the most relevant leads based on your specific needs...",
          color: "text-cyan-600",
        }
      case ProcessStage.Finalizing:
        return {
          icon: <Loader2 className="animate-spin" size={24} />,
          title: "Finalizing Results",
          description: "Preparing personalized outreach messages and finalizing recommendations...",
          color: "text-teal-600",
        }
      case ProcessStage.Completed:
        return {
          icon: <CheckCircle2 size={24} />,
          title: "Processing Complete",
          description: "Your results are ready!",
          color: "text-green-600",
        }
      default:
        return {
          icon: <Loader2 className="animate-spin" size={24} />,
          title: "Processing",
          description: "Working on your request...",
          color: "text-purple-600",
        }
    }
  }

  const { icon, title, description, color } = getStageInfo()

  // Calculate overall progress across all stages
  const calculateOverallProgress = () => {
    const stages = [
      ProcessStage.EventIntake,
      ProcessStage.QueryGeneration,
      ProcessStage.Searching,
      ProcessStage.Ranking,
      ProcessStage.Finalizing,
    ]

    const currentStageIndex = stages.indexOf(processStatus.stage)
    if (currentStageIndex === -1) return 0

    const stageProgress = processStatus.progress / 100
    return Math.min(100, Math.round(((currentStageIndex + stageProgress) / stages.length) * 100))
  }

  const overallProgress = calculateOverallProgress()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className={`p-4 rounded-full bg-slate-100 ${color}`}>{icon}</div>

              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
                <p className="text-slate-600">{description}</p>
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Current Stage: {processStatus.progress}%</span>
                  <span>Overall: {overallProgress}%</span>
                </div>
                <Progress value={processStatus.progress} className="h-2" />
                <Progress value={overallProgress} className="h-1 mt-1" />
              </div>

              <div className="grid grid-cols-5 gap-2 w-full mt-6">
                {[
                  ProcessStage.EventIntake,
                  ProcessStage.QueryGeneration,
                  ProcessStage.Searching,
                  ProcessStage.Ranking,
                  ProcessStage.Finalizing,
                ].map((stage, index) => {
                  const isActive = processStatus.stage === stage
                  const isCompleted =
                    [
                      ProcessStage.EventIntake,
                      ProcessStage.QueryGeneration,
                      ProcessStage.Searching,
                      ProcessStage.Ranking,
                      ProcessStage.Finalizing,
                    ].indexOf(processStatus.stage) >
                    [
                      ProcessStage.EventIntake,
                      ProcessStage.QueryGeneration,
                      ProcessStage.Searching,
                      ProcessStage.Ranking,
                      ProcessStage.Finalizing,
                    ].indexOf(stage)

                  return (
                    <div
                      key={stage}
                      className={`text-center p-2 rounded-lg ${
                        isActive
                          ? "bg-purple-100 text-purple-700"
                          : isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {index === 0 && "Details"}
                        {index === 1 && "Queries"}
                        {index === 2 && "Search"}
                        {index === 3 && "Rank"}
                        {index === 4 && "Finalize"}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-sm text-slate-500 italic mt-4">
                This may take a few moments as we search for the best matches for your event.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
