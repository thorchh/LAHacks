"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Target, ArrowRight, ArrowLeft, PlusCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import type { Goals } from "@/lib/types"

interface GoalsStepProps {
  goals: Goals
  setGoals: (data: Goals) => void
  onNext: () => void
  onPrev: () => void
}

export function GoalsStep({ goals, setGoals, onNext, onPrev }: GoalsStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGoals({ ...goals, [name]: value })
  }

  const handleCheckboxChange = (key: keyof Goals, checked: boolean) => {
    if (typeof goals[key] === "boolean") {
      setGoals({ ...goals, [key]: checked })
    }
  }

  const addKeyObjective = () => {
    if (goals.newObjective.trim() && !goals.keyObjectives.includes(goals.newObjective.trim())) {
      setGoals({
        ...goals,
        keyObjectives: [...goals.keyObjectives, goals.newObjective.trim()],
        newObjective: "",
      })
    }
  }

  const removeKeyObjective = (objective: string) => {
    setGoals({
      ...goals,
      keyObjectives: goals.keyObjectives.filter((o) => o !== objective),
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyObjective()
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Define Your Event Goals</h2>
        <p className="text-slate-600 mb-6">
          Tell us what you want to achieve with your event so we can find speakers and sponsors that align with your
          objectives.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="border-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyObjectives" className="flex items-center gap-2">
                <Target size={16} className="text-purple-500" />
                Key Objectives
              </Label>
              <div className="flex gap-2">
                <Input
                  id="newObjective"
                  name="newObjective"
                  value={goals.newObjective}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Add an objective"
                />
                <Button type="button" variant="outline" onClick={addKeyObjective} className="shrink-0">
                  <PlusCircle size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {goals.keyObjectives.map((objective, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {objective}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeKeyObjective(objective)}
                      className="h-5 w-5 p-0 ml-1 text-slate-500 hover:text-slate-700"
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>What are you looking for?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="needSpeakers"
                    checked={goals.needSpeakers}
                    onCheckedChange={(checked) => handleCheckboxChange("needSpeakers", checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="needSpeakers"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Speakers & Presenters
                    </Label>
                    <p className="text-sm text-muted-foreground">Find industry experts and engaging presenters</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="needSponsors"
                    checked={goals.needSponsors}
                    onCheckedChange={(checked) => handleCheckboxChange("needSponsors", checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="needSponsors"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sponsors & Partners
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Find organizations to sponsor or partner with your event
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="needPanelists"
                    checked={goals.needPanelists}
                    onCheckedChange={(checked) => handleCheckboxChange("needPanelists", checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="needPanelists"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Panelists
                    </Label>
                    <p className="text-sm text-muted-foreground">Find experts for panel discussions</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="needExhibitors"
                    checked={goals.needExhibitors}
                    onCheckedChange={(checked) => handleCheckboxChange("needExhibitors", checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="needExhibitors"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Exhibitors
                    </Label>
                    <p className="text-sm text-muted-foreground">Find companies to showcase products or services</p>
                  </div>
                </div>
              </div>
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
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="speakerRequirements">Speaker Requirements</Label>
              <Textarea
                id="speakerRequirements"
                name="speakerRequirements"
                value={goals.speakerRequirements}
                onChange={handleChange}
                placeholder="What qualities or expertise are you looking for in speakers?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sponsorRequirements">Sponsor Requirements</Label>
              <Textarea
                id="sponsorRequirements"
                name="sponsorRequirements"
                value={goals.sponsorRequirements}
                onChange={handleChange}
                placeholder="What are you looking for in sponsors or partners?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range (Optional)</Label>
              <Input
                id="budget"
                name="budget"
                value={goals.budget}
                onChange={handleChange}
                placeholder="e.g., $5,000 - $10,000 for speakers"
              />
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
          Find Leads
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  )
}
