// Color palette — ported from web-app/src/components/TaishanStaticVectorTopologyView.tsx
export const C = {
  pink:   '#e879a0',
  purple: '#a855f7',   // I2C bus
  green:  '#4ade80',   // SMBus
  orange: '#f97316',   // Power bus
  blue:   '#60a5fa',
  cyan:   '#06b6d4',
  chipColor: {
    Eeprom: '#6b7280',
    CPU:    '#22c55e',
    Lm75:   '#8b5cf6',
    Smc:    '#f59e0b',
    Cpld:   '#06b6d4',
  } as Record<string, string>,
};
