"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  CheckSquare,
  Edit,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle,
  Search,
  MessageSquare,
  AlertCircle,
  PencilLine,
} from "lucide-react"
import type { Lead, EventData } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MassMessagingProps {
  leads: {
    speakers: Lead[]
    sponsors: Lead[]
  }
  eventData: EventData
  onReset: () => void
}

export function MassMessaging({ leads, eventData, onReset }: MassMessagingProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedLeads, setSelectedLeads] = useState<Record<string, boolean>>({})
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({})
  const [editingLead, setEditingLead] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [sentCount, setSentCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [showPlaceholderInfo, setShowPlaceholderInfo] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "speakers" | "sponsors">("all")

  // Get selected leads count
  const selectedCount = Object.values(selectedLeads).filter(Boolean).length

  // Get all leads
  const allLeads = [...leads.speakers, ...leads.sponsors]

  // Filter leads based on search query and active tab
  const filteredLeads = allLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "speakers" && leads.speakers.includes(lead)) ||
      (activeTab === "sponsors" && leads.sponsors.includes(lead))

    return matchesSearch && matchesTab
  })

  // Toggle lead selection
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads({
      ...selectedLeads,
      [leadId]: !selectedLeads[leadId],
    })
  }

  // Select/deselect all leads
  const toggleSelectAll = (type: "speakers" | "sponsors" | "all" | "filtered") => {
    const newSelectedLeads = { ...selectedLeads }

    if (type === "filtered") {
      const allFilteredSelected = filteredLeads.every((lead) => selectedLeads[lead.name])

      filteredLeads.forEach((lead) => {
        newSelectedLeads[lead.name] = !allFilteredSelected
      })
    } else if (type === "all") {
      const allSelected = allLeads.every((lead) => selectedLeads[lead.name])

      allLeads.forEach((lead) => {
        newSelectedLeads[lead.name] = !allSelected
      })
    } else {
      const allOfTypeSelected = leads[type].every((lead) => selectedLeads[lead.name])

      leads[type].forEach((lead) => {
        newSelectedLeads[lead.name] = !allOfTypeSelected
      })
    }

    setSelectedLeads(newSelectedLeads)
  }

  // Initialize custom messages with AI-generated drafts
  useEffect(() => {
    const initialMessages: Record<string, string> = {}

    allLeads.forEach((lead) => {
      initialMessages[lead.name] = lead.draftMessage
    })

    setCustomMessages(initialMessages)
  }, [leads])

  // Update a custom message for a specific lead
  const updateCustomMessage = (leadName: string, message: string) => {
    setCustomMessages({
      ...customMessages,
      [leadName]: message,
    })
  }

  // Get a preview of all personalized messages
  const getPreview = () => {
    const selectedLeadObjects = allLeads.filter((lead) => selectedLeads[lead.name])

    if (selectedLeadObjects.length === 0) {
      return [
        {
          lead: { name: "No leads selected", company: "" } as Lead,
          message: "Please select at least one lead to message.",
        },
      ]
    }

    return selectedLeadObjects.map((lead) => ({
      lead,
      message: customMessages[lead.name] || lead.draftMessage,
    }))
  }

  // Send messages
  const sendMessages = () => {
    if (selectedCount === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to message.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    setSentCount(0)

    // Simulate sending messages with a progress indicator
    const totalToSend = selectedCount
    let sent = 0

    const sendInterval = setInterval(() => {
      sent++
      setSentCount(sent)

      if (sent >= totalToSend) {
        clearInterval(sendInterval)
        setIsSending(false)
        toast({
          title: "Messages sent successfully",
          description: `Sent personalized messages to ${totalToSend} lead${totalToSend > 1 ? "s" : ""}.`,
        })

        // Reset selections after successful send
        setSelectedLeads({})
        setStep(1)
      }
    }, 300)
  }

  // Navigation between steps
  const nextStep = () => {
    if (step === 1) {
      if (selectedCount === 0) {
        toast({
          title: "No leads selected",
          description: "Please select at least one lead to continue.",
          variant: "destructive",
        })
        return
      }
    }

    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-slate-800">Mass Messaging</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Step {step} of 3
          </Badge>
        </div>

        <div className="relative pt-4">
          <div className="w-full bg-slate-100 h-2 rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 flow-line"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="flex justify-between mt-2">
            <div className={`flex flex-col items-center ${step >= 1 ? "text-teal-600" : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}
              >
                <CheckSquare size={16} />
              </div>
              <span className="text-xs mt-1">Select</span>
            </div>

            <div className={`flex flex-col items-center ${step >= 2 ? "text-teal-600" : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"}`}
              >
                <Edit size={16} />
              </div>
              <span className="text-xs mt-1">Review</span>
            </div>

            <div className={`flex flex-col items-center ${step >= 3 ? "text-teal-600" : "text-slate-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400"}`}
              >
                <Send size={16} />
              </div>
              <span className="text-xs mt-1">Send</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-blue-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-1">Select Recipients</h3>
                      <p className="text-sm text-slate-500">Choose which leads you want to message</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {selectedCount} selected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSelectAll("filtered")}
                        className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                      >
                        {filteredLeads.every((lead) => selectedLeads[lead.name]) ? "Deselect All" : "Select All"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                      <Input
                        placeholder="Search leads by name, title, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-slate-200"
                      />
                    </div>

                    <Tabs
                      value={activeTab}
                      onValueChange={(value) => setActiveTab(value as any)}
                      className="w-full md:w-auto"
                    >
                      <TabsList className="bg-white border border-blue-100">
                        <TabsTrigger
                          value="all"
                          className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                        >
                          All
                        </TabsTrigger>
                        <TabsTrigger
                          value="speakers"
                          className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                        >
                          Speakers
                        </TabsTrigger>
                        <TabsTrigger
                          value="sponsors"
                          className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                        >
                          Sponsors
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                    <div className="flex items-center">
                      <Info size={16} className="text-blue-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        Each lead has a personalized AI-generated message draft. You'll be able to review and edit these
                        in the next step.
                      </p>
                    </div>
                  </div>

                  {/* Leads list */}
                  {filteredLeads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredLeads.map((lead) => {
                        const isLeadSpeaker = leads.speakers.includes(lead)
                        return (
                          <div
                            key={lead.name}
                            className={`flex items-center space-x-3 p-3 rounded-md border transition-colors ${
                              selectedLeads[lead.name]
                                ? "border-teal-300 bg-teal-50"
                                : "border-slate-200 bg-white hover:border-teal-200"
                            }`}
                            onClick={() => toggleLeadSelection(lead.name)}
                          >
                            <Checkbox
                              id={`lead-${lead.name}`}
                              checked={selectedLeads[lead.name] || false}
                              onCheckedChange={() => toggleLeadSelection(lead.name)}
                              className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                            />
                            <Avatar className="h-8 w-8 border border-slate-200">
                              <AvatarImage src={lead.profileImage || "/placeholder.svg"} alt={lead.name} />
                              <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <Label htmlFor={`lead-${lead.name}`} className="font-medium cursor-pointer">
                                {lead.name}
                              </Label>
                              <p className="text-xs text-slate-500 truncate">
                                {lead.title} at {lead.company}
                              </p>
                            </div>
                            <Badge className={isLeadSpeaker ? "bg-teal-100 text-teal-700" : "bg-sky-100 text-sky-700"}>
                              {isLeadSpeaker ? "Speaker" : "Sponsor"}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-md border border-slate-200">
                      <p className="text-slate-500">No leads match your search criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={selectedCount === 0}
              >
                Review Messages
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-teal-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-1">Review & Edit Messages</h3>
                      <p className="text-sm text-slate-500">Review the AI-generated messages for each recipient</p>
                    </div>

                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      {selectedCount} recipient{selectedCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-md p-3 mb-3">
                    <div className="flex items-center">
                      <AlertCircle size={16} className="text-amber-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        Each message has been personalized based on the recipient's profile. Click "Edit" to make
                        changes to any message.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    {getPreview().map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-md border border-slate-200">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2 border border-slate-200">
                              <AvatarImage src={item.lead.profileImage || "/placeholder.svg"} alt={item.lead.name} />
                              <AvatarFallback>{item.lead.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{item.lead.name}</div>
                              <div className="text-xs text-slate-500">
                                {item.lead.title} at {item.lead.company}
                              </div>
                            </div>
                          </div>

                          {editingLead === item.lead.name ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingLead(null)}
                              className="border-green-200 text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Done
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingLead(item.lead.name)}
                              className="border-teal-200 text-teal-700 hover:bg-teal-50"
                            >
                              <PencilLine size={14} className="mr-1" />
                              Edit
                            </Button>
                          )}
                        </div>

                        {editingLead === item.lead.name ? (
                          <Textarea
                            value={customMessages[item.lead.name]}
                            onChange={(e) => updateCustomMessage(item.lead.name, e.target.value)}
                            className="min-h-[200px] font-mono text-sm resize-y border-teal-200 focus-visible:ring-teal-500"
                          />
                        ) : (
                          <div className="whitespace-pre-wrap text-sm font-mono text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                            {item.message}
                          </div>
                        )}

                        <div className="mt-2 flex justify-between items-center">
                          <Badge
                            variant="outline"
                            className={`${leads.speakers.includes(item.lead) ? "bg-teal-50 text-teal-700" : "bg-sky-50 text-sky-700"}`}
                          >
                            {leads.speakers.includes(item.lead) ? "Speaker" : "Sponsor"}
                          </Badge>

                          <div className="text-xs text-slate-500">{item.message.length} characters</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep} className="border-slate-200">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Selection
              </Button>
              <Button onClick={nextStep} className="bg-teal-600 hover:bg-teal-700 text-white">
                Preview & Send
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border border-teal-100 shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 mb-1">Preview & Send</h3>
                      <p className="text-sm text-slate-500">
                        Review and send your message to {selectedCount} recipient{selectedCount !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      {selectedCount} recipient{selectedCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {isSending ? (
                    <div className="bg-teal-50 border border-teal-200 rounded-md p-6 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
                        <h4 className="font-medium text-teal-700 mb-1">Sending Messages...</h4>
                        <p className="text-sm text-teal-600 mb-4">Please wait while we send your messages</p>

                        <div className="w-full max-w-md bg-white rounded-full h-2 mb-2">
                          <div
                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(sentCount / selectedCount) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-teal-700">
                          {sentCount} of {selectedCount} sent
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-teal-50 border border-teal-200 rounded-md p-3 mb-3">
                        <div className="flex items-center">
                          <MessageSquare size={16} className="text-teal-500 mr-2 flex-shrink-0" />
                          <p className="text-sm text-slate-600">
                            You're about to send {selectedCount} personalized message{selectedCount !== 1 ? "s" : ""}.
                            Click "Send Messages" to proceed.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-md border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-3">Recipients</h4>
                        <div className="flex flex-wrap gap-2">
                          {getPreview().map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-slate-50 rounded-full px-3 py-1 border border-slate-200"
                            >
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={item.lead.profileImage || "/placeholder.svg"} alt={item.lead.name} />
                                <AvatarFallback>{item.lead.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{item.lead.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-md border border-slate-200">
                        <h4 className="font-medium text-slate-800 mb-3">Sample Message Preview</h4>
                        {getPreview().length > 0 && (
                          <div className="whitespace-pre-wrap text-sm font-mono text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                            {getPreview()[0].message}
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          Note: Each recipient will receive their own personalized version of the message.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep} disabled={isSending} className="border-slate-200">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Review
              </Button>
              <Button
                onClick={sendMessages}
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={isSending || selectedCount === 0}
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Messages
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message after sending */}
      {sentCount > 0 && sentCount === selectedCount && !isSending && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-2 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800 mb-1">Messages Sent Successfully!</h3>
                  <p className="text-sm text-green-700">
                    All {sentCount} message{sentCount !== 1 ? "s were" : " was"} sent successfully.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
