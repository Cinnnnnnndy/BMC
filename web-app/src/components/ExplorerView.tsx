import React, { useState } from 'react';

// ── File content ───────────────────────────────────────────────────────────

const FILES: Record<string, { lang: string; content: string }> = {
  readme: {
    lang: 'markdown',
    content: `# vpd 重要产品数据（vital product data）

硬件PSR、硬件CSR、机型相关的软件配置、北向接口映射、白牌定制等信息

## 1、整机硬件配置
【路径】./vendor/Huawei/Server/Kunpeng/BM320/PSR （以BM320为例）
【解读】与整机硬件强相关的配置，比如调速策略。天池机型来自挂耳eeprom，开发早期BMC
软件携带，待硬件独立发布后，BMC删除。

## 2、整机类配置（非PSR配置）
【路径】./vendor/Huawei/Server/Kunpeng/BM320/platform （以BM320为例）
【解读】与整机相关的、且又不适合由硬件PSR承载的配置，比如是否支持SNMP、过热掉电后是否自动上电。

## 3、特定产业专用组件配置信息
【路径】./vendor/Huawei/Server/Kunpeng/Nic/Lom
【解读】鲲鹏产业专用的组件配置信息

## 4、华为服务器通用组件配置信息
【路径】./vendor/Huawei/Nic/hi1822
【解读】华为公司服务器通用组件配置信息

## 5、天池组件配置信息
【路径】./vendor/Huawei/TianChi、./vendor/Huawei/TianChi/BCU/BC82AMDV-3732

## 6、白牌定制
【路径】./vendor/Customer/
【解读】白牌定制的配置信息，包括DPU等特殊硬件`,
  },
  changelog: {
    lang: 'markdown',
    content: `# Changelog

## [1.90.60] - 2026-3-19
修复读取fru标签失败告警未关联属性的问题

## [1.90.59] - 2026-3-19
修复背板BC83NHBC Component和DiscreteSensor对象配置写死导致背板在后置位置时
板中硬盘的标识与传感器编号不符合实际的问题

## [1.90.58] - 2026-3-17
修复DC1000在OS下电情况下仍显示温度信息

## [1.90.57] - 2026-3-17
修复0x08000001告警描述中缺少BN号

## [1.90.55] - 2026-3-15
新增UB接口卡温度获取失败事件

## [1.90.51] - 2026-3-11
修复拔插电源线产生电源误告警`,
  },
  conan: {
    lang: 'python',
    content: `# Copyright (c) 2024 Huawei Technologies Co., Ltd.
# openUBMC is licensed under Mulan PSL v2.

import json
import stat
import importlib
import sys

from conanbase import ConanBase, copy, os

required_conan_version = ">=1.60.0"

class AppConan(ConanBase):

    def build(self):
        pass

    def cp_kvm_padding_image(self):
        copy(
            self, "*.jpeg",
            src=os.path.join(self.source_folder, "vendor/Huawei/BMCSoC/hi1711/kvm_padding_image"),
            dst=os.path.join(self.package_folder, "opt/bmc/soc/kvm")
        )

    def get_board_path(self):
        server_dirs = os.listdir("./vendor/Huawei/Server")
        for server in server_dirs:
            board_dir_temp = os.path.join("./vendor/Huawei/Server", server, str(self.options.board_name))
            if os.path.isdir(board_dir_temp):
                return board_dir_temp
        return ""

    def cp_product_schema(self):
        board_dir = self.get_board_path()
        schema_path = os.path.join(self.source_folder, board_dir, "schema")
        if os.path.exists(schema_path):
            copy(self, "*.json", src=schema_path,
                dst=os.path.join(self.package_folder, "opt/bmc/profile_schema/product"))`,
  },
  registry: {
    lang: 'python',
    content: `# Copyright (c) 2024 Huawei Technologies Co., Ltd.
# openUBMC is licensed under Mulan PSL v2.

import os
import json
from collections import OrderedDict

class EvtInformation():
    def __init__(self):
        self.event_id = ''
        self.name = ''
        self.severity = ''
        self.resolution = ''
        self.event_code = ''
        self.event_type = 0
        self.effect = ''
        self.cause = ''

class Registry:
    def __init__(self, event_datas_dict, json_path):
        self.event_datas_dict = event_datas_dict
        self.json_path = json_path

    @staticmethod
    def get_severity_string(evt_type, severity_level):
        severity_str = ['OK', 'Warning', 'Critical']
        severity_index = int(severity_level)
        evt_type_index = int(evt_type)
        if (evt_type_index == 0 or evt_type_index == 3) and severity_index > 1:
            severity_index = severity_index - 1
        return severity_str[int(severity_index)]`,
  },
  smcdfx: {
    lang: 'markdown',
    content: `# SmcDfxInfo 类定义说明

\`\`\`json
"SmcDfxInfo": {
    "properties": {
        "Chip": { "usage": ["CSR"], "baseType": "String" },
        "Offset": { "usage": ["CSR"], "baseType": "U32" },
        "Size": { "usage": ["CSR"], "baseType": "U8" },
        "Period": { "usage": ["CSR"], "baseType": "U32" },
        "SmcVersion": { "usage": ["CSR"], "baseType": "U32" },
        "Config": { "baseType": "Dictionary", "usage": ["CSR"], "$ref": "types.json#/defs/DfxConfigDict" },
        "Mapping": { "baseType": "Dictionary", "usage": ["CSR"], "$ref": "types.json#/defs/MappingDict" }
    }
}
\`\`\``,
  },
  risercard: {
    lang: 'json',
    content: `{
  "FormatVersion": "3.00",
  "DataVersion": "3.06",
  "Unit": {
    "Type": "IEU",
    "Name": "RiserCard_1"
  },
  "ManagementTopology": {
    "Anchor": {
      "Buses": ["Hisport_0"]
    },
    "Hisport_0": {
      "Chips": ["Pca9545_PCA9545"]
    },
    "Pca9545_PCA9545": {
      "Buses": [
        "I2cMux_Pca9545_PCA9545_4",
        "I2cMux_Pca9545_PCA9545_1",
        "I2cMux_Pca9545_PCA9545_2"
      ]
    },
    "I2cMux_Pca9545_PCA9545_4": {
      "Chips": ["Pca9555_IO", "Chip_MCU1"]
    },
    "I2cMux_Pca9545_PCA9545_1": {
      "Connectors": ["Connector_PCIE_1"]
    },
    "I2cMux_Pca9545_PCA9545_2": {
      "Connectors": ["Connector_PCIE_2"]
    },
    "Chip_MCU1": {
      "Buses": ["I2cMux_McuSwitch"]
    },
    "I2cMux_McuSwitch": {
      "Chips": ["Eeprom_IEU"]
    }
  },
  "Objects": {
    "Pca9545_PCA9545": {
      "OffsetWidth": 0,
      "AddrWidth": 1,
      "Address": 226,
      "WriteTmout": 100,
      "ReadTmout": 100,
      "HealthStatus": 0
    },
    "Eeprom_IEU": {
      "OffsetWidth": 2,
      "AddrWidth": 1,
      "Address": 174,
      "WriteTmout": 100,
      "ReadTmout": 100,
      "RwBlockSize": 32,
      "WriteInterval": 20,
      "HealthStatus": 0
    }
  }
}`,
  },
  hypercard: {
    lang: 'json',
    content: `{
    "FormatVersion": "1.00",
    "DataVersion": "1.01",
    "ManagementTopology": {
        "Anchor": {
            "Buses": ["I2c_1"]
        },
        "I2c_1": {
            "Chips": ["Chip_CPLD", "Chip_BMC", "Chip_FRU"]
        }
    },
    "Objects": {
        "Chip_CPLD": {
            "OffsetWidth": 2,
            "AddrWidth": 1,
            "Address": 38,
            "WriteTmout": 100,
            "ReadTmout": 100,
            "RwBlockSize": 32,
            "WriteInterval": 20,
            "HealthStatus": 0
        },
        "Chip_BMC": {
            "OffsetWidth": 2,
            "AddrWidth": 1,
            "Address": 32,
            "WriteTmout": 100,
            "ReadTmout": 100,
            "RwBlockSize": 32,
            "WriteInterval": 20,
            "HealthStatus": 0
        },
        "Chip_FRU": {
            "OffsetWidth": 2,
            "AddrWidth": 1,
            "Address": 160,
            "WriteTmout": 100,
            "ReadTmout": 100,
            "RwBlockSize": 32,
            "WriteInterval": 20,
            "HealthStatus": 0
        },
        "Accessor_PcbID": {
            "Chip": "#/Chip_CPLD",
            "Offset": 5,
            "Size": 1,
            "Mask": 15,
            "Type": 0,
            "Value": 0
        },
        "Scanner_BoardId": {
            "Chip": "#/Chip_CPLD",
            "Offset": 4,
            "Size": 1
        }
    }
}`,
  },
};

