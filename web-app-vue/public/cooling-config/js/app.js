/* ====================================================================
   openUBMC Studio · Power & Fan Template  v2
   能效调速配置编辑器 — 8 个配置模块，状态驱动渲染

   导航方式：锚点 (anchor) + 固定快捷导航栏
   理由：各模块间存在引用关系（区域引用策略/风扇/温度点），
         锚点允许同屏对照，标签页切换会丢失上下文。

   模块顺序（依赖顺序）：
     ① 全局配置   ② 温度点   ③ 调速风扇   ④ 调速策略
     ⑤ 调速区域   ⑥ 风扇类型  ⑦ 异常风扇   ⑧ 风扇组
   ==================================================================== */

const TEMP_TYPES       = ['CpuInlet','Cpu','CpuCore','Memory','Disk','PSU','Ambient','NetworkAdapter'];
const COND_VALS        = ['EnergySaving','Balanced','HighPerformance'];
const ABNORMAL_TYPES   = ['Stuck','NoFeedback','Overspeed','Underspeed'];
const ROTOR_OPTIONS    = [1, 2, 4];

/* 代号 → 中文标注（下拉显示「中文 (代号)」，写入 YAML 仍用代号本身） */
const TEMP_TYPE_LABEL  = {
  CpuInlet: 'CPU 进风口', Cpu: 'CPU', CpuCore: 'CPU 核心', Memory: '内存',
  Disk: '硬盘', PSU: '电源', Ambient: '环境温度', NetworkAdapter: '网卡',
};
const COND_LABEL       = { EnergySaving: '节能', Balanced: '均衡', HighPerformance: '高性能' };
const ABNORMAL_LABEL   = { Stuck: '卡死', NoFeedback: '无反馈', Overspeed: '超速', Underspeed: '欠速' };
/** Render a <select> option set as 「中文 (代号)」 with value = 代号. */
function codeOptions(values, labelMap, current) {
  return values.map(v => {
    const cn = labelMap[v];
    const text = cn ? `${cn} (${v})` : v;
    return `<option value="${v}" ${v === current ? 'selected' : ''}>${text}</option>`;
  }).join('');
}

/* 常见风扇安装位置（下拉建议，可自由输入） */
const FAN_POSITIONS    = ['Front-Left','Front-Mid','Front-Right','Rear-Left','Rear-Mid','Rear-Right','Top','Bottom'];

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
  fanTypes: [
    { id: 1, name: 'Delta_PFC1212DE', vendor: 'Delta', min_speed_rpm: 1000, max_speed_rpm: 20000, rotor_count: 2 },
    { id: 2, name: 'NMB_08038SA',     vendor: 'NMB',   min_speed_rpm: 800,  max_speed_rpm: 16000, rotor_count: 1 },
  ],
  abnormalFans: [
    { id: 1, fan_ref: 1, name: 'Fan_1 卡转检测', abnormal_condition: 'Stuck',     speed_threshold_rpm: 500 },
  ],
  fanGroups: [
    { id: 1, name: '前区组', fan_ids: [1, 2, 3], min_duty: 10, max_duty: 100 },
    { id: 2, name: '后区组', fan_ids: [4, 5],    min_duty: 15, max_duty: 100 },
  ],
  ui: {
    foldComments:   true,
    csrOpen:        false,
    csrTab:         'psr',
    viewMode:       'split',
    focusedArea:    1,
    activeRow:      null,
    expandedCurves: [],   // policy IDs with curve chart expanded
    navCollapsed:   false, // entity nav panel collapsed state
  },
};

/* ── HTML escape ── */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ==================================================================
   Quick Nav  (anchor-based — 7 entity groups)
   ================================================================== */
function renderQuickNav() {
  const host = document.getElementById('quick-nav');
  const collapsed = state.ui.navCollapsed;
  const groups = [
    { key: 'temp',       label: '温度点',  items: state.temps         },
    { key: 'fan',        label: '调速风扇', items: state.fans          },
    { key: 'policy',     label: '策略',    items: state.policies       },
    { key: 'area',       label: '区域',    items: state.areas          },
    { key: 'fantype',    label: '风扇类型', items: state.fanTypes      },
    { key: 'abnormal',   label: '异常风扇', items: state.abnormalFans  },
    { key: 'fangroup',   label: '风扇组',  items: state.fanGroups      },
  ];
  host.innerHTML = `<div class="qn-rows">${groups.map(g => `
    <div class="qn-row">
      <span class="qn-label">${g.label} <b>${g.items.length}</b></span>
      <div class="qn-pills">
        ${g.items.map(it => `
          <button class="qn-pill" data-jump="${g.key}-${it.id}" title="${esc(it.name || '')}">#${it.id}</button>
        `).join('')}
        <button class="qn-add" data-add="${g.key}">+ 新增</button>
      </div>
    </div>
  `).join('')}</div>`;

  // Apply collapsed state
  if (collapsed) host.classList.add('nav-collapsed');
  else host.classList.remove('nav-collapsed');

  host.querySelectorAll('.qn-pill').forEach(el => el.addEventListener('click', () => jumpTo(el.dataset.jump)));
  host.querySelectorAll('.qn-add').forEach(el => el.addEventListener('click', () => addEntity(el.dataset.add)));

  // Bind toggle button (in static HTML)
  const toggle = document.getElementById('nav-toggle');
  if (toggle) {
    toggle.classList.toggle('nav-closed', collapsed);
    toggle.onclick = () => {
      state.ui.navCollapsed = !state.ui.navCollapsed;
      renderQuickNav();
      // re-measure after CSS transition finishes (0.22s)
      setTimeout(updateStickyHeight, 240);
    };
  }
  updateStickyHeight();
}

function updateStickyHeight() {
  const bar = document.getElementById('sticky-bar');
  if (!bar) return;
  const h = bar.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--sticky-h', h + 10 + 'px');
}

function jumpTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  updateStickyHeight();   // ensure --sticky-h is current before scroll
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 1400);
  state.ui.activeRow = id;
}

