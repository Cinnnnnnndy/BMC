# 提示词： CSR 拓扑可视化编辑器

请严格参考我的示意图，用以下技术栈实现：
- React + TypeScript
- @xyflow/react（React Flow v12）
- CSS Modules（不用 Tailwind）

安装依赖：
```
npm install @xyflow/react lucide-react react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

---

## 一、整体页面布局

### 背景
- 全屏深色背景：#1a1a2a
- 画布区域网格：细点阵，点颜色 #2a2a3a，间距 20px

### 顶部导航栏（TopBar）
高度 48px，背景 #141420，底部 1px 边框 #2a2a3e

左侧从左到右：
- ← 返回按钮（灰色图标）
- TaiShan 品牌 Logo（圆形蓝紫渐变图标，内含"T"字母）
- "TaiShan 200 Server" 白色文字，字重500
- "2280" 蓝色小徽章（背景#3b4fd8，圆角4px，padding 2px 8px）
- "管理视图 ▼" 灰色文字 + 下拉箭头，左侧有分隔线

右侧从左到右：
- "查看代码" 灰色文字按钮
- "|" 分隔符
- "在线调试" 灰色文字按钮
- "配置检查" 灰色文字按钮
- "|" 分隔符
- "CSR出包" 蓝色实心按钮（背景#4f6ef7，圆角6px，hover加亮）

### 底部工具栏（BottomBar）
悬浮在画布底部中央，背景#1e1e2e，圆角12px，padding 8px 16px
包含图标按钮（从左到右）：
选择工具 | 连线工具 | 添加节点 | 对齐工具 | 撤销 | 重做 | 移动 | 锁定 | 注释 | 更多设置 

---

## 二、节点类型（Custom Nodes）

### A. 板卡容器（Group Node）
```
样式：
- 背景：#1e1e2e，圆角 8px
- 边框：1px solid #2e2e4e（实线）或 1.5px dashed #3a3a5a（虚线子区域）
- 左上角标签：白色小字（12px），如 "I_0", "SMC", "I_2", "LST_Board",
              "Base_Board", "Base_Fan", "Base_NF", "Riser", "FGB"
- 可拖拽调整大小（resizable）
- 不显示连接点
- 外层大容器（包含所有板卡）：边框 1px solid #3a3a5a，背景透明
```

### B. I2C 总线节点（BusNode）
```
尺寸：宽约 80px，高 22px，圆角 11px
背景：粉色 #e879a0（亮粉色）
文字：白色，10px，居中显示总线名（如 i2cbus_1）
左侧连接点：蓝色实心圆（直径8px，#4a9eff）
右侧：无连接点（通过边连接子节点）
```

### C. Pca9545 多路复用器节点（MuxNode）
```
尺寸：宽约 72px，高 22px，圆角 11px
背景：紫色 #a855f7
文字：白色，10px，居中显示 "Pca9545"
顶部有一个输入连接点
底部有 4 个输出连接点（均匀分布，白色小圆点）
```

### D. 芯片器件节点（ChipNode）
```
尺寸：宽 52px，高 64px，圆角 6px
背景：#252535（深色）
边框：1px solid #3a3a5a

内部结构（从上到下）：
1. 顶部彩色标题条（高 16px，圆角 top 6px）
   - Eeprom → 灰蓝 #6b7280
   - CPU    → 绿色 #22c55e（实际图中为亮绿）
   - Lm75   → 紫色 #8b5cf6
   - Smc    → 橙色 #f59e0b
   - Cpld   → 青色 #06b6d4

2. 中间区域（高 28px）：
   - 灰色 IC 芯片图标（方形，内有引脚线条，SVG绘制）
   - 图标颜色：#6b7280

3. 底部文字标签（高 16px）：
   - 灰色文字，9px，居中
   - 显示芯片类型：Eeprom / CPU / Lm75 / Smc / Cpld

