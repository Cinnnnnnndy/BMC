import type { BoardTopologyModel } from '../types';

export const TIANCHI_BOARD_TOPOLOGY: BoardTopologyModel = {
  name: 'Huawei TianChi',
  links: [
    { fromBoard: 'RootBoard', viaConnector: 'Connector_EXU_1', toBoard: 'EXU_1', viaBus: 'I2c_2' },
    { fromBoard: 'EXU_1', viaConnector: 'Connector_PCIe_1', toBoard: 'IEU_1', viaBus: 'I2cMux_9545Chan2' },
    { fromBoard: 'EXU_1', viaConnector: 'Connector_ACU1', toBoard: 'BCU_1', viaBus: 'I2c_7' },
    { fromBoard: 'EXU_1', viaConnector: 'Connector_Fan1DualSensor', toBoard: 'CLU_1', viaBus: 'I2c_2' },
    { fromBoard: 'EXU_1', viaConnector: 'PSU Slot', toBoard: 'PSU_1', viaBus: 'I2c_2' },
    { fromBoard: 'BCU_1', viaConnector: 'Storage Backplane Link', toBoard: 'SEU_1', viaBus: 'Hisport_0' },
  ],
  boards: [
    {
      boardType: 'Root',
      boardInstance: 'RootBoard',
      sourceFile: 'Huawei/Server/Kunpeng/openUBMC/root.sr',
      buses: [
        { name: 'I2c_1', busClass: 'I2c' },
        { name: 'I2c_2', busClass: 'I2c' },
        { name: 'I2c_3', busClass: 'I2c' },
        { name: 'Jtag_1', busClass: 'Jtag' },
        { name: 'Hisport_0', busClass: 'Hisport' },
      ],
      connectors: [
        { name: 'Connector_EXU_1', type: 'ExpandBoard', slot: 1, silkText: 'J6023', buses: ['I2c_1', 'I2c_2', 'I2c_3', 'Jtag_1', 'Hisport_0'] },
      ],
      devices: [
        { type: 'Scanner', name: 'Scanner_Gpio31', refBus: 'Gpio_31', refConnector: null },
        { type: 'Chip', name: 'Chip_Gpio_56', refBus: 'Gpio_56', refConnector: null },
      ],
    },
    {
      boardType: 'EXU',
      boardInstance: 'EXU_1',
      sourceFile: 'TianChi/EXU/14060876_00000001010302047647.sr',
      buses: [
        { name: 'I2c_7', busClass: 'I2c' },
        { name: 'I2cMux_Pca9545_i2c8_chip_3', busClass: 'I2cMux' },
        { name: 'JtagMux_JtagSwitch_1_1', busClass: 'Jtag' },
      ],
      connectors: [
        { name: 'Connector_ACU1', type: 'ACU', slot: 1, silkText: 'ACU1', buses: ['I2cMux_Pca9545_i2c8_chip_3', 'JtagMux_JtagSwitch_1_1'] },
        { name: 'Connector_PCIe_1', type: 'PCIe', slot: 1, buses: ['I2cMux_9545Chan2'] },
      ],
      devices: [
        { type: 'Scanner', name: 'Scanner_ACU1', refBus: 'I2c_7', refConnector: 'Connector_ACU1' },
        { type: 'ThresholdSensor', name: 'ThresholdSensor_InflowTemp', refBus: 'I2c_11', refConnector: null },
        { type: 'Chip', name: 'Chip_UsbCc_1', refBus: 'I2cMux_Pca9545_i2c8_chip_3', refConnector: 'Connector_ACU1' },
      ],
    },
    {
      boardType: 'BCU',
      boardInstance: 'BCU_1',
      sourceFile: 'TianChi/BCU/14100513_00000001020302071127.sr',
      buses: [
        { name: 'I2c_1', busClass: 'I2c' },
        { name: 'Hisport_0', busClass: 'Hisport' },
        { name: 'JtagOverLocalBus_1', busClass: 'Jtag' },
      ],
      connectors: [
        { name: 'Connector_PCIE_SLOT_1', type: 'PCIe', slot: 1, buses: ['I2c_1', 'Hisport_0'] },
      ],
      devices: [
        { type: 'Chip', name: 'Chip_CPLD_1', refBus: 'I2c_1', refConnector: null },
        { type: 'Scanner', name: 'Scanner_CpuTemp_1', refBus: 'I2c_1', refConnector: null },
        { type: 'Event', name: 'Event_CPUOverTemp', refBus: null, refConnector: 'Connector_PCIE_SLOT_1' },
      ],
    },
    {
      boardType: 'IEU',
      boardInstance: 'IEU_1',
      sourceFile: 'TianChi/IEU/14100513_00000001040302023940.sr',
      buses: [
        { name: 'Hisport_5', busClass: 'Hisport' },
        { name: 'I2cMux_9545Chan2', busClass: 'I2cMux' },
        { name: 'I2cMux_9545Chan4', busClass: 'I2cMux' },
      ],
      connectors: [
        { name: 'Connector_PCIe_1', type: 'PCIe', slot: 1, silkText: 'RiserCard${Slot}', buses: ['I2cMux_9545Chan2'] },
      ],
      devices: [
        { type: 'Chip', name: 'Chip_MCU', refBus: 'I2cMux_9545Chan4', refConnector: null },
        { type: 'Scanner', name: 'Scanner_Riser3V3Event', refBus: 'I2cMux_9545Chan2', refConnector: 'Connector_PCIe_1' },
        { type: 'Event', name: 'Event_Riser3V3Event', refBus: null, refConnector: 'Connector_PCIe_1' },
      ],
    },
    {
      boardType: 'CLU',
      boardInstance: 'CLU_1',
      sourceFile: 'TianChi/CLU/14100363_00000001050302035475.sr',
      buses: [
        { name: 'I2c_2', busClass: 'I2c' },
        { name: 'JtagOverLocalBus_1', busClass: 'Jtag' },
      ],
      connectors: [
        { name: 'Connector_Fan1DualSensor', type: 'Fan', slot: 1, buses: ['I2c_2'] },
      ],
      devices: [
        { type: 'Chip', name: 'Chip_Fan_PWM', refBus: 'I2c_2', refConnector: null },
        { type: 'Scanner', name: 'Scanner_Fan1Presence', refBus: 'I2c_2', refConnector: 'Connector_Fan1DualSensor' },
        { type: 'ThresholdSensor', name: 'ThresholdSensor_Fan1Speed', refBus: 'I2c_2', refConnector: null },
      ],
    },
    {
      boardType: 'PSU',
      boardInstance: 'PSU_1',
      sourceFile: 'TianChi/PSU/14191046_PSU_00000001010302049109.sr',
      buses: [{ name: 'I2c_2', busClass: 'I2c' }],
      connectors: [{ name: 'PSU Slot', type: 'Power', slot: 1, buses: ['I2c_2'] }],
      devices: [
        { type: 'Scanner', name: 'Scanner_PsuInputVoltage', refBus: 'I2c_2', refConnector: 'PSU Slot' },
        { type: 'ThresholdSensor', name: 'ThresholdSensor_PsuTemp', refBus: 'I2c_2', refConnector: null },
        { type: 'Event', name: 'Event_PsuFault', refBus: null, refConnector: 'PSU Slot' },
      ],
    },
    {
      boardType: 'SEU',
      boardInstance: 'SEU_1',
      sourceFile: 'TianChi/SEU/14140224_PROTOCOL_0.sr',
      buses: [
        { name: 'I2cMux_SMC', busClass: 'I2cMux' },
        { name: 'Hisport_0', busClass: 'Hisport' },
      ],
      connectors: [{ name: 'Connector_ComVPDConnect_1', type: 'Storage', slot: 1, buses: ['Hisport_0'] }],
      devices: [
        { type: 'Chip', name: 'Chip_Virtual_SSD', refBus: 'I2cMux_SMC', refConnector: null },
        { type: 'Scanner', name: 'Scanner_NvmeTemp', refBus: 'I2cMux_SMC', refConnector: null },
        { type: 'ThresholdSensor', name: 'ThresholdSensor_NvmeTemp', refBus: 'I2cMux_SMC', refConnector: null },
      ],
    },
  ],
};
