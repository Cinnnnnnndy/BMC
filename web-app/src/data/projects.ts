/**
 * 硬件整机项目列表
 * 四元组：机型图片、厂商、机型、版本
 */
export interface HardwareProject {
  id: string;
  /** 机型图片 URL 或 Base64 */
  image: string;
  /** 厂商 */
  manufacturer: string;
  /** 机型/型号 */
  model: string;
  /** 版本 */
  version: string;
  /** 项目进度（0-100） */
  progressPercent?: number;
  /** 进度描述 */
  progressText?: string;
  /** 机型重点信息（卡片展示） */
  highlights?: string[];
  /** 根 CSR 相对路径，用于加载默认配置 */
  rootSrPath?: string;
}

const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120">
  <rect fill="#2d2d2d" width="160" height="120" rx="4"/>
  <rect fill="#3c3c3c" x="20" y="30" width="120" height="60" rx="2"/>
  <rect fill="#4a9eff" x="30" y="45" width="20" height="8" rx="1"/>
  <rect fill="#4a9eff" x="55" y="45" width="20" height="8" rx="1"/>
  <rect fill="#4a9eff" x="80" y="45" width="20" height="8" rx="1"/>
  <rect fill="#4a9eff" x="105" y="45" width="20" height="8" rx="1"/>
  <text x="80" y="85" font-family="sans-serif" font-size="10" fill="#888" text-anchor="middle">Server</text>
</svg>
`);

export const HARDWARE_PROJECTS: HardwareProject[] = [
  {
    id: 'huawei-kunpeng-taishan-2180-v2',
    image: 'images/taishan-2180-v2.png',
    manufacturer: '华为',
    model: 'TaiShan 200 2180（均衡型）',
    version: 'K21R-02',
    progressPercent: 35,
    progressText: '拓扑可视化可用，事件/传感器表单完善中',
    highlights: [
      '2U 机架服务器',
      '鲲鹏 920，最高 64 核 / 2.6GHz（页面描述）',
      '最多 14 盘位（SAS/SATA HDD/SSD）',
      '16 个 DDR4-2933 DIMM 插槽',
    ],
    rootSrPath: 'samples/huawei-kunpeng/root.sr',
  },
  {
    id: 'huawei-tianchi',
    image: PLACEHOLDER_IMG,
    manufacturer: '华为',
    model: '天池 TianChi',
    version: 'V1',
    progressPercent: 15,
    progressText: '样例 CSR 联通，待补齐完整对象/事件集',
    highlights: ['样例 root.sr', '用于快速验证编辑器交互'],
    rootSrPath: 'samples/huawei-tianchi/root.sr',
  },
  {
    id: 'openubmc-ref',
    image: PLACEHOLDER_IMG,
    manufacturer: 'openUBMC',
    model: '社区参考机型',
    version: 'V1',
    progressPercent: 10,
    progressText: '基础链路与对象展示',
    highlights: ['社区样例 root.sr', '适合作为模板起步'],
    rootSrPath: 'samples/openubmc-ref/root.sr',
  },
];
