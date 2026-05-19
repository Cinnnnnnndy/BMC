/**
 * 能效调速配置编辑器 - 主应用逻辑
 * YAML↔表单双向绑定、CSR生成、文件加载/保存
 */
(function() {
  'use strict';

  let configData = {}; // 当前配置的JavaScript对象

  // ==================== 快速启动模板 ====================
  var TEMPLATE_STANDARD_1U = `slot_id: 1
cooling_config:
  smart_cooling_state: Enabled
  smart_cooling_mode: EnergySaving
  init_level_in_startup: 100
  fan_board_num: 1
  level_percent_range: [10, 100]
  minimal_level: 10
  max_limi_level: 100
  pid_control_mode: 1
  disk_row_temperature_available: false
  sensor_location_supported: false
  min_allowed_fan_speed_enabled: false
  mixed_mode_supported: false
cooling_requirements:
  - id: 1
    requirement_id: "\${Slot}_CpuTemp"
    description: CPU温度
    temperature_type: Cpu
    monitoring_status: "<=/Scanner_Cpu1.Status"
    monitoring_value: "<=/Scanner_Cpu1.Value"
    failed_value: 80
    target_temperature_celsius: 65
    max_allowed_temperature_celsius: 85
    smart_cooling_target_temperature: [62, 68, 60]
    enabled: "true"
    active_in_standby: false
cooling_policies:
  - policy_idx: 1
    description: 节能策略
    exp_cond_val: EnergySaving
    actual_cond_val: "<=/CoolingConfig_1.SmartCoolingMode"
    hysteresis: 1
    temperature_range_low: [-127, 25, 50, 75]
    temperature_range_high: [25, 50, 75, 127]
    speed_range_low: [10, 30, 60, 100]
    speed_range_high: [30, 60, 100, 100]
cooling_areas:
  - area_id: 1
    requirement_idx: 1
    policy_idx_group: [1]
    fan_idx_group: [1, 2]
    priority: 1
    description: 主调速区域
cooling_fans:
  - fan_id: 1
    slot: 1
    front_presence: "<=/Fan_1.FrontPresence"
    rear_presence: "<=/Fan_1.RearPresence"
    front_status: "<=/Fan_1.FrontStatus"
    rear_status: "<=/Fan_1.RearStatus"
    hardware_pwm: "#/Accessor_Fan1_PWM.Value"
    max_supported_pwm: 255
    description: 风扇1
  - fan_id: 2
    slot: 2
    front_presence: "<=/Fan_2.FrontPresence"
    rear_presence: "<=/Fan_2.RearPresence"
    front_status: "<=/Fan_2.FrontStatus"
    rear_status: "<=/Fan_2.RearStatus"
    hardware_pwm: "#/Accessor_Fan2_PWM.Value"
    max_supported_pwm: 255
    description: 风扇2
`;

  var TEMPLATE_DUAL_2U = `slot_id: 1
cooling_config:
  smart_cooling_state: Enabled
  smart_cooling_mode: EnergySaving
  init_level_in_startup: 100
  fan_board_num: 2
  level_percent_range: [10, 100]
  minimal_level: 10
  max_limi_level: 100
  pid_control_mode: 2
  disk_row_temperature_available: true
  sensor_location_supported: true
  min_allowed_fan_speed_enabled: true
  mixed_mode_supported: false
cooling_requirements:
  - id: 1
    requirement_id: "\${Slot}_CpuTemp1"
    description: CPU1温度
    temperature_type: Cpu
    monitoring_status: "<=/Scanner_Cpu1.Status"
    monitoring_value: "<=/Scanner_Cpu1.Value"
    failed_value: 90
    target_temperature_celsius: 65
    max_allowed_temperature_celsius: 90
    smart_cooling_target_temperature: [60, 68, 58]
    enabled: "true"
    active_in_standby: false
  - id: 2
    requirement_id: "\${Slot}_CpuTemp2"
    description: CPU2温度
    temperature_type: Cpu
    monitoring_status: "<=/Scanner_Cpu2.Status"
    monitoring_value: "<=/Scanner_Cpu2.Value"
    failed_value: 90
    target_temperature_celsius: 65
    max_allowed_temperature_celsius: 90
    smart_cooling_target_temperature: [60, 68, 58]
    enabled: "true"
    active_in_standby: false
cooling_policies:
  - policy_idx: 1
    description: 节能策略
    exp_cond_val: EnergySaving
    actual_cond_val: "<=/CoolingConfig_1.SmartCoolingMode"
    hysteresis: 1
    temperature_range_low: [-127, 20, 45, 65]
    temperature_range_high: [20, 45, 65, 127]
    speed_range_low: [10, 25, 55, 100]
    speed_range_high: [25, 55, 100, 100]
  - policy_idx: 2
    description: 高性能策略
    exp_cond_val: HighPerformance
    actual_cond_val: "<=/CoolingConfig_1.SmartCoolingMode"
    hysteresis: 1
    temperature_range_low: [-127, 15, 35, 55]
    temperature_range_high: [15, 35, 55, 127]
    speed_range_low: [30, 50, 75, 100]
    speed_range_high: [50, 75, 100, 100]
cooling_areas:
  - area_id: 1
    requirement_idx: 1
    policy_idx_group: [1, 2]
    fan_idx_group: [1, 2, 3, 4]
    priority: 1
    description: CPU1调速区域
  - area_id: 2
    requirement_idx: 2
    policy_idx_group: [1, 2]
    fan_idx_group: [1, 2, 3, 4]
    priority: 2
    description: CPU2调速区域
cooling_fans:
  - fan_id: 1
    slot: 1
    front_presence: "<=/Fan_1.FrontPresence"
    rear_presence: "<=/Fan_1.RearPresence"
    front_status: "<=/Fan_1.FrontStatus"
    rear_status: "<=/Fan_1.RearStatus"
    hardware_pwm: "#/Accessor_Fan1_PWM.Value"
    max_supported_pwm: 255
    description: 风扇1
  - fan_id: 2
    slot: 2
    front_presence: "<=/Fan_2.FrontPresence"
    rear_presence: "<=/Fan_2.RearPresence"
    front_status: "<=/Fan_2.FrontStatus"
    rear_status: "<=/Fan_2.RearStatus"
    hardware_pwm: "#/Accessor_Fan2_PWM.Value"
    max_supported_pwm: 255
    description: 风扇2
  - fan_id: 3
    slot: 3
    front_presence: "<=/Fan_3.FrontPresence"
    rear_presence: "<=/Fan_3.RearPresence"
    front_status: "<=/Fan_3.FrontStatus"
    rear_status: "<=/Fan_3.RearStatus"
    hardware_pwm: "#/Accessor_Fan3_PWM.Value"
    max_supported_pwm: 255
    description: 风扇3
  - fan_id: 4
    slot: 4
    front_presence: "<=/Fan_4.FrontPresence"
    rear_presence: "<=/Fan_4.RearPresence"
    front_status: "<=/Fan_4.FrontStatus"
    rear_status: "<=/Fan_4.RearStatus"
    hardware_pwm: "#/Accessor_Fan4_PWM.Value"
    max_supported_pwm: 255
    description: 风扇4
`;

  // ==================== 候选列表工具函数 ====================

  // 生成候选列表 [{id, label}]
  function getCandidateList(entityType, excludeId) {
    var list = [];
    if (entityType === 'cooling_requirements') {
      var reqs = configData.cooling_requirements || [];
      for (var i = 0; i < reqs.length; i++) {
        var r = reqs[i];
        if (excludeId != null && r.id === excludeId) continue;
        list.push({ id: r.id, label: (r.id || '') + ' - ' + (r.description || '') });
      }
    } else if (entityType === 'cooling_policies') {
      var policies = configData.cooling_policies || [];
      for (var i = 0; i < policies.length; i++) {
        var p = policies[i];
        list.push({ id: p.policy_idx, label: (p.policy_idx || '') + ' - ' + (p.description || '') });
      }
    } else if (entityType === 'fan_types') {
      var fts = configData.fan_types || [];
      for (var i = 0; i < fts.length; i++) {
        var ft = fts[i];
        var displayName = ft.name || ('(未命名 #' + (ft.index != null ? ft.index : i) + ')');
        list.push({ id: ft.name || '', label: displayName + ' - ' + (ft.description || '') });
      }
    }
    return list;
  }

  // 渲染单选下拉框 HTML
  function renderSelect(candidates, selectedValue, fieldName) {
    var html = '<select data-field="' + fieldName + '">';
    html += '<option value="">-- 选择 --</option>';
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      var sel = (selectedValue != null && String(selectedValue) === String(c.id)) ? ' selected' : '';
      html += '<option value="' + c.id + '"' + sel + '>' + escHtml(c.label) + '</option>';
    }
    html += '</select>';
    return html;
  }

  // 渲染多选 Checkbox 下拉菜单 HTML
  function renderCheckboxDropdown(candidates, selectedValues, fieldName) {
    selectedValues = selectedValues || [];
    // 收集已选项的 label
    var selectedLabels = [];
    for (var i = 0; i < selectedValues.length; i++) {
      for (var j = 0; j < candidates.length; j++) {
        if (String(selectedValues[i]) === String(candidates[j].id)) {
          selectedLabels.push(candidates[j].label);
          break;
        }
      }
    }
    var toggleText = selectedLabels.length > 0 ? selectedLabels.join(', ') : '-- 请选择 --';
    var html = '<div class="multi-select-dropdown" data-field="' + fieldName + '">';
    html += '<div class="msd-toggle"><span>' + escHtml(toggleText) + '</span><span class="msd-arrow">&#9660;</span></div>';
    html += '<div class="msd-panel">';
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      var checked = '';
      for (var k = 0; k < selectedValues.length; k++) {
        if (String(selectedValues[k]) === String(c.id)) { checked = ' checked'; break; }
      }
      html += '<label><input type="checkbox" value="' + escHtml(String(c.id)) + '"' + checked + '> ' + escHtml(c.label) + '</label>';
    }
    html += '</div></div>';
    return html;
  }

  // HTML 转义
  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ==================== 初始化 ====================
  document.addEventListener('DOMContentLoaded', () => {
    bindToolbar();
    bindYamlEditor();
    bindOutputTabs();
    loadDefaultYaml();
  });

  // 加载默认YAML
  async function loadDefaultYaml() {
    try {
      const resp = await fetch('../sample-cooling.yaml');
      if (resp.ok) {
        const text = await resp.text();
        document.getElementById('yaml-editor').value = text;
        loadYaml(text);
      }
    } catch(e) {
      // 非HTTP环境忽略
    }
  }

  // ==================== 工具栏绑定 ====================
  function bindToolbar() {
    document.getElementById('btn-load').addEventListener('click', () => document.getElementById('file-input').click());
    document.getElementById('file-input').addEventListener('change', handleFileLoad);
    document.getElementById('btn-save').addEventListener('click', handleSave);
    document.getElementById('btn-generate').addEventListener('click', handleGenerate);
    document.getElementById('btn-close-errors').addEventListener('click', () => {
      document.getElementById('validation-errors').style.display = 'none';
    });
    document.getElementById('btn-close-output').addEventListener('click', () => {
      document.getElementById('output-panel').style.display = 'none';
    });

    // 模板下拉菜单
    var btnTemplate = document.getElementById('btn-template');
    var templateMenu = document.getElementById('template-menu');
    if (btnTemplate && templateMenu) {
      btnTemplate.addEventListener('click', function(e) {
        e.stopPropagation();
        templateMenu.style.display = templateMenu.style.display === 'none' ? 'block' : 'none';
      });
      templateMenu.querySelectorAll('.template-item').forEach(function(item) {
        item.addEventListener('click', function() {
          var tpl = item.dataset.template;
          var yamlStr = tpl === 'standard1u' ? TEMPLATE_STANDARD_1U : TEMPLATE_DUAL_2U;
          document.getElementById('yaml-editor').value = yamlStr;
          loadYaml(yamlStr);
          templateMenu.style.display = 'none';
        });
      });
      document.addEventListener('click', function() {
        templateMenu.style.display = 'none';
      });
    }

    // 添加实体按钮
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', () => addEntity(btn.dataset.entity));
    });
  }

  // ==================== YAML编辑器绑定 ====================
  function bindYamlEditor() {
    const editor = document.getElementById('yaml-editor');
    let timer;
    editor.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadYaml(editor.value), 500);
    });
  }

  // ==================== YAML → 表单 ====================
  function loadYaml(text) {
    try {
      configData = jsyaml.load(text) || {};
    } catch(e) {
      return; // YAML解析错误时保留当前表单状态
    }
    renderForm(configData);
  }

  function renderForm(config) {
    // 全局配置
    setInputValue('f-slot-id', config.slot_id || 1);
    if (config.cooling_config) {
      const cc = config.cooling_config;
      setInputValue('f-smart-cooling-state', cc.smart_cooling_state);
      setInputValue('f-smart-cooling-mode', cc.smart_cooling_mode);
      setInputValue('f-init-level', cc.init_level_in_startup);
      setInputValue('f-fan-board-num', cc.fan_board_num);
      if (cc.level_percent_range) {
        document.getElementById('f-level-percent-range').value = cc.level_percent_range.join(', ');
      }
      // 新增 CoolingConfig 属性
      setInputValue('f-disk-row-temp-avail', cc.disk_row_temperature_available != null ? String(cc.disk_row_temperature_available) : 'false');
      setInputValue('f-sys-hdds-max-temp', cc.sys_hdds_max_temperature);
      setInputValue('f-sys-ssds-max-temp', cc.sys_ssds_max_temperature);
      setInputValue('f-sensor-location-supported', cc.sensor_location_supported != null ? String(cc.sensor_location_supported) : 'false');
      setInputValue('f-minimal-level', cc.minimal_level);
      setInputValue('f-max-limi-level', cc.max_limi_level);
      setInputValue('f-pid-control-mode', cc.pid_control_mode);
      setInputValue('f-sys-m2s-max-temp', cc.sys_m2s_max_temperature);
      setInputValue('f-sys-all-ssds-max-temp', cc.sys_all_ssds_max_temperature);
      setInputValue('f-min-allowed-fan-speed', cc.min_allowed_fan_speed_percent);
      setInputValue('f-min-allowed-fan-speed-enabled', cc.min_allowed_fan_speed_enabled != null ? String(cc.min_allowed_fan_speed_enabled) : 'false');
      setInputValue('f-mixed-mode-supported', cc.mixed_mode_supported != null ? String(cc.mixed_mode_supported) : 'false');
    }

    // 实体列表
    renderEntityList('cooling_requirements', 'requirements-list', renderRequirement);
    renderEntityList('cooling_policies', 'policies-list', renderPolicy);
    renderEntityList('cooling_areas', 'areas-list', renderArea);
    renderEntityList('abnormal_fans', 'abnormal-fans-list', renderAbnormalFan);
    renderEntityList('fan_types', 'fan-types-list', renderFanType);
    renderEntityList('cooling_fans', 'cooling-fans-list', renderCoolingFan);

    // 风扇组
    if (config.basic_cooling_config) {
      setInputValue('f-fan-group-diff', config.basic_cooling_config.fan_group_speed_diff_threshold_percent);
      setInputValue('f-psu-calibration', config.basic_cooling_config.psu_fan_speed_calibration);
      renderEntityList(null, 'fan-groups-list', renderFanGroup, config.basic_cooling_config.fan_groups);
    }

    // 风冷散热配置
    if (config.air_cooling_config) {
      const ac = config.air_cooling_config;
      if (ac.speed_percent_range) {
        document.getElementById('f-speed-percent-range').value = ac.speed_percent_range.join(', ');
      }
      setInputValue('f-initial-speed-percent', ac.initial_speed_percent);
      setInputValue('f-max-allowed-speed-percent', ac.max_allowed_speed_percent);
      setInputValue('f-min-allowed-speed-percent', ac.min_allowed_speed_percent);
    }

    // 更新大纲导航计数
    updateOutlineNav();
  }

  // ==================== 大纲导航 ====================
  function updateOutlineNav() {
    function setCount(id, n) {
      var el = document.getElementById(id);
      if (el) el.textContent = n;
    }
    setCount('count-requirements', (configData.cooling_requirements || []).length);
    setCount('count-policies', (configData.cooling_policies || []).length);
    setCount('count-areas', (configData.cooling_areas || []).length);
    setCount('count-abnormal-fans', (configData.abnormal_fans || []).length);
    setCount('count-fan-types', (configData.fan_types || []).length);
    setCount('count-cooling-fans', (configData.cooling_fans || []).length);
    var fanGroups = (configData.basic_cooling_config && configData.basic_cooling_config.fan_groups) ? configData.basic_cooling_config.fan_groups : [];
    setCount('count-fan-groups', fanGroups.length);
  }

  // 大纲导航点击跳转
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.outline-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        // 如果目标是列表容器，滚动到其父 fieldset
        var scrollTarget = target.closest ? target.closest('fieldset') || target : target;
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // 大纲导航滚动高亮（scroll spy）
    initOutlineScrollSpy();
  });

  function initOutlineScrollSpy() {
    var formPanel = document.querySelector('.form-panel');
    if (!formPanel) return;

    // 大纲项 → 对应 fieldset 映射
    var sections = [
      { linkId: null,                    selector: '#config-section' },
      { linkId: 'outline-requirements',  selector: '#requirements-list' },
      { linkId: 'outline-policies',      selector: '#policies-list' },
      { linkId: 'outline-areas',         selector: '#areas-list' },
      { linkId: 'outline-abnormal-fans', selector: '#abnormal-fans-list' },
      { linkId: 'outline-fan-types',     selector: '#fan-types-list' },
      { linkId: 'outline-cooling-fans',  selector: '#cooling-fans-list' },
      { linkId: 'outline-fan-groups',    selector: '#fan-groups-list' },
    ];

    function getFieldset(selector) {
      var el = document.querySelector(selector);
      if (!el) return null;
      return el.closest('fieldset') || el;
    }

    function updateActiveLink() {
      var panelTop = formPanel.getBoundingClientRect().top;
      var activeIdx = 0;
      sections.forEach(function(sec, i) {
        var fs = getFieldset(sec.selector);
        if (!fs) return;
        var rect = fs.getBoundingClientRect();
        // Section is considered active when its top is at or above the middle of the panel
        if (rect.top - panelTop <= formPanel.clientHeight / 2) {
          activeIdx = i;
        }
      });

      // Remove active from all links
      document.querySelectorAll('.outline-link').forEach(function(l) {
        l.classList.remove('active');
      });

      // Set active on matched link
      var activeSection = sections[activeIdx];
      if (activeSection.linkId) {
        var activeLink = document.getElementById(activeSection.linkId);
        if (activeLink) activeLink.classList.add('active');
      } else {
        // First item (全局配置) — match by href
        var firstLink = document.querySelector('.outline-link[href="#config-section"]');
        if (firstLink) firstLink.classList.add('active');
      }
    }

    formPanel.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.value = val;
  }

  // 渲染实体列表
  function renderEntityList(key, containerId, renderFn, externalList) {
    const container = document.getElementById(containerId);
    const list = externalList || (key ? (configData[key] || []) : []);
    container.innerHTML = '';
    list.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'entity-item';
      div._sourceData = JSON.parse(JSON.stringify(item)); // 深拷贝，用于表单收集时合并保留未渲染字段
      div.innerHTML = renderFn(item, idx, key);
      container.appendChild(div);
    });
    // 绑定删除按钮
    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => removeEntity(btn.dataset.key, parseInt(btn.dataset.idx)));
    });
    // 绑定曲线选择
    container.querySelectorAll('.btn-edit-curve').forEach(btn => {
      btn.addEventListener('click', () => showCurveEditor(parseInt(btn.dataset.idx)));
    });
  }

  // CoolingRequirement渲染
  function renderRequirement(req, idx, key) {
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">温度点 #${req.id} - ${req.description || ''}</span>
        <div>
          <button class="btn-edit-curve" data-idx="${idx}" style="display:none">曲线</button>
          <button class="btn-remove" data-key="${key}" data-idx="${idx}">删除</button>
        </div>
      </div>
      <div class="form-grid">
        <label>ID <input type="number" value="${req.id||''}" data-entity-id="${req.id}" data-field="id" min="0"></label>
        <label>RequirementId <input type="text" value="${req.requirement_id||''}" data-entity-id="${req.id}" data-field="requirement_id" placeholder="全局唯一ID，支持\${Slot}语法"></label>
        <label>说明 <input type="text" value="${req.description||''}" data-entity-id="${req.id}" data-field="description"></label>
        <label>温度类型
          <select data-entity-id="${req.id}" data-field="temperature_type">
            <option value="">-- 选择 --</option>
            ${temperatureTypeOptions(req.temperature_type)}
          </select>
        </label>
        <label>温度状态(CSR同步) <input type="text" value="${req.monitoring_status||''}" data-entity-id="${req.id}" data-field="monitoring_status" placeholder="<=/Scanner_Xxx.Status"></label>
        <label>温度值(CSR同步) <input type="text" value="${req.monitoring_value||''}" data-entity-id="${req.id}" data-field="monitoring_value" placeholder="<=/Scanner_Xxx.Value"></label>
        <label>异常调速转速(%) <input type="number" value="${req.failed_value!=null?req.failed_value:''}" data-entity-id="${req.id}" data-field="failed_value" min="0" max="100"></label>
        <label>备用温度点ID ${renderSelect(getCandidateList('cooling_requirements', req.id), req.backup_requirement_idx, 'backup_requirement_idx')}</label>
        <label>目标温度(℃) <input type="number" value="${req.target_temperature_celsius!=null?req.target_temperature_celsius:''}" data-entity-id="${req.id}" data-field="target_temperature_celsius"></label>
        <label>满转门限(℃) <input type="number" value="${req.max_allowed_temperature_celsius!=null?req.max_allowed_temperature_celsius:''}" data-entity-id="${req.id}" data-field="max_allowed_temperature_celsius"></label>
        <label>三模式目标温度[节能,高性能,低噪] <input type="text" value="${req.smart_cooling_target_temperature?req.smart_cooling_target_temperature.join(', '):''}" data-entity-id="${req.id}" data-field="smart_cooling_target_temperature"></label>
        <label>传感器名称(CSR引用) <input type="text" value="${req.sensor_name||''}" data-entity-id="${req.id}" data-field="sensor_name" placeholder="#/Sensor.SensorName"></label>
        <label>支持自定义调速
          <select data-entity-id="${req.id}" data-field="custom_supported">
            <option value="false" ${!req.custom_supported?'selected':''}>否</option>
            <option value="true" ${req.custom_supported?'selected':''}>是</option>
          </select>
        </label>
        <label>自定义目标温度(℃) <input type="number" value="${req.custom_target_temperature_celsius!=null?req.custom_target_temperature_celsius:''}" data-entity-id="${req.id}" data-field="custom_target_temperature_celsius"></label>
        <label>自定义温度范围[最小,最大] <input type="text" value="${req.target_temperature_range_celsius?req.target_temperature_range_celsius.join(', '):''}" data-entity-id="${req.id}" data-field="target_temperature_range_celsius" placeholder="如: 45, 60"></label>
        <label>使能(CSR语法) <input type="text" value="${req.enabled||''}" data-entity-id="${req.id}" data-field="enabled" placeholder="true/false 或 CSR语法字符串"></label>
        <label>Standby调速
          <select data-entity-id="${req.id}" data-field="active_in_standby">
            <option value="false" ${!req.active_in_standby?'selected':''}>否</option>
            <option value="true" ${req.active_in_standby?'selected':''}>是</option>
          </select>
        </label>
        <label>冷却介质 <input type="text" value="${req.cooling_medium||''}" data-entity-id="${req.id}" data-field="cooling_medium" placeholder="Liquid 表示液冷"></label>
      </div>`;
  }

  function temperatureTypeOptions(selected) {
    const types = ['Cpu','Outlet','Disk','Memory','PCH','VRD','VDDQ','NPUHb','NPUAiCore','NPUBoard','Inlet','SoCBoardOutlet','SoCBoardInlet','InvalidType'];
    return types.map(t => `<option value="${t}" ${t===selected?'selected':''}>${t}</option>`).join('');
  }

  // ==================== 迷你曲线预览 ====================
  function buildMiniCurveSvg(policy, idx) {
    var W = 120, H = 48;
    var tempLow = policy.temperature_range_low;
    var speedLow = policy.speed_range_low;
    var svgAttr = 'class="mini-curve-svg" data-policy-idx="' + idx + '" width="' + W + '" height="' + H + '" xmlns="http://www.w3.org/2000/svg" style="background:#1a1a2e;border-radius:3px;"';

    if (!tempLow || !Array.isArray(tempLow) || tempLow.length < 2 || !speedLow || !Array.isArray(speedLow) || speedLow.length < 2) {
      return '<svg ' + svgAttr + '><text x="' + (W/2) + '" y="' + (H/2+5) + '" text-anchor="middle" fill="#666" font-size="11">无曲线</text></svg>';
    }

    var TEMP_MIN = -127, TEMP_MAX = 127;
    var SPEED_MIN = 0, SPEED_MAX = 100;
    var padX = 4, padY = 4;
    var w = W - padX * 2, h = H - padY * 2;

    var points = [];
    var len = Math.min(tempLow.length, speedLow.length);
    for (var i = 0; i < len; i++) {
      var t = tempLow[i];
      var s = speedLow[i];
      if (typeof t !== 'number' || typeof s !== 'number') continue;
      var x = padX + ((t - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)) * w;
      var y = padY + (1 - (s - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * h;
      points.push(x.toFixed(1) + ',' + y.toFixed(1));
    }

    if (points.length < 2) {
      return '<svg ' + svgAttr + '><text x="' + (W/2) + '" y="' + (H/2+5) + '" text-anchor="middle" fill="#666" font-size="11">无曲线</text></svg>';
    }

    var polyline = '<polyline points="' + points.join(' ') + '" fill="none" stroke="#4361ee" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>';
    // Draw axis lines faintly
    var axisY = (padY + h).toFixed(1);
    var axis = '<line x1="' + padX + '" y1="' + axisY + '" x2="' + (padX + w) + '" y2="' + axisY + '" stroke="#333" stroke-width="0.5"/>';
    return '<svg ' + svgAttr + '>' + axis + polyline + '</svg>';
  }

  function renderMiniCurve(policyIdx) {
    var svgEl = document.querySelector('[data-policy-idx="' + policyIdx + '"].mini-curve-svg');
    if (!svgEl) return;
    var policies = configData.cooling_policies || [];
    var policy = policies[policyIdx];
    if (!policy) return;
    var tmp = document.createElement('div');
    tmp.innerHTML = buildMiniCurveSvg(policy, policyIdx);
    var newSvg = tmp.firstChild;
    if (newSvg) svgEl.parentNode.replaceChild(newSvg, svgEl);
  }

  // CoolingPolicy渲染
  function renderPolicy(policy, idx, key) {
    var miniSvg = buildMiniCurveSvg(policy, idx);
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">策略 #${policy.policy_idx} - ${policy.description || ''}</span>
        <div style="display:flex;align-items:center;gap:8px;">
          ${miniSvg}
          <button class="btn-edit-curve" data-idx="${idx}">编辑曲线</button>
          <button class="btn-remove" data-key="${key}" data-idx="${idx}">删除</button>
        </div>
      </div>
      <div class="form-grid">
        <label>策略ID <input type="number" value="${policy.policy_idx||''}" data-entity-id="${policy.policy_idx}" data-field="policy_idx" min="0"></label>
        <label>说明 <input type="text" value="${policy.description||''}" data-entity-id="${policy.policy_idx}" data-field="description"></label>
        <label>预期条件
          <select data-entity-id="${policy.policy_idx}" data-field="exp_cond_val">
            ${['EnergySaving','LowNoise','HighPerformance','Custom','LiquidCooling'].map(m => `<option value="${m}" ${m===policy.exp_cond_val?'selected':''}>${m}</option>`).join('')}
          </select>
        </label>
        <label>实际条件(CSR同步) <input type="text" value="${policy.actual_cond_val||''}" data-entity-id="${policy.policy_idx}" data-field="actual_cond_val" placeholder="<=/CoolingConfig_1.SmartCoolingMode"></label>
        <label>迟滞量 <input type="number" value="${policy.hysteresis||0}" data-entity-id="${policy.policy_idx}" data-field="hysteresis"></label>
        <label>策略类型
          <select data-entity-id="${policy.policy_idx}" data-field="policy_type">
            <option value="">-- 默认 --</option>
            <option value="InletCustom" ${policy.policy_type==='InletCustom'?'selected':''}>InletCustom</option>
            <option value="DiskCustom" ${policy.policy_type==='DiskCustom'?'selected':''}>DiskCustom</option>
          </select>
        </label>
        <label>PCIe卡名称(逗号分隔) <input type="text" value="${(policy.pcie_card_name||[]).join(', ')}" data-entity-id="${policy.policy_idx}" data-field="pcie_card_name" placeholder="如: NpuHbmCard"></label>
        <label>硬盘背板名称(逗号分隔) <input type="text" value="${(policy.hdd_backplane_name||[]).join(', ')}" data-entity-id="${policy.policy_idx}" data-field="hdd_backplane_name"></label>
        <label>后置硬盘背板名称(逗号分隔) <input type="text" value="${(policy.hdd_rear_backplane_name||[]).join(', ')}" data-entity-id="${policy.policy_idx}" data-field="hdd_rear_backplane_name"></label>
        <label>风扇类型 ${renderCheckboxDropdown(getCandidateList('fan_types'), policy.fan_type, 'fan_type')}</label>
        <label>冷却介质 <input type="text" value="${policy.cooling_medium||''}" data-entity-id="${policy.policy_idx}" data-field="cooling_medium" placeholder="Liquid 表示液冷"></label>
        <label>支持自定义调速
          <select data-entity-id="${policy.policy_idx}" data-field="custom_supported">
            <option value="false" ${!policy.custom_supported?'selected':''}>否</option>
            <option value="true" ${policy.custom_supported?'selected':''}>是</option>
          </select>
        </label>
        <label>硬盘温度失效时生效
          <select data-entity-id="${policy.policy_idx}" data-field="disk_temp_unavailable_to_valid">
            <option value="false" ${!policy.disk_temp_unavailable_to_valid?'selected':''}>否</option>
            <option value="true" ${policy.disk_temp_unavailable_to_valid?'selected':''}>是</option>
          </select>
        </label>
      </div>`;
  }

  // CoolingArea渲染
  function renderArea(area, idx, key) {
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">区域 #${area.area_id} - ${area.description || ''}</span>
        <button class="btn-remove" data-key="${key}" data-idx="${idx}">删除</button>
      </div>
      <div class="form-grid">
        <label>区域ID <input type="number" value="${area.area_id||''}" data-entity-id="${area.area_id}" data-field="area_id" min="0"></label>
        <label>关联温度点ID ${renderSelect(getCandidateList('cooling_requirements'), area.requirement_idx, 'requirement_idx')}</label>
        <label>关联策略ID列表 ${renderCheckboxDropdown(getCandidateList('cooling_policies'), area.policy_idx_group, 'policy_idx_group')}</label>
        <label>风扇ID列表(从小到大) <input type="text" value="${(area.fan_idx_group||[]).join(', ')}" data-entity-id="${area.area_id}" data-field="fan_idx_group" placeholder="逗号分隔，如: 1, 2, 3, 4"></label>
        <label>优先级 <input type="number" value="${area.priority||1}" data-entity-id="${area.area_id}" data-field="priority" min="1"></label>
        <label>说明 <input type="text" value="${area.description||''}" data-entity-id="${area.area_id}" data-field="description"></label>
        <label>液冷设备ID列表(逗号分隔) <input type="text" value="${(area.liquid_cooling_device_group||[]).join(', ')}" data-entity-id="${area.area_id}" data-field="liquid_cooling_device_group" placeholder="逗号分隔"></label>
      </div>`;
  }

  // AbnormalFan渲染
  function renderAbnormalFan(fan, idx, key) {
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">异常风扇 #${fan.id}</span>
        <button class="btn-remove" data-key="${key}" data-idx="${idx}">删除</button>
      </div>
      <div class="form-grid">
        <label>ID <input type="number" value="${fan.id||''}" data-field="id" min="0"></label>
        <label>关联风扇索引 <input type="number" value="${fan.fan_idx||''}" data-field="fan_idx"></label>
        <label>异常状态
          <select data-field="status">
            <option value="AbnormalRotation" ${fan.status==='AbnormalRotation'?'selected':''}>AbnormalRotation (转速异常)</option>
            <option value="NotInPosition" ${fan.status==='NotInPosition'?'selected':''}>NotInPosition (不在位)</option>
          </select>
        </label>
        <label>参与风扇ID列表 <input type="text" value="${(fan.fan_group||[]).join(', ')}" data-field="fan_group"></label>
        <label>目标转速(%) <input type="number" value="${fan.speed_percentage||80}" data-field="speed_percentage" min="0" max="100"></label>
        <label>说明 <input type="text" value="${fan.description||''}" data-field="description"></label>
        <label>优先级 <input type="number" value="${fan.priority||1}" data-field="priority" min="1"></label>
      </div>`;
  }

  // FanType渲染
  function renderFanType(ft, idx, key) {
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">风扇类型 #${ft.index} - ${ft.name || ''}</span>
        <button class="btn-remove" data-key="${key}" data-idx="${idx}">删除</button>
      </div>
      <div class="form-grid">
        <label>型号名称 <input type="text" value="${ft.name||''}" data-field="name" placeholder="如: 02314BLG 8038+"></label>
        <label>说明 <input type="text" value="${ft.description||''}" data-field="description"></label>
        <label>BOM编码 <input type="text" value="${ft.bom||''}" data-field="bom" placeholder="如: BOM32030275"></label>
        <label>部件编码 <input type="text" value="${ft.part_number||''}" data-field="part_number"></label>
        <label>型号索引 <input type="number" value="${ft.index||''}" data-field="index" min="0" max="255"></label>
        <label>系统ID <input type="number" value="${ft.system_id!=null?ft.system_id:''}" data-field="system_id" min="0" max="255"></label>
        <label>前转子最大转速 <input type="number" value="${ft.front_max_speed||''}" data-field="front_max_speed" min="0"></label>
        <label>后转子最大转速 <input type="number" value="${ft.rear_max_speed||''}" data-field="rear_max_speed" min="0"></label>
        <label>双转子
          <select data-field="is_twins">
            <option value="false" ${!ft.is_twins?'selected':''}>否</option>
            <option value="true" ${ft.is_twins?'selected':''}>是</option>
          </select>
        </label>
        <label>识别转速左区间 <input type="number" value="${ft.identify_range_low||''}" data-field="identify_range_low" min="0"></label>
        <label>识别转速右区间 <input type="number" value="${ft.identify_range_high||''}" data-field="identify_range_high" min="0"></label>
        <label>风扇直径(mm) <input type="number" value="${ft.fan_diameter_mm||''}" data-field="fan_diameter_mm" min="0"></label>
        <label>型号代号(CSR命名用) <input type="text" value="${ft.model_code||''}" data-field="model_code" placeholder="如: 8080P, 用于CSR对象命名 FanType_{代号}"></label>
      </div>`;
  }

  // CoolingFan渲染
  function renderCoolingFan(fan, idx, key) {
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">调速风扇 #${fan.fan_id} - ${fan.description || ''}</span>
        <button class="btn-remove" data-key="${key}" data-idx="${idx}">删除</button>
      </div>
      <div class="form-grid">
        <label>风扇ID (FanId) <input type="number" value="${fan.fan_id||''}" data-field="fan_id" min="0"></label>
        <label>槽位号 (Slot) <input type="number" value="${fan.slot||''}" data-field="slot" min="0"></label>
        <label>前转子在位(CSR同步) <input type="text" value="${fan.front_presence||''}" data-field="front_presence" placeholder="<=/Fan_1.FrontPresence"></label>
        <label>后转子在位(CSR同步) <input type="text" value="${fan.rear_presence||''}" data-field="rear_presence" placeholder="<=/Fan_1.RearPresence"></label>
        <label>前转子状态(CSR同步) <input type="text" value="${fan.front_status||''}" data-field="front_status" placeholder="<=/Fan_1.FrontStatus"></label>
        <label>后转子状态(CSR同步) <input type="text" value="${fan.rear_status||''}" data-field="rear_status" placeholder="<=/Fan_1.RearStatus"></label>
        <label>硬件PWM(CSR引用) <input type="text" value="${fan.hardware_pwm||''}" data-field="hardware_pwm" placeholder="#/Accessor_Fan1_PWM.Value"></label>
        <label>最大支持转速 <input type="number" value="${fan.max_supported_pwm||''}" data-field="max_supported_pwm" min="0"></label>
        <label>说明 <input type="text" value="${fan.description||''}" data-field="description"></label>
      </div>`;
  }

  // FanGroup渲染
  function renderFanGroup(fg, idx) {
    return `
      <div class="entity-item-header">
        <span class="entity-item-title">风扇组 #${fg.id}</span>
        <button class="btn-remove" data-key="basic_cooling_config.fan_groups" data-idx="${idx}">删除</button>
      </div>
      <div class="form-grid">
        <label>组ID <input type="number" value="${fg.id||''}" data-field="id" min="0"></label>
        <label>风扇ID列表 <input type="text" value="${(fg.fan_slots||[]).join(', ')}" data-field="fan_slots"></label>
      </div>`;
  }

  // ==================== 表单 → YAML ====================
  function collectFormData() {
    const config = { slot_id: parseInt(document.getElementById('f-slot-id').value) || 1 };
    config.cooling_config = collectSectionConfig();
    config.cooling_requirements = collectListItems('requirements-list');
    config.cooling_policies = collectListItems('policies-list');
    config.cooling_areas = collectListItems('areas-list');
    config.abnormal_fans = collectListItems('abnormal-fans-list');
    config.fan_types = collectListItems('fan-types-list');
    config.cooling_fans = collectListItems('cooling-fans-list');
    config.basic_cooling_config = collectBasicCoolingConfig();
    config.air_cooling_config = collectAirCoolingConfig();
    return config;
  }

  function collectSectionConfig() {
    const cc = {};
    const smartState = document.getElementById('f-smart-cooling-state').value;
    const smartMode = document.getElementById('f-smart-cooling-mode').value;
    const initLevel = document.getElementById('f-init-level').value;
    const fanBoardNum = document.getElementById('f-fan-board-num').value;
    const rangeStr = document.getElementById('f-level-percent-range').value.trim();
    cc.smart_cooling_state = smartState;
    cc.smart_cooling_mode = smartMode;
    if (initLevel !== '') {
      const v = parseInt(initLevel);
      if (!isNaN(v)) cc.init_level_in_startup = v;
    }
    if (fanBoardNum !== '') {
      const v = parseInt(fanBoardNum);
      if (!isNaN(v)) cc.fan_board_num = v;
    }
    if (rangeStr) {
      const parsed = rangeStr.split(',').map(s => parseInt(s.trim()));
      if (parsed.every(n => !isNaN(n)) && parsed.length === 2) {
        cc.level_percent_range = parsed;
      }
    }
    // 新增 CoolingConfig 属性
    const diskRowTempAvail = document.getElementById('f-disk-row-temp-avail');
    if (diskRowTempAvail) cc.disk_row_temperature_available = diskRowTempAvail.value === 'true';
    const sysHddsMaxTemp = document.getElementById('f-sys-hdds-max-temp');
    if (sysHddsMaxTemp && sysHddsMaxTemp.value !== '') cc.sys_hdds_max_temperature = parseFloat(sysHddsMaxTemp.value);
    const sysSsdsMaxTemp = document.getElementById('f-sys-ssds-max-temp');
    if (sysSsdsMaxTemp && sysSsdsMaxTemp.value !== '') cc.sys_ssds_max_temperature = parseFloat(sysSsdsMaxTemp.value);
    const sensorLocation = document.getElementById('f-sensor-location-supported');
    if (sensorLocation) cc.sensor_location_supported = sensorLocation.value === 'true';
    const minimalLevel = document.getElementById('f-minimal-level');
    if (minimalLevel && minimalLevel.value !== '') {
      const v = parseInt(minimalLevel.value);
      if (!isNaN(v)) cc.minimal_level = v;
    }
    const maxLimiLevel = document.getElementById('f-max-limi-level');
    if (maxLimiLevel && maxLimiLevel.value !== '') {
      const v = parseInt(maxLimiLevel.value);
      if (!isNaN(v)) cc.max_limi_level = v;
    }
    const pidControlMode = document.getElementById('f-pid-control-mode');
    if (pidControlMode) cc.pid_control_mode = parseInt(pidControlMode.value) || 1;
    const sysM2sMaxTemp = document.getElementById('f-sys-m2s-max-temp');
    if (sysM2sMaxTemp && sysM2sMaxTemp.value !== '') {
      const v = parseFloat(sysM2sMaxTemp.value);
      if (!isNaN(v)) cc.sys_m2s_max_temperature = v;
    }
    const sysAllSsdsMaxTemp = document.getElementById('f-sys-all-ssds-max-temp');
    if (sysAllSsdsMaxTemp && sysAllSsdsMaxTemp.value !== '') {
      const v = parseFloat(sysAllSsdsMaxTemp.value);
      if (!isNaN(v)) cc.sys_all_ssds_max_temperature = v;
    }
    const minAllowedFanSpeed = document.getElementById('f-min-allowed-fan-speed');
    if (minAllowedFanSpeed && minAllowedFanSpeed.value !== '') {
      const v = parseInt(minAllowedFanSpeed.value);
      if (!isNaN(v)) cc.min_allowed_fan_speed_percent = v;
    }
    const minAllowedFanSpeedEnabled = document.getElementById('f-min-allowed-fan-speed-enabled');
    if (minAllowedFanSpeedEnabled) cc.min_allowed_fan_speed_enabled = minAllowedFanSpeedEnabled.value === 'true';
    const mixedModeSupported = document.getElementById('f-mixed-mode-supported');
    if (mixedModeSupported) cc.mixed_mode_supported = mixedModeSupported.value === 'true';
    return cc;
  }

  function collectListItems(containerId) {
    const numberArrayFields = [
      'policy_idx_group','fan_idx_group','fan_group','fan_slots',
      'smart_cooling_target_temperature','target_temperature_range_celsius',
      'liquid_cooling_device_group','temperature_range_low','temperature_range_high',
      'speed_range_low','speed_range_high','fan_speed_range_percents'
    ];
    const stringArrayFields = ['pcie_card_name','hdd_backplane_name','hdd_rear_backplane_name'];
    const intSelectFields = ['requirement_idx', 'backup_requirement_idx'];
    const intCheckboxFields = ['policy_idx_group'];
    const stringCheckboxFields = ['fan_type'];

    const items = [];
    document.querySelectorAll(`#${containerId} .entity-item`).forEach(el => {
      // 从 _sourceData 深拷贝作为基础，保留未渲染到表单的字段
      const base = el._sourceData ? JSON.parse(JSON.stringify(el._sourceData)) : {};
      const formFields = {};

      // 处理常规 input/select/textarea 字段
      el.querySelectorAll('input[data-field], select[data-field], textarea[data-field]').forEach(input => {
        const field = input.dataset.field;
        // 跳过 checkbox 下拉菜单中的 checkbox（单独处理）
        if (input.type === 'checkbox') return;
        let val = input.value.trim();
        if (val === '') {
          delete base[field];
          return;
        }
        // 数字数组字段
        if (numberArrayFields.includes(field)) {
          val = val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        }
        // 字符串数组字段
        else if (stringArrayFields.includes(field)) {
          val = val.split(',').map(s => s.trim()).filter(s => s !== '');
        }
        // 数字字段
        else if (input.type === 'number' && val !== '') {
          val = parseInt(val);
          if (isNaN(val)) { delete base[field]; return; }
        }
        // 单选下拉框数字字段
        else if (intSelectFields.includes(field)) {
          val = parseInt(val);
          if (isNaN(val)) { delete base[field]; return; }
        }
        // 布尔字段
        else if (field === 'custom_supported' || field === 'active_in_standby' || field === 'is_twins' || field === 'disk_temp_unavailable_to_valid') {
          val = val === 'true';
        }
        formFields[field] = val;
      });

      // 处理 multi-select dropdown (checkbox 下拉菜单)
      el.querySelectorAll('.multi-select-dropdown').forEach(dropdown => {
        const field = dropdown.dataset.field;
        if (!field) return;
        const checked = dropdown.querySelectorAll('input[type="checkbox"]:checked');
        const values = [];
        checked.forEach(cb => values.push(cb.value));
        if (intCheckboxFields.includes(field)) {
          formFields[field] = values.map(v => parseInt(v)).filter(n => !isNaN(n));
        } else if (stringCheckboxFields.includes(field)) {
          formFields[field] = values;
        }
        if (values.length === 0) delete base[field];
      });

      // 合并: 表单值覆盖 base，base 保留未渲染的字段
      items.push(Object.assign(base, formFields));
    });
    return items;
  }

  function collectBasicCoolingConfig() {
    const bc = {};
    const diff = document.getElementById('f-fan-group-diff').value;
    const cal = document.getElementById('f-psu-calibration').value;
    if (diff !== '') bc.fan_group_speed_diff_threshold_percent = parseInt(diff);
    if (cal !== '') bc.psu_fan_speed_calibration = parseInt(cal);
    bc.fan_groups = collectListItems('fan-groups-list');
    return bc;
  }

  function collectAirCoolingConfig() {
    const ac = {};
    const rangeStr = document.getElementById('f-speed-percent-range');
    if (rangeStr && rangeStr.value.trim()) {
      const parsed = rangeStr.value.split(',').map(s => parseInt(s.trim()));
      if (parsed.every(n => !isNaN(n)) && parsed.length === 2) {
        ac.speed_percent_range = parsed;
      }
    }
    const initPercent = document.getElementById('f-initial-speed-percent');
    if (initPercent && initPercent.value !== '') {
      const v = parseInt(initPercent.value);
      if (!isNaN(v)) ac.initial_speed_percent = v;
    }
    const maxAllowedSpeedPercent = document.getElementById('f-max-allowed-speed-percent');
    if (maxAllowedSpeedPercent && maxAllowedSpeedPercent.value !== '') {
      const v = parseInt(maxAllowedSpeedPercent.value);
      if (!isNaN(v)) ac.max_allowed_speed_percent = v;
    }
    const minAllowedSpeedPercent = document.getElementById('f-min-allowed-speed-percent');
    if (minAllowedSpeedPercent && minAllowedSpeedPercent.value !== '') {
      const v = parseInt(minAllowedSpeedPercent.value);
      if (!isNaN(v)) ac.min_allowed_speed_percent = v;
    }
    return ac;
  }

  // ==================== 实体增删 ====================
  function addEntity(key) {
    if (!configData.cooling_config) configData.cooling_config = {};
    if (!configData.cooling_requirements) configData.cooling_requirements = [];
    if (!configData.cooling_policies) configData.cooling_policies = [];
    if (!configData.cooling_areas) configData.cooling_areas = [];
    if (!configData.abnormal_fans) configData.abnormal_fans = [];
    if (!configData.fan_types) configData.fan_types = [];
    if (!configData.cooling_fans) configData.cooling_fans = [];
    if (!configData.basic_cooling_config) configData.basic_cooling_config = { fan_groups: [] };
    if (!configData.basic_cooling_config.fan_groups) configData.basic_cooling_config.fan_groups = [];

    const templates = {
      'cooling_requirements': { id: Date.now() % 1000, requirement_id: '', monitoring_status: '', monitoring_value: '', description: '新温度点' },
      'cooling_policies': { id: Date.now() % 1000, policy_idx: Date.now() % 100, exp_cond_val: 'EnergySaving', actual_cond_val: '<=/CoolingConfig_1.SmartCoolingMode', hysteresis: 1, temperature_range_low: [-127, 20], temperature_range_high: [20, 127], speed_range_low: [30, 100], speed_range_high: [30, 100], description: '新策略' },
      'cooling_areas': { id: Date.now() % 1000, area_id: Date.now() % 100, requirement_idx: '', policy_idx_group: [], fan_idx_group: [], description: '新区域' },
      'abnormal_fans': { id: Date.now() % 100, fan_idx: 1, status: 'AbnormalRotation', fan_group: [1], speed_percentage: 80, description: '新异常风扇' },
      'fan_types': { name: '', bom: '', part_number: '', index: Date.now() % 100, system_id: 0, front_max_speed: 15000, rear_max_speed: 15000, is_twins: false, identify_range_low: 0, identify_range_high: 0, model_code: '', description: '新风扇类型' },
      'cooling_fans': { fan_id: Date.now() % 100, slot: 1, front_presence: '<=/Fan_1.FrontPresence', rear_presence: '<=/Fan_1.RearPresence', front_status: '<=/Fan_1.FrontStatus', rear_status: '<=/Fan_1.RearStatus', hardware_pwm: '#/Accessor_Fan1_PWM.Value', max_supported_pwm: 255, description: '新调速风扇' },
      'basic_cooling_config.fan_groups': { id: Date.now() % 100, fan_slots: [] }
    };

    const entityKey = key;
    if (entityKey === 'basic_cooling_config.fan_groups') {
      configData.basic_cooling_config.fan_groups.push(templates[entityKey]);
    } else if (configData[entityKey]) {
      configData[entityKey].push(templates[entityKey]);
    }
    renderForm(configData);
    const yamlText = jsyaml.dump(configData, { lineWidth: -1, noRefs: true });
    document.getElementById('yaml-editor').value = yamlText;
  }

  function removeEntity(key, idx) {
    var deletedEntity = null;
    if (key === 'basic_cooling_config.fan_groups') {
      deletedEntity = configData.basic_cooling_config.fan_groups[idx];
      configData.basic_cooling_config.fan_groups.splice(idx, 1);
    } else if (configData[key]) {
      deletedEntity = configData[key][idx];
      configData[key].splice(idx, 1);
    }

    // FR-016: 级联删除 — 清除所有引用
    if (deletedEntity) {
      if (key === 'cooling_requirements') {
        var deletedId = deletedEntity.id;
        // CoolingArea.requirement_idx
        (configData.cooling_areas || []).forEach(function(area) {
          if (area.requirement_idx === deletedId) delete area.requirement_idx;
        });
        // CoolingRequirement.backup_requirement_idx
        (configData.cooling_requirements || []).forEach(function(req) {
          if (req.backup_requirement_idx === deletedId) delete req.backup_requirement_idx;
        });
      }
      else if (key === 'cooling_policies') {
        var deletedPolicyIdx = deletedEntity.policy_idx;
        // CoolingArea.policy_idx_group
        (configData.cooling_areas || []).forEach(function(area) {
          if (area.policy_idx_group) {
            area.policy_idx_group = area.policy_idx_group.filter(function(id) { return id !== deletedPolicyIdx; });
            if (area.policy_idx_group.length === 0) delete area.policy_idx_group;
          }
        });
      }
      else if (key === 'fan_types') {
        var deletedName = deletedEntity.name;
        // CoolingPolicy.fan_type
        (configData.cooling_policies || []).forEach(function(policy) {
          if (policy.fan_type) {
            policy.fan_type = policy.fan_type.filter(function(n) { return n !== deletedName; });
            if (policy.fan_type.length === 0) delete policy.fan_type;
          }
        });
      }
      else if (key === 'cooling_fans') {
        var deletedFanId = deletedEntity.fan_id;
        // CoolingArea.fan_idx_group
        (configData.cooling_areas || []).forEach(function(area) {
          if (area.fan_idx_group) {
            area.fan_idx_group = area.fan_idx_group.filter(function(id) { return id !== deletedFanId; });
            if (area.fan_idx_group.length === 0) delete area.fan_idx_group;
          }
        });
      }
    }

    renderForm(configData);
    const yamlText = jsyaml.dump(configData, { lineWidth: -1, noRefs: true });
    document.getElementById('yaml-editor').value = yamlText;
  }

  // ==================== 同步 ====================
  function syncFormToYaml() {
    configData = collectFormData();
    const yamlText = jsyaml.dump(configData, { lineWidth: -1, noRefs: true });
    document.getElementById('yaml-editor').value = yamlText;
  }

  function syncYamlToForm() {
    const text = document.getElementById('yaml-editor').value;
    loadYaml(text);
  }

  // 表单变更监听（事件委托）
  document.addEventListener('change', (e) => {
    // checkbox 下拉菜单变更由专用 handler 处理，此处跳过避免关闭下拉面板
    if (e.target.closest('.multi-select-dropdown')) return;
    if (e.target.closest('.form-container')) {
      syncFormToYaml();
      renderForm(configData); // 重新渲染以刷新所有候选列表（候选列表依赖 configData）
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.matches('input[type="number"]') && e.target.closest('.form-container')) {
      validateFieldRealtime(e.target);
    }
  });

  // ==================== 实时字段校验 ====================
  function validateFieldRealtime(el) {
    const field = el.dataset.field;
    if (!field) return;
    clearFieldError(el);

    const val = el.value.trim();
    if (val === '') return;

    // 取值范围校验
    const min = el.min ? parseInt(el.min) : null;
    const max = el.max ? parseInt(el.max) : null;
    if (el.type === 'number' && val !== '' && (min !== null || max !== null)) {
      const num = parseInt(val);
      if (isNaN(num) || (min !== null && num < min) || (max !== null && num > max)) {
        showFieldError(el, `值应在 [${min ?? '-∞'}, ${max ?? '+∞'}] 范围内`);
        return;
      }
    }

    // ID唯一性校验
    if (['id', 'area_id', 'policy_idx'].includes(field)) {
      validateIdUniqueness(el, field);
    }
  }

  function validateIdUniqueness(el, field) {
    const val = parseInt(el.value.trim());
    if (isNaN(val)) return;
    const entityItem = el.closest('.entity-item');
    if (!entityItem) return;
    const container = entityItem.parentElement;
    const values = [];
    container.querySelectorAll(`[data-field="${field}"]`).forEach(input => {
      const v = parseInt(input.value.trim());
      if (!isNaN(v)) values.push({ el: input, val: v });
    });
    // 检查当前值是否重复
    const currentCount = values.filter(v => v.val === val).length;
    if (currentCount > 1) {
      showFieldError(el, `ID ${val} 已存在，必须全局唯一`);
    }
  }

  function showFieldError(el, msg) {
    el.classList.add('field-error');
    let errEl = el.parentElement.querySelector('.field-error-msg');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'field-error-msg';
      el.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearFieldError(el) {
    el.classList.remove('field-error');
    const errEl = el.parentElement.querySelector('.field-error-msg');
    if (errEl) errEl.remove();
  }

  // ==================== 文件操作 ====================
  function handleFileLoad(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      document.getElementById('yaml-editor').value = text;
      loadYaml(text);
    };
    reader.readAsText(file);
    e.target.value = ''; // 重置以允许重复加载
  }

  function handleSave() {
    syncFormToYaml();
    const text = document.getElementById('yaml-editor').value;
    downloadFile('cooling-config.yaml', text, 'text/yaml');
  }

  function downloadFile(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  }

  // ==================== CSR生成 ====================
  function handleGenerate() {
    try {
      syncFormToYaml();
      const config = collectFormData();

      // 全量校验（仅展示，不阻塞生成）
      const errors = CoolingValidator.validateAll(config);
      if (errors.length > 0) {
        showValidationErrors(errors);
      } else {
        document.getElementById('validation-errors').style.display = 'none';
      }

      // 始终生成CSR
      const psr = CoolingConverter.generatePsrFragment(config);
      const sr = CoolingConverter.generateSrFragment(config);

      document.getElementById('psr-output').textContent = JSON.stringify(psr, null, 2);
      document.getElementById('sr-output').textContent = JSON.stringify(sr, null, 2);
      document.getElementById('output-panel').style.display = 'block';

      bindOutputActions(psr, sr);
    } catch(e) {
      console.error('CSR生成失败:', e);
      alert('CSR生成失败: ' + e.message);
    }
  }

  function showValidationErrors(errors) {
    const container = document.getElementById('validation-errors');
    const list = document.getElementById('error-list');
    list.innerHTML = '';
    errors.forEach(err => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="err-level ${err.level}">[${err.level === 'error' ? '错误' : '警告'}]</span> ${err.entity} #${err.id}: ${err.message}`;
      li.addEventListener('click', () => {
        // 优先按 entity-id + field 精准定位
        var field = null;
        if (err.id != null && err.field) {
          field = document.querySelector(`[data-entity-id="${err.id}"][data-field="${err.field}"]`);
        }
        // 回退：仅按 field 名定位
        if (!field && err.field) {
          field = document.querySelector(`[data-field="${err.field}"]`);
        }
        if (field) {
          // 若实体项被折叠（父项 display:none），尝试展开
          var entityItem = field.closest('.entity-item');
          if (entityItem && entityItem.style.display === 'none') {
            entityItem.style.display = '';
          }
          field.scrollIntoView({ behavior: 'smooth', block: 'center' });
          field.focus();
          field.classList.add('field-highlight');
          setTimeout(() => field.classList.remove('field-highlight'), 3000);
        }
      });
      list.appendChild(li);
    });
    container.style.display = 'block';
  }

  function bindOutputActions(psr, sr) {
    document.getElementById('btn-copy-psr').onclick = () => copyToClipboard(JSON.stringify(psr, null, 2));
    document.getElementById('btn-copy-sr').onclick = () => copyToClipboard(JSON.stringify(sr, null, 2));
    document.getElementById('btn-download-psr').onclick = () => downloadFile('psr-cooling-objects.json', JSON.stringify(psr, null, 2), 'application/json');
    document.getElementById('btn-download-sr').onclick = () => downloadFile('sr-cooling-objects.json', JSON.stringify(sr, null, 2), 'application/json');
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => alert('已复制到剪贴板'));
  }

  // ==================== 输出标签页切换 ====================
  function bindOutputTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('psr-output').style.display = btn.dataset.tab === 'psr' ? '' : 'none';
        document.getElementById('sr-output').style.display = btn.dataset.tab === 'sr' ? '' : 'none';
      });
    });
  }

  // ==================== 曲线编辑器集成 ====================
  let currentCurvePolicyIdx = -1;

  function showCurveEditor(policyIdx) {
    currentCurvePolicyIdx = policyIdx;
    const policies = configData.cooling_policies || [];
    const policy = policies[policyIdx];
    if (!policy) return;

    const section = document.getElementById('curve-section');
    section.style.display = '';
    document.getElementById('curve-policy-name').textContent = `策略 #${policy.policy_idx} - ${policy.description || ''}`;

    if (typeof CurveEditor !== 'undefined') {
      CurveEditor.render(
        document.getElementById('curve-canvas'),
        policy.temperature_range_low || [],
        policy.temperature_range_high || [],
        policy.speed_range_low || [],
        policy.speed_range_high || []
      );
      CurveEditor.renderTable(document.getElementById('curve-data-table'));
    }
  }

  // 曲线编辑器回调：拖拽/增删节点后同步到表单数据
  window.onCurveUpdate = function(arrays) {
    if (currentCurvePolicyIdx < 0) return;
    const policies = configData.cooling_policies;
    if (!policies || !policies[currentCurvePolicyIdx]) return;
    const policy = policies[currentCurvePolicyIdx];
    policy.temperature_range_low = arrays.temperature_range_low;
    policy.temperature_range_high = arrays.temperature_range_high;
    policy.speed_range_low = arrays.speed_range_low;
    policy.speed_range_high = arrays.speed_range_high;
    // 同步更新 DOM entity-item 的 _sourceData，确保后续 collectListItems 能取到最新值
    const policyItems = document.querySelectorAll('#policies-list .entity-item');
    if (policyItems[currentCurvePolicyIdx]) {
      policyItems[currentCurvePolicyIdx]._sourceData = JSON.parse(JSON.stringify(policy));
    }
    // 直接从 configData 生成 YAML，不走 collectFormData 避免旧 _sourceData 覆盖
    const yamlText = jsyaml.dump(configData, { lineWidth: -1, noRefs: true });
    document.getElementById('yaml-editor').value = yamlText;
    // 更新对应策略卡的迷你曲线预览
    renderMiniCurve(currentCurvePolicyIdx);
  };

  // 曲线编辑器按钮绑定
  document.addEventListener('DOMContentLoaded', () => {
    const btnAddNode = document.getElementById('btn-add-node');
    const btnDeleteNode = document.getElementById('btn-delete-node');
    if (btnAddNode) btnAddNode.addEventListener('click', () => { if (typeof CurveEditor !== 'undefined') CurveEditor.addNode(); });
    if (btnDeleteNode) btnDeleteNode.addEventListener('click', () => { if (typeof CurveEditor !== 'undefined') CurveEditor.deleteSelectedNode(); });
  });

  // ==================== 多选下拉菜单事件委托 ====================
  document.addEventListener('click', function(e) {
    // 点击 toggle 按钮
    var toggle = e.target.closest('.msd-toggle');
    if (toggle) {
      var dropdown = toggle.closest('.multi-select-dropdown');
      if (dropdown) {
        // 关闭其他下拉菜单
        document.querySelectorAll('.multi-select-dropdown.open').forEach(d => {
          if (d !== dropdown) { d.classList.remove('open'); d.classList.remove('open-up'); }
        });
        var isOpen = dropdown.classList.contains('open');
        if (!isOpen) {
          // 判断下方是否有足够空间
          var rect = dropdown.getBoundingClientRect();
          var panelHeight = 180; // max-height of msd-panel
          var spaceBelow = window.innerHeight - rect.bottom;
          if (spaceBelow < panelHeight && rect.top > panelHeight) {
            dropdown.classList.add('open-up');
          } else {
            dropdown.classList.remove('open-up');
          }
          dropdown.classList.add('open');
        } else {
          dropdown.classList.remove('open');
          dropdown.classList.remove('open-up');
        }
      }
      return;
    }
    // 点击 checkbox 时不关闭（让用户勾选多个）
    if (e.target.closest('.msd-panel')) return;
    // 点击外部关闭所有
    document.querySelectorAll('.multi-select-dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.classList.remove('open-up');
    });
  });

  // checkbox 变更时更新 toggle 文字并同步 YAML
  document.addEventListener('change', function(e) {
    if (e.target.closest('.multi-select-dropdown')) {
      var dropdown = e.target.closest('.multi-select-dropdown');
      var checked = dropdown.querySelectorAll('input[type="checkbox"]:checked');
      var toggle = dropdown.querySelector('.msd-toggle span:first-child');
      if (toggle) {
        if (checked.length === 0) {
          toggle.textContent = '-- 请选择 --';
        } else {
          // 从 checkbox 的相邻文本节点获取 label
          var labels = [];
          checked.forEach(function(cb) {
            var label = cb.closest('label');
            if (label) {
              // 获取 label 的纯文本（去掉 checkbox 本身）
              var text = label.textContent.trim();
              labels.push(text);
            }
          });
          toggle.textContent = labels.join(', ');
        }
      }
      // 触发 YAML 同步
      syncFormToYaml();
    }
  });

  // 全局引用
  window.showCurveEditor = showCurveEditor;

  // 测试辅助接口 (Constitution Principle IV)
  window.AppTestHelper = {
    getConfigData: function() { return configData; },
    setConfigData: function(d) { configData = d; },
    getCandidateList: getCandidateList,
    renderSelect: renderSelect,
    renderCheckboxDropdown: renderCheckboxDropdown,
    removeEntity: removeEntity,
    renderForm: renderForm,
    renderMiniCurve: renderMiniCurve,
    updateOutlineNav: updateOutlineNav
  };
})();
