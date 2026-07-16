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
          color: isSelected ? 'var(--primary, #34d399)' : 'var(--foreground, #cccccc)',
          background: isSelected ? 'rgba(52,211,153,0.08)' : 'transparent',
          borderLeft: isSelected ? '2px solid var(--primary, #34d399)' : '2px solid transparent',
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

// ── Syntax coloring (simple, no dependencies) ─────────────────────────────

function highlightLine(line: string, lang: string): React.ReactNode {
  if (lang === 'json') {
    // key: "string": value
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
          {fileId === 'risercard' ? '14100513_00000001040302023947.sr'
            : fileId === 'hypercard' ? '14140130_HyperCard_0.sr'
            : fileId === 'readme' ? 'README.md'
            : fileId === 'changelog' ? 'CHANGELOG.md'
            : fileId === 'conan' ? 'conanfile.py'
            : fileId === 'registry' ? 'registry.py'
            : 'SmcDfxInfo配置说明.md'}
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

// ── Main component ─────────────────────────────────────────────────────────

export function ExplorerView() {
  const [selectedId, setSelectedId] = useState<string | null>('readme');

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
        width: 220,
        flexShrink: 0,
        background: 'var(--surface-1, #0c0d14)',
        borderRight: '1px solid var(--border-subtle, #1c1d2a)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          padding: '7px 10px 5px',
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--foreground-muted, #5a6280)',
          borderBottom: '1px solid var(--border-subtle, #1c1d2a)',
          flexShrink: 0,
        }}>
          资源管理器
        </div>
        <div style={{ flex: 1, paddingTop: 4 }}>
          {TREE.map((node, i) => (
            <TreeItem key={i} node={node} depth={0} selectedId={selectedId} onSelect={setSelectedId} />
          ))}
        </div>
        <div style={{
          padding: '6px 10px',
          fontSize: 10.5,
          color: 'var(--foreground-muted, #5a6280)',
          borderTop: '1px solid var(--border-subtle, #1c1d2a)',
          fontFamily: 'ui-monospace, monospace',
        }}>
          vpd-main · 示例文件
        </div>
      </div>

      {/* Code pane */}
      <CodePane fileId={selectedId} />
    </div>
  );
}
