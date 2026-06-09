#!/usr/bin/env node
/**
 * convert-to-glb.mjs — convert open-source hardware models to optimized GLB.
 *
 * Usage:
 *   node scripts/convert-to-glb.mjs <input-file> <part-id>
 *
 * IMPORTANT: <part-id> MUST equal the CatalogPart.id so the model auto-loads.
 *   e.g.  PM9A3 NVMe  → part id "nvme-samsung-pm9a3-1920gb-u2"
 *
 * Examples:
 *   node scripts/convert-to-glb.mjs ~/Downloads/nvme.glb  nvme-samsung-pm9a3-1920gb-u2
 *   node scripts/convert-to-glb.mjs ~/Downloads/psu.obj   psu-delta-dps800ab-800w
 *
 * Output: src/sim/hardware-library/models/<part-id>.glb  (Draco-compressed)
 *         → auto-detected by model-registry, no code edits needed.
 *
 * Supported inputs:
 *   .glb / .gltf   → optimize + Draco compress      (via npx gltf-pipeline)
 *   .obj           → convert + compress             (via npx obj2gltf + gltf-pipeline)
 *   .stl / .step   → NOT pure-Node; see instructions printed by this script
 *
 * No package.json deps are added — tools are fetched on demand via `npx`.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../src/sim/hardware-library/models');

const [, , inputArg, nameArg] = process.argv;

if (!inputArg || !nameArg) {
  console.error('用法: node scripts/convert-to-glb.mjs <输入文件> <输出名>');
  console.error('示例: node scripts/convert-to-glb.mjs ~/Downloads/nvme.glb nvme-pm9a3');
  process.exit(1);
}

const input = resolve(process.cwd(), inputArg);
if (!existsSync(input)) {
  console.error(`✗ 找不到输入文件: ${input}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
const out = resolve(OUT_DIR, `${nameArg}.glb`);
const ext = extname(input).toLowerCase();

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  if (ext === '.glb' || ext === '.gltf') {
    // Optimize + Draco compress in place
    run(`npx --yes gltf-pipeline -i "${input}" -o "${out}" -d`);
  } else if (ext === '.obj') {
    const tmp = resolve(OUT_DIR, `${nameArg}.tmp.glb`);
    run(`npx --yes obj2gltf -i "${input}" -o "${tmp}" -b`);
    run(`npx --yes gltf-pipeline -i "${tmp}" -o "${out}" -d`);
    rmSync(tmp, { force: true });
  } else if (ext === '.stl' || ext === '.step' || ext === '.stp' || ext === '.iges' || ext === '.igs') {
    console.error(`\n✗ ${ext} 无法在纯 Node 环境直接转换。请先转成 GLB/OBJ：\n`);
    console.error('  方案 1 — FreeCAD（STEP/IGES）：');
    console.error('    打开 FreeCAD → 导入文件 → File → Export → glTF 2.0 (.glb)');
    console.error('    然后: node scripts/convert-to-glb.mjs 导出的.glb ' + nameArg + '\n');
    console.error('  方案 2 — Blender（任意格式）：');
    console.error('    导入 → File → Export → glTF 2.0 (.glb)，再跑本脚本压缩\n');
    console.error('  方案 3 — STL 在线转 GLB：https://products.aspose.app/3d/conversion/stl-to-glb\n');
    process.exit(2);
  } else {
    console.error(`✗ 不支持的格式: ${ext}`);
    process.exit(1);
  }

  console.log(`\n✓ 完成: ${out}`);
  console.log(`\n该模型已按 part id「${nameArg}」命名，model-registry 会自动加载，无需改代码。`);
  console.log(`刷新页面即可在模型库看到「● 开源 GLB 模型」徽标。\n`);
  console.log(`⚠ 若徽标仍是「程序化几何」，请确认 ${nameArg} 与 parts-catalog.ts 里的 id 完全一致。\n`);
} catch (err) {
  console.error('\n✗ 转换失败:', err.message);
  process.exit(1);
}
