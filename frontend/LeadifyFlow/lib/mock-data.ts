import type { EventData, Lead, Audience, Goals } from "./types"

export const mockEventData: EventData = {
  name: "Future of AI Conference 2025",
  date: "June 15-17, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "San Francisco Convention Center, CA",
  type: "Technology Conference",
  expectedAttendance: 1200,
  topics: [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "AI Ethics",
    "Enterprise AI Solutions",
  ],
  description:
    "The Future of AI Conference brings together industry leaders, researchers, and innovators to explore the latest advancements in artificial intelligence and its impact across various sectors. The three-day event will feature keynote presentations, panel discussions, workshops, and networking opportunities focused on the practical applications and ethical considerations of AI technologies.",
}

export const mockAudience: Audience = {
  primaryDemographic: "Tech Professionals and Business Leaders",
  ageRange: [25, 55],
  experienceLevel: "mixed",
  interests: {
    "Artificial Intelligence": true,
    "Machine Learning": true,
    "Business Strategy": true,
    "Technology Innovation": true,
    "Digital Transformation": true,
  },
  newInterest: "",
  industryFocus: "Technology, Finance, Healthcare, Education",
  geographicFocus: "Global, with emphasis on North America",
  additionalNotes:
    "Our audience includes both technical practitioners and business decision-makers looking to implement AI solutions.",
}

export const mockGoals: Goals = {
  keyObjectives: [
    "Share cutting-edge AI research",
    "Showcase practical AI applications",
    "Facilitate networking opportunities",
    "Generate leads for sponsors",
  ],
  newObjective: "",
  needSpeakers: true,
  needSponsors: true,
  needPanelists: true,
  needExhibitors: false,
  speakerRequirements:
    "Looking for thought leaders with practical experience implementing AI solutions at scale. Preference for speakers who can provide case studies and actionable insights.",
  sponsorRequirements:
    "Seeking technology companies with AI products or services that would benefit our audience of tech professionals and business leaders.",
  budget: "$5,000 - $10,000 for keynote speakers",
}

const speakerLeads: Lead[] = [
  {
    name: "Dr. Sarah Chen",
    title: "AI Research Director",
    company: "TechVision Labs",
    profileImage: "/nova-neutral.png",
    relevancyScore: 95,
    expertise: ["Natural Language Processing", "AI Ethics", "Machine Learning"],
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    draftMessage:
      "Dear Dr. Chen, I'm organizing the Future of AI Conference 2025 in San Francisco and was impressed by your work on ethical considerations in NLP. Given your expertise, I'd like to invite you to deliver a keynote on the ethical implications of large language models. Would you be interested in discussing this opportunity?",
    description:
      "Dr. Chen leads AI research at TechVision Labs, focusing on ethical AI development and natural language understanding. She has published over 30 papers on responsible AI and previously worked at Google AI.",
    tags: ["Keynote", "Ethics", "Research"],
  },
  {
    name: "Michael Rodriguez",
    title: "Chief AI Officer",
    company: "InnovateAI",
    profileImage: "/nova-happy.png",
    relevancyScore: 92,
    expertise: ["Enterprise AI", "AI Strategy", "Digital Transformation"],
    linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
    draftMessage:
      "Hello Michael, I'm reaching out regarding our upcoming Future of AI Conference in San Francisco. Your experience implementing AI solutions at enterprise scale would provide valuable insights for our attendees. Would you be interested in speaking about practical AI implementation strategies for businesses?",
    description:
      "Michael has led AI transformation initiatives at Fortune 500 companies and now oversees AI strategy at InnovateAI. He specializes in helping businesses implement practical AI solutions that deliver measurable ROI.",
    tags: ["Enterprise", "Strategy", "Implementation"],
  },
  {
    name: "Dr. James Wilson",
    title: "Professor of Computer Science",
    company: "Stanford University",
    profileImage: "/nova-thinking.png",
    relevancyScore: 88,
    expertise: ["Computer Vision", "Deep Learning", "AI Research"],
    linkedinUrl: "https://linkedin.com/in/jameswilson",
    draftMessage:
      "Dear Dr. Wilson, I'm organizing the Future of AI Conference 2025 and your groundbreaking research in computer vision would be of great interest to our attendees. Would you consider presenting your recent work on multi-modal learning systems at our event in San Francisco this June?",
    description:
      "Dr. Wilson is a leading researcher in computer vision and deep learning at Stanford University. His recent work on multi-modal AI systems has been featured in top AI conferences and journals.",
    tags: ["Academic", "Research", "Computer Vision"],
  },
  {
    name: "Priya Sharma",
    title: "VP of Product, AI Solutions",
    company: "GlobalTech",
    profileImage: "/confident-professional.png",
    relevancyScore: 85,
    expertise: ["Product Management", "AI Product Strategy", "UX for AI"],
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    draftMessage:
      "Hi Priya, I'm organizing the Future of AI Conference 2025 and was impressed by your work leading AI product development at GlobalTech. Would you be interested in speaking about designing user-centered AI products at our event in San Francisco this June?",
    description:
      "Priya leads AI product strategy at GlobalTech, where she has launched several successful AI-powered products. She specializes in creating intuitive user experiences for complex AI systems.",
    tags: ["Product", "UX", "Strategy"],
  },
]

