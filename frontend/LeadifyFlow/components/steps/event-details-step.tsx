"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Tag, ArrowRight, ArrowLeft, PlusCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import type { EventData } from "@/lib/types"

interface EventDetailsStepProps {
  eventData: EventData
  setEventData: (data: EventData) => void
  onNext: () => void
  onPrev: () => void
}

export function EventDetailsStep({ eventData, setEventData, onNext, onPrev }: EventDetailsStepProps) {
  const [newTopic, setNewTopic] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData({ ...eventData, [name]: value })
  }

  const handleAttendanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, expectedAttendance: Number.parseInt(e.target.value) || 0 })
  }

  const addTopic = () => {
    if (newTopic.trim() && !eventData.topics.includes(newTopic.trim())) {
      setEventData({ ...eventData, topics: [...eventData.topics, newTopic.trim()] })
      setNewTopic("")
    }
  }

  const removeTopic = (topic: string) => {
    setEventData({ ...eventData, topics: eventData.topics.filter((t) => t !== topic) })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTopic()
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tell us about your event</h2>
        <p className="text-slate-600 mb-6">
          Provide details about your event to help us find the most relevant speakers and sponsors.
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
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-500" />
                  Event Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  placeholder="e.g., Future of AI Conference 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    placeholder="e.g., June 15-17, 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-500" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco Convention Center, CA"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={eventData.type}
                  onChange={handleChange}
                  placeholder="e.g., Technology Conference"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedAttendance" className="flex items-center gap-2">
                  <Users size={16} className="text-purple-500" />
                  Expected Attendance
                </Label>
                <Input
                  id="expectedAttendance"
                  name="expectedAttendance"
                  type="number"
                  value={eventData.expectedAttendance}
                  onChange={handleAttendanceChange}
                  placeholder="e.g., 1200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics" className="flex items-center gap-2">
                  <Tag size={16} className="text-purple-500" />
                  Topics
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="newTopic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a topic"
                  />
                  <Button type="button" variant="outline" onClick={addTopic} className="shrink-0">
                    <PlusCircle size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventData.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {topic}
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeTopic(topic)}
                        className="h-5 w-5 p-0 ml-1 text-slate-500 hover:text-slate-700"
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
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
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                rows={4}
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
