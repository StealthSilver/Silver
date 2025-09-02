// data/experience.data.ts
export type ExperienceItem = {
  company: string;
  position: string;
  duration: string;
  location: string;
  details: string[];
  link: string;
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: "Brilliant.org",
    position: "Software Intern",
    duration: "Mar 2025 - Aug 2025",
    location: "Remote",
    link: "https://brilliant.org/",
    details: [
      "Integrated designer assets with Rive & Diagrammar, configuring state machines for high-fidelity production animations.",
      "Ensured 100% cross-platform fidelity of animations across Chrome, Safari, iOS, and Android, delivering a consistent experience for 3M+ learners.",
      "Built reusable interactive components (graph animations, vector updates) and enhanced the Elm + SVG/Canvas framework, improving lesson reusability by 40% and reducing rendering overhead by 25%.",
    ],
  },
  {
    company: "Smart Grid Analytics",
    position: "Software Development Intern",
    duration: "May 2024 - Nov 2024",
    location: "Bengaluru",
    link: "https://sgrids.com",
    details: [
      "Led Atheneum team to build a multi-tenant onboarding platform for renewable-energy providers, enabling seamless customer integration.",
      "Developed a low-code analytics dashboard builder with reusable widgets, cutting dashboard production time by 60% across clients.",
      "Rebuilt landing pages with Next.js (migrated from Angular), improving SEO and increasing organic traffic by 25%.",
      "Contributed to a patented Digital Twin system for solar plants that reduced DSM penalties by 20–40% in production.",
    ],
  },
  {
    company: "8th Light",
    position: "Software Developer ",
    duration: "Mar 2024 - May 2024",
    location: "Remote",
    link: "https://8thlight.com/",
    details: [
      "Collaborated with GENDEX healthcare donations team to deliver a new interface, enabling 3 successful donation campaigns with improved reliability and user experience.",
      "Architected and implemented backend APIs with Swagger documentation and Razorpay integration, enabling secure and robust transaction gateways and optimizing data flow for faster donation processing.",
    ],
  },
  {
    company: "DRDO, Centre for AI & Robotics",
    position: "Machine Learning Intern",
    duration: "Jan 2024 - Feb 2024",
    location: "Bengaluru",
    link: "https://www.drdo.gov.in/drdo/labs-and-establishments/centre-artificial-intelligence-robotics-cair",
    details: [
      "Optimized integration of ML and CV algorithms (ORB-SLAM2, EKF, OpenCV) into autonomous drone navigation, achieving reliable GPS-denied flight and improving path accuracy by ~95% in simulation.",
      "Developed and validated algorithms for multi-drone coordination (leader–follower formations, collision avoidance) in Gazebo/AirSim, enabling swarm drones to navigate dynamic environments without collisions.",
    ],
  },
];