const sponsorLeads: Lead[] = [
  {
    name: "Jennifer Adams",
    title: "Director of Marketing",
    company: "CloudAI Solutions",
    profileImage: "/confident-professional.png",
    relevancyScore: 94,
    expertise: ["B2B Marketing", "Tech Partnerships", "Event Sponsorship"],
    linkedinUrl: "https://linkedin.com/in/jenniferadams",
    draftMessage:
      "Hello Jennifer, I'm organizing the Future of AI Conference 2025 in San Francisco this June. Given CloudAI's leadership in enterprise AI solutions, I believe this would be an excellent opportunity to showcase your platform to over 1,200 AI professionals and decision-makers. Would you be interested in exploring sponsorship opportunities?",
    description:
      "Jennifer oversees marketing strategy at CloudAI Solutions, a leading provider of cloud-based AI infrastructure. She has extensive experience in B2B technology marketing and strategic partnerships.",
    tags: ["Marketing", "Cloud", "Enterprise"],
  },
  {
    name: "David Park",
    title: "VP of Business Development",
    company: "NexusML",
    profileImage: "/confident-asian-executive.png",
    relevancyScore: 91,
    expertise: ["Strategic Partnerships", "AI Infrastructure", "Growth Strategy"],
    linkedinUrl: "https://linkedin.com/in/davidpark",
    draftMessage:
      "Hi David, I'm reaching out regarding the Future of AI Conference 2025 happening in San Francisco. With NexusML's focus on ML infrastructure, our event would provide an excellent platform to connect with potential clients and partners. Would you be interested in discussing sponsorship options that could highlight your solutions?",
    description:
      "David leads business development at NexusML, a startup specializing in machine learning infrastructure. He has a strong background in strategic partnerships and previously worked at NVIDIA.",
    tags: ["Infrastructure", "ML", "Startup"],
  },
  {
    name: "Alexandra Martinez",
    title: "Chief Marketing Officer",
    company: "DataSense AI",
    profileImage: "/confident-latina-leader.png",
    relevancyScore: 89,
    expertise: ["AI Marketing", "Brand Strategy", "Technology Events"],
    linkedinUrl: "https://linkedin.com/in/alexandramartinez",
    draftMessage:
      "Dear Alexandra, I'm organizing the Future of AI Conference 2025 and believe DataSense AI would be an ideal sponsor given your focus on data analytics and AI solutions. Our event attracts 1,200+ attendees interested in practical AI applications. Would you be open to discussing how a sponsorship could help showcase DataSense's capabilities?",
    description:
      "Alexandra is the CMO at DataSense AI, a company specializing in AI-powered data analytics solutions. She has successfully positioned the company as a thought leader through strategic event sponsorships.",
    tags: ["Analytics", "Marketing", "Data"],
  },
  {
    name: "Robert Johnson",
    title: "Director of Strategic Partnerships",
    company: "Enterprise AI Systems",
    profileImage: "/confident-businessman.png",
    relevancyScore: 86,
    expertise: ["Enterprise Solutions", "AI Integration", "Strategic Alliances"],
    linkedinUrl: "https://linkedin.com/in/robertjohnson",
    draftMessage:
      "Hello Robert, I'm organizing the Future of AI Conference 2025 in San Francisco and noticed Enterprise AI Systems' impressive work in AI integration for large organizations. Our conference attracts decision-makers looking for enterprise-ready AI solutions. Would you be interested in exploring sponsorship opportunities to showcase your solutions to our audience?",
    description:
      "Robert specializes in forming strategic partnerships at Enterprise AI Systems, a company that provides end-to-end AI integration services for large enterprises. He has a strong network in the enterprise technology space.",
    tags: ["Enterprise", "Integration", "Partnerships"],
  },
]

export const mockLeads = {
  speakers: speakerLeads,
  sponsors: sponsorLeads,
}