// ── Inline feature data ────────────────────────────────────────────────────

interface DiagEntry {
  line: number; // 1-indexed
  severity: 'error' | 'warn' | 'info';
  msg: string;
  token: string; // text to wavy-underline (exact string that appears in the raw line)
}

// Diagnostics keyed by fileId → list of per-line entries
const DIAGNOSTICS: Record<string, DiagEntry[]> = {
  risercard: [
    {
      line: 26,
      severity: 'warn',
      token: 'Connector_PCIE_1',
      msg: 'I2cMux_Pca9545_PCA9545_1 总线下仅包含 1 个 Connector，PCIe Riser 通常挂载 2 个以上插槽，建议确认是否遗漏',
    },
    {
      line: 45,
      severity: 'info',
      token: 'HealthStatus',
      msg: 'HealthStatus 将通过北向接口暴露为 Redfish /Status/Health，建议枚举值与规范保持一致（0=OK, 1=Warning, 2=Critical）',
    },
  ],
  hypercard: [
    {
      line: 9,
      severity: 'warn',
      token: 'Chip_CPLD',
      msg: 'I2c_1 总线同时挂载 3 个芯片（Chip_CPLD, Chip_BMC, Chip_FRU），建议评估总线带宽与时序裕量',
    },
    {
      line: 16,
      severity: 'error',
      token: 'Address',
      msg: 'Chip_CPLD 地址 0x26 (38) 与 Chip_BMC 0x20 (32) 同在 I2c_1 总线，请确认 7-bit 地址无冲突',
    },
  ],
};

