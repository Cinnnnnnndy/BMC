/* ====================================================================
   openUBMC Studio · Power & Fan Template
   能效调速配置编辑器 — 状态驱动渲染
   ==================================================================== */

const TEMP_TYPES = ['CpuInlet', 'Cpu', 'CpuCore', 'Memory', 'Disk', 'PSU', 'Ambient', 'NetworkAdapter'];
const COND_VALS  = ['EnergySaving', 'Balanced', 'HighPerformance'];

/* ── Initial state ── */
const state = {
  global: {
    slot_id: 1,
    smart_cooling_state: 'Enabled',
    default_duty: 40,
    fan_zones: 2,
    psu_calibration: 'Auto',
    sample_period_ms: 1000,
  },
  temps: [
    { id: 1, name: 'CPU 进风口', temperature_type: 'CpuInlet',  target_celsius: 35, max_celsius: 55, sensor_path: '/sys/cpu/inlet' },
    { id: 2, name: 'CPU 核心',   temperature_type: 'CpuCore',   target_celsius: 75, max_celsius: 95, sensor_path: '/sys/cpu/core' },
    { id: 3, name: '硬盘区域',   temperature_type: 'Disk',      target_celsius: 45, max_celsius: 60, sensor_path: '/sys/disk/zone1' },
  ],
  fans: [
    { id: 1, name: 'Fan_1', position: 'Front-Left',  fan_type: 'Delta_PFC1212DE', min_duty: 10, max_duty: 100 },
    { id: 2, name: 'Fan_2', position: 'Front-Mid',   fan_type: 'Delta_PFC1212DE', min_duty: 10, max_duty: 100 },
    { id: 3, name: 'Fan_3', position: 'Front-Right', fan_type: 'Delta_PFC1212DE', min_duty: 10, max_duty: 100 },
    { id: 4, name: 'Fan_4', position: 'Rear-Left',   fan_type: 'NMB_08038SA',     min_duty: 15, max_duty: 100 },
    { id: 5, name: 'Fan_5', position: 'Rear-Right',  fan_type: 'NMB_08038SA',     min_duty: 15, max_duty: 100 },
  ],
  policies: [
    { id: 0, name: '节能模式', exp_cond_val: 'EnergySaving',
      temperature_range_low:  [-127, 20, 40, 60],
      temperature_range_high: [20, 40, 60, 127],
      speed_range_low:        [20, 30, 50, 80],
      speed_range_high:       [30, 50, 80, 100] },
    { id: 1, name: '高性能',   exp_cond_val: 'HighPerformance',
      temperature_range_low:  [-127, 15, 30, 50],
      temperature_range_high: [15, 30, 50, 127],
      speed_range_low:        [40, 50, 70, 95],
      speed_range_high:       [50, 70, 95, 100] },
  ],
  areas: [
    { id: 1, name: '前区', requirement_idx: 1, policy_idx_group: [0, 1], fan_idx_group: [1, 2, 3] },
    { id: 2, name: '后区', requirement_idx: 2, policy_idx_group: [0],    fan_idx_group: [4, 5] },
  ],
  ui: {
    foldComments: true,
    csrOpen: false,
    csrTab: 'psr',
    viewMode: 'split',
    focusedArea: 1,
    activeRow: null,
  },
};

/* ── HTML escape ── */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ==================================================================
   Quick Nav
   ================================================================== */
function renderQuickNav() {
  const host = document.getElementById('quick-nav');
  const groups = [
    { key: 'temp',   label: '温度点', items: state.temps    },
    { key: 'fan',    label: '风扇',   items: state.fans     },
    { key: 'policy', label: '策略',   items: state.policies },
    { key: 'area',   label: '区域',   items: state.areas    },
  ];
  host.innerHTML = groups.map(g => `
    <div class="qn-row">
      <span class="qn-label">${g.label} <b>${g.items.length}</b></span>
      <div class="qn-pills">
        ${g.items.map(it => `
          <button class="qn-pill" data-jump="${g.key}-${it.id}" title="${esc(it.name || '')}">#${it.id}</button>
        `).join('')}
        <button class="qn-add" data-add="${g.key}">+ 新增</button>
      </div>
    </div>
  `).join('');
  host.querySelectorAll('.qn-pill').forEach(el => {
    el.addEventListener('click', () => jumpTo(el.dataset.jump));
  });
  host.querySelectorAll('.qn-add').forEach(el => {
    el.addEventListener('click', () => addEntity(el.dataset.add));
  });
}

function jumpTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 1400);
  state.ui.activeRow = id;
}

/* ==================================================================
   Section counts
   ================================================================== */
function renderCounts() {
  document.getElementById('cnt-temp').textContent   = state.temps.length;
  document.getElementById('cnt-fan').textContent    = state.fans.length;
  document.getElementById('cnt-policy').textContent = state.policies.length;
  document.getElementById('cnt-area').textContent   = state.areas.length;
}

/* ==================================================================
   Global field binding
   ================================================================== */
