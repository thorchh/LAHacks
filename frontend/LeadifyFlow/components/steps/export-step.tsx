"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Mail,
  Calendar,
  RefreshCw,
  CheckCircle2,
  FileSpreadsheet,
  FileSpreadsheetIcon as FileCsv,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExportStepProps {
  onPrev: () => void
  onReset: () => void
}

export function ExportStep({ onPrev, onReset }: ExportStepProps) {
  const handleExport = (format: string) => {
    // In a real app, this would trigger an actual export
    alert(`Exporting in ${format} format...`)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 text-green-700 rounded-full p-3">
            <CheckCircle2 size={30} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">All Set! What's Next?</h2>
        <p className="text-slate-600 text-center mb-6">
          You can now export your results or take additional actions to make your event a success.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download size={16} />
              <span>Export</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail size={16} />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Export Your Results</h3>
                <p className="text-slate-600 mb-6">
                  Download your speaker and sponsor recommendations in your preferred format.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleExport("Excel")}
                    variant="outline"
                    className="h-auto py-4 flex items-center justify-center gap-3"
                  >
                    <FileSpreadsheet size={20} className="text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Excel Spreadsheet</div>
                      <div className="text-xs text-slate-500">Export as .xlsx file</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleExport("CSV")}
                    variant="outline"
                    className="h-auto py-4 flex items-center justify-center gap-3"
                  >
                    <FileCsv size={20} className="text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">CSV File</div>
                      <div className="text-xs text-slate-500">Export as .csv file</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Email Your Results</h3>
                <p className="text-slate-600 mb-6">Send the results to yourself or your team members.</p>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="px-3 py-2 border border-slate-300 rounded-md"
                    />
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Mail size={16} className="mr-2" />
                    Send Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Add to Calendar</h3>
                <p className="text-slate-600 mb-6">
                  Schedule follow-up reminders to contact your recommended speakers and sponsors.
                </p>

                <div className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Calendar size={16} className="mr-2" />
                    Add Follow-up Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Card className="border-none shadow-sm bg-purple-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <RefreshCw size={18} className="mr-2 text-purple-600" />
              Start a New Search
            </h3>
            <p className="text-slate-600 mb-4">
              Need to find leads for another event? Start a new search with different criteria.
            </p>
            <Button
              onClick={onReset}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Start New Search
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex justify-start mt-8"
      >
        <Button onClick={onPrev} variant="outline" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Sponsors
        </Button>
      </motion.div>
    </div>
  )
}
