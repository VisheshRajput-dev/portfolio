/**
 * Case studies for /project/:id. Copy comes from the original project
 * pages; the gallery keeps the full-size screens (icons and crops are left out).
 */
import { projects } from "./data";
import realdesk1 from "../assets/domeimages/realdesk/1.png";
import realdesk3 from "../assets/domeimages/realdesk/3.png";
import realdesk4 from "../assets/domeimages/realdesk/4.png";
import realdesk5 from "../assets/domeimages/realdesk/5.png";
import realdesk8 from "../assets/domeimages/realdesk/8.png";
import realdesk2 from "../assets/domeimages/realdesk/2.png";
import devsync1 from "../assets/domeimages/devsync/1.png";
import devsync2 from "../assets/domeimages/devsync/2.png";
import devsync3 from "../assets/domeimages/devsync/3.png";
import devsync5 from "../assets/domeimages/devsync/5.png";
import devsync6 from "../assets/domeimages/devsync/6.png";
import devsync7 from "../assets/domeimages/devsync/7.png";
import vishtishop1 from "../assets/domeimages/vishtishop/1.png";
import vishtishop2 from "../assets/domeimages/vishtishop/2.png";
import vishtishop4 from "../assets/domeimages/vishtishop/4.png";
import vishtishop5 from "../assets/domeimages/vishtishop/5.png";
import vishtishop7 from "../assets/domeimages/vishtishop/7.png";
import vishtishop8 from "../assets/domeimages/vishtishop/8.png";
import vishtishop12 from "../assets/domeimages/vishtishop/12.png";
import vishticonvertor1 from "../assets/domeimages/vishticonvertor/1.png";
import vishticonvertor2 from "../assets/domeimages/vishticonvertor/2.png";
import vishticonvertor3 from "../assets/domeimages/vishticonvertor/3.png";
import vishticonvertor7 from "../assets/domeimages/vishticonvertor/7.png";

const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

const details = [
  {
    id: 1,
    tagline: "A developer internship simulator",
    lede: "Real tasks, bug reports, deadlines and client messages, so learning feels like the first week on a real team.",
    category: "Full-stack",
    cover: "/concept/realdesk_web-0.jpg",
    overview:
      "RealDesk closes the gap between tutorials and real team work. It recreates the pace of a tech job: tasks, bug reports, deadlines and client messages, with an in-browser editor and AI feedback, so people learn by doing instead of only reading.",
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
    outcome:
      "A working simulator that mixes learning with real workflow pressure: a safer place to build confidence with realistic projects, deadlines and guided feedback.",
    tech: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Monaco", "Firebase", "Gemini API"],
    github: "https://github.com/VisheshRajput-dev/real-desk",
    gallery: [realdesk2, realdesk3, realdesk4, realdesk5, realdesk8, realdesk1],
  },
  {
    id: 2,
    tagline: "Team collaboration and project sync",
    lede: "Messages, commits and tasks for a whole team, kept in sync live in one dashboard.",
    category: "MERN stack",
    cover: "/concept/devsync_web-3.jpg",
    overview:
      "DevSync brings a team's communication, version tracking and tasks into one place. A single dashboard for commits, issues and updates, with GitHub sync and live activity, so work stays visible from idea to deploy.",
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
    outcome:
      "A working collaboration platform that gives remote teams one shared view: tasks, discussion and commits, synced in a single space.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Tailwind", "Firebase Auth"],
    github: "https://github.com/VisheshRajput-dev/devsync",
    gallery: [devsync1, devsync2, devsync3, devsync5, devsync6, devsync7],
  },
  {
    id: 3,
    tagline: "A modern e-commerce platform",
    category: "E-commerce",
    cover: "/concept/vishti_shop_web-2.jpg",
    overview:
      "Vishti Shop is a complete store: browsing, cart, secure payments, and an admin panel for products, orders and users. Built to feel quick and clean for shoppers, and dependable for whoever runs it.",
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
    outcome:
      "A deployed store with a pleasant front and solid admin control: an architecture ready for a real business.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Razorpay", "Tailwind", "Firebase Auth"],
    github: "https://github.com/VisheshRajput-dev/vishti-shop",
    gallery: [vishtishop1, vishtishop2, vishtishop4, vishtishop5, vishtishop7, vishtishop8, vishtishop12],
  },
  {
    id: 4,
    tagline: "An image converter and editor, in the browser",
    category: "Frontend",
    cover: "/concept/vishti_convertor_web-2.jpg",
    overview:
      "VishtiConvertor converts, compresses and edits images without ever uploading them. JPEG, PNG, WebP, AVIF, BMP, GIF and TIFF; batch work, compression, resizing, rotation and filters, with live previews and file-size comparisons, all on the user's own device.",
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
    outcome:
      "A fully client-side editor with professional results and complete privacy: proof of how far modern web APIs can go.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Canvas API", "browser-image-compression", "react-dropzone"],
    github: "https://github.com/VisheshRajput-dev/vishti-convertor",
    gallery: [vishticonvertor1, vishticonvertor2, vishticonvertor3, vishticonvertor7],
  },
];

export const cases = details.map((d) => ({ ...byId[d.id], ...d }));
export const caseById = (id) => cases.find((c) => c.id === Number(id));
