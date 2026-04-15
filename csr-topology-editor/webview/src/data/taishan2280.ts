import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  // ── 板卡1：I_0（左上）──
  { id: 'g_i0', type: 'group', position: { x: 120, y: 120 },
    data: { label: 'I_0' }, style: { width: 320, height: 220 } },
  { id: 'bus_i0', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_1' }, parentId: 'g_i0' },
  { id: 'chip_i0_eeprom1', type: 'chip', position: { x: 110, y: 130 },
    data: { chipType: 'Eeprom' }, parentId: 'g_i0' },
  { id: 'chip_i0_eeprom2', type: 'chip', position: { x: 190, y: 130 },
    data: { chipType: 'Eeprom' }, parentId: 'g_i0' },

  // ── 板卡2：SMC（左中）──
  { id: 'g_smc', type: 'group', position: { x: 120, y: 380 },
    data: { label: 'SMC' }, style: { width: 320, height: 220 } },
  { id: 'bus_smc', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_2' }, parentId: 'g_smc' },
  { id: 'chip_smc_1', type: 'chip', position: { x: 150, y: 130 },
    data: { chipType: 'Smc' }, parentId: 'g_smc' },

  // ── 板卡3：I_2（左下）──
  { id: 'g_i2', type: 'group', position: { x: 120, y: 640 },
    data: { label: 'I_2' }, style: { width: 320, height: 220 } },
  { id: 'bus_i2', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_3' }, parentId: 'g_i2' },
  { id: 'chip_i2_eeprom1', type: 'chip', position: { x: 110, y: 130 },
    data: { chipType: 'Eeprom' }, parentId: 'g_i2' },
  { id: 'chip_i2_eeprom2', type: 'chip', position: { x: 190, y: 130 },
    data: { chipType: 'Eeprom' }, parentId: 'g_i2' },

  // ── 板卡4：LST_Board（中间大区域）──
  { id: 'g_lst', type: 'group', position: { x: 500, y: 120 },
    data: { label: 'LST_Board' }, style: { width: 560, height: 800 } },

  // 第一组：bus → pca9545 → 4个芯片
  { id: 'bus_lst1', type: 'bus', position: { x: 60, y: 110 },
    data: { label: 'i2cbus_4' }, parentId: 'g_lst' },
  { id: 'mux_lst1', type: 'mux', position: { x: 340, y: 110 },
    data: { label: 'Pca9545' }, parentId: 'g_lst' },
  { id: 'chip_lst1_eeprom', type: 'chip', position: { x: 150, y: 190 },
    data: { chipType: 'Eeprom' }, parentId: 'g_lst' },
  { id: 'chip_lst1_cpu', type: 'chip', position: { x: 230, y: 190 },
    data: { chipType: 'CPU' }, parentId: 'g_lst' },
  { id: 'chip_lst1_lm75', type: 'chip', position: { x: 310, y: 190 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },
  { id: 'chip_lst1_eeprom2', type: 'chip', position: { x: 390, y: 190 },
    data: { chipType: 'Eeprom' }, parentId: 'g_lst' },
  { id: 'chip_lst1_lm75b', type: 'chip', position: { x: 270, y: 270 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },

  // 第二组：bus → pca9545 → 4个Lm75
  { id: 'bus_lst2', type: 'bus', position: { x: 60, y: 340 },
    data: { label: 'i2cbus_5' }, parentId: 'g_lst' },
  { id: 'mux_lst2', type: 'mux', position: { x: 340, y: 340 },
    data: { label: 'Pca9545' }, parentId: 'g_lst' },
  { id: 'chip_lst2_lm1', type: 'chip', position: { x: 170, y: 400 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },
  { id: 'chip_lst2_lm2', type: 'chip', position: { x: 240, y: 400 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },
  { id: 'chip_lst2_lm3', type: 'chip', position: { x: 310, y: 400 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },
  { id: 'chip_lst2_lm4', type: 'chip', position: { x: 380, y: 400 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },

  // SMBus → Cpld
  { id: 'bus_smbus', type: 'smbus', position: { x: 60, y: 480 },
    data: { label: 'smbus_0' }, parentId: 'g_lst' },
  { id: 'chip_cpld', type: 'chip', position: { x: 320, y: 540 },
    data: { chipType: 'Cpld' }, parentId: 'g_lst' },

  // ComponentFuncGroup（青色总线）
  { id: 'bus_cfg', type: 'smbus', position: { x: 60, y: 580 },
    data: { label: 'ComponentFuncGroup_0' }, parentId: 'g_lst',
    style: { background: '#06b6d4', width: 180 } },

  // 第三组：bus → pca9545 → 4芯片
  { id: 'bus_lst3', type: 'bus', position: { x: 60, y: 640 },
    data: { label: 'i2cbus_6' }, parentId: 'g_lst' },
  { id: 'mux_lst3', type: 'mux', position: { x: 340, y: 640 },
    data: { label: 'Pca9545' }, parentId: 'g_lst' },
  { id: 'chip_lst3_eeprom', type: 'chip', position: { x: 150, y: 680 },
    data: { chipType: 'Eeprom' }, parentId: 'g_lst' },
  { id: 'chip_lst3_cpu', type: 'chip', position: { x: 230, y: 680 },
    data: { chipType: 'CPU' }, parentId: 'g_lst' },
  { id: 'chip_lst3_lm75', type: 'chip', position: { x: 310, y: 680 },
    data: { chipType: 'Lm75' }, parentId: 'g_lst' },
  { id: 'chip_lst3_eeprom2', type: 'chip', position: { x: 390, y: 680 },
    data: { chipType: 'Eeprom' }, parentId: 'g_lst' },

  // 虚线总线（预留）
  { id: 'bus_lst_dash1', type: 'bus', position: { x: 60, y: 740 },
    data: { label: 'i2cbus_7', dashed: true }, parentId: 'g_lst' },
  { id: 'bus_lst_dash2', type: 'bus', position: { x: 60, y: 780 },
    data: { label: 'i2cbus_8', dashed: true }, parentId: 'g_lst' },

  // ── 板卡5：Base_Board（右侧大区域）──
  { id: 'g_base', type: 'group', position: { x: 1120, y: 120 },
    data: { label: 'Base_Board' }, style: { width: 560, height: 800 } },

  // 顶部独立 Eeprom
  { id: 'bus_base1', type: 'bus', position: { x: 80, y: 80 },
    data: { label: 'i2cbus_9' }, parentId: 'g_base' },
  { id: 'chip_base_eeprom0', type: 'chip', position: { x: 360, y: 80 },
    data: { chipType: 'Eeprom' }, parentId: 'g_base' },

  // MCU_NP_T25_0 子容器
  { id: 'g_mcu', type: 'group', position: { x: 280, y: 180 },
    data: { label: 'MCU_NP_T25_0' }, parentId: 'g_base', 
    style: { width: 260, height: 300, background: '#1a2a3a', border: '1px dashed #3a5a7a' } },
  { id: 'chip_mcu_cpu1', type: 'chip', position: { x: 80, y: 80 },
    data: { chipType: 'CPU' }, parentId: 'g_mcu' },
  { id: 'chip_mcu_cpu2', type: 'chip', position: { x: 150, y: 80 },
    data: { chipType: 'CPU' }, parentId: 'g_mcu' },
  { id: 'chip_mcu_eeprom1', type: 'chip', position: { x: 80, y: 180 },
    data: { chipType: 'Eeprom' }, parentId: 'g_mcu' },
  { id: 'chip_mcu_eeprom2', type: 'chip', position: { x: 150, y: 180 },
    data: { chipType: 'Eeprom' }, parentId: 'g_mcu' },

  // pca9545 下挂多芯片
  { id: 'mux_base', type: 'mux', position: { x: 230, y: 280 },
    data: { label: 'Pca9545' }, parentId: 'g_base' },
  { id: 'chip_base_cpu1', type: 'chip', position: { x: 100, y: 350 },
    data: { chipType: 'CPU' }, parentId: 'g_base' },
  { id: 'chip_base_cpu2', type: 'chip', position: { x: 170, y: 350 },
    data: { chipType: 'CPU' }, parentId: 'g_base' },
  { id: 'chip_base_cpu3', type: 'chip', position: { x: 240, y: 350 },
    data: { chipType: 'CPU' }, parentId: 'g_base' },
  { id: 'chip_base_cpu4', type: 'chip', position: { x: 310, y: 350 },
    data: { chipType: 'CPU' }, parentId: 'g_base' },
  { id: 'chip_base_eeprom1', type: 'chip', position: { x: 135, y: 450 },
    data: { chipType: 'Eeprom' }, parentId: 'g_base' },
  { id: 'chip_base_eeprom2', type: 'chip', position: { x: 275, y: 450 },
    data: { chipType: 'Eeprom' }, parentId: 'g_base' },

  // 底部两排总线
  { id: 'bus_base2', type: 'bus', position: { x: 80, y: 540 },
    data: { label: 'i2cbus_10' }, parentId: 'g_base' },
  { id: 'chip_base_smc1', type: 'chip', position: { x: 360, y: 540 },
    data: { chipType: 'Smc' }, parentId: 'g_base' },
  { id: 'chip_base_smc2', type: 'chip', position: { x: 430, y: 540 },
    data: { chipType: 'Smc' }, parentId: 'g_base' },

  { id: 'bus_base3', type: 'bus', position: { x: 80, y: 600 },
    data: { label: 'i2cbus_11' }, parentId: 'g_base' },

  // ── 板卡6：Base_Fan（右上，独立）──
  { id: 'g_fan', type: 'group', position: { x: 1750, y: 120 },
    data: { label: 'Base_Fan' }, style: { width: 260, height: 220 } },
  { id: 'bus_fan', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_f' }, parentId: 'g_fan' },
  { id: 'chip_fan_cpu1', type: 'chip', position: { x: 90, y: 130 },
    data: { chipType: 'CPU' }, parentId: 'g_fan' },
  { id: 'chip_fan_eeprom', type: 'chip', position: { x: 170, y: 130 },
    data: { chipType: 'Eeprom' }, parentId: 'g_fan' },

  // ── 板卡7：Base_NF（右上，独立）──
  { id: 'g_nf', type: 'group', position: { x: 1750, y: 380 },
    data: { label: 'Base_NF' }, style: { width: 260, height: 220 } },
  { id: 'bus_nf', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_nf' }, parentId: 'g_nf' },
  { id: 'chip_nf_cpu1', type: 'chip', position: { x: 50, y: 130 },
    data: { chipType: 'CPU' }, parentId: 'g_nf' },
  { id: 'chip_nf_cpu2', type: 'chip', position: { x: 110, y: 130 },
    data: { chipType: 'CPU' }, parentId: 'g_nf' },
  { id: 'chip_nf_cpu3', type: 'chip', position: { x: 170, y: 130 },
    data: { chipType: 'CPU' }, parentId: 'g_nf' },

  // ── 板卡8：Riser（左下，独立）──
  { id: 'g_riser', type: 'group', position: { x: 120, y: 900 },
    data: { label: 'Riser' }, style: { width: 320, height: 220 } },
  { id: 'bus_riser', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_r' }, parentId: 'g_riser' },
  { id: 'chip_riser_cpu', type: 'chip', position: { x: 130, y: 130 },
    data: { chipType: 'CPU' }, parentId: 'g_riser' },
  { id: 'chip_riser_eeprom', type: 'chip', position: { x: 200, y: 130 },
    data: { chipType: 'Eeprom' }, parentId: 'g_riser' },

  // ── 板卡9：FGB（底部中间）──
  { id: 'g_fgb', type: 'group', position: { x: 620, y: 1000 },
    data: { label: 'FGB' }, style: { width: 360, height: 240 } },
  { id: 'bus_fgb', type: 'bus', position: { x: 50, y: 90 },
    data: { label: 'i2cbus_fgb' }, parentId: 'g_fgb' },
  { id: 'chip_fgb_big1', type: 'bigchip', position: { x: 110, y: 120 },
    data: { chipType: 'CPU' }, parentId: 'g_fgb' },
  { id: 'chip_fgb_big2', type: 'bigchip', position: { x: 210, y: 120 },
    data: { chipType: 'CPU' }, parentId: 'g_fgb' },
];

export const initialEdges: Edge[] = [
  // I_0 板卡内部连线（粉色）
  { id: 'e_i0_1', source: 'bus_i0', target: 'chip_i0_eeprom1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_i0_2', source: 'bus_i0', target: 'chip_i0_eeprom2', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // SMC 板卡
  { id: 'e_smc_1', source: 'bus_smc', target: 'chip_smc_1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // I_2 板卡
  { id: 'e_i2_1', source: 'bus_i2', target: 'chip_i2_eeprom1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_i2_2', source: 'bus_i2', target: 'chip_i2_eeprom2', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // LST_Board 第一组 - 使用直线避免弯曲
  { id: 'e_lst1_mux', source: 'bus_lst1', target: 'mux_lst1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_lst1_c1', source: 'mux_lst1', target: 'chip_lst1_eeprom', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst1_c2', source: 'mux_lst1', target: 'chip_lst1_cpu', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst1_c3', source: 'mux_lst1', target: 'chip_lst1_lm75', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst1_c4', source: 'mux_lst1', target: 'chip_lst1_eeprom2', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst1_c5', source: 'mux_lst1', target: 'chip_lst1_lm75b', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },

  // LST_Board 第二组
  { id: 'e_lst2_mux', source: 'bus_lst2', target: 'mux_lst2', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_lst2_c1', source: 'mux_lst2', target: 'chip_lst2_lm1', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst2_c2', source: 'mux_lst2', target: 'chip_lst2_lm2', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst2_c3', source: 'mux_lst2', target: 'chip_lst2_lm3', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst2_c4', source: 'mux_lst2', target: 'chip_lst2_lm4', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },

  // SMBus → Cpld
  { id: 'e_smb_cpld', source: 'bus_smbus', target: 'chip_cpld', type: 'straight', style: { stroke: '#4ade80', strokeWidth: 1.5 } },

  // LST_Board 第三组
  { id: 'e_lst3_mux', source: 'bus_lst3', target: 'mux_lst3', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_lst3_c1', source: 'mux_lst3', target: 'chip_lst3_eeprom', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst3_c2', source: 'mux_lst3', target: 'chip_lst3_cpu', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst3_c3', source: 'mux_lst3', target: 'chip_lst3_lm75', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_lst3_c4', source: 'mux_lst3', target: 'chip_lst3_eeprom2', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },

  // 虚线连线 - 使用直线
  { id: 'e_dash1', source: 'bus_lst_dash1', target: 'bus_base3', type: 'straight',
    style: { stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '4 4' } },

  // 跨板卡蓝色连线（带编号标签）- 使用step避免过度弯曲
  { id: 'e_cross1', source: 'bus_lst1', target: 'bus_base1', type: 'step',
    style: { stroke: '#60a5fa', strokeWidth: 1.5 }, label: '11',
    labelStyle: { fill: '#fff', fontSize: 10 },
    labelBgStyle: { fill: '#1e1e2e', rx: 4 } },
  { id: 'e_cross2', source: 'bus_lst2', target: 'bus_base2', type: 'step',
    style: { stroke: '#60a5fa', strokeWidth: 1.5 }, label: '12' },
  { id: 'e_cross3', source: 'bus_smbus', target: 'bus_base3', type: 'step',
    style: { stroke: '#60a5fa', strokeWidth: 1.5 }, label: '13' },

  // Base_Board 内部 - 使用直线
  { id: 'e_base_eeprom', source: 'bus_base1', target: 'chip_base_eeprom0', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_base_mux', source: 'bus_base1', target: 'mux_base', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_base_c1', source: 'mux_base', target: 'chip_base_cpu1', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_base_c2', source: 'mux_base', target: 'chip_base_cpu2', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_base_c3', source: 'mux_base', target: 'chip_base_cpu3', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_base_c4', source: 'mux_base', target: 'chip_base_cpu4', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_base_ep1', source: 'mux_base', target: 'chip_base_eeprom1', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_base_ep2', source: 'mux_base', target: 'chip_base_eeprom2', type: 'straight', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
  { id: 'e_base_smc1', source: 'bus_base2', target: 'chip_base_smc1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_base_smc2', source: 'bus_base2', target: 'chip_base_smc2', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // Riser
  { id: 'e_riser1', source: 'bus_riser', target: 'chip_riser_cpu', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_riser2', source: 'bus_riser', target: 'chip_riser_eeprom', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // FGB
  { id: 'e_fgb1', source: 'bus_fgb', target: 'chip_fgb_big1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_fgb2', source: 'bus_fgb', target: 'chip_fgb_big2', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // Base_Fan
  { id: 'e_fan1', source: 'bus_fan', target: 'chip_fan_cpu1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_fan2', source: 'bus_fan', target: 'chip_fan_eeprom', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },

  // Base_NF
  { id: 'e_nf1', source: 'bus_nf', target: 'chip_nf_cpu1', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_nf2', source: 'bus_nf', target: 'chip_nf_cpu2', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
  { id: 'e_nf3', source: 'bus_nf', target: 'chip_nf_cpu3', type: 'straight', style: { stroke: '#e879a0', strokeWidth: 1.5 } },
];