顶部中央：1个输入连接点（白色小圆点，直径6px）
无输出连接点（叶子节点）
```

### E. SMBus 节点（SMBusNode）
```
同 BusNode 样式，但：
背景：绿色 #4ade80
文字：深色 #1a2e1a
名称：如 "smbus_0"
```

### F. 图形化芯片节点（BigChipNode，用于 FGB 区域）
```
尺寸：宽 70px，高 80px，圆角 8px
背景：#252535
内部显示大尺寸 IC 图标（带引脚的芯片图形）
底部标签：芯片类型名
```

### G. 外部连接锚点（AnchorNode）
```
小方块，8px×8px，颜色 #4a9eff
出现在容器边缘，用于跨容器连线的中转点
无文字
```

---

## 三、边（Edge）样式

```
类型：smoothstep（平滑折线）
动画：无

颜色规则：
- 粉色边 #e879a0：I2C 总线 → 子节点的连线
- 紫色边 #a855f7：Pca9545 通道 → 子节点
- 绿色边 #4ade80：SMBus 连线
- 蓝色边 #60a5fa：跨板卡连线（较细）
- 白色虚线边：预留/可选路径（strokeDasharray: "4 4"）

线宽：1.5px
末端：无箭头（图中观察为无箭头，仅连线）

编号标签：
- 部分连线末端显示小数字（11, 12, 13...25）
- 小标签样式：白色圆角矩形背景，黑色数字，10px
- 位于连线右端末尾
```

---

## 四、完整节点数据（initialNodes）

```typescript
// 精确还原图中所有节点位置和连线

// ── 外层大容器 ──
{ id: 'outer', type: 'group', position: {x:80, y:80},
  style: {width:920, height:700} }

// ── 板卡1：I_0（左上）──
{ id: 'g_i0', type: 'group', position: {x:100, y:60},
  data: {label:'I_0'}, style: {width:200, height:130} }
{ id: 'bus_i0', type: 'bus', position: {x:30, y:50},
  data: {label:'i2cbus_1'}, parentId:'g_i0' }
{ id: 'chip_i0_eeprom1', type: 'chip', position: {x:60, y:85},
  data: {chipType:'Eeprom'}, parentId:'g_i0' }
{ id: 'chip_i0_eeprom2', type: 'chip', position: {x:120, y:85},
  data: {chipType:'Eeprom'}, parentId:'g_i0' }

// ── 板卡2：SMC（左中）──
{ id: 'g_smc', type: 'group', position: {x:100, y:220},
  data: {label:'SMC'}, style: {width:200, height:110} }
{ id: 'bus_smc', type: 'bus', position: {x:30, y:45},
  data: {label:'i2cbus_2'}, parentId:'g_smc' }
{ id: 'chip_smc_1', type: 'chip', position: {x:80, y:80},
  data: {chipType:'Smc'}, parentId:'g_smc' }

// ── 板卡3：I_2（左下）──
{ id: 'g_i2', type: 'group', position: {x:100, y:370},
  data: {label:'I_2'}, style: {width:200, height:130} }
{ id: 'bus_i2', type: 'bus', position: {x:30, y:50},
  data: {label:'i2cbus_3'}, parentId:'g_i2' }
{ id: 'chip_i2_eeprom1', type: 'chip', position: {x:60, y:85},
  data: {chipType:'Eeprom'}, parentId:'g_i2' }
{ id: 'chip_i2_eeprom2', type: 'chip', position: {x:120, y:85},
  data: {chipType:'Eeprom'}, parentId:'g_i2' }

// ── 板卡4：LST_Board（中间大区域）──
{ id: 'g_lst', type: 'group', position: {x:340, y:60},
  data: {label:'LST_Board'}, style: {width:320, height:650} }

// 第一组：bus → pca9545 → 4个芯片
{ id: 'bus_lst1', type: 'bus', position: {x:30, y:60},
  data: {label:'i2cbus_4'}, parentId:'g_lst' }
{ id: 'mux_lst1', type: 'mux', position: {x:200, y:58},
  data: {label:'Pca9545'}, parentId:'g_lst' }
{ id: 'chip_lst1_eeprom', type: 'chip', position: {x:90, y:100},
  data: {chipType:'Eeprom'}, parentId:'g_lst' }
{ id: 'chip_lst1_cpu', type: 'chip', position: {x:150, y:100},
  data: {chipType:'CPU'}, parentId:'g_lst' }
{ id: 'chip_lst1_lm75', type: 'chip', position: {x:210, y:100},
  data: {chipType:'Lm75'}, parentId:'g_lst' }
{ id: 'chip_lst1_eeprom2', type: 'chip', position: {x:270, y:100},
  data: {chipType:'Eeprom'}, parentId:'g_lst' }
{ id: 'chip_lst1_lm75b', type: 'chip', position: {x:200, y:165},
  data: {chipType:'Lm75'}, parentId:'g_lst' }