/* ==================================================================
   Section counts
   ================================================================== */
function renderCounts() {
  document.getElementById('cnt-temp').textContent     = state.temps.length;
  document.getElementById('cnt-fan').textContent      = state.fans.length;
  document.getElementById('cnt-policy').textContent   = state.policies.length;
  document.getElementById('cnt-area').textContent     = state.areas.length;
  document.getElementById('cnt-fantype').textContent  = state.fanTypes.length;
  document.getElementById('cnt-abnormal').textContent = state.abnormalFans.length;
  document.getElementById('cnt-fangroup').textContent = state.fanGroups.length;
}

/* ==================================================================
   Global field binding (one-time)
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
   ② Temperature rows
   ================================================================== */
function renderTemps() {
  const host = document.getElementById('list-temp');
  host.innerHTML = state.temps.map((t, idx) => `
    <div class="row-compact" id="temp-${t.id}" data-i="${idx}" data-kind="temp">
      <span class="row-id">#${t.id}</span>
      <div class="cell" style="flex:1.4;min-width:140px;" title="温度点名称，供调速区域引用（name）">
        <span class="cell-lbl">名称 <i class="code">name</i></span>
        <input data-k="name" value="${esc(t.name)}" />
      </div>
      <div class="cell" style="width:170px;" title="温度采集点类型（temperature_type）">
        <span class="cell-lbl">类型 <i class="code">temperature_type</i></span>
        <select data-k="temperature_type">
          ${codeOptions(TEMP_TYPES, TEMP_TYPE_LABEL, t.temperature_type)}
        </select>
      </div>
      <div class="cell" style="width:84px;" title="目标温度：低于此值时风扇按最低转速（target_celsius）">
        <span class="cell-lbl">目标温度 <i class="code">℃</i></span>
        <input data-k="target_celsius" type="number" value="${t.target_celsius}" />
      </div>
      <div class="cell" style="width:84px;" title="上限温度：达到此值时风扇拉满转速（max_celsius）">
        <span class="cell-lbl">上限温度 <i class="code">℃</i></span>
        <input data-k="max_celsius" type="number" value="${t.max_celsius}" />
      </div>
      <div class="cell" style="flex:1.4;min-width:160px;" title="传感器对象路径，对应 CSR 中的温度对象（sensor_path）">
        <span class="cell-lbl">传感器路径 <i class="code">sensor_path</i></span>
        <input data-k="sensor_path" value="${esc(t.sensor_path)}" placeholder="/xyz/.../Temp_Cpu0" />
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.temps,
    ['name','temperature_type','target_celsius','max_celsius','sensor_path'],
    { numKeys: ['target_celsius','max_celsius'] });
}

/* ==================================================================
   ③ Fan rows
   ================================================================== */
function renderFans() {
  const host = document.getElementById('list-fan');
  host.innerHTML = state.fans.map((f, idx) => `
    <div class="row-compact" id="fan-${f.id}" data-i="${idx}" data-kind="fan">
      <span class="row-id">#${f.id}</span>
      <div class="cell" style="width:120px;" title="风扇名称（name）">
        <span class="cell-lbl">名称 <i class="code">name</i></span>
        <input data-k="name" value="${esc(f.name)}" />
      </div>
      <div class="cell" style="flex:1;min-width:150px;" title="风扇安装位置，可下拉选择或自由输入（position）">
        <span class="cell-lbl">安装位置 <i class="code">position</i></span>
        <input data-k="position" value="${esc(f.position)}" list="fanpos-datalist" placeholder="前-左 / 后-中…" />
      </div>
      <div class="cell" style="flex:1.2;min-width:150px;" title="引用「⑥ 风扇类型」中定义的型号（fan_type）">
        <span class="cell-lbl">风扇型号 <i class="code">fan_type</i></span>
        <input data-k="fan_type" value="${esc(f.fan_type)}" list="fantype-datalist" />
      </div>
      <div class="cell" style="width:78px;" title="占空比下限 %（min_duty）">
        <span class="cell-lbl">最低占空 <i class="code">%</i></span>
        <input data-k="min_duty" type="number" value="${f.min_duty}" />
      </div>
      <div class="cell" style="width:78px;" title="占空比上限 %（max_duty）">
        <span class="cell-lbl">最高占空 <i class="code">%</i></span>
        <input data-k="max_duty" type="number" value="${f.max_duty}" />
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.fans,
    ['name','position','fan_type','min_duty','max_duty'],
    { numKeys: ['min_duty','max_duty'] });
  // Update datalist for fan type autocomplete
  updateFanTypeDatalist();
}

function updateFanTypeDatalist() {
  let dl = document.getElementById('fantype-datalist');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'fantype-datalist';
    document.body.appendChild(dl);
  }
  dl.innerHTML = state.fanTypes.map(ft => `<option value="${esc(ft.name)}">`).join('');

  // Position suggestions (common slots) — selectable yet free-form.
  let pl = document.getElementById('fanpos-datalist');
  if (!pl) {
    pl = document.createElement('datalist');
    pl.id = 'fanpos-datalist';
    pl.innerHTML = FAN_POSITIONS.map(p => `<option value="${p}">`).join('');
    document.body.appendChild(pl);
  }
}

/* ==================================================================
   ④ Policy rows — compact top + arrays + expandable curve chart
   ================================================================== */
