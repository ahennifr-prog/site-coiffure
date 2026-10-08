/**
 * Vérifie les textes visibles : content.ts et le texte JSX des composants.
 * Échoue si l'on trouve un tiret de ponctuation, un emoji ou une formule interdite.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");

const FORBIDDEN = [
  "découvrez", "révolutionn", "boostez", "booster", "libérez le potentiel", "dans un monde où",
  "n'attendez plus", "clé en main", "solution innovante", "plateforme tout-en-un",
  "passez au niveau supérieur", "ne cherchez plus", "non seulement", "insight", "leads",
  "game changer", "lorem", "todo", "xxx",
];

function files(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", "tests", "scripts"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files(p, out);
    else if (/\.(tsx|ts)$/.test(name) && !name.endsWith(".d.ts") && !name.includes(".config")) out.push(p);
  }
  return out;
}

/** Chaînes littérales et texte entre balises JSX. */
function visibleStrings(src: string, isTsx: boolean): { text: string; line: number }[] {
  const out: { text: string; line: number }[] = [];
  const lineOf = (i: number) => src.slice(0, i).split("\n").length;
  const re = /"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const text = m[1] ?? m[2] ?? "";
    // On ne garde que ce qui ressemble à une phrase française.
    if (/[a-zà-ÿ]{3,} [a-zà-ÿ]/i.test(text)) out.push({ text, line: lineOf(m.index) });
  }
  if (isTsx) {
    const jsx = />([^<>{}]*[a-zà-ÿ]{3,}[^<>{}]*)</gi;
    while ((m = jsx.exec(src))) {
      const text = m[1].trim();
      if (text && !/[=;]|=>|\(\)/.test(text)) out.push({ text, line: lineOf(m.index) });
    }
  }
  return out;
}

const problems: string[] = [];
for (const file of [join(root, "content.ts"), join(root, "config.ts"), ...files(join(root, "app")), ...files(join(root, "components")), ...files(join(root, "textes"))]) {
  const src = readFileSync(file, "utf8");
  const rel = file.replace(root + "/", "");
  if (/[–—]/.test(src)) problems.push(`${rel} : tiret cadratin ou demi-cadratin`);
  if (/\p{Extended_Pictographic}/u.test(src.replace(/[©®™]/g, ""))) problems.push(`${rel} : emoji`);
  for (const { text, line } of visibleStrings(src, file.endsWith(".tsx"))) {
    const lower = text.toLowerCase();
    if (/\S -\s|\s- \S/.test(text) && !/^\s*-\d/.test(text)) problems.push(`${rel}:${line} : tiret de ponctuation dans « ${text} »`);
    for (const f of FORBIDDEN) if (lower.includes(f)) problems.push(`${rel}:${line} : formule interdite « ${f} » dans « ${text} »`);
    if ((text.match(/!/g) ?? []).length > 1) problems.push(`${rel}:${line} : points d'exclamation répétés`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} problème(s) de rédaction.`);
  process.exit(1);
}
console.log("Textes conformes : aucun tiret de ponctuation, emoji ou formule interdite.");
