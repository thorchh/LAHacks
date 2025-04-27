"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeadCard } from "@/components/lead-card"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { type ProcessStatus, ProcessStage, type Lead } from "@/lib/types"
import { Mic, DollarSign } from "lucide-react"

interface LeadResultsProps {
  leads: {
    speakers: Lead[]
    sponsors: Lead[]
  }
  processStatus: ProcessStatus
}

export function LeadResults({ leads, processStatus }: LeadResultsProps) {
  const [activeTab, setActiveTab] = useState<string>("speakers")

  const isLoading = processStatus.stage !== ProcessStage.Completed && processStatus.stage !== ProcessStage.Idle

  if (isLoading) {
    return (
      <Card className="w-full p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingIndicator stage={processStatus.stage} progress={processStatus.progress} />
        </div>
      </Card>
    )
  }

  if (processStatus.stage === ProcessStage.Idle) {
    return (
      <Card className="w-full p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h3 className="text-xl font-medium text-slate-800">No Results Yet</h3>
          <p className="text-slate-600">Start a conversation to generate leads for your event.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Lead Generation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="speakers" className="flex items-center gap-2">
                <Mic size={18} />
                <span>Speakers ({leads.speakers.length})</span>
              </TabsTrigger>
              <TabsTrigger value="sponsors" className="flex items-center gap-2">
                <DollarSign size={18} />
                <span>Sponsors ({leads.sponsors.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="speakers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.speakers.map((lead, index) => (
                  <LeadCard key={index} lead={lead} type="speaker" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sponsors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.sponsors.map((lead, index) => (
                  <LeadCard key={index} lead={lead} type="sponsor" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
