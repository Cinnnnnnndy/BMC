// 内置示例工程：EXU 拓展板 ExpBoard_1（BC83SMMB）的一对 CSR 源文件。
// 用于 CSR 拓扑编辑器的默认演示——打开即展示“已选择工程文件”的拓扑状态，
// 无需用户先手动选择工程文件。
//
// 数据来自两份 .sr：
//   • 14100513_920s.sr        —— 硬件描述（ManagementTopology + 硬件对象）
//   • 14100513_920s_soft.sr   —— 软件描述（事件 / 传感器 / 组件 等软件对象）
// 二者共享同一 Unit(EXU/ExpBoard_1)，按 openUBMC 约定合并为单个板卡描述符：
// 硬件的 ManagementTopology 保留，Objects 为两份文件对象的并集（字段级合并，无冲突）。
//
// 如需替换示例，直接替换下面两个常量即可（保持 .sr 的 JSON 结构）。

export interface SrDoc {
  FormatVersion?: string;
  DataVersion?: string;
  Unit?: { Type?: string; Name?: string };
  ManagementTopology?: Record<string, unknown>;
  Objects?: Record<string, Record<string, unknown>>;
  [k: string]: unknown;
}

/** 硬件 .sr（14100513_920s.sr）解析结果 */
export const CSR_SAMPLE_HW_SR: SrDoc = {
  "FormatVersion": "3.00",
  "DataVersion": "3.00",
  "Unit": {
    "Type": "EXU",
    "Name": "ExpBoard_1"
  },
  "ManagementTopology": {
    "Anchor": {
      "Buses": [
        "I2c_1",
        "I2c_2",
        "I2c_3",
        "I2c_4",
        "I2c_5",
        "I2c_6",
        "I2c_7",
        "I2c_8",
        "I2c_9",
        "I2c_11",
        "Jtag_1",
        "JtagOverLocalBus_1",
        "Hisport_0",
        "Hisport_1",
        "Hisport_2",
        "Hisport_3",
        "Hisport_4",
        "Hisport_5",
        "Hisport_6",
        "Hisport_7",
        "Hisport_8",
        "Hisport_9",
        "Hisport_10",
        "Hisport_11",
        "Hisport_12",
        "Hisport_13",
        "Hisport_14",
        "Hisport_15",
        "Hisport_16",
        "Hisport_17",
        "Hisport_18",
        "Hisport_19",
        "Hisport_20",
        "Hisport_21"
      ]
    },
    "I2c_1": {
      "Chips": [
        "Smc_CpuBrdSMC"
      ],
      "Connectors": [
        "Connector_BCU_1"
      ]
    },
    "I2c_5": {
      "Connectors": [
        "Connector_SEU_1",
        "Connector_SEU_2"
      ]
    },
    "I2c_4": {
      "Chips": [
        "Smc_FanBoardSMC"
      ],
      "Connectors": [
        "Connector_CLU_1"
      ]
    },
    "I2c_8": {
      "Chips": [
        "Lm75_InletTemp",
        "Chip_UsbCc_On",
        "Chip_UsbCc_Sgm"
      ],
      "Connectors": [
        "Connector_PSR_1"
      ]
    },
    "I2c_7": {
      "Chips": [
        "Pca9545_i2c7_chip"
      ]
    },
    "I2c_2": {
      "Chips": [
        "Smc_ExpBoardSMC",
        "Eeprom_EXU"
      ],
      "Connectors": [
        "Connector_PowerSupply_1",
        "Connector_PowerSupply_2"
      ]
    },
    "I2c_9": {
      "Chips": [
        "Eeprom_Psu1",
        "Eeprom_Psu2",
        "Chip_Psu1",
        "Chip_Psu2"
      ]
    },
    "I2c_3": {},
    "Jtag_1": {
      "Chips": [
        "Cpld_1"
      ]
    },
    "I2c_11": {
      "Chips": [
        "Lm75_OutletTemp"
      ]
    },
    "Pca9545_i2c7_chip": {
      "Buses": [
        "I2cMux_Pca9545_i2c7_chip_1",
        "I2cMux_Pca9545_i2c7_chip_2"
      ]
    },
    "I2cMux_Pca9545_i2c7_chip_1": {
      "Connectors": [
        "Connector_LOM_1",
        "Connector_OCP_1"
      ]
    },
    "I2cMux_Pca9545_i2c7_chip_2": {
      "Connectors": [
        "Connector_LOM_2",
        "Connector_OCP_2"
      ]
    }
  },
  "Objects": {
    "ExpBoard_1": {
      "Slot": 1,
      "UID": "00000001010302023922",
      "Name": "BC83SMMB",
      "Manufacturer": "<=/FruData_Expander.BoardManufacturer",
      "Type": "EXU",
      "Description": "Expander Board",
      "PartNumber": "0302023922",
      "LogicVersion": "",
      "LogicUnit": 5,
      "PcbID": "#/Accessor_PcbID.Value",
      "PcbVersion": "",
      "LogicVersionID": "#/Accessor_LogicVersionID.Value",
      "SRVersion": "${DataVersion}",
      "MCUVersion": "",
      "BoardID": 65535,
      "BoardType": "ExpBoard",
      "Number": 1,
      "DeviceName": "ExpBoard${Slot}",
      "Position": "EXU${Slot}",
      "NodeId": "EXU${Slot}ExpBoard${Slot}",
      "RunningStatus": 0,
      "RefSMCChip": "#/Smc_ExpBoardSMC",
      "FruID": "<=/Fru_Expander.FruId",
      "CpldTestReg": "#/Accessor_CpldTest.Value",
      "CpldStatus": 0
    },
    "Smc_CpuBrdSMC": {
      "Address": 96,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0
    },
    "Accessor_PcbID": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 1792,
      "Size": 2,
      "Mask": 15,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LogicVersionID": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 2816,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Time_Bmc": {
      "Id": 1,
      "CpuBrdRtc": "#/Smc_ExpBoardSMC",
      "RtcSupported": true,
      "Offset": 201327872,
      "Size": 8,
      "YearOffset": 0,
      "EffOffset": 0
    },
    "Connector_BCU_1": {
      "Bom": "14100513",
      "Slot": 1,
      "Position": 1,
      "Presence": 1,
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_1",
        "I2c_2",
        "I2c_8",
        "JtagOverLocalBus_1",
        "Hisport_0",
        "Hisport_5",
        "Hisport_6",
        "Hisport_7"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "BCU",
      "IdentifyMode": 3,
      "Type": "CPUBoard"
    },
    "Connector_SEU_1": {
      "Bom": "14100665",
      "Slot": 1,
      "Position": 2,
      "Presence": "<=/Scanner_FanCableMntr.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2c_6"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "SEU",
      "IdentifyMode": 3,
      "Container": "Component_ComExpander",
      "Type": "DiskBackplane"
    },
    "Connector_SEU_2": {
      "Bom": "14100665",
      "Slot": 5,
      "Position": 10,
      "Presence": 0,
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2c_5",
        "JtagOverLocalBus_1"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "SEU",
      "IdentifyMode": 3,
      "Container": "Component_ComExpander",
      "Type": "DiskBackplane"
    },
    "Connector_CLU_1": {
      "Bom": "14100363",
      "Slot": 1,
      "Position": 3,
      "Presence": "<=/Scanner_HddBPPresent.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2c_4",
        "JtagOverLocalBus_1"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "CLU",
      "IdentifyMode": 3,
      "Type": "FanBoard"
    },
    "Connector_PSR_1": {
      "Bom": "14100513",
      "Slot": 4,
      "Position": 4,
      "Presence": 0,
      "Id": "",
      "AuxId": "920",
      "Buses": [
        "I2c_8",
        "I2c_2"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "PSR",
      "IdentifyMode": 3
    },
    "Pca9545_i2c7_chip": {
      "OffsetWidth": 0,
      "AddrWidth": 1,
      "Address": 224,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Scanner_SerdesLom1Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134234368,
      "Size": 2,
      "Mask": 1,
      "Type": 0,
      "Period": 8000,
      "Value": 0
    },
    "Connector_LOM_1": {
      "Bom": "14220246",
      "Slot": 1,
      "Position": 9,
      "Presence": "<=/Scanner_SerdesLom1Pres.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2cMux_Pca9545_i2c7_chip_1"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "J6008",
      "IdentifyMode": 3
    },
    "Scanner_SerdesLom2Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134234368,
      "Size": 2,
      "Mask": 256,
      "Type": 0,
      "Period": 8000,
      "Value": 0
    },
    "Connector_LOM_2": {
      "Bom": "14220246",
      "Slot": 2,
      "Position": 6,
      "Presence": "<=/Scanner_SerdesLom2Pres.Value",
      "Id": "",
      "AuxId": "",
      "Buses": [
        "I2c_2",
        "I2cMux_Pca9545_i2c7_chip_2"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "J6014",
      "IdentifyMode": 3
    },
    "Connector_OCP_1": {
      "Bom": "14220247",
      "Slot": 7,
      "Position": 7,
      "Presence": "<=/Scanner_SerdesLom2Pres.Value",
      "Id": "15b31015",
      "AuxId": "19e5d13b",
      "Buses": [
        "I2cMux_Pca9545_i2c7_chip_1"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "J6008",
      "IdentifyMode": 2
    },
    "Connector_OCP_2": {
      "Bom": "14220247",
      "Slot": 8,
      "Position": 8,
      "Presence": 1,
      "Id": "15b31015",
      "AuxId": "19e5d13b",
      "Buses": [
        "I2cMux_Pca9545_i2c7_chip_2"
      ],
      "SystemId": "${SystemId}",
      "ManagerId": "${ManagerId}",
      "ChassisId": "${ChassisId}",
      "SilkText": "J6014",
      "IdentifyMode": 2
    },
    "Connector_PowerSupply_1": {
      "Bom": "14191046",
      "Slot": 1,
      "Position": 58,
      "Presence": "<=/Scanner_PS1Pres.Value",
      "Id": "PSU",
      "AuxId": "00000001010302023922",
      "Buses": [
        "I2c_2",
        "I2c_3"
      ],
      "SystemId": 1,
      "SilkText": "psu1",
      "IdentifyMode": 2,
      "Type": "Psu"
    },
    "Connector_PowerSupply_2": {
      "Bom": "14191046",
      "Slot": 2,
      "Position": 59,
      "Presence": "<=/Scanner_PS2Pres.Value",
      "Id": "PSU",
      "AuxId": "00000001010302023922",
      "Buses": [
        "I2c_2"
      ],
      "SystemId": 1,
      "SilkText": "psu2",
      "IdentifyMode": 2,
      "Type": "Psu"
    },
    "PsuSlot_1": {
      "SlotNumber": 1,
      "Presence": "<=/Scanner_PS1Pres.Value",
      "SlotI2cAddr": 176,
      "PsuChip": "#/Chip_Psu1"
    },
    "PsuSlot_2": {
      "SlotNumber": 2,
      "Presence": "<=/Scanner_PS2Pres.Value",
      "SlotI2cAddr": 180,
      "PsuChip": "#/Chip_Psu2"
    },
    "Eeprom_Psu1": {
      "Address": 160,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30,
      "RwBlockSize": 1024
    },
    "Eeprom_Psu2": {
      "Address": 164,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30,
      "RwBlockSize": 1024
    },
    "Chip_Psu1": {
      "Address": 176,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30
    },
    "Chip_Psu2": {
      "Address": 180,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "ReadTmout": 30,
      "WriteTmout": 30
    },
    "Scanner_PS1Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 603985152,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0,
      "Period": 2000
    },
    "Scanner_PS2Pres": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 603985152,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Value": 0,
      "Period": 2000
    },
    "Smc_ExpBoardSMC": {
      "Address": 96,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0
    },
    "Accessor_UIDLedAccessor": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134227456,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Led_UIDLed": {
      "Id": 4,
      "SystemId": 1,
      "Name": "UIDLed",
      "CtrlValue": "#/Accessor_UIDLedAccessor.Value",
      "Capability": 1,
      "Mode": 0,
      "ColorCapabilities": 2,
      "DefaultOSColor": 1,
      "DefaultLCSColor": 1,
      "LCSColor": 1,
      "LCSState": 0,
      "OSColor": 1,
      "OSState": 0,
      "LampTestColor": 1,
      "LampTestDuration": 0
    },
    "Accessor_SysHealthLedAccessor": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134226432,
      "Size": 2,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LedColorAccessor": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134226432,
      "Size": 2,
      "Mask": 65280,
      "Type": 0,
      "Value": 0
    },
    "Led_SysHealth": {
      "SystemId": 1,
      "Name": "SysHealLed",
      "CtrlValue": "#/Accessor_SysHealthLedAccessor.Value",
      "Capability": "#/Accessor_LedColorAccessor.Value",
      "Id": 2,
      "Mode": 0,
      "ColorCapabilities": 12,
      "DefaultOSColor": 3,
      "DefaultLCSColor": 3,
      "LCSColor": 3,
      "LCSState": 255,
      "OSColor": 3,
      "OSState": 0,
      "LampTestColor": 3,
      "LampTestDuration": 0
    },
    "Accessor_AC": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 603983360,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_JtagSwitch": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469776896,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LogicVerId": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 2816,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Cpld_1": {
      "HealthStatus": 0
    },
    "LogicFirmware_EXU_1": {
      "UId": "00000001010302023922",
      "Name": "EXU_CPLD",
      "Manufacturer": "Huawei",
      "Version": "#/Accessor_LogicVerId.Value",
      "Location": 5,
      "UpgradeChip": "#/Cpld_1",
      "ChipInfo": "#/Cpld_1",
      "Routes": "#/Accessor_JtagSwitch.Value",
      "DefaultRoute": 0,
      "FirmwareRoute": 0,
      "ValidMode": 1,
      "ValidAction": "#/Accessor_AC.Value",
      "SoftwareId": "CPLD-BC83SMMB"
    },
    "Eeprom_EXU": {
      "OffsetWidth": 2,
      "AddrWidth": 1,
      "Address": 174,
      "WriteTmout": 100,
      "ReadTmout": 100,
      "RwBlockSize": 32,
      "WriteInterval": 20,
      "HealthStatus": 0
    },
    "Accessor_EXUWP": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 11776,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "SRUpgrade_1": {
      "UID": "00000001010302023922",
      "Type": "EXU",
      "Version": "${DataVersion}",
      "StorageChip": "#/Eeprom_EXU",
      "SoftwareId": "HWSR-BC83SMMB",
      "WriteProtect": "#/Accessor_EXUWP.Value"
    },
    "Fru_Expander": {
      "PcbId": 1,
      "FruId": 1,
      "FruName": "ExpBoard${Slot}",
      "ConnectorGroupId": "${GroupId}",
      "BoardId": 65535,
      "UniqueId": "00000001010302023922"
    },
    "Lm75_InletTemp": {
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "Address": 144,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Lm75_OutletTemp": {
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "Address": 144,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "DftLm75_2": {
      "Id": 1,
      "Type": 1,
      "DeviceNum": 1,
      "ItemName": "LM75 For Inlet Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "RefChip": "#/Lm75_OutletTemp"
    },
    "Scanner_Lm75_Inlet": {
      "Chip": "#/Lm75_InletTemp",
      "Type": 0,
      "Size": 1,
      "Offset": 0,
      "Mask": 255,
      "Period": 1000,
      "Debounce": "#/MidAvg_Inlet",
      "Value": 0
    },
    "ThresholdSensor_InletTemp": {
      "AssertMask": 29312,
      "DeassertMask": 29312,
      "ReadingMask": 6168,
      "Linearization": 0,
      "M": 100,
      "RBExp": 224,
      "UpperCritical": 48,
      "UpperNoncritical": 46,
      "PositiveHysteresis": 2,
      "NegativeHysteresis": 2
    },
    "CoolingRequirement_1_6": {
      "RequirementId": 6,
      "TemperatureType": 11,
      "MonitoringStatus": "<=/Scanner_Lm75_Inlet.Status",
      "MonitoringValue": "<=/Scanner_Lm75_Inlet.Value",
      "FailedValue": 80,
      "BackupRequirementIdx": 8,
      "SensorName": "#/ThresholdSensor_InletTemp.SensorName"
    },
    "Event_InletTempUpperMinor": {
      "EventKeyId": "Chassis.ChassisInletOverTempMinor",
      "Condition": "<=/ThresholdSensor_InletTemp.UpperNoncritical",
      "Hysteresis": 2,
      "LedFaultCode": "A00"
    },
    "Event_InletTempUpperMajor": {
      "EventKeyId": "Chassis.ChassisInletOverTempMajor",
      "Condition": "<=/ThresholdSensor_InletTemp.UpperCritical",
      "Hysteresis": 2,
      "LedFaultCode": "A00"
    },
    "Event_InletTempFail": {
      "EventKeyId": "Chassis.ChassisAccessInletTempFailure",
      "Condition": 1,
      "LedFaultCode": "A00"
    },
    "Event_OutletTempUpperMinor": {
      "EventKeyId": "Chassis.ChassisOutletOverTempMinor",
      "Condition": "<=/ThresholdSensor_OutletTemp.UpperNoncritical",
      "Hysteresis": 2
    },
    "DiscreteSensor_SysFwProgress": {
      "OwnerId": 64,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 99,
      "Capabilities": 192,
      "SensorType": 15,
      "ReadingType": 111,
      "SensorName": "SysFwProgress",
      "AssertMask": 7,
      "DeassertMask": 7,
      "DiscreteMask": 7,
      "Unit": 192,
      "BaseUnit": 0,
      "ModifierUnit": 0,
      "DiscreteType": 0,
      "RecordSharing": 1,
      "Reading": 0
    },
    "Scanner_PowerGood": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469765888,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Period": 100,
      "Debounce": "None",
      "Status": 0,
      "Value": 0
    },
    "Scanner_RightEar": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134219520,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Period": 8000,
      "Debounce": "None",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "@Default": {
        "ScanEnabled": 0
      },
      "Status": 0,
      "Value": 0
    },
    "Scanner_LeftEar": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134219520,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Period": 8000,
      "Debounce": "None",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "@Default": {
        "ScanEnabled": 0
      },
      "Status": 0,
      "Value": 0
    },
    "Event_RightEarMntr": {
      "EventKeyId": "Chassis.ChassisRightMountingEarNotPresent",
      "Condition": 0
    },
    "Event_LeftEarMntr": {
      "EventKeyId": "Chassis.ChassisLeftMountingEarNotPresent",
      "Condition": 0
    },
    "Accessor_USBGreenLed": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 134230528,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Accessor_USBRedLed": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 134230528,
      "Mask": 65280,
      "Type": 0,
      "Value": 0
    },
    "Scanner_HddBPPresent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134237440,
      "Size": 2,
      "Mask": 1,
      "Type": 0,
      "Period": 8000,
      "Debounce": "#/ContBin_HddBPPresent",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "@Default": {
        "ScanEnabled": 0
      },
      "Status": 0,
      "Value": 0
    },
    "Event_HDDBpPresenceMntr": {
      "EventKeyId": "Chassis.ChassisFrontDiskBackplaneNotPresent",
      "Condition": 0
    },
    "Accessor_PowerGd": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 469765888,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Dft5V0Vlot_1": {
      "Type": 1,
      "Id": 19,
      "DeviceNum": 1,
      "ItemName": "VCC 5V Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "VoltValue": "#/Accessor_Adc5VccVlot.Value",
      "PowOnStandValue": 2731,
      "PowOffStandValue": 0,
      "HystValue": 109,
      "DevPowerStatus": "#/Accessor_PowerGd.Value"
    },
    "Accessor_Adc5VccVlot": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 4873,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "Dft5V0Vlot_2": {
      "Type": 1,
      "Id": 19,
      "DeviceNum": 2,
      "ItemName": "VCC 5V Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "VoltValue": "#/Accessor_Adc6VccVlot.Value",
      "PowOnStandValue": 2731,
      "PowOffStandValue": 0,
      "HystValue": 109,
      "DevPowerStatus": "#/Accessor_PowerGd.Value"
    },
    "Accessor_Adc6VccVlot": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 4874,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "Accessor_NCSI": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 469774592,
      "Mask": 16,
      "Type": 0,
      "Value": 0
    },
    "NCSICapabilities_1": {
      "PCIeNCSIEnabled": "#/Accessor_NCSI.Value",
      "PCIeNCSISupported": false
    },
    "Dft3V3Vlot_1": {
      "Type": 1,
      "Id": 20,
      "DeviceNum": 1,
      "ItemName": "VCC 3.3V Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "VoltValue": "#/Accessor_Adc4VccVlot.Value",
      "PowOnStandValue": 2700,
      "PowOffStandValue": 0,
      "HystValue": 108,
      "DevPowerStatus": "#/Accessor_PowerGd.Value"
    },
    "Accessor_Adc4VccVlot": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 2,
      "Offset": 4872,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "Event_ExpanderAccessFRULableFailure": {
      "EventKeyId": "ExpandBoard.ExpBoardAccessFRULableFailure",
      "Condition": 1
    },
    "Accessor_LeftLedTube": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134220288,
      "Size": 4,
      "Mask": 16711680,
      "Type": 0,
      "Value": 0
    },
    "Accessor_MidLedTube": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134220288,
      "Size": 4,
      "Mask": 65280,
      "Type": 0,
      "Value": 0
    },
    "Accessor_RightLedTube": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134220288,
      "Size": 4,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "LedDispControl_1": {
      "LedTubeSupport": true,
      "LeftLedTube": "#/Accessor_LeftLedTube.Value",
      "MidLedTube": "#/Accessor_MidLedTube.Value",
      "RightLedTube": "#/Accessor_RightLedTube.Value"
    },
    "Accessor_DftEnable": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 3584,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "DftPysicalLed_1": {
      "Id": 129,
      "Type": 4,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Physical Led Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the leds",
      "ProcessPeriod": 65535,
      "DftEnable": "#/Accessor_DftEnable.Value"
    },
    "DftLedIntelligence_1": {
      "Id": 132,
      "Type": 4,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Physical Led Intelligence Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the leds",
      "ProcessPeriod": 65535,
      "DftEnable": "#/Accessor_DftEnable.Value"
    },
    "Chip_UsbCc_On": {
      "Address": 66,
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Scanner_CcChipOnAttachStatus": {
      "Chip": "#/Chip_UsbCc_On",
      "Offset": 18,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "Chip_UsbCc_Sgm": {
      "Address": 142,
      "OffsetWidth": 1,
      "AddrWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0,
      "HealthStatus": 0
    },
    "Scanner_CcChipSgmAttachStatus": {
      "Chip": "#/Chip_UsbCc_Sgm",
      "Offset": 9,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "DftIOTest_1": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 2,
      "ItemName": "ExpBoard LM75 SMC Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_EXPBLm75ACC.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_EXPBLm75ACC": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4865,
      "Size": 2,
      "Mask": 65535,
      "Type": 0,
      "Value": 0
    },
    "DftIOTest_2": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 3,
      "ItemName": "SMC For NIC1 LM75 Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_Nic1Lm75.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_Nic1Lm75": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4356,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "DftIOTest_3": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 4,
      "ItemName": "SMC For NIC2 LM75 Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_Nic2Lm75.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_Nic2Lm75": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4358,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "DftIOTest_4": {
      "Type": 2,
      "Id": 89,
      "DeviceNum": 5,
      "ItemName": "SMC For PSU LM75 Temp",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "Destination": "#/Accessor_PSULm75.Value",
      "Data": 0,
      "ActionType": 2
    },
    "Accessor_PSULm75": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4354,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Scanner_ExpMosTempHigh": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469778688,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Period": 1000,
      "Debounce": "#/ContBin_H3L1",
      "Value": 0
    },
    "Event_ExpMosTempHigh": {
      "EventKeyId": "ExpBoard.ExpBoardStartUpOverTemp",
      "Condition": 1
    },
    "Event_Ps1Install": {
      "EventKeyId": "PSU.PSUInstalled",
      "Condition": 1
    },
    "Event_Ps1Removed": {
      "EventKeyId": "PSU.PSURemoved",
      "Condition": 0
    },
    "Event_Ps2Install": {
      "EventKeyId": "PSU.PSUInstalled",
      "Condition": 1
    },
    "Event_Ps2Removed": {
      "EventKeyId": "PSU.PSURemoved",
      "Condition": 0
    },
    "Scanner_ChassisCoverStatus": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Offset": 201345280,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Period": 5000,
      "Debounce": "None",
      "Value": 0
    },
    "Scanner_ChassisIntrusionACOn": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Offset": 201345280,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Period": 5000,
      "Debounce": "None",
      "Value": 0
    },
    "Scanner_ChassisIntrusionACOff": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Offset": 201345280,
      "Size": 1,
      "Mask": 8,
      "Type": 0,
      "Period": 5000,
      "Debounce": "None",
      "Value": 0
    },
    "Accessor_ChassisIntrusionACOffClear": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Size": 1,
      "Offset": 201345536,
      "Mask": 8,
      "Type": 1,
      "Value": 0
    },
    "Accessor_ChassisIntrusionACOnClear": {
      "Chip": "#/Smc_CpuBrdSMC",
      "Size": 1,
      "Offset": 201345536,
      "Mask": 4,
      "Type": 1,
      "Value": 0
    },
    "Accessor_UIDButtonEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Value": 0
    },
    "Scanner_UIDButtonEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "Accessor_UIDButtonLongEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Value": 0
    },
    "Scanner_UIDButtonLongEvent": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Period": 1000,
      "Value": 0
    },
    "Chassis_1": {
      "Name": "1",
      "IntrusionACOn": "<=/Scanner_ChassisIntrusionACOn.Value",
      "IntrusionACOff": "<=/Scanner_ChassisIntrusionACOff.Value",
      "CoverStatus": "<=/Scanner_ChassisCoverStatus.Value",
      "IntrusionACOnClear": "#/Accessor_ChassisIntrusionACOnClear.Value",
      "IntrusionACOffClear": "#/Accessor_ChassisIntrusionACOffClear.Value",
      "IntrusionFlag": 0,
      "UidButtonAccessor": "#/Accessor_UIDButtonEvent.Value",
      "UidButtonScanner": "<=/Scanner_UIDButtonEvent.Value",
      "UidButtonPressed": 0,
      "UidButtonLongAccessor": "#/Accessor_UIDButtonLongEvent.Value",
      "UidButtonLongScanner": "<=/Scanner_UIDButtonLongEvent.Value",
      "UidButtonLongPressed": 0
    },
    "Event_14": {
      "EventKeyId": "Chassis.ChassisCoverOpened",
      "Condition": 1
    },
    "Event_OutletTempFail": {
      "EventKeyId": "Chassis.ChassisOutletTempFail",
      "Condition": 1
    },
    "Event_ECU12V1GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU12V2GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU12V3GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU3V1GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU5V1GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Event_ECU5V2GetFailMntr": {
      "EventKeyId": "ExpBoard.ExpBoardAccess3V3Failure",
      "Condition": 0
    },
    "Scanner_ECUSys12V1Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4869,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ExpBoardOverVoltage",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys12V1HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 13.2,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys12V2Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4870,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ExpBoardOverVoltage",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys12V2HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 13.2,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys12V3Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4871,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ExpBoardOverVoltage",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys12V3HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 13.2,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys3V1Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4872,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ECUSys3V1HighMntr",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys3V1HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 3.6,
      "Hysteresis": 0.13,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys5V1Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4873,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ECUSys5V1HighMntr",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys5V1HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 5.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Scanner_ECUSys5V2Mntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 4874,
      "Size": 2,
      "Type": 0,
      "Mask": 65535,
      "Period": 3000,
      "Debounce": "#/MidAvg_ECUSys5V2HighMntr",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 32767,
      "Status": 0,
      "@Default": {
        "ScanEnabled": 0
      },
      "Value": 0
    },
    "Event_ECUSys5V2HighMntr": {
      "EventKeyId": "ExpBoard.ExpBoardOverVoltage",
      "Condition": 5.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys12V1LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 10.8,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys12V2LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 10.8,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys12V3LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 10.8,
      "Hysteresis": 0.48,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys3V1LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 3,
      "Hysteresis": 0.13,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys5V1LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 4.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Event_ECUSys5V2LowMntr": {
      "EventKeyId": "ExpBoard.ExpBoardLowerVoltage",
      "Condition": 4.5,
      "Hysteresis": 0.2,
      "LedFaultCode": "b01"
    },
    "Scanner_CpuBrdPresenceMntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134237440,
      "Size": 2,
      "Type": 0,
      "Mask": 32,
      "Period": 8000,
      "Debounce": "#/ContBin_CableCPLDIncorrectConnection",
      "Value": 0
    },
    "Event_CpuBrdPresenceMntr": {
      "EventKeyId": "ComCable.CableCPLDIncorrectConnection",
      "Condition": 0
    },
    "Scanner_FanCableMntr": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134237440,
      "Size": 2,
      "Type": 0,
      "Mask": 8,
      "Period": 8000,
      "Debounce": "#/ContBin_CableCPLDIncorrectConnection",
      "ScanEnabled": "<=/Scanner_PowerGood.Value",
      "NominalValue": 1,
      "Status": 0,
      "Value": 0,
      "@Default": {
        "ScanEnabled": 0
      }
    },
    "Event_FanCableMntr": {
      "EventKeyId": "ComCable.CableFanBackplaneDisconnection",
      "Condition": 0
    },
    "Scanner_Lm75_Outlet": {
      "Chip": "#/Lm75_OutletTemp",
      "Type": 0,
      "Size": 1,
      "Offset": 0,
      "Mask": 255,
      "Period": 1000,
      "Debounce": "#/MidAvg_Outlet",
      "Value": 0
    },
    "CoolingRequirement_1_7": {
      "RequirementId": 7,
      "TemperatureType": 2,
      "MonitoringStatus": "<=/Scanner_Lm75_Outlet.Status",
      "MonitoringValue": "<=/Scanner_Lm75_Outlet.Value",
      "FailedValue": 80,
      "TargetTemperatureCelsius": 45,
      "MaxAllowedTemperatureCelsius": 60,
      "TargetTemperatureRangeCelsius": [
        45,
        60
      ],
      "SmartCoolingTargetTemperature": [
        45,
        42,
        48
      ],
      "CustomSupported": true,
      "CustomTargetTemperatureCelsius": 52,
      "SensorName": "#/ThresholdSensor_OutletTemp.SensorName"
    },
    "Smc_FanBoardSMC": {
      "Address": 96,
      "AddrWidth": 1,
      "OffsetWidth": 1,
      "WriteTmout": 0,
      "ReadTmout": 0
    },
    "Scanner_FanBoard_Temp": {
      "Chip": "#/Smc_FanBoardSMC",
      "Type": 0,
      "Size": 1,
      "Offset": 4354,
      "Mask": 255,
      "Period": 1000,
      "Debounce": "#/MidAvg_FanBoard_Temp",
      "Value": 0
    },
    "ThresholdSensor_OutletTemp": {
      "AssertMask": 128,
      "DeassertMask": 28800,
      "ReadingMask": 2056,
      "Linearization": 0,
      "M": 100,
      "RBExp": 224,
      "UpperNoncritical": 75,
      "PositiveHysteresis": 2,
      "NegativeHysteresis": 2
    },
    "Accessor_VGADftSwitch": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469775872,
      "Size": 1,
      "Mask": 3,
      "Type": 0,
      "Value": 0
    },
    "DeviceChip_VGADftSwitch": {
      "Slot": 0,
      "DeviceType": 1,
      "Chip": "#/Accessor_VGADftSwitch.Value"
    },
    "Accessor_ShortPushButton": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134224384,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0
    },
    "Accessor_LongPushButton": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134224384,
      "Size": 1,
      "Mask": 2,
      "Type": 0,
      "Value": 0
    },
    "Accessor_PowerBtnLock": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134222336,
      "Size": 1,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Scanner_PowerBtnEvt": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Period": 200,
      "Debounce": "None",
      "Value": 0
    },
    "Accessor_PowerBtnEvt": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134221312,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0
    },
    "Accessor_PowerBtnShield": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 134223361,
      "Size": 1,
      "Mask": 1,
      "Type": 0,
      "Value": 0
    },
    "Accessor_PowerOnLock": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469766657,
      "Size": 1,
      "Mask": 8,
      "Type": 0,
      "Value": 0
    },
    "Event_ButtonPowerButtonPressed": {
      "EventKeyId": "Button.ButtonPowerButtonPressed",
      "Condition": 1
    },
    "Event_SystemACPIWorkingState": {
      "EventKeyId": "System.SystemACPIWorkingState",
      "Condition": 1
    },
    "Event_SystemACPISoftOffState": {
      "EventKeyId": "System.SystemACPISoftOffState",
      "Condition": 0
    },
    "DiscreteSensor_AcpiState": {
      "AssertMask": 65,
      "DeassertMask": 0,
      "DiscreteMask": 65
    },
    "DiscreteSensor_PowerButton": {
      "AssertMask": 1,
      "DeassertMask": 0,
      "DiscreteMask": 1
    },
    "Scanner_PwrOkSigDrop": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469766656,
      "Size": 1,
      "Mask": 4,
      "Type": 0,
      "Period": 400,
      "Debounce": "None",
      "Value": 0
    },
    "Scanner_PowerOnTimeout": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Offset": 469766656,
      "Size": 1,
      "Mask": 8,
      "Type": 0,
      "Period": 400,
      "Debounce": "None",
      "Value": 0
    },
    "DiscreteSensor_PwrOkSigDrop": {
      "AssertMask": 2,
      "DeassertMask": 2,
      "DiscreteMask": 2
    },
    "DiscreteSensor_PwrOnTimeOut": {
      "AssertMask": 2,
      "DeassertMask": 2,
      "DiscreteMask": 2
    },
    "Event_ExpBoardReplaceMntr": {
      "EventKeyId": "ExpBoard.ExpBoardReplace",
      "Condition": 1
    },
    "MidAvg_Inlet": {
      "WindowSize": 4,
      "DefaultValue": 20,
      "IsSigned": true
    },
    "Temperature_1_11": {
      "TemperatureType": 11
    },
    "ContBin_HddBPPresent": {
      "NumH": 4,
      "NumL": 4,
      "DefaultValue": 1
    },
    "DftPowerSupply_1": {
      "Id": 8,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "Power Supply Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftPmu_1": {
      "Id": 9,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "ME Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftCpld_1": {
      "Type": 1,
      "Id": 15,
      "DeviceNum": 1,
      "ItemName": "CpuBrd CPLD Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftFlash_1": {
      "Type": 1,
      "Id": 11,
      "DeviceNum": 0,
      "ItemName": "Flash Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftNCSI_1": {
      "Id": 73,
      "Type": 2,
      "DeviceNum": 0,
      "ItemName": "NCSI Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftChassisCover_1": {
      "Id": 195,
      "Type": 5,
      "Slot": "${GroupId}",
      "DeviceNum": 1,
      "ItemName": "Chassis Cover Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftJTAG_1": {
      "Type": 2,
      "Id": 69,
      "DeviceNum": 0,
      "ItemName": "JTAG Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftSPI_1": {
      "Id": 70,
      "Type": 2,
      "DeviceNum": 0,
      "ItemName": "SPI Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftLedTube_1": {
      "Id": 130,
      "Type": 4,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Led Tube Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the Led Tube",
      "ProcessPeriod": 65535
    },
    "DftLedTubeIntelligence_1": {
      "Id": 133,
      "Type": 4,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Led Tube Intelligence Test",
      "PrompteReady": "",
      "PrompteFinish": "Please check the Led Tube",
      "ProcessPeriod": 65535
    },
    "ContBin_H3L1": {
      "NumH": 3,
      "NumL": 1,
      "DefaultValue": 0
    },
    "MidAvg_ExpBoardOverVoltage": {
      "WindowSize": 36,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys3V1HighMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V1HighMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V2HighMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ExpBoardLowerVoltage": {
      "WindowSize": 36,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys3V1LowMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V1LowMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "MidAvg_ECUSys5V2LowMntr": {
      "WindowSize": 12,
      "DefaultValue": 32767
    },
    "ContBin_CableCPLDIncorrectConnection": {
      "NumH": 4,
      "NumL": 4,
      "DefaultValue": 1
    },
    "MidAvg_Outlet": {
      "WindowSize": 4,
      "DefaultValue": 20,
      "IsSigned": true
    },
    "MidAvg_FanBoard_Temp": {
      "WindowSize": 4,
      "DefaultValue": 20,
      "IsSigned": true
    },
    "I2cMux_Pca9545_i2c7_chip_1": {
      "ChannelId": 0
    },
    "I2cMux_Pca9545_i2c7_chip_2": {
      "ChannelId": 1
    },
    "Event_UIDButtonMntr": {
      "EventKeyId": "Button.ButtonUIDButtonpressed",
      "Condition": 0
    },
    "Event_UIDButtonLongMntr": {
      "EventKeyId": "Button.ButtonUIDButtonLongPressed",
      "Reading": "<=/Chassis_1.UidButtonLongPressed",
      "Condition": 0,
      "OperatorId": 6,
      "Enabled": true,
      "Component": "#/Component_Button"
    },
    "Accessor_CpldTest": {
      "Chip": "#/Smc_ExpBoardSMC",
      "Size": 1,
      "Offset": 8704,
      "Mask": 255,
      "Type": 0,
      "Value": 0
    },
    "Event_CpldSelfcheck": {
      "EventKeyId": "ExpBoard.ExpBoardCPLDSelfTestFailure",
      "Condition": 1
    }
  }
};

/** 软件 .sr（14100513_920s_soft.sr）解析结果 */
export const CSR_SAMPLE_SOFT_SR: SrDoc = {
  "FormatVersion": "3.00",
  "DataVersion": "3.00",
  "Unit": {
    "Type": "EXU",
    "Name": "ExpBoard_1"
  },
  "Objects": {
    "PGSignal_1": {
      "PowerGDState": "<=/Scanner_PowerGood.Value",
      "@Default": {
        "PowerGDState": 255
      }
    },
    "PowerButton_1": {
      "ShortPushButton": "#/Accessor_ShortPushButton.Value",
      "LongPushButton": "#/Accessor_LongPushButton.Value"
    },
    "ACCycle_1": {
      "AC": "#/Accessor_AC.Value"
    },
    "ButtonEvt_1": {
      "PowerBtnLock": "#/Accessor_PowerBtnLock.Value",
      "GetPowerBtnEvt": "<=/Scanner_PowerBtnEvt.Value",
      "SetPowerBtnEvt": "#/Accessor_PowerBtnEvt.Value",
      "PowerBtnShield": "#/Accessor_PowerBtnShield.Value"
    },
    "PowerAction_1": {
      "PowerOnTimeoutFlag": "#/Accessor_PowerOnLock.Value"
    },
    "UsbLocalOMService_1": {
      "Supported": true,
      "Presence": "<=/Scanner_RightEar.Value",
      "Enabled": true,
      "RefCcChipOn": "#/Chip_UsbCc_On",
      "RefCcChipSgm": "#/Chip_UsbCc_Sgm",
      "CcChipOnAttachStatus": "<=/Scanner_CcChipOnAttachStatus.Value",
      "CcChipSgmAttachStatus": "<=/Scanner_CcChipSgmAttachStatus.Value",
      "GLedStatus": "#/Accessor_USBGreenLed.Value",
      "RLedStatus": "#/Accessor_USBRedLed.Value",
      "RndisHostIpAddr": "169.254.1.5",
      "PortNum": 3
    },
    "DftUsb_1": {
      "Id": 94,
      "Type": 2,
      "Slot": 0,
      "DeviceNum": 0,
      "ItemName": "Type C USB Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftEeprom_1": {
      "Id": 12,
      "Type": 1,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "EXU Eeprom Self Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "FruData": "#/FruData_Expander"
    },
    "DftEepromWp_1": {
      "Id": 47,
      "Type": 1,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "EXU Eeprom Write Protect Self Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "FruData": "#/FruData_Expander"
    },
    "DftPowerButton_1": {
      "Id": 163,
      "Type": 5,
      "Slot": "${GroupId}",
      "DeviceNum": 0,
      "ItemName": "Power Button Press Test",
      "PrompteReady": "",
      "PrompteFinish": "Please press Power button",
      "ProcessPeriod": 65535
    },
    "DftLpc_1": {
      "Id": 34,
      "Type": 1,
      "Slot": 0,
      "DeviceNum": 0,
      "ItemName": "LPC Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftIpmb_1": {
      "Id": 35,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "Ipmb Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftEth_1": {
      "Id": 74,
      "Type": 2,
      "DeviceNum": 0,
      "ItemName": "MGMT Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535,
      "RefEth": "eth2"
    },
    "DftBmcCard_1": {
      "Id": 26,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "hi1711 Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftDdr3_1": {
      "Type": 1,
      "Id": 13,
      "DeviceNum": 0,
      "ItemName": "DDR3 Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "DftNandFlash_1": {
      "Id": 28,
      "Type": 1,
      "DeviceNum": 0,
      "ItemName": "NAND Flash Test",
      "PrompteReady": "",
      "PrompteFinish": "",
      "ProcessPeriod": 65535
    },
    "FruData_Expander": {
      "FruId": 1,
      "FruDev": "#/Eeprom_EXU",
      "EepromWp": "#/Accessor_EXUWP.Value",
      "BoardSerialNumber": "",
      "StorageType": "TianChi"
    },
    "Component_ComSystem": {
      "FruId": 255,
      "Instance": 0,
      "Type": 44,
      "Name": "System",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1
    },
    "Component_Button": {
      "FruId": 255,
      "Instance": 1,
      "Type": 49,
      "Name": "button",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1
    },
    "Component_ComEXU": {
      "FruId": 255,
      "Instance": 1,
      "Type": 193,
      "Location": "chassis",
      "Name": "EXU${Slot}",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1,
      "Manufacturer": "",
      "UniqueId": "N/A",
      "BoardId": "<=/ExpBoard_1.BoardID"
    },
    "Component_ComExpander": {
      "FruId": "<=/Fru_Expander.FruId",
      "Instance": "${Slot}",
      "Type": 93,
      "Location": "<=/ExpBoard_1.Position",
      "Name": "<=/ExpBoard_1.DeviceName",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1,
      "Manufacturer": "<=/ExpBoard_1.Manufacturer",
      "UniqueId": "<=/ExpBoard_1.UID",
      "BoardID": "<=/ExpBoard_1.BoardID",
      "ReplaceFlag": 0,
      "PreviousSN": "",
      "SerialNumber": "<=/FruData_Expander.BoardSerialNumber",
      "NodeId": "<=/ExpBoard_1.Position;<=/ExpBoard_1.DeviceName |> string.format('%s%s',$1,$2)"
    },
    "Component_Chassis": {
      "FruId": 255,
      "Instance": 1,
      "Type": 18,
      "Name": "Chassis",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1,
      "UniqueId": "N/A",
      "BoardID": "<=/ExpBoard_1.BoardID",
      "NodeId": ""
    },
    "Component_Cable": {
      "FruId": 255,
      "Instance": 1,
      "Type": 40,
      "Name": "cable",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1
    },
    "Component_PowerSupply1": {
      "FruId": 255,
      "Instance": 255,
      "Type": 3,
      "Location": "chassis",
      "Name": "PowerSupply1",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1,
      "Manufacturer": "",
      "UniqueId": "N/A",
      "BoardID": "<=/ExpBoard_1.BoardID",
      "NodeId": "0"
    },
    "Component_PowerSupply2": {
      "FruId": 255,
      "Instance": 255,
      "Type": 3,
      "Location": "chassis",
      "Name": "PowerSupply2",
      "Presence": 1,
      "Health": 0,
      "PowerState": 1,
      "GroupId": 1,
      "Manufacturer": "",
      "UniqueId": "N/A",
      "BoardID": "<=/ExpBoard_1.BoardID",
      "NodeId": "1"
    },
    "DftVersion_ExuBoardCpldVersion": {
      "FruId": "<=/Fru_Expander.FruId",
      "VersionType": 2,
      "Version": "<=/ExpBoard_1.LogicVersion",
      "UnitNum": "<=/ExpBoard_1.LogicUnit",
      "NeedUintNum": 1
    },
    "DftVersion_ExpanderPcbVersion": {
      "FruId": "<=/Fru_Expander.FruId",
      "VersionType": 0,
      "Version": "<=/ExpBoard_1.PcbVersion"
    },
    "DftVersion_ExpanderCsrVersion": {
      "FruId": "<=/Fru_Expander.FruId",
      "VersionType": 25,
      "Version": "<=/ExpBoard_1.SRVersion"
    },
    "DftVersion_ExpanderMcuVersion": {
      "FruId": "<=/Fru_Expander.FruId",
      "VersionType": 27,
      "Version": "<=/ExpBoard_1.MCUVersion"
    },
    "Fru_Expander": {
      "PcbVersion": ".A",
      "PowerState": 1,
      "Health": 0,
      "EepStatus": "<=/Eeprom_EXU.HealthStatus",
      "Type": 50,
      "FruDataId": "#/FruData_Expander"
    },
    "ThresholdSensor_InletTemp": {
      "OwnerId": 32,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_AirInlet.Id",
      "EntityInstance": "<=/Entity_AirInlet.Instance",
      "Initialization": 127,
      "Capabilities": 104,
      "SensorType": 1,
      "ReadingType": 1,
      "SensorName": "Inlet Temp",
      "SensorIdentifier": "Inlet Temp",
      "Unit": 128,
      "BaseUnit": 1,
      "ModifierUnit": 0,
      "Analog": 1,
      "NominalReading": 25,
      "NormalMaximum": 0,
      "NormalMinimum": 0,
      "MaximumReading": 127,
      "MinimumReading": 128,
      "Reading": "<=/Scanner_Lm75_Inlet.Value",
      "ReadingStatus": "<=/Scanner_Lm75_Inlet.Status"
    },
    "ThresholdSensor_OutletTemp": {
      "OwnerId": 32,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 127,
      "Capabilities": 104,
      "SensorType": 1,
      "ReadingType": 1,
      "SensorName": "Outlet Temp",
      "SensorIdentifier": "Outlet Temp",
      "Unit": 128,
      "BaseUnit": 1,
      "ModifierUnit": 0,
      "Analog": 1,
      "NominalReading": 25,
      "NormalMaximum": 0,
      "NormalMinimum": 0,
      "MaximumReading": 127,
      "MinimumReading": 128,
      "Reading": "<=/Scanner_Lm75_Outlet.Value;<=/Scanner_Lm75_Inlet.Value;<=/Scanner_FanBoard_Temp.Value |> expr(((($2 & 32768) == 0 ? $2 : $3) + 5) > ($1 - 13) ? ((($2 & 32768) == 0 ? $2 : $3) + 5) : ($1 - 13))"
    },
    "DiscreteSensor_AcpiState": {
      "OwnerId": 32,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 99,
      "Capabilities": 64,
      "SensorType": 34,
      "ReadingType": 111,
      "SensorName": "ACPI State",
      "Unit": 192,
      "BaseUnit": 0,
      "ModifierUnit": 0,
      "DiscreteType": 1,
      "RecordSharing": 1,
      "Reading": 0
    },
    "DiscreteSensor_PowerButton": {
      "OwnerId": 32,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 99,
      "Capabilities": 64,
      "SensorType": 20,
      "ReadingType": 111,
      "SensorName": "Power Button",
      "Unit": 192,
      "BaseUnit": 0,
      "ModifierUnit": 0,
      "DiscreteType": 1,
      "RecordSharing": 1,
      "Reading": 0
    },
    "DiscreteSensor_PwrOkSigDrop": {
      "OwnerId": 32,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 99,
      "Capabilities": 64,
      "SensorType": 8,
      "ReadingType": 111,
      "SensorName": "PwrOk Sig. Drop",
      "Unit": 192,
      "BaseUnit": 0,
      "ModifierUnit": 0,
      "DiscreteType": 0,
      "RecordSharing": 1,
      "Reading": 0
    },
    "DiscreteSensor_PwrOnTimeOut": {
      "OwnerId": 32,
      "OwnerLun": 0,
      "EntityId": "<=/Entity_MainBoard.Id",
      "EntityInstance": "<=/Entity_MainBoard.Instance",
      "Initialization": 99,
      "Capabilities": 64,
      "SensorType": 8,
      "ReadingType": 111,
      "SensorName": "PwrOn TimeOut",
      "Unit": 192,
      "BaseUnit": 0,
      "ModifierUnit": 0,
      "DiscreteType": 0,
      "RecordSharing": 1,
      "Reading": 0
    },
    "DiscreteEvent_AcpiState": {
      "Property": "<=/Scanner_PowerGood.Value |> expr((((((1 << 8) | 255) << 8) | 255) << 8) | ($1 == 1 ? 0 : 6))",
      "ListenType": 0,
      "EventData1": 255,
      "EventData2": 255,
      "EventData3": 255,
      "EventDir": 0,
      "Conversion": 0,
      "SensorObject": "#/DiscreteSensor_AcpiState"
    },
    "DiscreteEvent_PowerButton": {
      "Property": "<=/Scanner_PowerBtnEvt.Value |> expr(((((($1 << 8) | 255) << 8) | 255) << 8) |  0)",
      "ListenType": 0,
      "EventData1": 255,
      "EventData2": 255,
      "EventData3": 255,
      "EventDir": 255,
      "Conversion": 0,
      "SensorObject": "#/DiscreteSensor_PowerButton"
    },
    "DiscreteEvent_PwrOkSigDrop": {
      "Property": "<=/Scanner_PwrOkSigDrop.Value |> expr(((((($1 << 8) | 255) << 8) | 255) << 8) |  1)",
      "ListenType": 0,
      "EventData1": 255,
      "EventData2": 255,
      "EventData3": 255,
      "EventDir": 255,
      "Conversion": 0,
      "SensorObject": "#/DiscreteSensor_PwrOkSigDrop"
    },
    "DiscreteEvent_PwrOnTimeOut": {
      "Property": "<=/Scanner_PowerOnTimeout.Value",
      "ListenType": 1,
      "EventData1": 1,
      "EventData2": 255,
      "EventData3": 255,
      "EventDir": "<=/Scanner_PowerOnTimeout.Value",
      "Conversion": 0,
      "SensorObject": "#/DiscreteSensor_PwrOnTimeOut"
    },
    "Entity_MainBoard": {
      "Id": 7,
      "Name": "MainBoard",
      "PowerState": 1,
      "Presence": 1,
      "Instance": 96
    },
    "Entity_AirInlet": {
      "Id": 55,
      "Name": "AirInlet",
      "PowerState": 1,
      "Presence": 1,
      "Instance": 96
    },
    "Event_InletTempUpperMinor": {
      "Reading": "<=/Scanner_Lm75_Inlet.Value |> expr($1 > 255 ? 20 : ($1 >= 128 ? (-(255 - $1 + 1)) : $1))",
      "@Default": {
        "Condition": 46
      },
      "OperatorId": 4,
      "Enabled": true,
      "DescArg1": "#/Event_InletTempUpperMinor.Reading |> string.format('%.3f', $1)",
      "DescArg2": "#/Event_InletTempUpperMinor.Condition |> string.format('%.3f', $1)",
      "Component": "#/Component_Chassis"
    },
    "Event_InletTempUpperMajor": {
      "Reading": "<=/Scanner_Lm75_Inlet.Value |> expr($1 > 255 ? 20 : ($1 >= 128 ? (-(255 - $1 + 1)) : $1))",
      "@Default": {
        "Condition": 48
      },
      "OperatorId": 4,
      "Enabled": true,
      "DescArg1": "#/Event_InletTempUpperMajor.Reading |> string.format('%.3f', $1)",
      "DescArg2": "#/Event_InletTempUpperMajor.Condition |> string.format('%.3f', $1)",
      "Component": "#/Component_Chassis"
    },
    "Event_InletTempFail": {
      "Reading": "<=/Scanner_Lm75_Inlet.Status",
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Chassis"
    },
    "Event_OutletTempUpperMinor": {
      "Reading": "<=/Scanner_Lm75_Outlet.Value;<=/Scanner_Lm75_Inlet.Value |> expr(((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) > 255 ? 35 : ((((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) & 255) >= 128 ? (-(255 - (((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) & 255) + 1)) : (((($2 + 5) > ($1 - 13)) ? ($2 + 5) : ($1 - 13)) & 255)))",
      "@Default": {
        "Condition": 75
      },
      "OperatorId": 4,
      "Enabled": true,
      "DescArg2": "#/Event_OutletTempUpperMinor.Reading |> string.format('%.3f', $1)",
      "DescArg3": "#/Event_OutletTempUpperMinor.Condition |> string.format('%.3f', $1)",
      "Component": "#/Component_Chassis"
    },
    "Event_RightEarMntr": {
      "Reading": "<=/Scanner_RightEar.Value",
      "@Default": {
        "Reading": 1
      },
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Chassis"
    },
    "Event_LeftEarMntr": {
      "Reading": "<=/Scanner_LeftEar.Value",
      "@Default": {
        "Reading": 1
      },
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Chassis"
    },
    "Event_HDDBpPresenceMntr": {
      "Reading": "<=/Scanner_HddBPPresent.Value",
      "@Default": {
        "Reading": 1
      },
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Chassis"
    },
    "Event_ExpanderAccessFRULableFailure": {
      "Reading": 0,
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_ComExpander"
    },
    "Event_ExpMosTempHigh": {
      "Reading": "<=/Scanner_ExpMosTempHigh.Value",
      "OperatorId": 5,
      "Enabled": true,
      "AdditionalInfo": "1",
      "DescArg1": "(V_VCC_12V0)",
      "Component": "#/Component_ComEXU"
    },
    "Event_Ps1Install": {
      "Reading": "<=/Scanner_PS1Pres.Status;<=/Scanner_PS1Pres.Value |> expr($1 == 4 ? 255 : $2)",
      "@Default": {
        "Reading": 255
      },
      "OperatorId": 7,
      "Enabled": true,
      "DescArg1": "1",
      "Component": "#/Component_PowerSupply1"
    },
    "Event_Ps1Removed": {
      "Reading": "<=/Scanner_PS1Pres.Status;<=/Scanner_PS1Pres.Value |> expr($1 == 4 ? 255 : $2)",
      "@Default": {
        "Reading": 255
      },
      "OperatorId": 8,
      "Enabled": true,
      "DescArg1": "1",
      "Component": "#/Component_PowerSupply1"
    },
    "Event_Ps2Install": {
      "Reading": "<=/Scanner_PS2Pres.Status;<=/Scanner_PS2Pres.Value |> expr($1 == 4 ? 255 : $2)",
      "@Default": {
        "Reading": 255
      },
      "OperatorId": 7,
      "Enabled": true,
      "DescArg1": "2",
      "Component": "#/Component_PowerSupply2"
    },
    "Event_Ps2Removed": {
      "Reading": "<=/Scanner_PS2Pres.Status;<=/Scanner_PS2Pres.Value |> expr($1 == 4 ? 255 : $2)",
      "@Default": {
        "Reading": 255
      },
      "OperatorId": 8,
      "Enabled": true,
      "DescArg1": "2",
      "Component": "#/Component_PowerSupply2"
    },
    "Event_14": {
      "Reading": "<=/Chassis_1.IntrusionFlag",
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Chassis"
    },
    "Event_OutletTempFail": {
      "Reading": "<=/Scanner_Lm75_Outlet.Value |> expr(($1 & 32768) == 0 ? 0 : 1)",
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Chassis"
    },
    "Event_ECU12V1GetFailMntr": {
      "Reading": "<=/Scanner_ECUSys12V1Mntr.Status;<=/Scanner_ECUSys12V1Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",
      "OperatorId": 6,
      "Enabled": true,
      "AdditionalInfo": "2",
      "DescArg1": "12V",
      "DescArg2": "EXU_V_VCC1_12V0",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECU12V2GetFailMntr": {
      "Reading": "<=/Scanner_ECUSys12V2Mntr.Status;<=/Scanner_ECUSys12V2Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",
      "OperatorId": 6,
      "Enabled": true,
      "AdditionalInfo": "2",
      "DescArg1": "12V",
      "DescArg2": "EXU_V_VCC2_12V0",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECU12V3GetFailMntr": {
      "Reading": "<=/Scanner_ECUSys12V3Mntr.Status;<=/Scanner_ECUSys12V3Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",
      "OperatorId": 6,
      "Enabled": true,
      "AdditionalInfo": "2",
      "DescArg1": "12V",
      "DescArg2": "EXU_V_VCC3_12V0",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECU3V1GetFailMntr": {
      "Reading": "<=/Scanner_ECUSys3V1Mntr.Status;<=/Scanner_ECUSys3V1Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",
      "OperatorId": 6,
      "Enabled": true,
      "AdditionalInfo": "2",
      "DescArg1": "3.3V",
      "DescArg2": "EXU_V_STBY_3V3",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECU5V1GetFailMntr": {
      "Reading": "<=/Scanner_ECUSys5V1Mntr.Status;<=/Scanner_ECUSys5V1Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",
      "OperatorId": 6,
      "Enabled": true,
      "AdditionalInfo": "2",
      "DescArg1": "5V",
      "DescArg2": "EXU_V_VCC_5V0",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECU5V2GetFailMntr": {
      "Reading": "<=/Scanner_ECUSys5V2Mntr.Status;<=/Scanner_ECUSys5V2Mntr.Value |> expr(($1 == 0) ? ((($2 & 32768) == 0) ? 0 : 1) : 0)",
      "OperatorId": 6,
      "Enabled": true,
      "AdditionalInfo": "2",
      "DescArg1": "5V",
      "DescArg2": "EXU_V_STBY_5V0",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys12V1HighMntr": {
      "Reading": "<=/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",
      "@Default": {
        "Reading": 12
      },
      "OperatorId": 4,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "12V",
      "DescArg3": "EXU_V_VCC1_12V0",
      "DescArg4": "13.2",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys12V2HighMntr": {
      "Reading": "<=/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",
      "@Default": {
        "Reading": 12
      },
      "OperatorId": 4,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "12V",
      "DescArg3": "EXU_V_VCC2_12V0",
      "DescArg4": "13.2",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys12V3HighMntr": {
      "Reading": "<=/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",
      "@Default": {
        "Reading": 12
      },
      "OperatorId": 4,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "12V",
      "DescArg3": "EXU_V_VCC3_12V0",
      "DescArg4": "13.2",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys3V1HighMntr": {
      "Reading": "<=/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096)",
      "@Default": {
        "Reading": 3.3
      },
      "OperatorId": 4,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "3.3V",
      "DescArg3": "EXU_V_STBY_3V3",
      "DescArg4": "3.6",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys5V1HighMntr": {
      "Reading": "<=/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",
      "@Default": {
        "Reading": 5
      },
      "OperatorId": 4,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "5V",
      "DescArg3": "EXU_V_VCC_5V0",
      "DescArg4": "5.5",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys5V2HighMntr": {
      "Reading": "<=/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",
      "@Default": {
        "Reading": 5
      },
      "OperatorId": 4,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "5V",
      "DescArg3": "EXU_V_STBY_5V0",
      "DescArg4": "5.5",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys12V1LowMntr": {
      "Reading": "<=/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",
      "@Default": {
        "Reading": 12
      },
      "OperatorId": 2,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys12V1Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "12V",
      "DescArg3": "EXU_V_VCC1_12V0",
      "DescArg4": "10.8",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys12V2LowMntr": {
      "Reading": "<=/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",
      "@Default": {
        "Reading": 12
      },
      "OperatorId": 2,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys12V2Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "12V",
      "DescArg3": "EXU_V_VCC2_12V0",
      "DescArg4": "10.8",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys12V3LowMntr": {
      "Reading": "<=/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096)",
      "@Default": {
        "Reading": 12
      },
      "OperatorId": 2,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys12V3Mntr.Value |> expr(((($1 // 10) > 255) ? 178 : (($1 // 10) & 255)) * 2.5 * 11 * 10 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "12V",
      "DescArg3": "EXU_V_VCC3_12V0",
      "DescArg4": "10.8",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys3V1LowMntr": {
      "Reading": "<=/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096)",
      "@Default": {
        "Reading": 3.3
      },
      "OperatorId": 2,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys3V1Mntr.Value |> expr(((($1 // 20) > 255) ? 135 : (($1 // 20) & 255)) * 2.5 * 2 * 20 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "3.3V",
      "DescArg3": "EXU_V_STBY_3V3",
      "DescArg4": "3.0",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys5V1LowMntr": {
      "Reading": "<=/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",
      "@Default": {
        "Reading": 5
      },
      "OperatorId": 2,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys5V1Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "5V",
      "DescArg3": "EXU_V_VCC_5V0",
      "DescArg4": "4.5",
      "Component": "#/Component_ComExpander"
    },
    "Event_ECUSys5V2LowMntr": {
      "Reading": "<=/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096)",
      "@Default": {
        "Reading": 5
      },
      "OperatorId": 2,
      "Enabled": true,
      "AdditionalInfo": "3",
      "DescArg1": "#/Scanner_ECUSys5V2Mntr.Value |> expr(((($1 // 20) > 255) ? 137 : (($1 // 20) & 255)) * 2.5 * 3 * 20 / 4096) |> string.format('%0.3f', $1)",
      "DescArg2": "5V",
      "DescArg3": "EXU_V_STBY_5V0",
      "DescArg4": "4.5",
      "Component": "#/Component_ComExpander"
    },
    "Event_CpuBrdPresenceMntr": {
      "Reading": "<=/Scanner_CpuBrdPresenceMntr.Value",
      "@Default": {
        "Reading": 1
      },
      "OperatorId": 5,
      "Enabled": true,
      "DescArg2": "BCU",
      "Component": "#/Component_Cable"
    },
    "Event_FanCableMntr": {
      "Reading": "<=/Scanner_FanCableMntr.Value",
      "@Default": {
        "Reading": 1
      },
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Cable"
    },
    "Event_ButtonPowerButtonPressed": {
      "Reading": "<=/Scanner_PowerBtnEvt.Value",
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_Button"
    },
    "Event_SystemACPIWorkingState": {
      "Reading": "<=/Scanner_PowerGood.Status;<=/Scanner_PowerGood.Value |> expr($1 == 4 ? 255 : $2)",
      "@Default": {
        "Reading": 255
      },
      "OperatorId": 5,
      "Enabled": true,
      "Component": "#/Component_ComSystem"
    },
    "Event_SystemACPISoftOffState": {
      "Reading": "<=/Scanner_PowerGood.Status;<=/Scanner_PowerGood.Value |> expr($1 == 4 ? 255 : $2)",
      "@Default": {
        "Reading": 255
      },
      "OperatorId": 8,
      "Enabled": true,
      "Component": "#/Component_ComSystem"
    },
    "Event_ExpBoardReplaceMntr": {
      "Reading": "<=/Component_ComExpander.ReplaceFlag",
      "OperatorId": 5,
      "Enabled": true,
      "DescArg1": "#/Component_ComExpander.Instance",
      "DescArg2": "#/Component_ComExpander.PreviousSN",
      "DescArg3": "#/Component_ComExpander.SerialNumber",
      "Component": "#/Component_ComExpander"
    },
    "Event_UIDButtonMntr": {
      "Reading": "<=/Chassis_1.UidButtonPressed",
      "OperatorId": 6,
      "Enabled": true,
      "Component": "#/Component_Button"
    },
    "Event_CpldSelfcheck": {
      "Reading": "<=/ExpBoard_1.CpldStatus",
      "OperatorId": 5,
      "Enabled": true,
      "DescArg1": "1",
      "Component": "#/Component_ComExpander",
      "@Default": {
        "Reading": 255
      },
      "InvalidReadingIgnore": 1,
      "InvalidReading": 255
    }
  }
};

/** 示例工程根 .sr 的展示路径（用于节点标识 / 相对路径显示）。 */
export const CSR_SAMPLE_ROOT_PATH = '14100513_920s.sr';

/**
 * 合并硬件 + 软件 .sr 为单个板卡描述符。
 * - 顶层字段以硬件文件为准（保留 ManagementTopology）。
 * - Objects 为并集；同名对象做一层字段合并（软件字段补充到硬件对象上）。
 */
export function buildCsrSampleRootSr(): SrDoc {
  const objects: Record<string, Record<string, unknown>> = {};
  for (const [k, v] of Object.entries(CSR_SAMPLE_HW_SR.Objects ?? {})) objects[k] = { ...v };
  for (const [k, v] of Object.entries(CSR_SAMPLE_SOFT_SR.Objects ?? {})) {
    objects[k] = { ...(objects[k] ?? {}), ...v };
  }
  return { ...CSR_SAMPLE_HW_SR, Objects: objects };
}
