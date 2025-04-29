"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Linkedin, Copy, Check, ExternalLink, Star, StarOff, ChevronDown, ChevronUp, Building } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Lead } from "@/lib/types"

interface LeadCardProps {
  lead: Lead
  type: "speaker" | "sponsor"
  view?: "grid" | "list"
}

export function LeadCard({ lead, type, view = "grid" }: LeadCardProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [favorited, setFavorited] = useState(false)

  const copyMessage = () => {
    navigator.clipboard.writeText(lead.draftMessage)
    setCopied(true)
    toast({
      title: "Message copied",
      description: "The outreach message has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  if (view === "list") {
    return (
      <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-slate-200">
              <AvatarImage src={lead.profileImage || "/placeholder.svg"} alt={lead.name} />
              <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{lead.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <span className="text-xs font-medium mr-2">Match</span>
                    <Progress value={lead.relevancyScore} className="w-16 h-1.5" />
                    <span className="ml-2 text-xs font-medium">{lead.relevancyScore}%</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-slate-400 hover:text-yellow-500"
                    onClick={() => setFavorited(!favorited)}
                  >
                    {favorited ? <Star className="fill-yellow-500 text-yellow-500" size={16} /> : <StarOff size={16} />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center text-sm text-slate-600">
                <Building size={14} className="mr-1" />
                {lead.title} at {lead.company}
              </div>

              <div className="flex flex-wrap gap-1 mt-1">
                {lead.expertise.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-0 px-1.5">
                    {skill}
                  </Badge>
                ))}
                {lead.expertise.length > 3 && (
                  <Badge variant="outline" className="text-xs py-0 px-1.5">
                    +{lead.expertise.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={lead.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-slate-600 hover:text-blue-700"
              >
                <Linkedin size={14} className="mr-1" />
                Profile
              </a>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={copyMessage} disabled={copied}>
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                {copied ? "Copied" : "Message"}
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <h4 className="text-sm font-medium mb-1">Draft Message</h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-md">{lead.draftMessage}</p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-1 h-auto"
          >
            {expanded ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
            {expanded ? "Show Less" : "Show Message"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border border-slate-200">
              <AvatarImage src={lead.profileImage || "/placeholder.svg"} alt={lead.name} />
              <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-yellow-500"
                  onClick={() => setFavorited(!favorited)}
                >
                  {favorited ? <Star className="fill-yellow-500 text-yellow-500" size={18} /> : <StarOff size={18} />}
                </Button>
              </div>

              <p className="text-slate-600 text-sm mb-2">
                {lead.title} at {lead.company}
              </p>

              <div className="flex items-center mb-3">
                <div className="flex items-center mr-4">
                  <span className="text-sm font-medium mr-2">Match</span>
                  <Progress value={lead.relevancyScore} className="w-16 h-2" />
                  <span className="ml-2 text-sm font-medium">{lead.relevancyScore}%</span>
                </div>

                <a
                  href={lead.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                >
                  <Linkedin size={16} className="mr-1" />
                  LinkedIn
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {(lead.expertise ?? []).map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {skill}
                  </Badge>
                ))}
              </div>

              {expanded ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Draft Message</h4>
                  <div className="bg-slate-50 p-3 rounded-md text-sm text-slate-700 relative">{lead.draftMessage}</div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(true)}
                  className="text-sm text-slate-600 hover:text-slate-900 p-0 h-auto"
                >
                  <ChevronDown size={14} className="mr-1" />
                  Show draft message
                </Button>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-6 bg-slate-50">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Hide message" : "View message"}
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700" size="sm" onClick={copyMessage} disabled={copied}>
            {copied ? (
              <>
                <Check size={16} className="mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} className="mr-2" />
                Copy Message
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
