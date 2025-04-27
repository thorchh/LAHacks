"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProcessStage, type ProcessStatus } from "@/lib/types"
import { Toaster } from "@/components/ui/toaster"
import { AssistantCharacter } from "@/components/assistant-character"

interface WizardLayoutProps {
  children: React.ReactNode
  steps: { id: string; title: string; component: React.ComponentType<any> }[]
  currentStep: number
  onStepChange: (step: number) => void
  processStatus: ProcessStatus
}

export function WizardLayout({ children, steps, currentStep, onStepChange, processStatus }: WizardLayoutProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Event Lead Generation Wizard
            </h1>
            <p className="text-slate-600">Find the perfect speakers and sponsors for your next event</p>
          </div>
          <AssistantCharacter currentStep={currentStep} processStatus={processStatus} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar with steps */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
              <h2 className="font-semibold text-lg mb-4 flex items-center">
                <Sparkles size={18} className="mr-2 text-purple-500" />
                Your Progress
              </h2>
              <div className="space-y-1">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep
                  const isCurrent = index === currentStep
                  const isDisabled =
                    index > currentStep + 1 || (index > 4 && processStatus.stage !== ProcessStage.Completed)

                  return (
                    <button
                      key={step.id}
                      onClick={() => onStepChange(index)}
                      disabled={isDisabled}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg flex items-center text-sm transition-all",
                        isCompleted ? "text-purple-700 font-medium" : "text-slate-700",
                        isCurrent ? "bg-purple-100 font-medium" : "hover:bg-slate-100",
                        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      )}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-medium shrink-0">
                        {isCompleted ? (
                          <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <Check size={14} />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center",
                              isCurrent ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700",
                            )}
                          >
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <span>{step.title}</span>
                      {isCurrent && <ChevronRight size={16} className="ml-auto text-purple-600" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-[70vh]">
              {mounted && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
