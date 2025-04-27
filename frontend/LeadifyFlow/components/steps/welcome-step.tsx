"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, Zap, Users, Target, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const features = [
    {
      icon: <Zap size={20} className="text-purple-500" />,
      title: "AI-Powered Matching",
      description: "Our AI analyzes your event details to find the most relevant speakers and sponsors.",
    },
    {
      icon: <Users size={20} className="text-purple-500" />,
      title: "Personalized Recommendations",
      description: "Get tailored suggestions based on your audience, goals, and event theme.",
    },
    {
      icon: <Target size={20} className="text-purple-500" />,
      title: "Ready-to-Use Outreach",
      description: "Personalized outreach messages for each recommended speaker and sponsor.",
    },
    {
      icon: <Calendar size={20} className="text-purple-500" />,
      title: "Event Success Planning",
      description: "Recommendations to maximize engagement and attendance at your event.",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
            <Sparkles size={30} className="text-purple-600" />
          </div>
        </motion.div>

        <motion.h2
          className="text-2xl md:text-3xl font-bold text-slate-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Welcome to the Event Lead Generation Wizard
        </motion.h2>

        <motion.p
          className="text-slate-600 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          I'll guide you through a simple process to find the perfect speakers and sponsors for your event. Let's create
          an amazing experience for your attendees!
        </motion.p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-medium text-slate-800">{feature.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div
        className="flex justify-center mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
        >
          Let's Get Started
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </motion.div>
    </div>
  )
}
