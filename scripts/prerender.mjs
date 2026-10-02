/**
 * Runs after `react-scripts build`. The site is a client-rendered SPA, so
 * every route ships the same empty index.html. This writes one HTML file per
 * route with that page's own title, description, canonical, social tags and
 * structured data, plus a plain-HTML copy of the content inside #root (React
 * replaces it on load). Crawlers and link previews get real text without
 * running any JavaScript. Also writes the sitemap.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE, POINTSFLY, STORES, POINTSFLY_FEATURES, CASES, home, casePage, siteGraph } from "../src/seo/site.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const build = join(root, "build");
const template = readFileSync(join(build, "index.html"), "utf8");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const abs = (p) => (p.startsWith("http") ? p : `${BASE}${p}`);

// Matches the dark preloader, so the moment before the app takes over is calm.
const SHELL_CSS = `<style>.seo-shell{min-height:100vh;margin:0;padding:48px 24px;background:#0e0d0c;color:#eeeae2;font:15px/1.6 'Helvetica Neue',Arial,sans-serif}.seo-shell>*{max-width:760px;margin-left:auto;margin-right:auto}.seo-shell a{color:#eeeae2}.seo-shell h1{font-size:40px;line-height:1.05;margin:0 0 12px}.seo-shell h2{font-size:20px;margin:32px auto 8px}.seo-shell ul{padding-left:18px}</style>`;

const nav = `<nav><a href="/">Vishesh Rajput</a> · <a href="/#work">Work</a> · <a href="${POINTSFLY}">PointsFly</a> · <a href="mailto:visheshrajput.dev@gmail.com">Contact</a></nav>`;

const featureList = (items) =>
  `<ul>${items.map(([t, d]) => `<li><strong>${esc(t)}</strong>: ${esc(d)}</li>`).join("")}</ul>`;

const workList = () =>
  `<ul>${CASES.map((c) => `<li><a href="/project/${c.slug}">${esc(c.title)}</a>: ${esc(c.tagline)}</li>`).join("")}</ul>`;

const socials = `<p><a href="https://github.com/VisheshRajput-dev">GitHub</a> · <a href="https://www.linkedin.com/in/vishesh-rajput-dev">LinkedIn</a> · <a href="https://x.com/vishesh_ra3046">X</a> · <a href="https://www.instagram.com/vishesh_rajput.dev/">Instagram</a></p>`;

const homeBody = () => `
${nav}
<header><img src="/vishesh-rajput.jpg" alt="Vishesh Rajput, Founding Engineer at PointsFly" width="160" height="160" style="border-radius:50%" /><h1>Vishesh Rajput</h1>
<p>Founding Engineer at <a href="${POINTSFLY}">PointsFly</a> (pointsfly.ai), Noida, India. Also known as Vishesh Dev.</p></header>
<section><h2>Founding Engineer at PointsFly</h2>
<p>I joined PointsFly as its founding engineer and built it from the first commit: the pointsfly.ai web app, the PointsFly iOS and Android apps, AIRA, the AI rewards agent that tells you the best credit card for every purchase, and the airline award points prediction model.</p>
${featureList(POINTSFLY_FEATURES)}
<p><a href="/project/pointsfly">Read the PointsFly case study</a> · Get PointsFly on the <a href="${STORES.pointsfly.ios}">App Store</a> or <a href="${STORES.pointsfly.android}">Google Play</a></p></section>
<section><h2>Work</h2>${workList()}</section>
<section><h2>What I build</h2><p>Web applications, mobile applications, scalable backends and APIs, and AI apps (RAG and LLM). Next.js, Flutter, Node.js, Express, MongoDB, AWS.</p></section>
<section><h2>Contact</h2><p><a href="mailto:visheshrajput.dev@gmail.com">visheshrajput.dev@gmail.com</a></p>${socials}</section>`;

const caseBody = (c) => `
${nav}
<header><p>Case study · Vishesh Rajput</p><h1>${esc(c.title)}</h1><p><em>${esc(c.tagline)}</em></p></header>
<p>${esc(c.lede)}</p>
<h2>What's in it</h2>${featureList(c.features)}
<h2>Built with</h2><p>${c.tech.map(esc).join(", ")}</p>
<p>${c.live ? `<a href="${c.live}">Visit ${esc(c.live.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a>` : ""}${c.stores ? ` · <a href="${c.stores.ios}">App Store</a> · <a href="${c.stores.android}">Google Play</a>` : ""}${c.github ? ` · <a href="${c.github}">Source on GitHub</a>` : ""}</p>
<h2>More work</h2>${workList()}`;

function page({ path, title, description, keywords, image, structuredData }, body) {
  const url = `${BASE}${path}`;
  const img = abs(image);
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="keywords" content="${esc(keywords)}" />`,
    `<meta name="author" content="Vishesh Rajput" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${path === "/" ? "profile" : "website"}" />`,
    `<meta property="og:site_name" content="Vishesh Rajput" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:alt" content="${esc(title)}" />`,
    path === "/" ? `<meta property="profile:first_name" content="Vishesh" /><meta property="profile:last_name" content="Rajput" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@vishesh_ra3046" />`,
    `<meta name="twitter:creator" content="@vishesh_ra3046" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json" data-seo-site="true">${json(siteGraph)}</script>`,
    structuredData ? `<script type="application/ld+json" data-seo-structured-data="true">${json(structuredData)}</script>` : "",
    SHELL_CSS,
  ]
    .filter(Boolean)
    .join("\n    ");

  // Drop the template's own copies of everything set above.
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/gi, "")
    .replace(/<link rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+(?:name|property)="(?:title|description|keywords|author|robots|og:[^"]*|twitter:[^"]*|profile:[^"]*)"[^>]*>/gi, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/i, "");
  html = html.replace(/<head>/i, `<head>\n    ${head}`);
  html = html.replace(/<div id="root"><\/div>/, `<div id="root"><div class="seo-shell">${body}</div></div>`);
  if (!html.includes("seo-shell")) throw new Error("prerender: #root not found in build/index.html");

  const file = path === "/" ? join(build, "index.html") : join(build, path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return url;
}

const today = new Date().toISOString().slice(0, 10);
const urls = [
  [page(home, homeBody()), "1.0", "weekly"],
  ...CASES.map((c) => [page(casePage(c), caseBody(c)), c.slug === "pointsfly" ? "0.9" : "0.7", "monthly"]),
];

writeFileSync(
  join(build, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(([loc, priority, freq]) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>${loc === `${BASE}/` ? `\n    <image:image><image:loc>${BASE}/vishesh-rajput.jpg</image:loc></image:image>` : ""}\n  </url>`)
  .join("\n")}
</urlset>
`
);

console.log(`prerender: wrote ${urls.length} pages and sitemap.xml`);
