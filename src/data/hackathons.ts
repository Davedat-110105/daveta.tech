/*
 * The competition record, one entry per event. The homepage lists them in the
 * Experience section; each entry also renders its own page at
 * /hackathons/<slug>. Everything here is source-grounded: Greenlight from the
 * repo and my own write-up, Threshold and Controls at Scale from the case
 * studies my teammate Jeremiah Danniel Wong published, and the Seneca Software
 * Engineering Competition from the little that is on record. Add detail only
 * from a source; an empty section is better than an invented one.
 */

export type HackathonPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type HackathonSection = {
  label: string;
  heading: string;
  body: string[];
};

export type Hackathon = {
  slug: string;
  date: string;
  /** Short name for the record row. */
  name: string;
  /** Full event name for the detail page. */
  event: string;
  host: string;
  rank: string;
  project: string;
  summary: string;
  role?: string;
  team?: string[];
  stats?: Array<{ value: string; label: string }>;
  sections: HackathonSection[];
  stack?: string[];
  links?: Array<{ label: string; href: string }>;
  photos: HackathonPhoto[];
};

export const HACKATHONS: Hackathon[] = [
  {
    slug: "centennialhacks-2026",
    date: "Aug 2026",
    name: "CentennialHacks",
    event: "CentennialHacks 2026",
    host: "Centennial College",
    rank: "3rd",
    project: "Greenlight",
    summary:
      "Greenlight turns a utility bill into verified savings opportunities and official next steps: grounded reasoning over reviewed evidence, with the money math done by deterministic code.",
    role: "Backend",
    sections: [
      {
        label: "Brief",
        heading:
          "A bill goes in; a defensible list of programs and next steps comes out.",
        body: [
          "Rebate and efficiency programs are real money left on the table because eligibility is tedious to check. Greenlight reads the bill, retrieves reviewed program evidence, and produces steps a person can actually act on.",
        ],
      },
      {
        label: "My part",
        heading:
          "Route handlers, retrieval, and the line between model and calculator.",
        body: [
          "I worked the backend: OCR through Textract into S3, grounded reasoning routes through the Vercel AI SDK and OpenRouter, and reviewed program evidence retrieved from Postgres.",
          "Eligibility and financial calculations are deterministic backend code: the model explains and researches, it does not decide the numbers. Live web sources come back marked unreviewed so the interface can label them as such.",
        ],
      },
      {
        label: "Constraint",
        heading: "Three surfaces, one weekend, strict ownership.",
        body: [
          "Frontend, OCR, and backend were split with an explicit ownership map and a no-cross-editing rule, so parallel work did not turn into merge archaeology. The API contract was the coordination point.",
          "Third place, and a schema that survived the demo.",
        ],
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Vercel AI SDK",
      "OpenRouter",
      "AWS Textract",
      "S3",
      "Postgres",
      "Zod",
    ],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/naik26m3/centennialhacks2026",
      },
    ],
    photos: [
      {
        src: "/assets/centennial-hackathon/field-results-hall.jpg",
        alt: "The results hall at CentennialHacks 2026",
        width: 1616,
        height: 1080,
      },
      {
        src: "/assets/centennial-hackathon/field-award-certificates.jpg",
        alt: "Award certificates from CentennialHacks 2026",
        width: 1517,
        height: 1014,
      },
      {
        src: "/assets/centennial-hackathon/field-team.jpg",
        alt: "The Greenlight team during CentennialHacks 2026",
        width: 1440,
        height: 960,
      },
    ],
  },
  {
    slug: "seneca-energy-hackathon-2026",
    date: "May 2026",
    name: "Seneca Energy Hackathon",
    event: "Seneca Energy Hackathon 2026",
    host: "Seneca Polytechnic",
    rank: "1st",
    project: "Threshold",
    summary:
      "Threshold is a civic data platform for community energy vulnerability: public datasets and live signals fused into a map with scores, source citations, and recommended actions.",
    team: ["Dave Ta", "Jeremiah Danniel Wong", "Arlene Pham", "Kai Ngo"],
    stats: [
      { value: "9", label: "Public data feeds fused into one model" },
      { value: "122", label: "Brampton census tracts scored" },
      { value: "3", label: "Scenarios: baseline, heatwave, ice storm" },
      { value: "≤2", label: "Clicks from a map colour to its evidence" },
    ],
    sections: [
      {
        label: "Problem",
        heading:
          "Utility, city, climate, and census data never meet in one place.",
        body: [
          "Energy vulnerability data is spread across utility feeds, municipal open data, climate sources, and census datasets. Emergency managers and utility planners do not need another dashboard; they need to see where vulnerability is concentrated, why, and what to do next.",
        ],
      },
      {
        label: "Approach",
        heading:
          "Every recommendation traces to a number; every number traces to a public dataset.",
        body: [
          "We pulled structural, seasonal, and live signals from Alectra, Brampton open data, Esri, Statistics Canada, Open-Meteo, and Environment Canada, and normalized them into census-tract communities, facilities, weather cells, outages, and advisories.",
          "We scored each community under baseline, heatwave, and ice storm scenarios and laid outage, weather, flood, and advisory layers on top, then ranked recommendations by projected impact, cost, and confidence. Gemini writes the plain-language briefing around the evidence, with deterministic fallbacks; the model never produces the numbers.",
        ],
      },
      {
        label: "Build",
        heading: "All 122 tracts scored for the demo.",
        body: [
          "The frontend is React and TypeScript on Vite with Leaflet. The backend is FastAPI, and a Postgres pipeline moves data through raw, staging, curated, ml, and public layers.",
        ],
      },
    ],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Leaflet",
      "FastAPI",
      "Postgres",
      "SQLAlchemy",
      "Prefect",
      "MLflow",
      "Pandera",
      "Gemini",
    ],
    links: [
      {
        label: "Source on GitHub",
        href: "https://github.com/Davedat-110105/project_threshold",
      },
    ],
    photos: [
      {
        src: "/assets/seneca-hackathon/seneca-hackathon-threshold-third-shot.jpeg",
        alt: "The Threshold team at the Seneca Energy Hackathon",
        width: 2048,
        height: 1536,
      },
      {
        src: "/assets/seneca-hackathon/seneca-hackathon-threshold-team.jpeg",
        alt: "The Threshold team on stage at the Seneca Energy Hackathon",
        width: 1600,
        height: 1200,
      },
    ],
  },
  {
    slug: "fintech-summit-2026",
    date: "Apr 2026",
    name: "FinTech Summit, Rotman × BMO",
    event: "2026 FinTech Summit case competition",
    host: "Rotman Commerce FinTech Association × BMO",
    rank: "1st",
    project: "Controls at Scale",
    summary:
      "A hybrid AI and human framework for validating a bank's internal controls when more and more of its systems are AI. First of 15 teams from universities across the GTA.",
    stats: [
      { value: "10,400+", label: "Active controls at the case bank" },
      { value: "41%", label: "Missing an owner, frequency, or evidence" },
      { value: "77%", label: "Of its GenAI systems with no mapped controls" },
      { value: "8%", label: "Control testing coverage at the start" },
    ],
    sections: [
      {
        label: "Problem",
        heading: "Thousands of controls, and no way to see which ones worked.",
        body: [
          "The case bank, Northfield Bank, had thousands of controls but no reliable way to know which were complete, which were tested, and which covered its new AI systems.",
        ],
      },
      {
        label: "Approach",
        heading: "A seven-step pipeline where AI scores and humans decide.",
        body: [
          "We designed a Control Intelligence Layer: ingest and normalize control data, score each control on a five-part rubric, triage into pass, remediate, or escalate, rewrite weak controls with AI while keeping the originals, route them through tiered human review, map every AI system against its controls to find gaps, and keep re-scoring continuously instead of auditing once a year.",
          "Humans stay responsible for judgment. The review step includes a check that reviewers are actually evaluating rather than approving by default.",
        ],
      },
      {
        label: "Build",
        heading: "A prototype on cloud infrastructure.",
        body: [
          "The prototype ran the pipeline with AI models: simulated large-scale ingestion, automated scoring, AI-drafted remediation, and a feedback loop. Against the case data, the model projected testing coverage rising from 8% to 30% and data completeness from 59% to about 95%.",
        ],
      },
    ],
    photos: [
      {
        src: "/assets/uoft-hackathon/UofT-fintech-summit-team.jpg",
        alt: "The team at the 2026 FinTech Summit",
        width: 2000,
        height: 1528,
      },
      {
        src: "/assets/uoft-hackathon/UofT-fintech-summit-presentation.jpg",
        alt: "Presenting at the 2026 FinTech Summit",
        width: 2000,
        height: 1500,
      },
      {
        src: "/assets/uoft-hackathon/UofT-fintech-summit-post-competition.jpg",
        alt: "After the competition at the 2026 FinTech Summit",
        width: 2048,
        height: 1536,
      },
    ],
  },
  {
    slug: "seneca-software-engineering-competition-2025",
    date: "Dec 2025",
    name: "Seneca Software Engineering Competition",
    event: "Seneca Software Engineering Competition",
    host: "Seneca Polytechnic",
    rank: "1st",
    project: "Job Posting Validity Checker",
    summary:
      "A tool that flags fraudulent job listings before someone applies to them.",
    sections: [],
    photos: [],
  },
];

export function getHackathon(slug: string) {
  return HACKATHONS.find((hackathon) => hackathon.slug === slug);
}
