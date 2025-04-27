"use client"

import { motion } from "framer-motion"
import { Loader2, CheckCircle2 } from "lucide-react"
import { ProcessStage, type ProcessStatus } from "@/lib/types"

interface ProcessVisualizerProps {
  processStatus: ProcessStatus
}

export function ProcessVisualizer({ processStatus }: ProcessVisualizerProps) {
  const getStageInfo = () => {
    switch (processStatus.stage) {
      case ProcessStage.KeywordExtraction:
        return {
          icon: <KeywordExtractionAnimation />,
          title: "Extracting Keywords",
          description: "Analyzing your event information to extract relevant keywords...",
          color: "text-blue-600",
        }
      case ProcessStage.QueryGeneration:
        return {
          icon: <QueryGenerationAnimation />,
          title: "Generating Search Queries",
          description: "Creating optimized search queries based on your event keywords...",
          color: "text-blue-600",
        }
      case ProcessStage.ProfileSearch:
        return {
          icon: <ProfileSearchAnimation />,
          title: "Searching for Profiles",
          description: "Finding potential speakers and sponsors on LinkedIn...",
          color: "text-blue-600",
        }
      case ProcessStage.ProfileRanking:
        return {
          icon: <ProfileRankingAnimation />,
          title: "Ranking Profiles",
          description: "Evaluating and ranking the most relevant leads for your event...",
          color: "text-blue-600",
        }
      case ProcessStage.OutreachGeneration:
        return {
          icon: <OutreachGenerationAnimation />,
          title: "Generating Outreach",
          description: "Creating personalized outreach messages for top leads...",
          color: "text-blue-600",
        }
      case ProcessStage.Completed:
        return {
          icon: <CompletedAnimation />,
          title: "Processing Complete",
          description: "Your results are ready!",
          color: "text-green-600",
        }
      default:
        return {
          icon: <Loader2 className="animate-spin" size={24} />,
          title: "Processing",
          description: "Working on your request...",
          color: "text-blue-600",
        }
    }
  }

  const { icon, title, description, color } = getStageInfo()

  // Calculate overall progress across all stages
  const calculateOverallProgress = () => {
    const stages = [
      ProcessStage.KeywordExtraction,
      ProcessStage.QueryGeneration,
      ProcessStage.ProfileSearch,
      ProcessStage.ProfileRanking,
      ProcessStage.OutreachGeneration,
    ]

    const currentStageIndex = stages.indexOf(processStatus.stage)
    if (currentStageIndex === -1) return 0

    const stageProgress = processStatus.progress / 100
    return Math.min(100, Math.round(((currentStageIndex + stageProgress) / stages.length) * 100))
  }

  const overallProgress = calculateOverallProgress()

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <div className={`mr-3 ${color}`}>{icon}</div>
        <div>
          <span className="font-medium">{title}</span>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${processStatus.progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-2 bg-blue-500 rounded-full"
          >
            <motion.div
              className="h-full w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Stage: {processStatus.progress}%</span>
          <span>Overall: {overallProgress}%</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1">
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
            <motion.div
              key={stage}
              initial={{ scale: 0.9 }}
              animate={{
                scale: isActive ? 1.05 : 1,
                backgroundColor: isActive
                  ? ["#dbeafe", "#bfdbfe", "#93c5fd", "#bfdbfe", "#dbeafe"]
                  : isCompleted
                    ? "#d1fae5"
                    : "#f1f5f9",
              }}
              transition={{
                duration: isActive ? 2 : 0.3,
                repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                repeatType: "reverse",
              }}
              className={`text-center p-1 rounded ${
                isActive ? "text-blue-700" : isCompleted ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}
            >
              <div className="text-xs font-medium truncate">
                {index === 0 && "Keywords"}
                {index === 1 && "Queries"}
                {index === 2 && "Search"}
                {index === 3 && "Ranking"}
                {index === 4 && "Outreach"}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Custom animations for each stage
function KeywordExtractionAnimation() {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-100"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ rotate: 0 }}>
        <motion.div
          className="w-6 h-6 border-2 border-blue-500 rounded-md"
          animate={{
            borderWidth: ["2px", "3px", "2px"],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        {/* Animated keywords appearing */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-500 rounded-full"
            style={{
              width: 2,
              height: 2,
              left: `${50 + (i - 1) * 15}%`,
              top: `${50 + (i % 2 === 0 ? -1 : 1) * 15}%`,
            }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 1, 0.8],
            }}
            transition={{
              delay: i * 0.3,
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function QueryGenerationAnimation() {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute inset-0 rounded-full bg-indigo-100"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="absolute w-6 h-6 rounded-md border-2 border-indigo-500 flex items-center justify-center overflow-hidden">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-0.5 bg-indigo-500"
              initial={{ y: -10 }}
              animate={{
                y: [i * 3 - 4, i * 3, 10],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
        <motion.div
          className="absolute right-1 top-1 w-2 h-2 bg-indigo-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  )
}

function ProfileSearchAnimation() {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-100"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute w-5 h-5 border-2 border-cyan-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            scale: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          }}
        />
        {/* Profile icons appearing */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-500 rounded-full flex items-center justify-center"
            style={{
              width: 4,
              height: 4,
              left: `${50 + (i - 1) * 20}%`,
              top: `${50 + (i % 2 === 0 ? -1 : 1) * 20}%`,
            }}
            animate={{
              scale: [0, 1, 0.8],
              opacity: [0, 1, 0.8],
            }}
            transition={{
              delay: i * 0.4,
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function ProfileRankingAnimation() {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute inset-0 rounded-full bg-amber-100"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-amber-500 rounded-sm w-1.5"
            style={{
              height: (i + 1) * 3 + 2,
              left: `${i * 33 + 25}%`,
              bottom: "35%",
            }}
            initial={{ y: 10, opacity: 0 }}
            animate={{
              y: [10, 0, 0],
              opacity: [0, 1, 1],
              height: [(i + 1) * 3 + 2, (i + 1) * 3 + 2 + Math.random() * 4, (i + 1) * 3 + 2],
            }}
            transition={{
              delay: i * 0.2,
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute w-6 h-0.5 bg-amber-500 bottom-[35%]"
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
      </div>
    </div>
  )
}

function OutreachGenerationAnimation() {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-100"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div className="absolute inset-0 flex items-center justify-center">
        <motion.div className="absolute w-6 h-7 border-2 border-emerald-500 rounded-md" />
        {/* Message lines appearing */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-emerald-500 rounded-sm"
            style={{
              height: 1,
              width: i === 2 ? 2 : 4,
              left: "40%",
              top: `${i * 25 + 30}%`,
            }}
            animate={{
              width: i === 2 ? [2, 3, 2] : [4, 5, 4],
              x: [0, 1, 0],
            }}
            transition={{
              delay: i * 0.3,
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute right-2 bottom-2 w-2.5 h-2.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <motion.div
            className="w-full h-full border-2 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-transparent rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

function CompletedAnimation() {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute inset-0 rounded-full bg-green-100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
        >
          <CheckCircle2 className="text-green-600" size={24} />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-500"
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  )
}
