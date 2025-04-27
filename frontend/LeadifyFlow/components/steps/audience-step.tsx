"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Users, ArrowRight, ArrowLeft, PlusCircle, X, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Audience } from "@/lib/types"

interface AudienceStepProps {
  audience: Audience
  setAudience: (data: Audience) => void
  onNext: () => void
  onPrev: () => void
}

export function AudienceStep({ audience, setAudience, onNext, onPrev }: AudienceStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAudience({ ...audience, [name]: value })
  }

  const handleInterestChange = (interest: string, value: boolean) => {
    const newInterests = { ...audience.interests }
    if (value) {
      newInterests[interest] = true
    } else {
      delete newInterests[interest]
    }
    setAudience({ ...audience, interests: newInterests })
  }

  const handleSliderChange = (value: number[]) => {
    setAudience({ ...audience, ageRange: value as [number, number] })
  }

  const addInterest = () => {
    if (audience.newInterest.trim() && !audience.interests[audience.newInterest.trim()]) {
      handleInterestChange(audience.newInterest.trim(), true)
      setAudience({ ...audience, newInterest: "" })
    }
  }

  const removeInterest = (interest: string) => {
    handleInterestChange(interest, false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addInterest()
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Define Your Target Audience</h2>
        <p className="text-slate-600 mb-6">
          Help us understand who will be attending your event so we can find the most relevant speakers and sponsors.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryDemographic" className="flex items-center gap-2">
                  <Users size={16} className="text-purple-500" />
                  Primary Demographic
                </Label>
                <Input
                  id="primaryDemographic"
                  name="primaryDemographic"
                  value={audience.primaryDemographic}
                  onChange={handleChange}
                  placeholder="e.g., Tech Professionals, Entrepreneurs"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target size={16} className="text-purple-500" />
                  Age Range: {audience.ageRange[0]} - {audience.ageRange[1]}
                </Label>
                <Slider
                  defaultValue={audience.ageRange}
                  min={18}
                  max={80}
                  step={1}
                  value={audience.ageRange}
                  onValueChange={handleSliderChange}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <RadioGroup
                  value={audience.experienceLevel}
                  onValueChange={(value) => setAudience({ ...audience, experienceLevel: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">Mixed</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interests" className="flex items-center gap-2">
                  <Target size={16} className="text-purple-500" />
                  Interests & Topics
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="newInterest"
                    name="newInterest"
                    value={audience.newInterest}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add an interest"
                  />
                  <Button type="button" variant="outline" onClick={addInterest} className="shrink-0">
                    <PlusCircle size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.keys(audience.interests).map((interest, index) => (
                    <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {interest}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeInterest(interest)}
                        className="h-5 w-5 p-0 ml-1 text-slate-500 hover:text-slate-700"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industryFocus">Industry Focus</Label>
                <Input
                  id="industryFocus"
                  name="industryFocus"
                  value={audience.industryFocus}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geographicFocus">Geographic Focus</Label>
                <Input
                  id="geographicFocus"
                  name="geographicFocus"
                  value={audience.geographicFocus}
                  onChange={handleChange}
                  placeholder="e.g., Global, North America, Europe"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes About Your Audience</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                value={audience.additionalNotes}
                onChange={handleChange}
                placeholder="Any other details about your target audience..."
                rows={3}
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
          Continue
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  )
}
