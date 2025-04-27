"use client"

import { motion } from "framer-motion"
import { Users, DollarSign, BarChart3, Star, CheckCircle, Award, TrendingUp } from "lucide-react"

interface ResultsSummaryProps {
  speakerCount: number
  sponsorCount: number
  speakerRelevancy: number
  sponsorRelevancy: number
  topSpeakerExpertise: string[]
  topSponsorExpertise: string[]
}

export function ResultsSummary({
  speakerCount = 4,
  sponsorCount = 4,
  speakerRelevancy = 90,
  sponsorRelevancy = 85,
  topSpeakerExpertise = ["AI Ethics", "Enterprise AI", "Machine Learning"],
  topSponsorExpertise = ["AI Platforms", "Cloud Solutions", "Data Analytics"],
}: ResultsSummaryProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const barVariants = {
    hidden: { width: 0 },
    show: (custom: number) => ({
      width: `${custom}%`,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    }),
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
    },
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.5 }}
    >
      <motion.p variants={itemVariants} className="text-slate-700 font-medium">
        Here's a quick summary of what I found:
      </motion.p>

      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants}>
        {/* Speakers Card */}
        <motion.div
          variants={itemVariants}
          whileHover="pulse"
          animate={{ boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)" }}
          className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-5 border border-blue-100 overflow-hidden relative"
        >
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full opacity-30"
            style={{ transform: "translate(30%, -30%)" }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 text-lg">Speakers</h4>
            <motion.div
              className="ml-auto bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-sm font-medium flex items-center"
              variants={pulseVariants}
              animate="pulse"
            >
              <Star size={14} className="mr-1" />
              {speakerRelevancy}% Match
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center">
                <CheckCircle size={16} className="text-blue-500 mr-2" />
                Found
              </span>
              <motion.span
                className="font-semibold text-blue-700"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {speakerCount} speakers
              </motion.span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center">
                  <Award size={16} className="text-blue-500 mr-2" />
                  Relevancy
                </span>
                <motion.span
                  className="font-semibold text-blue-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {speakerRelevancy}%
                </motion.span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  variants={barVariants}
                  custom={speakerRelevancy}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-600 flex items-center">
                <TrendingUp size={16} className="text-blue-500 mr-2" />
                Top Expertise
              </span>
              <ul className="space-y-1.5">
                {topSpeakerExpertise.map((expertise, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center text-sm text-slate-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, delay: index * 0.2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    {expertise}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Sponsors Card */}
        <motion.div
          variants={itemVariants}
          whileHover="pulse"
          animate={{ boxShadow: "0 4px 12px rgba(20, 184, 166, 0.1)" }}
          className="bg-gradient-to-br from-teal-50 to-slate-50 rounded-xl p-5 border border-teal-100 overflow-hidden relative"
        >
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 bg-teal-100 rounded-full opacity-30"
            style={{ transform: "translate(30%, -30%)" }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          <div className="flex items-center mb-4">
            <div className="bg-teal-100 rounded-full p-2 mr-3">
              <DollarSign size={20} className="text-teal-600" />
            </div>
            <h4 className="font-semibold text-slate-800 text-lg">Sponsors</h4>
            <motion.div
              className="ml-auto bg-teal-100 text-teal-700 rounded-full px-2 py-0.5 text-sm font-medium flex items-center"
              variants={pulseVariants}
              animate="pulse"
            >
              <Star size={14} className="mr-1" />
              {sponsorRelevancy}% Match
            </motion.div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 flex items-center">
                <CheckCircle size={16} className="text-teal-500 mr-2" />
                Found
              </span>
              <motion.span
                className="font-semibold text-teal-700"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {sponsorCount} sponsors
              </motion.span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center">
                  <Award size={16} className="text-teal-500 mr-2" />
                  Relevancy
                </span>
                <motion.span
                  className="font-semibold text-teal-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {sponsorRelevancy}%
                </motion.span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-teal-500 rounded-full"
                  variants={barVariants}
                  custom={sponsorRelevancy}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-600 flex items-center">
                <TrendingUp size={16} className="text-teal-500 mr-2" />
                Top Focus Areas
              </span>
              <ul className="space-y-1.5">
                {topSponsorExpertise.map((expertise, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center text-sm text-slate-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, delay: index * 0.2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    {expertise}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center bg-gradient-to-r from-blue-50 via-slate-50 to-teal-50 rounded-lg p-4 border border-slate-200"
      >
        <motion.div
          className="flex items-center text-slate-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <BarChart3 size={18} className="mr-2 text-blue-600" />
          <span>
            <span className="font-medium">{Math.round((speakerCount + sponsorCount) * 0.75)} excellent matches</span>{" "}
            with 90%+ relevancy score
          </span>
        </motion.div>
      </motion.div>

      <motion.p
        variants={itemVariants}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="text-slate-700"
      >
        You can view detailed information about each recommendation in the "Leads" tab. Would you like me to highlight
        any specific speakers or sponsors?
      </motion.p>
    </motion.div>
  )
}
