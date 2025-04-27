"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, Search, DollarSign, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { LeadCard } from "@/components/lead-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Lead } from "@/lib/types"

interface SponsorsStepProps {
  leads: {
    speakers: Lead[]
    sponsors: Lead[]
  }
  onNext: () => void
  onPrev: () => void
}

export function SponsorsStep({ leads, onNext, onPrev }: SponsorsStepProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("relevancy")
  const [filterExpertise, setFilterExpertise] = useState<string | null>(null)

  // Get all unique expertise areas
  const allExpertise = Array.from(new Set(leads.sponsors.flatMap((sponsor) => sponsor.expertise))).sort()

  // Filter and sort sponsors
  const filteredSponsors = leads.sponsors
    .filter((sponsor) => {
      const matchesSearch =
        searchQuery === "" ||
        sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sponsor.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesExpertise = !filterExpertise || sponsor.expertise.includes(filterExpertise)

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

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
          <DollarSign size={24} className="mr-2 text-blue-600" />
          Sponsor Recommendations
        </h2>
        <p className="text-slate-600 mb-6">
          We found {leads.sponsors.length} potential sponsors for your event. Browse, filter, and contact them directly.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="border-none shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search sponsors by name, company, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <div className="w-48">
                <Select value={filterExpertise || ""} onValueChange={(value) => setFilterExpertise(value || null)}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter size={16} className="mr-2 text-slate-500" />
                      <SelectValue placeholder="Filter by expertise" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Expertise</SelectItem>
                    {allExpertise.map((expertise) => (
                      <SelectItem key={expertise} value={expertise}>
                        {expertise}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancy">Sort by Relevancy</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4"
      >
        {filteredSponsors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
                <LeadCard lead={sponsor} type="sponsor" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">
              No sponsors match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex justify-between mt-8"
      >
        <Button onClick={onPrev} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Speakers
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          Export & Next Steps
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  )
}
