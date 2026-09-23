// Extracts factual product data from published Dnd Martinelli product pages.
// Only facts are recorded: names, finish codes, rose/design attributes, awards,
// applications, download labels and family links. Marketing prose is never copied;
// ATC summaries are authored separately in ./dnd-copy.ts.
// Run: pnpm --filter @workspace/scripts exec tsx src/dnd-extract.ts
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../data/dnd-raw.json");
const BASE = "https://www.dndhandles.it/en/products";

/** Product pages to extract, grouped by the Dnd catalogue section they sit in. */
export const TARGETS: { path: string; setting: string }[] = [
  // Interior doors
  { path: "maniglie-per-porte/lucrezia", setting: "Interior doors" },
  { path: "maniglie-per-porte/pencil", setting: "Interior doors" },
  { path: "maniglie-per-porte/zeppelin", setting: "Interior doors" },
  { path: "maniglie-per-porte/minima", setting: "Interior doors" },
  { path: "maniglie-per-porte/interna-new-flush-minimalist-door-handle", setting: "Flush interior doors" },
  // Windows
  { path: "maniglie-per-finestre/ginkgo-dk", setting: "Windows" },
  { path: "maniglie-per-finestre/timeless-dk", setting: "Windows" },
  { path: "maniglie-per-finestre/minima-dk", setting: "Windows" },
  // Sliding doors
  { path: "maniglie-per-porte-scorrevoli/master-tonda-sd501", setting: "Sliding doors" },
  { path: "maniglie-per-porte-scorrevoli/ring-sd222", setting: "Sliding doors" },
  { path: "maniglie-per-porte-scorrevoli/ginkgo-tonda-sd501", setting: "Sliding doors" },
  // Entrance and gate pull handles
  // Note: maniglioni-porte/maniglione-ginkgo is the same product as the already-imported
  // dnd-ginkgo, which Dnd also publishes under /door-and-gate-pull-handles/.
  { path: "maniglioni-porte/maniglione-zeppelin", setting: "Entrance doors" },
  { path: "maniglioni-porte/maniglione-pencil", setting: "Entrance doors" },
  { path: "maniglioni-porte/maniglione-tube-round", setting: "Entrance doors" },
  // Lift-and-slide systems
  { path: "maniglioni-per-alzante-scorrevole/edra", setting: "Lift-and-slide doors" },
  { path: "maniglioni-per-alzante-scorrevole/slide", setting: "Lift-and-slide doors" },
  // Door knobs
  { path: "pomoli-per-porte/pomoli-sfera", setting: "Interior doors" },
  { path: "pomoli-per-porte/pomolo-timeless", setting: "Interior doors" },
  { path: "pomoli-per-porte/pomoli-olive", setting: "Interior doors" },
  // Furniture
  { path: "pomolini-e-accessori-per-mobili/crisalide-knob", setting: "Furniture" },
  { path: "pomolini-e-accessori-per-mobili/lucrezia-knob", setting: "Furniture" },
  { path: "pomolini-e-accessori-per-mobili/timeless-knob", setting: "Furniture" },
  // Accessories and systems
  { path: "fermaporta/chiocciola", setting: "Door stops" },
  { path: "fermaporta/ring", setting: "Door stops" },
  { path: "sistemi-di-chiusura/dynamic", setting: "Locking systems" },
  { path: "sistemi-di-chiusura/vertical", setting: "Locking systems" },
  { path: "chiavi/dnd", setting: "Keys" },
  { path: "appendini/crisalide-appendino", setting: "Hangers" },
];

export interface RawFinish {
  code: string;
  label: string;
  group: string;
}

export interface RawProduct {
  sourceUrl: string;
  setting: string;
  sectionSlug: string;
  handleSlug: string;
  title: string;
  designer: string | null;
  breadcrumb: string[];
  design: string | null;
  roses: string[];
  unico: boolean;
  badges: string[];
  techSheetUrl: string | null;
  finishes: RawFinish[];
  downloads: string[];
  family: string[];
  awards: string[];
  videos: number;
  imageCount: number;
}

const decode = (s: string): string =>
  s
    .replace(/<!--.*?-->/gs, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;|&#8217;/g, "’")
    .replace(/&ndash;/g, "–")
    .replace(/&egrave;/g, "è")
    .replace(/&eacute;/g, "é")
    .replace(/&agrave;/g, "à")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/\s+/g, " ")
    .trim();

const firstMatch = (html: string, re: RegExp): string | null => {
  const m = re.exec(html);
  return m ? decode(m[1]) : null;
};

function parseFinishes(html: string): RawFinish[] {
  const out: RawFinish[] = [];
  const seen = new Set<string>();
  const containerRe = /<div class="wk_finish_container([^"]*)"[^>]*>([\s\S]*?)(?=<div class="wk_finish_container|<div class="wk_tm_|<\/section>)/g;
  let c: RegExpExecArray | null;
  while ((c = containerRe.exec(html))) {
    const cls = c[1];
    const group = /unico/i.test(cls) ? "Unico rose" : /standard/i.test(cls) ? "Standard rose" : "Finishes";
    const itemRe = /data-finitura="([^"]+)"[\s\S]*?<span class="tooltip-description">([\s\S]*?)<\/span>/g;
    let i: RegExpExecArray | null;
    while ((i = itemRe.exec(c[2]))) {
      const code = decode(i[1]);
      const label = decode(i[2]);
      const key = `${group}|${code}`;
      if (!code || seen.has(key)) continue;
      seen.add(key);
      out.push({ code, label, group });
    }
  }
  return out;
}

