/* ═══════════════════════════════════════════════════════════════════
   csr-topo-ext 板级拓扑增强层 —— 在每个器件下面标出 I2C 地址
   ───────────────────────────────────────────────────────────────────
   画布里的器件是一张张 <img class="chip-image" src="resources/chip/X.svg">，
   绝对定位在 .content-layer 上，DOM 里只有图形和坐标，没有对象名，
   所以地址得自己对齐回 .sr 数据：

     · 数据来源：宿主发给 webview 的 showSrManagementTopology 消息，
       里面的 srData 就是这块板卡的 .sr（含 ManagementTopology 与 Objects）。
       本脚本在同一个 window 上监听同一条消息，不额外加协议。
     · 对齐方式：.content-layer 的子节点是按「总线标签 → 该总线上的器件」
       顺序铺的，一条总线的器件顺序 = Chips → Connectors → 各 mux 芯片下挂
       总线（递归）。按这个顺序消费队列即可把每张图片还原成对象名。
     · 兜底：图片数量和队列对不上、或连接器/芯片错位，就整条总线不标，
       宁可少标也不标错。
     · 芯片、连接器一律标：.sr 里有 Address 的显示地址，没有的（板间
       连接器 Connector_*、JTAG 链路上的 Cpld_1）显示「—」，不编造。
     · 位置固定在器件正下方、与器件等宽居中——不做「挤不下就换到旁边」
       这类挪位，否则同一块板上标签一会儿在下、一会儿在右，读起来更乱。
       只在纵向留 1~5px 的余地：默认离器件 5px，若这一行下方挤（mux 通道
       号、下一条总线标签），就往器件方向收几像素，避免压住它们。
       压到连线上靠文字描边保证可读，不加底片方块。

   约束：bundle（assets/index.js / index.css）未改动，本脚本由 index.html
   单独引入，样式在 pto-overrides.css ⑫ 节。脚本没跑到时画布就是原样。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LABEL_CLASS = 'csr-addr-label';
  var sr = null; // 当前板卡的 .sr 文档

  window.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || typeof d !== 'object') return;
    if (d.command === 'showSrManagementTopology') {
      sr = d.srData || null;
      schedule();
    } else if (d.command === 'showTopologyView' || d.command === 'exitStandaloneMode') {
      // 回到板间视图：丢掉旧板卡数据，免得拿上一块板的地址去标新画布
      sr = null;
      schedule();
    }
  });

  function hex(v) {
    var s = v.toString(16).toUpperCase();
    return '0x' + (s.length < 2 ? '0' + s : s);
  }

  function addrOf(name) {
    var o = sr && sr.Objects && sr.Objects[name];
    var a = o && o.Address;
    return typeof a === 'number' ? hex(a) : null;
  }

  /** 一条总线在画布上的器件顺序：Chips → Connectors → 各 mux 芯片的下挂总线 */
  function expandBus(busName, seen) {
    var mt = (sr && sr.ManagementTopology) || {};
    var bus = mt[busName];
    if (!bus || seen[busName]) return [];
    seen[busName] = true;

    var chips = bus.Chips || [];
    var out = chips.concat(bus.Connectors || []);
    for (var i = 0; i < chips.length; i++) {
      // mux 芯片自己也是 ManagementTopology 里的一项，带 Buses（下挂通道）
      var sub = mt[chips[i]];
      if (sub && sub.Buses) {
        seen[chips[i]] = true;
        for (var j = 0; j < sub.Buses.length; j++) {
          out = out.concat(expandBus(sub.Buses[j], seen));
        }
      }
    }
    return out;
  }

  var GAP_MAX = 5;   // 与器件底边的默认间距（让开底部那条 6px 的绿色焊盘）
  var GAP_MIN = 1;
  var LABEL_H = 11;  // 与 CSS 的 line-height 一致
  var CHAR_W = 5.7;  // 9.5px 等宽字体的单字宽，用来估文字实际占位

  function hits(a, b) {
    return a.x < b.x + b.w - 0.5 && a.x + a.w > b.x + 0.5 &&
           a.y < b.y + b.h - 0.5 && a.y + a.h > b.y + 0.5;
  }

  /** 只在纵向微调：从默认间距往器件方向收，找第一个不压住别的元素的位置 */
  function gapFor(chip, text, obstacles) {
    var tw = text.length * CHAR_W + 2;
    for (var g = GAP_MAX; g >= GAP_MIN; g--) {
      var box = {
        x: chip.x + (chip.w - tw) / 2,
        y: chip.y + chip.h + g,
        w: tw,
        h: LABEL_H,
      };
      var clash = false;
      for (var i = 0; i < obstacles.length; i++) {
        if (hits(box, obstacles[i])) { clash = true; break; }
      }
      if (!clash) return g;
    }
    // 实在没位置（例如 JTAG 那种上下两条总线挨得很近）就贴着器件放，
    // 离下面那条总线标签最远，重叠只落在行高的空白上，看不出来
    return GAP_MIN;
  }

  function makeLabel(img, name, obstacles) {
    var a = addrOf(name);
    var text = a || '—';
    var el = document.createElement('div');
    el.className = LABEL_CLASS + (a ? '' : ' is-none');
    el.textContent = text;
    el.title = a
      ? name + ' · I2C 地址 ' + a + '（8bit 写地址）'
      : name + ' · 该器件在 .sr 里没有 Address（板间连接器 / 非 I2C 链路）';
    var x = parseFloat(img.style.left) || 0;
    var y = parseFloat(img.style.top) || 0;
    var w = parseFloat(img.style.width) || 70;
    var h = parseFloat(img.style.height) || 60;
    el.style.left = x + 'px';
    el.style.width = w + 'px';
    el.style.top = (y + h + gapFor({ x: x, y: y, w: w, h: h }, text, obstacles)) + 'px';
    return el;
  }

  function render() {
    var layer = document.querySelector('.content-layer');
    if (!layer) return;

    var old = layer.querySelectorAll('.' + LABEL_CLASS);
    for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
    if (!sr) return;

    // 障碍物：画布上除连线以外的元素，用于纵向微调时避让
    var base = layer.getBoundingClientRect();
    var scale = layer.offsetWidth ? base.width / layer.offsetWidth : 1;
    if (!scale || !isFinite(scale)) scale = 1;
    var obstacles = [];
    var all = layer.querySelectorAll('*');
    for (var n = 0; n < all.length; n++) {
      var o = all[n];
      if (o.closest('.wire-layer') || o.classList.contains(LABEL_CLASS)) continue;
      var r = o.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      obstacles.push({
        x: (r.left - base.left) / scale, y: (r.top - base.top) / scale,
        w: r.width / scale, h: r.height / scale,
      });
    }

    var seen = {};
    var queue = [];
    var kids = [].slice.call(layer.children);
    var pending = [];

    for (var k = 0; k < kids.length; k++) {
      var el = kids[k];
      if (el.classList && el.classList.contains('bus-tag')) {
        var t = el.querySelector('.bus-label-text');
        queue = t ? expandBus(t.textContent.trim(), seen) : [];
        continue;
      }
      if (!el.classList || !el.classList.contains('chip-image')) continue;

      var name = queue.shift();
      if (!name) continue;                     // 队列空了 = 数量对不上，后面的不标
      var isConn = /^Connector_/.test(name);
      if ((el.alt === 'connector') !== isConn) { // 芯片/连接器错位 → 这条总线整段放弃
        queue = [];
        continue;
      }
      var label = makeLabel(el, name, obstacles);
      pending.push(label);
      obstacles.push({                       // 标签之间也别叠在一起
        x: parseFloat(label.style.left), y: parseFloat(label.style.top),
        w: parseFloat(label.style.width), h: LABEL_H,
      });
    }

    for (var m = 0; m < pending.length; m++) layer.appendChild(pending[m]);
  }

  // ── 调度：DOM 变化（切板卡 / 重新布局）与拖动过程都要跟手 ──────────────
  var observer = null;
  var scheduled = false;

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      if (observer) observer.disconnect();     // 自己插的节点不要再触发自己
      try { render(); } finally {
        if (observer) observer.observe(document.body, { childList: true, subtree: true });
      }
    });
  }

  function start() {
    observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    // 拖动器件时坐标只改 style，用指针事件跟一下
    document.addEventListener('pointermove', function () {
      if (dragging) schedule();
    });
    document.addEventListener('pointerdown', function (e) {
      dragging = !!(e.target && e.target.classList && e.target.classList.contains('chip-image'));
    });
    document.addEventListener('pointerup', function () {
      if (dragging) { dragging = false; schedule(); }
    });
    schedule();
  }

  var dragging = false;

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
