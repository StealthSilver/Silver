export const PROJECT_TAGS = [
  "AI/ML",
  "FullStack",
  "Frontend",
  "Backend",
  "Mobile",
  "Game",
  "Web3",
] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];

export type ProjectBase = {
  title: string;
  description: string;
  tags: ProjectTag[];
  story?: string;
  storyPoints?: string[];
  image: string;
  lightImage?: string;
  logo: string;
  lightLogo?: string;
  darkLogo?: string;
  live?: string;
  github?: string;
  figma?: string;
};

export type Project = ProjectBase & {
  id: string;
  slug: string;
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PROJECT_RECORDS: ProjectBase[] = [
  {
    title: "MeshSpire",
    description: "A peer to peer learning app for students",
    tags: ["FullStack"],
    image: "/projects/meshspire.png",
    logo: "/project_logo/meshspire.svg",
    live: "https://dev.dg4uqajhampr9.amplifyapp.com/",
    github: "https://github.com/StealthSilver/MeshSpire-lp",
    figma:
      "https://www.figma.com/design/fkprR8ZCbDezgeWweqLc6X/MS-landing?node-id=0-1&t=gscDeXAEkqGmTJlM-1",
  },
  {
    title: "Verdan",
    description: "A plantation management and monitoring platform",
    tags: ["FullStack", "Mobile"],
    image: "/projects/verdan.png",
    logo: "/project_logo/verdan.svg",
    live: "https://verdan-main.vercel.app/",
    github: "https://github.com/StealthSilver/Verdan",
    figma:
      "https://www.figma.com/design/hB3sQuOb3ztReunlyvGiEN/VERDAN?node-id=0-1&t=OitKgQLjk7bXnfYA-1",
  },
  {
    title: "Spardha",
    description: "AI prep for competitive exams with practice, tests, and analytics",
    tags: ["AI/ML", "FullStack"],
    image: "/projects/spardha.png",
    logo: "/project_logo/spardha.svg",
    live: "https://spardha-topaz.vercel.app/",
    github: "https://github.com/StealthSilver/Spardha",
    figma:
      "https://www.figma.com/design/HTVIDAbVfEn8CzWVvqVoMs/Sgrids?node-id=0-1&t=SsSC4rk4RVRXyaHK-1",
  },
  {
    title: "Sol-X",
    description: "A project management application",
    tags: ["FullStack", "Mobile"],
    image: "/projects/connectingdots.png", //
    logo: "/project_logo/sol-X.svg",
    live: "https://your-live-site.com", //
    github: "https://github.com/StealthSilver/ConnectingDots",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "AlgoRhythm",
    description: "A programming algorithm visualisation platform",
    tags: ["FullStack"],
    image: "/projects/algorhythm.png", //
    logo: "/project_logo/algorhythm.svg",
    darkLogo: "/project_logo/algorhythm-dark.svg",
    live: "https://algo-rhythm-nine.vercel.app/", //
    github: "https://github.com/StealthSilver/AlgoRhythm",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Sgrids",
    description: "Landing page for Renewables SAP application",
    story:
      "I created this for Smart Grid Analytics while the company was going through a full redesign. The goal was a flagship public face that felt enterprise-credible but still alive on the screen, so I built a page full of relevant animations and motion that reinforce the product story instead of distracting from it. That turned into a complete enterprise redesign of the landing experience: structure, visuals, and narrative aligned for a technical B2B audience. I implemented it in Next.js with modern design principles—clear hierarchy, generous spacing, fast-feeling interactions—and I owned SEO so the new site could be discovered and understood by search engines. Smart Grid Analytics adopted the new landing page for production. The project took a lot of thought and iteration; it felt more like a creative process—brand, story, and craft—than a straight coding journey, and that is what made the outcome feel earned.",
    storyPoints: [
      "Context: Smart Grid Analytics was redesigning; the public site needed to match a maturing product and instill trust with enterprise visitors.",
      "Creative: Designed motion and section-level animation that supports the renewables and analytics narrative without undermining a serious B2B tone.",
      "Build: Shipped the landing in Next.js with a modern layout system, responsive behavior, and performance-minded implementation.",
      "Discoverability: Applied semantic structure and SEO so titles, descriptions, and content could rank and share cleanly after launch.",
      "Outcome: The organization adopted the new landing page; the work balanced marketing narrative, visual design, and frontend engineering.",
    ],
    tags: ["Frontend"],
    image: "/projects/sgrids.png",
    lightImage: "/projects/sgrids-light.png",
    logo: "/project_logo/sgrids.svg",
    live: "https://sgrids.vercel.app/",
    github: "https://github.com/StealthSilver/sgrids-lp",
    figma:
      "https://www.figma.com/design/HTVIDAbVfEn8CzWVvqVoMs/Sgrids?node-id=0-1&t=SsSC4rk4RVRXyaHK-1",
  },
 
  {
    title: "MindPalace",
    description: "An organization and management application",
    tags: ["FullStack"],
    image: "/projects/mindpalace.png", //
    logo: "/project_logo/mplogo.svg",
    live: "https://mind-palace-eight.vercel.app/", //
    github: "https://github.com/StealthSilver/MindPalace",
    figma: "https://figma.com/file/your-figma-link", //
  },

  {
    title: "GameZone",
    description: "A zone for classical games",
    tags: ["FullStack", "Mobile", "Game"],
    image: "/projects/gamezone.png", //
    logo: "/project_logo/game.svg",
    live: "https://game-zone-bay-xi.vercel.app/", //
    github: "https://github.com/StealthSilver/GameZone",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Silver-UI",
    description: "A modern Ui component library",
    tags: ["Frontend"],
    image: "/projects/silver-ui.png",
    logo: "/project_logo/silverui.svg",
    live: "https://silver-ui.vercel.app/",
    github: "https://github.com/StealthSilver/Silver-UI",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Sketch-It",
    description: "A colloborative drawing application",
    tags: ["FullStack"],
    image: "/projects/sketchit.png", //
    logo: "/project_logo/sketchit.svg",
    live: "https://sketch-it-nine.vercel.app/", //
    github: "https://github.com/StealthSilver/SketchIt",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "InfinityX",
    description: "Real time workflow mamagement applicaion",
    tags: ["FullStack", "AI/ML"],
    image: "/projects/infinityx.png", //
    logo: "/project_logo/infinityx.svg",
    live: "https://infinity-x-landing.vercel.app/", //
    github: "https://github.com/StealthSilver/InfinityX",
    figma: "https://figma.com/file/your-figma-link", //
  },
  
  {
    title: "RiffinityAI",
    description: "An AI companion application with multiple models",
    story:
      "RiffinityAI started from a practical problem I kept facing while testing large language models: every model produced different responses, but comparing them required jumping between tools and tabs. I wanted a single AI chatbot workspace that brings all available models together so users can interact, compare, and decide faster without losing context. I built it with a clean chat-first flow, fast model switching, and response layouts designed for side-by-side evaluation. The goal was not just to chat with AI, but to help users confidently choose the best answer by seeing quality differences clearly. As I iterated, I focused heavily on conversational UX and interaction quality to make the platform feel responsive, readable, and engaging. The result is a model-comparison system that improves trust in outputs and increases user satisfiability through richer interaction with AI models.",
    storyPoints: [
      "Problem: Comparing responses across models was slow, fragmented, and hard to evaluate.",
      "Approach: Built one AI chatbot interface that includes all available models in a single flow.",
      "Build focus: Fast model switching, consistent prompt context, and clear response readability.",
      "Core value: Users can compare model depth, tone, and relevance side-by-side before deciding.",
      "Impact: Better decision confidence and higher user satisfiability through deeper AI interaction.",
    ],
    tags: ["AI/ML", "FullStack"],
    image: "/projects/riffinity.png",
    logo: "/project_logo/riffinity.svg",
    lightLogo: "/project_logo/riffinity-light.svg",
    live: "https://riffinity-landing.vercel.app/",
    github: "https://github.com/StealthSilver/Riffinity",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "ConnectRight",
    description: "A low latency video confrencing platforms",
    tags: ["FullStack", "Backend"],
    image: "/projects/connectright.png",
    logo: "/project_logo/cr.svg",
    live: "https://connect-right.vercel.app/",
    github: "https://github.com/StealthSilver/ConnectRight",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Intersecting Lines",
    description: "A blog page for stories, poems and essays",
    story:
      "Intersecting Lines grew from wanting a place on the web that treated reading as the main event, not engagement metrics. I imagined a reader-first site where someone could arrive, settle in, and spend time with literature: short stories, poems, book reviews, and essays, all in one calm feed. Generic likes and dislikes never felt right for that kind of work, so I replaced them with reactions that actually name a feeling—Hopeful, Wisper, Warmth—so readers can respond to a piece in a way that matches how writing lands emotionally. The interface stays clean and minimal on purpose: generous type, plenty of space, and nothing that competes with the words on the page. Behind the scenes, publishing stays simple: new work is just content in a markdown file, so adding a story or a review stays as straightforward as writing, without fighting the CMS.",
    storyPoints: [
      "Problem: Most blogs optimize for clicks and shallow signals; literature deserves a quieter, more respectful reading experience.",
      "Approach: Designed a reader-first layout with typography and spacing tuned for long-form reading across stories, poems, reviews, and essays.",
      "Differentiation: Swapped binary like/dislike for meaningful reactions (Hopeful, Wisper, Warmth) so feedback reflects mood, not just approval.",
      "Author workflow: Content ships from markdown files, so contributors add or edit pieces by writing markdown without a heavy publishing flow.",
      "Outcome: A minimal, easy-to-read surface that keeps attention on the writing while staying simple to extend with new pieces.",
    ],
    tags: ["Frontend", "FullStack"],
    image: "/projects/blog.png",
    lightImage: "/projects/blog-light.png",
    logo: "/project_logo/intersectinglines.svg",
    darkLogo: "/project_logo/intersectinglines-dark.svg",
    live: "https://intersecting-lines.vercel.app/",
    github: "https://github.com/StealthSilver/Intersecting-Lines",
    figma:
      "https://www.figma.com/design/b00XL5lXg2hl2jUNbtePw9/Silver-s-Desk?node-id=0-1&t=MGYZvAoWbktNGfIE-1",
  },
  {
    title: "BinaryNetwork",
    description: "A professional social media platform",
    tags: ["FullStack"],
    image: "/projects/binarynetwork.png", //
    logo: "/project_logo/binarynetwork.svg",
    live: "https://binary-network.vercel.app/", // landing page
    github: "https://github.com/StealthSilver/BinaryNetwork",
    figma: "https://figma.com/file/your-figma-link", //
  },

  {
    title: "DevOrbit",
    description: "Application for deploying and editing codebase",
    tags: ["FullStack", "Backend", "AI/ML"],
    image: "/projects/devorbit.png", //
    logo: "/project_logo/devorbit.svg",
    live: "https://your-live-site.com", //
    github: "https://github.com/StealthSilver/DevOrbit",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Taskly",
    description: "A task management application",
    tags: ["FullStack", "Mobile"],
    image: "/projects/taskly.png", //
    logo: "/project_logo/taskly.svg",
    live: "https://taskly-bay.vercel.app/", //
    github: "https://github.com/StealthSilver/Taskly",
    figma: "https://figma.com/file/your-figma-link", //
  },

  {
    title: "Silver",
    description: "A portfolio application in nextjs ",
    tags: ["Frontend"],
    image: "/projects/silver.png",
    logo: "/project_logo/silver-l.svg",
    darkLogo: "/project_logo/silver-dark.svg",
    live: "https://silver-jet.vercel.app/",
    github: "https://github.com/StealthSilver/Silver",
    figma:
      "https://www.figma.com/design/vX7gVhAgVACysF1aFNcCtj/Portfolio?node-id=36-541&t=zlVUk0IN29zpPcVg-1",
  },

 

  {
    title: "Form and Function",
    description: "A modern and original design agency website",
    tags: ["Frontend"],
    image: "/projects/form&function.png",
    logo: "/project_logo/formandfunction.svg",
    lightLogo: "/project_logo/formandfunction-light.svg",
    live: "https://form-function.vercel.app/",
    github: "https://github.com/StealthSilver/Form-Function",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Alcaster",
    description: "A blackcahin legacy archive platform",
    tags: ["FullStack", "Backend", "Web3"],
    image: "/projects/alcaster.png", //
    logo: "/project_logo/alcaster.svg",
    live: "https://alcaster.vercel.app/", //
    github: "https://github.com/StealthSilver/Alcaster",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "BridgePay",
    description: "An end to end payment gateway application",
    tags: ["Backend"],
    image: "/projects/bridgepay.png", //
    logo: "/project_logo/bridgepay.svg",
    live: "https://bridge-pay-vve4.vercel.app/", // backend deploy
    github: "https://github.com/StealthSilver/BridgePay",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "Prominent",
    description: "Low Latency real time trading and investment application",
    tags: ["Backend"],
    image: "/projects/prominent.png", //
    logo: "/project_logo/promlogo.svg",
    live: "https://prominent-eight.vercel.app/", // -> landing page
    github: "https://github.com/StealthSilver/Prominent",
    figma:
      "https://www.figma.com/design/UhdHOIha7xWSdqZwHjCc7M/Prominent?node-id=1-2&t=37UrjNWrYqGqM5ym-1", //
  },
  {
    title: "Meetmux",
    description: "Landing page for a social media platform",
    tags: ["Frontend"],
    image: "/projects/metmux.png",
    logo: "/project_logo/meetmux.png",
    live: "https://meet-mux-xi.vercel.app/",
    github: "https://github.com/StealthSilver/MeetMux",
    figma: "https://figma.com/file/your-figma-link", //
  },
  {
    title: "ConnectingDots",
    description: "A course selling application with LMS",
    tags: ["FullStack"],
    image: "/projects/connectingdots.png", //
    logo: "/project_logo/sol-X.svg",
    live: "https://your-live-site.com", //
    github: "https://github.com/StealthSilver/ConnectingDots",
    figma: "https://figma.com/file/your-figma-link", //
  },
];

export const PROJECTS: Project[] = PROJECT_RECORDS.map((p, i) => ({
  ...p,
  id: `project-${i + 1}`,
  slug: slugify(p.title),
}));

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