function bindGlobalListeners() {
  const map = [
    ['f-slot-id',       'slot_id',            'int'],
    ['f-smart-state',   'smart_cooling_state', 'str'],
    ['f-default-duty',  'default_duty',        'int'],
    ['f-fan-zones',     'fan_zones',           'int'],
    ['f-psu-cal',       'psu_calibration',     'str'],
    ['f-sample-period', 'sample_period_ms',    'int'],
  ];
  for (const [eid, key, type] of map) {
    const el = document.getElementById(eid);
    if (!el || el.dataset.bound) continue;
    el.dataset.bound = '1';
    el.addEventListener('input', () => {
      state.global[key] = type === 'int' ? (parseInt(el.value, 10) || 0) : el.value;
      sideEffects();
    });
  }
}

/* ==================================================================
   Temperature rows
   ================================================================== */
function renderTemps() {
  const host = document.getElementById('list-temp');
  host.innerHTML = state.temps.map((t, idx) => `
    <div class="row-compact" id="temp-${t.id}" data-i="${idx}" data-kind="temp">
      <span class="row-id">#${t.id}</span>
      <div class="cell" style="flex:1.4;min-width:140px;">
        <span class="cell-lbl">name</span>
        <input data-k="name" value="${esc(t.name)}" />
      </div>
      <div class="cell" style="width:130px;">
        <span class="cell-lbl">type</span>
        <select data-k="temperature_type">
          ${TEMP_TYPES.map(v => `<option ${v === t.temperature_type ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </div>
      <div class="cell" style="width:76px;">
        <span class="cell-lbl">target °C</span>
        <input data-k="target_celsius" type="number" value="${t.target_celsius}" />
      </div>
      <div class="cell" style="width:76px;">
        <span class="cell-lbl">max °C</span>
        <input data-k="max_celsius" type="number" value="${t.max_celsius}" />
      </div>
      <div class="cell" style="flex:1.4;min-width:160px;">
        <span class="cell-lbl">sensor path</span>
        <input data-k="sensor_path" value="${esc(t.sensor_path)}" />
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.temps,
    ['name', 'temperature_type', 'target_celsius', 'max_celsius', 'sensor_path'],
    { numKeys: ['target_celsius', 'max_celsius'] });
}

/* ==================================================================
   Fan rows
   ================================================================== */
function renderFans() {
  const host = document.getElementById('list-fan');
  host.innerHTML = state.fans.map((f, idx) => `
    <div class="row-compact" id="fan-${f.id}" data-i="${idx}" data-kind="fan">
      <span class="row-id">#${f.id}</span>
      <div class="cell" style="width:110px;">
        <span class="cell-lbl">name</span>
        <input data-k="name" value="${esc(f.name)}" />
      </div>
      <div class="cell" style="flex:1;min-width:140px;">
        <span class="cell-lbl">position</span>
        <input data-k="position" value="${esc(f.position)}" placeholder="Front-Left / Rear-Mid …" />
      </div>
      <div class="cell" style="flex:1.2;min-width:160px;">
        <span class="cell-lbl">type</span>
        <input data-k="fan_type" value="${esc(f.fan_type)}" />
      </div>
      <div class="cell" style="width:70px;">
        <span class="cell-lbl">min %</span>
        <input data-k="min_duty" type="number" value="${f.min_duty}" />
      </div>
      <div class="cell" style="width:70px;">
        <span class="cell-lbl">max %</span>
        <input data-k="max_duty" type="number" value="${f.max_duty}" />
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.fans,
    ['name', 'position', 'fan_type', 'min_duty', 'max_duty'],
    { numKeys: ['min_duty', 'max_duty'] });
}

/* ==================================================================
   Policy rows (with curve mini SVG)
   ================================================================== */
function renderPolicies() {
  const host = document.getElementById('list-policy');
  host.innerHTML = state.policies.map((p, idx) => `
    <div class="row-compact row-policy" id="policy-${p.id}" data-i="${idx}" data-kind="policy">
      <div class="top">
        <span class="row-id">#${p.id}</span>
        <div class="cell" style="flex:1.2;min-width:140px;">
          <span class="cell-lbl">name</span>
          <input data-k="name" value="${esc(p.name)}" />
        </div>
        <div class="cell" style="width:160px;">
          <span class="cell-lbl">trigger cond</span>
          <select data-k="exp_cond_val">
            ${COND_VALS.map(v => `<option ${v === p.exp_cond_val ? 'selected' : ''}>${v}</option>`).join('')}
          </select>
        </div>
        <div class="cell">
          <span class="cell-lbl">curve · ${p.temperature_range_low.length} 段</span>
          <div class="curve-mini" id="cv-${p.id}"></div>
        </div>
        <button class="row-del" data-del title="删除">✕</button>
      </div>
      <div class="arrays">
        <div class="cell"><span class="cell-lbl">T_low (°C)</span>
          <input data-k="temperature_range_low" value="${p.temperature_range_low.join(', ')}" /></div>
        <div class="cell"><span class="cell-lbl">T_high (°C)</span>
          <input data-k="temperature_range_high" value="${p.temperature_range_high.join(', ')}" /></div>
        <div class="cell"><span class="cell-lbl">S_low (%)</span>
          <input data-k="speed_range_low" value="${p.speed_range_low.join(', ')}" /></div>
        <div class="cell"><span class="cell-lbl">S_high (%)</span>
          <input data-k="speed_range_high" value="${p.speed_range_high.join(', ')}" /></div>
      </div>
    </div>
  `).join('');
  bindRowEvents(host, state.policies,
    ['name', 'exp_cond_val', 'temperature_range_low', 'temperature_range_high', 'speed_range_low', 'speed_range_high'],
    { arrayKeys: ['temperature_range_low', 'temperature_range_high', 'speed_range_low', 'speed_range_high'] });
  state.policies.forEach(p => drawCurve(document.getElementById('cv-' + p.id), p));
}

function drawCurve(host, policy) {
  if (!host) return;
  const lo = policy.temperature_range_low;
  const hi = policy.temperature_range_high;
  const slo = policy.speed_range_low;
  const shi = policy.speed_range_high;
  const pts = [];
  const n = Math.min(lo.length, hi.length, slo.length, shi.length);
  for (let i = 0; i < n; i++) {
    pts.push([lo[i], slo[i]]);
    pts.push([hi[i], shi[i]]);
  }
  if (pts.length === 0) { host.innerHTML = ''; return; }
  const w = 130, h = 44;
  const padL = 4, padR = 4, padT = 4, padB = 4;
  const tMin = Math.min(...pts.map(p => p[0]));
  const tMax = Math.max(...pts.map(p => p[0]));
  const xFor = t => padL + ((t - tMin) / (tMax - tMin || 1)) * (w - padL - padR);
  const yFor = s => padT + ((100 - s) / 100) * (h - padT - padB);
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + xFor(p[0]).toFixed(2) + ',' + yFor(p[1]).toFixed(2)).join(' ');
  const area = path
    + ` L ${xFor(tMax).toFixed(2)},${(h - padB).toFixed(2)}`
    + ` L ${xFor(tMin).toFixed(2)},${(h - padB).toFixed(2)} Z`;
  host.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${area}" fill="rgba(52,211,153,0.10)" />
    <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
  </svg>`;
}

/* ==================================================================
   Area rows + chip-multi pickers
   ================================================================== */
function renderAreas() {
  const host = document.getElementById('list-area');
  host.innerHTML = state.areas.map((a, idx) => {
    const focused = state.ui.focusedArea === a.id;
    return `
      <div class="row-compact row-area ${focused ? 'active' : ''}" id="area-${a.id}" data-i="${idx}" data-kind="area">
        <span class="row-id">#${a.id}</span>
        <div class="cell" style="flex:1.2;min-width:130px;">
          <span class="cell-lbl">name</span>
          <input data-k="name" value="${esc(a.name)}" />
        </div>
        <div class="cell" style="width:200px;">
          <span class="cell-lbl">temp point</span>
          <select data-k="requirement_idx">
            ${state.temps.map(t => `<option value="${t.id}" ${t.id === a.requirement_idx ? 'selected' : ''}>#${t.id} ${esc(t.name)}</option>`).join('')}
          </select>
        </div>
        <div class="cell" style="flex:1;min-width:180px;">
          <span class="cell-lbl">policies</span>
          ${renderChipMulti('policy', idx, a.policy_idx_group, state.policies)}
        </div>
        <div class="cell" style="flex:1.2;min-width:200px;">
          <span class="cell-lbl">fans</span>
          ${renderChipMulti('fan', idx, a.fan_idx_group, state.fans)}
        </div>
        <button class="row-del" data-del title="删除">✕</button>
      </div>
    `;
  }).join('');
  bindRowEvents(host, state.areas, ['name', 'requirement_idx'], { numKeys: ['requirement_idx'] });
  bindChipMulti(host);

  host.querySelectorAll('.row-compact').forEach(row => {
    const id = parseInt(row.id.replace('area-', ''), 10);
    row.addEventListener('mouseenter', () => {
      if (state.ui.focusedArea !== id) {
        state.ui.focusedArea = id;
        renderServerDiagram();
        host.querySelectorAll('.row-compact').forEach(r => r.classList.remove('active'));
        row.classList.add('active');
      }
    });
  });
}

function renderChipMulti(kind, areaIdx, selectedIds, options) {
  const chips = selectedIds.map(id => `
    <span class="chip">#${id}<span class="x" data-rm="${id}">×</span></span>
  `).join('');
  const optsHtml = options.map(o => {
    const taken = selectedIds.includes(o.id);
    return `<div class="opt ${taken ? 'disabled' : ''}" data-id="${o.id}" data-taken="${taken}">
      <span>#${o.id} ${esc(o.name || '')}</span>
      <span class="meta">${kind === 'policy' ? esc(o.exp_cond_val || '') : esc(o.position || '')}</span>
    </div>`;
  }).join('');
  return `
    <div class="chip-multi" data-multi="${kind}" data-area-i="${areaIdx}">
      ${chips}
      <button class="add-mini" data-toggle-menu>+
        <div class="add-menu">${optsHtml}</div>
      </button>
    </div>`;
}

function bindChipMulti(host) {
  host.querySelectorAll('.chip-multi').forEach(ms => {
    const areaIdx = parseInt(ms.dataset.areaI, 10);
    const kind = ms.dataset.multi;
    const key = kind === 'policy' ? 'policy_idx_group' : 'fan_idx_group';
    ms.querySelectorAll('[data-rm]').forEach(x => {
      x.addEventListener('click', e => {
        e.stopPropagation();
        const id = parseInt(x.dataset.rm, 10);
        const arr = state.areas[areaIdx][key];
        const i = arr.indexOf(id);
        if (i >= 0) arr.splice(i, 1);
        renderAreas(); sideEffects();
      });
    });
    const trigger = ms.querySelector('[data-toggle-menu]');
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.chip-multi.menu-open').forEach(x => { if (x !== ms) x.classList.remove('menu-open'); });
      ms.classList.toggle('menu-open');
    });
    ms.querySelectorAll('.opt').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        if (opt.dataset.taken === 'true') return;
        const id = parseInt(opt.dataset.id, 10);
        const arr = state.areas[areaIdx][key];
        if (!arr.includes(id)) { arr.push(id); arr.sort((a, b) => a - b); }
        ms.classList.remove('menu-open');
        renderAreas(); sideEffects();
      });
    });
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.chip-multi.menu-open').forEach(x => x.classList.remove('menu-open'));
});

/* ==================================================================
   Server diagram SVG
   ================================================================== */
function parseFanPosition(p) {
  const s = String(p || '').toLowerCase();
  const row = /rear|back|后/.test(s) ? 'rear' : 'front';
  let col = 'mid';
  if (/left|左/.test(s)) col = 'left';
  else if (/right|右/.test(s)) col = 'right';
  return { row, col };
}

function renderServerDiagram() {
  const host = document.getElementById('server-svg-host');
  const focused = state.areas.find(a => a.id === state.ui.focusedArea) || state.areas[0];
  const focusedFans = new Set(focused ? focused.fan_idx_group : []);
  const allBoundFans = new Set();
  state.areas.forEach(a => a.fan_idx_group.forEach(f => allBoundFans.add(f)));

  const buckets = {};
  state.fans.forEach(f => {
    const { row, col } = parseFanPosition(f.position);
    const k = `${row}-${col}`;
    if (!buckets[k]) buckets[k] = [];
    buckets[k].push(f);
  });

  const W = 380, H = 180;
  const chassis = `<rect class="sd-chassis" x="6" y="6" width="${W - 12}" height="${H - 12}" rx="6" />`;
  const hw = `
    <rect class="sd-hw" x="155" y="60" width="50" height="32" rx="2" />
    <text class="sd-hw-label" x="180" y="80">CPU 0</text>
    <rect class="sd-hw" x="215" y="60" width="50" height="32" rx="2" />
    <text class="sd-hw-label" x="240" y="80">CPU 1</text>
    <rect class="sd-hw" x="155" y="100" width="110" height="14" rx="2" />
    <text class="sd-hw-label" x="210" y="111">Memory</text>
    <rect class="sd-hw" x="155" y="120" width="110" height="14" rx="2" />
    <text class="sd-hw-label" x="210" y="131">Storage</text>
    <text class="sd-zone-label" x="${W / 2}" y="22">FRONT INTAKE</text>
    <text class="sd-zone-label" x="${W / 2}" y="${H - 8}">REAR EXHAUST</text>
  `;

  const colX = { left: 36, mid: 78, right: 120 };
  const rowY = { front: 42, rear: H - 42 };

  let fanEls = '';
  Object.entries(buckets).forEach(([k, fans]) => {
    const [row, col] = k.split('-');
    const cx0 = colX[col] || colX.mid;
    const cy = rowY[row] || rowY.front;
    fans.forEach((f, i) => {
      const cx = cx0 + i * 22;
      const inFocused = focusedFans.has(f.id);
      const inAnother = !inFocused && allBoundFans.has(f.id);
      const orphan = !allBoundFans.has(f.id);
      const cls = inFocused ? 'in-area' : inAnother ? 'other-area' : (orphan ? 'orphan' : '');
      const idFill = inFocused ? '#07120c' : 'var(--text-mute)';
      fanEls += `
        <g class="fan-group" data-fan-id="${f.id}">
          <circle class="sd-fan ${cls}" cx="${cx}" cy="${cy}" r="11" />
          <text class="sd-fan-id" x="${cx}" y="${cy + 3}" fill="${idFill}">${f.id}</text>
          <text class="sd-fan-name ${inFocused ? 'active' : ''}" x="${cx}" y="${cy + 24}">${esc(f.name)}</text>
        </g>
      `;
    });
  });

  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${chassis}${hw}${fanEls}</svg>`;

  host.querySelectorAll('.fan-group').forEach(g => {
    g.addEventListener('click', () => {
      const fid = parseInt(g.dataset.fanId, 10);
      const area = state.areas.find(a => a.id === state.ui.focusedArea);
      if (!area) return;
      const i = area.fan_idx_group.indexOf(fid);
      if (i >= 0) area.fan_idx_group.splice(i, 1);
      else { area.fan_idx_group.push(fid); area.fan_idx_group.sort((a, b) => a - b); }
      renderAreas(); sideEffects();
    });
  });
}

/* ==================================================================
   Generic row event binder
   ================================================================== */
function bindRowEvents(host, arr, keys, opts) {
  host.querySelectorAll('.row-compact').forEach((row, idx) => {
    const del = row.querySelector('[data-del]');
    if (del) del.addEventListener('click', () => { arr.splice(idx, 1); renderAll(); });
    keys.forEach(k => {
      const f = row.querySelector(`[data-k="${k}"]`);
      if (!f) return;
      f.addEventListener('input', () => {
        let v = f.value;
        if (opts?.numKeys?.includes(k)) {
          v = parseInt(v, 10) || 0;
        } else if (opts?.arrayKeys?.includes(k)) {
          v = v.split(/[\s,]+/).filter(x => x.length).map(x => parseInt(x, 10) || 0);
        }
        arr[idx][k] = v;
        sideEffects();
        if (row.dataset.kind === 'policy' && opts?.arrayKeys?.includes(k)) {
          drawCurve(row.querySelector('.curve-mini'), state.policies[idx]);
        }
      });
    });
  });
}

/* ==================================================================
   Add entity
   ================================================================== */
function addEntity(kind) {
  if (kind === 'temp') {
    const id = (state.temps.at(-1)?.id ?? 0) + 1;
    state.temps.push({ id, name: `温度点 ${id}`, temperature_type: 'Cpu',
      target_celsius: 70, max_celsius: 90, sensor_path: `/sys/temp/${id}` });
  } else if (kind === 'fan') {
    const id = (state.fans.at(-1)?.id ?? 0) + 1;
    state.fans.push({ id, name: `Fan_${id}`, position: 'Unknown', fan_type: 'Generic',
      min_duty: 10, max_duty: 100 });
  } else if (kind === 'policy') {
    const id = (state.policies.at(-1)?.id ?? -1) + 1;
    state.policies.push({ id, name: `策略 ${id}`, exp_cond_val: 'Balanced',
      temperature_range_low:  [-127, 20, 40, 60],
      temperature_range_high: [20, 40, 60, 127],
      speed_range_low:        [30, 40, 60, 85],
      speed_range_high:       [40, 60, 85, 100] });
  } else if (kind === 'area') {
    const id = (state.areas.at(-1)?.id ?? 0) + 1;
    state.areas.push({ id, name: `区域 ${id}`,
      requirement_idx: state.temps[0]?.id ?? 1,
      policy_idx_group: state.policies[0] ? [state.policies[0].id] : [],
      fan_idx_group: [] });
  }
  renderAll();
  setTimeout(() => jumpTo(`${kind}-${state[plural(kind)].at(-1).id}`), 30);
}

function plural(k) {
  return k === 'temp' ? 'temps' : k === 'fan' ? 'fans' : k === 'policy' ? 'policies' : 'areas';
}

document.querySelectorAll('.section-head .add-btn').forEach(btn => {
  btn.addEventListener('click', () => addEntity(btn.dataset.add));
});

/* ==================================================================
   Side effects: YAML + CSR + validation + server diagram
   ================================================================== */
function sideEffects() {
  renderCounts();
  renderQuickNav();
  renderYaml();
  renderCsr();
  runValidation();
  renderServerDiagram();
  markDirty();
}

function renderAll() {
  bindGlobalListeners();
  renderTemps();
  renderFans();
  renderPolicies();
  renderAreas();
  renderCounts();
  renderQuickNav();
  renderServerDiagram();
  renderYaml();
  renderCsr();
  runValidation();
}

/* ==================================================================
   YAML build + syntax highlight
   ================================================================== */
function buildYaml() {
  const now = new Date().toISOString().slice(0, 10);
  const L = [];
  L.push('# ────────────────────────────────────────────────────────');
  L.push('# Platform Thermal & Cooling Config');
  L.push(`# Generated by openUBMC Studio · ${now}`);
  L.push('# Order: global → temperatures → fans → policies → areas');
  L.push('# ────────────────────────────────────────────────────────');
  L.push('');
  L.push(`slot_id: ${state.global.slot_id}    # 服务器槽位号`);
  L.push('');
  L.push('# (1) Global cooling configuration');
  L.push('cooling_config:');
  L.push(`  smart_cooling_state: ${state.global.smart_cooling_state}`);
  L.push(`  default_duty: ${state.global.default_duty}    # 异常时默认占空比 (%)`);
  L.push(`  fan_zones: ${state.global.fan_zones}`);
  L.push(`  psu_calibration: ${state.global.psu_calibration}`);
  L.push(`  sample_period_ms: ${state.global.sample_period_ms}`);
  L.push('');
  L.push('# (2) Temperature monitoring points');
  L.push('cooling_requirements:');
  state.temps.forEach(t => {
    L.push(`  - id: ${t.id}`);
    L.push(`    name: "${t.name}"`);
    L.push(`    temperature_type: ${t.temperature_type}`);
    L.push(`    target_temperature_celsius: ${t.target_celsius}`);
    L.push(`    max_temperature_celsius: ${t.max_celsius}`);
    L.push(`    sensor_path: "${t.sensor_path}"`);
  });
  L.push('');
  L.push('# (3) Physical fan instances');
  L.push('cooling_fans:');
  state.fans.forEach(f => {
    L.push(`  - fan_id: ${f.id}`);
    L.push(`    name: "${f.name}"`);
    L.push(`    position: "${f.position}"`);
    L.push(`    fan_type: ${f.fan_type}`);
    L.push(`    min_duty: ${f.min_duty}`);
    L.push(`    max_duty: ${f.max_duty}`);
  });
  L.push('');
  L.push('# (4) Cooling policies (temperature → fan speed curves)');
  L.push('cooling_policies:');
  state.policies.forEach(p => {
    L.push(`  - policy_idx: ${p.id}`);
    L.push(`    name: "${p.name}"`);
    L.push(`    exp_cond_val: ${p.exp_cond_val}`);
    L.push(`    temperature_range_low:  [${p.temperature_range_low.join(', ')}]`);
    L.push(`    temperature_range_high: [${p.temperature_range_high.join(', ')}]`);
    L.push(`    speed_range_low:        [${p.speed_range_low.join(', ')}]`);
    L.push(`    speed_range_high:       [${p.speed_range_high.join(', ')}]`);
  });
  L.push('');
  L.push('# (5) Cooling areas — bindings');
  L.push('cooling_areas:');
  state.areas.forEach(a => {
    L.push(`  - area_id: ${a.id}`);
    L.push(`    name: "${a.name}"`);
    L.push(`    requirement_idx: ${a.requirement_idx}    # ref cooling_requirements`);
    L.push(`    policy_idx_group: [${a.policy_idx_group.join(', ')}]    # ref cooling_policies`);
    L.push(`    fan_idx_group:    [${a.fan_idx_group.join(', ')}]    # ref cooling_fans`);
  });
  return L;
}

function highlightYamlLine(line) {
  if (/^\s*#/.test(line)) return `<span class="yc">${esc(line)}</span>`;
  let body = line, comment = '';
  const cmIdx = findInlineCommentIdx(line);
  if (cmIdx >= 0) { body = line.slice(0, cmIdx); comment = line.slice(cmIdx); }
  const m = body.match(/^(\s*)([-]\s+)?([A-Za-z_][\w.]*)\s*:(\s*)(.*)$/);
  if (m) {
    const [, indent, dash, key, sp, val] = m;
    const valHtml = val === '' ? '' : highlightValue(val);
    const dashHtml = dash ? `<span class="yp">${esc(dash.trim())}</span> ` : '';
    return `${indent}${dashHtml}<span class="yk">${esc(key)}</span><span class="yp">:</span>${sp}${valHtml}${comment ? ` <span class="yc">${esc(comment.trim())}</span>` : ''}`;
  }
  return esc(body) + (comment ? `<span class="yc">${esc(comment)}</span>` : '');
}

function findInlineCommentIdx(line) {
  let inq = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inq) { if (c === inq) inq = null; continue; }
    if (c === '"' || c === "'") { inq = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) return i;
  }
  return -1;
}

function highlightValue(val) {
  const t = val.trim();
  if (/^".*"$/.test(t) || /^'.*'$/.test(t)) return `<span class="ys">${esc(t)}</span>`;
  if (/^(true|false|null|~)$/.test(t)) return `<span class="yb">${esc(t)}</span>`;
  if (/^-?\d+(\.\d+)?$/.test(t)) return `<span class="yn">${esc(t)}</span>`;
  if (/^\[.*\]$/.test(t)) {
    const inner = t.slice(1, -1);
    const parts = inner.split(/\s*,\s*/).map(p => {
      const pt = p.trim();
      if (/^-?\d+(\.\d+)?$/.test(pt)) return `<span class="yn">${esc(pt)}</span>`;
      if (/^".*"$/.test(pt)) return `<span class="ys">${esc(pt)}</span>`;
      return `<span class="yv">${esc(pt)}</span>`;
    });
    return `<span class="yp">[</span>${parts.join('<span class="yp">, </span>')}<span class="yp">]</span>`;
  }
  return `<span class="yv">${esc(t)}</span>`;
}

function renderYaml() {
  const lines = buildYaml();
  const code = document.getElementById('yaml-code');
  const gutter = document.getElementById('yaml-gutter');
  const out = [];
  const gutterLines = [];
  let i = 0;
  while (i < lines.length) {
    if (/^\s*#/.test(lines[i]) && state.ui.foldComments) {
      let j = i;
      while (j < lines.length && /^\s*#/.test(lines[j])) j++;
      const runLen = j - i;
      if (runLen >= 1) {
        const groupId = `fold-${i}`;
        out.push(`<span class="fold-summary" data-fold="${groupId}"><span class="fold-toggle" data-toggle="${groupId}">＋</span>＃ 注释 ${runLen} 行…</span>`);
        gutterLines.push('·');
        const innerHtml = lines.slice(i, j).map(l => highlightYamlLine(l)).join('\n');
        out.push(`<span class="fold-content collapsed" data-fold-content="${groupId}">${innerHtml}</span>`);
        for (let k = 0; k < runLen; k++) gutterLines.push(String(i + k + 1));
        i = j;
        continue;
      }
    }
    out.push(highlightYamlLine(lines[i]));
    gutterLines.push(String(i + 1));
    i++;
  }
  code.innerHTML = out.join('\n');
  gutter.innerHTML = gutterLines.join('<br>');

  code.querySelectorAll('.fold-toggle').forEach(tg => {
    tg.addEventListener('click', e => {
      e.stopPropagation();
      const id = tg.dataset.toggle;
      const content = code.querySelector(`[data-fold-content="${id}"]`);
      const summary = code.querySelector(`[data-fold="${id}"]`);
      if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed'); summary.classList.add('hidden');
      } else {
        content.classList.add('collapsed'); summary.classList.remove('hidden');
      }
    });
  });
}

document.getElementById('yaml-fold-comments').addEventListener('click', () => {
  state.ui.foldComments = !state.ui.foldComments;
  document.getElementById('yaml-fold-comments').classList.toggle('active', state.ui.foldComments);
  renderYaml();
});
document.getElementById('yaml-copy').addEventListener('click', () => {
  navigator.clipboard?.writeText(buildYaml().join('\n'));
  showToast('YAML 已复制');
});

/* ==================================================================
   Validation
   ================================================================== */
function runValidation() {
  const errors = [];

  function uq(arr, kind) {
    const seen = new Map();
    arr.forEach((it, i) => {
      if (seen.has(it.id))
        errors.push({ severity: 'error', where: `${kind}[${i}]`, msg: `重复的 id: ${it.id}`, target: `${kind}-${it.id}` });
      else seen.set(it.id, i);
    });
  }
  uq(state.temps, 'temp');
  uq(state.fans, 'fan');
  uq(state.policies, 'policy');
  uq(state.areas, 'area');

  state.areas.forEach(a => {
    if (!state.temps.some(t => t.id === a.requirement_idx))
      errors.push({ severity: 'error', where: `area #${a.id} · requirement_idx`, msg: `引用的温度点 #${a.requirement_idx} 不存在`, target: `area-${a.id}` });
    a.policy_idx_group.forEach(pid => {
      if (!state.policies.some(p => p.id === pid))
        errors.push({ severity: 'error', where: `area #${a.id} · policy`, msg: `引用的策略 #${pid} 不存在`, target: `area-${a.id}` });
    });
    a.fan_idx_group.forEach(fid => {
      if (!state.fans.some(f => f.id === fid))
        errors.push({ severity: 'error', where: `area #${a.id} · fan`, msg: `引用的风扇 #${fid} 不存在`, target: `area-${a.id}` });
    });
    if (a.fan_idx_group.length === 0)
      errors.push({ severity: 'warn', where: `area #${a.id}`, msg: '未绑定任何风扇', target: `area-${a.id}` });
    if (a.policy_idx_group.length === 0)
      errors.push({ severity: 'warn', where: `area #${a.id}`, msg: '未绑定任何调速策略', target: `area-${a.id}` });
  });
  state.fans.forEach(f => {
    if (!state.areas.some(a => a.fan_idx_group.includes(f.id)))
      errors.push({ severity: 'warn', where: `fan #${f.id} ${f.name}`, msg: '未被任何调速区域引用（孤立）', target: `fan-${f.id}` });
  });
  state.temps.forEach(t => {
    if (t.max_celsius <= t.target_celsius)
      errors.push({ severity: 'warn', where: `temp #${t.id}`, msg: `最大温度 ${t.max_celsius}°C 应大于目标 ${t.target_celsius}°C`, target: `temp-${t.id}` });
  });

  const badge = document.getElementById('err-count');
  if (errors.length === 0) {
    badge.style.display = 'none';
  } else {
    badge.style.display = 'inline-block';
    badge.textContent = String(errors.length);
    badge.style.background = errors.some(e => e.severity === 'error') ? 'var(--err)' : 'var(--warn)';
  }
  renderErrPopover(errors);

  const targets = new Set(errors.map(e => e.target).filter(Boolean));
  document.querySelectorAll('.qn-pill').forEach(p => {
    p.classList.toggle('warn', targets.has(p.dataset.jump));
  });
}

function renderErrPopover(errors) {
  const pop = document.getElementById('err-popover');
  if (errors.length === 0) {
    pop.innerHTML = `<div style="padding:18px;text-align:center;color:var(--text-dim);font-size:12px;">✓ 无校验问题</div>`;
    return;
  }
  pop.innerHTML = errors.map(e => `
    <div class="err-item severity-${e.severity}" data-target="${e.target || ''}">
      <div class="sev">${e.severity === 'error' ? '✗ ERROR' : '⚠ WARN'}</div>
      <div class="where">${esc(e.where)}</div>
      <div class="msg">${esc(e.msg)}</div>
    </div>
  `).join('');
  pop.querySelectorAll('.err-item').forEach(el => {
    el.addEventListener('click', () => {
      const t = el.dataset.target;
      if (t) { jumpTo(t); pop.classList.remove('open'); }
    });
  });
}

document.getElementById('btn-validate').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('err-popover').classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!e.target.closest('.err-popover-wrap'))
    document.getElementById('err-popover').classList.remove('open');
});

