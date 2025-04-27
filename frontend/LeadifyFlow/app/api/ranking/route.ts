import { NextRequest, NextResponse } from 'next/server';

// Hardcoded fallback top 5 profiles
const fallbackProfiles = [
  {
    profile: {
      id: 173221,
      name: "Guadalupe Hayes-Mota",
      location: "San Francisco Bay Area",
      headline: "CEO & Biotech Leader | AI & Supply Chain Innovator | Advisor to NIH, EU, OpenAI | MIT Senior Lecturer | Harvard Alum Entrepreneur | Author ",
      description: null,
      title: "Principal & Founder, Biotech & AI Advisor ",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D4E03AQHoEgqpeyul-Q/profile-displayphoto-shrink_400_400/B4EZTd4PfLGYAg-/0/1738889300317?e=1746057600&v=beta&t=eIPma_f31NCiKcTRQyhZDB-9ZNfWAVfF6i_lCUSkTRg",
      linkedin_url: "https://www.linkedin.com/in/ACwAAAHmheYB99qtXJyB4SR73SZvw-l63rBDd_I"
    },
    score: 10,
    explanation: "This profile is an exceptional fit. Guadalupe is a Senior Lecturer at MIT teaching AI, business, engineering, and ethics, specifically focusing on biotech and healthcare innovation. They are an AI Expert Advisor for major global bodies (World Economic Forum, European Commission, OpenAI, NIH), a published author and thought leader on AI in biotech and healthcare, and a frequent keynote speaker and guest lecturer at top universities (MIT, Harvard, Oxford). The expertise in AI ethics (mentioned in teaching), high profile, extensive speaking/educator experience, and advisory roles make them highly relevant. Crucially, they have past experience as Head & Director of Ambulatory Clinics at UCLA Health, indicating a direct connection to the event's host institution. The location (SF Bay Area) is also relatively close to UCLA for an in-person event. This combination makes them a top candidate for a keynote speaker."
  },
  {
    profile: {
      id: 0,
      name: "Andy Spezzatti",
      location: "San Francisco Bay Area",
      headline: "CTO at Taltrics | Ex-Portfolio Data Scientist at Genentech | Responsible AI Researcher | AI Leader at AI4Good",
      description: null,
      title: null,
      profile_picture_url: null,
      linkedin_url: null
    },
    score: 9,
    explanation: "Andy's headline and experience are highly relevant to the event's theme. He explicitly identifies as a 'Responsible AI Researcher' and 'AI Leader at AI4Good', with experience at 'Z-Inspection® Trustworthy AI Labs'. His work descriptions detail projects related to AI fairness (DE&I), AI for Good applications (SDGs, education), and AI trustworthiness/policy (EU AI Act). He is also a UC Berkeley alum and located in the San Francisco Bay Area, a reasonable travel distance to UCLA. This combination of direct expertise, location, and relevant experience makes him an excellent candidate for a keynote speaker or senior panelist on AI ethics and societal impact."
  },
  {
    profile: {
      id: 0,
      name: "Andreas Stolcke",
      location: "San Francisco Bay Area",
      headline: "Distinguished AI Scientist / VP at Uniphore",
      description: null,
      title: null,
      profile_picture_url: null,
      linkedin_url: null
    },
    score: 9,
    explanation: "Andreas is a highly accomplished AI scientist with extensive experience at major tech companies (Microsoft, Amazon) and research institutes (SRI, ICSI). He holds a PhD in AI/Computer Science from UC Berkeley, providing a strong UC connection and deep academic background. Located in the San Francisco Bay Area, he is within reasonable travel distance. While his profile doesn't explicitly state 'AI Ethics', his seniority, research focus, and academic ties strongly suggest he would be knowledgeable and impactful discussing the broader implications and future directions of AI, making him a very strong candidate for a keynote speaker or senior panelist."
  },
  {
    profile: {
      id: 3788458,
      name: "Elaine Sedenberg, PhD",
      location: "Washington, District of Columbia, United States",
      headline: "Global Affairs at Meta | Adjunct Lecturer Johns Hopkins SAIS",
      description: null,
      title: null,
      profile_picture_url: null,
      linkedin_url: null
    },
    score: 9,
    explanation: "Elaine's expertise is an exceptional match for the symposium theme. She is an Adjunct Lecturer teaching 'Information Policy Strategy and Design in the Age of AI' and has extensive experience in 'Privacy and Data Policy' at Meta. Her PhD is from the UC Berkeley School of Information, where she was Co-Director of the Center for Technology, Society & Policy, focusing on multidisciplinary research on the social and policy issues of technology. While located in Washington, DC, her highly relevant expertise, academic connections, and experience speaking on these topics make her a top-tier candidate for a keynote speaker or senior panelist, potentially warranting travel support or a virtual option if feasible for the event structure."
  },
  {
    profile: {
      id: 3737213,
      name: "Vidhi Chugh",
      location: "United Arab Emirates",
      headline: "AI Executive | Microsoft MVP | Futurist | AI Educator (100K+ Learners) | Global Keynote Speaker | Author | Board Advisor | World's Top 200 Innovators | Patent holder",
      description: null,
      title: "Chief AI Officer Instructor",
      profile_picture_url: "https://media.licdn.com/dms/image/v2/D5603AQH5dyogQYPAqQ/profile-displayphoto-shrink_800_800/B56ZTL71joGQAc-/0/1738588248729?e=1749686400&v=beta&t=HjJfmnIka9C6XkluJ6l55IjXaM9FqkV4qI5Yt3kowBU",
      linkedin_url: "https://www.linkedin.com/in/ACwAABWhUmgBldP7H70s7rM5Oc3SJGnvy27xviM"
    },
    score: 9,
    explanation: "This profile is a very strong fit in terms of subject matter and speaking experience. Vidhi's headline and experience clearly position them as an AI Executive, Futurist, Global Keynote Speaker, and AI Educator with explicit mentions of Responsible AI and AI Governance in speaking topics. As Head of AI and a fractional Chief AI Officer, they design AI strategies, risk assessment, and governance frameworks. They also direct AI4Diversity, a nonprofit educating communities about AI, which aligns with a university audience. The major drawback is the location (UAE), making in-person attendance potentially difficult and costly. However, their status as a 'Global Keynote Speaker' suggests a willingness and capability to travel for events, indicating a high likelihood of interest if contacted."
  }
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const res = await fetch('http://127.0.0.1:5000/api/ranking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      // If data is valid and has ranked results, return it
      if (data && Array.isArray(data.ranked) && data.ranked.length > 0) {
        console.log("Ranked data received from backend:", data.ranked);
        return NextResponse.json(data);
      }
      // Fallback if no ranked data
      console.log("No ranked data received from backend, using fallback.");
      return NextResponse.json({ ranked: fallbackProfiles });
    } catch {
      // Fallback if backend returns invalid JSON
      console.log("Invalid JSON from backend, using fallback.");
      return NextResponse.json({ ranked: fallbackProfiles });
    }
  } catch (err: any) {
    // Fallback if backend is unreachable
    console.log("Error connecting to backend, using fallback.", err.message);
    return NextResponse.json({ ranked: fallbackProfiles });
  }
}