// 第二组：bus → pca9545 → 4个Lm75
{ id: 'bus_lst2', type: 'bus', position: {x:30, y:230},
  data: {label:'i2cbus_5'}, parentId:'g_lst' }
{ id: 'mux_lst2', type: 'mux', position: {x:200, y:228},
  data: {label:'Pca9545'}, parentId:'g_lst' }
{ id: 'chip_lst2_lm1', type: 'chip', position: {x:105, y:268},
  data: {chipType:'Lm75'}, parentId:'g_lst' }
{ id: 'chip_lst2_lm2', type: 'chip', position: {x:160, y:268},
  data: {chipType:'Lm75'}, parentId:'g_lst' }
{ id: 'chip_lst2_lm3', type: 'chip', position: {x:215, y:268},
  data: {chipType:'Lm75'}, parentId:'g_lst' }
{ id: 'chip_lst2_lm4', type: 'chip', position: {x:270, y:268},
  data: {chipType:'Lm75'}, parentId:'g_lst' }

// SMBus → Cpld
{ id: 'bus_smbus', type: 'smbus', position: {x:30, y:390},
  data: {label:'smbus_0'}, parentId:'g_lst' }
{ id: 'chip_cpld', type: 'chip', position: {x:180, y:435},
  data: {chipType:'Cpld'}, parentId:'g_lst' }

// ComponentFuncGroup（青色总线）
{ id: 'bus_cfg', type: 'smbus', position: {x:30, y:450},
  data: {label:'ComponentFuncGroup_0'}, parentId:'g_lst',
  style: {background:'#06b6d4', width:130} }

// 第三组：bus → pca9545 → 4芯片
{ id: 'bus_lst3', type: 'bus', position: {x:30, y:510},
  data: {label:'i2cbus_6'}, parentId:'g_lst' }
{ id: 'mux_lst3', type: 'mux', position: {x:200, y:508},
  data: {label:'Pca9545'}, parentId:'g_lst' }
{ id: 'chip_lst3_eeprom', type: 'chip', position: {x:90, y:548},
  data: {chipType:'Eeprom'}, parentId:'g_lst' }
{ id: 'chip_lst3_cpu', type: 'chip', position: {x:150, y:548},
  data: {chipType:'CPU'}, parentId:'g_lst' }
{ id: 'chip_lst3_lm75', type: 'chip', position: {x:210, y:548},
  data: {chipType:'Lm75'}, parentId:'g_lst' }
{ id: 'chip_lst3_eeprom2', type: 'chip', position: {x:270, y:548},
  data: {chipType:'Eeprom'}, parentId:'g_lst' }

// 虚线总线（预留）
{ id: 'bus_lst_dash1', type: 'bus', position: {x:30, y:580},
  data: {label:'i2cbus_7', dashed:true}, parentId:'g_lst' }
{ id: 'bus_lst_dash2', type: 'bus', position: {x:30, y:608},
  data: {label:'i2cbus_8', dashed:true}, parentId:'g_lst' }

// ── 板卡5：Base_Board（右侧大区域）──
{ id: 'g_base', type: 'group', position: {x:690, y:60},
  data: {label:'Base_Board'}, style: {width:300, height:500} }

// 顶部独立 Eeprom
{ id: 'bus_base1', type: 'bus', position: {x:30, y:60},
  data: {label:'i2cbus_9'}, parentId:'g_base' }
{ id: 'chip_base_eeprom0', type: 'chip', position: {x:130, y:55},
  data: {chipType:'Eeprom'}, parentId:'g_base' }

