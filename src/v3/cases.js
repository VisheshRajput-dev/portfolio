/**
 * Case studies for /project/:id. Copy for the web projects comes from the
 * original project pages; DoMore's from its own site; PointsFly's from its
 * public description.
 */
import { projects } from "./data";
import realdesk3 from "../assets/domeimages/realdesk/3.png";
import realdesk4 from "../assets/domeimages/realdesk/4.png";
import realdesk5 from "../assets/domeimages/realdesk/5.png";
import realdesk2 from "../assets/domeimages/realdesk/2.png";
import devsync1 from "../assets/domeimages/devsync/1.png";
import devsync2 from "../assets/domeimages/devsync/2.png";
import devsync3 from "../assets/domeimages/devsync/3.png";
import devsync5 from "../assets/domeimages/devsync/5.png";
import vishtishop1 from "../assets/domeimages/vishtishop/1.png";
import vishtishop2 from "../assets/domeimages/vishtishop/2.png";
import vishtishop4 from "../assets/domeimages/vishtishop/4.png";
import vishtishop5 from "../assets/domeimages/vishtishop/5.png";
import vishticonvertor1 from "../assets/domeimages/vishticonvertor/1.png";
import vishticonvertor2 from "../assets/domeimages/vishticonvertor/2.png";
import vishticonvertor3 from "../assets/domeimages/vishticonvertor/3.png";
import vishticonvertor7 from "../assets/domeimages/vishticonvertor/7.png";

/*
 * Each case is told in chapters: one device (a phone or a browser), one
 * screen, one caption. Screens for the apps live in public/work/<slug>/;
 * until a file is there, the page draws a placeholder in its place.
 */
const app = (slug, n) => `/work/${slug}/app-${n}.png`;

