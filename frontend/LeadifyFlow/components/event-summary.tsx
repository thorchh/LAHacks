"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, Calendar, Users, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EventData, Audience, Goals } from "@/lib/types"

interface EventSummaryProps {
  eventData: EventData
  audience: Audience
  goals: Goals
}

export function EventSummary({ eventData, audience, goals }: EventSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="bg-rose-600 p-3">
        <h3 className="text-white font-medium flex items-center">
          <Calendar size={16} className="mr-2" />
          Event Summary
        </h3>
      </div>

      <div className="p-3">
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-slate-700">{eventData.name}</h4>
            <p className="text-xs text-slate-500">{eventData.type}</p>
          </div>

          <div className="flex items-center text-xs text-slate-600">
            <Users size={14} className="mr-1" />
            <span>{eventData.expectedAttendance} attendees</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {eventData.topics.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs py-0 px-1.5">
                {topic}
              </Badge>
            ))}
            {eventData.topics.length > 3 && (
              <Badge variant="outline" className="text-xs py-0 px-1.5">
                +{eventData.topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-slate-100 space-y-3"
          >
            <div>
              <h4 className="text-xs font-medium text-slate-700 flex items-center">
                <Target size={12} className="mr-1" />
                Target Audience
              </h4>
              <p className="text-xs text-slate-600 mt-1">{audience.primaryDemographic}</p>
              <p className="text-xs text-slate-500">
                {audience.experienceLevel.charAt(0).toUpperCase() + audience.experienceLevel.slice(1)} level • Ages{" "}
                {audience.ageRange[0]}-{audience.ageRange[1]}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-slate-700">Key Objectives</h4>
              <ul className="text-xs text-slate-600 mt-1 space-y-1">
                {goals.keyObjectives.slice(0, 2).map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
                {goals.keyObjectives.length > 2 && (
                  <li className="text-xs text-slate-500">+{goals.keyObjectives.length - 2} more objectives</li>
                )}
              </ul>
            </div>
          </motion.div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-1 h-auto"
        >
          {isExpanded ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      </div>
    </motion.div>
  )
}
