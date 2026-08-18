export type ProjectSection = {
  label: string;
  heading: string;
  body: string[];
};

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  /** Full title, kept for dialog labels and document titles. */
  title: string;
  /** The thing itself. Set at display scale. */
  name: string;
  /** What it is, set as a second line rather than joined by a dash. */
  descriptor: string;
  cover: string;
  role: string;
  year: string;
  status: string;
  summary: string;
  tags: string[];
  stack: string[];
  links: ProjectLink[];
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    title: "Astra Labs, Pioneer telemetry platform",
    name: "Astra Labs",
    descriptor: "Pioneer telemetry platform",
    cover: "/assets/shot-astralab.jpg",
    role: "Lead developer",
    year: "2025-2026",
    status: "Live · Launch Canada 2026",
    summary:
      "One deploy carrying a rocketry club's public record, its staff dashboard, and the authenticated telemetry ingest path behind them.",
    tags: ["Next.js 16", "Prisma", "Postgres", "AWS S3", "Docker"],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Prisma 6",
      "Postgres 16",
      "S3 presigned uploads",
      "Docker Compose",
      "MCP (aws-api)",
    ],
    links: [
      { label: "astralab.space", url: "https://www.astralab.space" },
      {
        label: "github.com/Davedat-110105/Abstra-Lab",
        url: "https://github.com/Davedat-110105/Abstra-Lab",
      },
    ],
    sections: [
      {
        label: "CONTEXT",
        heading:
          "A student rocketry program with a fifty-payload rideshare mission and no system of record.",
        body: [
          "Astra Labs is Seneca Polytechnic's student rocketry club, building the Pioneer vehicle for the Launch Canada 2026 Challenge: a 2.8 km target apogee and a suborbital rideshare simulation hosting fifty student-designed picosatellites.",
          "The club states radical transparency and documentation-for-the-future as core values, but the work lived across chat threads, drives, and spreadsheets. Flight data, member records, sponsor material, and the public journal each needed a home, and the maintainers are students on about five hours a week, so the system had to be boring to operate.",
        ],
      },
      {
        label: "APPROACH",
        heading:
          "A single Next.js application serving three audiences from one database.",
        body: [
          "The public surface documents the program: about, events, build-log posts, members, sponsorship tiers, and the Pioneer vehicle. Behind authentication, a staff dashboard handles member approvals, post and event creation, and the build-materials registry. Both read the same Prisma schema against Postgres 16.",
          "Telemetry frames land through a dedicated ingest route and surface on the dashboard as altitude, velocity, battery voltage, and originating ground station. Media goes to S3 through presigned uploads rather than the app server, so range photography never travels through the Next.js process.",
        ],
      },
      {
        label: "DECISIONS",
        heading:
          "Fail closed on ingest; make the whole stack reproducible in one command.",
        body: [
          "The ingest route requires a shared token and refuses writes when that token is unset. An unconfigured deploy accepts nothing: the right default for an endpoint whose only legitimate client is a ground station, and a property a competition review can verify.",
          "Everything is containerized: Postgres with a healthcheck, the frontend from a pinned Dockerfile, secrets required as environment variables rather than silently defaulted, and the database published on loopback only. A new club officer can bring the stack up without understanding any of it, which matters, because maintainers graduate.",
        ],
      },
      {
        label: "OUTCOME",
        heading: "The club's record now outlives the people who wrote it.",
        body: [
          "Public documentation, internal operations, and flight data run from one codebase with the schema in version control. Role checks separate members, staff, and admins, so officers publish posts, events, and materials without a developer in the loop.",
          "Next: broader telemetry history and charting on the dashboard, and a documented handover path for the crew that follows Launch Canada 2026.",
        ],
      },
    ],
  },
  {
    title: "Hana IELTS",
    name: "Hana IELTS",
    descriptor: "IELTS learning platform",
    cover: "/assets/shot-hana.jpg",
    role: "End-to-end build",
    year: "2026",
    status: "Deployed on Vercel",
    summary:
      "An IELTS learning platform for students and teachers: classes, skill practice, learning content, and progress-oriented workflows.",
    tags: ["Next.js", "Postgres", "Auth", "Media ingestion"],
    stack: [
      "Next.js",
      "Postgres",
      "Authentication",
      "Content ingestion",
      "Streamed uploads",
      "Object storage",
      "next/image",
    ],
    links: [
      { label: "hana-ielts.vercel.app", url: "https://hana-ielts.vercel.app" },
    ],
    sections: [
      {
        label: "SCOPE",
        heading:
          "One platform covering classes, practice, and content for two different kinds of user.",
        body: [
          "Students need skill practice and a sense of progress; teachers need to run classes and put material in front of them. Hana IELTS carries both, over shared content and one authentication model.",
          "I implemented the product and the systems under it end to end: frontend, authentication, book and content ingestion, uploads, storage, and responsive media.",
        ],
      },
      {
        label: "SYSTEMS",
        heading: "Ingestion and uploads were the hard part, not the pages.",
        body: [
          "Learning material arrives as books and long-form content that has to be parsed into something the app can address per skill and per class. Uploads are streamed rather than buffered, so large media does not have to fit in a request body, and served back through responsive next/image sizing.",
          "Postgres holds the content and the progress model; authentication gates the teacher surfaces from the student ones.",
        ],
      },
      {
        label: "NOTES",
        heading: "Write-up in progress.",
        body: [
          "Outcome numbers (active classes, ingested material, cohort size) are not published here yet. I would rather show a measured result than an estimate.",
        ],
      },
    ],
  },
  {
    title: "VerMCP, academic pathway MCP server",
    name: "VerMCP",
    descriptor: "Academic pathway MCP server",
    cover: "/assets/cover-vermcp.png",
    role: "Contributor",
    year: "2026",
    status: "Staging",
    summary:
      "A public, stateless MCP server that lets AI clients query reviewed course, prerequisite, and transfer data, then validate a proposed term plan with deterministic code.",
    tags: ["Python", "MCP", "pgvector", "Retrieval", "Vercel"],
    stack: [
      "Python 3.12",
      "Streamable HTTP MCP",
      "Postgres + pgvector",
      "Qwen embeddings",
      "Neon",
      "Vercel",
      "Cloudflare",
      "Prometheus + Grafana",
    ],
    links: [
      {
        label: "github.com/HuyDoan-2112/VerMCP-Pathway-Uni",
        url: "https://github.com/HuyDoan-2112/VerMCP-Pathway-Uni",
      },
    ],
    sections: [
      {
        label: "PROBLEM",
        heading:
          "Course planning advice from a language model is confident and frequently wrong.",
        body: [
          "Prerequisites, articulation agreements, and general-education rules are exactly the kind of structured fact a model will happily improvise. VerMCP puts a reviewed data layer between the model and the student, and does the arithmetic in code.",
        ],
      },
      {
        label: "DESIGN",
        heading:
          "Structured facts queried directly; prose retrieved only from registered official sources.",
        body: [
          "Nine public tools cover course search, details, prerequisites, articulation agreements, transfer requirements, missing requirements, section listings, document search, and term-plan validation. Eligibility and plan validation are deterministic Python, not model output.",
          "Academic prose is collected only from registered official sources, chunked per document type, embedded with a pinned model, human-reviewed, published at an exact version, and retrieved with citations. Heavy ingestion never runs inside an MCP request.",
        ],
      },
      {
        label: "BOUNDARIES",
        heading: "Stateless by design, and explicit about what it does not know.",
        body: [
          "No accounts, no transcripts, no saved plans. Completed and planned courses can be passed into a request but are never persisted. Institution, major, and academic-year scope is validated before any data is returned, and unpublished coverage is reported as unpublished rather than guessed.",
          "Every public tool response carries a human-review notice: VerMCP is not a counselor and does not certify a plan.",
        ],
      },
      {
        label: "OPERATIONS",
        heading: "A lightweight public function with the model on private hardware.",
        body: [
          "The public MCP process runs small (Vercel plus Neon) while the embedding model stays on an operator-controlled machine bound to loopback, reachable only through an authenticated HTTPS tunnel. Cloudflare handles distributed rate limiting in front of the public hostname; only MCP and health routes are reachable at all.",
          "Telemetry is aggregate: tool counts, latency, readiness, rate limits, pool capacity. Never student input, never response bodies.",
        ],
      },
    ],
  },
  {
    title: "Greenlight, CentennialHacks 2026",
    name: "Greenlight",
    descriptor: "CentennialHacks 2026",
    cover: "/assets/cover-greenlight.png",
    role: "Backend",
    year: "2026",
    status: "3rd place",
    summary:
      "Turns a utility bill into verified savings opportunities and official next steps: grounded reasoning with reviewed evidence, deterministic money math.",
    tags: ["Next.js", "AWS Textract", "OpenRouter", "Postgres"],
    stack: [
      "Next.js 16",
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
        label: "github.com/naik26m3/centennialhacks2026",
        url: "https://github.com/naik26m3/centennialhacks2026",
      },
    ],
    sections: [
      {
        label: "BRIEF",
        heading:
          "A bill goes in; a defensible list of programs and next steps comes out.",
        body: [
          "Rebate and efficiency programs are real money left on the table because eligibility is tedious to check. Greenlight reads the bill, retrieves reviewed program evidence, and produces steps a person can actually act on.",
        ],
      },
      {
        label: "MY PART",
        heading: "Route handlers, retrieval, and the line between model and calculator.",
        body: [
          "I worked the backend: OCR through Textract into S3, grounded reasoning routes through the Vercel AI SDK and OpenRouter, and reviewed program evidence retrieved from Postgres.",
          "Eligibility and financial calculations are deterministic backend code: the model explains and researches, it does not decide the numbers. Live web sources are returned marked unreviewed so the interface can label them as such.",
        ],
      },
      {
        label: "CONSTRAINT",
        heading: "Three surfaces, one weekend, strict ownership.",
        body: [
          "Frontend, OCR, and backend were split with an explicit ownership map and a no-cross-editing rule, so parallel work did not turn into merge archaeology. The API contract was the coordination point.",
          "Third place, and a schema that survived the demo.",
        ],
      },
    ],
  },
  {
    title: "Self-hosted homelab",
    name: "Self-hosted homelab",
    descriptor: "Proxmox on my own hardware",
    cover: "/assets/cover-homelab.png",
    role: "Operator",
    year: "2025-now",
    status: "Running",
    summary:
      "Proxmox on my own hardware serving client sites and internal services: the infrastructure half of the work, learned by having to keep it up.",
    tags: ["Proxmox", "Linux", "Docker", "Reverse proxy", "DNS"],
    stack: ["Proxmox VE", "Linux", "Docker", "Reverse proxy + TLS", "DNS", "Backups"],
    links: [
      {
        label: "github.com/Davedat-110105/ProxmoxVE",
        url: "https://github.com/Davedat-110105/ProxmoxVE",
      },
    ],
    sections: [
      {
        label: "WHY",
        heading:
          "Renting infrastructure teaches you the console; running it teaches you the failure modes.",
        body: [
          "Several client portfolios and internal tools are served from hardware I own, behind my own reverse proxy and DNS. When something breaks at 2am there is no support tier, which is the reason to do it.",
        ],
      },
      {
        label: "NOTES",
        heading: "Write-up in progress.",
        body: [
          "Topology, backup strategy, and uptime are worth documenting properly rather than summarizing loosely. Coming next.",
        ],
      },
    ],
  },
];

