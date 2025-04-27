import type React from "react"
export enum ProcessStage {
  Idle = "idle",
  KeywordExtraction = "keyword_extraction",
  QueryGeneration = "query_generation",
  ProfileSearch = "profile_search",
  ProfileRanking = "profile_ranking",
  OutreachGeneration = "outreach_generation",
  Completed = "completed",
}

export interface ProcessStatus {
  stage: ProcessStage
  progress: number
}

export interface EventData {
  name: string
  date: string
  time: string
  location: string
  type: string
  expectedAttendance: number
  topics: string[]
  description: string
}

export interface Audience {
  primaryDemographic: string
  ageRange: [number, number]
  experienceLevel: string
  interests: Record<string, boolean>
  newInterest: string
  industryFocus: string
  geographicFocus: string
  additionalNotes: string
}

export interface Goals {
  keyObjectives: string[]
  newObjective: string
  needSpeakers: boolean
  needSponsors: boolean
  needPanelists: boolean
  needExhibitors: boolean
  speakerRequirements: string
  sponsorRequirements: string
  budget: string
}

export interface Lead {
  name: string
  title: string
  company: string
  profileImage: string
  relevancyScore: number
  expertise: string[]
  linkedinUrl: string
  draftMessage: string
  description?: string
  tags?: string[]
}

export interface Message {
  role: "user" | "assistant"
  content: string | React.ReactNode
  type: string
}

export interface Leads {
  speakers: Lead[]
  sponsors: Lead[]
}
