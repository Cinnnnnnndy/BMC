/**
 * 能效调速配置校验引擎
 * 校验YAML配置的完整性和正确性
 */
const CoolingValidator = (() => {

  /**
   * 校验结果项
   * @typedef {Object} ValidationItem
   * @property {string} entity - 实体类型 (如 "CoolingRequirement", "CoolingPolicy")
   * @property {number|string} id - 实体标识
   * @property {string} field - 校验字段
   * @property {"error"|"warning"} level - 严重级别
   * @property {string} message - 中文错误描述
   */

  /**
   * 全量校验配置
   * @param {Object} config - 解析后的YAML配置对象
   * @returns {ValidationItem[]} 校验结果列表
   */
  function validateAll(config) {
    const results = [];
    const requirements = config.cooling_requirements || [];
    const policies = config.cooling_policies || [];
    const areas = config.cooling_areas || [];
    const fans = config.abnormal_fans || [];
    const coolingFans = config.cooling_fans || [];

    // 1. ID全局唯一性校验
    validateUniqueIds(requirements, policies, areas, fans, coolingFans, results);

    // 2. CoolingPolicy数组校验
    for (const policy of policies) {
      validatePolicyArrays(policy, results);
    }

    // 3. CoolingArea校验
    for (const area of areas) {
      validateCoolingArea(area, requirements, policies, results);
    }

    // 4. CoolingConfig参数范围校验
    if (config.cooling_config) {
      validateCoolingConfig(config.cooling_config, results);
    }

    // 5. CoolingRequirement必填项校验
    for (const req of requirements) {
      validateRequirementRequired(req, results);
    }

    // 6. FanType校验
    const fanTypes = config.fan_types || [];
    validateFanTypes(fanTypes, results);

    // 7. CoolingPolicy fan_type引用校验
    validateFanTypeReferences(policies, fanTypes, results);

    // 8. CoolingFan必填项校验
    for (const cf of coolingFans) {
      validateCoolingFanRequired(cf, results);
    }

    // 9. AirCoolingConfig校验
    if (config.air_cooling_config) {
      validateAirCoolingConfig(config.air_cooling_config, results);
    }

    return results;
  }

  // ID全局唯一性校验
  function validateUniqueIds(requirements, policies, areas, fans, coolingFans, results) {
    // RequirementId唯一性
    const reqIds = new Set();
    for (const req of requirements) {
      const id = req.requirement_id;
      if (id == null) continue;
      if (reqIds.has(id)) {
        results.push({
          entity: 'CoolingRequirement', id: req.id,
          field: 'requirement_id', level: 'error',
          message: `RequirementId ${id} 重复，RequirementId必须全局唯一`
        });
      }
      reqIds.add(id);
    }

    // PolicyIdx唯一性
    const policyIds = new Set();
    for (const policy of policies) {
      const id = policy.policy_idx;
      if (id == null) continue;
      if (policyIds.has(id)) {
        results.push({
          entity: 'CoolingPolicy', id: policy.id,
          field: 'policy_idx', level: 'error',
          message: `PolicyIdx ${id} 重复，PolicyIdx必须全局唯一`
        });
      }
      policyIds.add(id);
    }

    // AreaId唯一性
    const areaIds = new Set();
    for (const area of areas) {
      const id = area.area_id;
      if (id == null) continue;
      if (areaIds.has(id)) {
        results.push({
          entity: 'CoolingArea', id: area.id,
          field: 'area_id', level: 'error',
          message: `AreaId ${id} 重复，AreaId必须全局唯一`
        });
      }
      areaIds.add(id);
    }

    // AbnormalFan Id唯一性
    const fanIds = new Set();
    for (const fan of fans) {
      const id = fan.id;
      if (id == null) continue;
      if (fanIds.has(id)) {
        results.push({
          entity: 'AbnormalFan', id: fan.id,
          field: 'id', level: 'error',
          message: `AbnormalFan Id ${id} 重复，Id必须全局唯一`
        });
      }
      fanIds.add(id);
    }

    // CoolingFan FanId唯一性
    const coolingFanIds = new Set();
    for (const cf of coolingFans) {
      const id = cf.fan_id;
      if (id == null) continue;
      if (coolingFanIds.has(id)) {
        results.push({
          entity: 'CoolingFan', id: cf.id,
          field: 'fan_id', level: 'error',
          message: `CoolingFan FanId ${id} 重复，FanId必须全局唯一`
        });
      }
      coolingFanIds.add(id);
    }
  }

  // CoolingPolicy四数组校验
  function validatePolicyArrays(policy, results) {
    const tl = (policy.temperature_range_low || []).length;
    const th = (policy.temperature_range_high || []).length;
    const sl = (policy.speed_range_low || []).length;
    const sh = (policy.speed_range_high || []).length;

    // 四数组长度必须相同
    if (tl > 0 && (tl !== th || tl !== sl || tl !== sh)) {
      results.push({
        entity: 'CoolingPolicy', id: policy.id,
        field: 'temperature_range_low/high, speed_range_low/high', level: 'error',
        message: `四个数组长度不一致(温度左${tl}/右${th}, 转速左${sl}/右${sh})，长度必须相同`
      });
      return;
    }

    // 温度区间连续性校验
    const tlArr = policy.temperature_range_low || [];
    const thArr = policy.temperature_range_high || [];
    for (let i = 0; i < tlArr.length - 1; i++) {
      if (thArr[i] !== tlArr[i + 1]) {
        results.push({
          entity: 'CoolingPolicy', id: policy.id,
          field: 'temperature_range', level: 'error',
          message: `温度区间不连续: 第${i}区间右值${thArr[i]} ≠ 第${i + 1}区间左值${tlArr[i + 1]}，温度区间必须连续`
        });
        break; // 只报告第一个不连续
      }
    }

    // 转速范围校验
    const slArr = policy.speed_range_low || [];
    const shArr = policy.speed_range_high || [];
    for (let i = 0; i < slArr.length; i++) {
      if (isNaN(slArr[i]) || isNaN(shArr[i])) {
        results.push({
          entity: 'CoolingPolicy', id: policy.id,
          field: 'speed_range', level: 'error',
          message: `第${i}区间转速值包含非数字(NaN)`
        });
        break;
      }
      if (slArr[i] < 0 || slArr[i] > 100 || shArr[i] < 0 || shArr[i] > 100) {
        results.push({
          entity: 'CoolingPolicy', id: policy.id,
          field: 'speed_range', level: 'error',
          message: `第${i}区间转速值 [${slArr[i]}, ${shArr[i]}] 超出范围[0, 100]`
        });
        break;
      }
      if (slArr[i] > shArr[i]) {
        results.push({
          entity: 'CoolingPolicy', id: policy.id,
          field: 'speed_range', level: 'error',
          message: `第${i}区间转速最小值(${slArr[i]})大于最大值(${shArr[i]})`
        });
        break;
      }
    }
  }

  // CoolingArea校验
  function validateCoolingArea(area, requirements, policies, results) {
    // 风扇ID有序性校验
    const fanGroup = area.fan_idx_group || [];
    for (let i = 1; i < fanGroup.length; i++) {
      if (fanGroup[i] <= fanGroup[i - 1]) {
        results.push({
          entity: 'CoolingArea', id: area.id,
          field: 'fan_idx_group', level: 'warning',
          message: `风扇ID列表未按从小到大排序(当前[${fanGroup}])，建议排序`
        });
        break;
      }
    }

    // 关联引用有效性
    const reqIds = new Set(requirements.map(r => r.id));
    if (area.requirement_idx != null && !reqIds.has(area.requirement_idx)) {
      results.push({
        entity: 'CoolingArea', id: area.id,
        field: 'requirement_idx', level: 'error',
        message: `关联的温度点id ${area.requirement_idx} 不存在`
      });
    }

    const policyIds = new Set(policies.map(p => p.policy_idx));
    for (const pid of (area.policy_idx_group || [])) {
      if (!policyIds.has(pid)) {
        results.push({
          entity: 'CoolingArea', id: area.id,
          field: 'policy_idx_group', level: 'error',
          message: `关联的调速策略id ${pid} 不存在`
        });
      }
    }
  }

  // CoolingConfig参数范围校验
  function validateCoolingConfig(config, results) {
    if (config.init_level_in_startup != null) {
      if (config.init_level_in_startup < 0 || config.init_level_in_startup > 100) {
        results.push({
          entity: 'CoolingConfig', id: '-',
          field: 'init_level_in_startup', level: 'error',
          message: `初始转速百分比 ${config.init_level_in_startup} 超出范围[0, 100]`
        });
      }
    }

    if (config.level_percent_range != null) {
      const [min, max] = config.level_percent_range;
      if (min < 0 || max > 100 || min > max) {
        results.push({
          entity: 'CoolingConfig', id: '-',
          field: 'level_percent_range', level: 'error',
          message: `手动转速范围 [${min}, ${max}] 无效，应为[0~100]且最小值≤最大值`
        });
      }
    }

    const validModes = ['EnergySaving', 'LowNoise', 'HighPerformance', 'Custom', 'LiquidCooling'];
    if (config.smart_cooling_mode && !validModes.includes(config.smart_cooling_mode)) {
      results.push({
        entity: 'CoolingConfig', id: '-',
        field: 'smart_cooling_mode', level: 'error',
        message: `无效的调速模式 "${config.smart_cooling_mode}"`
      });
    }

    // MinimalLevel / MaxLimiLevel 范围校验
    if (config.minimal_level != null && (config.minimal_level < 0 || config.minimal_level > 100)) {
      results.push({
        entity: 'CoolingConfig', id: '-',
        field: 'minimal_level', level: 'error',
        message: `最小转速百分比 ${config.minimal_level} 超出范围[0, 100]`
      });
    }
    if (config.max_limi_level != null && (config.max_limi_level < 0 || config.max_limi_level > 100)) {
      results.push({
        entity: 'CoolingConfig', id: '-',
        field: 'max_limi_level', level: 'error',
        message: `最大转速百分比 ${config.max_limi_level} 超出范围[0, 100]`
      });
    }
    if (config.minimal_level != null && config.max_limi_level != null && config.minimal_level > config.max_limi_level) {
      results.push({
        entity: 'CoolingConfig', id: '-',
        field: 'minimal_level/max_limi_level', level: 'error',
        message: `最小转速百分比(${config.minimal_level})大于最大转速百分比(${config.max_limi_level})`
      });
    }

    // PIDControlMode 枚举校验
    if (config.pid_control_mode != null && ![1, 2, 3, 4].includes(config.pid_control_mode)) {
      results.push({
        entity: 'CoolingConfig', id: '-',
        field: 'pid_control_mode', level: 'error',
        message: `无效的PID控制模式 ${config.pid_control_mode}，应为1~4`
      });
    }
  }

  // CoolingRequirement必填项校验
  function validateRequirementRequired(req, results) {
    if (!req.monitoring_status) {
      results.push({
        entity: 'CoolingRequirement', id: req.id,
        field: 'monitoring_status', level: 'error',
        message: `温度点缺少必填字段 monitoring_status`
      });
    }
    if (!req.monitoring_value) {
      results.push({
        entity: 'CoolingRequirement', id: req.id,
        field: 'monitoring_value', level: 'error',
        message: `温度点缺少必填字段 monitoring_value`
      });
    }
  }

  // FanType校验
  function validateFanTypes(fanTypes, results) {
    // Index全局唯一性
    const indexSet = new Set();
    for (const ft of fanTypes) {
      const idx = ft.index;
      if (idx == null) continue;
      if (indexSet.has(idx)) {
        results.push({
          entity: 'FanType', id: ft.index,
          field: 'index', level: 'error',
          message: `FanType Index ${idx} 重复，Index必须全局唯一`
        });
      }
      indexSet.add(idx);
    }

    // IdentifyRangeLow < IdentifyRangeHigh
    for (const ft of fanTypes) {
      if (ft.identify_range_low != null && ft.identify_range_high != null) {
        if (ft.identify_range_low >= ft.identify_range_high) {
          results.push({
            entity: 'FanType', id: ft.index,
            field: 'identify_range_low/high', level: 'error',
            message: `FanType IdentifyRangeLow(${ft.identify_range_low}) >= IdentifyRangeHigh(${ft.identify_range_high})，Low必须小于High`
          });
        }
      }
    }

    // 所有FanType识别范围互不重叠
    for (let i = 0; i < fanTypes.length; i++) {
      for (let j = i + 1; j < fanTypes.length; j++) {
        const a = fanTypes[i];
        const b = fanTypes[j];
        if (a.identify_range_low == null || a.identify_range_high == null) continue;
        if (b.identify_range_low == null || b.identify_range_high == null) continue;
        // 重叠条件: a.low < b.high && b.low < a.high
        if (a.identify_range_low < b.identify_range_high && b.identify_range_low < a.identify_range_high) {
          results.push({
            entity: 'FanType', id: a.index,
            field: 'identify_range', level: 'error',
            message: `FanType ${a.name || a.index} 与 ${b.name || b.index} 的识别范围 [${a.identify_range_low},${a.identify_range_high}] 和 [${b.identify_range_low},${b.identify_range_high}] 重叠`
          });
        }
      }
    }
  }

  // CoolingPolicy fan_type引用校验
  function validateFanTypeReferences(policies, fanTypes, results) {
    const validNames = new Set(fanTypes.map(ft => ft.name).filter(n => n));
    for (const policy of policies) {
      const fanTypeList = policy.fan_type || [];
      for (const name of fanTypeList) {
        if (name && !validNames.has(name)) {
          results.push({
            entity: 'CoolingPolicy', id: policy.id,
            field: 'fan_type', level: 'warning',
            message: `CoolingPolicy引用的fan_type "${name}" 在fan_types中不存在`
          });
        }
      }
    }
  }

  // CoolingFan必填项校验
  function validateCoolingFanRequired(fan, results) {
    if (fan.fan_id == null) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'fan_id', level: 'error',
        message: `CoolingFan缺少必填字段 fan_id`
      });
    }
    if (fan.slot == null) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'slot', level: 'error',
        message: `CoolingFan缺少必填字段 slot`
      });
    }
    if (!fan.front_presence) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'front_presence', level: 'error',
        message: `CoolingFan缺少必填字段 front_presence`
      });
    }
    if (!fan.rear_presence) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'rear_presence', level: 'error',
        message: `CoolingFan缺少必填字段 rear_presence`
      });
    }
    if (!fan.front_status) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'front_status', level: 'error',
        message: `CoolingFan缺少必填字段 front_status`
      });
    }
    if (!fan.rear_status) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'rear_status', level: 'error',
        message: `CoolingFan缺少必填字段 rear_status`
      });
    }
    if (!fan.hardware_pwm) {
      results.push({
        entity: 'CoolingFan', id: fan.id,
        field: 'hardware_pwm', level: 'error',
        message: `CoolingFan缺少必填字段 hardware_pwm`
      });
    }
  }

  // AirCoolingConfig校验
  function validateAirCoolingConfig(airConfig, results) {
    if (airConfig.speed_percent_range != null) {
      const [min, max] = airConfig.speed_percent_range;
      if (min < 0 || max > 100 || min > max) {
        results.push({
          entity: 'AirCoolingConfig', id: '-',
          field: 'speed_percent_range', level: 'error',
          message: `手动转速百分比范围 [${min}, ${max}] 无效，应为[0~100]且最小值≤最大值`
        });
      }
      if (min < 10) {
        results.push({
          entity: 'AirCoolingConfig', id: '-',
          field: 'speed_percent_range', level: 'warning',
          message: `最小转速百分比 ${min} 低于10%，可能导致风扇停转`
        });
      }
    }
    if (airConfig.initial_speed_percent != null) {
      if (airConfig.initial_speed_percent < 0 || airConfig.initial_speed_percent > 100) {
        results.push({
          entity: 'AirCoolingConfig', id: '-',
          field: 'initial_speed_percent', level: 'error',
          message: `开机初始转速百分比 ${airConfig.initial_speed_percent} 超出范围[0, 100]`
        });
      }
    }
  }

  return { validateAll };
})();
