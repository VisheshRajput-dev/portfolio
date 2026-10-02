/**
 * What search engines should know about each page: titles, descriptions,
 * structured data and a plain-HTML version of the content. Used by the app
 * (through <SEO>) and by scripts/prerender.mjs, which writes a static HTML
 * file per route at build time so crawlers get real text without running JS.
 * No imports here, so Node can load it as-is.
 */

export const BASE = "https://visheshrajputdev-portfolio.vercel.app";
export const POINTSFLY = "https://pointsfly.ai/";

export const STORES = {
  pointsfly: {
    ios: "https://apps.apple.com/in/app/pointsfly/id6791210809",
    android: "https://play.google.com/store/apps/details?id=com.pointsfly.pointsfly_app",
  },
  domore: {
    ios: "https://apps.apple.com/in/app/domore/id6760972050",
    android: "https://play.google.com/store/apps/details?id=com.domore.domore",
  },
};

// PointsFly's own pages, as linked from pointsfly.ai.
const POINTSFLY_SOCIALS = [
  "https://www.linkedin.com/company/points-fly/",
  "https://www.instagram.com/pointsflywithvibhav/",
  "https://www.facebook.com/pointsfly",
  "https://www.youtube.com/@pointsfly",
];

const NAME = "Vishesh Rajput";
// Every way people search for me.
const ALT_NAMES = [
  "Vishesh",
  "Vishesh Dev",
  "Vishesh Rajput Dev",
  "Vishesh Developer",
  "Vishesh Rajput Developer",
  "Vishesh Rajput PointsFly",
  "VisheshRajput-dev",
];

const SOCIALS = [
  "https://github.com/VisheshRajput-dev",
  "https://www.linkedin.com/in/vishesh-rajput-dev",
  "https://x.com/vishesh_ra3046",
  "https://www.instagram.com/vishesh_rajput.dev/",
];

const EMAIL = "visheshrajput.dev@gmail.com";

// What I built at PointsFly, in words people search with.
export const POINTSFLY_FEATURES = [
  ["AIRA, the AI rewards agent", "Ask AIRA which credit card to use and it answers from your own wallet: the best card for every purchase, by chat or by voice."],
  ["Airline award points prediction model", "Predicts how many points an airline award flight will cost, so you know how far your credit card points go before you redeem."],
  ["Best card, wherever you are", "A nearby best-card map and location alerts that bring the right card out before you pay."],
  ["Flights and hotels on points", "Search award flights and hotel stays and redeem credit card points for them inside the app."],
  ["Points transfer", "Transfer credit card points to airline miles and hotel programs at the best ratio."],
  ["Every point, tracked", "Card portfolio, live points balances and spends tracked from bank alerts, with a Dream Destination goal that fills up as you earn."],
  ["Free tools on pointsfly.ai", "A credit card reward points calculator and a credit card recommendation tool (Find My Card)."],
];

const PERSON_ID = `${BASE}/#person`;
const ORG_ID = `${POINTSFLY}#organization`;
const APP_ID = `${POINTSFLY}#app`;
const AIRA_ID = `${POINTSFLY}#aira`;

const person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: NAME,
  givenName: "Vishesh",
  familyName: "Rajput",
  alternateName: ALT_NAMES,
  jobTitle: "Founding Engineer",
  description:
    "Vishesh Rajput (Vishesh Dev), Founding Engineer at PointsFly (pointsfly.ai), built the PointsFly web app, the iOS and Android apps, AIRA (the AI agent that picks the best credit card for every purchase) and the airline award points prediction model.",
  url: `${BASE}/`,
  image: `${BASE}/avatar.png`,
  email: `mailto:${EMAIL}`,
  worksFor: { "@id": ORG_ID },
  hasOccupation: {
    "@type": "Occupation",
    name: "Founding Engineer",
    description: "Founding Engineer at PointsFly since December 2025.",
    occupationLocation: { "@type": "City", name: "Noida, India" },
    skills: "Next.js, Flutter, Node.js, Express, MongoDB, AWS, AI agents, LLM apps",
  },
  homeLocation: { "@type": "Place", name: "Noida, India" },
  nationality: { "@type": "Country", name: "India" },
  sameAs: SOCIALS,
  knowsAbout: [
    "PointsFly",
    "AIRA AI rewards agent",
    "Credit card rewards",
    "Airline award points prediction",
    "Travel rewards",
    "Full-stack development",
    "Mobile app development",
    "Next.js",
    "Flutter",
    "Node.js",
    "MongoDB",
    "AWS",
    "AI agents",
    "RAG and LLM applications",
  ],
};

const org = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "PointsFly",
  legalName: "PointsFly Technologies Private Limited",
  url: POINTSFLY,
  description: "PointsFly is India's first AI-native credit card rewards app: redeem credit card points for flights and hotels, and know the best card for every purchase.",
  employee: { "@id": PERSON_ID },
  sameAs: POINTSFLY_SOCIALS,
  location: { "@type": "Place", name: "Noida, India" },
};

