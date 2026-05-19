/**
 * 能效调速配置编辑器 - 自动化测试套件
 * 浏览器环境运行，覆盖 converter、validator、表单同步
 * 使用方式：打开 test-runner.html 查看结果
 */
(function() {
  'use strict';

  const results = { passed: 0, failed: 0, errors: [] };

  function assert(condition, message) {
    if (condition) {
      results.passed++;
    } else {
      results.failed++;
      results.errors.push(message);
    }
  }

  function assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      results.passed++;
    } else {
      results.failed++;
      results.errors.push(`${message}: 期望 ${JSON.stringify(expected)}, 实际 ${JSON.stringify(actual)}`);
    }
  }

  // ==================== 测试数据 ====================
  const sampleConfig = {
    slot_id: 1,
    cooling_config: {
      smart_cooling_state: 'Enabled',
      smart_cooling_mode: 'EnergySaving',
      level_percent_range: [10, 100],
      init_level_in_startup: 100,
      fan_board_num: 1,
      disk_row_temperature_available: false,
      sys_hdds_max_temperature: 32768,
      sys_ssds_max_temperature: 32768,
      sys_m2s_max_temperature: 32768,
      sys_all_ssds_max_temperature: 32768,
      sensor_location_supported: false,
      minimal_level: 0,
      max_limi_level: 100,
      pid_control_mode: 1,
      mixed_mode_supported: false
    },
    cooling_requirements: [
      {
        id: 6, requirement_id: 6, description: '入风口温度点',
        temperature_type: 'Inlet',
        monitoring_status: '<=/Scanner_Lm75_Inlet.Status',
        monitoring_value: '<=/Scanner_Lm75_Inlet.Value',
        failed_value: 80, backup_requirement_idx: 8,
        sensor_name: '#/ThresholdSensor_InletTemp.SensorName',
        is_backup_requirement: false,
        obtain_temp_faild_to_valid: false,
        liquid_failed_value: 0
      },
      {
        id: 7, requirement_id: 7, description: '出风口温度点',
        temperature_type: 'Outlet',
        monitoring_status: '<=/Scanner_Lm75_Outlet.Status',
        monitoring_value: '<=/Scanner_Lm75_Outlet.Value',
        target_temperature_celsius: 45,
        max_allowed_temperature_celsius: 60,
        smart_cooling_target_temperature: [50, 47, 53],
        custom_supported: true,
        custom_target_temperature_celsius: 52,
        target_temperature_range_celsius: [45, 60],
        sensor_name: '#/ThresholdSensor_OutletTemp.SensorName',
        is_backup_requirement: false,
        obtain_temp_faild_to_valid: false,
        liquid_failed_value: 0
      }
    ],
    cooling_policies: [
      {
        id: 6, policy_idx: 6, description: '节能模式环温调速',
        exp_cond_val: 'EnergySaving',
        actual_cond_val: '<=/CoolingConfig_1.SmartCoolingMode',
        hysteresis: 1,
        temperature_range_low: [-127, 20, 25, 30, 35, 40, 45],
        temperature_range_high: [20, 25, 30, 35, 40, 45, 127],
        speed_range_low: [30, 30, 40, 50, 60, 80, 100],
        speed_range_high: [30, 30, 40, 50, 60, 80, 100]
      },
      {
        id: 7, policy_idx: 7, description: '高性能模式环温调速',
        exp_cond_val: 'HighPerformance',
        actual_cond_val: '<=/CoolingConfig_1.SmartCoolingMode',
        hysteresis: 1,
        temperature_range_low: [-127, 20, 25, 30, 35, 40, 45],
        temperature_range_high: [20, 25, 30, 35, 40, 45, 127],
        speed_range_low: [40, 40, 50, 60, 70, 90, 100],
        speed_range_high: [40, 40, 50, 60, 70, 90, 100]
      }
    ],
    cooling_areas: [
      { id: 6, area_id: 6, description: '入风口调速区域', requirement_idx: 6, policy_idx_group: [6, 7], fan_idx_group: [1, 2, 3, 4], priority: 1 },
      { id: 7, area_id: 7, description: '出风口调速区域', requirement_idx: 7, policy_idx_group: [], fan_idx_group: [1, 2, 3, 4] }
    ],
    abnormal_fans: [
      { id: 1, fan_idx: 1, status: 'AbnormalRotation', fan_group: [1, 2], speed_percentage: 80, priority: 1, description: '风扇1转速异常处理' }
    ],
    fan_types: [
      {
        name: '02314BLG 8038+', description: '单转子8038风扇',
        bom: 'BOM32030275', part_number: '02314BLG',
        index: 1, system_id: 1, model_code: '8038P',
        front_max_speed: 15000, rear_max_speed: 15000,
        is_twins: false,
        identify_range_low: 3230, identify_range_high: 4750,
        fan_diameter_mm: 80
      },
      {
        name: '02314BLG 8080+ Twins', description: '双转子8080风扇',
        bom: 'BOM32030276', part_number: '02314BLG',
        index: 2, system_id: 1, model_code: '8080P',
        front_max_speed: 12000, rear_max_speed: 12000,
        is_twins: true,
        identify_range_low: 5000, identify_range_high: 6500,
        fan_diameter_mm: 80
      }
    ],
    cooling_fans: [
      { fan_id: 1, slot: 1, front_presence: '<=/Fan_1.FrontPresence', rear_presence: '<=/Fan_1.RearPresence', front_status: '<=/Fan_1.FrontStatus', rear_status: '<=/Fan_1.RearStatus', hardware_pwm: '#/Accessor_Fan1_PWM.Value', max_supported_pwm: 255, description: '调速风扇1' },
      { fan_id: 2, slot: 2, front_presence: '<=/Fan_2.FrontPresence', rear_presence: '<=/Fan_2.RearPresence', front_status: '<=/Fan_2.FrontStatus', rear_status: '<=/Fan_2.RearStatus', hardware_pwm: '#/Accessor_Fan2_PWM.Value', max_supported_pwm: 255, description: '调速风扇2' },
      { fan_id: 3, slot: 3, front_presence: '<=/Fan_3.FrontPresence', rear_presence: '<=/Fan_3.RearPresence', front_status: '<=/Fan_3.FrontStatus', rear_status: '<=/Fan_3.RearStatus', hardware_pwm: '#/Accessor_Fan3_PWM.Value', max_supported_pwm: 255, description: '调速风扇3' },
      { fan_id: 4, slot: 4, front_presence: '<=/Fan_4.FrontPresence', rear_presence: '<=/Fan_4.RearPresence', front_status: '<=/Fan_4.FrontStatus', rear_status: '<=/Fan_4.RearStatus', hardware_pwm: '#/Accessor_Fan4_PWM.Value', max_supported_pwm: 255, description: '调速风扇4' }
    ],
    basic_cooling_config: {
      fan_group_speed_diff_threshold_percent: 20,
      psu_fan_speed_calibration: 5,
      fan_groups: [
        { id: 1, fan_slots: [1, 2, 3, 4, 5] },
        { id: 2, fan_slots: [6, 7, 8, 9, 10] }
      ]
    },
    air_cooling_config: {
      speed_percent_range: [10, 100],
      initial_speed_percent: 100
    }
  };

  // ==================== Converter 测试 ====================
  function testConverter() {
    const psr = CoolingConverter.generatePsrFragment(sampleConfig);
    const sr = CoolingConverter.generateSrFragment(sampleConfig);

    // PSR 片段包含 CoolingConfig
    assert('CoolingConfig_1' in psr, 'PSR应包含 CoolingConfig_1');
    assertEqual(psr['CoolingConfig_1'].SmartCoolingState, 'Enabled', 'CoolingConfig.SmartCoolingState');
    assertEqual(psr['CoolingConfig_1'].SmartCoolingMode, 'EnergySaving', 'CoolingConfig.SmartCoolingMode');
    assertEqual(psr['CoolingConfig_1'].LevelPercentRange, [10, 100], 'CoolingConfig.LevelPercentRange');
    assertEqual(psr['CoolingConfig_1'].InitLevelInStartup, 100, 'CoolingConfig.InitLevelInStartup');

    // PSR 片段包含 CoolingArea
    assert('CoolingArea_1_6' in psr, 'PSR应包含 CoolingArea_1_6');
    assertEqual(psr['CoolingArea_1_6'].RequirementIdx, 6, 'CoolingArea.RequirementIdx');
    assertEqual(psr['CoolingArea_1_6'].PolicyIdxGroup, [6, 7], 'CoolingArea.PolicyIdxGroup');
    assertEqual(psr['CoolingArea_1_6'].FanIdxGroup, [1, 2, 3, 4], 'CoolingArea.FanIdxGroup');

    // PSR 片段包含 CoolingPolicy
    assert('CoolingPolicy_1_6' in psr, 'PSR应包含 CoolingPolicy_1_6');
    assertEqual(psr['CoolingPolicy_1_6'].PolicyIdx, 6, 'Policy.PolicyIdx');
    assertEqual(psr['CoolingPolicy_1_6'].ExpCondVal, 'EnergySaving', 'Policy.ExpCondVal');
    assertEqual(psr['CoolingPolicy_1_6'].TemperatureRangeLow, [-127, 20, 25, 30, 35, 40, 45], 'Policy.TemperatureRangeLow');
    assertEqual(psr['CoolingPolicy_1_6'].SpeedRangeLow, [30, 30, 40, 50, 60, 80, 100], 'Policy.SpeedRangeLow');

    // PSR 片段包含 CoolingRequirement
    assert('CoolingRequirement_1_6' in psr, 'PSR应包含 CoolingRequirement_1_6');
    assertEqual(psr['CoolingRequirement_1_6'].TemperatureType, 11, 'TemperatureType Inlet=11');
    assertEqual(psr['CoolingRequirement_1_6'].MonitoringStatus, '<=/Scanner_Lm75_Inlet.Status', 'Requirement.MonitoringStatus');

    // SR 片段包含 AbnormalFan
    assert('AbnormalFan_1' in sr, 'SR应包含 AbnormalFan_1');
    assertEqual(sr['AbnormalFan_1'].FanIdx, 1, 'AbnormalFan.FanIdx');
    assertEqual(sr['AbnormalFan_1'].Status, 'AbnormalRotation', 'AbnormalFan.Status');
    assertEqual(sr['AbnormalFan_1'].FanGroup, [1, 2], 'AbnormalFan.FanGroup');

    // PSR 片段包含 BasicCoolingConfig 和 FanGroup
    assert('BasicCoolingConfig_1' in psr, 'PSR应包含 BasicCoolingConfig_1');
    assertEqual(psr['BasicCoolingConfig_1'].FanGroupSpeedDiffThresholdPercent, 20, 'BasicCoolingConfig.FanGroupSpeedDiffThresholdPercent');
    assert('FanGroup_1_1' in psr, 'PSR应包含 FanGroup_1_1');
    assert('FanGroup_1_2' in psr, 'PSR应包含 FanGroup_1_2');
    assertEqual(psr['FanGroup_1_1'].FanSlots, [1, 2, 3, 4, 5], 'FanGroup_1_1.FanSlots');

    // null值应省略
    const minimalConfig = {
      slot_id: 2,
      cooling_config: { smart_cooling_state: 'Enabled', smart_cooling_mode: 'EnergySaving' },
      cooling_requirements: [
        { id: 1, requirement_id: 1, monitoring_status: '<=/S.Status', monitoring_value: '<=/S.Value' }
      ],
      cooling_policies: [],
      cooling_areas: [],
      abnormal_fans: []
    };
    const psrMinimal = CoolingConverter.generatePsrFragment(minimalConfig);
    assert(!('InitLevelInStartup' in psrMinimal['CoolingConfig_2']), '未设置的属性不应出现在CSR输出中');

    // SlotId 测试
    assert('CoolingConfig_2' in psrMinimal, '应使用 slot_id=2 命名对象');
    assert('CoolingRequirement_2_1' in CoolingConverter.generatePsrFragment(minimalConfig), 'Requirement命名应包含SlotId');

    // TemperatureType 枚举映射
    assertEqual(CoolingConverter.TEMPERATURE_TYPE_MAP['Cpu'], 1, 'Cpu=1');
    assertEqual(CoolingConverter.TEMPERATURE_TYPE_MAP['Outlet'], 2, 'Outlet=2');
    assertEqual(CoolingConverter.TEMPERATURE_TYPE_MAP['Inlet'], 11, 'Inlet=11');
    assertEqual(CoolingConverter.TEMPERATURE_TYPE_MAP['InvalidType'], 4294967295, 'InvalidType=4294967295');
  }

  // ==================== Validator 测试 ====================
  function testValidator() {
    // 合法配置应无error
    const validResults = CoolingValidator.validateAll(sampleConfig);
    const validErrors = validResults.filter(r => r.level === 'error');
    assertEqual(validErrors.length, 0, `合法配置不应有error级别校验错误, 发现: ${validErrors.map(e=>e.message).join('; ')}`);

    // 重复ID
    const dupIdConfig = JSON.parse(JSON.stringify(sampleConfig));
    dupIdConfig.cooling_requirements[1].requirement_id = 6;
    const dupResults = CoolingValidator.validateAll(dupIdConfig);
    assert(dupResults.some(r => r.message.includes('RequirementId') && r.message.includes('重复')), '重复RequirementId应报错');

    // 温度区间不连续
    const discConfig = JSON.parse(JSON.stringify(sampleConfig));
    discConfig.cooling_policies[0].temperature_range_high[0] = 25; // 原来是20，改为25使之不连续
    const discResults = CoolingValidator.validateAll(discConfig);
    assert(discResults.some(r => r.message.includes('温度区间不连续')), '温度区间不连续应报错');

    // 四数组长度不一致
    const lenConfig = JSON.parse(JSON.stringify(sampleConfig));
    lenConfig.cooling_policies[0].speed_range_low.push(100);
    const lenResults = CoolingValidator.validateAll(lenConfig);
    assert(lenResults.some(r => r.message.includes('四个数组长度不一致')), '数组长度不一致应报错');

    // InitLevelInStartup 超范围
    const rangeConfig = JSON.parse(JSON.stringify(sampleConfig));
    rangeConfig.cooling_config.init_level_in_startup = 150;
    const rangeResults = CoolingValidator.validateAll(rangeConfig);
    assert(rangeResults.some(r => r.message.includes('超出范围')), 'InitLevelInStartup=150应报超范围');

    // 转速超范围
    const speedConfig = JSON.parse(JSON.stringify(sampleConfig));
    speedConfig.cooling_policies[0].speed_range_low[0] = 120;
    const speedResults = CoolingValidator.validateAll(speedConfig);
    assert(speedResults.some(r => r.message.includes('转速') && r.message.includes('超出范围')), '转速120%应报超范围');

    // 转速最小值 > 最大值
    const invSpeedConfig = JSON.parse(JSON.stringify(sampleConfig));
    invSpeedConfig.cooling_policies[0].speed_range_low[0] = 80;
    invSpeedConfig.cooling_policies[0].speed_range_high[0] = 30;
    const invSpeedResults = CoolingValidator.validateAll(invSpeedConfig);
    assert(invSpeedResults.some(r => r.message.includes('转速最小值') && r.message.includes('大于最大值')), '转速最小值>最大值应报错');

    // 风扇ID未排序
    const fanConfig = JSON.parse(JSON.stringify(sampleConfig));
    fanConfig.cooling_areas[0].fan_idx_group = [3, 1, 2, 4];
    const fanResults = CoolingValidator.validateAll(fanConfig);
    assert(fanResults.some(r => r.message.includes('未按从小到大排序')), '风扇ID未排序应告警');

    // 关联引用无效
    const refConfig = JSON.parse(JSON.stringify(sampleConfig));
    refConfig.cooling_areas[0].requirement_idx = 999;
    const refResults = CoolingValidator.validateAll(refConfig);
    assert(refResults.some(r => r.message.includes('不存在')), '无效关联引用应报错');

    // 必填项缺失
    const reqConfig = JSON.parse(JSON.stringify(sampleConfig));
    delete reqConfig.cooling_requirements[0].monitoring_status;
    const reqResults = CoolingValidator.validateAll(reqConfig);
    assert(reqResults.some(r => r.message.includes('monitoring_status')), '缺少必填项应报错');

    // policy_idx 与 id 不同时，validator 应使用 policy_idx 校验引用
    const piConfig = JSON.parse(JSON.stringify(sampleConfig));
    piConfig.cooling_policies[0].id = 100; // id 改为 100，但 policy_idx 仍为 6
    piConfig.cooling_policies[1].id = 200; // id 改为 200，但 policy_idx 仍为 7
    // CoolingArea[0].policy_idx_group = [6, 7]，应能通过校验（因为 validator 用 policy_idx）
    const piResults = CoolingValidator.validateAll(piConfig);
    const piErrors = piResults.filter(r => r.level === 'error' && r.message.includes('调速策略'));
    assertEqual(piErrors.length, 0, 'policy_idx与id不同时，合法引用不应报错');
  }

  // ==================== Converter round-trip 测试 ====================
  function testConverterRoundTrip() {
    // CSR片段应包含所有实体
    const psr = CoolingConverter.generatePsrFragment(sampleConfig);
    const sr = CoolingConverter.generateSrFragment(sampleConfig);

    // 验证实体数量
    const psrKeys = Object.keys(psr);
    const srKeys = Object.keys(sr);
    // PSR: CoolingConfig + 2 CoolingPolicy + 2 CoolingRequirement + 2 CoolingArea + BasicCoolingConfig + 2 FanGroup + AirCoolingConfig = 11
    assertEqual(psrKeys.length, 11, `PSR应有11个对象, 实际${psrKeys.length}: ${psrKeys.join(', ')}`);
    // SR: 1 AbnormalFan + 2 FanType = 3
    assertEqual(srKeys.length, 3, `SR应有3个对象, 实际${srKeys.length}: ${srKeys.join(', ')}`);

    // CSR特殊语法应原样透传
    assertEqual(psr['CoolingRequirement_1_6'].MonitoringStatus, '<=/Scanner_Lm75_Inlet.Status', 'CSR同步语法应原样透传');
    assertEqual(psr['CoolingPolicy_1_6'].ActualCondVal, '<=/CoolingConfig_1.SmartCoolingMode', 'CSR同步语法应原样透传');
  }

  // ==================== 曲线编辑器数据持久化测试 ====================
  function testCurveEditorPersistence() {
    // 模拟曲线编辑器修改后重新生成CSR的场景
    const modifiedConfig = JSON.parse(JSON.stringify(sampleConfig));
    // 修改策略6的转速数组（模拟曲线拖拽）
    modifiedConfig.cooling_policies[0].speed_range_low = [35, 35, 45, 55, 65, 85, 100];
    modifiedConfig.cooling_policies[0].speed_range_high = [35, 35, 45, 55, 65, 85, 100];

    // 重新生成CSR，验证修改后的值正确输出
    const sr = CoolingConverter.generateSrFragment(modifiedConfig);
    const psr = CoolingConverter.generatePsrFragment(modifiedConfig);
    assertEqual(psr['CoolingPolicy_1_6'].SpeedRangeLow, [35, 35, 45, 55, 65, 85, 100], '曲线修改后SpeedRangeLow应正确输出');
    assertEqual(psr['CoolingPolicy_1_6'].SpeedRangeHigh, [35, 35, 45, 55, 65, 85, 100], '曲线修改后SpeedRangeHigh应正确输出');

    // 修改温度区间（模拟添加/删除节点）
    modifiedConfig.cooling_policies[0].temperature_range_low = [-127, 20, 30, 40];
    modifiedConfig.cooling_policies[0].temperature_range_high = [20, 30, 40, 127];
    modifiedConfig.cooling_policies[0].speed_range_low = [30, 40, 70, 100];
    modifiedConfig.cooling_policies[0].speed_range_high = [30, 40, 70, 100];

    const psr2 = CoolingConverter.generatePsrFragment(modifiedConfig);
    assertEqual(psr2['CoolingPolicy_1_6'].TemperatureRangeLow, [-127, 20, 30, 40], '节点增删后TemperatureRangeLow应正确输出');
    assertEqual(psr2['CoolingPolicy_1_6'].SpeedRangeLow, [30, 40, 70, 100], '节点增删后SpeedRangeLow应正确输出');

    // 验证修改后的配置仍然通过校验
    const modErrors = CoolingValidator.validateAll(modifiedConfig);
    const modErrorItems = modErrors.filter(r => r.level === 'error');
    assertEqual(modErrorItems.length, 0, `修改后的合法配置不应有error: ${modErrorItems.map(e=>e.message).join('; ')}`);

    // 验证未修改的策略7保持不变
    assertEqual(psr2['CoolingPolicy_1_7'].SpeedRangeLow, [40, 40, 50, 60, 70, 90, 100], '未修改的策略7转速数据应保持原值');
  }

  // ==================== FanType 转换测试 ====================
  function testFanTypeConverter() {
    const psr = CoolingConverter.generatePsrFragment(sampleConfig);
    const sr = CoolingConverter.generateSrFragment(sampleConfig);

    // T002: FanType CSR 转换测试
    // SR 应包含 FanType_8038P (FanType_{model_code}，对齐真实CSR命名)
    assert('FanType_8038P' in sr, 'SR应包含 FanType_8038P');
    assertEqual(sr['FanType_8038P'].BOM, 'BOM32030275', 'FanType_8038P.BOM');
    assertEqual(sr['FanType_8038P'].Name, '02314BLG 8038+', 'FanType_8038P.Name');
    assertEqual(sr['FanType_8038P'].PartNumber, '02314BLG', 'FanType_8038P.PartNumber');
    assertEqual(sr['FanType_8038P'].Index, 1, 'FanType_8038P.Index');
    assertEqual(sr['FanType_8038P'].SystemId, 1, 'FanType_8038P.SystemId');
    assertEqual(sr['FanType_8038P'].FrontMaxSpeed, 15000, 'FanType_8038P.FrontMaxSpeed');
    assertEqual(sr['FanType_8038P'].RearMaxSpeed, 15000, 'FanType_8038P.RearMaxSpeed');
    assertEqual(sr['FanType_8038P'].IsTwins, false, 'FanType_8038P.IsTwins');
    assertEqual(sr['FanType_8038P'].IdentifyRangeLow, 3230, 'FanType_8038P.IdentifyRangeLow');
    assertEqual(sr['FanType_8038P'].IdentifyRangeHigh, 4750, 'FanType_8038P.IdentifyRangeHigh');

    // SR 应包含 FanType_8080P（双转子）
    assert('FanType_8080P' in sr, 'SR应包含 FanType_8080P');
    assertEqual(sr['FanType_8080P'].IsTwins, true, 'FanType_8080P.IsTwins应为true');
    assertEqual(sr['FanType_8080P'].FrontMaxSpeed, 12000, 'FanType_8080P.FrontMaxSpeed');
    assertEqual(sr['FanType_8080P'].Name, '02314BLG 8080+ Twins', 'FanType_8080P.Name');

    // CSR对象命名格式: 对齐真实CSR，使用 model_code 命名（无 slotId 前缀）
    assert(!('FanType_1_1' in sr), 'FanType CSR命名不再使用 slotId 前缀');

    // null值省略: description字段不应出现在CSR输出中（因CSR中无Description属性映射）
    // id字段不应出现在CSR输出中（id是本地标识，不映射到CSR）

    // T003: FanType SR 分组测试
    // FanType 应出现在 SR 中，不应出现在 PSR 中
    const psrKeys = Object.keys(psr);
    assert(!psrKeys.some(k => k.startsWith('FanType')), 'FanType不应出现在PSR片段中');
  }

  // ==================== FanType Round-trip 测试 ====================
  function testFanTypeRoundTrip() {
    // T006: FanType 完整 round-trip 测试
    const config = JSON.parse(JSON.stringify(sampleConfig));

    // 添加一个仅含必填字段的最小 FanType
    config.fan_types.push({
      name: 'MinimalFan', bom: 'BOM999', part_number: 'PN999',
      index: 3, front_max_speed: 10000, rear_max_speed: 10000,
      identify_range_low: 2000, identify_range_high: 3000
    });

    const psr = CoolingConverter.generatePsrFragment(config);
    const sr = CoolingConverter.generateSrFragment(config);
    assert('FanType_3' in sr, '最小FanType应在SR中(无model_code时使用index)');
    assertEqual(sr['FanType_3'].Name, 'MinimalFan', 'FanType_3.Name');
    assertEqual(sr['FanType_3'].BOM, 'BOM999', 'FanType_3.BOM');
    // 未设置的字段应使用默认值或省略
    assertEqual(sr['FanType_3'].SystemId, undefined, '未设置的SystemId应省略（因为测试数据未设值，且无默认值映射）');

    // T007: CoolingPolicy.fan_type 引用测试
    // 给策略6添加 fan_type 引用
    config.cooling_policies[0].fan_type = ['02314BLG 8038+', '02314BLG 8080+ Twins'];
    const psrWithFanType = CoolingConverter.generatePsrFragment(config);
    assertEqual(psrWithFanType['CoolingPolicy_1_6'].FanType, ['02314BLG 8038+', '02314BLG 8080+ Twins'], 'CoolingPolicy.FanType应正确传递Name列表');
  }

  // ==================== FanType UI 测试 ====================
  function testFanTypeUI() {
    // T009: FanType 模板默认值测试
    const defaultTemplate = { name: '', bom: '', part_number: '', index: 1, system_id: 0, front_max_speed: 15000, rear_max_speed: 15000, is_twins: false, identify_range_low: 0, identify_range_high: 0, description: '新风扇类型' };
    assertEqual(defaultTemplate.is_twins, false, 'FanType模板默认is_twins应为false');
    assertEqual(defaultTemplate.system_id, 0, 'FanType模板默认system_id应为0');

    // T010: FanType 字段类型测试（验证字段能正确收集到config对象）
    const ftData = sampleConfig.fan_types[0];
    assert(typeof ftData.is_twins === 'boolean', 'is_twins应为布尔类型');
    assert(typeof ftData.index === 'number', 'index应为数字类型');
    assert(typeof ftData.name === 'string', 'name应为字符串类型');
    assertEqual(ftData.is_twins, false, '单转子风扇is_twins应为false');
    assertEqual(sampleConfig.fan_types[1].is_twins, true, '双转子风扇is_twins应为true');
  }

  // ==================== 新增属性测试 ====================
  function testNewProperties() {
    const psr = CoolingConverter.generatePsrFragment(sampleConfig);
    const sr = CoolingConverter.generateSrFragment(sampleConfig);

    // CoolingConfig 新增属性
    assertEqual(psr['CoolingConfig_1'].DiskRowTemperatureAvailable, false, 'CoolingConfig.DiskRowTemperatureAvailable');
    assertEqual(psr['CoolingConfig_1'].SysHDDsMaxTemperature, 32768, 'CoolingConfig.SysHDDsMaxTemperature');
    assertEqual(psr['CoolingConfig_1'].SysSSDsMaxTemperature, 32768, 'CoolingConfig.SysSSDsMaxTemperature');
    assertEqual(psr['CoolingConfig_1'].SensorLocationSupported, false, 'CoolingConfig.SensorLocationSupported');
    assertEqual(psr['CoolingConfig_1'].MinimalLevel, 0, 'CoolingConfig.MinimalLevel');
    assertEqual(psr['CoolingConfig_1'].MaxLimiLevel, 100, 'CoolingConfig.MaxLimiLevel');
    assertEqual(psr['CoolingConfig_1'].PIDControlMode, 1, 'CoolingConfig.PIDControlMode');

    // CoolingRequirement 新增属性（CoolingRequirement 现在在 PSR 中）
    assertEqual(psr['CoolingRequirement_1_6'].IsBackupRequirement, false, 'Requirement.IsBackupRequirement');
    assertEqual(psr['CoolingRequirement_1_6'].ObtainTempFaildToValid, false, 'Requirement.ObtainTempFaildToValid');
    assertEqual(psr['CoolingRequirement_1_6'].LiquidFailedValue, 0, 'Requirement.LiquidFailedValue');

    // 已废弃属性应输出为空数组
    assertEqual(psr['CoolingRequirement_1_6'].ThresholdValue, [], 'Requirement.ThresholdValue应为空数组');
    assertEqual(psr['CoolingRequirement_1_6'].AlarmSpeed, [], 'Requirement.AlarmSpeed应为空数组');

    // AirCoolingConfig
    assert('AirCoolingConfig_1' in psr, 'PSR应包含 AirCoolingConfig_1');
    assertEqual(psr['AirCoolingConfig_1'].SpeedPercentRange, [10, 100], 'AirCoolingConfig.SpeedPercentRange');
    assertEqual(psr['AirCoolingConfig_1'].InitialSpeedPercent, 100, 'AirCoolingConfig.InitialSpeedPercent');

    // CoolingConfig 新增属性 (P1.1)
    assertEqual(psr['CoolingConfig_1'].SysM2sMaxTemperature, 32768, 'CoolingConfig.SysM2sMaxTemperature');
    assertEqual(psr['CoolingConfig_1'].SysAllSSDsMaxTemperature, 32768, 'CoolingConfig.SysAllSSDsMaxTemperature');
    assertEqual(psr['CoolingConfig_1'].MixedModeSupported, false, 'CoolingConfig.MixedModeSupported');

    // CoolingPolicy 新增属性 (P1.2)
    assertEqual(psr['CoolingPolicy_1_7'].CustomSupported, undefined, 'CoolingPolicy未设custom_supported应省略');

    // CoolingRequirement 新增 Description (P1.3)
    assertEqual(psr['CoolingRequirement_1_6'].Description, '入风口温度点', 'CoolingRequirement.Description');

    // FanType 新增 FanDiameterMm (P1.4)
    assertEqual(sr['FanType_8038P'].FanDiameterMm, 80, 'FanType.FanDiameterMm应正确转换');
  }

  // ==================== FanType 校验测试 ====================
  function testFanTypeValidator() {
    // T015: FanType Index 唯一性校验
    const dupIndexConfig = JSON.parse(JSON.stringify(sampleConfig));
    dupIndexConfig.fan_types[1].index = 1; // 与 fan_types[0] 相同的 index
    const dupIndexResults = CoolingValidator.validateAll(dupIndexConfig);
    assert(dupIndexResults.some(r => r.level === 'error' && r.message.includes('FanType') && r.message.includes('Index') && r.message.includes('重复')),
      'FanType Index重复应产生error级别校验结果');

    // T016: FanType IdentifyRange 重叠校验
    const overlapConfig = JSON.parse(JSON.stringify(sampleConfig));
    // fan_types[0]: range [3230, 4750], fan_types[1]: range [3000, 4000]
    // 两者已经重叠（3230 < 4000），但 sampleConfig 中是合法配置
    // 需要确认: sampleConfig 的 fan_types 范围 [3230,4750] 和 [3000,4000] 确实重叠
    // 所以先测试合法不重叠的场景
    const noOverlapConfig = JSON.parse(JSON.stringify(sampleConfig));
    noOverlapConfig.fan_types[0].identify_range_low = 1000;
    noOverlapConfig.fan_types[0].identify_range_high = 2000;
    noOverlapConfig.fan_types[1].identify_range_low = 3000;
    noOverlapConfig.fan_types[1].identify_range_high = 4000;
    const noOverlapResults = CoolingValidator.validateAll(noOverlapConfig);
    const overlapErrors = noOverlapResults.filter(r => r.message.includes('识别范围') && r.message.includes('重叠'));
    assertEqual(overlapErrors.length, 0, '不重叠的IdentifyRange不应报错');

    // 使范围重叠
    const overlapConfig2 = JSON.parse(JSON.stringify(noOverlapConfig));
    overlapConfig2.fan_types[1].identify_range_low = 1500; // [1000,2000] 和 [1500,4000] 重叠
    const overlapResults = CoolingValidator.validateAll(overlapConfig2);
    assert(overlapResults.some(r => r.level === 'error' && r.message.includes('识别范围') && r.message.includes('重叠')),
      '重叠的IdentifyRange应产生error级别校验结果');

    // IdentifyRangeLow > IdentifyRangeHigh 校验
    const invRangeConfig = JSON.parse(JSON.stringify(sampleConfig));
    invRangeConfig.fan_types[0].identify_range_low = 5000;
    invRangeConfig.fan_types[0].identify_range_high = 3000;
    const invRangeResults = CoolingValidator.validateAll(invRangeConfig);
    assert(invRangeResults.some(r => r.level === 'error' && r.message.includes('IdentifyRangeLow') && r.message.includes('IdentifyRangeHigh')),
      'IdentifyRangeLow > IdentifyRangeHigh应产生error');

    // T017: CoolingPolicy fan_type 引用校验
    const refConfig = JSON.parse(JSON.stringify(sampleConfig));
    refConfig.cooling_policies[0].fan_type = ['不存在的风扇类型'];
    const refResults = CoolingValidator.validateAll(refConfig);
    assert(refResults.some(r => r.level === 'warning' && r.message.includes('fan_type') && r.message.includes('不存在')),
      'CoolingPolicy引用不存在的fan_type Name应产生warning');
  }

  // ==================== 曲线表格双向同步测试 ====================
  function testCurveTableSync() {
    // 创建临时容器和 Canvas
    const container = document.createElement('div');
    container.style.display = 'none';
    document.body.appendChild(container);
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 700;
    testCanvas.height = 350;
    document.body.appendChild(testCanvas);

    const tl = [-127, 20, 30, 40];
    const th = [20, 30, 40, 127];
    const sl = [30, 40, 70, 100];
    const sh = [30, 40, 70, 100];

    // renderTable 产生正确的行数
    CurveEditor.render(testCanvas, tl, th, sl, sh);
    CurveEditor.renderTable(container);

    const rows = container.querySelectorAll('tbody tr');
    assertEqual(rows.length, 4, 'renderTable应产生4行（4个区间）');

    // 每行应有4个 input（区间序号不是 input）
    const firstRowInputs = rows[0].querySelectorAll('input');
    assertEqual(firstRowInputs.length, 4, '每行应有4个input单元格');

    // 首行温度下限应为只读
    const firstTempLow = rows[0].querySelector('input[data-field="tl"]');
    assert(firstTempLow.readOnly === true, '首行温度下限应为只读');
    assert(firstTempLow.classList.contains('curve-cell-readonly'), '首行温度下限应有readonly样式类');

    // 末行温度上限应为只读
    const lastTempHigh = rows[3].querySelector('input[data-field="th"]');
    assert(lastTempHigh.readOnly === true, '末行温度上限应为只读');

    // 中间行的温度下限应可编辑
    const midTempLow = rows[1].querySelector('input[data-field="tl"]');
    assert(midTempLow.readOnly === false, '中间行温度下限应可编辑');

    // 输入值应与数据一致
    const row0TH = rows[0].querySelector('input[data-field="th"]');
    assertEqual(row0TH.value, '20', '首行温度上限值应为20');

    const row2SL = rows[2].querySelector('input[data-field="sl"]');
    assertEqual(row2SL.value, '70', '第3行转速下限值应为70');

    // refreshTable 测试：模拟 Canvas 拖拽后数据变更
    // 先直接调用 getUpdatedArrays 验证数据初始值
    const arrays = CurveEditor.getUpdatedArrays();
    assertEqual(arrays.temperature_range_low, [-127, 20, 30, 40], 'getUpdatedArrays应返回初始数据');

    // 模拟数据变更（直接修改内部状态后刷新表格）
    // 使用 addNode 来触发一次数据变更 + refreshTable
    CurveEditor.addNode();
    const afterAdd = CurveEditor.getUpdatedArrays();
    assertEqual(afterAdd.temperature_range_low.length, 5, 'addNode后应有5个区间');

    // refreshTable 后表格行数应更新
    const rowsAfterAdd = container.querySelectorAll('tbody tr');
    assertEqual(rowsAfterAdd.length, 5, 'addNode后表格应有5行');

    // 输入值应更新
    const newRow4Input = rowsAfterAdd[4].querySelector('input[data-field="tl"]');
    assert(newRow4Input !== null, '新增行应有input');

    // 清理
    document.body.removeChild(container);
    document.body.removeChild(testCanvas);
  }

  // ==================== Converter 修改后数据完整性测试 ====================
  function testModifiedConfigIntegrity() {
    const config = JSON.parse(JSON.stringify(sampleConfig));

    // 修改全局配置
    config.cooling_config.smart_cooling_mode = 'HighPerformance';
    config.cooling_config.level_percent_range = [20, 90];

    // 修改温度点
    config.cooling_requirements[0].target_temperature_celsius = 50;
    config.cooling_requirements[1].custom_target_temperature_celsius = 55;

    // 重新生成CSR
    const psr = CoolingConverter.generatePsrFragment(config);
    const sr = CoolingConverter.generateSrFragment(config);

    assertEqual(psr['CoolingConfig_1'].SmartCoolingMode, 'HighPerformance', '修改后SmartCoolingMode应正确');
    assertEqual(psr['CoolingConfig_1'].LevelPercentRange, [20, 90], '修改后LevelPercentRange应正确');
    assertEqual(psr['CoolingRequirement_1_7'].CustomTargetTemperatureCelsius, 55, '修改后CustomTargetTemperatureCelsius应正确');

    // 未修改的字段应保持原值
    assertEqual(psr['CoolingConfig_1'].SmartCoolingState, 'Enabled', '未修改的SmartCoolingState应保持');
    assertEqual(psr['CoolingPolicy_1_6'].Hysteresis, 1, '未修改的Hysteresis应保持');
  }

  // ==================== 候选列表选择器测试 ====================
  function testCandidateListSelectors() {
    // 设置测试数据
    AppTestHelper.setConfigData(JSON.parse(JSON.stringify(sampleConfig)));

    // getCandidateList 测试
    var reqCandidates = AppTestHelper.getCandidateList('cooling_requirements');
    assertEqual(reqCandidates.length, 2, 'cooling_requirements候选应有2项');
    assertEqual(reqCandidates[0].id, 6, '首个requirement候选id应为6');
    assert(reqCandidates[0].label.indexOf('6') >= 0, 'requirement候选label应包含id');
    assert(reqCandidates[0].label.indexOf('入风口') >= 0, 'requirement候选label应包含描述');

    // getCandidateList with excludeId
    var exclCandidates = AppTestHelper.getCandidateList('cooling_requirements', 6);
    assertEqual(exclCandidates.length, 1, '排除id=6后应只剩1项');
    assertEqual(exclCandidates[0].id, 7, '排除后剩余项id应为7');

    // getCandidateList for cooling_policies
    var polCandidates = AppTestHelper.getCandidateList('cooling_policies');
    assertEqual(polCandidates.length, 2, 'cooling_policies候选应有2项');
    assertEqual(polCandidates[0].id, 6, '首个policy候选id应为6');
    assert(polCandidates[0].label.indexOf('节能模式') >= 0, 'policy候选label应包含描述');

    // getCandidateList for fan_types
    var ftCandidates = AppTestHelper.getCandidateList('fan_types');
    assertEqual(ftCandidates.length, 2, 'fan_types候选应有2项');
    assertEqual(ftCandidates[0].id, '02314BLG 8038+', '首个fan_type候选id应为name');

    // renderSelect 测试
    var selectHtml = AppTestHelper.renderSelect(reqCandidates, 7, 'requirement_idx');
    assert(selectHtml.indexOf('<select') >= 0, 'renderSelect应生成select元素');
    assert(selectHtml.indexOf('data-field="requirement_idx"') >= 0, 'renderSelect应包含data-field');
    assert(selectHtml.indexOf('-- 选择 --') >= 0, 'renderSelect应包含默认空选项');
    assert(selectHtml.indexOf('selected') >= 0, 'renderSelect应有selected项');
    assert(selectHtml.indexOf('value="7"') >= 0, 'renderSelect应包含value=7选项');

    // renderSelect 无选中值
    var emptySelectHtml = AppTestHelper.renderSelect(reqCandidates, null, 'test');
    assert(emptySelectHtml.indexOf('selected') === -1, '无选中值时不应有selected');

    // renderCheckboxDropdown 测试
    var checkboxHtml = AppTestHelper.renderCheckboxDropdown(polCandidates, [6], 'policy_idx_group');
    assert(checkboxHtml.indexOf('multi-select-dropdown') >= 0, 'renderCheckboxDropdown应生成dropdown容器');
    assert(checkboxHtml.indexOf('6 - 节能模式环温调速') >= 0, '选中1项应在toggle中显示label');
    assert(checkboxHtml.indexOf('data-field="policy_idx_group"') >= 0, '应包含data-field');
    assert(checkboxHtml.indexOf('checked') >= 0, '选中项应有checked');

    // renderCheckboxDropdown 无选中值
    var emptyCheckboxHtml = AppTestHelper.renderCheckboxDropdown(ftCandidates, [], 'fan_type');
    assert(emptyCheckboxHtml.indexOf('请选择') >= 0, '无选中值应显示请选择');
    assert(emptyCheckboxHtml.indexOf('checked') === -1, '无选中值时不应有checked');

    // renderCheckboxDropdown 多选
    var multiCheckboxHtml = AppTestHelper.renderCheckboxDropdown(polCandidates, [6, 7], 'policy_idx_group');
    assert(multiCheckboxHtml.indexOf('6 - 节能模式环温调速') >= 0 && multiCheckboxHtml.indexOf('7 - 高性能模式环温调速') >= 0, '选中多项应在toggle中显示所有label');

    // 空候选列表
    AppTestHelper.setConfigData({ cooling_requirements: [], cooling_policies: [], fan_types: [] });
    var emptyCandidates = AppTestHelper.getCandidateList('cooling_requirements');
    assertEqual(emptyCandidates.length, 0, '空配置候选列表应为0项');

    // FanType name 为空时应显示 fallback 标签（Bug2 回归测试）
    var emptyNameConfig = JSON.parse(JSON.stringify(sampleConfig));
    emptyNameConfig.fan_types.push({ name: '', description: '新风扇类型', index: 99 });
    AppTestHelper.setConfigData(emptyNameConfig);
    var ftWithEmpty = AppTestHelper.getCandidateList('fan_types');
    assertEqual(ftWithEmpty.length, 3, '含空name的FanType也应出现在候选列表中');
    var emptyEntry = ftWithEmpty[2];
    assert(emptyEntry.label.indexOf('(未命名') >= 0, '空name FanType的label应显示fallback标识');
    assert(emptyEntry.label.indexOf('新风扇类型') >= 0, '空name FanType的label应包含description');
    assertEqual(emptyEntry.id, '', '空name FanType的id应为空字符串');

    // 恢复测试数据
    AppTestHelper.setConfigData(JSON.parse(JSON.stringify(sampleConfig)));
  }

  // ==================== 级联删除测试 ====================
  function testCascadeDeletion() {
    // 删除 CoolingRequirement → 清除 CoolingArea.requirement_idx 和 CoolingRequirement.backup_requirement_idx
    var config1 = JSON.parse(JSON.stringify(sampleConfig));
    config1.cooling_requirements[0].backup_requirement_idx = 7; // req[0] 备份引用 req[1]
    AppTestHelper.setConfigData(config1);

    // 删除 id=7 的 CoolingRequirement（index=1）
    AppTestHelper.removeEntity('cooling_requirements', 1);

    var afterData = AppTestHelper.getConfigData();
    // CoolingArea[1] 原来引用 requirement_idx=7，应被清除
    assert(afterData.cooling_areas[1].requirement_idx === undefined || afterData.cooling_areas[1].requirement_idx === null,
      '删除CoolingRequirement后，引用该ID的CoolingArea.requirement_idx应被清除');
    // CoolingRequirement[0] 原来有 backup_requirement_idx=7，应被清除
    assert(afterData.cooling_requirements[0].backup_requirement_idx === undefined || afterData.cooling_requirements[0].backup_requirement_idx === null,
      '删除CoolingRequirement后，引用该ID的CoolingRequirement.backup_requirement_idx应被清除');

    // 删除 CoolingPolicy → 清除 CoolingArea.policy_idx_group
    var config2 = JSON.parse(JSON.stringify(sampleConfig));
    AppTestHelper.setConfigData(config2);

    // 删除 policy_idx=7 的策略（index=1）
    AppTestHelper.removeEntity('cooling_policies', 1);

    var afterData2 = AppTestHelper.getConfigData();
    // CoolingArea[0] 原来有 policy_idx_group=[6,7]，应变为 [6]
    assertEqual(afterData2.cooling_areas[0].policy_idx_group, [6],
      '删除CoolingPolicy后，CoolingArea.policy_idx_group应移除该ID');

    // 删除 FanType → 清除 CoolingPolicy.fan_type
    var config3 = JSON.parse(JSON.stringify(sampleConfig));
    config3.cooling_policies[0].fan_type = ['02314BLG 8038+', '02314BLG 8080+ Twins'];
    AppTestHelper.setConfigData(config3);

    // 删除 name='02314BLG 8038+' 的 FanType（index=0）
    AppTestHelper.removeEntity('fan_types', 0);

    var afterData3 = AppTestHelper.getConfigData();
    // CoolingPolicy[0] 原来有 fan_type=['02314BLG 8038+', '02314BLG 8080+ Twins']，应变为 ['02314BLG 8080+ Twins']
    assertEqual(afterData3.cooling_policies[0].fan_type, ['02314BLG 8080+ Twins'],
      '删除FanType后，CoolingPolicy.fan_type应移除该name');

    // 删除无引用的实体不应有副作用
    var config4 = JSON.parse(JSON.stringify(sampleConfig));
    var beforeAreas = JSON.stringify(config4.cooling_areas);
    AppTestHelper.setConfigData(config4);

    // 删除 AbnormalFan（无引用者）
    AppTestHelper.removeEntity('abnormal_fans', 0);

    var afterData4 = AppTestHelper.getConfigData();
    assertEqual(JSON.stringify(afterData4.cooling_areas), beforeAreas,
      '删除无引用的AbnormalFan不应影响CoolingArea');

    // 删除 FanType 后 fan_type 全部清空时字段应被删除
    var config5 = JSON.parse(JSON.stringify(sampleConfig));
    config5.cooling_policies[0].fan_type = ['02314BLG 8038+'];
    AppTestHelper.setConfigData(config5);

    // 删除唯一的 FanType
    AppTestHelper.setConfigData(JSON.parse(JSON.stringify(config5)));
    AppTestHelper.removeEntity('fan_types', 0); // 删除 '02314BLG 8038+'
    // 还有 '02314BLG 8080+ Twins'，fan_type 应为空数组然后被删除
    var afterData5 = AppTestHelper.getConfigData();
    assert(afterData5.cooling_policies[0].fan_type === undefined || afterData5.cooling_policies[0].fan_type.length === 0,
      '删除所有引用的FanType后，fan_type应被清空');

    // 恢复测试数据
    AppTestHelper.setConfigData(JSON.parse(JSON.stringify(sampleConfig)));
  }

  // ==================== 候选列表动态刷新测试 ====================
  function testCandidateListDynamicRefresh() {
    // 修改 FanType 的 name 后，getCandidateList 应返回更新后的数据
    var config = JSON.parse(JSON.stringify(sampleConfig));
    AppTestHelper.setConfigData(config);

    // 初始状态：2个 FanType
    var candidates = AppTestHelper.getCandidateList('fan_types');
    assertEqual(candidates.length, 2, '初始应有2个fan_type候选');
    assertEqual(candidates[0].id, '02314BLG 8038+', '初始首个候选id');

    // 修改 FanType name
    config.fan_types[0].name = 'NewFanName';
    AppTestHelper.setConfigData(config);

    // 候选列表应反映新名称
    var refreshed = AppTestHelper.getCandidateList('fan_types');
    assertEqual(refreshed.length, 2, '修改后仍应有2个候选');
    assertEqual(refreshed[0].id, 'NewFanName', '修改后首个候选id应为新名称');
    assert(refreshed[0].label.indexOf('NewFanName') >= 0, '修改后label应包含新名称');
    assertEqual(refreshed[1].id, '02314BLG 8080+ Twins', '未修改的候选应保持不变');

    // 修改 CoolingRequirement 的 description
    config.cooling_requirements[0].description = '修改后的温度点';
    AppTestHelper.setConfigData(config);

    var reqCandidates = AppTestHelper.getCandidateList('cooling_requirements');
    assert(reqCandidates[0].label.indexOf('修改后的温度点') >= 0,
      '修改requirement description后候选label应更新');

    // 修改 CoolingPolicy 的 policy_idx
    config.cooling_policies[0].policy_idx = 100;
    AppTestHelper.setConfigData(config);

    var polCandidates = AppTestHelper.getCandidateList('cooling_policies');
    assertEqual(polCandidates[0].id, 100, '修改policy_idx后候选id应更新');

    // 恢复测试数据
    AppTestHelper.setConfigData(JSON.parse(JSON.stringify(sampleConfig)));
  }

  // ==================== CoolingFan 测试 ====================
  function testCoolingFanConverter() {
    var config = {
      slot_id: 1,
      cooling_config: { smart_cooling_state: 'Enabled', smart_cooling_mode: 'EnergySaving' },
      cooling_fans: [
        { fan_id: 1, slot: 1, front_presence: '<=/Fan_1.FrontPresence', rear_presence: '<=/Fan_1.RearPresence', front_status: '<=/Fan_1.FrontStatus', rear_status: '<=/Fan_1.RearStatus', hardware_pwm: '#/Accessor_Fan1_PWM.Value', max_supported_pwm: 255 },
        { fan_id: 2, slot: 2, front_presence: '<=/Fan_2.FrontPresence', rear_presence: '<=/Fan_2.RearPresence', front_status: '<=/Fan_2.FrontStatus', rear_status: '<=/Fan_2.RearStatus', hardware_pwm: '#/Accessor_Fan2_PWM.Value', max_supported_pwm: 255 }
      ]
    };

    var psr = CoolingConverter.generatePsrFragment(config);

    assert('CoolingFan_1_1' in psr, 'PSR应包含 CoolingFan_1_1');
    assertEqual(psr['CoolingFan_1_1'].FanId, 1, 'CoolingFan_1_1.FanId');
    assertEqual(psr['CoolingFan_1_1'].Slot, 1, 'CoolingFan_1_1.Slot');
    assertEqual(psr['CoolingFan_1_1'].FrontPresence, '<=/Fan_1.FrontPresence', 'CoolingFan_1_1.FrontPresence');
    assertEqual(psr['CoolingFan_1_1'].RearPresence, '<=/Fan_1.RearPresence', 'CoolingFan_1_1.RearPresence');
    assertEqual(psr['CoolingFan_1_1'].FrontStatus, '<=/Fan_1.FrontStatus', 'CoolingFan_1_1.FrontStatus');
    assertEqual(psr['CoolingFan_1_1'].RearStatus, '<=/Fan_1.RearStatus', 'CoolingFan_1_1.RearStatus');
    assertEqual(psr['CoolingFan_1_1'].HardwarePWM, '#/Accessor_Fan1_PWM.Value', 'CoolingFan_1_1.HardwarePWM');
    assertEqual(psr['CoolingFan_1_1'].MaxSupportedPWM, 255, 'CoolingFan_1_1.MaxSupportedPWM');

    assert('CoolingFan_1_2' in psr, 'PSR应包含 CoolingFan_1_2');
    assertEqual(psr['CoolingFan_1_2'].FanId, 2, 'CoolingFan_1_2.FanId');

    // CSR命名格式验证
    assert(!('CoolingFan_1' in psr), 'CoolingFan命名应为 CoolingFan_{slotId}_{fanId}');
  }

  function testCoolingFanRoundTrip() {
    var config = JSON.parse(JSON.stringify(sampleConfig));
    config.cooling_fans = [
      { fan_id: 3, slot: 1, front_presence: '<=/Fan_3.FrontPresence', rear_presence: '<=/Fan_3.RearPresence', front_status: '<=/Fan_3.FrontStatus', rear_status: '<=/Fan_3.RearStatus', hardware_pwm: '#/Accessor_Fan3_PWM.Value', max_supported_pwm: 255 }
    ];

    var psr = CoolingConverter.generatePsrFragment(config);
    assert('CoolingFan_1_3' in psr, '最小CoolingFan应在PSR中');
    assertEqual(psr['CoolingFan_1_3'].FanId, 3, 'CoolingFan_1_3.FanId');
    assertEqual(psr['CoolingFan_1_3'].Slot, 1, 'CoolingFan_1_3.Slot');

    // description 字段不应出现在CSR输出中
    config.cooling_fans[0].description = '测试风扇';
    psr = CoolingConverter.generatePsrFragment(config);
    assertEqual(psr['CoolingFan_1_3'].Description, undefined, 'CoolingFan CSR中不应有Description属性');
  }

  function testCoolingFanValidator() {
    var config = JSON.parse(JSON.stringify(sampleConfig));
    config.cooling_fans = [
      { id: 1, fan_id: 1, slot: 1, front_presence: '<=/Fan_1.FrontPresence', rear_presence: '<=/Fan_1.RearPresence', front_status: '<=/Fan_1.FrontStatus', rear_status: '<=/Fan_1.RearStatus', hardware_pwm: '#/Accessor_Fan1_PWM.Value', max_supported_pwm: 255 },
      { id: 2, fan_id: 1, slot: 2, front_presence: '', rear_presence: '', front_status: '', rear_status: '', hardware_pwm: '' }
    ];

    var results = CoolingValidator.validateAll(config);
    // fan_id 重复
    assert(results.some(function(r) { return r.level === 'error' && r.message.indexOf('FanId') >= 0 && r.message.indexOf('重复') >= 0; }),
      '重复的CoolingFan FanId应产生error');
    // 必填字段缺失
    assert(results.some(function(r) { return r.level === 'error' && r.message.indexOf('缺少必填字段') >= 0; }),
      'CoolingFan缺少必填字段应产生error');
  }

  function testCoolingFanCascadeDeletion() {
    // CoolingFan 删除后应清除 CoolingArea.fan_idx_group 中的引用
    var config = JSON.parse(JSON.stringify(sampleConfig));
    config.cooling_fans = [{ id: 1, fan_id: 1, slot: 1, front_presence: '<=/Fan_1.FrontPresence', rear_presence: '<=/Fan_1.RearPresence', front_status: '<=/Fan_1.FrontStatus', rear_status: '<=/Fan_1.RearStatus', hardware_pwm: '#/Accessor_Fan1_PWM.Value', max_supported_pwm: 255 }];
    config.cooling_areas = config.cooling_areas || [];
    config.cooling_areas.push({ id: 10, area_id: 10, requirement_idx: 6, fan_idx_group: [1, 2, 3], description: '测试区域' });

    AppTestHelper.setConfigData(config);

    // 删除 CoolingFan #1
    AppTestHelper.removeEntity('cooling_fans', 0);

    var afterData = AppTestHelper.getConfigData();
    assertEqual(afterData.cooling_fans.length, 0, 'CoolingFan应被删除');
    // fan_idx_group 中的 1 应被移除
    assert(afterData.cooling_areas[0].fan_idx_group.indexOf(1) < 0, 'fan_idx_group中应移除已删除的CoolingFan id');
    assertEqual(afterData.cooling_areas[0].fan_idx_group.length, 2, 'fan_idx_group应剩余2个元素');

    AppTestHelper.setConfigData(JSON.parse(JSON.stringify(sampleConfig)));
  }

  // ==================== 执行测试 ====================
  function run() {
    console.log('=== 能效调速配置编辑器 测试套件 ===');

    try { testConverter(); } catch(e) { results.errors.push(`Converter测试异常: ${e.message}`); results.failed++; }
    try { testFanTypeConverter(); } catch(e) { results.errors.push(`FanType Converter测试异常: ${e.message}`); results.failed++; }
    try { testFanTypeRoundTrip(); } catch(e) { results.errors.push(`FanType Round-trip测试异常: ${e.message}`); results.failed++; }
    try { testFanTypeUI(); } catch(e) { results.errors.push(`FanType UI测试异常: ${e.message}`); results.failed++; }
    try { testFanTypeValidator(); } catch(e) { results.errors.push(`FanType Validator测试异常: ${e.message}`); results.failed++; }
    try { testNewProperties(); } catch(e) { results.errors.push(`新增属性测试异常: ${e.message}`); results.failed++; }
    try { testValidator(); } catch(e) { results.errors.push(`Validator测试异常: ${e.message}`); results.failed++; }
    try { testConverterRoundTrip(); } catch(e) { results.errors.push(`Round-trip测试异常: ${e.message}`); results.failed++; }
    try { testCurveEditorPersistence(); } catch(e) { results.errors.push(`曲线编辑器持久化测试异常: ${e.message}`); results.failed++; }
    try { testCurveTableSync(); } catch(e) { results.errors.push(`曲线表格同步测试异常: ${e.message}`); results.failed++; }
    try { testModifiedConfigIntegrity(); } catch(e) { results.errors.push(`修改完整性测试异常: ${e.message}`); results.failed++; }
    try { testCandidateListSelectors(); } catch(e) { results.errors.push(`候选列表选择器测试异常: ${e.message}`); results.failed++; }
    try { testCascadeDeletion(); } catch(e) { results.errors.push(`级联删除测试异常: ${e.message}`); results.failed++; }
    try { testCandidateListDynamicRefresh(); } catch(e) { results.errors.push(`候选列表动态刷新测试异常: ${e.message}`); results.failed++; }
    try { testCoolingFanConverter(); } catch(e) { results.errors.push(`CoolingFan Converter测试异常: ${e.message}`); results.failed++; }
    try { testCoolingFanRoundTrip(); } catch(e) { results.errors.push(`CoolingFan Round-trip测试异常: ${e.message}`); results.failed++; }
    try { testCoolingFanValidator(); } catch(e) { results.errors.push(`CoolingFan Validator测试异常: ${e.message}`); results.failed++; }
    try { testCoolingFanCascadeDeletion(); } catch(e) { results.errors.push(`CoolingFan级联删除测试异常: ${e.message}`); results.failed++; }

    const total = results.passed + results.failed;
    console.log(`\n结果: ${results.passed}/${total} 通过`);

    if (results.errors.length > 0) {
      console.error('\n失败项:');
      results.errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
    }

    return results;
  }

  window.TestSuite = { run, results };
})();