function renderPolicies() {
  const host = document.getElementById('list-policy');
  host.innerHTML = state.policies.map((p, idx) => {
    const expanded = state.ui.expandedCurves.includes(p.id);
    return `
    <div class="row-compact row-policy" id="policy-${p.id}" data-i="${idx}" data-kind="policy">
      <div class="top">
        <span class="row-id">#${p.id}</span>
        <div class="cell" style="flex:1.2;min-width:140px;" title="策略名称（name）">
          <span class="cell-lbl">名称 <i class="code">name</i></span>
          <input data-k="name" value="${esc(p.name)}" />
        </div>
        <div class="cell" style="width:190px;" title="触发工况：该策略在哪种能效模式下生效（exp_cond_val）">
          <span class="cell-lbl">触发工况 <i class="code">exp_cond_val</i></span>
          <select data-k="exp_cond_val">
            ${codeOptions(COND_VALS, COND_LABEL, p.exp_cond_val)}
          </select>
        </div>
        <div class="cell" title="温度→转速曲线预览">
          <span class="cell-lbl">曲线预览 · ${p.temperature_range_low.length} 段</span>
          <div class="curve-mini" id="cv-${p.id}"></div>
        </div>
        <button class="btn-curve-toggle ${expanded?'active':''}" data-toggle-curve="${p.id}">${expanded?'曲线 ▲':'曲线 ▼'}</button>
        <button class="row-del" data-del title="删除">✕</button>
      </div>
      <div class="arrays">
        <div class="cell" title="每段温度区间下界，逗号分隔（temperature_range_low）"><span class="cell-lbl">温度下界 <i class="code">℃ · temperature_range_low</i></span>
          <input data-k="temperature_range_low" value="${p.temperature_range_low.join(', ')}" /></div>
        <div class="cell" title="每段温度区间上界，逗号分隔（temperature_range_high）"><span class="cell-lbl">温度上界 <i class="code">℃ · temperature_range_high</i></span>
          <input data-k="temperature_range_high" value="${p.temperature_range_high.join(', ')}" /></div>
        <div class="cell" title="对应温度下界的转速%（speed_range_low）"><span class="cell-lbl">转速下界 <i class="code">% · speed_range_low</i></span>
          <input data-k="speed_range_low" value="${p.speed_range_low.join(', ')}" /></div>
        <div class="cell" title="对应温度上界的转速%（speed_range_high）"><span class="cell-lbl">转速上界 <i class="code">% · speed_range_high</i></span>
          <input data-k="speed_range_high" value="${p.speed_range_high.join(', ')}" /></div>
      </div>
      <div class="curve-expanded" id="curve-exp-${p.id}" ${expanded?'':'style="display:none;"'}>
        <div class="curve-chart" id="curve-chart-${p.id}"></div>
      </div>
    </div>`;
  }).join('');

  bindRowEvents(host, state.policies,
    ['name','exp_cond_val','temperature_range_low','temperature_range_high','speed_range_low','speed_range_high'],
    { arrayKeys: ['temperature_range_low','temperature_range_high','speed_range_low','speed_range_high'] });

  // Draw mini curves + expanded charts
  state.policies.forEach(p => {
    drawCurveMini(document.getElementById('cv-' + p.id), p);
    if (state.ui.expandedCurves.includes(p.id)) {
      drawExpandedCurve(document.getElementById('curve-chart-' + p.id), p);
    }
  });

  // Bind curve toggle buttons
  host.querySelectorAll('[data-toggle-curve]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const pid = parseInt(btn.dataset.toggleCurve, 10);
      const idx = state.ui.expandedCurves.indexOf(pid);
      const expDiv  = document.getElementById('curve-exp-' + pid);
      if (idx >= 0) {
        state.ui.expandedCurves.splice(idx, 1);
        expDiv.style.display = 'none';
        btn.textContent = '曲线 ▼';
        btn.classList.remove('active');
      } else {
        state.ui.expandedCurves.push(pid);
        expDiv.style.display = '';
        drawExpandedCurve(document.getElementById('curve-chart-' + pid), state.policies.find(p => p.id === pid));
        btn.textContent = '曲线 ▲';
        btn.classList.add('active');
      }
    });
  });
}

