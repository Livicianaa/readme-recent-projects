import { appendFile, readFile, writeFile } from "node:fs/promises";

const env = process.env;
const USER = env.RRP_USERNAME;
const LIMIT = Number(env.RRP_LIMIT || 4);
const SKIP = env.RRP_SKIP ? new RegExp(env.RRP_SKIP, "i") : null;
const THEME = env.RRP_THEME || "tokyonight";
const README = env.RRP_README || "README.md";
const HEADING = env.RRP_HEADING || "## Recent Projects";

if (!USER) throw new Error("username is empty");

const headers = { "User-Agent": "readme-recent-projects", Accept: "application/vnd.github+json" };
if (env.RRP_TOKEN) headers.Authorization = `Bearer ${env.RRP_TOKEN}`;

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${path}: ${await res.text()}`);
  return res.json();
}

const user = await api(`/users/${USER}`);
const repos = (await api(`/users/${USER}/repos?sort=pushed&per_page=100`))
  .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== user.login.toLowerCase())
  .filter((r) => !SKIP || !SKIP.test(r.name))
  .slice(0, LIMIT);

const today = new Date().toISOString().slice(0, 10);
const cards = repos.map(
  (r) =>
    `  <a href="${r.html_url}"><img src="https://github-readme-stats.vercel.app/api/pin/?username=${user.login}&repo=${encodeURIComponent(r.name)}&theme=${THEME}&hide_border=true" width="47%" alt="${r.name}"/></a>`
);
const rows = [];
for (let i = 0; i < cards.length; i += 2) rows.push(cards.slice(i, i + 2).join("\n"));

const block = [
  "<!--RECENT:start-->",
  `<!-- updated ${today} -->`,
  '<div align="center">',
  rows.join("\n  <br>\n"),
  "</div>",
  "<!--RECENT:end-->",
].join("\n");

const MARKERS = /<!--RECENT:start-->[\s\S]*?<!--RECENT:end-->/;
const readme = await readFile(README, "utf8");
const next = MARKERS.test(readme)
  ? readme.replace(MARKERS, block)
  : `${readme.trimEnd()}\n\n${HEADING}\n\n${block}\n`;

if (next !== readme) await writeFile(README, next);
console.log(`${repos.length} repos: ${repos.map((r) => r.name).join(", ")}`);

if (env.GITHUB_OUTPUT) {
  await appendFile(
    env.GITHUB_OUTPUT,
    `login=${user.login}\nemail=${user.id}+${user.login}@users.noreply.github.com\n`
  );
}
