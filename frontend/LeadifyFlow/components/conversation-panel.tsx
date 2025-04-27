"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProcessVisualizer } from "@/components/process-visualizer"
import { ProcessStage, type ProcessStatus, type Message } from "@/lib/types"

interface ConversationPanelProps {
  messages: Message[]
  isTyping: boolean
  inputMessage: string
  setInputMessage: (message: string) => void
  handleSendMessage: () => void
  processStatus: ProcessStatus
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ConversationPanel({
  messages,
  isTyping,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  processStatus,
  messagesEndRef,
}: ConversationPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isProcessing = processStatus.stage !== ProcessStage.Idle && processStatus.stage !== ProcessStage.Completed

  // Quick reply suggestions based on conversation stage
  const getSuggestions = () => {
    // Only show suggestions for idle or completed states
    if (isProcessing) return []

    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "assistant") return []

    // Different suggestions based on journey stage
    if (messages.length <= 2) {
      return ["I'm planning a tech conference", "I need speakers for a webinar", "I'm organizing a marketing event"]
    } else if (messages.length <= 4) {
      return ["The audience is mainly executives", "It's for tech professionals", "Mostly marketing specialists"]
    } else if (processStatus.stage === ProcessStage.Completed) {
      return ["Can you tell me more about this speaker?", "How do I message these leads?", "Can we start a new search?"]
    }

    return []
  }

  const suggestions = getSuggestions()

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    setShowSuggestions(false)
    // Allow a tiny delay for the UI to update
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-teal-50/30 to-slate-50/30">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 pt-4 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                    : "bg-white border border-slate-200"
                }`}
              >
                {message.type === "processing-start" ? (
                  <div className="space-y-2">
                    <p className="text-slate-700">{message.content}</p>
                    <ProcessVisualizer processStatus={processStatus} />
                  </div>
                ) : message.type === "results" ? (
                  <div className="text-slate-700">{message.content}</div>
                ) : (
                  <div>
                    <p className={message.role === "user" ? "text-white" : "text-slate-700"}>{message.content}</p>
                    <div
                      className={`text-xs mt-2 opacity-0 group-hover:opacity-70 transition-opacity ${
                        message.role === "user" ? "text-white/70 text-right" : "text-slate-400"
                      }`}
                    >
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center">
                <div className="relative w-10 h-10 mr-3">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-100"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500" />
                  </motion.div>
                  <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0.8 }}>
                    <motion.div
                      className="w-2 h-2 rounded-full bg-blue-500"
                      animate={{
                        x: [0, 3, 0, -3, 0],
                        y: [0, -3, 0, 3, 0],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-blue-700 mb-1">Thinking...</div>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-12 h-1.5 rounded-full bg-blue-200"
                        initial={{ width: 0 }}
                        animate={{
                          width: [0, 12, 24, 48, 24, 12, 0],
                          backgroundColor: [
                            "rgb(191, 219, 254)", // blue-200
                            "rgb(147, 197, 253)", // blue-300
                            "rgb(96, 165, 250)", // blue-400
                            "rgb(59, 130, 246)", // blue-500
                            "rgb(96, 165, 250)", // blue-400
                            "rgb(147, 197, 253)", // blue-300
                            "rgb(191, 219, 254)", // blue-200
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick reply suggestions */}
      {showSuggestions && suggestions.length > 0 && !isProcessing && (
        <div className="px-4 py-3 bg-white border-t border-slate-100">
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 border-slate-200 focus-visible:ring-blue-500 rounded-full py-6"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing || !inputMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 rounded-full w-12 h-12 p-0 flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
