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
      "Integrated designer assets with <b><u>Rive</u></b> & <b><u>Diagrammar</u></b>, configuring state machines for high-fidelity production animations.",
      "Ensured <b><u>100% cross-platform fidelity</u></b> of animations across <b><u>Chrome</u></b>, <b><u>Safari</u></b>, <b><u>iOS</u></b>, and <b><u>Android</u></b>, delivering a consistent experience for <b><u>3M+ learners</u></b>.",
      "Built reusable interactive components (<b><u>graph animations</u></b>, <b><u>vector updates</u></b>) and enhanced the <b><u>Elm + SVG/Canvas framework</u></b>, improving lesson reusability by <b><u>40%</u></b> and reducing rendering overhead by <b><u>25%</u></b>.",
    ],
  },
  {
    company: "Smart Grid Analytics",
    position: "Software Development Intern",
    duration: "May 2024 - Nov 2024",
    location: "Bengaluru",
    link: "https://sgrids.com",
    details: [
      "Led <b><u>Atheneum team</u></b> to build a <b><u>multi-tenant onboarding platform</u></b> for <b><u>renewable-energy providers</u></b>, enabling seamless customer integration.",
      "Developed a <b><u>low-code analytics dashboard builder</u></b> with reusable widgets, cutting dashboard production time by <b><u>60%</u></b> across clients.",
      "Rebuilt landing pages with <b><u>Next.js</u></b> (migrated from <b><u>Angular</u></b>), improving <b><u>SEO</u></b> and increasing organic traffic by <b><u>25%</u></b>.",
      "Contributed to a patented <b><u>Digital Twin system</u></b> for solar plants that reduced <b><u>DSM penalties</u></b> by <b><u>20–40%</u></b> in production.",
    ],
  },
  {
    company: "8th Light",
    position: "Software Developer",
    duration: "Mar 2024 - May 2024",
    location: "Remote",
    link: "https://8thlight.com/",
    details: [
      "Collaborated with <b><u>GENDEX healthcare donations team</u></b> to deliver a new interface, enabling <b><u>3 successful donation campaigns</u></b> with improved reliability and user experience.",
      "Architected and implemented <b><u>backend APIs</u></b> with <b><u>Swagger documentation</u></b> and <b><u>Razorpay integration</u></b>, enabling secure and robust transaction gateways and optimizing data flow for faster donation processing.",
    ],
  },
  {
    company: "DRDO, Centre for AI & Robotics",
    position: "Machine Learning Intern",
    duration: "Jan 2024 - Feb 2024",
    location: "Bengaluru",
    link: "https://www.drdo.gov.in/drdo/labs-and-establishments/centre-artificial-intelligence-robotics-cair",
    details: [
      "Optimized integration of <b><u>ML</u></b> and <b><u>CV algorithms</u></b> (<b><u>ORB-SLAM2</u></b>, <b><u>EKF</u></b>, <b><u>OpenCV</u></b>) into autonomous drone navigation, achieving reliable <b><u>GPS-denied flight</u></b> and improving path accuracy by ~<b><u>95%</u></b> in simulation.",
      "Developed and validated algorithms for <b><u>multi-drone coordination</u></b> (<b><u>leader–follower formations</u></b>, <b><u>collision avoidance</u></b>) in <b><u>Gazebo/AirSim</u></b>, enabling swarm drones to navigate <b><u>dynamic environments</u></b> without collisions.",
    ],
  },
];
