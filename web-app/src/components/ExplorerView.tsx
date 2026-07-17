import React, { useState } from 'react';

// ── Embedded file content ──────────────────────────────────────────────────

const FILES: Record<string, { lang: string; content: string }> = {
  readme: {
    lang: 'markdown',
    content: `# vpd 重要产品数据（vital product data）

硬件PSR、硬件CSR、机型相关的软件配置、北向接口映射、白牌定制等信息

# 代码仓目录结构说明
详细目录结构树如下所示，其中关键路径总结如下。

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
All notable changes to this project will be documented in this file.

## [1.90.60] - 2026-3-19
修复读取fru标签失败告警未关联属性的问题

## [1.90.59] - 2026-3-19
修复背板BC83NHBC Component和DiscreteSensor对象配置写死导致背板在后置位置时
板中硬盘的标识与传感器编号不符合实际的问题

## [1.90.58] - 2026-3-17
修复DC1000在OS下电情况下仍显示温度信息

## [1.90.57] - 2026-3-17
修复0x08000001告警描述中缺少BN号

## [1.90.56] - 2026-3-17
修复MCX653105A-ECAT告警状态值获取来源不匹配的问题

## [1.90.55] - 2026-3-15
新增UB接口卡温度获取失败事件

## [1.90.54] - 2026-3-13
修改0x28000033告警的修复建议

## [1.90.53] - 2026-3-12
电源内部故障告警添加无效值配置

## [1.90.51] - 2026-3-11
修复拔插电源线产生电源误告警`,
  },

  conan: {
    lang: 'python',
    content: `# Copyright (c) 2024 Huawei Technologies Co., Ltd.
# openUBMC is licensed under Mulan PSL v2.
# You can use this software according to the terms and conditions of the Mulan PSL v2.
# You may obtain a copy of Mulan PSL v2 at:
#         http://license.coscl.org.cn/MulanPSL2
# THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
# EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
# MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.

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

    # 拷贝产品定制化schema文件，实现产品差异化装备定制
    def cp_product_schema(self):
        board_dir = self.get_board_path()
        schema_path = os.path.join(self.source_folder, board_dir, "schema")
        if os.path.exists(schema_path):
            copy(
                self, "*.json",
                src=schema_path,
                dst=os.path.join(self.package_folder, "opt/bmc/profile_schema/product")
            )

    def cp_include_vendor(self):
        if str(self.options.board_name) == "common":
            copy(
                self, "*",
                src=os.path.join(self.source_folder, "./vendor"),
                dst=os.path.join(self.package_folder, "include/vendor")
            )`,
  },

  registry: {
    lang: 'python',
    content: `# Copyright (c) 2024 Huawei Technologies Co., Ltd.
# openUBMC is licensed under Mulan PSL v2.
# See http://license.coscl.org.cn/MulanPSL2 for details.

import os
import json
import stat
from collections import OrderedDict


class EvtInformation():
    def __init__(self):
        self.event_id = ''
        self.name = ''
        self.msg = ''
        self.severity = ''
        self.resolution = ''
        self.event_code = ''
        self.event_type = 0
        self.effect = ''
        self.cause = ''
        self.event_desc = ''


class Registry:
    def __init__(self, event_datas_dict, json_path):
        self.event_datas_dict = event_datas_dict
        self.json_path = json_path

    # 获取严重等级字符串
    @staticmethod
    def get_severity_string(evt_type, severity_level):
        severity_str = ['OK', 'Warning', 'Critical']
        severity_index = int(severity_level)
        evt_type_index = int(evt_type)
        # 事件类型 0:系统事件 1:维护事件 2:运行事件 3:装备事件
        # 系统/装备事件级别 0:ok 1:minor-Warning 2:major-Warning 3:critical-Critical
        # 维护/运行事件级别 0:info-OK 1:warning-Warning 2:error-Critical
        if (evt_type_index == 0 or evt_type_index == 3) and severity_index > 1:
            severity_index = severity_index - 1
        return severity_str[int(severity_index)]

    # 获取参数信息
    @staticmethod
    def get_msg_args_info(msg_fmt_str):
        args_info = []
        idx = msg_fmt_str.find('%')
        while idx != -1:
            args_info.append({'index': idx})
            idx = msg_fmt_str.find('%', idx + 1)
        return args_info`,
  },

  smcdfx: {
    lang: 'markdown',
    content: `# SmcDfxInfo 类定义说明

\`\`\`json
"SmcDfxInfo": {
    "properties": {
        "Chip": {
            "usage": ["CSR"],
            "baseType": "String"
        },
        "Offset": {
            "usage": ["CSR"],
            "baseType": "U32"
        },
        "Size": {
            "usage": ["CSR"],
            "baseType": "U8"
        },
        "Period": {
            "usage": ["CSR"],
            "baseType": "U32"
        },
        "SmcVersion": {
            "usage": ["CSR"],
            "baseType": "U32"
        },
        "Config": {
            "baseType": "Dictionary",
            "usage": ["CSR"],
            "$ref": "types.json#/defs/DfxConfigDict"
        },
        "Mapping": {
            "baseType": "Dictionary",
            "usage": ["CSR"],
            "$ref": "types.json#/defs/MappingDict"
        },
        "Context": {
            "baseType": "Dictionary",
            "usage": ["CSR"],
            "$ref": "types.json#/defs/ContextDict"
        }
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

// ── Extension IDs ──────────────────────────────────────────────────────────

type ExtId = 'json-api' | 'sr-lsp' | 'sr-preview' | 'mib';

// ── Tree structure ─────────────────────────────────────────────────────────

type FileNode = {
  name: string;
  type: 'file' | 'dir';
  fileId?: string;
  lang?: string;
  children?: FileNode[];
};

const TREE: FileNode[] = [
  {
    name: 'vpd-main', type: 'dir', children: [
      { name: 'README.md', type: 'file', fileId: 'readme', lang: 'md' },
      { name: 'CHANGELOG.md', type: 'file', fileId: 'changelog', lang: 'md' },
      { name: 'conanfile.py', type: 'file', fileId: 'conan', lang: 'py' },
      { name: 'registry.py', type: 'file', fileId: 'registry', lang: 'py' },
      { name: 'SmcDfxInfo配置说明.md', type: 'file', fileId: 'smcdfx', lang: 'md' },
      {
        name: 'vendor', type: 'dir', children: [
          {
            name: 'openUBMC', type: 'dir', children: [
              { name: '14100513_...023947.sr', type: 'file', fileId: 'risercard', lang: 'sr' },
            ],
          },
          {
            name: 'Customer', type: 'dir', children: [
              {
                name: 'DPU', type: 'dir', children: [
                  { name: '14140130_HyperCard_0.sr', type: 'file', fileId: 'hypercard', lang: 'sr' },
                ],
              },
            ],
          },
          {
            name: 'Huawei', type: 'dir', children: [
              {
                name: 'Server', type: 'dir', children: [
                  {
                    name: 'Kunpeng', type: 'dir', children: [
                      { name: 'BM320', type: 'dir', children: [] },
                    ],
                  },
                ],
              },
              { name: 'BMCSoC', type: 'dir', children: [] },
              { name: 'Nic', type: 'dir', children: [] },
              { name: 'TianChi', type: 'dir', children: [] },
            ],
          },
        ],
      },
    ],
  },
];

// ── Icons ──────────────────────────────────────────────────────────────────

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

// ── Tree item ──────────────────────────────────────────────────────────────

function TreeItem({
  node, depth, selectedId, onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isSelected = node.type === 'file' && node.fileId === selectedId;

  const handleClick = () => {
    if (node.type === 'dir') {
      setOpen(o => !o);
    } else if (node.fileId) {
      onSelect(node.fileId);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: `2px 8px 2px ${8 + depth * 14}px`,
          cursor: 'pointer',
          fontSize: 12.5,
          color: isSelected ? 'var(--foreground, #e8e8e8)' : 'var(--foreground-secondary, #9aa0b8)',
          background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
          borderLeft: '2px solid transparent',
          userSelect: 'none',
          lineHeight: '1.6',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        {node.type === 'dir' && <Chevron open={open} />}
        {node.type === 'dir'
          ? <IconDir open={open} />
          : <IconFile lang={node.lang} />
        }
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{node.name}</span>
      </div>
      {node.type === 'dir' && open && node.children?.map((child, i) => (
        <TreeItem key={i} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}

// ── Syntax coloring ────────────────────────────────────────────────────────

function highlightLine(line: string, lang: string): React.ReactNode {
  if (lang === 'json') {
    return <span dangerouslySetInnerHTML={{ __html: line
      .replace(/("[\w\s\-/#$]+")(\s*:)/g, '<span style="color:#9cdcfe">$1</span>$2')
      .replace(/:\s*("([^"]*)")/g, (_m, p1) => ': <span style="color:#ce9178">' + p1 + '</span>')
      .replace(/:\s*(\d+)/g, ': <span style="color:#b5cea8">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span style="color:#569cd6">$1</span>')
    }} />;
  }
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

// ── Code viewer ────────────────────────────────────────────────────────────

function CodePane({ fileId }: { fileId: string | null }) {
  if (!fileId) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--foreground-muted, #5a6280)', fontSize: 13, flexDirection: 'column', gap: 10,
      }}>
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

  const lines = file.content.split('\n');
  const displayName =
    fileId === 'risercard'  ? '14100513_00000001040302023947.sr'
    : fileId === 'hypercard' ? '14140130_HyperCard_0.sr'
    : fileId === 'readme'    ? 'README.md'
    : fileId === 'changelog' ? 'CHANGELOG.md'
    : fileId === 'conan'     ? 'conanfile.py'
    : fileId === 'registry'  ? 'registry.py'
    : 'SmcDfxInfo配置说明.md';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--background, #0a0b10)' }}>
      <div style={{
        padding: '6px 14px',
        fontSize: 11.5,
        color: 'var(--foreground-muted, #5a6280)',
        background: 'var(--surface-1, #0c0d14)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'ui-monospace, "JetBrains Mono", Menlo, monospace',
          color: 'var(--foreground, #cccccc)',
          fontSize: 12,
        }}>
          {displayName}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10.5 }}>
          vpd-main · openUBMC Studio
        </span>
      </div>
      <div style={{
        flex: 1,
        overflow: 'auto',
        fontFamily: 'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
        fontSize: 12.5,
        lineHeight: 1.7,
        display: 'flex',
      }}>
        <div style={{
          padding: '10px 0',
          minWidth: 42,
          textAlign: 'right',
          paddingRight: 10,
          paddingLeft: 12,
          color: 'var(--foreground-muted, #5a6280)',
          borderRight: '1px solid var(--border-subtle, #1c1d2a)',
          userSelect: 'none',
          flexShrink: 0,
          fontSize: 11,
        }}>
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <pre style={{
          margin: 0,
          padding: '10px 18px',
          flex: 1,
          overflow: 'visible',
          color: 'var(--foreground, #d4d4d4)',
          whiteSpace: 'pre',
        }}>
          {lines.map((line, i) => (
            <div key={i} style={{ minHeight: '1.7em' }}>
              {highlightLine(line, file.lang)}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// ── Tool panels ────────────────────────────────────────────────────────────

const panelBase: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--background, #0a0b10)',
};

const panelHd: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--foreground-muted)',
  borderBottom: '1px solid var(--border-subtle)',
  flexShrink: 0,
  background: 'var(--surface-1)',
};

const cell: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  color: 'var(--foreground-secondary)',
  borderBottom: '1px solid var(--border-subtle)',
  verticalAlign: 'top',
};

const thCell: React.CSSProperties = {
  ...cell,
  color: 'var(--foreground-muted)',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  background: 'var(--surface-2)',
};

function PanelJsonApi() {
  const [tab, setTab] = useState<'redfish' | 'snmp' | 'ipmi'>('redfish');

  const mappings: Array<{ srPath: string; redfish: string; snmp: string; ipmi: string }> = [
    { srPath: 'Unit.Type', redfish: '/redfish/v1/Chassis/{id}#/ChassisType', snmp: '1.3.6.1.4.1.2011.2.235.1.1.1.1', ipmi: 'FRU 0x01 Product Name' },
    { srPath: 'ManagementTopology.Anchor.Buses', redfish: '/redfish/v1/Systems/{id}/NetworkInterfaces', snmp: '1.3.6.1.4.1.2011.2.235.1.1.2.1', ipmi: 'N/A' },
    { srPath: 'Objects.*.Address', redfish: '/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Id', snmp: '1.3.6.1.4.1.2011.2.235.1.1.3.1', ipmi: 'SDR Sensor Number' },
    { srPath: 'Objects.*.HealthStatus', redfish: '/redfish/v1/Chassis/{id}#/Status/Health', snmp: '1.3.6.1.4.1.2011.2.235.1.1.4.1', ipmi: 'SEL Event Data Byte1' },
    { srPath: 'Objects.*.WriteTmout', redfish: '/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/WriteTimeout', snmp: '1.3.6.1.4.1.2011.2.235.1.1.5.1', ipmi: 'N/A' },
    { srPath: 'FormatVersion', redfish: '/redfish/v1/Chassis/{id}#/Oem/FormatVersion', snmp: '1.3.6.1.4.1.2011.2.235.1.1.6.1', ipmi: 'FRU 0x02 Board Product' },
  ];

  const tabStyle = (t: string): React.CSSProperties => ({
    padding: '4px 12px',
    fontSize: 11.5,
    fontWeight: 500,
    border: 'none',
    borderBottom: tab === t ? '2px solid var(--foreground-secondary)' : '2px solid transparent',
    background: 'transparent',
    color: tab === t ? 'var(--foreground)' : 'var(--foreground-muted)',
    cursor: 'pointer',
    transition: 'color 0.1s',
  });

  const colKey = tab === 'redfish' ? 'redfish' : tab === 'snmp' ? 'snmp' : 'ipmi';

  return (
    <div style={panelBase}>
      <div style={panelHd}>JSON 北向接口映射</div>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, padding: '0 8px', background: 'var(--surface-1)' }}>
        <button style={tabStyle('redfish')} onClick={() => setTab('redfish')}>Redfish</button>
        <button style={tabStyle('snmp')} onClick={() => setTab('snmp')}>SNMP</button>
        <button style={tabStyle('ipmi')} onClick={() => setTab('ipmi')}>IPMI</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thCell, width: '40%' }}>SR 路径</th>
              <th style={thCell}>{tab === 'redfish' ? 'Redfish URI' : tab === 'snmp' ? 'SNMP OID' : 'IPMI'}</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                <td style={{ ...cell, fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'var(--foreground)' }}>{m.srPath}</td>
                <td style={{ ...cell, fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>{m[colKey]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 12px', fontSize: 11, color: 'var(--foreground-muted)' }}>
          协议版本：Redfish 1.16.0 · SNMP v2c/v3 · IPMI 2.0
        </div>
      </div>
    </div>
  );
}

function PanelSrLsp() {
  const caps = [
    { name: 'textDocumentSync', val: 'Incremental (2)' },
    { name: 'completionProvider', val: '触发字符：. # / "' },
    { name: 'hoverProvider', val: '✓' },
    { name: 'definitionProvider', val: '✓' },
    { name: 'referencesProvider', val: '✓' },
    { name: 'documentSymbolProvider', val: '✓' },
    { name: 'diagnosticProvider', val: '跨文件依赖 + 工作区诊断' },
  ];
  const diags = [
    { sev: 'warn', file: '14140130_HyperCard_0.sr', msg: 'Chip_CPLD 地址 0x26 与同总线 Chip_BMC 地址相近，建议确认', line: 34 },
    { sev: 'info', file: 'README.md', msg: '文档中引用的路径 ./vendor/Huawei/Nic/hi1822 未在当前工作区中找到', line: 28 },
  ];

  return (
    <div style={panelBase}>
      <div style={panelHd}>SR 语言服务器</div>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: 'var(--foreground)' }}>sr-language-server v0.9.4</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--foreground-muted)' }}>PID 41872 · :2087</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '8px 16px 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em', color: 'var(--foreground-muted)' }}>能力</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {caps.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ ...cell, fontFamily: 'ui-monospace, monospace', fontSize: 11, width: '44%', color: 'var(--foreground)' }}>{c.name}</td>
                <td style={{ ...cell, fontSize: 11 }}>{c.val}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '8px 16px 4px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em', color: 'var(--foreground-muted)' }}>诊断</div>
        {diags.map((d, i) => (
          <div key={i} style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 3, flexShrink: 0, marginTop: 1,
              background: d.sev === 'warn' ? 'rgba(255,170,59,0.18)' : 'rgba(148,163,184,0.14)',
              color: d.sev === 'warn' ? '#ffaa3b' : '#94a3b8',
            }}>{d.sev.toUpperCase()}</span>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--foreground)', marginBottom: 2 }}>{d.msg}</div>
              <div style={{ fontSize: 10.5, color: 'var(--foreground-muted)', fontFamily: 'ui-monospace, monospace' }}>{d.file}:{d.line}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelSrPreview() {
  const nodes = [
    { id: 'Anchor', x: 140, y: 24, label: 'Anchor', kind: 'anchor' },
    { id: 'Hisport_0', x: 80, y: 100, label: 'Hisport_0', kind: 'bus' },
    { id: 'Pca9545', x: 80, y: 176, label: 'Pca9545\nPCA9545', kind: 'chip' },
    { id: 'Mux4', x: 10, y: 260, label: 'Mux_4', kind: 'bus' },
    { id: 'Mux1', x: 80, y: 260, label: 'Mux_1', kind: 'bus' },
    { id: 'Mux2', x: 150, y: 260, label: 'Mux_2', kind: 'bus' },
    { id: 'Pca9555', x: 10, y: 336, label: 'Pca9555\nIO', kind: 'chip' },
    { id: 'MCU1', x: 70, y: 336, label: 'Chip\nMCU1', kind: 'chip' },
    { id: 'PCIE1', x: 80, y: 336, label: 'Conn\nPCIE1', kind: 'connector' },
    { id: 'PCIE2', x: 150, y: 336, label: 'Conn\nPCIE2', kind: 'connector' },
    { id: 'McuSwitch', x: 70, y: 410, label: 'McuSw', kind: 'bus' },
    { id: 'Eeprom', x: 70, y: 484, label: 'Eeprom\nIEU', kind: 'chip' },
  ];

  const edges = [
    ['Anchor', 'Hisport_0'],
    ['Hisport_0', 'Pca9545'],
    ['Pca9545', 'Mux4'],
    ['Pca9545', 'Mux1'],
    ['Pca9545', 'Mux2'],
    ['Mux4', 'Pca9555'],
    ['Mux4', 'MCU1'],
    ['Mux1', 'PCIE1'],
    ['Mux2', 'PCIE2'],
    ['MCU1', 'McuSwitch'],
    ['McuSwitch', 'Eeprom'],
  ];

  const kindColor: Record<string, string> = {
    anchor: '#64748b',
    bus: '#4f6ef7',
    chip: '#22c55e',
    connector: '#f59e0b',
  };

  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div style={panelBase}>
      <div style={panelHd}>SR 文件预览 — 14100513_...023947.sr</div>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, display: 'flex', gap: 16 }}>
        {Object.entries(kindColor).map(([k, c]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--foreground-muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
            {k}
          </span>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', padding: '8px' }}>
        <svg width="220" height="530" style={{ display: 'block' }}>
          {edges.map(([a, b], i) => {
            const na = nodeById[a];
            const nb = nodeById[b];
            if (!na || !nb) return null;
            return (
              <line key={i}
                x1={na.x + 30} y1={na.y + 18}
                x2={nb.x + 30} y2={nb.y}
                stroke="rgba(255,255,255,0.12)" strokeWidth="1"
              />
            );
          })}
          {nodes.map(n => (
            <g key={n.id}>
              <rect
                x={n.x} y={n.y} width={60} height={36} rx={5}
                fill={kindColor[n.kind] + '22'}
                stroke={kindColor[n.kind]}
                strokeWidth="1"
              />
              {n.label.split('\n').map((l, li) => (
                <text key={li} x={n.x + 30} y={n.y + 14 + li * 13}
                  textAnchor="middle" fontSize="9" fill={kindColor[n.kind]}>
                  {l}
                </text>
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function PanelMib() {
  const [query, setQuery] = useState('');

  const oids = [
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.1.1', name: 'bmcProductName', type: 'String', desc: '产品型号' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.1.2', name: 'bmcFirmwareVersion', type: 'String', desc: '固件版本' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.2.1', name: 'bmcBoardCount', type: 'Integer', desc: '在线板卡总数' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.3.1', name: 'bmcSensorValue', type: 'Gauge32', desc: '传感器当前读数' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.4.1', name: 'bmcHealthStatus', type: 'Integer', desc: '0=OK, 1=Warn, 2=Crit' },
    { oid: '1.3.6.1.4.1.2011.2.235.2.1.1', name: 'bmcHardwareTrap', type: 'Trap', desc: '硬件故障告警' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.5.1', name: 'bmcPowerStatus', type: 'Integer', desc: '电源状态' },
    { oid: '1.3.6.1.4.1.2011.2.235.1.1.6.1', name: 'bmcCpuTemp', type: 'Gauge32', desc: 'CPU 温度传感器' },
  ];

  const q = query.toLowerCase();
  const filtered = q
    ? oids.filter(o => o.name.toLowerCase().includes(q) || o.oid.includes(q) || o.desc.toLowerCase().includes(q))
    : oids;

  return (
    <div style={panelBase}>
      <div style={panelHd}>HUAWEI-BMC-MIB v2</div>
      <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0, background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface-2)', borderRadius: 6, padding: '4px 8px', border: '1px solid var(--border-subtle)' }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--foreground-muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索 OID / 名称..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 12, color: 'var(--foreground)', padding: 0 }}
          />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thCell }}>名称</th>
              <th style={{ ...thCell }}>类型</th>
              <th style={{ ...thCell }}>说明</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ ...cell, padding: '5px 12px' }}>
                  <div style={{ fontSize: 11.5, color: 'var(--foreground)' }}>{o.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--foreground-muted)', fontFamily: 'ui-monospace, monospace', marginTop: 1 }}>{o.oid}</div>
                </td>
                <td style={{ ...cell, fontSize: 11, padding: '5px 12px', whiteSpace: 'nowrap' as const }}>{o.type}</td>
                <td style={{ ...cell, fontSize: 11, padding: '5px 12px' }}>{o.desc}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={3} style={{ ...cell, textAlign: 'center' as const, color: 'var(--foreground-muted)' }}>无匹配结果</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Extension header buttons ────────────────────────────────────────────────

const EXT_BUTTONS: Array<{ id: ExtId; title: string; icon: React.ReactNode }> = [
  {
    id: 'json-api',
    title: 'JSON 北向接口',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
      </svg>
    ),
  },
  {
    id: 'sr-lsp',
    title: 'SR 语言服务器',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
      </svg>
    ),
  },
  {
    id: 'sr-preview',
    title: 'SR 文件预览',
    icon: (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'mib',
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
  const [activeExt, setActiveExt] = useState<ExtId | null>(null);

  const toggleExt = (id: ExtId) => {
    setActiveExt(prev => prev === id ? null : id);
  };

  const ibStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,255,255,0.10)' : 'none',
    border: 'none',
    color: active ? 'var(--foreground)' : 'var(--foreground-muted)',
    cursor: 'pointer',
    padding: 5,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.1s, background 0.1s',
  });

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      background: 'var(--background, #0a0b10)',
    }}>
      {/* Tree panel */}
      <div style={{
        width: 280,
        flexShrink: 0,
        background: 'var(--surface-2)',
        borderRight: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Panel header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 0 16px',
          height: 44,
          font: '500 11px/1.2 var(--font-sans)',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          color: 'var(--foreground-secondary)',
          userSelect: 'none' as const,
          flexShrink: 0,
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <span>资源管理器</span>
          <div style={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
            {EXT_BUTTONS.map(btn => (
              <button
                key={btn.id}
                style={ibStyle(activeExt === btn.id)}
                title={btn.title}
                onClick={() => toggleExt(btn.id)}
                onMouseEnter={e => { if (activeExt !== btn.id) (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground-secondary)'; }}
                onMouseLeave={e => { if (activeExt !== btn.id) (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground-muted)'; }}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px 0 12px',
          height: 32,
          font: '500 11px/1.2 var(--font-sans)',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          color: 'var(--foreground-muted)',
          userSelect: 'none' as const,
          flexShrink: 0,
          gap: 6,
        }}>
          <svg viewBox="0 0 24 24" width="10" height="10" style={{ color: 'var(--foreground-muted)', transform: 'rotate(90deg)', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          vpd-main
        </div>
        <div style={{ flex: 1, overflowY: 'auto' as const }}>
          {TREE.map((node, i) => (
            <TreeItem key={i} node={node} depth={0} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setActiveExt(null); }} />
          ))}
        </div>
      </div>

      {/* Right pane: tool panel or code */}
      {activeExt === 'json-api'    ? <PanelJsonApi />    :
       activeExt === 'sr-lsp'     ? <PanelSrLsp />      :
       activeExt === 'sr-preview' ? <PanelSrPreview />  :
       activeExt === 'mib'        ? <PanelMib />        :
       <CodePane fileId={selectedId} />}
    </div>
  );
}
