"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"
import { type ProcessStatus, ProcessStage } from "@/lib/types"
import { LoadingIndicator } from "@/components/loading-indicator"

interface ChatInterfaceProps {
  messages: { role: "user" | "assistant"; content: string }[]
  onSendMessage: (message: string) => void
  processStatus: ProcessStatus
}

export function ChatInterface({ messages, onSendMessage, processStatus }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isProcessing = processStatus.stage !== ProcessStage.Idle && processStatus.stage !== ProcessStage.Completed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      onSendMessage(input)
      setInput("")
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-[70vh]">
      <Card className="flex-1 overflow-y-auto p-4 mb-4 bg-white">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-slate-100 text-slate-800">
                <LoadingIndicator stage={processStatus.stage} progress={processStatus.progress} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about your event..."
          disabled={isProcessing}
          className="flex-1"
        />
        <Button type="submit" disabled={isProcessing || !input.trim()} className="bg-slate-800 hover:bg-slate-700">
          <Send size={18} />
        </Button>
      </form>
    </div>
  )
}