/* ==================================================================
   CSR generation
   ================================================================== */
function buildCsr(tab) {
  if (tab === 'psr') {
    return {
      'PSR.platform.thermal.config': {
        slot_id: state.global.slot_id,
        smart_cooling_state: state.global.smart_cooling_state,
        default_duty: state.global.default_duty,
        sample_period_ms: state.global.sample_period_ms,
      },
      'PSR.platform.thermal.requirements': state.temps.map(t => ({
        Id: t.id, TemperatureType: t.temperature_type,
        TargetTemperature: t.target_celsius, MaxTemperature: t.max_celsius,
        SensorPath: t.sensor_path,
      })),
      'PSR.platform.thermal.fans': state.fans.map(f => ({
        FanId: f.id, Name: f.name, Position: f.position, FanType: f.fan_type,
        MinDuty: f.min_duty, MaxDuty: f.max_duty,
      })),
      'PSR.platform.thermal.policies': state.policies.map(p => ({
        PolicyIdx: p.id, TriggerCondition: p.exp_cond_val,
        TemperatureRange: p.temperature_range_low.map((lo, i) => ({ Low: lo, High: p.temperature_range_high[i] })),
        SpeedRange: p.speed_range_low.map((lo, i) => ({ Low: lo, High: p.speed_range_high[i] })),
      })),
      'PSR.platform.thermal.areas': state.areas.map(a => ({
        AreaId: a.id,
        RequirementRef: `requirements[${a.requirement_idx}]`,
        PolicyRefs: a.policy_idx_group.map(p => `policies[${p}]`),
        FanRefs: a.fan_idx_group.map(f => `fans[${f}]`),
      })),
    };
  } else {
    return {
      'SR.thermal.flags': {
        smart_cooling: state.global.smart_cooling_state === 'Enabled' ? 1 : 0,
        default_duty_pct: state.global.default_duty,
      },
      'SR.thermal.points': state.temps.map(t => ({ id: t.id, type: t.temperature_type, target: t.target_celsius })),
      'SR.thermal.fans': state.fans.map(f => ({ id: f.id, pos: f.position })),
      'SR.thermal.curves': state.policies.flatMap(p => p.temperature_range_low.map((lo, i) => ({
        policy: p.id, seg: i,
        tLow: lo, tHigh: p.temperature_range_high[i],
        sLow: p.speed_range_low[i], sHigh: p.speed_range_high[i],
      }))),
      'SR.thermal.binding': state.areas.map(a => ({
        area: a.id, req: a.requirement_idx,
        policies: a.policy_idx_group, fans: a.fan_idx_group,
      })),
    };
  }
}

