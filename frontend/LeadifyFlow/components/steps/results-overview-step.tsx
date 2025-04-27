"use client"

import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Users, DollarSign, CheckCircle, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Lead } from "@/lib/types"

interface ResultsOverviewStepProps {
  leads: {
    speakers: Lead[]
    sponsors: Lead[]
  }
  onNext: () => void
  onPrev: () => void
}

export function ResultsOverviewStep({ leads, onNext, onPrev }: ResultsOverviewStepProps) {
  // Calculate average relevancy scores
  const speakerAvgScore = leads.speakers.reduce((acc, lead) => acc + lead.relevancyScore, 0) / leads.speakers.length
  const sponsorAvgScore = leads.sponsors.reduce((acc, lead) => acc + lead.relevancyScore, 0) / leads.sponsors.length

  // Get top expertise areas
  const getAllExpertise = (leads: Lead[]) => {
    const expertiseCount: Record<string, number> = {}
    leads.forEach((lead) => {
      lead.expertise.forEach((skill) => {
        expertiseCount[skill] = (expertiseCount[skill] || 0) + 1
      })
    })
    return Object.entries(expertiseCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill)
  }

  const topSpeakerExpertise = getAllExpertise(leads.speakers)
  const topSponsorExpertise = getAllExpertise(leads.sponsors)

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 text-green-700 rounded-full p-3">
            <CheckCircle size={30} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Your Results Are Ready!</h2>
        <p className="text-slate-600 text-center mb-6">
          We've found {leads.speakers.length + leads.sponsors.length} potential matches for your event. Here's an
          overview of what we found.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
            <div className="flex items-center text-white">
              <Users size={20} className="mr-2" />
              <h3 className="font-semibold">Speaker Recommendations</h3>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Found</span>
                <span className="font-semibold text-lg">{leads.speakers.length} Speakers</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Relevancy</span>
                  <span className="font-semibold">{speakerAvgScore.toFixed(1)}%</span>
                </div>
                <Progress value={speakerAvgScore} className="h-2" />
              </div>

              <div className="space-y-1">
                <span className="text-sm text-slate-600">Top Expertise Areas</span>
                <div className="grid grid-cols-1 gap-2">
                  {topSpeakerExpertise.map((expertise, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm">{expertise}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => onNext()} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                View Speaker Details
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4">
            <div className="flex items-center text-white">
              <DollarSign size={20} className="mr-2" />
              <h3 className="font-semibold">Sponsor Recommendations</h3>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Found</span>
                <span className="font-semibold text-lg">{leads.sponsors.length} Sponsors</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Average Relevancy</span>
                  <span className="font-semibold">{sponsorAvgScore.toFixed(1)}%</span>
                </div>
                <Progress value={sponsorAvgScore} className="h-2" />
              </div>

              <div className="space-y-1">
                <span className="text-sm text-slate-600">Top Industry Focus</span>
                <div className="grid grid-cols-1 gap-2">
                  {topSponsorExpertise.map((expertise, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">{expertise}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={() => onNext()} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Sponsor Details
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BarChart3 size={20} className="text-purple-500 mr-2" />
              <h3 className="font-semibold">Match Quality Overview</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Excellent Matches (90%+)</span>
                    <span className="font-medium">
                      {leads.speakers.concat(leads.sponsors).filter((lead) => lead.relevancyScore >= 90).length}
                    </span>
                  </div>
                  <Progress
                    value={
                      (leads.speakers.concat(leads.sponsors).filter((lead) => lead.relevancyScore >= 90).length /
                        (leads.speakers.length + leads.sponsors.length)) *
                      100
                    }
                    className="h-2 bg-slate-200"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Good Matches (80-89%)</span>
                    <span className="font-medium">
                      {
                        leads.speakers
                          .concat(leads.sponsors)
                          .filter((lead) => lead.relevancyScore >= 80 && lead.relevancyScore < 90).length
                      }
                    </span>
                  </div>
                  <Progress
                    value={
                      (leads.speakers
                        .concat(leads.sponsors)
                        .filter((lead) => lead.relevancyScore >= 80 && lead.relevancyScore < 90).length /
                        (leads.speakers.length + leads.sponsors.length)) *
                      100
                    }
                    className="h-2 bg-slate-200"
                  />
                </div>
              </div>

              <p className="text-sm text-slate-600">
                We've prepared personalized outreach messages for each recommendation to help you connect with potential
                speakers and sponsors.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex justify-between mt-8"
      >
        <Button onClick={onPrev} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          Explore Speaker Recommendations
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  )
}
