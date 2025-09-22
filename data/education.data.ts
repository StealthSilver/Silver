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
    position: "BTech - Computer Science",
    duration: "2022 - 2026",
    location: "Chennai",
    link: "https://www.iitm.ac.in/",
    details: [
      "Served as <b><u>Head of TechSoc</u></b> for 3 years, leading 20+ student developers and organizing major technical festivals at IIT Madras.",
      "Solved <b><u>500+ LeetCode</u></b> problems and achieved <b><u>1800+ rating</u></b> on CodeChef, demonstrating strong problem-solving and competitive programming expertise.",
      "Contributed to research and development of <b><u>patented DSM & Digital Twin</u></b> systems for renewable energy optimization.",
    ],
  },
  {
    company: "Indian Institute of Technology Madras",
    position: "BS - Data Science",
    duration: "2024 - 2027",
    location: "Online",
    link: "https://study.iitm.ac.in/ds/",
    details: [
      "Specialized in <b><u>Data Science & Machine Learning</u></b> with projects in predictive modeling, large-scale analytics, and optimization.",
      "Achieved top performance in <b><u>Kaggle competitions</u></b>, winning multiple challenges and gaining hands-on experience with real-world datasets.",
      "Built scalable <b><u>data pipelines & dashboards</u></b> for analytics-driven decision-making in academic and industry projects.",
    ],
  },
];
