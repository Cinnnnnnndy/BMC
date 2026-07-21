import React, { useState } from 'react';
import { RepoCapabilityList } from './RepoCapabilityList';

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
      <div style={{
        position: 'fixed', left, top, zIndex: 9999, pointerEvents: 'none',
        maxWidth: 320, padding: '8px 12px',
        background: '#1a1a2e', border: `1px solid ${sevColor}55`,
        borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
            background: sevColor + '22', color: sevColor,
          }}>{sevLabel}</span>
          <span style={{ fontSize: 10.5, color: '#64748b' }}>sr-language-server · 0.9.4</span>
        </div>
        <div style={{ fontSize: 12, color: '#e2e8f0', lineHeight: 1.55 }}>{entry.msg}</div>
      </div>
    );
  }

  const { key, nb } = tip;
  return (
    <div style={{
      position: 'fixed', left, top, zIndex: 9999, pointerEvents: 'none',
      width: 310, padding: '8px 12px',
      background: '#1a1a2e', border: '1px solid rgba(79,110,247,0.35)',
      borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
    }}>
      <div style={{ fontSize: 10.5, color: '#64748b', marginBottom: 7 }}>
        北向接口映射 · <span style={{ color: '#9cdcfe', fontFamily: 'ui-monospace, monospace' }}>{key}</span>
      </div>
      {([
        ['Redfish', nb.redfish, '#60a5fa'],
        ['SNMP', nb.snmp, '#a78bfa'],
        ['IPMI', nb.ipmi, '#34d399'],
      ] as const).map(([label, value, color]) => (
        <div key={label} style={{ display: 'flex', gap: 8, marginBottom: 4, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10, color, fontWeight: 700, width: 42, flexShrink: 0, paddingTop: 1 }}>{label}</span>
          <span style={{ fontSize: 10.5, color: '#94a3b8', fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all', lineHeight: 1.4 }}>{value}</span>
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
];

// ── Main component ─────────────────────────────────────────────────────────

interface ExplorerViewProps {
  /** 仓能力清单是否已固定到资源管理器（两者结合方案的「固定」端）*/
  repoPinned?: boolean;
  /** 头部 ✦ 按钮：切换固定态（常驻入口）*/
  onTogglePin?: () => void;
  /** 功能卡派发：打开视图 */
  onOpenView?: (viewId: string) => void;
  /** 功能卡派发：agent 终端 */
  onRunAgent?: (cmd: string) => void;
}

// ── 左栏可折叠区（仓概览 / 模版浏览器 / Timeline 共用，交互一致）───────────────
function ExplorerSection({ title, defaultOpen = true, action, children }: {
  title: string; defaultOpen?: boolean; action?: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ flexShrink: 0, borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-2)', display: 'flex', flexDirection: 'column', maxHeight: '42%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 30, padding: '0 6px 0 12px', flexShrink: 0, userSelect: 'none', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24" width="10" height="10" style={{ transform: open ? 'rotate(90deg)' : 'none', flexShrink: 0, opacity: 0.55 }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6" /></svg>
        <span style={{ flex: 1, font: '600 11px/1.2 var(--font-sans)', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--foreground-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        {action}
      </div>
      {open && <div style={{ overflowY: 'auto', padding: '2px 12px 12px' }}>{children}</div>}
    </div>
  );
}

// 小圆角胶囊（模版项与功能项一致样式）
function ChipButton({ label, onClick, title }: { label: string; onClick: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title}
      style={{ padding: '5px 11px', borderRadius: 100, border: 'none', background: 'rgba(255,255,255,0.06)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.82)', transition: 'background .15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}>
      {label}
    </button>
  );
}

// 仓概览（固定后停靠）
function RepoDock({ onOpenView, onRunAgent, onUnpin }: {
  onOpenView: (v: string) => void; onRunAgent: (c: string) => void; onUnpin: () => void;
}) {
  return (
    <ExplorerSection title="仓概览" action={
      <button title="取消固定" onClick={e => { e.stopPropagation(); onUnpin(); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-muted)', padding: 4, borderRadius: 6, display: 'flex' }}>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    }>
      <RepoCapabilityList onOpenView={onOpenView} onRunAgent={onRunAgent} />
    </ExplorerSection>
  );
}

// 模版浏览器（与仓能力清单同场景：按类别列可用模版，点击进入对应配置视图）
const TEMPLATE_GROUPS: { group: string; items: { name: string; open: string }[] }[] = [
  { group: '传感器', items: [{ name: 'TMP112 温度 Scanner', open: 'sensor' }, { name: 'ADC 电压采样', open: 'sensor' }] },
  { group: '事件', items: [{ name: 'CPU 过温事件', open: 'event' }, { name: '电源掉电告警', open: 'event' }] },
  { group: '拓扑', items: [{ name: 'I2C Mux · PCA9545', open: 'topology' }, { name: 'Riser Card', open: 'topology' }] },
];
function TemplateBrowser({ onOpenView }: { onOpenView: (v: string) => void }) {
  return (
    <ExplorerSection title="模版浏览器" defaultOpen={false}>
      {TEMPLATE_GROUPS.map(g => (
        <section key={g.group} style={{ marginBottom: 9 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{g.group}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {g.items.map(t => <ChipButton key={t.name} label={t.name} title="从模版新建" onClick={() => onOpenView(t.open)} />)}
          </div>
        </section>
      ))}
    </ExplorerSection>
  );
}

// Timeline（近期变更，演示数据兜底）
const TIMELINE: { time: string; text: string }[] = [
  { time: '14:32', text: '修改 RiserCard I2C 拓扑' },
  { time: '11:08', text: 'CSR 全量校验通过 · 0 error' },
  { time: '昨天', text: '新增 CPU0 过温事件' },
  { time: '3 天前', text: '修复 PCA9545 地址冲突' },
];
function Timeline() {
  return (
    <ExplorerSection title="Timeline" defaultOpen={false}>
      {TIMELINE.map((t, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < TIMELINE.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.28)', flexShrink: 0, marginTop: 5 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.35 }}>{t.text}</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.38)', marginTop: 1 }}>{t.time}</div>
          </div>
        </div>
      ))}
    </ExplorerSection>
  );
}

export function ExplorerView({ repoPinned = false, onTogglePin, onOpenView, onRunAgent }: ExplorerViewProps = {}) {
  const [selectedId, setSelectedId] = useState<string | null>('readme');
  const [lspActive, setLspActive] = useState(false);
  const [nbActive, setNbActive] = useState(false);

  const ibStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,255,255,0.10)' : 'none',
    border: 'none',
    color: active ? 'var(--foreground)' : 'var(--foreground-muted)',
    cursor: 'pointer', padding: 5, borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'color 0.1s, background 0.1s',
  });

  const isActive = (id: typeof EXT_BUTTONS[number]['id']) => id === 'lsp' ? lspActive : nbActive;

  const handleExtClick = (id: typeof EXT_BUTTONS[number]['id']) => {
    if (id === 'lsp') setLspActive(v => !v);
    else setNbActive(v => !v);
  };

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--background)' }}>
      {/* Left panel */}
      <div style={{ width: 280, flexShrink: 0, background: 'var(--surface-2)', borderRight: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px 0 16px', height: 44, font: '500 11px/1.2 var(--font-sans)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--foreground-secondary)', userSelect: 'none' as const, flexShrink: 0, borderBottom: '1px solid var(--border-subtle)' }}>
          <span>资源管理器</span>
          <div style={{ display: 'flex', gap: 2 }}>
            {/* 罗盘：仓概览固定开关（常驻入口）*/}
            <button
              style={ibStyle(repoPinned)}
              title={repoPinned ? '仓概览已固定 · 点击取消' : '固定仓概览到此'}
              onClick={() => onTogglePin?.()}
              onMouseEnter={e => { if (!repoPinned) (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground-secondary)'; }}
              onMouseLeave={e => { if (!repoPinned) (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground-muted)'; }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" /><polygon points="15.6 8.4 13.4 13.4 8.4 15.6 10.6 10.6" />
              </svg>
            </button>
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
        <div style={{ flex: 1, overflowY: 'auto' as const, minHeight: 60 }}>
          {TREE.map((node, i) => (
            <TreeItem key={i} node={node} depth={0} selectedId={selectedId}
              onSelect={setSelectedId} />
          ))}
        </div>

        {/* 可折叠分区（交互一致）：仓概览（固定后）· 模版浏览器 · Timeline */}
        {repoPinned && (
          <RepoDock
            onOpenView={(v) => onOpenView?.(v)}
            onRunAgent={(c) => onRunAgent?.(c)}
            onUnpin={() => onTogglePin?.()}
          />
        )}
        <TemplateBrowser onOpenView={(v) => onOpenView?.(v)} />
        <Timeline />
      </div>

      {/* Right area */}
      <CodePane fileId={selectedId} lspActive={lspActive} nbActive={nbActive} />
    </div>
  );
}
