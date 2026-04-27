export type ExperienceItem = {
  company: string;
  position: string;
  duration: string;
  location: string;
  details: string[];
  link: string;
  logo: string;
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: "Eleken",
    position: "Design Engineer",
    duration: "Mar 2026 - Present",
    location: "Remote",
    link: "https://eleken.co/",
    logo: "/companies/eleken.jpeg",
    details: [
      "Built and maintained a scalable <b><u>React</u></b> <b><u>component library</u></b> and registry, standardizing <b><u>UI</u></b> development across applications.",
      "Designed and implemented production-ready components and application blocks from <b><u>Figma</u></b> to <b><u>React</u></b>, improving <b><u>design-to-code</u></b> consistency.",
      "Developed <b><u>17+</u></b> reusable <b><u>UI components</u></b> and corresponding <b><u>design systems</u></b>, accelerating frontend development workflows.",
      "Led frontend implementation of a full <b><u>product redesign</u></b> for <b><u>HighPoint</u></b>, including landing page architecture and initial <b><u>Next.js</u></b> implementation.",
      "Created end-to-end <b><u>design storyboards</u></b> and translated them into functional UI, bridging product design and engineering.",
    ],
  },
  {
    company: "Adobe",
    position: "Software Engineering Intern",
    duration: "Dec 2025 - Mar 2026",
    location: "Noida, India",
    link: "https://adobe.com",
    logo: "/companies/adobe.jpeg",
    details: [
      "Engineered a <b><u>cloud-based</u></b> <b><u>image upload pipeline</u></b>, reducing <b><u>API latency</u></b> by <b><u>28%</u></b> and improving reliability under high-volume traffic.",
      "Developed and deployed <b><u>RESTful microservices</u></b> (<b><u>Java</u></b>/<b><u>Python</u></b>) handling <b><u>10K+</u></b> daily requests, enhancing error handling and observability.",
      "Built reusable <b><u>React</u></b> components for internal dashboards, improving page load performance by <b><u>18%</u></b> and boosting user interaction.",
      "Improved system stability by resolving <b><u>15+</u></b> production issues and increasing <b><u>code coverage</u></b> from <b><u>62%</u></b> to <b><u>85%</u></b> through unit and integration testing.",
      "Led <b><u>caching optimization</u></b> efforts, reducing backend load by <b><u>25%</u></b> and improving response time consistency across services.",
    ],
  },
  {
    company: "Brilliant.org",
    position: "Software Intern",
    duration: "Mar 2025 - Oct 2025",
    location: "Remote",
    link: "https://brilliant.org/",
    logo: "/companies/brilliant.jpeg",
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
    logo: "/companies/smartgrids.jpeg",
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
    logo: "/companies/8thlight.jpeg",
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
    logo: "/companies/drdo.jpeg",
    details: [
      "Optimized integration of <b><u>ML</u></b> and <b><u>CV algorithms</u></b> (<b><u>ORB-SLAM2</u></b>, <b><u>EKF</u></b>, <b><u>OpenCV</u></b>) into autonomous drone navigation, achieving reliable <b><u>GPS-denied flight</u></b> and improving path accuracy by ~<b><u>95%</u></b> in simulation.",
      "Developed and validated algorithms for <b><u>multi-drone coordination</u></b> (<b><u>leader–follower formations</u></b>, <b><u>collision avoidance</u></b>) in <b><u>Gazebo/AirSim</u></b>, enabling swarm drones to navigate <b><u>dynamic environments</u></b> without collisions.",
    ],
  },
];