export type Deploy = {
  kind: string;
  host: string;
  url: string;
  note: string;
  img: string;
};

export const deploys: Deploy[] = [
  {
    kind: "PRODUCT",
    host: "astralab.space",
    url: "https://www.astralab.space",
    note: "Astra Labs public site and staff dashboard.",
    img: "/assets/shot-astralab.jpg",
  },
  {
    kind: "PRODUCT",
    host: "hana-ielts.vercel.app",
    url: "https://hana-ielts.vercel.app",
    note: "IELTS learning platform for students and teachers.",
    img: "/assets/shot-hana.jpg",
  },
  {
    kind: "CLIENT",
    host: "wendyliu.work",
    url: "https://wendyliu.work",
    note: "Portfolio site, designed and deployed.",
    img: "/assets/shot-wendyliu.jpg",
  },
  {
    kind: "CLIENT",
    host: "iliasabokro.com",
    url: "https://iliasabokro.com",
    note: "Portfolio with civil and mechanical drawing sets.",
    img: "/assets/shot-iliasabokro.jpg",
  },
  {
    kind: "SELF-HOSTED",
    host: "huydoan.work",
    url: "https://huydoan.work",
    note: "Research portfolio on my own hardware.",
    img: "/assets/shot-huydoan.jpg",
  },
  {
    kind: "SELF-HOSTED",
    host: "jeremiahwong.homeserverlocal.com",
    url: "https://jeremiahwong.homeserverlocal.com",
    note: "Portfolio, self-hosted alongside the rest.",
    img: "/assets/shot-jeremiahwong.jpg",
  },
];

