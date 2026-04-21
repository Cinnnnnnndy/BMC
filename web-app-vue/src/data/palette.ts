// Color palette — matches the reference React topology view visual style.
export const C = {
  pink:   '#e879f9',   // I2C bus  (bright magenta, matches reference)
  green:  '#4ade80',   // JTAG / SMBus
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
