/**
 * 能效调速 YAML → CSR Objects片段转换器
 * 将YAML配置对象转换为PSR和SR的CSR Objects JSON片段
 */
const CoolingConverter = (() => {

  // TemperatureType 枚举名称 → CSR数值
  const TEMPERATURE_TYPE_MAP = {
    'Cpu': 1, 'Outlet': 2, 'Disk': 3, 'Memory': 4,
    'PCH': 5, 'VRD': 6, 'VDDQ': 7, 'NPUHb': 8,
    'NPUAiCore': 9, 'NPUBoard': 10, 'Inlet': 11,
    'SoCBoardOutlet': 12, 'SoCBoardInlet': 13,
    'InvalidType': 4294967295
  };

  // snake_case → PascalCase 转换
  function toPascalCase(str) {
    return str.replace(/(^|_)(\w)/g, (_, _sep, c) => c.toUpperCase());
  }

  // 构建CSR对象属性，跳过null/undefined值
  function buildAttributes(yamlObj, fieldMappings) {
    const attrs = {};
    for (const [yamlField, csrField] of Object.entries(fieldMappings)) {
      const val = yamlObj[yamlField];
      if (val !== null && val !== undefined) {
        attrs[csrField] = val;
      }
    }
    return attrs;
  }

  // 转换CoolingConfig
  function convertCoolingConfig(config, slotId) {
    const mappings = {
      'smart_cooling_state': 'SmartCoolingState',
      'smart_cooling_mode': 'SmartCoolingMode',
      'level_percent_range': 'LevelPercentRange',
      'init_level_in_startup': 'InitLevelInStartup',
      'fan_board_num': 'FanBoardNum',
      'disk_row_temperature_available': 'DiskRowTemperatureAvailable',
      'sys_hdds_max_temperature': 'SysHDDsMaxTemperature',
      'sys_ssds_max_temperature': 'SysSSDsMaxTemperature',
      'sys_m2s_max_temperature': 'SysM2sMaxTemperature',
      'sys_all_ssds_max_temperature': 'SysAllSSDsMaxTemperature',
      'sensor_location_supported': 'SensorLocationSupported',
      'minimal_level': 'MinimalLevel',
      'max_limi_level': 'MaxLimiLevel',
      'pid_control_mode': 'PIDControlMode',
      'min_allowed_fan_speed_percent': 'MinAllowedFanSpeedPercent',
      'min_allowed_fan_speed_enabled': 'MinAllowedFanSpeedEnabled',
      'mixed_mode_supported': 'MixedModeSupported'
    };
    const attrs = buildAttributes(config, mappings);
    const name = `CoolingConfig_${slotId}`;
    return { [name]: attrs };
  }

  // 转换CoolingRequirement
  function convertCoolingRequirement(req, slotId) {
    const mappings = {
      'requirement_id': 'RequirementId',
      'description': 'Description',
      'monitoring_status': 'MonitoringStatus',
      'monitoring_value': 'MonitoringValue',
      'failed_value': 'FailedValue',
      'backup_requirement_idx': 'BackupRequirementIdx',
      'target_temperature_celsius': 'TargetTemperatureCelsius',
      'smart_cooling_target_temperature': 'SmartCoolingTargetTemperature',
      'max_allowed_temperature_celsius': 'MaxAllowedTemperatureCelsius',
      'custom_supported': 'CustomSupported',
      'custom_target_temperature_celsius': 'CustomTargetTemperatureCelsius',
      'target_temperature_range_celsius': 'TargetTemperatureRangeCelsius',
      'enabled': 'Enabled',
      'sensor_name': 'SensorName',
      'active_in_standby': 'ActiveInStandby',
      'cooling_medium': 'CoolingMedium',
      'is_backup_requirement': 'IsBackupRequirement',
      'obtain_temp_faild_to_valid': 'ObtainTempFaildToValid',
      'liquid_failed_value': 'LiquidFailedValue',
      'pid_p_strategy': 'PIDPStrategy',
      'pid_i_adjust_time': 'PIDIAdjustTime'
    };
    const attrs = buildAttributes(req, mappings);

    // TemperatureType 枚举转换
    if (req.temperature_type && TEMPERATURE_TYPE_MAP.hasOwnProperty(req.temperature_type)) {
      attrs.TemperatureType = TEMPERATURE_TYPE_MAP[req.temperature_type];
    }

    // 已废弃属性：用户无需配置，CSR 输出为空数组
    attrs.ThresholdValue = [];
    attrs.AlarmSpeed = [];

    const name = `CoolingRequirement_${slotId}_${req.id}`;
    return { [name]: attrs };
  }

  // 转换CoolingPolicy
  function convertCoolingPolicy(policy, slotId) {
    const mappings = {
      'policy_idx': 'PolicyIdx',
      'exp_cond_val': 'ExpCondVal',
      'actual_cond_val': 'ActualCondVal',
      'hysteresis': 'Hysteresis',
      'temperature_range_low': 'TemperatureRangeLow',
      'temperature_range_high': 'TemperatureRangeHigh',
      'speed_range_low': 'SpeedRangeLow',
      'speed_range_high': 'SpeedRangeHigh',
      'fan_speed_range_percents': 'FanSpeedRangePercents',
      'pcie_card_name': 'PCIeCardName',
      'hdd_backplane_name': 'HDDBackPlaneName',
      'hdd_rear_backplane_name': 'HDDRearBackPlaneName',
      'fan_type': 'FanType',
      'custom_supported': 'CustomSupported',
      'disk_temp_unavailable_to_valid': 'DiskTempUnavailableToValid',
      'cooling_medium': 'CoolingMedium'
    };
    const attrs = buildAttributes(policy, mappings);

    // PolicyType 枚举
    const policyTypeMap = { 'InletCustom': 1, 'DiskCustom': 2, 'InvalidType': 4294967295 };
    if (policy.policy_type && policyTypeMap.hasOwnProperty(policy.policy_type)) {
      attrs.PolicyType = policyTypeMap[policy.policy_type];
    }

    const name = `CoolingPolicy_${slotId}_${policy.policy_idx}`;
    return { [name]: attrs };
  }

  // 转换CoolingArea
  function convertCoolingArea(area, slotId) {
    const mappings = {
      'area_id': 'AreaId',
      'requirement_idx': 'RequirementIdx',
      'policy_idx_group': 'PolicyIdxGroup',
      'fan_idx_group': 'FanIdxGroup',
      'priority': 'Priority',
      'liquid_cooling_device_group': 'LiquidCoolingDeviceGroup'
    };
    const attrs = buildAttributes(area, mappings);
    const name = `CoolingArea_${slotId}_${area.area_id}`;
    return { [name]: attrs };
  }

  // 转换AbnormalFan
  function convertAbnormalFan(fan, slotId) {
    const mappings = {
      'id': 'Id',
      'fan_idx': 'FanIdx',
      'status': 'Status',
      'fan_group': 'FanGroup',
      'priority': 'Priority',
      'speed_percentage': 'SpeedPercentage'
    };
    const attrs = buildAttributes(fan, mappings);
    const name = `AbnormalFan_${fan.id}`;
    return { [name]: attrs };
  }

  // 转换BasicCoolingConfig + FanGroup
  function convertBasicCoolingConfig(basicConfig, slotId) {
    const result = {};
    const bcAttrs = {};
    if (basicConfig.fan_group_speed_diff_threshold_percent != null) {
      bcAttrs.FanGroupSpeedDiffThresholdPercent = basicConfig.fan_group_speed_diff_threshold_percent;
    }
    if (basicConfig.psu_fan_speed_calibration != null) {
      bcAttrs.PsuFanSpeedCalibration = basicConfig.psu_fan_speed_calibration;
    }
    if (Object.keys(bcAttrs).length > 0) {
      result[`BasicCoolingConfig_${slotId}`] = bcAttrs;
    }

    // FanGroup列表
    if (basicConfig.fan_groups) {
      for (const fg of basicConfig.fan_groups) {
        result[`FanGroup_${slotId}_${fg.id}`] = buildAttributes(fg, {
          'id': 'Id',
          'fan_slots': 'FanSlots'
        });
      }
    }
    return result;
  }

  // 转换FanType
  function convertFanType(fanType, slotId) {
    const mappings = {
      'bom': 'BOM',
      'name': 'Name',
      'part_number': 'PartNumber',
      'index': 'Index',
      'system_id': 'SystemId',
      'front_max_speed': 'FrontMaxSpeed',
      'rear_max_speed': 'RearMaxSpeed',
      'is_twins': 'IsTwins',
      'identify_range_low': 'IdentifyRangeLow',
      'identify_range_high': 'IdentifyRangeHigh',
      'fan_diameter_mm': 'FanDiameterMm'
    };
    const attrs = buildAttributes(fanType, mappings);
    var modelCode = fanType.model_code || String(fanType.index);
    const name = `FanType_${modelCode}`;
    return { [name]: attrs };
  }

  // 转换AirCoolingConfig
  function convertAirCoolingConfig(airConfig, slotId) {
    const mappings = {
      'speed_percent_range': 'SpeedPercentRange',
      'initial_speed_percent': 'InitialSpeedPercent',
      'max_allowed_speed_percent': 'MaxAllowedSpeedPercent',
      'min_allowed_speed_percent': 'MinAllowedSpeedPercent'
    };
    const attrs = buildAttributes(airConfig, mappings);
    return { [`AirCoolingConfig_${slotId}`]: attrs };
  }

  // 转换CoolingFan
  function convertCoolingFan(fan, slotId) {
    const mappings = {
      'fan_id': 'FanId',
      'slot': 'Slot',
      'front_presence': 'FrontPresence',
      'rear_presence': 'RearPresence',
      'front_status': 'FrontStatus',
      'rear_status': 'RearStatus',
      'hardware_pwm': 'HardwarePWM',
      'max_supported_pwm': 'MaxSupportedPWM'
    };
    const attrs = buildAttributes(fan, mappings);
    const name = `CoolingFan_${slotId}_${fan.fan_id}`;
    return { [name]: attrs };
  }

  /**
   * 生成PSR片段
   * 包含: CoolingConfig, CoolingFan, CoolingPolicy, CoolingRequirement, CoolingArea, BasicCoolingConfig, FanGroup, AirCoolingConfig
   */
  function generatePsrFragment(config) {
    const slotId = config.slot_id || 1;
    const result = {};

    // CoolingConfig
    if (config.cooling_config) {
      Object.assign(result, convertCoolingConfig(config.cooling_config, slotId));
    }

    // CoolingFan列表
    if (config.cooling_fans) {
      for (const fan of config.cooling_fans) {
        Object.assign(result, convertCoolingFan(fan, slotId));
      }
    }

    // CoolingPolicy列表
    if (config.cooling_policies) {
      for (const policy of config.cooling_policies) {
        Object.assign(result, convertCoolingPolicy(policy, slotId));
      }
    }

    // CoolingRequirement列表
    if (config.cooling_requirements) {
      for (const req of config.cooling_requirements) {
        Object.assign(result, convertCoolingRequirement(req, slotId));
      }
    }

    // CoolingArea列表
    if (config.cooling_areas) {
      for (const area of config.cooling_areas) {
        Object.assign(result, convertCoolingArea(area, slotId));
      }
    }

    // BasicCoolingConfig + FanGroup
    if (config.basic_cooling_config) {
      Object.assign(result, convertBasicCoolingConfig(config.basic_cooling_config, slotId));
    }

    // AirCoolingConfig
    if (config.air_cooling_config) {
      Object.assign(result, convertAirCoolingConfig(config.air_cooling_config, slotId));
    }

    return result;
  }

  /**
   * 生成SR片段
   * 包含: AbnormalFan, FanType
   */
  function generateSrFragment(config) {
    const slotId = config.slot_id || 1;
    const result = {};

    // AbnormalFan列表
    if (config.abnormal_fans) {
      for (const fan of config.abnormal_fans) {
        Object.assign(result, convertAbnormalFan(fan, slotId));
      }
    }

    // FanType列表
    if (config.fan_types) {
      for (const ft of config.fan_types) {
        Object.assign(result, convertFanType(ft, slotId));
      }
    }

    return result;
  }

  return {
    generatePsrFragment,
    generateSrFragment,
    TEMPERATURE_TYPE_MAP,
    toPascalCase
  };
})();