const app = {
  "@type": "SoftwareApplication",
  "@id": APP_ID,
  name: "PointsFly",
  url: POINTSFLY,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web, iOS, Android",
  description: org.description,
  featureList: POINTSFLY_FEATURES.map(([t]) => t),
  installUrl: [STORES.pointsfly.ios, STORES.pointsfly.android],
  sameAs: [STORES.pointsfly.ios, STORES.pointsfly.android],
  creator: { "@id": PERSON_ID },
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
};

const aira = {
  "@type": "SoftwareApplication",
  "@id": AIRA_ID,
  name: "AIRA",
  alternateName: "AIRA by PointsFly",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web, iOS, Android",
  description: "AIRA is the AI rewards agent inside PointsFly. It manages your credit card wallet and tells you the best card to use for any purchase.",
  isPartOf: { "@id": APP_ID },
  creator: { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
};

const website = {
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  name: "Vishesh Rajput",
  alternateName: ["Vishesh Rajput Portfolio", "Vishesh Dev"],
  url: `${BASE}/`,
  inLanguage: "en-IN",
  author: { "@id": PERSON_ID },
  publisher: { "@id": PERSON_ID },
};

/** Who, where and what: on every page. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [person, org, app, aira, website],
};

// Case studies, in the order of the work list.
export const CASES = [
  {
    slug: "pointsfly",
    id: 5,
    title: "PointsFly",
    tagline: "India's first AI-native rewards app",
    description:
      "PointsFly case study: Vishesh Rajput, Founding Engineer, built the pointsfly.ai web app, the iOS and Android apps, AIRA (the AI agent that picks the best credit card) and the airline award points prediction model.",
    lede: "Built from the first commit as founding engineer: the web app at pointsfly.ai, the iOS and Android apps, and AIRA, the rewards agent inside both.",
    features: POINTSFLY_FEATURES,
    tech: ["Next.js", "Flutter", "Node.js", "Express", "MongoDB", "AWS", "Clerk", "OpenAI"],
    live: POINTSFLY,
    stores: STORES.pointsfly,
    image: "/work/pointsfly/cover.jpg",
    keywords: "PointsFly, pointsfly.ai, PointsFly founding engineer, PointsFly team, PointsFly developer, AIRA, AIRA AI rewards agent, best credit card for every purchase, airline award points prediction, redeem credit card points, Vishesh Rajput PointsFly",
    about: [{ "@id": APP_ID }, { "@id": AIRA_ID }],
  },
  {
    slug: "domore",
    id: 6,
    title: "DoMore",
    tagline: "Focus on what matters.",
    description: "DoMore case study: a focus app and app blocker for Android and iOS, engineered end to end by Vishesh Rajput.",
    lede: "A focus app and app blocker for self-aware procrastinators, students and creators. I engineered it end to end: the Android and iOS apps, and the web.",
    features: [
      ["Focus timer", "Set a focus session and choose the apps to block."],
      ["App blocker", "Blocked apps stay locked until the session ends."],
      ["Tasks and streaks", "Daily tasks with reminders and a streak to keep."],
      ["Smart sleep", "Bedtime schedules, night-time app locks and a score for your last scroll and first pickup."],
      ["Leaderboard", "Streaks and screen time, ranked against everyone on the app."],
      ["Screen time", "Weekly usage with a detailed breakdown."],
    ],
    tech: ["Android", "iOS", "Web"],
    live: "https://domoreapp.in/",
    stores: STORES.domore,
    image: "/work/domore/web-1.jpg",
    keywords: "DoMore app, DoMore app blocker, focus app, Vishesh Rajput",
  },
  {
    slug: "realdesk",
    id: 1,
    title: "RealDesk",
    tagline: "A developer internship simulator",
    description: "RealDesk case study: a developer internship simulator with real tasks, bug reports, deadlines and AI code review, built by Vishesh Rajput.",
    lede: "Real tasks, bug reports, deadlines and client messages, so learning feels like the first week on a real team.",
    features: [
      ["Monaco, in the browser", "A multi-file editor inside each task."],
      ["AI code review", "Static checks and contextual AI feedback in one evaluation."],
      ["XP and ranks", "Progression that rewards finishing real work."],
    ],
    tech: ["React", "Vite", "TypeScript", "Tailwind", "shadcn/ui", "Monaco", "Firebase", "Gemini API"],
    live: "https://realdesk.vercel.app/",
    github: "https://github.com/VisheshRajput-dev/real-desk",
    keywords: "RealDesk, developer internship simulator, Vishesh Rajput",
  },
  {
    slug: "devsync",
    id: 2,
    title: "DevSync",
    tagline: "Team collaboration and project sync",
    description: "DevSync case study: messages, commits and tasks for a whole team, synced live over WebSockets. Built by Vishesh Rajput.",
    lede: "Messages, commits and tasks for a whole team, kept in sync live in one dashboard.",
    features: [
      ["Live, over WebSockets", "Team messages and activity update in real time."],
      ["GitHub sync", "Commits and branches next to the work they belong to."],
      ["Kanban for teams", "Task boards for multi-person projects."],
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Tailwind", "Firebase Auth"],
    live: "https://devsync-dev.vercel.app/",
    github: "https://github.com/VisheshRajput-dev/devsync",
    keywords: "DevSync, real-time collaboration, Vishesh Rajput",
  },
  {
    slug: "vishti-shop",
    id: 3,
    title: "Vishti-shop",
    tagline: "A modern e-commerce platform",
    description: "Vishti-shop case study: a storefront with Razorpay payments and a live admin dashboard, built by Vishesh Rajput.",
    lede: "Browsing, cart, secure payments and an admin panel: quick for shoppers, dependable for whoever runs it.",
    features: [
      ["A catalog that filters", "Products organised and filtered by category."],
      ["Razorpay payments", "A secure checkout on the Razorpay API."],
      ["Live admin", "Orders and inventory managed in real time."],
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "Razorpay", "Tailwind", "Firebase Auth"],
    live: "https://vishti-shop.vercel.app/",
    github: "https://github.com/VisheshRajput-dev/vishti-shop",
    keywords: "Vishti-shop, e-commerce, Razorpay, Vishesh Rajput",
  },
  {
    slug: "vishticonvertor",
    id: 4,
    title: "VishtiConvertor",
    tagline: "An image converter and editor, in the browser",
    description: "VishtiConvertor case study: convert, compress and edit images in the browser with nothing uploaded. Built by Vishesh Rajput.",
    lede: "Convert, compress and edit images in seven formats without ever uploading them. Everything happens on your own device.",
    features: [
      ["Private by design", "Every step runs client-side."],
      ["7+ formats, in batches", "Convert up to ten files at once."],
      ["Real-time preview", "See the result and the size saved before you download."],
    ],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Canvas API"],
    live: "https://vishti-convertor.vercel.app/",
    github: "https://github.com/VisheshRajput-dev/vishti-convertor",
    keywords: "VishtiConvertor, image converter, Vishesh Rajput",
  },
];

const HOME_KEYWORDS =
  "Vishesh Rajput, Vishesh, Vishesh Dev, Vishesh Rajput Dev, Vishesh Developer, Vishesh Rajput developer, Vishesh Rajput portfolio, PointsFly, pointsfly.ai, PointsFly founding engineer, PointsFly team, AIRA, AIRA AI rewards agent, best credit card for every purchase, airline award points prediction, credit card rewards app India, Founding Engineer, full-stack developer Noida, Next.js developer, Flutter developer";

export const home = {
  path: "/",
  title: "Vishesh Rajput · Founding Engineer at PointsFly (Vishesh Dev)",
  description:
    "Vishesh Rajput is the Founding Engineer at PointsFly (pointsfly.ai): builder of the PointsFly web and mobile apps, AIRA, the AI agent that picks your best credit card, and the airline award points prediction model.",
  keywords: HOME_KEYWORDS,
  image: "/og.jpg",
};

/** Meta and structured data for one case study. */
export function casePage(c) {
  const url = `${BASE}/project/${c.slug}`;
  return {
    path: `/project/${c.slug}`,
    title: `${c.title}: ${c.tagline} | Vishesh Rajput`,
    description: c.description,
    keywords: c.keywords,
    image: c.image || "/og.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${url}#webpage`,
          url,
          name: `${c.title}: ${c.tagline}`,
          description: c.description,
          isPartOf: { "@id": `${BASE}/#website` },
          author: { "@id": PERSON_ID },
          about: c.about || { "@id": `${url}#project` },
        },
        ...(c.about
          ? []
          : [
              {
                "@type": c.stores ? "MobileApplication" : "CreativeWork",
                "@id": `${url}#project`,
                name: c.title,
                description: c.lede,
                url: c.live,
                creator: { "@id": PERSON_ID },
                keywords: c.tech.join(", "),
                ...(c.stores && {
                  operatingSystem: "Android, iOS",
                  applicationCategory: "LifestyleApplication",
                  installUrl: [c.stores.ios, c.stores.android],
                  sameAs: [c.stores.ios, c.stores.android],
                }),
              },
            ]),
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Vishesh Rajput", item: `${BASE}/` },
            { "@type": "ListItem", position: 2, name: c.title, item: url },
          ],
        },
      ],
    },
  };
}

export const caseSeo = (slug) => {
  const c = CASES.find((x) => x.slug === slug);
  return c ? casePage(c) : null;
};