export const wins = [
  {
    year: "2026",
    name: "CentennialHacks",
    project: "Greenlight",
    note: "Utility bills into verified savings: Textract OCR, grounded reasoning, deterministic eligibility math.",
    result: "3RD PLACE",
  },
  {
    year: "2025",
    name: "Seneca Software Engineering Competition",
    project: "Job Posting Validity Checker",
    note: "Job Posting Validity Checker, flagging fraudulent listings.",
    result: "1ST PLACE",
  },
  {
    year: "2025",
    name: "Seneca Hackathon",
    project: "Project Threshold",
    note: "Team build under a weekend clock.",
    result: "1ST PLACE",
  },
  {
    year: "2025",
    name: "UFD",
    project: "Rotman Commerce FinTech Association",
    note: "Finance and data challenge at Rotman, University of Toronto.",
    result: "1ST PLACE",
  },
];

export const community = [
  {
    name: "Astra Labs",
    org: "Seneca Polytechnic",
    note: "Lead developer for the student rocketry club: the software, the documentation culture, and onboarding new members onto both.",
  },
  {
    name: "Community volunteering",
    org: "City of Toronto",
    note: "Local volunteer work across city community programs.",
  },
];

export const creds = [
  { name: "Cloud & solutions certifications", org: "AWS" },
  { name: "Azure & developer certifications", org: "MICROSOFT" },
  { name: "Deep learning certifications", org: "NVIDIA" },
];

export const nav = [
  { href: "#work", label: "WORK" },
  { href: "#clients", label: "DEPLOYS" },
  { href: "#about", label: "ABOUT" },
  { href: "#contact", label: "CONTACT" },
];

export const links = {
  email: "tatandat110105@gmail.com",
  github: "https://github.com/Davedat-110105",
  linkedin: "https://www.linkedin.com/in/tan-dat-ta",
  certifications:
    "https://www.linkedin.com/in/tan-dat-ta/details/certifications/",
};