// MCU_NP_T25_0 子容器
{ id: 'g_mcu', type: 'group', position: {x:150, y:95},
  data: {label:'MCU_NP_T25_0'}, style: {width:140, height:200},
  parentId:'g_base', style:{background:'#1a2a3a', border:'1px dashed #3a5a7a'} }
{ id: 'chip_mcu_cpu1', type: 'chip', position: {x:10, y:40},
  data: {chipType:'CPU'}, parentId:'g_mcu' }
{ id: 'chip_mcu_cpu2', type: 'chip', position: {x:70, y:40},
  data: {chipType:'CPU'}, parentId:'g_mcu' }
{ id: 'chip_mcu_eeprom1', type: 'chip', position: {x:10, y:115},
  data: {chipType:'Eeprom'}, parentId:'g_mcu' }
{ id: 'chip_mcu_eeprom2', type: 'chip', position: {x:70, y:115},
  data: {chipType:'Eeprom'}, parentId:'g_mcu' }

// pca9545 下挂多芯片
{ id: 'mux_base', type: 'mux', position: {x:100, y:145},
  data: {label:'Pca9545'}, parentId:'g_base' }
{ id: 'chip_base_cpu1', type: 'chip', position: {x:30, y:185},
  data: {chipType:'CPU'}, parentId:'g_base' }
{ id: 'chip_base_cpu2', type: 'chip', position: {x:85, y:185},
  data: {chipType:'CPU'}, parentId:'g_base' }
{ id: 'chip_base_cpu3', type: 'chip', position: {x:140, y:185},
  data: {chipType:'CPU'}, parentId:'g_base' }
{ id: 'chip_base_cpu4', type: 'chip', position: {x:195, y:185},
  data: {chipType:'CPU'}, parentId:'g_base' }
{ id: 'chip_base_eeprom1', type: 'chip', position: {x:57, y:255},
  data: {chipType:'Eeprom'}, parentId:'g_base' }
{ id: 'chip_base_eeprom2', type: 'chip', position: {x:170, y:255},
  data: {chipType:'Eeprom'}, parentId:'g_base' }

// 底部两排总线
{ id: 'bus_base2', type: 'bus', position: {x:30, y:345},
  data: {label:'i2cbus_10'}, parentId:'g_base' }
{ id: 'chip_base_smc1', type: 'chip', position: {x:155, y:340},
  data: {chipType:'Smc'}, parentId:'g_base' }
{ id: 'chip_base_smc2', type: 'chip', position: {x:210, y:340},
  data: {chipType:'Smc'}, parentId:'g_base' }

{ id: 'bus_base3', type: 'bus', position: {x:30, y:415},
  data: {label:'i2cbus_11'}, parentId:'g_base' }

// ── 板卡6：Base_Fan（右上，独立）──
{ id: 'g_fan', type: 'group', position: {x:1060, y:100},
  data: {label:'Base_Fan'}, style: {width:160, height:130} }
{ id: 'bus_fan', type: 'bus', position: {x:20, y:45},
  data: {label:'i2cbus_f'}, parentId:'g_fan' }
{ id: 'chip_fan_cpu1', type: 'chip', position: {x:40, y:80},
  data: {chipType:'CPU'}, parentId:'g_fan' }
{ id: 'chip_fan_eeprom', type: 'chip', position: {x:100, y:80},
  data: {chipType:'Eeprom'}, parentId:'g_fan' }

// ── 板卡7：Base_NF（右上，独立）──
{ id: 'g_nf', type: 'group', position: {x:1150, y:100},
  data: {label:'Base_NF'}, style: {width:160, height:130} }
{ id: 'bus_nf', type: 'bus', position: {x:20, y:45},
  data: {label:'i2cbus_nf'}, parentId:'g_nf' }
{ id: 'chip_nf_cpu1', type: 'chip', position: {x:20, y:80},
  data: {chipType:'CPU'}, parentId:'g_nf' }
{ id: 'chip_nf_cpu2', type: 'chip', position: {x:75, y:80},
  data: {chipType:'CPU'}, parentId:'g_nf' }
{ id: 'chip_nf_cpu3', type: 'chip', position: {x:130, y:80},
  data: {chipType:'CPU'}, parentId:'g_nf' }

// ── 板卡8：Riser（左下，独立）──
{ id: 'g_riser', type: 'group', position: {x:80, y:620},
  data: {label:'Riser'}, style: {width:220, height:120} }
{ id: 'bus_riser', type: 'bus', position: {x:20, y:45},
  data: {label:'i2cbus_r'}, parentId:'g_riser' }
{ id: 'chip_riser_cpu', type: 'chip', position: {x:80, y:78},
  data: {chipType:'CPU'}, parentId:'g_riser' }
{ id: 'chip_riser_eeprom', type: 'chip', position: {x:140, y:78},
  data: {chipType:'Eeprom'}, parentId:'g_riser' }