interface NbEntry {
  redfish: string;
  snmp: string;
  ipmi: string;
}

// Property names that map to northbound protocol fields
const NORTHBOUND_MAP: Record<string, NbEntry> = {
  HealthStatus: {
    redfish: '/redfish/v1/Chassis/{id}#/Status/Health',
    snmp: '1.3.6.1.4.1.2011.2.235.1.1.4.1',
    ipmi: 'SEL Event Data Byte1',
  },
  Address: {
    redfish: '/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Id',
    snmp: '1.3.6.1.4.1.2011.2.235.1.1.3.1',
    ipmi: 'SDR Sensor Number',
  },
  WriteTmout: {
    redfish: '/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/WriteTimeout',
    snmp: '1.3.6.1.4.1.2011.2.235.1.1.5.1',
    ipmi: 'N/A',
  },
  ReadTmout: {
    redfish: '/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/ReadTimeout',
    snmp: '1.3.6.1.4.1.2011.2.235.1.1.5.2',
    ipmi: 'N/A',
  },
  Type: {
    redfish: '/redfish/v1/Chassis/{id}#/ChassisType',
    snmp: '1.3.6.1.4.1.2011.2.235.1.1.1.1',
    ipmi: 'FRU 0x01 Product Name',
  },
  OffsetWidth: {
    redfish: '/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/RegisterOffsetWidth',
    snmp: '1.3.6.1.4.1.2011.2.235.1.1.6.1',
    ipmi: 'N/A',
  },
};

// ── Tooltip ────────────────────────────────────────────────────────────────

type TooltipState =
  | { kind: 'diag'; x: number; y: number; entry: DiagEntry }
  | { kind: 'nb'; x: number; y: number; key: string; nb: NbEntry };

