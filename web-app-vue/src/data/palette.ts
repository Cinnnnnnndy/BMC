// Color palette — matches the reference React topology view visual style.
export const C = {
  pink:   '#e879f9',   // I2C bus  (bright magenta, matches reference)
  green:  '#4ade80',   // SMBus
  amber:  '#fbbf24',   // JTAG (distinct from SMBus)
  cyan:   '#22d3ee',   // HiSport
  orange: '#f97316',   // Power bus
  blue:   '#818cf8',   // BMC internal / general

  // Chip type colours — pastel variants so they read well on the dark canvas
  // without clashing with bus line colours.
  chipColor: {
    Eeprom:  '#93c5fd',  // blue-300
    CPU:     '#86efac',  // green-300
    Lm75:    '#fcd34d',  // amber-300
    Smc:     '#fdba74',  // orange-300
    Cpld:    '#d8b4fe',  // purple-300
    VRD:     '#67e8f9',  // cyan-300
    bigchip: '#f9a8d4',  // pink-300
  } as Record<string, string>,
};

// Bus-type → connection-line colour. Single source of truth so every edge line
// is coloured by its bus type (used by ManhattanEdge and the canvas legend).
export const BUS_COLOR: Record<string, string> = {
  i2c:     C.pink,    // I2C
  smbus:   C.green,   // SMBus
  jtag:    C.amber,   // JTAG
  hisport: C.cyan,    // HiSport
  power:   C.orange,  // Power
  default: C.blue,    // internal / unknown
};

// Ordered legend entries (label + colour) for the canvas key.
export const BUS_LEGEND: Array<{ type: string; label: string; color: string }> = [
  { type: 'i2c',     label: 'I2C',     color: C.pink },
  { type: 'smbus',   label: 'SMBus',   color: C.green },
  { type: 'jtag',    label: 'JTAG',    color: C.amber },
  { type: 'hisport', label: 'HiSport', color: C.cyan },
  { type: 'trunk',   label: '内部总线', color: C.blue },
];
