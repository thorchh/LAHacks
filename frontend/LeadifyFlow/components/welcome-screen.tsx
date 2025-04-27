"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Zap, ArrowRight } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [step, setStep] = useState(0)

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      onStart()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200"
      >
        <div className="border-b border-slate-200">
          <div className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center">
                  <img src="/nova-assistant.png" alt="Nova Assistant" className="w-20 h-20 rounded-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-sm border border-slate-200">
                  <MessageSquare size={18} className="text-rose-600" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
              Event Lead <span className="text-rose-600">Assistant</span>
            </h1>

            <p className="text-slate-500 text-center mb-8">
              Your AI-powered assistant for finding the perfect speakers and sponsors for your events
            </p>

            <div className="relative">
              {step === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                      <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                        <MessageSquare size={20} className="text-rose-600" />
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2">Conversational</h3>
                      <p className="text-sm text-slate-500">
                        Just chat naturally with Nova to find the perfect event leads
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                      <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                        <Users size={20} className="text-rose-600" />
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2">Personalized</h3>
                      <p className="text-sm text-slate-500">
                        Get tailored recommendations based on your specific event needs
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                      <div className="bg-slate-100 rounded-full w-10 h-10 flex items-center justify-center mb-3">
                        <Zap size={20} className="text-rose-600" />
                      </div>
                      <h3 className="font-medium text-slate-800 mb-2">Effortless</h3>
                      <p className="text-sm text-slate-500">Save hours of research with AI-powered lead generation</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <h3 className="font-medium text-slate-800 mb-3">How it works:</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start">
                        <div className="bg-rose-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-sm font-medium text-rose-800">1</span>
                        </div>
                        <p className="text-slate-600">
                          Chat with Nova about your event details, target audience, and goals
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-rose-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-sm font-medium text-rose-800">2</span>
                        </div>
                        <p className="text-slate-600">
                          Nova analyzes your requirements and searches for the best matches
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-rose-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-sm font-medium text-rose-800">3</span>
                        </div>
                        <p className="text-slate-600">
                          Review personalized recommendations with contact information and outreach messages
                        </p>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-rose-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-sm font-medium text-rose-800">4</span>
                        </div>
                        <p className="text-slate-600">
                          Export your results or contact leads directly to make your event a success
                        </p>
                      </li>
                    </ol>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="inline-block mx-auto">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
                        <img
                          src="/nova-assistant.png"
                          alt="Nova Assistant"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-sm border border-slate-200">
                        <MessageSquare size={16} className="text-rose-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-slate-800 mb-2">Meet Nova</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      I'm your AI event assistant. I'll help you find the perfect speakers and sponsors through a simple
                      conversation. No complex forms - just tell me what you need!
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-between items-center">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-rose-600" : "bg-slate-300"}`} />
            ))}
          </div>

          <Button onClick={nextStep} className="bg-rose-600 hover:bg-rose-700">
            {step < 2 ? "Continue" : "Start Conversation"}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
