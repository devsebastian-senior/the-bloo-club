/**
 * Extracts the exact policy text from theblooclub.com Shopify policy pages
 * into src/data/policies.json. Run: node scripts/extract-policies.mjs
 */
import { writeFileSync } from "node:fs";

const PAGES = [
  { id: "envios", handle: "shipping-policy" },
  { id: "devoluciones", handle: "refund-policy" },
  { id: "privacidad", handle: "privacy-policy" },
  { id: "terminos", handle: "terms-of-service" },
];

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&nbsp;/g, " ")
    .replace(/&rsquo;|&#8217;/g, "’")
    .replace(/&ldquo;|&#8220;/g, "“")
    .replace(/&rdquo;|&#8221;/g, "”")
    .replace(/[^\S\n]+/g, " ") // collapse spaces but keep <br>-derived newlines
    .trim();
}

function stripTags(html) {
  return decode(html.replace(/<br\s*\/?>(\s*)/gi, "\n").replace(/<[^>]+>/g, ""));
}

function extractBody(html) {
  const start = html.indexOf("shopify-policy__body");
  if (start === -1) throw new Error("no policy body");
  const slice = html.slice(start);
  const end = slice.search(/<\/main|shopify-policy__container--end|<footer/i);
  return end === -1 ? slice : slice.slice(0, end);
}

function isHeadingLine(line) {
  if (line.length > 90) return false;
  const letters = line.replace(/[^a-zA-Z]/g, "");
  if (!letters) return false;
  const upper = letters.replace(/[^A-Z]/g, "");
  return upper.length / letters.length > 0.85; // "SECTION 1 - ..." style
}

function blocksFrom(body) {
  const blocks = [];
  const re = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(body)) !== null) {
    const tag = m[1].toLowerCase();
    const raw = stripTags(m[2]);
    if (!raw) continue;
    const strongOnly =
      /^<strong[^>]*>[\s\S]*<\/strong>$/i.test(m[2].trim()) && raw.length < 90;
    // <br>-separated bodies become \n inside one block — split into lines.
    for (const line of raw.split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
      if (tag.startsWith("h") || strongOnly || isHeadingLine(line)) {
        blocks.push({ t: "h", x: line });
      } else if (tag === "li") {
        blocks.push({ t: "li", x: line });
      } else {
        blocks.push({ t: "p", x: line });
      }
    }
  }
  return blocks;
}

const out = {};
for (const { id, handle } of PAGES) {
  const res = await fetch(`https://theblooclub.com/policies/${handle}`, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`${handle}: HTTP ${res.status}`);
  const html = await res.text();
  const title = stripTags(
    (html.match(/<h1[^>]*shopify-policy__title[^>]*>([\s\S]*?)<\/h1>/i) ||
      html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ""])[1]
  );
  const blocks = blocksFrom(extractBody(html));
  out[id] = { title, handle, blocks };
  console.log(`${id}: "${title}" — ${blocks.length} blocks`);
}

writeFileSync(
  new URL("../src/data/policies.json", import.meta.url),
  JSON.stringify(out, null, 2)
);
console.log("written src/data/policies.json");
