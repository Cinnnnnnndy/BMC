/**
 * 能效调速配置编辑器 - Canvas温度-转速曲线编辑器
 * 支持拖拽节点、添加/删除节点、区间色块显示
 */
(function() {
  'use strict';

  const PADDING = { top: 30, right: 30, bottom: 40, left: 50 };
  const POINT_RADIUS = 6;
  const COLORS = [
    'rgba(67,97,238,0.15)', 'rgba(67,97,238,0.25)', 'rgba(67,97,238,0.35)',
    'rgba(67,97,238,0.45)', 'rgba(67,97,238,0.55)', 'rgba(231,76,60,0.15)',
    'rgba(231,76,60,0.25)', 'rgba(231,76,60,0.35)', 'rgba(231,76,60,0.45)',
    'rgba(231,76,60,0.55)', 'rgba(243,156,18,0.15)', 'rgba(243,156,18,0.25)',
    'rgba(243,156,18,0.35)', 'rgba(243,156,18,0.45)', 'rgba(243,156,18,0.55)'
  ];

  let canvas, ctx;
  let data = { tempLow: [], tempHigh: [], speedLow: [], speedHigh: [] };
  let dragIdx = -1;
  let dragAxis = null; // 'x' or 'y'
  let selectedIdx = -1;
  let tableContainer = null; // 表格容器 DOM 引用

  const CurveEditor = {
    /**
     * 渲染曲线图
     * @param {HTMLCanvasElement} canvasEl
     * @param {number[]} tempLow - temperature_range_low
     * @param {number[]} tempHigh - temperature_range_high
     * @param {number[]} speedLow - speed_range_low
     * @param {number[]} speedHigh - speed_range_high
     */
    render: function(canvasEl, tempLow, tempHigh, speedLow, speedHigh) {
      canvas = canvasEl;
      ctx = canvas.getContext('2d');
      data.tempLow = tempLow.slice();
      data.tempHigh = tempHigh.slice();
      data.speedLow = speedLow.slice();
      data.speedHigh = speedHigh.slice();
      selectedIdx = -1;
      drawChart();
      bindCanvasEvents();
    },

    /**
     * 获取更新后的四数组
     */
    getUpdatedArrays: function() {
      return {
        temperature_range_low: data.tempLow.slice(),
        temperature_range_high: data.tempHigh.slice(),
        speed_range_low: data.speedLow.slice(),
        speed_range_high: data.speedHigh.slice()
      };
    },

    /**
     * 添加节点（在中间位置插入）
     */
    addNode: function() {
      if (data.tempLow.length < 2) return;
      // 在最后一个区间中间插入
      const i = data.tempLow.length - 1;
      const newTemp = Math.round((data.tempLow[i] + data.tempHigh[i]) / 2);
      const newSpeed = data.speedLow[i];
      // 拆分最后一个区间
      data.tempHigh[i] = newTemp;
      data.tempLow.push(newTemp);
      data.tempHigh.push(127); // 默认上限
      data.speedLow.push(newSpeed);
      data.speedHigh.push(newSpeed);
      drawChart();
      notifyUpdate();
    },

    /**
     * 删除选中节点（保留首尾节点）
     */
    deleteSelectedNode: function() {
      if (selectedIdx < 0 || selectedIdx >= data.tempLow.length) return;
      if (data.tempLow.length <= 2) return; // 至少保留2个区间
      if (selectedIdx === 0 || selectedIdx === data.tempLow.length - 1) return; // 不删首尾
      // 合并到前一个区间
      data.tempHigh[selectedIdx - 1] = data.tempHigh[selectedIdx];
      data.tempLow.splice(selectedIdx, 1);
      data.tempHigh.splice(selectedIdx, 1);
      data.speedLow.splice(selectedIdx, 1);
      data.speedHigh.splice(selectedIdx, 1);
      selectedIdx = -1;
      drawChart();
      notifyUpdate();
    },

    /**
     * 渲染可编辑表格到容器中
     * @param {HTMLElement} containerEl - 表格容器元素
     */
    renderTable: function(containerEl) {
      tableContainer = containerEl;
      if (!tableContainer) return;
      buildTable();
    },

    /**
     * 刷新表格数据（从 data 数组同步到表格输入框）
     */
    refreshTable: function() {
      if (!tableContainer) return;
      var inputs = tableContainer.querySelectorAll('input[data-row]');
      for (var k = 0; k < inputs.length; k++) {
        var inp = inputs[k];
        var row = parseInt(inp.dataset.row);
        var field = inp.dataset.field;
        var val;
        if (field === 'tl') val = data.tempLow[row];
        else if (field === 'th') val = data.tempHigh[row];
        else if (field === 'sl') val = data.speedLow[row];
        else if (field === 'sh') val = data.speedHigh[row];
        if (val !== undefined) inp.value = val;
        // 清除错误高亮
        inp.classList.remove('curve-cell-error');
      }
    }
  };

  // ==================== 坐标映射 ====================
  function getTempRange() {
    const all = data.tempLow.concat(data.tempHigh);
    return { min: Math.min(...all, -40), max: Math.max(...all, 130) };
  }

  function getSpeedRange() {
    const all = data.speedLow.concat(data.speedHigh);
    return { min: 0, max: Math.max(...all, 110) };
  }

  function tempToX(temp) {
    const r = getTempRange();
    return PADDING.left + (temp - r.min) / (r.max - r.min) * (canvas.width - PADDING.left - PADDING.right);
  }

  function speedToY(speed) {
    const r = getSpeedRange();
    return canvas.height - PADDING.bottom - (speed - r.min) / (r.max - r.min) * (canvas.height - PADDING.top - PADDING.bottom);
  }

  function xToTemp(x) {
    const r = getTempRange();
    return Math.round((x - PADDING.left) / (canvas.width - PADDING.left - PADDING.right) * (r.max - r.min) + r.min);
  }

  function yToSpeed(y) {
    const r = getSpeedRange();
    return Math.round((canvas.height - PADDING.bottom - y) / (canvas.height - PADDING.top - PADDING.bottom) * (r.max - r.min) + r.min);
  }

  // ==================== 绘制 ====================
  function drawChart() {
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 背景
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    drawGrid(w, h);
    drawIntervals(w, h);
    drawCurves();
    drawPoints();
    drawAxesLabels(w, h);
  }

  function drawGrid(w, h) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    const tRange = getTempRange();
    const sRange = getSpeedRange();
    // 横线（转速）
    for (let s = Math.ceil(sRange.min / 10) * 10; s <= sRange.max; s += 10) {
      const y = speedToY(s);
      ctx.beginPath(); ctx.moveTo(PADDING.left, y); ctx.lineTo(w - PADDING.right, y); ctx.stroke();
      ctx.fillStyle = '#999'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right';
      ctx.fillText(s + '%', PADDING.left - 5, y + 4);
    }
    // 竖线（温度）
    for (let t = Math.ceil(tRange.min / 10) * 10; t <= tRange.max; t += 10) {
      const x = tempToX(t);
      ctx.beginPath(); ctx.moveTo(x, PADDING.top); ctx.lineTo(x, h - PADDING.bottom); ctx.stroke();
      ctx.fillStyle = '#999'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(t + '°', x, h - PADDING.bottom + 15);
    }
  }

  function drawIntervals(w, h) {
    for (let i = 0; i < data.tempLow.length; i++) {
      const x1 = tempToX(data.tempLow[i]);
      const x2 = tempToX(data.tempHigh[i]);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(x1, PADDING.top, x2 - x1, h - PADDING.top - PADDING.bottom);
    }
  }

  function drawCurves() {
    // 转速下界曲线
    ctx.strokeStyle = '#4361ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data.tempLow.length; i++) {
      const x = tempToX(data.tempHigh[i]);
      const y = speedToY(data.speedLow[i]);
      if (i === 0) ctx.moveTo(tempToX(data.tempLow[i]), y);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 转速上界曲线
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data.tempLow.length; i++) {
      const x = tempToX(data.tempHigh[i]);
      const y = speedToY(data.speedHigh[i]);
      if (i === 0) ctx.moveTo(tempToX(data.tempLow[i]), y);
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 图例
    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#4361ee'; ctx.fillRect(PADDING.left + 10, 8, 16, 3);
    ctx.fillText('转速下界', PADDING.left + 30, 14);
    ctx.fillStyle = '#e74c3c'; ctx.fillRect(PADDING.left + 100, 8, 16, 3);
    ctx.fillText('转速上界', PADDING.left + 120, 14);
  }

  function drawPoints() {
    for (let i = 0; i < data.tempLow.length; i++) {
      // 下界点（区间右端）
      drawPoint(tempToX(data.tempHigh[i]), speedToY(data.speedLow[i]), i === selectedIdx, '#4361ee');
      // 上界点（区间右端）
      drawPoint(tempToX(data.tempHigh[i]), speedToY(data.speedHigh[i]), false, '#e74c3c');
    }
    // 第一个区间的左端点
    drawPoint(tempToX(data.tempLow[0]), speedToY(data.speedLow[0]), false, '#4361ee');
    drawPoint(tempToX(data.tempLow[0]), speedToY(data.speedHigh[0]), false, '#e74c3c');
  }

  function drawPoint(x, y, selected, color) {
    ctx.beginPath();
    ctx.arc(x, y, selected ? POINT_RADIUS + 2 : POINT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (selected) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, POINT_RADIUS + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawAxesLabels(w, h) {
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('温度 (°C)', w / 2, h - 5);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('转速 (%)', 0, 0);
    ctx.restore();
  }

  // ==================== 交互 ====================
  let eventsBound = false;

  function bindCanvasEvents() {
    if (eventsBound) return;
    eventsBound = true;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('dblclick', onDblClick);
    canvas.addEventListener('contextmenu', onContextMenu);
  }

  function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function findNearestPoint(mx, my) {
    let best = { idx: -1, dist: Infinity, axis: null };
    // 检查区间右端点（可拖拽温度和转速）
    for (let i = 0; i < data.tempLow.length; i++) {
      const px = tempToX(data.tempHigh[i]);
      const pyLow = speedToY(data.speedLow[i]);
      const pyHigh = speedToY(data.speedHigh[i]);
      const dLow = Math.hypot(mx - px, my - pyLow);
      const dHigh = Math.hypot(mx - px, my - pyHigh);
      if (dLow < best.dist) { best = { idx: i, dist: dLow, axis: 'low' }; }
      if (dHigh < best.dist) { best = { idx: i, dist: dHigh, axis: 'high' }; }
    }
    // 首端点（仅可上下拖拽）
    const px0 = tempToX(data.tempLow[0]);
    const d0 = Math.hypot(mx - px0, my - speedToY(data.speedLow[0]));
    if (d0 < best.dist) { best = { idx: 0, dist: d0, axis: 'first-low' }; }
    return best.dist < POINT_RADIUS * 3 ? best : null;
  }

  function onMouseDown(e) {
    if (e.button !== 0) return;
    const pos = getCanvasPos(e);
    const hit = findNearestPoint(pos.x, pos.y);
    if (hit) {
      dragIdx = hit.idx;
      dragAxis = hit.axis;
      selectedIdx = hit.idx;
      drawChart();
    } else {
      selectedIdx = -1;
      drawChart();
    }
  }

  function onMouseMove(e) {
    if (dragIdx < 0) return;
    const pos = getCanvasPos(e);
    const newSpeed = Math.max(0, Math.min(100, yToSpeed(pos.y)));

    if (dragAxis === 'low') {
      data.speedLow[dragIdx] = newSpeed;
      // 温度连续性：当前右端 = 下一个左端
      if (dragIdx < data.tempLow.length - 1) {
        const newTemp = Math.max(data.tempLow[dragIdx], Math.min(data.tempHigh[dragIdx + 1], xToTemp(pos.x)));
        data.tempHigh[dragIdx] = newTemp;
        data.tempLow[dragIdx + 1] = newTemp;
      }
    } else if (dragAxis === 'high') {
      data.speedHigh[dragIdx] = newSpeed;
      if (dragIdx < data.tempLow.length - 1) {
        const newTemp = Math.max(data.tempLow[dragIdx], Math.min(data.tempHigh[dragIdx + 1], xToTemp(pos.x)));
        data.tempHigh[dragIdx] = newTemp;
        data.tempLow[dragIdx + 1] = newTemp;
      }
    } else if (dragAxis === 'first-low') {
      data.speedLow[0] = newSpeed;
      data.speedHigh[0] = newSpeed;
    }
    drawChart();
  }

  function onMouseUp() {
    if (dragIdx >= 0) {
      notifyUpdate();
    }
    dragIdx = -1;
    dragAxis = null;
  }

  function onDblClick(e) {
    const pos = getCanvasPos(e);
    const clickTemp = xToTemp(pos.x);

    // 找到点击所在的区间
    let insertIdx = -1;
    for (let i = 0; i < data.tempLow.length; i++) {
      if (clickTemp >= data.tempLow[i] && clickTemp < data.tempHigh[i]) {
        insertIdx = i;
        break;
      }
    }
    if (insertIdx < 0) return;

    // 在该区间中间插入新节点
    const midTemp = Math.round((data.tempLow[insertIdx] + data.tempHigh[insertIdx]) / 2);
    const newSpeedLow = data.speedLow[insertIdx];
    const newSpeedHigh = data.speedHigh[insertIdx];

    // 拆分当前区间
    const oldHigh = data.tempHigh[insertIdx];
    data.tempHigh[insertIdx] = midTemp;

    // 在 insertIdx+1 位置插入新区间
    data.tempLow.splice(insertIdx + 1, 0, midTemp);
    data.tempHigh.splice(insertIdx + 1, 0, oldHigh);
    data.speedLow.splice(insertIdx + 1, 0, newSpeedLow);
    data.speedHigh.splice(insertIdx + 1, 0, newSpeedHigh);

    selectedIdx = insertIdx + 1;
    drawChart();
    notifyUpdate();
  }

  function onContextMenu(e) {
    e.preventDefault();
    const pos = getCanvasPos(e);
    const hit = findNearestPoint(pos.x, pos.y);
    if (hit && hit.idx > 0 && hit.idx < data.tempLow.length - 1 && data.tempLow.length > 2) {
      // 删除该节点，合并到前一个区间
      data.tempHigh[hit.idx - 1] = data.tempHigh[hit.idx];
      data.tempLow.splice(hit.idx, 1);
      data.tempHigh.splice(hit.idx, 1);
      data.speedLow.splice(hit.idx, 1);
      data.speedHigh.splice(hit.idx, 1);
      selectedIdx = -1;
      drawChart();
      notifyUpdate();
    }
  }

  // ==================== 表格编辑 ====================

  function buildTable() {
    if (!tableContainer) return;
    var html = '<table><thead><tr>' +
      '<th>区间</th><th>温度下限(°C)</th><th>温度上限(°C)</th>' +
      '<th>转速下限(%)</th><th>转速上限(%)</th></tr></thead><tbody>';
    for (var i = 0; i < data.tempLow.length; i++) {
      var isFirst = (i === 0);
      var isLast = (i === data.tempLow.length - 1);
      html += '<tr>';
      html += '<td class="row-idx">' + i + '</td>';
      // 温度下限：首行只读（由连续性约束决定）
      html += '<td>' + cellInput(i, 'tl', data.tempLow[i], isFirst) + '</td>';
      // 温度上限：末行只读
      html += '<td>' + cellInput(i, 'th', data.tempHigh[i], isLast) + '</td>';
      // 转速下限/上限：都可编辑
      html += '<td>' + cellInput(i, 'sl', data.speedLow[i], false) + '</td>';
      html += '<td>' + cellInput(i, 'sh', data.speedHigh[i], false) + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table>';
    tableContainer.innerHTML = html;

    // 绑定事件
    var inputs = tableContainer.querySelectorAll('input[data-row]');
    for (var k = 0; k < inputs.length; k++) {
      inputs[k].addEventListener('blur', onCellBlur);
      inputs[k].addEventListener('keydown', onCellKeydown);
    }
  }

  function cellInput(row, field, value, readonly) {
    var cls = readonly ? 'curve-cell-readonly' : '';
    var ro = readonly ? ' readonly' : '';
    return '<input type="number" data-row="' + row + '" data-field="' + field +
      '" value="' + value + '" class="' + cls + '"' + ro + '>';
  }

  function validateCell(rowIndex, field, value) {
    if (isNaN(value)) return { valid: false, message: '请输入数字' };
    if (field === 'tl' || field === 'th') {
      // 温度值范围 -127 ~ 127
      if (value < -127 || value > 127) return { valid: false, message: '温度范围 [-127, 127]' };
    } else {
      // 转速范围 0 ~ 100
      if (value < 0 || value > 100) return { valid: false, message: '转速范围 [0, 100]' };
    }
    // 温度连续性：修改温度上限时，检查与下一行温度下限的一致性
    if (field === 'th' && rowIndex < data.tempLow.length - 1) {
      // 修改后将自动同步下一行的温度下限，所以这里只检查不越界
      if (value <= data.tempLow[rowIndex]) {
        return { valid: false, message: '温度上限必须大于当前区间温度下限' };
      }
    }
    if (field === 'tl' && rowIndex > 0) {
      // 温度下限由上一行温度上限决定（连续性），不应被直接修改
      // 但如果用户强制修改，检查与上一行
      if (value < data.tempHigh[rowIndex - 1] || value > data.tempHigh[rowIndex - 1]) {
        return { valid: false, message: '温度下限必须等于上一区间上限(' + data.tempHigh[rowIndex - 1] + ')' };
      }
    }
    return { valid: true };
  }

  function onCellBlur(e) {
    handleCellEdit(e.target);
  }

  function onCellKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCellEdit(e.target);
      e.target.blur();
    }
  }

  function handleCellEdit(input) {
    var row = parseInt(input.dataset.row);
    var field = input.dataset.field;
    var value = parseFloat(input.value);

    var result = validateCell(row, field, value);
    if (!result.valid) {
      input.classList.add('curve-cell-error');
      return;
    }

    // 清除错误高亮
    input.classList.remove('curve-cell-error');

    // 更新内部数据
    if (field === 'tl') data.tempLow[row] = value;
    else if (field === 'th') {
      data.tempHigh[row] = value;
      // 温度连续性：自动同步下一行温度下限
      if (row < data.tempLow.length - 1) {
        data.tempLow[row + 1] = value;
      }
    }
    else if (field === 'sl') data.speedLow[row] = value;
    else if (field === 'sh') data.speedHigh[row] = value;

    // 重绘 Canvas（不 refreshTable 避免循环）
    drawChart();
    // 通知 app.js 数据变更
    notifyUpdate();
  }

  // ==================== 数据通知 ====================
  function notifyUpdate() {
    // Canvas→Table 同步：重建表格（处理行数变化和值更新）
    buildTable();
    if (typeof onCurveUpdate === 'function') {
      onCurveUpdate(CurveEditor.getUpdatedArrays());
    }
  }

  // 全局回调，由app.js设置
  window.onCurveUpdate = null;

  // 全局暴露
  window.CurveEditor = CurveEditor;
})();
