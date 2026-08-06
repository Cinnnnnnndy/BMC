/* ═══════════════════════════════════════════════════════════════════
   csr-topo-ext 设置弹窗增强层 —— 「配置管理」折叠开关
   ───────────────────────────────────────────────────────────────────
   「配置管理」是整机 CSR 配置完成之后保存用的，第一次打开设置根本不用管，
   摆在那里只会跟真正要填的「仓库管理 → 文件夹路径」抢注意力。所以默认收起，
   点标题旁的开关再展开。

   本文件只做两件事：给「配置管理」标题行插一个开关按钮、切
   <html data-csr-configs="on|off">。显隐规则全在 pto-overrides.css ⑪ 节。

   约束：bundle（assets/index.js / index.css）依旧一个字节没动，本脚本由
   index.html 单独引入。脚本没跑到时 data 属性缺省 = 展开，退化成原样，
   不会把这块锁死在隐藏状态。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'csr-topo:configs-section';

  // 用户点过就记住；没点过按默认收起
  var pref = null;
  try {
    pref = localStorage.getItem(KEY);
  } catch (e) {
    /* 无痕模式等禁用 localStorage：退化成不记忆 */
  }

  function apply(on) {
    document.documentElement.dataset.csrConfigs = on ? 'on' : 'off';
  }

  /** 「配置管理」那一节的标题行（按标题文字找，不依赖它是第几个 section） */
  function findConfigHeader() {
    var titles = document.querySelectorAll('.modal-content .config-section-title');
    for (var i = 0; i < titles.length; i++) {
      if (titles[i].textContent.trim().indexOf('配置管理') === 0) return titles[i].parentElement;
    }
    return null;
  }

  function sync(btn) {
    var on = document.documentElement.dataset.csrConfigs === 'on';
    btn.textContent = on ? '收起' : '展开';
  }

  function ensureToggle(header) {
    var btn = header.querySelector('.csr-section-toggle');
    if (btn) {
      sync(btn);
      return;
    }
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'csr-section-toggle';
    btn.title = '展开 / 收起配置管理（整机 CSR 配置好之后再来保存，第一次可以跳过）';
    btn.addEventListener('click', function () {
      pref = document.documentElement.dataset.csrConfigs === 'on' ? 'off' : 'on';
      apply(pref === 'on');
      sync(btn);
      try {
        localStorage.setItem(KEY, pref);
      } catch (e) {
        /* 同上 */
      }
    });
    // 插在「新增配置」之前 = 紧跟标题和计数，符合折叠区的惯例位置
    var addBtn = header.querySelector('.config-add-btn');
    if (addBtn) header.insertBefore(btn, addBtn);
    else header.appendChild(btn);
    sync(btn);
  }

  function tick() {
    var header = findConfigHeader();
    if (!header) return; // 弹窗没开，不做任何事
    apply(pref === 'on');
    ensureToggle(header);
  }

  function start() {
    tick();
    var scheduled = false;
    new MutationObserver(function () {
      if (scheduled) return; // 画布动画会疯狂触发，合并到每帧最多查一次
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        tick();
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