/* --- Mini curve (130×44) --- */
function drawCurveMini(host, policy) {
  if (!host) return;
  const pts = buildCurvePoints(policy);
  if (pts.length === 0) { host.innerHTML = ''; return; }
  const w = 130, h = 44, pad = 4;
  const tMin = Math.min(...pts.map(p => p[0]));
  const tMax = Math.max(...pts.map(p => p[0]));
  const xFor = t => pad + ((t - tMin) / (tMax - tMin || 1)) * (w - pad * 2);
  const yFor = s => pad + ((100 - s) / 100) * (h - pad * 2);
  const path = pts.map((p,i) => (i===0?'M':'L') + xFor(p[0]).toFixed(2)+','+yFor(p[1]).toFixed(2)).join(' ');
  const area = path + ` L ${xFor(tMax).toFixed(2)},${(h-pad).toFixed(2)} L ${xFor(tMin).toFixed(2)},${(h-pad).toFixed(2)} Z`;
  host.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${area}" fill="rgba(52,211,153,0.10)" />
    <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
  </svg>`;
}

/* --- Full curve chart (responsive width × 160) --- */
function drawExpandedCurve(host, policy) {
  if (!host || !policy) return;
  const pts = buildCurvePoints(policy);
  if (pts.length === 0) { host.innerHTML = '<div style="color:var(--text-dim);font-size:11px;padding:8px;">暂无数据</div>'; return; }

  const W = 480, H = 160;
  const padL = 46, padR = 20, padT = 16, padB = 32;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const tMin = Math.min(...pts.map(p => p[0]));
  const tMax = Math.max(...pts.map(p => p[0]));
  const xFor = t => padL + ((t - tMin) / (tMax - tMin || 1)) * cW;
  const yFor = s => padT + ((100 - s) / 100) * cH;

  // Y grid + labels (0,25,50,75,100)
  const yGrid = [0, 25, 50, 75, 100].map(s => {
    const y = yFor(s).toFixed(1);
    return `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="var(--border)" stroke-width="${s===0?'1':'0.5'}" stroke-dasharray="${s>0?'3,3':'none'}" />
    <text x="${padL-6}" y="${(+y+3.5).toFixed(1)}" text-anchor="end" fill="var(--text-dim)" font-size="9" font-family="var(--font-mono)">${s}%</text>`;
  }).join('');

  // X ticks + labels at breakpoints
  const xTicks = pts.map(p => {
    const x = xFor(p[0]).toFixed(1);
    return `<line x1="${x}" y1="${(H-padB).toFixed(1)}" x2="${x}" y2="${(H-padB+4).toFixed(1)}" stroke="var(--border-strong)" stroke-width="0.8" />
    <text x="${x}" y="${(H-4).toFixed(1)}" text-anchor="middle" fill="var(--text-dim)" font-size="9" font-family="var(--font-mono)">${p[0]}°</text>`;
  }).join('');

  // Axes
  const axes = `
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${H-padB}" stroke="var(--border-strong)" stroke-width="1" />
    <line x1="${padL}" y1="${H-padB}" x2="${W-padR}" y2="${H-padB}" stroke="var(--border-strong)" stroke-width="1" />
    <text x="${padL-22}" y="${(padT+cH/2+12).toFixed(1)}" text-anchor="middle" fill="var(--text-dim)" font-size="9" font-family="var(--font-mono)" transform="rotate(-90,${padL-22},${(padT+cH/2).toFixed(1)})">转速%</text>
    <text x="${(padL+cW/2).toFixed(1)}" y="${H}" text-anchor="middle" fill="var(--text-dim)" font-size="9" font-family="var(--font-mono)">温度 (°C)</text>
  `;

  // Curve path + filled area
  const pathD = pts.map((p,i) => (i===0?'M':'L') + xFor(p[0]).toFixed(2)+','+yFor(p[1]).toFixed(2)).join(' ');
  const areaD = pathD + ` L ${xFor(tMax).toFixed(2)},${(H-padB).toFixed(2)} L ${xFor(tMin).toFixed(2)},${(H-padB).toFixed(2)} Z`;

  // Breakpoint dots + value labels
  const dots = pts.map(p => {
    const cx = xFor(p[0]).toFixed(2), cy = yFor(p[1]).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--accent)" stroke="var(--bg)" stroke-width="2" />
    <text x="${cx}" y="${(+cy-8).toFixed(1)}" text-anchor="middle" fill="var(--accent)" font-size="8.5" font-family="var(--font-mono)" font-weight="600">${p[1]}%</text>`;
  }).join('');

  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:${H}px;display:block;overflow:visible;">
    ${yGrid}${xTicks}${axes}
    <path d="${areaD}" fill="rgba(52,211,153,0.08)" />
    <path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
    ${dots}
  </svg>`;
}

/* Build unique (T, S) breakpoints from policy arrays */
function buildCurvePoints(policy) {
  const lo = policy.temperature_range_low;
  const hi = policy.temperature_range_high;
  const slo = policy.speed_range_low;
  const shi = policy.speed_range_high;
  const n = Math.min(lo.length, hi.length, slo.length, shi.length);
  const pts = [];
  for (let i = 0; i < n; i++) {
    if (pts.length === 0 || pts[pts.length-1][0] !== lo[i]) pts.push([lo[i], slo[i]]);
    pts.push([hi[i], shi[i]]);
  }
  return pts;
}

/* ==================================================================
   ⑤ Area rows + chip-multi pickers
   ================================================================== */
function renderAreas() {
  const host = document.getElementById('list-area');
  host.innerHTML = state.areas.map((a, idx) => {
    const focused = state.ui.focusedArea === a.id;
    return `
      <div class="row-compact row-area ${focused?'active':''}" id="area-${a.id}" data-i="${idx}" data-kind="area">
        <span class="row-id">#${a.id}</span>
        <div class="cell" style="flex:1.2;min-width:130px;" title="调速区域名称（name）">
          <span class="cell-lbl">名称 <i class="code">name</i></span>
          <input data-k="name" value="${esc(a.name)}" />
        </div>
        <div class="cell" style="width:200px;" title="本区域监控的温度点（requirement_idx）">
          <span class="cell-lbl">温度点 <i class="code">requirement_idx</i></span>
          <select data-k="requirement_idx">
            ${state.temps.map(t => `<option value="${t.id}" ${t.id===a.requirement_idx?'selected':''}>#${t.id} ${esc(t.name)}</option>`).join('')}
          </select>
        </div>
        <div class="cell" style="flex:1;min-width:180px;" title="本区域应用的调速策略（policy_idx_group）">
          <span class="cell-lbl">调速策略 <i class="code">policy_idx_group</i></span>
          ${renderChipMulti('policy', idx, a.policy_idx_group, state.policies)}
        </div>
        <div class="cell" style="flex:1.2;min-width:200px;" title="本区域控制的风扇（fan_idx_group）">
          <span class="cell-lbl">绑定风扇 <i class="code">fan_idx_group</i></span>
          ${renderChipMulti('fan', idx, a.fan_idx_group, state.fans)}
        </div>
        <button class="row-del" data-del title="删除">✕</button>
      </div>`;
  }).join('');
  bindRowEvents(host, state.areas, ['name','requirement_idx'], { numKeys: ['requirement_idx'] });
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
  const chips = selectedIds.map(id =>
    `<span class="chip">#${id}<span class="x" data-rm="${id}">×</span></span>`).join('');
  const optsHtml = options.map(o => {
    const taken = selectedIds.includes(o.id);
    return `<div class="opt ${taken?'disabled':''}" data-id="${o.id}" data-taken="${taken}">
      <span>#${o.id} ${esc(o.name||'')}</span>
      <span class="meta">${kind==='policy' ? esc(o.exp_cond_val||'') : esc(o.position||'')}</span>
    </div>`;
  }).join('');
  return `<div class="chip-multi" data-multi="${kind}" data-area-i="${areaIdx}">
    ${chips}
    <button class="add-mini" data-toggle-menu>+<div class="add-menu">${optsHtml}</div></button>
  </div>`;
}