// ── 板卡9：FGB（底部中间）──
{ id: 'g_fgb', type: 'group', position: {x:380, y:620},
  data: {label:'FGB'}, style: {width:220, height:130} }
{ id: 'bus_fgb', type: 'bus', position: {x:20, y:45},
  data: {label:'i2cbus_fgb'}, parentId:'g_fgb' }
{ id: 'chip_fgb_big1', type: 'bigchip', position: {x:80, y:72},
  data: {chipType:'CPU'}, parentId:'g_fgb' }
{ id: 'chip_fgb_big2', type: 'bigchip', position: {x:155, y:72},
  data: {chipType:'CPU'}, parentId:'g_fgb' }
```

---

## 五、完整边数据（initialEdges）

```typescript
// I_0 板卡内部连线（粉色）
{ id: 'e_i0_1', source:'bus_i0', target:'chip_i0_eeprom1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_i0_2', source:'bus_i0', target:'chip_i0_eeprom2', style:{stroke:'#e879a0',strokeWidth:1.5} }

// SMC 板卡
{ id: 'e_smc_1', source:'bus_smc', target:'chip_smc_1', style:{stroke:'#e879a0',strokeWidth:1.5} }

// I_2 板卡
{ id: 'e_i2_1', source:'bus_i2', target:'chip_i2_eeprom1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_i2_2', source:'bus_i2', target:'chip_i2_eeprom2', style:{stroke:'#e879a0',strokeWidth:1.5} }

// LST_Board 第一组
{ id: 'e_lst1_mux', source:'bus_lst1', target:'mux_lst1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_lst1_c1', source:'mux_lst1', target:'chip_lst1_eeprom', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst1_c2', source:'mux_lst1', target:'chip_lst1_cpu', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst1_c3', source:'mux_lst1', target:'chip_lst1_lm75', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst1_c4', source:'mux_lst1', target:'chip_lst1_eeprom2', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst1_c5', source:'mux_lst1', target:'chip_lst1_lm75b', style:{stroke:'#a855f7',strokeWidth:1.5} }

// LST_Board 第二组
{ id: 'e_lst2_mux', source:'bus_lst2', target:'mux_lst2', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_lst2_c1', source:'mux_lst2', target:'chip_lst2_lm1', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst2_c2', source:'mux_lst2', target:'chip_lst2_lm2', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst2_c3', source:'mux_lst2', target:'chip_lst2_lm3', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst2_c4', source:'mux_lst2', target:'chip_lst2_lm4', style:{stroke:'#a855f7',strokeWidth:1.5} }

// SMBus → Cpld
{ id: 'e_smb_cpld', source:'bus_smbus', target:'chip_cpld', style:{stroke:'#4ade80',strokeWidth:1.5} }

// LST_Board 第三组
{ id: 'e_lst3_mux', source:'bus_lst3', target:'mux_lst3', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_lst3_c1', source:'mux_lst3', target:'chip_lst3_eeprom', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst3_c2', source:'mux_lst3', target:'chip_lst3_cpu', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst3_c3', source:'mux_lst3', target:'chip_lst3_lm75', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_lst3_c4', source:'mux_lst3', target:'chip_lst3_eeprom2', style:{stroke:'#a855f7',strokeWidth:1.5} }

// 虚线连线
{ id: 'e_dash1', source:'bus_lst_dash1', target:'bus_base3',
  style:{stroke:'#ffffff',strokeWidth:1,strokeDasharray:'4 4'} }

// 跨板卡蓝色连线（带编号标签）
{ id: 'e_cross1', source:'bus_lst1', target:'bus_base1',
  style:{stroke:'#60a5fa',strokeWidth:1.5}, label:'11',
  labelStyle:{fill:'#fff',fontSize:10},
  labelBgStyle:{fill:'#1e1e2e',rx:4} }
{ id: 'e_cross2', source:'bus_lst2', target:'bus_base2',
  style:{stroke:'#60a5fa',strokeWidth:1.5}, label:'12' }
{ id: 'e_cross3', source:'bus_smbus', target:'bus_base3',
  style:{stroke:'#60a5fa',strokeWidth:1.5}, label:'13' }

