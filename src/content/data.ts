/**
 * Single source of truth for all site content.
 * Pulled directly from Atishay Jain's two résumés (Full Stack Engineer + Data Scientist).
 * Items marked `// TODO(atishay)` are placeholders awaiting real values.
 */

export type RoleId = "fullstack" | "data";

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface RoleProfile {
  id: RoleId;
  /** Full title, e.g. "Full Stack Software Engineer" */
  title: string;
  /** Short label used in toggles/badges */
  short: string;
  /** Friendly accent name */
  accentName: string;
  /** Hero rotating-word line, short and punchy */
  punch: string;
  /** Professional summary (verbatim-ish from résumé) */
  summary: string;
  /** 3 headline metrics shown in the hero for this role */
  metrics: { value: string; label: string }[];
  /** Downloadable résumé for this role */
  resumeHref: string;
  skills: SkillGroup[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  /** Tech/skill chips */
  tags: string[];
  /** Bullets per role; both keys always present so the toggle has content */
  bullets: Record<RoleId, string[]>;
}

export interface EducationItem {
  institution: string;
  credential: string;
  detail: string;
  period: string;
  score: string;
}

export interface PublicationItem {
  title: string;
  authors: string;
  venue: string;
  year: string;
  pages: string;
  href: string;
}

export interface AwardItem {
  title: string;
  issuer: string;
  detail: string;
  /** lucide icon key: "trophy" | "rocket" | "medal" | "award" */
  icon: "trophy" | "rocket" | "medal" | "award";
  /** Optional emphasised count, e.g. "×2" */
  badge?: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  /** Delivery platform, e.g. "Coursera" */
  platform?: string;
  year: string;
  /** Link to the certificate PDF in /public/certificates */
  href?: string;
  /** Spans two columns in the bento grid (feature tile) */
  wide?: boolean;
}

export const PERSON = {
  name: "Atishay Jain",
  initials: "AJ",
  location: "Melbourne, Australia",
  email: "atishay.it@gmail.com",
  // Phone kept private by default — flip `showPhone` to reveal.
  phone: "0423 632 030",
  showPhone: false,
  socials: {
    linkedin: "https://www.linkedin.com/in/atishayjain25",
    github: "https://github.com/atishayit",
    email: "mailto:atishay.it@gmail.com",
  },
  /** One-line elevator pitch shown under the name */
  blurb:
    "I build production-grade full-stack products and turn complex data into deployed intelligence — two disciplines, one engineer.",
};

export const ROLES: Record<RoleId, RoleProfile> = {
  fullstack: {
    id: "fullstack",
    title: "Full Stack Software Engineer",
    short: "Full Stack",
    accentName: "Cobalt",
    punch: "ship end-to-end products",
    summary:
      "Software Engineer with 3+ years architecting scalable web applications in React, TypeScript, C#, and Python. Led end-to-end product development as the sole engineer for HostyNest — a production platform on Supabase, Stripe, and CI/CD. I specialise in modernising legacy systems, shipping rapid MVPs, and deploying secure solutions on AWS and Azure.",
    metrics: [
      { value: "3+ yrs", label: "Engineering experience" },
      { value: "Sole eng.", label: "HostyNest, end-to-end" },
      { value: "US-scale", label: "Production deployments" },
    ],
    resumeHref: "/resume/Atishay-Jain-Full-Stack-Engineer.pdf",
    skills: [
      { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C#", "C++", "SQL"] },
      { group: "Frontend", items: ["React", "Next.js", "Angular", "Vue.js", "Tailwind CSS", "Figma"] },
      { group: "Backend", items: ["Node.js", "ASP.NET Core", "Supabase Edge Functions", "PostgreSQL", "NoSQL"] },
      { group: "Cloud & DevOps", items: ["AWS (Lambda, S3, Polly, Textract)", "Azure", "Docker", "GitHub Actions"] },
      { group: "Tools", items: ["Git", "Stripe API", "JIRA", "MSAL", "Google Analytics"] },
    ],
  },
  data: {
    id: "data",
    title: "Data Scientist",
    short: "Data Science",
    accentName: "Teal",
    punch: "turn data into decisions",
    summary:
      "Data Scientist with expertise in Machine Learning, Statistical Analysis, and Data Engineering. Proven track record building scalable ETL pipelines on Azure and deploying hybrid DL models (LSTM/CNN) across healthcare and energy. I transform complex datasets into actionable business insight with Python and SQL.",
    metrics: [
      { value: "LSTM/CNN", label: "Hybrid DL models" },
      { value: "Hospitals", label: "US healthcare deployment" },
      { value: "2 papers", label: "IEEE publications" },
    ],
    resumeHref: "/resume/Atishay-Jain-Data-Scientist.pdf",
    skills: [
      { group: "ML & Deep Learning", items: ["Python (Pandas, NumPy)", "scikit-learn", "PyTorch", "TensorFlow", "LSTM / CNN"] },
      { group: "Data Engineering", items: ["Azure Data Factory", "Databricks", "Synapse", "ETL Pipelines"] },
      { group: "Cloud", items: ["AWS (S3, Lambda)", "Azure"] },
      { group: "Visualization", items: ["Power BI", "Tableau", "Matplotlib", "Seaborn"] },
      { group: "Statistics", items: ["A/B Testing", "Hypothesis Testing", "Regression", "Bayesian Inference"] },
    ],
  },
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "HostyNest",
    role: "Full Stack Engineer",
    location: "Melbourne, Australia",
    period: "Mar 2025 — Present",
    tags: ["React", "TypeScript", "Supabase", "Stripe", "GitHub Actions"],
    bullets: {
      fullstack: [
        "Sole engineer architecting the end-to-end web platform — from Figma designs to production deployment with React (TypeScript) and Supabase.",
        "Built a modular, production-grade app with role-based access control (RBAC) and real-time availability syncing via the Google Calendar API.",
        "Engineered serverless workflows on Supabase Edge Functions to automate authentication, booking management, and email notifications (EmailJS).",
        "Integrated Stripe for secure payments and automated CI/CD via GitHub Actions for seamless deployment.",
      ],
      data: [
        "Designed the full-stack data architecture and PostgreSQL schemas to manage user data and booking transactions securely.",
        "Built real-time dashboards visualising booking trends — syncing 1,000+ daily events with <200ms latency and 99.9% booking accuracy.",
        "Built serverless ETL pipelines on Supabase Edge Functions to automate data ingestion, reducing manual entry by 40%.",
        "Implemented automated deployment pipelines and secure data-handling protocols for payment processing.",
      ],
    },
  },
  {
    company: "Veersa Technologies",
    role: "Software Engineer",
    location: "India",
    period: "Aug 2023 — Jan 2025",
    tags: ["C#", "ASP.NET", "Angular", "Generative AI", "AWS Polly"],
    bullets: {
      fullstack: [
        "Led backend and frontend development across C#, ASP.NET, Visual Basic, Angular, PostgreSQL, and NoSQL — improving system efficiency and scalability.",
        "Developed a Generative-AI MVP in React TypeScript + Python3 within three weeks to meet client requirements.",
        "Integrated AWS Polly for text-to-speech in an e-learning portal, deployed across US-based education platforms.",
        "Recognised as ‘Achiever of the Month’ twice and nominated ‘Highflyer of the Month’ for delivering critical MVPs under tight deadlines.",
      ],
      data: [
        "Delivered a Generative-AI MVP (React, Python) in just 3 weeks — projected to save the client $20,000 annually in operational costs.",
        "Led full-stack development across C#, ASP.NET, Angular, PostgreSQL, and NoSQL to enhance scalability.",
        "Integrated AWS Polly for text-to-speech in a US-deployed e-learning portal.",
        "Collaborated cross-functionally with JIRA and Git across three environments; ‘Achiever of the Month’ ×2.",
      ],
    },
  },
  {
    company: "Veersa Technologies",
    role: "Data Science Intern",
    location: "India",
    period: "Aug 2022 — Jul 2023",
    tags: ["Azure Data Factory", "Databricks", "ML/DL", "AWS Textract"],
    bullets: {
      fullstack: [
        "Built an AI-powered document-processing solution with AWS Textract, S3, ECR, Lambda, EC2, Python3, Flask, Vue.js, and MSAL.",
        "Orchestrated ETL workflows across Azure Data Factory, Databricks, and Synapse to optimise data pipelines.",
        "Authored a hybrid ML-DL model for disease prediction, deployed in US hospitals.",
      ],
      data: [
        "Orchestrated ETL workflows across Azure Data Factory (ADF), Databricks, and Synapse to optimise pipelines for efficient processing.",
        "Designed and authored a hybrid ML-DL model for disease prediction, deployed in US hospitals to enhance diagnostic accuracy.",
        "Developed an AI document-processing solution (AWS Textract, S3, ECR, Lambda, EC2, Python3, Flask, Vue.js, MSAL) automating extraction of medical & insurance forms.",
      ],
    },
  },
  {
    company: "EdenEco Smart Homes",
    role: "Software Development Engineer Intern",
    location: "Remote",
    period: "Nov 2020 — Jan 2021",
    tags: ["LSTM", "Time-Series", "Deep Learning"],
    bullets: {
      fullstack: [
        "Built an LSTM-based deep learning model to predict hourly electricity consumption for the AEP Power Grid.",
        "Applied advanced deep learning to analyse energy-consumption patterns and improve forecasting accuracy.",
        "Received a ‘Certificate of Excellence’ for the model's development and high accuracy.",
      ],
      data: [
        "Developed an LSTM-based deep learning model to forecast hourly electricity consumption for the AEP Power Grid.",
        "Applied advanced time-series techniques to analyse energy-consumption patterns and improve accuracy.",
        "Received a ‘Certificate of Excellence’ for the successful, high-accuracy LSTM energy-forecasting model.",
      ],
    },
  },
];

export const EDUCATION: EducationItem[] = [
  {
    institution: "Deakin University",
    credential: "Master of Data Science (Professional)",
    detail: "Melbourne, Australia",
    period: "Mar 2025 — Nov 2026 (Expected)",
    score: "86%",
  },
  {
    institution: "AKTU",
    credential: "B.Tech, Information Technology",
    detail: "Uttar Pradesh, India",
    period: "Aug 2019 — Jun 2023",
    score: "86.7%",
  },
];

export const PUBLICATIONS: PublicationItem[] = [
  {
    title: "CNN & M-BDLSTM Usage to Forecast Hourly Energy Use",
    authors: "Gupta, P., Kumar, S., Vardhan, H., Singh, S., Singh, A., & Jain, A.",
    venue: "2023 1st Intl. Conference on Intelligent Computing and Research Trends (ICRT), IEEE",
    year: "2023",
    pages: "pp. 1–8",
    href: "https://ieeexplore.ieee.org/abstract/document/10146717",
  },
  {
    title: "Real-Time Surveillance System for Women's Safety and Crime Detection in Public Area",
    authors: "Singh, S., Swaroop, B., Kumar, S., Singh, A., & Jain, A.",
    venue: "2023 1st Intl. Conference on Intelligent Computing and Research Trends (ICRT), IEEE",
    year: "2023",
    pages: "pp. 1–6",
    href: "https://ieeexplore.ieee.org/abstract/document/10146679",
  },
];

export const AWARDS: AwardItem[] = [
  {
    title: "Achiever of the Month",
    issuer: "Veersa Technologies",
    detail: "Awarded twice — Mar 2024 & Jan 2023 — for delivering critical MVPs under tight deadlines.",
    icon: "trophy",
    badge: "×2",
  },
  {
    title: "Highflyer of the Month",
    issuer: "Veersa Technologies",
    detail: "Nominated for exceptional client delivery and rapid product turnaround.",
    icon: "rocket",
    badge: "Nominee",
  },
  {
    title: "Certificate of Excellence",
    issuer: "EdenEco Smart Homes",
    detail: "For the LSTM energy-forecasting model and its high prediction accuracy.",
    icon: "medal",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    title: "Meta Front-End Developer",
    issuer: "Meta",
    platform: "Coursera · 9-course Professional Certificate",
    year: "2023",
    href: "/certificates/meta-front-end-developer.pdf",
    wide: true,
  },
  {
    title: "Google IT Automation with Python",
    issuer: "Google",
    platform: "Coursera · 6-course Professional Certificate",
    year: "2020",
    href: "/certificates/google-it-automation-python.pdf",
    wide: true,
  },
  {
    title: "IBM Machine Learning",
    issuer: "IBM",
    platform: "Coursera · 6-course Professional Certificate",
    year: "2020",
    href: "/certificates/ibm-machine-learning.pdf",
  },
  {
    title: "IBM Applied AI",
    issuer: "IBM",
    platform: "Coursera · 6-course Professional Certificate",
    year: "2020",
    href: "/certificates/ibm-applied-ai.pdf",
  },
  {
    title: "Data Science Fundamentals with Python and SQL",
    issuer: "IBM",
    platform: "Coursera · 5-course Specialization",
    year: "2021",
    href: "/certificates/ibm-data-science-fundamentals.pdf",
    wide: true,
  },
  {
    title: "Big Data Hadoop and Spark Developer",
    issuer: "Simplilearn",
    year: "2022",
    href: "/certificates/big-data-hadoop-spark.pdf",
    wide: true,
  },
  {
    title: "National Level Quiz — Data Structures & Algorithms in C",
    issuer: "University Academy",
    platform: "Scored 80%",
    year: "2020",
    href: "/certificates/national-quiz-data-structures.pdf",
    wide: true,
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Awards", href: "#recognition" },
  { label: "Projects", href: "/projects/" },
  { label: "Publications", href: "#publications" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];
