export type HotspotStatus = 'normal' | 'warning' | 'error';

export type HotspotMetric = { label: string; value: string };

export interface Hotspot {
  id: number;
  name: string;
  x: string; // percent string
  y: string; // percent string
  w: string; // percent string
  h: string; // percent string
}

export const HOTSPOTS: Hotspot[] = [
  { id: 1, name: 'PSU电源', x: '1%', y: '66%', w: '13%', h: '16%' },
  { id: 2, name: 'NIC网卡', x: '15%', y: '69%', w: '7%', h: '9%' },
  { id: 3, name: 'PCIe扩展卡', x: '21%', y: '72%', w: '16%', h: '7%' },
  { id: 4, name: 'GPU卡', x: '21%', y: '78%', w: '12%', h: '6%' },
  { id: 5, name: '顶盖', x: '21%', y: '41%', w: '55%', h: '7%' },
  { id: 6, name: '机箱底板', x: '21%', y: '47%', w: '54%', h: '28%' },
  { id: 7, name: '风扇模块', x: '42%', y: '80%', w: '14%', h: '12%' },
  { id: 8, name: '硬盘笼', x: '37%', y: '69%', w: '9%', h: '6%' },
  { id: 9, name: 'SSD背板', x: '62%', y: '68%', w: '11%', h: '6%' },
  { id: 10, name: 'OCP子卡', x: '74%', y: '66%', w: '10%', h: '8%' },
  { id: 11, name: 'VGA', x: '85%', y: '63%', w: '7%', h: '6%' },
  { id: 12, name: 'PCIe背板', x: '62%', y: '44%', w: '7%', h: '17%' },
  { id: 13, name: '散热器', x: '68%', y: '41%', w: '6%', h: '20%' },
  { id: 14, name: '系统风扇', x: '74%', y: '31%', w: '10%', h: '16%' },
  { id: 15, name: '硬盘仓', x: '84%', y: '36%', w: '11%', h: '31%' },
  { id: 16, name: 'CPU', x: '37%', y: '9%', w: '10%', h: '14%' },
  { id: 17, name: '主板', x: '19%', y: '14%', w: '21%', h: '26%' },
  { id: 18, name: '内存DIMM', x: '4%', y: '14%', w: '14%', h: '10%' },
  { id: 19, name: 'IO前面板', x: '0%', y: '15%', w: '3%', h: '20%' },
  { id: 20, name: 'BMC控制器', x: '4%', y: '24%', w: '12%', h: '9%' },
  { id: 21, name: '背板总线', x: '19%', y: '37%', w: '21%', h: '5%' },
];

