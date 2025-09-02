export type EducationItem = {
  company: string;
  position: string;
  duration: string;
  location: string;
  details: string[];
  link: string;
};

export const EDUCATION: EducationItem[] = [
  {
    company: "Indian Institute of Technology Madras",
    position: "Btech - Computer Science",
    duration: "2022 - 2026",
    location: "Chennai",
    link: "https://www.iitm.ac.in/",
    details: [
      "Integrated designer assets with Rive & Diagrammar, configuring state machines for high-fidelity production animations.",
      "Ensured 100% cross-platform fidelity of animations across Chrome, Safari, iOS, and Android, delivering a consistent experience for 3M+ learners.",
      "Built reusable interactive components (graph animations, vector updates) and enhanced the Elm + SVG/Canvas framework, improving lesson reusability by 40% and reducing rendering overhead by 25%.",
    ],
  },
  {
    company: "Indian Institute of Technology Madras",
    position: "BS - Data Science",
    duration: "2024 - 2027",
    location: "Online",
    link: "https://study.iitm.ac.in/ds/",
    details: [
      "Led Atheneum team to build a multi-tenant onboarding platform for renewable-energy providers, enabling seamless customer integration.",
      "Developed a low-code analytics dashboard builder with reusable widgets, cutting dashboard production time by 60% across clients.",
      "Rebuilt landing pages with Next.js (migrated from Angular), improving SEO and increasing organic traffic by 25%.",
      "Contributed to a patented Digital Twin system for solar plants that reduced DSM penalties by 20–40% in production.",
    ],
  },
];
