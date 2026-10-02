/**
 * Case studies for /project/:slug. Copy for the web projects comes from the
 * original project pages; DoMore's from its own site; PointsFly's from its
 * public description.
 */
import { projects } from "./data";
import { STORES } from "../seo/site.mjs";
import realdesk3 from "../assets/domeimages/realdesk/3.jpg";
import realdesk4 from "../assets/domeimages/realdesk/4.jpg";
import realdesk5 from "../assets/domeimages/realdesk/5.jpg";
import realdesk2 from "../assets/domeimages/realdesk/2.jpg";
import devsync1 from "../assets/domeimages/devsync/1.jpg";
import devsync2 from "../assets/domeimages/devsync/2.jpg";
import devsync3 from "../assets/domeimages/devsync/3.jpg";
import devsync5 from "../assets/domeimages/devsync/5.jpg";
import vishtishop1 from "../assets/domeimages/vishtishop/1.jpg";
import vishtishop2 from "../assets/domeimages/vishtishop/2.jpg";
import vishtishop4 from "../assets/domeimages/vishtishop/4.jpg";
import vishtishop5 from "../assets/domeimages/vishtishop/5.jpg";
import vishticonvertor1 from "../assets/domeimages/vishticonvertor/1.jpg";
import vishticonvertor2 from "../assets/domeimages/vishticonvertor/2.jpg";
import vishticonvertor3 from "../assets/domeimages/vishticonvertor/3.jpg";
import vishticonvertor7 from "../assets/domeimages/vishticonvertor/7.jpg";

/*
 * Each case is told in chapters: one device (a phone or a browser), one
 * screen, one caption. Screens for the apps live in public/work/<slug>/;
 * until a file is there, the page draws a placeholder in its place.
 */
const app = (slug, n) => `/work/${slug}/app-${n}.jpg`;

const details = [
  {
    id: 5,
    tagline: "India's first AI-native rewards app",
    lede: "Built from the first commit as founding engineer: the web app at pointsfly.ai, the iOS and Android apps, and AIRA, the rewards agent inside both.",
    role: "Founding engineer — web, mobile & AIRA",
    platforms: ["Android", "iOS", "Web"],
    links: [
      { label: "pointsfly.ai", href: "https://pointsfly.ai/" },
      { label: "App Store", href: STORES.pointsfly.ios },
      { label: "Google Play", href: STORES.pointsfly.android },
    ],
    chapters: [
      { device: "phone", kicker: "AIRA", title: "The first AI agent for rewards", text: "AIRA, the Autonomous Intelligent Rewards Agent, sits at the centre of the app: ask it anything about your cards, points and trips.", src: app("pointsfly", 1) },
      { device: "phone", kicker: "Best card", title: "The right card, wherever you are", text: "A live map of stores near you with the best card for each one, plus store alerts that nudge you before you pay.", src: app("pointsfly", 2) },
      { device: "phone", kicker: "Wallet", title: "Every card, one wallet", text: "All your credit cards in a single stack, with the portfolio's value in rupees and every point earned.", src: app("pointsfly", 3) },
      { device: "phone", kicker: "Add cards", title: "Your cards, found for you", text: "Sync statements from Gmail, Outlook or Yahoo, connect Amex, upload a PDF, or add a card by hand.", src: app("pointsfly", 4) },
      { device: "phone", kicker: "Loyalty", title: "Airline and hotel points, synced", text: "Connect loyalty programs once and balances stay fresh automatically, valued in rupees.", src: app("pointsfly", 5) },
      { device: "phone", kicker: "Dream destination", title: "Points become a trip", text: "Pick a route and watch it fill up as you earn, powered by the airline award points prediction model. At 100% you're ready to book.", src: app("pointsfly", 6) },
      { device: "phone", kicker: "Trips", title: "Every journey, together", text: "Flights, trains and hotels pulled into one timeline, with itineraries a tap away.", src: app("pointsfly", 7) },
      { device: "web", kicker: "Web", title: "pointsfly.ai", text: "The website: search award flights and hotels, meet AIRA, and use the free points calculator and card recommender.", video: "/work/pointsfly/web.mp4", poster: "/work/pointsfly/cover.jpg" },
    ],
    tech: ["Next.js", "Flutter", "Node.js", "Express", "MongoDB", "AWS", "Clerk", "OpenAI"],
  },
  {
    id: 6,
    tagline: "Focus on what matters.",
    lede: "A focus app and app blocker for self-aware procrastinators, students and creators. I engineered it end to end: the Android and iOS apps, and the web.",
    role: "Engineering, end to end",
    platforms: ["Android", "iOS", "Web"],
    links: [
      { label: "domoreapp.in", href: "https://domoreapp.in/" },
      { label: "App Store", href: STORES.domore.ios },
      { label: "Google Play", href: STORES.domore.android },
    ],
    chapters: [
      { device: "phone", kicker: "Focus", title: "Pick a time, block the noise", text: "Set a focus timer, choose the apps that steal your time, and start.", src: app("domore", 1) },
      { device: "phone", kicker: "App blocker", title: "Blocked until it's done", text: "While the session runs, blocked apps stay locked. Need air? Take a break without ending it.", src: app("domore", 2) },
      { device: "phone", kicker: "Tasks", title: "Plan it, keep the streak", text: "Daily tasks with reminders, and a to-do streak you won't want to break.", src: app("domore", 3) },
      { device: "phone", kicker: "Sleep", title: "Smart sleep", text: "Bedtime and wake-up schedules, apps that lock at night, and an honest score for your last scroll and first pickup.", src: app("domore", 4) },
      { device: "phone", kicker: "Together", title: "Climb the leaderboard", text: "Streaks and screen time, ranked against everyone on the app.", src: app("domore", 5) },
      { device: "phone", kicker: "Screen time", title: "Your week, in numbers", text: "Weekly usage at a glance, with a detailed breakdown a tap away.", src: app("domore", 6) },
      { device: "web", kicker: "Web", title: "Its home on the web", text: "domoreapp.in: the product site, in the app's own black and red.", video: "/work/domore/web.mp4", poster: "/work/domore/web-1.jpg" },
    ],
  },
  {
    id: 1,
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
// Takes a slug, or one of the old numeric ids (those redirect to the slug).
export const findCase = (param) => cases.find((c) => c.slug === param || String(c.id) === param);
