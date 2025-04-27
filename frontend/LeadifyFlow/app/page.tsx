"use client"

import { useState, useEffect, useRef } from "react"
import { ConversationPanel } from "@/components/conversation-panel"
import { LeadGallery } from "@/components/lead-gallery"
import { MassMessaging } from "@/components/mass-messaging"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Send, RefreshCw, ArrowRight } from "lucide-react"
import { ProgressIndicator } from "@/components/progress-indicator"
import { LeadifyFlowLogo } from "@/components/leadify-flow-logo"
import { ResultsSummary } from "@/components/results-summary"
import {
  ProcessStage,
  type ProcessStatus,
  type Message,
  type EventData,
  type Audience,
  type Goals,
  type Leads,
} from "@/lib/types"
import { mockEventData, mockAudience, mockGoals } from "@/lib/mock-data"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("conversation")
  const [journeyStage, setJourneyStage] = useState(0)
  const [processStatus, setProcessStatus] = useState<ProcessStatus>({
    stage: ProcessStage.Idle,
    progress: 0,
  })
  const [eventData, setEventData] = useState<EventData>(mockEventData)
  const [audience, setAudience] = useState<Audience>(mockAudience)
  const [goals, setGoals] = useState<Goals>(mockGoals)
  const [leads, setLeads] = useState<Leads>({ speakers: [], sponsors: [] })
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showLeads, setShowLeads] = useState(false)

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Start the conversation with an initial greeting after welcome screen is dismissed
  const startConversation = () => {
    setShowWelcome(false)
    addAssistantMessage(
      "Hi there! I'll help you find the perfect speakers and sponsors for your event. Let's start by talking about your event details. What's the name and type of event you're planning?",
      "greeting",
    )
  }

  // Add a user message to the conversation
  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content, type: "text" }])
  }

  // Add an assistant message to the conversation
  const addAssistantMessage = (content: string, type = "text") => {
    setMessages((prev) => [...prev, { role: "assistant", content, type }])
  }

  // Simulate the assistant typing
  const simulateTyping = async (duration = 1500) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, duration))
    setIsTyping(false)
  }

  // Handle sending a message
  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return

    // Add user message to chat
    addUserMessage(message)
    setInputMessage("")

    // Simulate assistant typing
    await simulateTyping()

    // Process the message based on the current journey stage
    processUserMessage(message)
  }

  // Process the user's message based on the current journey stage
  const processUserMessage = async (message: string) => {
    switch (journeyStage) {
      case 0: // Event Details
        // Update event data based on user input
        const updatedEventData = { ...eventData }
        if (!updatedEventData.name || updatedEventData.name === "Future of AI Conference 2025") {
          updatedEventData.name = message.includes("AI") ? message : "Tech Innovation Summit 2025"
        }
        setEventData(updatedEventData)

        // Respond and move to audience stage
        addAssistantMessage(
          "Great! Now I'd like to understand your target audience better. Who will be attending your event? What industries are they from, and what's their level of expertise?",
          "question",
        )
        setJourneyStage(1)
        break

      case 1: // Audience
        // Update audience data based on user input
        const updatedAudience = { ...audience }
        if (updatedAudience.primaryDemographic === "Tech Professionals and Business Leaders") {
          updatedAudience.primaryDemographic = message.includes("tech")
            ? "Technology Professionals"
            : message.includes("business")
              ? "Business Leaders and Decision Makers"
              : "Industry Professionals and Enthusiasts"
        }
        setAudience(updatedAudience)

        // Respond and move to goals stage
        addAssistantMessage(
          "Thanks for sharing that information about your audience. Now, what are your main goals for this event? Are you looking for speakers, sponsors, or both? What topics or expertise are most important?",
          "question",
        )
        setJourneyStage(2)
        break

      case 2: // Goals
        // Update goals based on user input
        const updatedGoals = { ...goals }
        updatedGoals.needSpeakers = message.toLowerCase().includes("speaker")
        updatedGoals.needSponsors = message.toLowerCase().includes("sponsor")
        if (!updatedGoals.needSpeakers && !updatedGoals.needSponsors) {
          updatedGoals.needSpeakers = true
          updatedGoals.needSponsors = true
        }
        setGoals(updatedGoals)

        // Respond and start processing
        addAssistantMessage(
          "Perfect! I have all the information I need to find the ideal speakers and sponsors for your event. I'll start searching now. This will take just a moment...",
          "processing-start",
        )
        setJourneyStage(3)

        // Start the processing animation
        simulateProcessing()
        break

      case 3: // Processing
        // User messages during processing just get a waiting response
        addAssistantMessage(
          "I'm still searching for the best matches for your event. This should be done in just a moment...",
          "processing-update",
        )
        break

      case 4: // Results
        // Handle user questions about results
        if (message.toLowerCase().includes("more") || message.toLowerCase().includes("detail")) {
          addAssistantMessage(
            "I'd be happy to provide more details! You can view comprehensive information about each lead in the 'Leads' tab. Would you like me to explain any specific aspect of the recommendations?",
            "results-detail",
          )
        } else if (message.toLowerCase().includes("export") || message.toLowerCase().includes("download")) {
          addAssistantMessage(
            "You can export your results in several formats from the 'Export' tab. Would you like to export as Excel, CSV, or would you prefer to receive the results via email?",
            "export-info",
          )
        } else if (message.toLowerCase().includes("contact") || message.toLowerCase().includes("message")) {
          addAssistantMessage(
            "Each lead has a pre-written outreach message you can copy directly from their card. Just click the 'Copy Message' button and you'll have a personalized message ready to send!",
            "contact-info",
          )
        } else {
          addAssistantMessage(
            "Is there anything specific about the recommendations you'd like to know more about? Or would you like to start a new search for a different event?",
            "follow-up",
          )
        }
        break

      default:
        addAssistantMessage("I'm here to help with your event lead generation. What would you like to know?", "general")
    }
  }

  // Simulate the processing of finding leads (now uses real orchestrator data)
  const simulateProcessing = async () => {
    setProcessStatus({ stage: ProcessStage.KeywordExtraction, progress: 0 })
    // 1. Get keywords
    const keywordsRes = await fetch("/api/keywords", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_details: eventData }),
    })
    const keywords = await keywordsRes.json()
    setProcessStatus({ stage: ProcessStage.QueryGeneration, progress: 0 })
    // 2. Get queries
    const queriesRes = await fetch("/api/queries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_details: eventData, keywords }),
    })
    const queries = await queriesRes.json()
    setProcessStatus({ stage: ProcessStage.ProfileSearch, progress: 0 })
    // 3. Get profiles
    const linkdRes = await fetch("/api/linkd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries: queries.queries }),
    })
    const profiles = await linkdRes.json()
    setProcessStatus({ stage: ProcessStage.ProfileRanking, progress: 0 })
    // 4. Get ranking
    const rankingRes = await fetch("/api/ranking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profiles: profiles.profiles, event_details: eventData }),
    })
    const ranked = await rankingRes.json()
    setProcessStatus({ stage: ProcessStage.OutreachGeneration, progress: 0 })
    // 5. All leads are treated as speakers for now
    const speakers = ranked.ranked.map((l: any) => ({
      name: l.profile.name || '',
      title: l.profile.title || '',
      company: l.profile.company || '',
      profileImage: l.profile.profile_picture_url || l.profile.profileImage || '/placeholder.svg',
      relevancyScore: (l.score ?? l.relevancyScore ?? 0) * 10, // score as percentage
      expertise: l.profile.expertise || [],
      linkedinUrl: l.profile.linkedin_url || l.profile.linkedinUrl || '',
      draftMessage: l.draftMessage || l.explanation || '',
      description: l.profile.description || '',
      tags: l.profile.tags || [],
      explanation: l.explanation || '',
    }))
    setLeads({ speakers, sponsors: [] })
    setProcessStatus({ stage: ProcessStage.Completed, progress: 100 })
    // Add results message and update journey stage
    await simulateTyping(1000)
    addAssistantMessage(
      `Great news! I've found some excellent matches for your event. I've identified ${speakers.length} potential speakers that align well with your event goals and audience.`,
      "results-summary",
    )

    await simulateTyping(1500)
    addAssistantMessage(
      <ResultsSummary
        speakerCount={speakers.length}
        sponsorCount={0}
        speakerRelevancy={90}
        sponsorRelevancy={0}
        topSpeakerExpertise={["AI Ethics", "Enterprise AI", "Machine Learning"]}
        topSponsorExpertise={[]}
      />,
      "results",
    )

    setJourneyStage(4)
    setShowLeads(true)
  }

  // Reset the entire process
  const resetProcess = () => {
    setProcessStatus({ stage: ProcessStage.Idle, progress: 0 })
    setJourneyStage(0)
    setMessages([])
    setShowLeads(false)
    addAssistantMessage(
      "Let's start fresh! Tell me about the new event you're planning. What's the name and type of event?",
      "greeting",
    )
    toast({
      title: "New search started",
      description: "All previous data has been cleared.",
    })
  }

  // Render the welcome screen if it's the first visit
  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 animated-gradient">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100">
          <div className="p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <LeadifyFlowLogo size="large" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Leadify <span className="text-blue-600">Flow</span>
            </h1>

            <p className="text-slate-500 mb-8 max-w-lg mx-auto">
              Streamline your lead generation with our intuitive, AI-powered platform
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mb-3 mx-auto">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-2">Simple</h3>
                <p className="text-sm text-slate-500">Just chat naturally to find the perfect event leads</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mb-3 mx-auto">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-2">Personalized</h3>
                <p className="text-sm text-slate-500">Get tailored recommendations for your specific event</p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
                <div className="bg-blue-50 rounded-full w-10 h-10 flex items-center justify-center mb-3 mx-auto">
                  <Send className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-slate-800 mb-2">Effortless</h3>
                <p className="text-sm text-slate-500">Save hours of research with AI-powered lead generation</p>
              </div>
            </div>

            <Button onClick={startConversation} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white animated-gradient">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <LeadifyFlowLogo size="medium" showText={false} />
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Leadify <span className="text-blue-600">Flow</span>
                </h1>
                <p className="text-slate-500 mt-1">Seamlessly generate and manage leads for your events</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {showLeads && (
                <Button
                  onClick={resetProcess}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start New Search
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Progress indicator */}
        <ProgressIndicator currentStage={journeyStage} processStatus={processStatus} />

        <div className="space-y-6 mt-6">
          {/* Main content area */}
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <TabsList className="md:w-auto bg-white border border-blue-100">
                  <TabsTrigger
                    value="conversation"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Conversation</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="leads"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                    disabled={!showLeads}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Leads</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="message"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                    disabled={!showLeads}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    <span>Message</span>
                  </TabsTrigger>
                </TabsList>

                {showLeads && activeTab !== "conversation" && (
                  <div className="flex items-center text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-blue-100">
                    <span>
                      {leads.speakers.length + leads.sponsors.length} leads found for {eventData.name}
                    </span>
                  </div>
                )}
              </div>

              <TabsContent value="conversation" className="space-y-4 mt-0">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-blue-100">
                  <ConversationPanel
                    messages={messages}
                    isTyping={isTyping}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    handleSendMessage={handleSendMessage}
                    processStatus={processStatus}
                    messagesEndRef={messagesEndRef}
                  />
                </div>
              </TabsContent>

              <TabsContent value="leads" className="space-y-4 mt-0">
                {showLeads ? (
                  <LeadGallery leads={leads} />
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-blue-100">
                    <p className="text-slate-600 mb-4">Complete the conversation to see your leads.</p>
                    <Button onClick={() => setActiveTab("conversation")} className="bg-blue-600 hover:bg-blue-700">
                      Return to Conversation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="message" className="space-y-4 mt-0">
                {showLeads ? (
                  <MassMessaging leads={leads} eventData={eventData} onReset={resetProcess} />
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-blue-100">
                    <p className="text-slate-600 mb-4">Complete the conversation to message your leads.</p>
                    <Button onClick={() => setActiveTab("conversation")} className="bg-blue-600 hover:bg-blue-700">
                      Return to Conversation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