const details = [
  {
    id: 5,
    slug: "pointsfly",
    tagline: "India's first AI-native rewards app",
    lede: "Built from the first commit as founding engineer: the web app, the mobile app, and AIRA, the rewards agent inside both.",
    role: "Founding engineer — web, mobile & AIRA",
    platforms: ["Android", "iOS", "Web"],
    links: [],
    chapters: [
      { device: "phone", kicker: "AIRA", title: "An agent for your cards", text: "AIRA manages your credit-card wallet and tells you the best card to use for any purchase.", src: app("pointsfly", 1) },
      { device: "phone", kicker: "Points", title: "Every point, live", text: "Reward points across every card, tracked in real time.", src: app("pointsfly", 2) },
      { device: "phone", kicker: "Travel", title: "Fly on points", text: "Search and book flights and hotels directly on points, inside the app.", src: app("pointsfly", 3) },
      { device: "phone", kicker: "Alerts", title: "A nudge at the till", text: "Store alerts along the way, so the right card is out before you pay.", src: app("pointsfly", 4) },
      { device: "web", kicker: "Web tools", title: "Free tools, on the web", text: "A points calculator and a card recommender built on the PointsFly golden rule: under ₹1 a point is poor, ₹1–3 is good, above ₹3 is great.", src: "/work/pointsfly/web-1.png" },
    ],
    tech: ["Next.js", "Node.js", "Express", "MongoDB", "AWS", "Clerk"],
  },
  {
    id: 6,
    slug: "domore",
    tagline: "Focus on what matters.",
    lede: "A focus app and app blocker for self-aware procrastinators, students and creators. I engineered it end to end: the Android and iOS apps, and the web.",
    role: "Engineering, end to end",
    platforms: ["Android", "iOS", "Web"],
    links: [{ label: "domoreapp.in", href: "https://domoreapp.in/" }],
    chapters: [
      { device: "phone", kicker: "App blocker", title: "Set your blocks", text: "Pick the apps that steal your time and block them instantly, on all your devices.", src: app("domore", 1) },
      { device: "phone", kicker: "Friction", title: "Open apps mindfully", text: "Add friction where the habit lives: make specific apps hard to open.", src: app("domore", 2) },
      { device: "phone", kicker: "Deep focus", title: "God Mode", text: "Notifications off, flip clock on. One hour with every distraction blocked.", src: app("domore", 3) },
      { device: "phone", kicker: "Tasks", title: "Plan it, keep the streak", text: "Daily tasks with reminders, and a to-do streak you won't want to break.", src: app("domore", 4) },
      { device: "phone", kicker: "Sleep", title: "Smart sleep", text: "Custom schedules, late-night blocking, and the morning culprit: the first app you open after waking.", src: app("domore", 5) },
      { device: "phone", kicker: "Together", title: "Friends & leaderboard", text: "Compare streaks and screen time, and climb the weekly leaderboard.", src: app("domore", 6) },
      { device: "web", kicker: "Web", title: "Its home on the web", text: "domoreapp.in: the product site, in the app's own black and red.", src: "/work/domore/web-1.jpg" },
    ],
  },
  {
    id: 1,
    slug: "realdesk",
    tagline: "A developer internship simulator",
    lede: "Real tasks, bug reports, deadlines and client messages, so learning feels like the first week on a real team.",
    role: "Design & build",
    platforms: ["Web"],
    shots: [realdesk2, realdesk3, realdesk4, realdesk5],
    highlights: [
      ["Monaco, in the browser", "A multi-file editor with syntax highlighting, right inside each task."],
      ["AI code review", "Static checks and contextual AI feedback, combined into one evaluation."],
      ["XP and ranks", "A progression system that rewards finishing real work, not just starting it."],
    ],
    challenges: [
      "Evaluating code in real time with a hybrid of static checks and AI review.",
      "A modular workspace that can stage realistic task scenarios.",
      "A reward system that adapts to each user's progress.",
    ],
    outcome: "A working simulator that mixes learning with real workflow pressure: a safer place to build confidence with realistic projects, deadlines and guided feedback.",
    tech: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Monaco", "Firebase", "Gemini API"],
    github: "https://github.com/VisheshRajput-dev/real-desk",
  },
  {
    id: 2,
    slug: "devsync",
    tagline: "Team collaboration and project sync",
    lede: "Messages, commits and tasks for a whole team, kept in sync live in one dashboard.",
    role: "Design & build",
    platforms: ["Web"],
    shots: [devsync1, devsync2, devsync3, devsync5],
    highlights: [
      ["Live, over WebSockets", "Team messages and activity update in real time."],
      ["GitHub sync", "Commits and branches pulled in alongside the work they belong to."],
      ["Kanban for teams", "Task boards built for agile, multi-person projects."],
    ],
    challenges: [
      "Keeping data in sync in real time with Socket.io.",
      "A project-state architecture that holds up across many teams.",
      "Secure, role-based access and sign-in flows.",
    ],
    outcome: "A working collaboration platform that gives remote teams one shared view: tasks, discussion and commits, synced in a single space.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Tailwind", "Firebase Auth"],
    github: "https://github.com/VisheshRajput-dev/devsync",
  },
  {
    id: 3,
    slug: "vishti-shop",
    tagline: "A modern e-commerce platform",
    lede: "Browsing, cart, secure payments and an admin panel: quick for shoppers, dependable for whoever runs it.",
    role: "Design & build",
    platforms: ["Web"],
    shots: [vishtishop1, vishtishop2, vishtishop4, vishtishop5],
    highlights: [
      ["A catalog that filters", "Products organised and filtered by category."],
      ["Razorpay payments", "A secure checkout wired into the Razorpay API."],
      ["Live admin", "Orders and inventory managed in real time from a dashboard."],
    ],
    challenges: [
      "Secure, reliable payment handling with Razorpay.",
      "One architecture for admins, customers and guests.",
      "Product queries fast enough for instant search.",
    ],
    outcome: "A deployed store with a pleasant front and solid admin control: an architecture ready for a real business.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Razorpay", "Tailwind", "Firebase Auth"],
    github: "https://github.com/VisheshRajput-dev/vishti-shop",
  },
  {
    id: 4,
    slug: "vishticonvertor",
    tagline: "An image converter and editor, in the browser",
    lede: "Convert, compress and edit images in seven formats without ever uploading them. Everything happens on your own device.",
    role: "Design & build",
    platforms: ["Web"],
    shots: [vishticonvertor1, vishticonvertor2, vishticonvertor3, vishticonvertor7],
    highlights: [
      ["Private by design", "Every step runs client-side. Nothing leaves the device."],
      ["7+ formats, in batches", "Convert up to ten files at once, across formats."],
      ["Real-time preview", "See the result and the size saved before you download."],
    ],
    challenges: [
      "Fast image processing in the browser, with no server at all.",
      "Handling files up to 50MB, and ten at a time.",
      "Keeping Canvas work smooth with several filters stacked.",
    ],
    outcome: "A fully client-side editor with professional results and complete privacy: proof of how far modern web APIs can go.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Canvas API", "browser-image-compression", "react-dropzone"],
    github: "https://github.com/VisheshRajput-dev/vishti-convertor",
  },
];

// Web projects open on their screen recording, then one chapter per highlight.
const withChapters = (c) => {
  if (c.chapters) return c;
  return {
    ...c,
    links: [
      { label: c.live.replace(/^https?:\/\//, "").replace(/\/$/, ""), href: c.live },
      { label: "GitHub", href: c.github },
    ],
    chapters: [
      { device: "web", kicker: "In motion", title: "The product, running", text: c.line, video: c.video, poster: c.shots[0] },
      ...c.highlights.map(([title, text], i) => ({ device: "web", kicker: "Feature", title, text, src: c.shots[i + 1] || c.shots[0] })),
    ],
  };
};

export const cases = projects.map((p) => withChapters({ ...p, ...details.find((d) => d.id === p.id) }));
export const caseById = (id) => cases.find((c) => c.id === Number(id));
