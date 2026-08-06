/* ═══════════════════════════════════════════════════════════════════
   csr-topo-ext 设置弹窗增强层 —— 仓库表「更多选项」开关
   ───────────────────────────────────────────────────────────────────
   背景：仓库表六列里只有「文件夹路径」是必填（bundle 里唯一的保存校验就是
   「存在仓库未选择文件夹路径」），仓库名由所选文件夹自动带出，剩下的
   仓库地址 / 分支信息 / 描述信息第一次配置根本不用管。第一眼摆六列，
   用户不知道该填哪个。

   本文件只做一件事：往弹窗的「仓库管理」标题行塞一个开关按钮，点它切换
   <html data-csr-optional-cols="on|off">。真正的显隐和布局全在
   pto-overrides.css ⑩ 节，这里不写任何样式。

   约束：bundle（assets/index.js / index.css）依旧一个字节没动，本脚本由
   index.html 单独引入。脚本没跑到时 data 属性缺省 = 六列全展开，退化成
   原布局，不会把列锁死在隐藏状态。
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'csr-topo:optional-cols';
  var OPTIONAL_INPUTS = '.folder-table .repo-url-input, .folder-table .gitBranch-input, .folder-table .description-input';

  // 用户点过开关就记住选择；没点过时按「表里本来有没有选填数据」自动决定
  // （比如「配置导入」带进来的配置已经登记了仓库地址，就不该藏起来）。
  var pref = null;
  try {
    pref = localStorage.getItem(KEY);
  } catch (e) {
    /* 无痕模式等禁用 localStorage：退化成不记忆 */
  }

  function hasOptionalData() {
    var inputs = document.querySelectorAll(OPTIONAL_INPUTS);
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value && inputs[i].value.trim() !== '') return true;
    }
    return false;
  }

  function apply(on) {
    document.documentElement.dataset.csrOptionalCols = on ? 'on' : 'off';
  }

  function isOn() {
    return document.documentElement.dataset.csrOptionalCols === 'on';
  }

  function ensureToggle(host) {
    if (host.querySelector('.csr-optional-toggle')) return;
    // 弹窗刚挂上时表里往往还没有数据（宿主要等 getCreateProjectFormContent 才回），
    // 而回填走的是 input.value 属性、不产生 DOM 变更记录，MutationObserver 收不到。
    // 所以新开一次弹窗就补几次延迟复查，让「有选填数据就自动展开」能生效。
    [150, 400, 900, 1800].forEach(function (ms) {
      setTimeout(tick, ms);
    });
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'csr-optional-toggle';
    btn.textContent = '更多选项';
    btn.title = '展开 / 收起仓库地址、分支信息、描述信息（都是选填）';
    btn.addEventListener('click', function () {
      pref = isOn() ? 'off' : 'on';
      apply(pref === 'on');
      try {
        localStorage.setItem(KEY, pref);
      } catch (e) {
        /* 同上 */
      }
    });
    // 追加在末尾：Vue 按下标 patch 它自己那两个按钮，多出来的兄弟节点不受影响
    host.appendChild(btn);
  }

  function tick() {
    var host = document.querySelector('.modal-content .repo-section-actions');
    if (!host) return; // 弹窗没开，不做任何事
    ensureToggle(host);
    apply(pref ? pref === 'on' : hasOptionalData());
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
