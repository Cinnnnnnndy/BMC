#!/usr/bin/env node
/**
 * UI 样式约束检查器 — 持续约束 CLAUDE.md「欢迎系页面视觉规范」
 *
 * 检查范围：web-app/public/ 下手写的独立 HTML 页面
 * （vue-topo / csr-topo-ext / 3d-viewer / setup-wizard 为构建产物或外部移植，跳过）
 *
 * 规则：
 *  R1 必须包含全局深色滚动条约束块（::-webkit-scrollbar + scrollbar-width: thin）
 *  R2 禁用游离配色 —— 强调色只允许 #a78bfa（紫）/ #0077FF（蓝），
 *     禁止私造 indigo/violet/旧蓝（#4369ef、#4F46E5、#5b8af5、#6159ef …）
 *  R3 面型图标优先 —— AI/agent 入口图标必须是 fill 型 ✦ 四角星，
 *     检测存量描边星形（stroke 星 path）作为回归信号
 *  R4 卡片/按钮减少描边 —— 检测「border: 1px solid rgba(255,255,255」超过阈值
 *     （每页最多 2 处，细分隔线请用 border-bottom 或背景分层）
 *  R5 嵌入 IDE pane 页禁止渐变背景 —— 只有 welcome 系全屏页用蓝紫渐变，
 *     嵌入页面用实底 #101010
 *  R6 必须声明完整 :root token 块 —— 至少包含 --background、--surface-1、--primary
 *  R7 胶囊造型 —— 按钮/chip 必须使用 border-radius: 100px 或 999px，
 *     禁止 8px / 12px 等非胶囊圆角
 *  R8 禁用私造绿色 —— 成功色只允许 #04d793
 *
 * 用法：node scripts/check-ui-style.mjs [file.html ...]
 *       不带参数时检查全部页面。违规 exit 1。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PUB = join(ROOT, 'web-app/public');
const SKIP_DIRS = new Set(['vue-topo', 'csr-topo-ext', '3d-viewer', 'setup-wizard', 'images', 'samples', 'welcome']);

const BANNED_COLORS = [
  '#4369ef', '#3457d5', '#5a92e6',
  '#4f46e5', '#5b8af5', '#7a9ff7', '#6159ef', '#7c3aed', '#8b5cf6',
  '#6366f1', '#818cf8', '#a5b4fc',
];

const BANNED_GREENS = ['#3dd68c', '#10b981', '#34d399'];

const WELCOME_FILES = new Set(['welcome.html', 'install-entry.html']);
const REQUIRED_ROOT_TOKENS = ['--background', '--surface-1', '--primary'];

function collectHtml(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) out.push(...collectHtml(p));
    } else if (name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

const args = process.argv.slice(2).filter(a => a.endsWith('.html'));
const files = args.length ? args : collectHtml(PUB);

let bad = 0;
for (const f of files) {
  let src;
  try { src = readFileSync(f, 'utf8'); } catch { continue; }
  const rel = relative(ROOT, f);
  const problems = [];

  // R1 滚动条约束
  if (!src.includes('::-webkit-scrollbar') || !src.includes('scrollbar-width: thin')) {
    problems.push('R1 缺少全局深色滚动条约束块（见 CLAUDE.md）');
  }

  // R2 游离配色
  const lower = src.toLowerCase();
  for (const c of BANNED_COLORS) {
    if (lower.includes(c)) problems.push(`R2 使用了禁用配色 ${c} —— 强调色只允许 #a78bfa（紫）/ #0077FF（蓝）`);
  }

  // R3 描边星形图标（AI 入口应为 fill 型 ✦）
  if (/stroke="currentColor"[^>]*>[^<]*<path d="M12 2l2\.4 7\.4/.test(src.replace(/\n/g, ''))) {
    problems.push('R3 检测到描边星形图标，AI/agent 入口请改用 fill 型 ✦（path M12 2l1.9 6.1…）');
  }

  // R4 白色描边框线阈值
  const borders = (src.match(/border:\s*1(\.5)?px solid rgba\(255,\s*255,\s*255/g) || []).length;
  if (borders > 2) {
    problems.push(`R4 白色描边框线 ${borders} 处（上限 2）—— 卡片/按钮/输入框请用填充色分层`);
  }

  // R5 嵌入页禁渐变（welcome 系全屏页除外）
  const basename = f.split('/').pop();
  if (!WELCOME_FILES.has(basename) && /radial-gradient\([^)]*rgba\(\s*161/.test(src)) {
    problems.push('R5 嵌入 IDE pane 页面不应使用蓝紫渐变背景 —— 请用实底 #101010');
  }

  // R6 :root token 完整声明
  const missingTokens = REQUIRED_ROOT_TOKENS.filter(t => !src.includes(t));
  if (missingTokens.length) {
    problems.push(`R6 缺少 :root token 声明：${missingTokens.join(', ')} —— 独立页面必须自带完整 token`);
  }

  // R7 胶囊造型（按钮/chip 圆角必须 100px 或 999px）
  const badRadius = (src.match(/border-radius:\s*(8|12)px/g) || []).length;
  if (badRadius > 0) {
    problems.push(`R7 检测到 ${badRadius} 处非胶囊圆角（8px/12px）—— 按钮/chip 请用 border-radius: 100px`);
  }

  // R8 禁用私造绿色
  for (const c of BANNED_GREENS) {
    if (lower.includes(c)) problems.push(`R8 使用了禁用绿色 ${c} —— 成功色只允许 #04d793`);
  }

  if (problems.length) {
    bad++;
    console.error(`\n✗ ${rel}`);
    for (const p of problems) console.error(`   ${p}`);
  }
}

if (bad) {
  console.error(`\n共 ${bad} 个文件违反视觉规范。规范全文见 CLAUDE.md「欢迎系页面视觉规范」。`);
  process.exit(1);
}
console.log(`✓ UI 样式约束检查通过（${files.length} 个页面）`);