function parseProduct(html: string, path: string, setting: string): RawProduct {
  const [sectionSlug, handleSlug] = path.split("/");
  const crumbBlock = /<div class="wk_maniglia_breadcrumb[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "";
  const breadcrumb = decode(crumbBlock)
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  const designBlock = /<span class="maniglia_design">([\s\S]*?)<\/span>\s*(?:<\/|<div)/.exec(html)?.[1] ?? "";
  const design =
    decode(designBlock)
      .replace(/^design:\s*/i, "")
      .replace(/\bUnico\b/g, " ")
      .replace(/[.\s]+/g, " ")
      .trim() || null;

  const roses: string[] = [];
  if (/class="standard_field"/.test(html)) roses.push("standard");
  if (/class="unico_field"/.test(html)) roses.push("unico");

  // Dnd exposes two documents per handle; record them under ATC's own labels.
  const downloads: string[] = [];
  if (/wk_tm_download_scheda/.test(html)) downloads.push("Drawings and technical info");
  if (/wk_tm_download_catalogo/.test(html)) downloads.push("Catalogue sheet");

  const familyBlock = /Products in the same family([\s\S]*?)(?:<footer|Instagram)/.exec(html)?.[1] ?? "";
  const family = [
    ...new Set(
      [...familyBlock.matchAll(/<h[2-6][^>]*>([\s\S]*?)<\/h[2-6]>/g)].map((m) => decode(m[1])).filter(Boolean),
    ),
  ];

  const text = decode(html.replace(/<script[\s\S]*?<\/script>/g, " "));
  const awards = [
    ...new Set(
      [...text.matchAll(/([A-Z][A-Za-z0-9'\u2019 ,&-]{0,70}(?:Award|Awards)[A-Za-z0-9 ,&-]{0,40})/g)]
        .map((m) => m[1].replace(/\s+/g, " ").trim())
        .filter((a) => a.length > 8 && a.length < 90 && !/Design Awards\?$/.test(a)),
    ),
  ];

  // The h1 carries a "new" badge span that must not end up inside the name.
  const h1Raw = /<h1 class="maniglia_title"[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "";
  const h2Raw = /<h2 class="maniglia_title"[^>]*>([\s\S]*?)<\/h2>/.exec(html)?.[1] ?? "";
  const badges: string[] = [];
  if (/new_label/.test(h1Raw + h2Raw)) badges.push("New");
  const nameOf = (raw: string): string => decode(raw.replace(/<span class="new_label">[\s\S]*?<\/span>/g, " "));
  const title = nameOf(h1Raw) || nameOf(h2Raw) || breadcrumb.at(-1) || handleSlug;

  const techSheetUrl = /href="(https:\/\/magic\.dndhandles\.it\/[^"]*tech-sheet[^"]*)"/.exec(html)?.[1]?.replace(/&amp;/g, "&") ?? null;

  return {
    sourceUrl: `${BASE}/${path}/`,
    setting,
    sectionSlug,
    handleSlug,
    title,
    designer: firstMatch(html, /<h6 class="maniglia_designer"[^>]*>([\s\S]*?)<\/h6>/) || null,
    breadcrumb,
    design,
    roses,
    unico: /class="unico_field"|wk-unico-finishes/.test(html),
    badges,
    techSheetUrl,
    finishes: parseFinishes(html),
    downloads: [...new Set(downloads)],
    family,
    awards,
    videos: (html.match(/<video|youtube\.com\/embed/g) ?? []).length,
    imageCount: new Set(
      [...html.matchAll(/https:\/\/www\.dndhandles\.it\/wp-content\/uploads\/[^"')\s]+\.(?:jpg|jpeg|png|webp)/g)].map(
        (m) => m[0],
      ),
    ).size,
  };
}

async function fetchPage(path: string): Promise<string> {
  const url = `${BASE}/${path}/`;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const res = await fetch(url, { headers: { "user-agent": "ATC-catalogue-import/1.0 (+https://amaratrading.com)" } });
    if (res.ok) return res.text();
    if (attempt === 3) throw new Error(`${url} -> HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
  throw new Error("unreachable");
}

async function main(): Promise<void> {
  const results: RawProduct[] = [];
  const failures: { path: string; error: string }[] = [];
  for (const target of TARGETS) {
    try {
      const html = await fetchPage(target.path);
      const parsed = parseProduct(html, target.path, target.setting);
      results.push(parsed);
      console.log(
        `ok   ${target.path} :: ${parsed.title} | finishes=${parsed.finishes.length} | family=${parsed.family.length} | awards=${parsed.awards.length}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ path: target.path, error: message });
      console.log(`FAIL ${target.path} :: ${message}`);
    }
    await new Promise((r) => setTimeout(r, 700));
  }
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify({ extractedAt: new Date().toISOString(), results, failures }, null, 2)}\n`);
  console.log(`\n${results.length} extracted, ${failures.length} failed -> ${OUT}`);
}

await main();
