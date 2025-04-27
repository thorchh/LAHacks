import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users, Target, Briefcase } from "lucide-react"
import type { EventData } from "@/lib/types"

interface EventDetailsProps {
  eventData: EventData
}

export function EventDetails({ eventData }: EventDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Briefcase size={18} className="text-slate-600" />
                  Event Name
                </h3>
                <p className="text-slate-700">{eventData.name}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <CalendarDays size={18} className="text-slate-600" />
                  Date & Time
                </h3>
                <p className="text-slate-700">{eventData.date}</p>
                <p className="text-slate-700">{eventData.time}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin size={18} className="text-slate-600" />
                  Location
                </h3>
                <p className="text-slate-700">{eventData.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Target size={18} className="text-slate-600" />
                  Event Type
                </h3>
                <p className="text-slate-700">{eventData.type}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users size={18} className="text-slate-600" />
                  Expected Attendance
                </h3>
                <p className="text-slate-700">{eventData.expectedAttendance} attendees</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Topics</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventData.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="bg-slate-100">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-slate-700 mt-2">{eventData.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