function bindChipMulti(host) {
  host.querySelectorAll('.chip-multi[data-multi]').forEach(ms => {
    const areaIdx = parseInt(ms.dataset.areaI, 10);
    const kind = ms.dataset.multi;
    const key = kind === 'policy' ? 'policy_idx_group' : 'fan_idx_group';
    ms.querySelectorAll('[data-rm]').forEach(x => {
      x.addEventListener('click', e => {
        e.stopPropagation();
        const id = parseInt(x.dataset.rm, 10);
        const arr = state.areas[areaIdx][key];
        const i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1);
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
        if (!arr.includes(id)) { arr.push(id); arr.sort((a,b)=>a-b); }
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
  const s = String(p||'').toLowerCase();
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
  const chassis = `<rect class="sd-chassis" x="6" y="6" width="${W-12}" height="${H-12}" rx="6" />`;
  const hw = `
    <rect class="sd-hw" x="155" y="60" width="50" height="32" rx="2" />
    <text class="sd-hw-label" x="180" y="80">CPU 0</text>
    <rect class="sd-hw" x="215" y="60" width="50" height="32" rx="2" />
    <text class="sd-hw-label" x="240" y="80">CPU 1</text>
    <rect class="sd-hw" x="155" y="100" width="110" height="14" rx="2" />
    <text class="sd-hw-label" x="210" y="111">Memory</text>
    <rect class="sd-hw" x="155" y="120" width="110" height="14" rx="2" />
    <text class="sd-hw-label" x="210" y="131">Storage</text>
    <text class="sd-zone-label" x="${W/2}" y="22">FRONT INTAKE</text>
    <text class="sd-zone-label" x="${W/2}" y="${H-8}">REAR EXHAUST</text>`;

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
          <text class="sd-fan-id" x="${cx}" y="${cy+3}" fill="${idFill}">${f.id}</text>
          <text class="sd-fan-name ${inFocused?'active':''}" x="${cx}" y="${cy+24}">${esc(f.name)}</text>
        </g>`;
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
      else { area.fan_idx_group.push(fid); area.fan_idx_group.sort((a,b)=>a-b); }
      renderAreas(); sideEffects();
    });
  });
}

/* ==================================================================
   ⑥ Fan Type rows
   ================================================================== */
function renderFanTypes() {
  const host = document.getElementById('list-fantype');
  host.innerHTML = state.fanTypes.map((ft, idx) => `
    <div class="row-compact" id="fantype-${ft.id}" data-i="${idx}" data-kind="fantype">
      <span class="row-id">#${ft.id}</span>
      <div class="cell" style="flex:1.5;min-width:160px;" title="风扇型号名称，供「③ 风扇」引用（name）">
        <span class="cell-lbl">型号名称 <i class="code">name</i></span>
        <input data-k="name" value="${esc(ft.name)}" />
      </div>
      <div class="cell" style="width:120px;" title="厂商（vendor）">
        <span class="cell-lbl">厂商 <i class="code">vendor</i></span>
        <input data-k="vendor" value="${esc(ft.vendor)}" />
      </div>
      <div class="cell" style="width:96px;" title="最小转速（min_speed_rpm）">
        <span class="cell-lbl">最低转速 <i class="code">RPM</i></span>
        <input data-k="min_speed_rpm" type="number" value="${ft.min_speed_rpm}" />
      </div>
      <div class="cell" style="width:96px;" title="最大转速（max_speed_rpm）">
        <span class="cell-lbl">最高转速 <i class="code">RPM</i></span>
        <input data-k="max_speed_rpm" type="number" value="${ft.max_speed_rpm}" />
      </div>
      <div class="cell" style="width:90px;" title="转子数量：单转子/双转子（rotor_count）">
        <span class="cell-lbl">转子数 <i class="code">rotor_count</i></span>
        <select data-k="rotor_count">
          ${ROTOR_OPTIONS.map(v => `<option value="${v}" ${v===ft.rotor_count?'selected':''}>${v} 转子</option>`).join('')}
        </select>
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.fanTypes,
    ['name','vendor','min_speed_rpm','max_speed_rpm','rotor_count'],
    { numKeys: ['min_speed_rpm','max_speed_rpm','rotor_count'] });
}

/* ==================================================================
   ⑦ Abnormal fan rows
   ================================================================== */
function renderAbnormalFans() {
  const host = document.getElementById('list-abnormal');
  host.innerHTML = state.abnormalFans.map((af, idx) => `
    <div class="row-compact" id="abnormal-${af.id}" data-i="${idx}" data-kind="abnormal">
      <span class="row-id">#${af.id}</span>
      <div class="cell" style="flex:1.2;min-width:140px;" title="异常监控规则名称（name）">
        <span class="cell-lbl">规则名称 <i class="code">name</i></span>
        <input data-k="name" value="${esc(af.name)}" />
      </div>
      <div class="cell" style="width:180px;" title="该规则监控的风扇（fan_ref）">
        <span class="cell-lbl">关联风扇 <i class="code">fan_ref</i></span>
        <select data-k="fan_ref">
          ${state.fans.map(f => `<option value="${f.id}" ${f.id===af.fan_ref?'selected':''}>风扇 #${f.id} ${esc(f.name)}</option>`).join('')}
        </select>
      </div>
      <div class="cell" style="width:170px;" title="异常类型（abnormal_condition）">
        <span class="cell-lbl">异常条件 <i class="code">abnormal_condition</i></span>
        <select data-k="abnormal_condition">
          ${codeOptions(ABNORMAL_TYPES, ABNORMAL_LABEL, af.abnormal_condition)}
        </select>
      </div>
      <div class="cell" style="width:120px;" title="判定阈值转速（speed_threshold_rpm）">
        <span class="cell-lbl">阈值转速 <i class="code">RPM</i></span>
        <input data-k="speed_threshold_rpm" type="number" value="${af.speed_threshold_rpm}" />
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.abnormalFans,
    ['name','fan_ref','abnormal_condition','speed_threshold_rpm'],
    { numKeys: ['fan_ref','speed_threshold_rpm'] });
}

/* ==================================================================
   ⑧ Fan Group rows (with chip-multi for fan_ids)
   ================================================================== */
function renderFanGroups() {
  const host = document.getElementById('list-fangroup');
  host.innerHTML = state.fanGroups.map((fg, idx) => `
    <div class="row-compact" id="fangroup-${fg.id}" data-i="${idx}" data-kind="fangroup">
      <span class="row-id">#${fg.id}</span>
      <div class="cell" style="flex:1.2;min-width:140px;" title="风扇组名称（name）">
        <span class="cell-lbl">名称 <i class="code">name</i></span>
        <input data-k="name" value="${esc(fg.name)}" />
      </div>
      <div class="cell" style="flex:1;min-width:200px;" title="组内成员风扇（fan_ids）">
        <span class="cell-lbl">成员风扇 <i class="code">fan_ids</i></span>
        ${renderFanGroupChips(idx, fg.fan_ids)}
      </div>
      <div class="cell" style="width:78px;" title="整组占空比下限 %（min_duty）">
        <span class="cell-lbl">最低占空 <i class="code">%</i></span>
        <input data-k="min_duty" type="number" value="${fg.min_duty}" />
      </div>
      <div class="cell" style="width:78px;" title="整组占空比上限 %（max_duty）">
        <span class="cell-lbl">最高占空 <i class="code">%</i></span>
        <input data-k="max_duty" type="number" value="${fg.max_duty}" />
      </div>
      <button class="row-del" data-del title="删除">✕</button>
    </div>
  `).join('');
  bindRowEvents(host, state.fanGroups, ['name','min_duty','max_duty'], { numKeys: ['min_duty','max_duty'] });
  bindFanGroupChips(host);
}

function renderFanGroupChips(groupIdx, selectedIds) {
  const chips = selectedIds.map(id =>
    `<span class="chip">#${id}<span class="x" data-grm="${id}">×</span></span>`).join('');
  const opts = state.fans.map(f => {
    const taken = selectedIds.includes(f.id);
    return `<div class="opt ${taken?'disabled':''}" data-id="${f.id}" data-taken="${taken}">
      <span>#${f.id} ${esc(f.name)}</span>
      <span class="meta">${esc(f.position)}</span>
    </div>`;
  }).join('');
  return `<div class="chip-multi" data-group-i="${groupIdx}">
    ${chips}
    <button class="add-mini" data-toggle-gmenu>+<div class="add-menu">${opts}</div></button>
  </div>`;
}

function bindFanGroupChips(host) {
  host.querySelectorAll('.chip-multi[data-group-i]').forEach(ms => {
    const groupIdx = parseInt(ms.dataset.groupI, 10);
    ms.querySelectorAll('[data-grm]').forEach(x => {
      x.addEventListener('click', e => {
        e.stopPropagation();
        const id = parseInt(x.dataset.grm, 10);
        const arr = state.fanGroups[groupIdx].fan_ids;
        const i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1);
        renderFanGroups(); sideEffects();
      });
    });
    const trigger = ms.querySelector('[data-toggle-gmenu]');
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
        const arr = state.fanGroups[groupIdx].fan_ids;
        if (!arr.includes(id)) { arr.push(id); arr.sort((a,b)=>a-b); }
        ms.classList.remove('menu-open');
        renderFanGroups(); sideEffects();
      });
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
        if (opts?.numKeys?.includes(k)) v = parseInt(v, 10) || 0;
        else if (opts?.arrayKeys?.includes(k)) {
          v = v.split(/[\s,]+/).filter(x => x.length).map(x => parseInt(x, 10) || 0);
        }
        arr[idx][k] = v;
        sideEffects();
        if (row.dataset.kind === 'policy' && opts?.arrayKeys?.includes(k)) {
          const p = state.policies[idx];
          drawCurveMini(row.querySelector('.curve-mini'), p);
          if (state.ui.expandedCurves.includes(p.id)) {
            drawExpandedCurve(document.getElementById('curve-chart-' + p.id), p);
          }
        }
        if (row.dataset.kind === 'fan') updateFanTypeDatalist();
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
    state.temps.push({ id, name: `温度点 ${id}`, temperature_type: 'Cpu', target_celsius: 70, max_celsius: 90, sensor_path: `/sys/temp/${id}` });
  } else if (kind === 'fan') {
    const id = (state.fans.at(-1)?.id ?? 0) + 1;
    state.fans.push({ id, name: `Fan_${id}`, position: 'Unknown', fan_type: state.fanTypes[0]?.name || 'Generic', min_duty: 10, max_duty: 100 });
  } else if (kind === 'policy') {
    const id = (state.policies.at(-1)?.id ?? -1) + 1;
    state.policies.push({ id, name: `策略 ${id}`, exp_cond_val: 'Balanced',
      temperature_range_low: [-127,20,40,60], temperature_range_high: [20,40,60,127],
      speed_range_low: [30,40,60,85], speed_range_high: [40,60,85,100] });
  } else if (kind === 'area') {
    const id = (state.areas.at(-1)?.id ?? 0) + 1;
    state.areas.push({ id, name: `区域 ${id}`, requirement_idx: state.temps[0]?.id ?? 1,
      policy_idx_group: state.policies[0] ? [state.policies[0].id] : [], fan_idx_group: [] });
  } else if (kind === 'fantype' || kind === 'fanType') {
    const id = (state.fanTypes.at(-1)?.id ?? 0) + 1;
    state.fanTypes.push({ id, name: `FanType_${id}`, vendor: 'Generic', min_speed_rpm: 500, max_speed_rpm: 15000, rotor_count: 2 });
  } else if (kind === 'abnormal' || kind === 'abnormalFan') {
    const id = (state.abnormalFans.at(-1)?.id ?? 0) + 1;
    state.abnormalFans.push({ id, fan_ref: state.fans[0]?.id ?? 1, name: `异常检测 ${id}`, abnormal_condition: 'Stuck', speed_threshold_rpm: 500 });
  } else if (kind === 'fangroup' || kind === 'fanGroup') {
    const id = (state.fanGroups.at(-1)?.id ?? 0) + 1;
    state.fanGroups.push({ id, name: `风扇组 ${id}`, fan_ids: [], min_duty: 10, max_duty: 100 });
  }
  renderAll();
  const kindMap = { temp:'temps', fan:'fans', policy:'policies', area:'areas', fantype:'fanTypes', fanType:'fanTypes', abnormal:'abnormalFans', abnormalFan:'abnormalFans', fangroup:'fanGroups', fanGroup:'fanGroups' };
  const arrKey = kindMap[kind];
  const idKey = arrKey ? state[arrKey]?.at(-1)?.id : null;
  const domId = kind.replace(/([A-Z])/g, m => m.toLowerCase()).replace(/type/,'type').replace(/fanType/,'fantype').replace(/abnormalFan/,'abnormal').replace(/fanGroup/,'fangroup');
  if (idKey != null) setTimeout(() => jumpTo(`${domId.replace('fantype','fantype').replace('abnormalfan','abnormal').replace('fangroup','fangroup')}-${idKey}`), 30);
}

document.querySelectorAll('.section-head .add-btn').forEach(btn => {
  btn.addEventListener('click', () => addEntity(btn.dataset.add));
});

/* ==================================================================
   Side effects
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
  renderFanTypes();
  renderAbnormalFans();
  renderFanGroups();
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
  L.push('# Sections: global → requirements → fans → policies → areas');
  L.push('#            fan_types → abnormal_fans → fan_groups');
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
    L.push(`    policy_idx_group: [${a.policy_idx_group.join(', ')}]`);
    L.push(`    fan_idx_group:    [${a.fan_idx_group.join(', ')}]`);
  });
  L.push('');
  L.push('# (6) Fan type specifications');
  L.push('fan_types:');
  state.fanTypes.forEach(ft => {
    L.push(`  - fan_type: ${ft.name}`);
    L.push(`    vendor: ${ft.vendor}`);
    L.push(`    min_speed_rpm: ${ft.min_speed_rpm}`);
    L.push(`    max_speed_rpm: ${ft.max_speed_rpm}`);
    L.push(`    rotor_count: ${ft.rotor_count}`);
  });
  L.push('');
  L.push('# (7) Abnormal fan detection rules');
  L.push('abnormal_fans:');
  if (state.abnormalFans.length === 0) L.push('  []');
  state.abnormalFans.forEach(af => {
    L.push(`  - fan_id: ${af.fan_ref}`);
    L.push(`    name: "${af.name}"`);
    L.push(`    abnormal_condition: ${af.abnormal_condition}`);
    L.push(`    speed_threshold_rpm: ${af.speed_threshold_rpm}`);
  });
  L.push('');
  L.push('# (8) Fan groups (basic_cooling_config)');
  L.push('basic_cooling_config:');
  L.push('  fan_groups:');
  if (state.fanGroups.length === 0) L.push('    []');
  state.fanGroups.forEach(fg => {
    L.push(`    - group_id: ${fg.id}`);
    L.push(`      name: "${fg.name}"`);
    L.push(`      fan_ids: [${fg.fan_ids.join(', ')}]`);
    L.push(`      min_duty: ${fg.min_duty}`);
    L.push(`      max_duty: ${fg.max_duty}`);
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
    if (c === '#' && (i === 0 || /\s/.test(line[i-1]))) return i;
  }
  return -1;
}

function highlightValue(val) {
  const t = val.trim();
  if (/^".*"$/.test(t) || /^'.*'$/.test(t)) return `<span class="ys">${esc(t)}</span>`;
  if (/^(true|false|null|~|\[\])$/.test(t)) return `<span class="yb">${esc(t)}</span>`;
  if (/^-?\d+(\.\d+)?$/.test(t)) return `<span class="yn">${esc(t)}</span>`;
  if (/^\[.*\]$/.test(t)) {
    const inner = t.slice(1,-1);
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
  const out = [], gutterLines = [];
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
        out.push(`<span class="fold-content collapsed" data-fold-content="${groupId}">${lines.slice(i,j).map(l => highlightYamlLine(l)).join('\n')}</span>`);
        for (let k = 0; k < runLen; k++) gutterLines.push(String(i+k+1));
        i = j; continue;
      }
    }
    out.push(highlightYamlLine(lines[i]));
    gutterLines.push(String(i+1));
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
      if (content.classList.contains('collapsed')) { content.classList.remove('collapsed'); summary.classList.add('hidden'); }
      else { content.classList.add('collapsed'); summary.classList.remove('hidden'); }
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
        errors.push({ severity:'error', where:`${kind}[${i}]`, msg:`重复的 id: ${it.id}`, target:`${kind}-${it.id}` });
      else seen.set(it.id, i);
    });
  }
  uq(state.temps, 'temp');
  uq(state.fans, 'fan');
  uq(state.policies, 'policy');
  uq(state.areas, 'area');
  uq(state.fanTypes, 'fantype');
  uq(state.abnormalFans, 'abnormal');
  uq(state.fanGroups, 'fangroup');

  // Area references
  state.areas.forEach(a => {
    if (!state.temps.some(t => t.id === a.requirement_idx))
      errors.push({ severity:'error', where:`area #${a.id} · requirement_idx`, msg:`引用的温度点 #${a.requirement_idx} 不存在`, target:`area-${a.id}` });
    a.policy_idx_group.forEach(pid => {
      if (!state.policies.some(p => p.id === pid))
        errors.push({ severity:'error', where:`area #${a.id} · policy`, msg:`引用的策略 #${pid} 不存在`, target:`area-${a.id}` });
    });
    a.fan_idx_group.forEach(fid => {
      if (!state.fans.some(f => f.id === fid))
        errors.push({ severity:'error', where:`area #${a.id} · fan`, msg:`引用的风扇 #${fid} 不存在`, target:`area-${a.id}` });
    });
    if (a.fan_idx_group.length === 0)
      errors.push({ severity:'warn', where:`area #${a.id}`, msg:'未绑定任何风扇', target:`area-${a.id}` });
    if (a.policy_idx_group.length === 0)
      errors.push({ severity:'warn', where:`area #${a.id}`, msg:'未绑定任何调速策略', target:`area-${a.id}` });
  });

  // Orphan fans
  state.fans.forEach(f => {
    if (!state.areas.some(a => a.fan_idx_group.includes(f.id)))
      errors.push({ severity:'warn', where:`fan #${f.id} ${f.name}`, msg:'未被任何调速区域引用（孤立）', target:`fan-${f.id}` });
  });

  // Temp sanity
  state.temps.forEach(t => {
    if (t.max_celsius <= t.target_celsius)
      errors.push({ severity:'warn', where:`temp #${t.id}`, msg:`最大温度 ${t.max_celsius}°C 应大于目标 ${t.target_celsius}°C`, target:`temp-${t.id}` });
  });

  // Abnormal fan references
  state.abnormalFans.forEach(af => {
    if (!state.fans.some(f => f.id === af.fan_ref))
      errors.push({ severity:'error', where:`abnormal #${af.id}`, msg:`引用的风扇 #${af.fan_ref} 不存在`, target:`abnormal-${af.id}` });
  });

  // Fan group references
  state.fanGroups.forEach(fg => {
    fg.fan_ids.forEach(fid => {
      if (!state.fans.some(f => f.id === fid))
        errors.push({ severity:'error', where:`fangroup #${fg.id}`, msg:`引用的风扇 #${fid} 不存在`, target:`fangroup-${fg.id}` });
    });
    if (fg.fan_ids.length === 0)
      errors.push({ severity:'warn', where:`fangroup #${fg.id}`, msg:'风扇组未绑定任何风扇', target:`fangroup-${fg.id}` });
  });

  // Update badge
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
    <div class="err-item severity-${e.severity}" data-target="${e.target||''}">
      <div class="sev">${e.severity==='error'?'✗ ERROR':'⚠ WARN'}</div>
      <div class="where">${esc(e.where)}</div>
      <div class="msg">${esc(e.msg)}</div>
    </div>
  `).join('');
  pop.querySelectorAll('.err-item').forEach(el => {
    el.addEventListener('click', () => { const t = el.dataset.target; if (t) { jumpTo(t); pop.classList.remove('open'); } });
  });
}

document.getElementById('btn-validate').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('err-popover').classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!e.target.closest('.err-popover-wrap')) document.getElementById('err-popover').classList.remove('open');
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
      'PSR.platform.thermal.fan_types': state.fanTypes.map(ft => ({
        FanType: ft.name, Vendor: ft.vendor,
        MinSpeedRpm: ft.min_speed_rpm, MaxSpeedRpm: ft.max_speed_rpm,
        RotorCount: ft.rotor_count,
      })),
      'PSR.platform.thermal.abnormal_fans': state.abnormalFans.map(af => ({
        FanRef: `fans[${af.fan_ref}]`, Name: af.name,
        Condition: af.abnormal_condition, ThresholdRpm: af.speed_threshold_rpm,
      })),
      'PSR.platform.thermal.fan_groups': state.fanGroups.map(fg => ({
        GroupId: fg.id, Name: fg.name,
        FanRefs: fg.fan_ids.map(f => `fans[${f}]`),
        MinDuty: fg.min_duty, MaxDuty: fg.max_duty,
      })),
    };
  } else {
    return {
      'SR.thermal.flags': {
        smart_cooling: state.global.smart_cooling_state === 'Enabled' ? 1 : 0,
        default_duty_pct: state.global.default_duty,
      },
      'SR.thermal.points': state.temps.map(t => ({ id: t.id, type: t.temperature_type, target: t.target_celsius })),
      'SR.thermal.fans':   state.fans.map(f => ({ id: f.id, type: f.fan_type, pos: f.position })),
      'SR.thermal.curves': state.policies.flatMap(p => p.temperature_range_low.map((lo, i) => ({
        policy: p.id, seg: i,
        tLow: lo, tHigh: p.temperature_range_high[i],
        sLow: p.speed_range_low[i], sHigh: p.speed_range_high[i],
      }))),
      'SR.thermal.binding':  state.areas.map(a => ({ area: a.id, req: a.requirement_idx, policies: a.policy_idx_group, fans: a.fan_idx_group })),
      'SR.thermal.groups':   state.fanGroups.map(fg => ({ group: fg.id, fans: fg.fan_ids, min: fg.min_duty, max: fg.max_duty })),
      'SR.thermal.abnormal': state.abnormalFans.map(af => ({ fan: af.fan_ref, cond: af.abnormal_condition, rpm: af.speed_threshold_rpm })),
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

document.getElementById('csr-handle').addEventListener('click', e => {
  if (e.target.closest('button') || e.target.closest('.seg')) return;
  state.ui.csrOpen = !state.ui.csrOpen;
  document.getElementById('csr-drawer').classList.toggle('open', state.ui.csrOpen);
});
document.getElementById('btn-generate').addEventListener('click', () => {
  state.ui.csrOpen = true;
  document.getElementById('csr-drawer').classList.add('open');
  renderCsr(); showToast('CSR 已生成');
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
  a.href = url; a.download = `thermal-${state.ui.csrTab}.json`; a.click(); URL.revokeObjectURL(url);
  showToast('已下载 thermal-' + state.ui.csrTab + '.json');
});

/* View mode */
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
    layout.style.gridTemplateColumns = '420px 1fr'; yaml.style.display='flex'; form.style.display='flex'; csr.style.left='420px';
  } else if (state.ui.viewMode === 'form') {
    layout.style.gridTemplateColumns = '1fr'; yaml.style.display='none'; form.style.display='flex'; csr.style.left='0';
  } else {
    layout.style.gridTemplateColumns = '1fr'; yaml.style.display='flex'; form.style.display='none'; csr.style.left='0';
  }
});

/* Dirty status */
let dirtyTimer = null;
function markDirty() {
  const el = document.getElementById('tb-status');
  el.textContent = '保存中…'; el.style.color = 'var(--warn)';
  clearTimeout(dirtyTimer);
  dirtyTimer = setTimeout(() => { el.textContent = '已自动保存 · 刚刚'; el.style.color = ''; }, 600);
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
