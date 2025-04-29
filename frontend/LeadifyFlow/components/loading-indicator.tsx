import { ProcessStage } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search, Database, BarChart4, CheckCircle2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface LoadingIndicatorProps {
  stage: ProcessStage
  progress: number
}

export function LoadingIndicator({ stage, progress }: LoadingIndicatorProps) {
  // Animated progress bar that loops a gradient until complete
  const [animatedProgress, setAnimatedProgress] = useState(progress)
  const [stripeOffset, setStripeOffset] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (progress >= 100) {
      setAnimatedProgress(100)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    setAnimatedProgress(progress)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setStripeOffset((prev) => (prev + 4) % 100)
    }, 30)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [progress])

  const getStageInfo = () => {
    switch (stage) {
      case ProcessStage.KeywordExtraction:
        return {
          icon: <Loader2 className="animate-spin mr-2" size={18} />,
          title: "Extracting Keywords",
          description: "Analyzing your event information to extract relevant keywords...",
        }
      case ProcessStage.QueryGeneration:
        return {
          icon: <Database className="animate-pulse mr-2" size={18} />,
          title: "Generating Search Queries",
          description: "Creating optimized search queries based on your event keywords...",
        }
      case ProcessStage.ProfileSearch:
        return {
          icon: <Search className="animate-bounce mr-2" size={18} />,
          title: "Searching for Profiles",
          description: "Finding potential speakers and sponsors on LinkedIn...",
        }
      case ProcessStage.ProfileRanking:
        return {
          icon: <BarChart4 className="animate-pulse mr-2" size={18} />,
          title: "Ranking Profiles",
          description: "Evaluating and ranking the most relevant leads for your event...",
        }
      case ProcessStage.OutreachGeneration:
        return {
          icon: <Loader2 className="animate-spin mr-2" size={18} />,
          title: "Generating Outreach",
          description: "Creating personalized outreach messages for top leads...",
        }
      case ProcessStage.Completed:
        return {
          icon: <CheckCircle2 className="mr-2 text-green-500" size={18} />,
          title: "Processing Complete",
          description: "Your results are ready!",
        }
      default:
        return {
          icon: <Loader2 className="animate-spin mr-2" size={18} />,
          title: "Processing",
          description: "Working on your request...",
        }
    }
  }
  const { icon, title, description } = getStageInfo()
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm text-slate-600">{description}</p>
      <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${animatedProgress}%`,
            background: progress < 100
              ? `repeating-linear-gradient(90deg, #3b82f6 0 20px, #2563eb 20px 40px)`
              : '#22c55e',
            backgroundPosition: progress < 100 ? `${stripeOffset}px 0` : undefined,
            transition: progress >= 100 ? 'background 0.5s, width 0.5s' : 'width 0.2s',
          }}
        />
      </div>
      <p className="text-xs text-right text-slate-500">{Math.round(animatedProgress)}% complete</p>
    </div>
  )
}