function highlightJson(s) {
  return s
    .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="ck">$1</span>:')
    .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="cs">$1</span>')
    .replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="cn">$1</span>')
    .replace(/:\s*(true|false|null)\b/g, ': <span class="cv">$1</span>');
}

function renderCsr() {
  const obj = buildCsr(state.ui.csrTab);
  const raw = JSON.stringify(obj, null, 2);
  document.getElementById('csr-code').innerHTML = highlightJson(raw);
  const sizeKb = (new Blob([raw]).size / 1024).toFixed(1);
  document.getElementById('csr-meta').textContent =
    `${state.ui.csrTab.toUpperCase()} · ${sizeKb} KB · 生成自当前配置`;
}

/* CSR drawer toggle */
document.getElementById('csr-handle').addEventListener('click', e => {
  if (e.target.closest('button') || e.target.closest('.seg')) return;
  state.ui.csrOpen = !state.ui.csrOpen;
  document.getElementById('csr-drawer').classList.toggle('open', state.ui.csrOpen);
});
document.getElementById('btn-generate').addEventListener('click', () => {
  state.ui.csrOpen = true;
  document.getElementById('csr-drawer').classList.add('open');
  renderCsr();
  showToast('CSR 已生成');
});
document.getElementById('csr-tab').addEventListener('click', e => {
  const btn = e.target.closest('button[data-tab]'); if (!btn) return;
  e.stopPropagation();
  document.querySelectorAll('#csr-tab button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.ui.csrTab = btn.dataset.tab;
  renderCsr();
});
document.getElementById('btn-csr-copy').addEventListener('click', e => {
  e.stopPropagation();
  navigator.clipboard?.writeText(JSON.stringify(buildCsr(state.ui.csrTab), null, 2));
  showToast('CSR ' + state.ui.csrTab.toUpperCase() + ' 已复制');
});
document.getElementById('btn-csr-download').addEventListener('click', e => {
  e.stopPropagation();
  const text = JSON.stringify(buildCsr(state.ui.csrTab), null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `thermal-${state.ui.csrTab}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('已下载 thermal-' + state.ui.csrTab + '.json');
});

/* View mode segmented control */
document.getElementById('view-mode').addEventListener('click', e => {
  const btn = e.target.closest('button[data-view]'); if (!btn) return;
  document.querySelectorAll('#view-mode button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.ui.viewMode = btn.dataset.view;
  const layout = document.getElementById('editor-layout');
  const yaml   = document.querySelector('.yaml-pane');
  const form   = document.querySelector('.form-pane');
  const csr    = document.getElementById('csr-drawer');
  if (state.ui.viewMode === 'split') {
    layout.style.gridTemplateColumns = '420px 1fr';
    yaml.style.display = 'flex'; form.style.display = 'flex';
    csr.style.left = '420px';
  } else if (state.ui.viewMode === 'form') {
    layout.style.gridTemplateColumns = '1fr';
    yaml.style.display = 'none'; form.style.display = 'flex';
    csr.style.left = '0';
  } else {
    layout.style.gridTemplateColumns = '1fr';
    yaml.style.display = 'flex'; form.style.display = 'none';
    csr.style.left = '0';
  }
});

/* Dirty / saved status */
let dirtyTimer = null;
function markDirty() {
  const el = document.getElementById('tb-status');
  el.textContent = '保存中…';
  el.style.color = 'var(--warn)';
  clearTimeout(dirtyTimer);
  dirtyTimer = setTimeout(() => {
    el.textContent = '已自动保存 · 刚刚';
    el.style.color = '';
  }, 600);
}

/* Toast */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 1600);
}

/* ── Init ── */
renderAll();
