export const profile = {
  name: "Ayush Salunke",
  role: "Senior Software Engineer",
  tagline: "Builds deployment platforms that ship code faster.",
  location: "San Francisco Bay Area",
};

export const contact = {
  phone: "(669) 220-9962",
  email: "ayush.salunke250497@gmail.com",
  linkedin: "https://linkedin.com/in/ayush-salunke",
  github: "https://github.com/ayushsalunke",
};

export type Stat = { value: string; label: string; suffix?: string; target: number };

export const stats: Stat[] = [
  { value: "6", suffix: "+ years", label: "engineering experience", target: 6 },
  { value: "200", suffix: "+", label: "developers impacted", target: 200 },
  { value: "80", suffix: "%", label: "latency reduction", target: 80 },
  { value: "70", suffix: "%", label: "deploy complexity cut", target: 70 },
];

export const now = {
  title: "Leading deployment platform @ JPMorgan Chase",
  bullets: [
    "Orchestrating CI/CD for hundreds of services across global trading desks.",
    "Designed the next-gen release pipeline adopted org-wide.",
    "Mentor of record for two junior engineers promoted this cycle.",
  ],
};

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  accent: string;
  achievements: string[];
};

export const experiences: Experience[] = [
  {
    company: "JPMorgan Chase",
    role: "Senior Software Engineer",
    start: "Jun 2022",
    end: "Present",
    accent: "#0b2545",
    achievements: [
      "Led redesign of deploy platform cutting release complexity ~70%.",
      "Drove rollout strategy adopted by 200+ developers across LOBs.",
      "Built observability layer that reduced incident MTTR ~40%.",
    ],
  },
  {
    company: "UBS",
    role: "Software Engineer",
    start: "Jul 2019",
    end: "Jun 2021",
    accent: "#ec0016",
    achievements: [
      "Shaved 80% off critical pricing-service latency through profiling + cache redesign.",
      "Shipped reactive risk dashboard used by trading operations nightly.",
      "Automated compliance reporting — reclaimed ~15 engineer-hours/week.",
    ],
  },
  {
    company: "UBS",
    role: "Software Engineering Intern",
    start: "Jul 2018",
    end: "Nov 2018",
    accent: "#ec0016",
    achievements: [
      "Prototyped internal tool for bulk data reconciliation across ledgers.",
      "Returned with full-time offer based on pilot adoption metrics.",
    ],
  },
];

export type SkillCategory = { name: string; items: string[] };

export const skillCategories: SkillCategory[] = [
  { name: "Languages", items: ["TypeScript", "Python", "Java", "Go", "SQL", "Bash"] },
  { name: "Backend & Data", items: ["Spring Boot", "Node.js", "GraphQL", "PostgreSQL", "Kafka", "Redis"] },
  { name: "Frontend", items: ["React", "Next.js", "Tailwind", "Framer Motion", "Vite", "GSAP"] },
  { name: "Cloud & DevOps", items: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins", "GitHub Actions"] },
  { name: "Observability", items: ["Prometheus", "Grafana", "Datadog", "OpenTelemetry", "Splunk", "ELK"] },
];

export const potholeProject = {
  title: "Pothole Detection",
  subtitle: "Published · ICIAMR 2019",
  phases: [
    {
      label: "Problem",
      body: "Roads degrade silently. Manual surveys are slow and dangerous. We needed on-device vision that spots potholes from a dashcam in real time.",
    },
    {
      label: "CNN architecture",
      body: "MobileNet backbone fine-tuned on a custom Indian-roads dataset. Quantized for edge inference on a Raspberry Pi-class device.",
    },
    {
      label: "Results",
      body: "94% precision on held-out footage. Paper accepted at IEEE ICIAMR 2019.",
    },
  ],
};

export const parkSafeProject = {
  title: "ParkSafe",
  blurb: "Flask + OpenStreetMap mashup surfacing the safest legal parking near any destination, ranked by crime density.",
  stack: ["Flask", "OpenStreetMap", "Leaflet", "SQLite"],
};

export type School = { school: string; degree: string; gpa: string; years: string };

export const education: School[] = [
  {
    school: "Santa Clara University",
    degree: "MS, Computer Science & Engineering",
    gpa: "3.815",
    years: "2021 – 2023",
  },
  {
    school: "VIT Pune",
    degree: "B.Tech, Computer Engineering",
    gpa: "3.64",
    years: "2015 – 2019",
  },
];