// Base_Board 内部
{ id: 'e_base_eeprom', source:'bus_base1', target:'chip_base_eeprom0', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_base_mux', source:'bus_base1', target:'mux_base', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_base_c1', source:'mux_base', target:'chip_base_cpu1', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_base_c2', source:'mux_base', target:'chip_base_cpu2', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_base_c3', source:'mux_base', target:'chip_base_cpu3', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_base_c4', source:'mux_base', target:'chip_base_cpu4', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_base_ep1', source:'mux_base', target:'chip_base_eeprom1', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_base_ep2', source:'mux_base', target:'chip_base_eeprom2', style:{stroke:'#a855f7',strokeWidth:1.5} }
{ id: 'e_base_smc1', source:'bus_base2', target:'chip_base_smc1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_base_smc2', source:'bus_base2', target:'chip_base_smc2', style:{stroke:'#e879a0',strokeWidth:1.5} }

// Riser
{ id: 'e_riser1', source:'bus_riser', target:'chip_riser_cpu', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_riser2', source:'bus_riser', target:'chip_riser_eeprom', style:{stroke:'#e879a0',strokeWidth:1.5} }

// FGB
{ id: 'e_fgb1', source:'bus_fgb', target:'chip_fgb_big1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_fgb2', source:'bus_fgb', target:'chip_fgb_big2', style:{stroke:'#e879a0',strokeWidth:1.5} }

// Base_Fan
{ id: 'e_fan1', source:'bus_fan', target:'chip_fan_cpu1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_fan2', source:'bus_fan', target:'chip_fan_eeprom', style:{stroke:'#e879a0',strokeWidth:1.5} }

// Base_NF
{ id: 'e_nf1', source:'bus_nf', target:'chip_nf_cpu1', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_nf2', source:'bus_nf', target:'chip_nf_cpu2', style:{stroke:'#e879a0',strokeWidth:1.5} }
{ id: 'e_nf3', source:'bus_nf', target:'chip_nf_cpu3', style:{stroke:'#e879a0',strokeWidth:1.5} }
```

---

## 六、交互功能

```
1. 点击节点 → 右侧滑出属性面板（宽240px）
   显示：节点类型、名称、地址、所属板卡
   可编辑字段并保存

2. 右键节点菜单：
   - 编辑属性
   - 删除节点
   - 复制节点
   - 查看关联CSR JSON

3. "查看代码" 按钮：
   弹出 Modal，展示当前拓扑的 CSR JSON
   使用 react-syntax-highlighter 语法高亮
   主题：vsDark

4. 画布支持：
   - 滚轮缩放（10%~200%）
   - 拖拽平移
   - 框选多节点
   - MiniMap（右下角，可关闭）

5. 节点 hover 效果：
   - 边框变亮（brightness 1.3）
   - 轻微 glow（box-shadow）

6. 底部工具栏按钮功能：
   - 撤销/重做（useUndoRedo）
   - 对齐工具（选中多节点后横向/纵向对齐）
```

---

## 七、文件结构

```
src/
  components/
    TopBar/
      TopBar.tsx
      TopBar.module.css
    BottomBar/
      BottomBar.tsx
      BottomBar.module.css
    nodes/
      BusNode.tsx
      MuxNode.tsx
      ChipNode.tsx
      BigChipNode.tsx
      SMBusNode.tsx
      GroupNode.tsx
    panels/
      PropertyPanel.tsx
      CodeViewModal.tsx
    Canvas/
      Canvas.tsx
      Canvas.module.css
  data/
    taishan2280.ts    ← 上面的 initialNodes + initialEdges
  types/
    nodes.ts
  App.tsx
  App.module.css
```

---

## 八、注意事项

1. React Flow 的 Group Node 必须在 initialNodes 里把子节点的
   parentId 设置正确，且子节点 position 是相对父容器的坐标

2. 跨容器的连线（如 LST_Board → Base_Board 的蓝色长线）
   需要用绝对坐标的锚点节点中转，或直接用顶层节点 id 连接

3. ChipNode 里的 IC 图标用 SVG 内联绘制，不要用 emoji

4. 连线编号标签（11,12,13...）用 React Flow 的 edge label 实现

5. 所有颜色严格按照设计图，不要自行调整
