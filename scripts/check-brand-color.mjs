#!/usr/bin/env node
/**
 * 品牌色检查器 — 全项目强制约束 CLAUDE.md「品牌色（写死）」
 *
 * 品牌色 #0077FF 是全项目高亮色 / 重点按钮的唯一取值。
 * 允许集合（且仅此集合）：
 *   #0077FF  主色（highlight / primary button）
 *   #3291FE  hover（= rgba(50,145,254,1)）
 *   #0062D6  active / pressed
 *   rgba(0,119,255,α) / var(--brand-*) / var(--primary*) / var(--ark-blue-*)
 *
 * 检查范围：web-app/{src,public}、web-app-vue/{src,public}、webview/src、src
 *           （dist / assets 等构建产物、node_modules、外部移植目录跳过）
 *
 * 规则：
 *  B1 退役主蓝硬禁 —— 历史主色/强调色字面量（#4369ef、#4F46E5、#4f6ef7、
 *     rgba(67,105,239,…) 等）不得再出现。这些值没有 data-viz 用途，
 *     确属拓扑/图表分类色时用 data-viz-exempt 标记豁免（见下）。
 *  B2 品牌 token 取值 —— --primary / --primary-hover / --accent-blue /
 *     --focus-ring / --state-focus / --btn-primary-bg-color 等品牌类 token
 *     的字面值必须落在允许集合内。
 *  B3 var() 兜底值 —— var(--primary, X) / var(--accent, X) 的兜底 X 必须是 #0077FF。
 *
 * data-viz 豁免（只对 B1 生效，B2/B3 永不豁免）：
 *   · 行内或前 3 行出现 `data-viz-exempt`
 *   · `data-viz-exempt:start` … `data-viz-exempt:end` 区块内
 *   · 文件任意处出现 `data-viz-exempt:file`（整文件豁免）
 *   拓扑节点/连线/图表分类色属于 data-viz，不是 UI 高亮色，可以豁免；
 *   按钮、选中态、焦点环、hover 高亮不属于 data-viz，一律不得豁免。
 *
 * 用法：node scripts/check-brand-color.mjs [file ...]
 *       不带参数时全量检查。违规 exit 1。
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

const SCAN_ROOTS = [
  'web-app/src', 'web-app/public',
  'web-app-vue/src', 'web-app-vue/public',
  'webview/src', 'src',
];
// 构建产物 / 外部移植 bundle：源头不在本仓库，改不动也不该改
const SKIP_DIRS = new Set([
  'node_modules', 'dist', 'out', 'build', 'assets', '_archive',
  'csr-topo-ext', '3d-viewer', 'images', 'samples', 'sr-samples', 'data',
]);
const EXTS = new Set(['.css', '.html', '.tsx', '.ts', '.jsx', '.js', '.vue']);

/** B1：已退役的主色/强调色字面量。正则 → 人类可读名。 */
const RETIRED = [
  [/#4369ef/gi,                             '#4369ef（旧 PTO 主蓝）'],
  [/#3457d5/gi,                             '#3457d5（旧主蓝 hover）'],
  [/#5a92e6/gi,                             '#5a92e6（旧主蓝 hover）'],
  [/#5b8af5/gi,                             '#5b8af5（私造 indigo）'],
  [/#6159ef/gi,                             '#6159ef（私造 indigo）'],
  [/#4f46e5/gi,                             '#4F46E5（私造 indigo）'],
  [/#4f6ef7/gi,                             '#4f6ef7（旧强调 indigo）'],
  [/#7c8cf8/gi,                             '#7c8cf8（旧强调 indigo 浅调）'],
  [/#7c9aff/gi,                             '#7c9aff（旧强调 indigo 浅调）'],
  [/#7b9fff/gi,                             '#7b9fff（旧强调 indigo 浅调）'],
  [/#a5b4fc/gi,                             '#a5b4fc（旧强调 indigo 浅调）'],
  [/rgba\(\s*67,\s*105,\s*239\s*,/g,        'rgba(67,105,239,…)（旧 PTO 主蓝）'],
  [/rgba\(\s*79,\s*110,\s*247\s*,/g,        'rgba(79,110,247,…)（旧强调 indigo）'],
  [/rgba\(\s*129,\s*140,\s*248\s*,/g,       'rgba(129,140,248,…)（旧强调 indigo）'],
  [/rgba\(\s*99,\s*130,\s*255\s*,/g,        'rgba(99,130,255,…)（旧强调 indigo）'],
  [/rgba\(\s*100,\s*140,\s*255\s*,/g,       'rgba(100,140,255,…)（旧强调 indigo）'],
  [/rgba\(\s*120,\s*150,\s*255\s*,/g,       'rgba(120,150,255,…)（旧强调 indigo）'],
  // tailwind blue / indigo 全家桶：肉眼与品牌色难以区分，最容易被误当主色用
  [/#3b82f6/gi,                             '#3b82f6（tailwind blue-500）'],
  [/#2563eb/gi,                             '#2563eb（tailwind blue-600）'],
  [/#1d4ed8/gi,                             '#1d4ed8（tailwind blue-700）'],
  [/#60a5fa/gi,                             '#60a5fa（tailwind blue-400）'],
  [/#93c5fd/gi,                             '#93c5fd（tailwind blue-300）'],
  [/#818cf8/gi,                             '#818cf8（tailwind indigo-400）'],
  [/#6366f1/gi,                             '#6366f1（tailwind indigo-500）'],
  [/#4a90e2/gi,                             '#4a90e2（旧 VSCode 蓝）'],
  [/#007acc/gi,                             '#007acc（旧 VSCode 蓝）'],
  [/#1e90ff/gi,                             '#1e90ff（dodgerblue）'],
  [/#4da3ff/gi,                             '#4DA3FF（已取消的品牌派生浅蓝，统一用 #0077FF）'],
  [/rgba\(\s*59,\s*130,\s*246\s*,/g,        'rgba(59,130,246,…)（tailwind blue-500）'],
  [/rgba\(\s*37,\s*99,\s*235\s*,/g,         'rgba(37,99,235,…)（tailwind blue-600）'],
];

/** B2：品牌类 token —— 取值必须落在允许集合内。
 *  注意 --state-hover / --state-press / --state-selected 是 ArkUI 式中性叠加层
 *  （rgba(255,255,255,α)），刻意不带色相，不在此列。 */
const BRAND_TOKENS = /--(brand-primary(?:-hover|-active|-soft|-ring|-rgb)?|primary|primary-hover|primary-active|accent-blue|accent-primary|accent-hi|ark-blue-\d{3}|focus-ring|state-focus|btn-primary-bg-color(?:_active)?|el-color-primary)\s*:\s*([^;}\n]+)/g;

/** 允许出现在品牌 token 值里的东西 */
const ALLOWED_VALUE = /^(?:#0077ff|#3291fe|#0062d6|0,\s*119,\s*255|rgba?\(\s*0\s*,\s*119\s*,\s*255\b[^)]*\)|var\(--(?:brand-|primary|ark-blue-|accent\b)[^)]*\)|color-mix\([^;]*\)|inherit|currentcolor|transparent|none)$/i;

/** B3：var(--primary, X) 兜底值 */
const VAR_FALLBACK = /var\(\s*--(?:primary|brand-primary|accent-blue|accent-primary)\s*,\s*([^)]+)\)/g;

function collect(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...collect(p));
    else if (EXTS.has(extname(name))) out.push(p);
  }
  return out;
}

/** 计算每一行是否被 data-viz 豁免 */
function exemptMap(lines) {
  const fileWide = lines.some(l => l.includes('data-viz-exempt:file'));
  const map = new Array(lines.length).fill(fileWide);
  if (fileWide) return map;

  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.includes('data-viz-exempt:start')) inBlock = true;
    if (inBlock) map[i] = true;
    if (l.includes('data-viz-exempt:end')) inBlock = false;
  }
  // 行内标记 + 向后 3 行的作用域
  for (let i = 0; i < lines.length; i++) {
    if (!/data-viz-exempt/i.test(lines[i])) continue;
    for (let j = i; j < Math.min(lines.length, i + 4); j++) map[j] = true;
  }
  return map;
}

const args = process.argv.slice(2).filter(a => EXTS.has(extname(a)));
const files = args.length ? args : SCAN_ROOTS.flatMap(r => collect(join(ROOT, r)));

let bad = 0;
let violations = 0;
for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const rel = relative(ROOT, f);
  const lines = src.split('\n');
  const exempt = exemptMap(lines);
  const problems = [];

  lines.forEach((line, i) => {
    const n = i + 1;

    // B1 退役主蓝
    if (!exempt[i]) {
      for (const [re, name] of RETIRED) {
        re.lastIndex = 0;
        if (re.test(line)) {
          problems.push(`${rel}:${n}  B1 退役主蓝 ${name} —— 高亮/重点按钮请改用品牌色 #0077FF`);
        }
      }
    }

    // B2 品牌 token 取值（不可豁免）
    for (const m of line.matchAll(BRAND_TOKENS)) {
      const value = m[2].trim().replace(/\s*\/\*.*$/, '').trim();
      if (!ALLOWED_VALUE.test(value)) {
        problems.push(`${rel}:${n}  B2 品牌 token --${m[1]} 取值 "${value}" 不是品牌色 —— 只允许 #0077FF/#3291FE/#0062D6/rgba(0,119,255,α)/var(--brand-*)`);
      }
    }

    // B3 var() 兜底值（不可豁免）
    for (const m of line.matchAll(VAR_FALLBACK)) {
      const fb = m[1].trim();
      if (!/^#0077ff$/i.test(fb) && !/^var\(--brand-/i.test(fb)) {
        problems.push(`${rel}:${n}  B3 var() 兜底值 "${fb}" 不是品牌色 —— 请写 var(--primary, #0077FF)`);
      }
    }
  });

  if (problems.length) {
    bad++;
    violations += problems.length;
    console.error(`\n✗ ${rel}`);
    for (const p of problems) console.error(`   ${p.slice(rel.length + 1)}`);
  }
}

if (bad) {
  console.error(`\n共 ${bad} 个文件 / ${violations} 处违反品牌色约束。`);
  console.error('品牌色 #0077FF 是全项目高亮色与重点按钮的唯一取值，规范见 CLAUDE.md「品牌色（写死）」。');
  console.error('确属拓扑/图表分类色（非 UI 高亮）时，用 data-viz-exempt 标记豁免。');
  process.exit(1);
}
console.log(`✓ 品牌色约束检查通过（${files.length} 个文件，品牌色 #0077FF）`);
