import realdeskVideo from "../assets/webview/realdesk_web.mp4";
import devsyncVideo from "../assets/webview/devsync_web.mp4";
import vishtiShopVideo from "../assets/webview/vishti_shop_web.mp4";
import vishtiConvertorVideo from "../assets/webview/vishti_convertor_web.mp4";

export const person = {
  first: "Vishesh",
  last: "Rajput",
  role: "Founding Engineer",
  company: "PointsFly",
  location: "Noida, India",
  timezone: "Asia/Kolkata",
  email: "visheshrajput.dev@gmail.com",
  resume: "/assets/Vishesh_Rajput_Resume.pdf",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/VisheshRajput-dev" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vishesh-rajput-dev" },
  { label: "X", href: "https://x.com/vishesh_ra3046" },
  { label: "Instagram", href: "https://www.instagram.com/vishesh_rajput.dev/" },
];

// ids match the /project/:id route. Apps without a screen recording show
// their cover image instead.
export const projects = [
  {
    id: 5,
    title: "PointsFly",
    kind: "Web + mobile + AI",
    line: "India's first AI-native rewards app. I build the web app, the mobile app and AIRA, its rewards agent.",
    stack: ["Next.js", "Node.js", "Express", "MongoDB", "AWS", "Clerk"],
    cover: "/work/pointsfly/cover.jpg",
  },
  {
    id: 6,
    title: "DoMore",
    kind: "Mobile app + web",
    line: "A focus app and app blocker, live on Android and iOS. I engineered it end to end.",
    stack: ["Android", "iOS", "Web"],
    cover: "/work/domore/web-1.jpg",
    live: "https://domoreapp.in/",
  },
  {
    id: 1,
    title: "RealDesk",
    kind: "Web platform",
    line: "A developer internship simulator: real tasks, bug reports, deadlines and client conversations.",
    stack: ["React", "TypeScript", "Monaco", "Firebase", "Gemini"],
    video: realdeskVideo,
    live: "https://realdesk.vercel.app/",
  },
  {
    id: 2,
    title: "DevSync",
    kind: "Real-time tool",
    line: "Code together in real time: synced files, multi-file editing and shared sessions.",
    stack: ["React", "Socket.io", "Node.js", "Monaco", "Python"],
    video: devsyncVideo,
    live: "https://devsync-dev.vercel.app/",
  },
  {
    id: 3,
    title: "Vishti-shop",
    kind: "E-commerce",
    line: "A storefront with multi-user login, payments and an admin dashboard for products and orders.",
    stack: ["React", "Node.js", "MongoDB", "Razorpay", "Cloudinary"],
    video: vishtiShopVideo,
    live: "https://vishti-shop.vercel.app/",
  },
  {
    id: 4,
    title: "VishtiConvertor",
    // Soft hyphen lets the display title break on narrow screens.
    display: "Vishti\u00ADConvertor",
    kind: "Browser tool",
    line: "Convert, compress and edit images entirely in the browser. Nothing is ever uploaded.",
    stack: ["React", "TypeScript", "Vite", "Canvas API"],
    video: vishtiConvertorVideo,
    live: "https://vishti-convertor.vercel.app/",
  },
];

export const journey = [
  {
    years: "Dec 2025 — Now",
    role: "Founding Engineer",
    org: "PointsFly",
    where: "Onsite, Noida",
    note: "Building the PointsFly web app, mobile app and AIRA from scratch: point valuation, flight and hotel redemptions, card management and an AI rewards assistant.",
    current: true,
  },
  {
    years: "2024 — Now",
    role: "Full-stack & mobile",
    org: "Freelance",
    where: "Remote",
    note: "Production web and mobile apps for startups and independent clients, with auth, payments and dashboards, usually shipped as fast MVPs.",
  },
  {
    years: "Oct 2025 — Now",
    role: "AI & automation",
    org: "Open source experiments",
    where: "Remote",
    note: "Meeting summarisers, data-analysis assistants and n8n pipelines wiring APIs to real data with OpenAI and Gemini.",
  },
  {
    years: "Aug — Sep 2025",
    role: "Founder & full-stack",
    org: "E-GameBazzi",
    where: "Remote",
    note: "A fantasy esports platform prototype for BGMI, COD and Valorant: contests, wallets with Razorpay, KYC and admin tooling.",
  },
  {
    years: "Jan — Mar 2025",
    role: "Full-stack developer",
    org: "Navadurga",
    where: "Contract",
    note: "An internal business portal with CRUD admin, live reporting and sales dashboards, taken to production in two months.",
  },
];

export const disciplines = [
  "Web applications",
  "Mobile applications",
  "Scalable backends & APIs",
  "AI — RAG & LLM apps",
];
