"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeadCard } from "@/components/lead-card"
import { Mic, DollarSign, Search, Filter, SlidersHorizontal } from "lucide-react"
import type { Lead } from "@/lib/types"

interface LeadGalleryProps {
  leads: {
    speakers: Lead[]
    sponsors: Lead[]
  }
}

export function LeadGallery({ leads }: LeadGalleryProps) {
  // Defensive: always default to empty arrays if undefined
  const speakers = leads.speakers || [];
  const sponsors = leads.sponsors || [];

  const [activeTab, setActiveTab] = useState<string>("speakers")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("relevancy")
  const [filterExpertise, setFilterExpertise] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all unique expertise areas
  const getSpeakerExpertise = () => Array.from(new Set(speakers.flatMap((speaker) => speaker.expertise))).sort()
  const getSponsorExpertise = () => Array.from(new Set(sponsors.flatMap((sponsor) => sponsor.expertise))).sort()

  // Filter and sort leads
  const getFilteredLeads = (leadType: "speakers" | "sponsors") => {
    const leadList = leadType === "speakers" ? speakers : sponsors;

    return leadList
      .filter((lead) => {
        const matchesSearch =
          searchQuery === "" ||
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesExpertise = !filterExpertise || lead.expertise.includes(filterExpertise)

        return matchesSearch && matchesExpertise
      })
      .sort((a, b) => {
        if (sortBy === "relevancy") {
          return b.relevancyScore - a.relevancyScore
        } else if (sortBy === "name") {
          return a.name.localeCompare(b.name)
        } else {
          return 0
        }
      })
  }

  const filteredSpeakers = getFilteredLeads("speakers")
  const filteredSponsors = getFilteredLeads("sponsors")

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="md:w-auto bg-white border border-blue-100">
            <TabsTrigger value="speakers" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              <Mic size={16} className="mr-2" />
              <span>Speakers ({leads.speakers.length})</span>
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              <DollarSign size={16} className="mr-2" />
              <span>Sponsors ({leads.sponsors.length})</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-teal-600 hover:bg-teal-700" : ""}
            >
              List
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-blue-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-slate-200"
              />
            </div>

            <div className="flex gap-2">
              <div className="w-48">
                <Select
                  value={filterExpertise || "all"}
                  onValueChange={(value) => setFilterExpertise(value === "all" ? null : value)}
                >
                  <SelectTrigger className="border-slate-200">
                    <div className="flex items-center">
                      <Filter size={16} className="mr-2 text-slate-500" />
                      <SelectValue placeholder="Filter by expertise" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>
                    {(activeTab === "speakers" ? getSpeakerExpertise() : getSponsorExpertise()).map((expertise) => (
                      <SelectItem key={expertise} value={expertise}>
                        {expertise}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="border-slate-200">
                    <div className="flex items-center">
                      <SlidersHorizontal size={16} className="mr-2 text-slate-500" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancy">Relevancy</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <TabsContent value="speakers" className="space-y-4 mt-0">
          {filteredSpeakers.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}>
              {filteredSpeakers.map((speaker, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <LeadCard lead={speaker} type="speaker" view={viewMode} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-blue-100">
              <p className="text-slate-600">
                No speakers match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sponsors" className="space-y-4 mt-0">
          {filteredSponsors.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-4" : "space-y-4"}>
              {filteredSponsors.map((sponsor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                >
                  <LeadCard lead={sponsor} type="sponsor" view={viewMode} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-blue-100">
              <p className="text-slate-600">
                No sponsors match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