function Tooltip({ tip }: { tip: TooltipState }) {
  const left = Math.min(tip.x + 14, window.innerWidth - 330);
  const top = tip.y + 18;

  // Shared popover surface: neutral fill + elevation shadow, no stroke border
  // (design system = neutral gray ramp, layer with fills, not 1px lines).
  const popoverStyle: React.CSSProperties = {
    position: 'fixed', left, top, zIndex: 9999, pointerEvents: 'none',
    background: 'var(--surface-2)', borderRadius: 12,
    boxShadow: 'var(--shadow-lg)',
  };

  if (tip.kind === 'diag') {
    const { entry } = tip;
    const sevColor =
      entry.severity === 'error' ? '#f87171'
      : entry.severity === 'warn' ? '#fbbf24'
      : '#94a3b8';
    const sevLabel =
      entry.severity === 'error' ? 'ERROR'
      : entry.severity === 'warn' ? 'WARN'
      : 'INFO';
    return (
      <div style={{ ...popoverStyle, maxWidth: 320, padding: '9px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999,
            background: sevColor + '26', color: sevColor,
          }}>{sevLabel}</span>
          <span style={{ fontSize: 10.5, color: 'var(--foreground-muted)' }}>sr-language-server · 0.9.4</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--foreground)', lineHeight: 1.55 }}>{entry.msg}</div>
      </div>
    );
  }

  const { key, nb } = tip;
  return (
    <div style={{ ...popoverStyle, width: 310, padding: '9px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--foreground-muted)', marginBottom: 8 }}>
        <span>北向接口映射</span>
        <span style={{
          fontFamily: 'ui-monospace, monospace', fontSize: 10, color: '#9cdcfe',
          background: 'var(--state-hover)', padding: '1px 6px', borderRadius: 999,
        }}>{key}</span>
      </div>
      {([
        ['Redfish', nb.redfish, '#60a5fa'],
        ['SNMP', nb.snmp, '#a78bfa'],
        ['IPMI', nb.ipmi, '#34d399'],
      ] as const).map(([label, value, color]) => (
        <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
          <span style={{
            fontSize: 9.5, fontWeight: 700, color, background: color + '24',
            padding: '2px 6px', borderRadius: 999, width: 54, flexShrink: 0,
            textAlign: 'center', boxSizing: 'border-box',
          }}>{label}</span>
          <span style={{ fontSize: 10.5, color: 'var(--foreground-secondary)', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all', lineHeight: 1.5, paddingTop: 1 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ── JSON line renderer (interactive) ──────────────────────────────────────

function renderJsonLine(
  text: string,
  diag: DiagEntry | undefined,
  lspActive: boolean,
  nbActive: boolean,
  onNbEnter: (key: string, nb: NbEntry, e: React.MouseEvent) => void,
  onNbLeave: () => void,
): React.ReactNode {
  // Match:  "KeyName": rest
  const kvMatch = text.match(/^(\s*)("([\w]+)")(\s*:)(.*)/);
  if (kvMatch) {
    const [, leading, quotedKey, keyName, colon, rest] = kvMatch;
    const nbEntry = nbActive ? NORTHBOUND_MAP[keyName] : undefined;
    const isDiagToken = lspActive && diag?.token === keyName;
    const wavyColor = diag?.severity === 'error' ? '#f87171' : '#fbbf24';

    // Value coloring
    const v = rest.trim().replace(/,$/, '');
    const valueColor =
      (v === '{' || v === '[' || v === ']' || v === '}' || v === ',' || v === '')
        ? 'rgba(255,255,255,0.4)'
      : /^-?\d/.test(v) ? '#b5cea8'
      : /^(true|false|null)$/.test(v) ? '#569cd6'
      : '#ce9178';

    return (
      <>
        {leading}
        <span
          style={{
            color: '#9cdcfe',
            textDecoration: isDiagToken
              ? `underline wavy ${wavyColor}`
              : nbEntry ? 'underline dotted rgba(148,163,184,0.38)' : 'none',
            textUnderlineOffset: '3px',
            cursor: nbEntry ? 'help' : undefined,
          }}
          onMouseEnter={nbEntry ? (e) => onNbEnter(keyName, nbEntry, e) : undefined}
          onMouseLeave={nbEntry ? onNbLeave : undefined}
        >{quotedKey}</span>
        <span style={{ color: 'rgba(255,255,255,0.35)' }}>{colon}</span>
        <span style={{ color: valueColor }}>{rest}</span>
      </>
    );
  }

  // Non-key lines: check if diagnostic token appears as a value
  if (lspActive && diag?.token) {
    const needle = `"${diag.token}"`;
    const idx = text.indexOf(needle);
    if (idx >= 0) {
      const before = text.slice(0, idx);
      const token = text.slice(idx, idx + needle.length);
      const after = text.slice(idx + needle.length);
      const wavyColor = diag.severity === 'error' ? '#f87171' : '#fbbf24';
      return (
        <>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{before}</span>
          <span style={{ color: '#ce9178', textDecoration: `underline wavy ${wavyColor}`, textUnderlineOffset: '3px' }}>{token}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{after}</span>
        </>
      );
    }
  }

  // Plain JSON coloring
  return (
    <span dangerouslySetInnerHTML={{
      __html: text
        .replace(/("[\w\s\-/#$.]+")(\s*:)/g, '<span style="color:#9cdcfe">$1</span>$2')
        .replace(/:\s*("([^"]*)")/g, (_m: string, p1: string) => ': <span style="color:#ce9178">' + p1 + '</span>')
        .replace(/:\s*(-?\d+)/g, ': <span style="color:#b5cea8">$1</span>')
        .replace(/:\s*(true|false|null)/g, ': <span style="color:#569cd6">$1</span>'),
    }} />
  );
}

// ── Syntax highlighting (non-JSON) ─────────────────────────────────────────

function highlightLine(line: string, lang: string): React.ReactNode {
  if (lang === 'python') {
    return <span dangerouslySetInnerHTML={{ __html: line
      .replace(/(#.*$)/, '<span style="color:#6a9955">$1</span>')
      .replace(/\b(import|from|class|def|self|return|if|else|elif|for|in|and|or|not|pass|None|True|False|staticmethod)\b/g,
        '<span style="color:#569cd6">$1</span>')
      .replace(/("[^"]*")/g, '<span style="color:#ce9178">$1</span>')
      .replace(/('[^']*')/g, '<span style="color:#ce9178">$1</span>')
    }} />;
  }
  if (lang === 'markdown') {
    if (line.startsWith('#')) return <span style={{ color: '#569cd6', fontWeight: 600 }}>{line}</span>;
    if (line.startsWith('```')) return <span style={{ color: '#808080' }}>{line}</span>;
    if (line.startsWith('【') || line.startsWith('##')) return <span style={{ color: '#4ec9b0' }}>{line}</span>;
  }
  return line;
}

// ── Tree ───────────────────────────────────────────────────────────────────

type FileNode = { name: string; type: 'file' | 'dir'; fileId?: string; lang?: string; children?: FileNode[] };

const TREE: FileNode[] = [
  { name: 'vpd-main', type: 'dir', children: [
    { name: 'README.md', type: 'file', fileId: 'readme', lang: 'md' },
    { name: 'CHANGELOG.md', type: 'file', fileId: 'changelog', lang: 'md' },
    { name: 'conanfile.py', type: 'file', fileId: 'conan', lang: 'py' },
    { name: 'registry.py', type: 'file', fileId: 'registry', lang: 'py' },
    { name: 'SmcDfxInfo配置说明.md', type: 'file', fileId: 'smcdfx', lang: 'md' },
    { name: 'vendor', type: 'dir', children: [
      { name: 'openUBMC', type: 'dir', children: [
        { name: '14100513_...023947.sr', type: 'file', fileId: 'risercard', lang: 'sr' },
      ]},
      { name: 'Customer', type: 'dir', children: [
        { name: 'DPU', type: 'dir', children: [
          { name: '14140130_HyperCard_0.sr', type: 'file', fileId: 'hypercard', lang: 'sr' },
        ]},
      ]},
      { name: 'Huawei', type: 'dir', children: [
        { name: 'Server', type: 'dir', children: [
          { name: 'Kunpeng', type: 'dir', children: [
            { name: 'BM320', type: 'dir', children: [] },
          ]},
        ]},
        { name: 'BMCSoC', type: 'dir', children: [] },
        { name: 'Nic', type: 'dir', children: [] },
        { name: 'TianChi', type: 'dir', children: [] },
      ]},
    ]},
  ]},
];

function IconDir({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      {open
        ? <path d="M1.5 3.5h13l-1.5 9h-10L1.5 3.5zM1.5 3.5L4 1.5h5l1 2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        : <path d="M1.5 2.5h4l1.5 2H14.5v9h-13v-11z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      }
    </svg>
  );
}

function IconFile({ lang }: { lang?: string }) {
  const color = lang === 'py' ? '#4ec9b0' : lang === 'md' ? '#89d7e9' : lang === 'sr' ? '#ce9178' : '#cccccc';
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M2 1.5h8l3.5 3.5V14.5H2V1.5z" stroke={color} strokeWidth="1" strokeLinejoin="round" />
      <path d="M10 1.5V5H13.5" stroke={color} strokeWidth="1" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
      style={{ flexShrink: 0, transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.12s', opacity: 0.5 }}>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TreeItem({ node, depth, selectedId, onSelect }: {
  node: FileNode; depth: number; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isSelected = node.type === 'file' && node.fileId === selectedId;
  return (
    <div>
      <div
        onClick={() => node.type === 'dir' ? setOpen(o => !o) : node.fileId && onSelect(node.fileId)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: `2px 8px 2px ${8 + depth * 14}px`,
          cursor: 'pointer', fontSize: 12.5,
          color: isSelected ? 'var(--foreground, #e8e8e8)' : 'var(--foreground-secondary, #9aa0b8)',
          background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
          borderLeft: '2px solid transparent',
          userSelect: 'none', lineHeight: '1.6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        {node.type === 'dir' && <Chevron open={open} />}
        {node.type === 'dir' ? <IconDir open={open} /> : <IconFile lang={node.lang} />}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
      </div>
      {node.type === 'dir' && open && node.children?.map((child, i) => (
        <TreeItem key={i} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}

// ── Code pane with inline features ────────────────────────────────────────

function CodePane({
  fileId, lspActive, nbActive,
}: {
  fileId: string | null;
  lspActive: boolean;
  nbActive: boolean;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  if (!fileId) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--foreground-muted, #5a6280)', fontSize: 13, flexDirection: 'column', gap: 10 }}>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2" />
        </svg>
        选择文件以查看内容
      </div>
    );
  }

  const file = FILES[fileId];
  if (!file) return null;

  const displayName =
    fileId === 'risercard'  ? '14100513_00000001040302023947.sr'
    : fileId === 'hypercard' ? '14140130_HyperCard_0.sr'
    : fileId === 'readme'    ? 'README.md'
    : fileId === 'changelog' ? 'CHANGELOG.md'
    : fileId === 'conan'     ? 'conanfile.py'
    : fileId === 'registry'  ? 'registry.py'
    : 'SmcDfxInfo配置说明.md';

  const lines = file.content.split('\n');
  const isJson = file.lang === 'json';
  const diagsByLine: Record<number, DiagEntry> = {};
  if (lspActive) {
    (DIAGNOSTICS[fileId] ?? []).forEach(d => { diagsByLine[d.line] = d; });
  }

  const handleNbEnter = (key: string, nb: NbEntry, e: React.MouseEvent) => {
    setTooltip({ kind: 'nb', x: e.clientX, y: e.clientY, key, nb });
  };
  const handleNbLeave = () => setTooltip(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'var(--background, #0a0b10)', position: 'relative' }}>
      {/* Tab bar */}
      <div style={{
        padding: '6px 14px', fontSize: 11.5, color: 'var(--foreground-muted)',
        background: 'var(--surface-1, #0c0d14)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--foreground)', fontSize: 12 }}>
          {displayName}
        </span>
        {lspActive && (DIAGNOSTICS[fileId]?.length ?? 0) > 0 && (
          <span style={{ marginLeft: 4, fontSize: 10.5, color: '#fbbf24' }}>
            {DIAGNOSTICS[fileId].filter(d => d.severity === 'error').length > 0
              ? `✗ ${DIAGNOSTICS[fileId].filter(d => d.severity === 'error').length} error`
              : `⚠ ${DIAGNOSTICS[fileId].length} warning`}
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 10.5 }}>vpd-main · openUBMC Studio</span>
      </div>

      {/* Code body */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex',
        fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace',
        fontSize: 12.5, lineHeight: 1.7 }}>
        {/* Gutter */}
        <div style={{
          padding: '10px 0', flexShrink: 0, userSelect: 'none',
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--background)',
        }}>
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const diag = diagsByLine[lineNum];
            const sevColor = diag?.severity === 'error' ? '#f87171' : diag?.severity === 'warn' ? '#fbbf24' : '#94a3b8';
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', height: '1.7em', paddingRight: 4, paddingLeft: 8 }}>
                {diag && lspActive ? (
                  <span style={{ fontSize: 11, color: sevColor, width: 14, textAlign: 'center', flexShrink: 0 }}>
                    {diag.severity === 'error' ? '✗' : diag.severity === 'warn' ? '⚠' : 'ℹ'}
                  </span>
                ) : (
                  <span style={{ width: 14, flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 11, color: 'var(--foreground-muted)', textAlign: 'right', minWidth: 28, display: 'inline-block' }}>
                  {lineNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Code */}
        <pre style={{ margin: 0, padding: '10px 0', flex: 1, overflow: 'visible',
          color: 'var(--foreground, #d4d4d4)', whiteSpace: 'pre' }}>
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const diag = diagsByLine[lineNum];
            const diagBg = diag && lspActive
              ? diag.severity === 'error' ? 'rgba(248,113,113,0.06)'
              : diag.severity === 'warn' ? 'rgba(251,191,36,0.06)'
              : 'rgba(148,163,184,0.05)'
              : undefined;

            return (
              <div
                key={i}
                style={{ minHeight: '1.7em', paddingLeft: 18, paddingRight: 18, background: diagBg }}
                onMouseEnter={diag && lspActive ? (e) => setTooltip({ kind: 'diag', x: e.clientX, y: e.clientY, entry: diag }) : undefined}
                onMouseLeave={diag && lspActive ? () => setTooltip(t => t?.kind === 'diag' ? null : t) : undefined}
              >
                {isJson
                  ? renderJsonLine(line, diag, lspActive, nbActive, handleNbEnter, handleNbLeave)
                  : highlightLine(line, file.lang)
                }
              </div>
            );
          })}
        </pre>
      </div>

      {tooltip && <Tooltip tip={tooltip} />}
    </div>
  );
}

// ── SR file preview panel ──────────────────────────────────────────────────

function PanelSrPreview() {
  const nodes = [
    { id: 'Anchor',   x: 120, y: 10,  label: 'Anchor',       kind: 'anchor' },
    { id: 'H0',       x: 120, y: 72,  label: 'Hisport_0',    kind: 'bus' },
    { id: 'Pca',      x: 120, y: 134, label: 'Pca9545',      kind: 'chip' },
    { id: 'Mux4',     x: 20,  y: 200, label: 'Mux_4',        kind: 'bus' },
    { id: 'Mux1',     x: 120, y: 200, label: 'Mux_1',        kind: 'bus' },
    { id: 'Mux2',     x: 220, y: 200, label: 'Mux_2',        kind: 'bus' },
    { id: 'Io',       x: 0,   y: 266, label: 'Pca9555\nIO',  kind: 'chip' },
    { id: 'MCU',      x: 60,  y: 266, label: 'Chip\nMCU1',   kind: 'chip' },
    { id: 'P1',       x: 120, y: 266, label: 'Conn\nPCIE1',  kind: 'connector' },
    { id: 'P2',       x: 220, y: 266, label: 'Conn\nPCIE2',  kind: 'connector' },
    { id: 'Sw',       x: 60,  y: 332, label: 'McuSw',        kind: 'bus' },
    { id: 'Eeprom',   x: 60,  y: 398, label: 'Eeprom\nIEU',  kind: 'chip' },
  ];
  const edges = [['Anchor','H0'],['H0','Pca'],['Pca','Mux4'],['Pca','Mux1'],['Pca','Mux2'],
    ['Mux4','Io'],['Mux4','MCU'],['Mux1','P1'],['Mux2','P2'],['MCU','Sw'],['Sw','Eeprom']];
  const kindColor: Record<string, string> = { anchor:'#64748b', bus:'#4f6ef7', chip:'#22c55e', connector:'#f59e0b' };
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background)' }}>
      <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--foreground-muted)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, background: 'var(--surface-1)' }}>SR 文件预览 — 14100513_...023947.sr</div>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, display: 'flex', gap: 14 }}>
        {Object.entries(kindColor).map(([k, c]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--foreground-muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{k}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        <svg width="300" height="450" style={{ display: 'block' }}>
          {edges.map(([a, b], i) => {
            const na = byId[a], nb = byId[b];
            if (!na || !nb) return null;
            return <line key={i} x1={na.x+30} y1={na.y+28} x2={nb.x+30} y2={nb.y} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
          })}
          {nodes.map(n => (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={60} height={28} rx={4} fill={kindColor[n.kind]+'22'} stroke={kindColor[n.kind]} strokeWidth="1" />
              {n.label.split('\n').map((l, li) => (
                <text key={li} x={n.x+30} y={n.y+11+li*11} textAnchor="middle" fontSize="8.5" fill={kindColor[n.kind]}>{l}</text>
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── MIB browser panel ──────────────────────────────────────────────────────

function PanelMib() {
  const [query, setQuery] = useState('');
  const oids = [
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.1.1', name: 'bmcProductName',     type: 'String',  desc: '产品型号' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.1.2', name: 'bmcFirmwareVersion', type: 'String',  desc: '固件版本' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.2.1', name: 'bmcBoardCount',      type: 'Integer', desc: '在线板卡总数' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.3.1', name: 'bmcSensorValue',     type: 'Gauge32', desc: '传感器当前读数' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.4.1', name: 'bmcHealthStatus',    type: 'Integer', desc: '0=OK, 1=Warn, 2=Crit' },
    { oid: '1.3.6.1.4.1.2011.2.235.2.1.1',   name: 'bmcHardwareTrap',    type: 'Trap',    desc: '硬件故障告警' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.5.1', name: 'bmcWriteTimeout',    type: 'Integer', desc: '写超时时间 (ms)' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.5.2', name: 'bmcReadTimeout',     type: 'Integer', desc: '读超时时间 (ms)' },
  ];
  const q = query.toLowerCase();
  const filtered = q ? oids.filter(o => o.name.toLowerCase().includes(q) || o.oid.includes(q) || o.desc.includes(q)) : oids;
  const thStyle: React.CSSProperties = { padding: '5px 12px', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--foreground-muted)', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' };
  const tdStyle: React.CSSProperties = { padding: '5px 12px', fontSize: 11.5, color: 'var(--foreground-secondary)', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background)' }}>
      <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--foreground-muted)', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, background: 'var(--surface-1)' }}>HUAWEI-BMC-MIB v2</div>
      <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', borderRadius: 6, padding: '4px 8px', border: '1px solid var(--border-subtle)' }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--foreground-muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索 OID / 名称..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--foreground)', padding: 0 }} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={thStyle}>名称</th><th style={thStyle}>类型</th><th style={thStyle}>说明</th></tr></thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={i}>
                <td style={tdStyle}>
                  <div style={{ fontSize: 11.5, color: 'var(--foreground)' }}>{o.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--foreground-muted)', fontFamily: 'ui-monospace, monospace', marginTop: 1 }}>{o.oid}</div>
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' as const }}>{o.type}</td>
                <td style={tdStyle}>{o.desc}</td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: 'var(--foreground-muted)' }}>无匹配结果</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Extension buttons config ───────────────────────────────────────────────

const EXT_BUTTONS = [
  {
    id: 'nb' as const,
    title: 'JSON 北向接口 (悬停属性查看映射)',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
      </svg>
    ),
  },
  {
    id: 'lsp' as const,
    title: 'SR 语言服务器 (内联诊断)',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    id: 'sr-preview' as const,
    title: 'SR 文件预览',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'mib' as const,
    title: 'MIB 支持',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
];

// ── Main component ─────────────────────────────────────────────────────────

export function ExplorerView() {
  const [selectedId, setSelectedId] = useState<string | null>('readme');
  const [lspActive, setLspActive] = useState(false);
  const [nbActive, setNbActive] = useState(false);
  const [panelExt, setPanelExt] = useState<'sr-preview' | 'mib' | null>(null);

  const togglePanel = (id: 'sr-preview' | 'mib') =>
    setPanelExt(p => p === id ? null : id);

  const ibStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,255,255,0.10)' : 'none',
    border: 'none',
    color: active ? 'var(--foreground)' : 'var(--foreground-muted)',
    cursor: 'pointer', padding: 5, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'color 0.1s, background 0.1s',
  });

  const isActive = (id: typeof EXT_BUTTONS[number]['id']) =>
    id === 'lsp' ? lspActive
    : id === 'nb' ? nbActive
    : panelExt === id;

  const handleExtClick = (id: typeof EXT_BUTTONS[number]['id']) => {
    if (id === 'lsp') { setLspActive(v => !v); }
    else if (id === 'nb') { setNbActive(v => !v); }
    else { togglePanel(id); }
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--background)' }}>
      {/* Left panel */}
      <div style={{ width: 280, flexShrink: 0, background: 'var(--surface-2)', borderRight: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 0 16px', height: 44, font: '500 11px/1.2 var(--font-sans)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--foreground-secondary)', userSelect: 'none' as const, flexShrink: 0, borderBottom: '1px solid var(--border-subtle)' }}>
          <span>资源管理器</span>
          <div style={{ display: 'flex', gap: 2 }}>
            {EXT_BUTTONS.map(btn => (
              <button key={btn.id} style={ibStyle(isActive(btn.id))} title={btn.title} onClick={() => handleExtClick(btn.id)}
                onMouseEnter={e => { if (!isActive(btn.id)) (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground-secondary)'; }}
                onMouseLeave={e => { if (!isActive(btn.id)) (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground-muted)'; }}>
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 12px', height: 32, font: '500 11px/1.2 var(--font-sans)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--foreground-muted)', userSelect: 'none' as const, flexShrink: 0, gap: 6 }}>
          <svg viewBox="0 0 24 24" width="10" height="10" style={{ transform: 'rotate(90deg)', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          vpd-main
        </div>
        {/* Tree */}
        <div style={{ flex: 1, overflowY: 'auto' as const }}>
          {TREE.map((node, i) => (
            <TreeItem key={i} node={node} depth={0} selectedId={selectedId}
              onSelect={(id) => { setSelectedId(id); setPanelExt(null); }} />
          ))}
        </div>
      </div>

      {/* Right area */}
      {panelExt === 'sr-preview' ? <PanelSrPreview /> :
       panelExt === 'mib'        ? <PanelMib /> :
       <CodePane fileId={selectedId} lspActive={lspActive} nbActive={nbActive} />}
    </div>
  );
}
