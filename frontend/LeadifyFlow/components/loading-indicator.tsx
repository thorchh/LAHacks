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
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-right text-slate-500">{progress}% complete</p>
    </div>
  )
}
