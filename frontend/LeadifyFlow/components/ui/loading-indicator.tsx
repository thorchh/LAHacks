import { ProcessStage } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { Loader2, Search, Database, BarChart4, CheckCircle2 } from "lucide-react"

interface LoadingIndicatorProps {
  stage: ProcessStage
  progress: number
}

export function LoadingIndicator({ stage, progress }: LoadingIndicatorProps) {
  const getStageInfo = () => {
    switch (stage) {
      case ProcessStage.EventIntake:
        return {
          icon: <Loader2 className="animate-spin mr-2" size={18} />,
          title: "Processing Event Details",
          description: "Analyzing your event information...",
        }
      case ProcessStage.QueryGeneration:
        return {
          icon: <Database className="animate-pulse mr-2" size={18} />,
          title: "Generating Search Queries",
          description: "Creating optimized search queries based on your event...",
        }
      case ProcessStage.Searching:
        return {
          icon: <Search className="animate-bounce mr-2" size={18} />,
          title: "Searching for Leads",
          description: "Finding potential speakers and sponsors on LinkedIn...",
        }
      case ProcessStage.Ranking:
        return {
          icon: <BarChart4 className="animate-pulse mr-2" size={18} />,
          title: "Ranking Results",
          description: "Evaluating and ranking the most relevant leads...",
        }
      case ProcessStage.Finalizing:
        return {
          icon: <Loader2 className="animate-spin mr-2" size={18} />,
          title: "Finalizing Results",
          description: "Preparing personalized outreach messages...",
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
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-right text-slate-500">{progress}% complete</p>
    </div>
  )
}
