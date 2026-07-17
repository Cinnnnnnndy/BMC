import{a as c,j as e}from"./vendor-xyflow-D0FvDkLz.js";const u={readme:{lang:"markdown",content:`# vpd 重要产品数据（vital product data）

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
【解读】白牌定制的配置信息，包括DPU等特殊硬件`},changelog:{lang:"markdown",content:`# Changelog
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
修复拔插电源线产生电源误告警`},conan:{lang:"python",content:`# Copyright (c) 2024 Huawei Technologies Co., Ltd.
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
            )`},registry:{lang:"python",content:`# Copyright (c) 2024 Huawei Technologies Co., Ltd.
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
        return args_info`},smcdfx:{lang:"markdown",content:`# SmcDfxInfo 类定义说明

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
\`\`\``},risercard:{lang:"json",content:`{
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
}`},"ext-json-api":{lang:"json",content:`{
  "$schema": "https://ubmc.openeuler.org/schema/northbound/v1",
  "version": "1.3.0",
  "title": "BMC 北向接口映射定义",
  "description": "将 SR 内部对象属性映射到 Redfish / SNMP / IPMI 北向协议字段",
  "mappings": [
    {
      "srPath": "Unit.Type",
      "redfish": "/redfish/v1/Chassis/{id}#/ChassisType",
      "snmpOid": "1.3.6.1.4.1.2011.2.235.1.1.1.1",
      "ipmi": "FRU 0x01 Product Name"
    },
    {
      "srPath": "ManagementTopology.Anchor.Buses",
      "redfish": "/redfish/v1/Systems/{id}/NetworkInterfaces",
      "snmpOid": "1.3.6.1.4.1.2011.2.235.1.1.2.1",
      "ipmi": "N/A"
    },
    {
      "srPath": "Objects.*.Address",
      "redfish": "/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Id",
      "snmpOid": "1.3.6.1.4.1.2011.2.235.1.1.3.1",
      "ipmi": "SDR Sensor Number"
    },
    {
      "srPath": "Objects.*.HealthStatus",
      "redfish": "/redfish/v1/Chassis/{id}#/Status/Health",
      "snmpOid": "1.3.6.1.4.1.2011.2.235.1.1.4.1",
      "ipmi": "SEL Event Data Byte1"
    }
  ],
  "protocols": {
    "redfish": { "version": "1.16.0", "auth": "BasicAuth / SessionAuth" },
    "snmp":    { "version": "v2c / v3",  "mibs": ["HUAWEI-BMC-MIB"] },
    "ipmi":    { "version": "2.0",       "channel": "LAN / KCS" }
  }
}`},"ext-sr-lsp":{lang:"json",content:`{
  "name": "sr-language-server",
  "displayName": "SR 语言服务器",
  "version": "0.9.4",
  "description": "为 .sr 板卡描述文件提供语法检查、补全、悬停提示和跳转定义",
  "capabilities": {
    "textDocumentSync": 2,
    "completionProvider": {
      "triggerCharacters": [".", "#", "/", """],
      "resolveProvider": true
    },
    "hoverProvider": true,
    "definitionProvider": true,
    "referencesProvider": true,
    "documentSymbolProvider": true,
    "diagnosticProvider": {
      "interFileDependencies": true,
      "workspaceDiagnostics": true
    }
  },
  "schemas": {
    "sr": "https://ubmc.openeuler.org/schema/sr/v3",
    "softSr": "https://ubmc.openeuler.org/schema/soft-sr/v1"
  },
  "validation": {
    "checkConnectorRefs": true,
    "checkChipAddressConflict": true,
    "checkBusTopology": true,
    "lintFormatVersion": true
  },
  "status": "running",
  "pid": 41872,
  "port": 2087
}`},"ext-sr-preview":{lang:"json",content:`{
  "name": "sr-file-preview",
  "displayName": "SR 文件预览",
  "version": "0.6.1",
  "description": "在编辑器内以拓扑图方式可视化 .sr 板卡描述文件的 ManagementTopology",
  "supportedFileTypes": [".sr", "_soft.sr", ".json"],
  "renderModes": [
    {
      "id": "topology",
      "label": "拓扑视图",
      "description": "以节点图展示 Anchor → Bus → Chip → Connector 链路",
      "default": true
    },
    {
      "id": "table",
      "label": "对象列表",
      "description": "以表格展示所有 Objects 条目及其关键属性"
    },
    {
      "id": "diff",
      "label": "版本对比",
      "description": "对比两个版本 sr 文件中 Objects/Topology 的差异"
    }
  ],
  "colorScheme": {
    "Bus":       "#4f6ef7",
    "Chip":      "#22c55e",
    "Connector": "#f59e0b",
    "Eeprom":    "#a855f7",
    "MCU":       "#06b6d4"
  },
  "keybindings": {
    "openPreview": "Ctrl+Shift+V",
    "toggleMode":  "Ctrl+Shift+M"
  }
}`},"ext-mib":{lang:"markdown",content:`# HUAWEI-BMC-MIB  v2

BMC 硬件管理信息库（MIB），符合 RFC 2578 / SMIv2 规范。

## OID 树结构

\`\`\`
iso(1).org(3).dod(6).internet(1).private(4).enterprises(1)
  └─ huawei(2011).products(2).iBMC(235)
       ├─ bmcObjects(1)
       │    ├─ bmcSystem(1)     — 系统基本信息
       │    ├─ bmcBoard(2)      — 板卡拓扑
       │    ├─ bmcSensor(3)     — 传感器读数
       │    ├─ bmcPower(4)      — 电源状态
       │    └─ bmcAlarm(5)      — 告警事件
       └─ bmcNotifications(2)
            └─ bmcTrap(1)       — SNMP Trap 定义
\`\`\`

## 常用 OID

| OID                                | 名称               | 类型    | 说明              |
|------------------------------------|--------------------|---------|-------------------|
| 1.3.6.1.4.1.2011.2.235.1.1.1.1    | bmcProductName     | String  | 产品型号          |
| 1.3.6.1.4.1.2011.2.235.1.1.1.2    | bmcFirmwareVersion | String  | 固件版本          |
| 1.3.6.1.4.1.2011.2.235.1.1.2.1    | bmcBoardCount      | Integer | 在线板卡总数      |
| 1.3.6.1.4.1.2011.2.235.1.1.3.1    | bmcSensorValue     | Gauge32 | 传感器当前读数    |
| 1.3.6.1.4.1.2011.2.235.1.1.4.1    | bmcHealthStatus    | Integer | 0=OK,1=Warn,2=Crit|
| 1.3.6.1.4.1.2011.2.235.2.1.1      | bmcHardwareTrap    | Trap    | 硬件故障告警      |

## SNMP 接入示例

\`\`\`bash
# 读取固件版本
snmpget -v2c -c public <bmc-ip> 1.3.6.1.4.1.2011.2.235.1.1.1.2

# 订阅所有告警 Trap
snmptrapd -f -Lo -c /etc/snmp/snmptrapd.conf
\`\`\`

## 下载

MIB 文件路径：\`vendor/Huawei/MIB/HUAWEI-BMC-MIB.txt\``},hypercard:{lang:"json",content:`{
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
}`}},m=[{id:"ext-json-api",name:"JSON 北向接口",iconColor:"#818cf8",iconBg:"rgba(99, 102, 241, 0.15)",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"11",height:"11",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M16 18l6-6-6-6M8 6l-6 6 6 6"})})},{id:"ext-sr-lsp",name:"SR 语言服务器",iconColor:"#34d399",iconBg:"rgba(16, 185, 129, 0.12)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"11",height:"11",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"4 17 10 11 4 5"}),e.jsx("line",{x1:"12",y1:"19",x2:"20",y2:"19"})]})},{id:"ext-sr-preview",name:"SR 文件预览",iconColor:"#38bdf8",iconBg:"rgba(14, 165, 233, 0.12)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"11",height:"11",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2"}),e.jsx("path",{d:"M8 21h8M12 17v4"})]})},{id:"ext-mib",name:"MIB 支持",iconColor:"#fbbf24",iconBg:"rgba(245, 158, 11, 0.12)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"11",height:"11",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}),e.jsx("path",{d:"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"})]})}],g=[{name:"vpd-main",type:"dir",children:[{name:"README.md",type:"file",fileId:"readme",lang:"md"},{name:"CHANGELOG.md",type:"file",fileId:"changelog",lang:"md"},{name:"conanfile.py",type:"file",fileId:"conan",lang:"py"},{name:"registry.py",type:"file",fileId:"registry",lang:"py"},{name:"SmcDfxInfo配置说明.md",type:"file",fileId:"smcdfx",lang:"md"},{name:"vendor",type:"dir",children:[{name:"openUBMC",type:"dir",children:[{name:"14100513_...023947.sr",type:"file",fileId:"risercard",lang:"sr"}]},{name:"Customer",type:"dir",children:[{name:"DPU",type:"dir",children:[{name:"14140130_HyperCard_0.sr",type:"file",fileId:"hypercard",lang:"sr"}]}]},{name:"Huawei",type:"dir",children:[{name:"Server",type:"dir",children:[{name:"Kunpeng",type:"dir",children:[{name:"BM320",type:"dir",children:[]}]}]},{name:"BMCSoC",type:"dir",children:[]},{name:"Nic",type:"dir",children:[]},{name:"TianChi",type:"dir",children:[]}]}]}]}];function v({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:r?e.jsx("path",{d:"M1.5 3.5h13l-1.5 9h-10L1.5 3.5zM1.5 3.5L4 1.5h5l1 2",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"}):e.jsx("path",{d:"M1.5 2.5h4l1.5 2H14.5v9h-13v-11z",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"})})}function x({lang:r}){const t=r==="py"?"#4ec9b0":r==="md"?"#89d7e9":r==="sr"?"#ce9178":"#cccccc";return e.jsxs("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:[e.jsx("path",{d:"M2 1.5h8l3.5 3.5V14.5H2V1.5z",stroke:t,strokeWidth:"1",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 1.5V5H13.5",stroke:t,strokeWidth:"1"})]})}function y({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"12",height:"12",fill:"none",style:{flexShrink:0,transform:r?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.12s",opacity:.5},children:e.jsx("path",{d:"M6 4l4 4-4 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}function l({node:r,depth:t,selectedId:n,onSelect:s}){var d;const[o,p]=c.useState(t<2),a=r.type==="file"&&r.fileId===n,h=()=>{r.type==="dir"?p(i=>!i):r.fileId&&s(r.fileId)};return e.jsxs("div",{children:[e.jsxs("div",{onClick:h,style:{display:"flex",alignItems:"center",gap:4,padding:`2px 8px 2px ${8+t*14}px`,cursor:"pointer",fontSize:12.5,color:a?"var(--primary, #34d399)":"var(--foreground, #cccccc)",background:a?"rgba(52,211,153,0.08)":"transparent",borderLeft:a?"2px solid var(--primary, #34d399)":"2px solid transparent",userSelect:"none",lineHeight:"1.6",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},onMouseEnter:i=>{a||(i.currentTarget.style.background="rgba(255,255,255,0.04)")},onMouseLeave:i=>{a||(i.currentTarget.style.background="transparent")},children:[r.type==="dir"&&e.jsx(y,{open:o}),r.type==="dir"?e.jsx(v,{open:o}):e.jsx(x,{lang:r.lang}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:r.name})]}),r.type==="dir"&&o&&((d=r.children)==null?void 0:d.map((i,f)=>e.jsx(l,{node:i,depth:t+1,selectedId:n,onSelect:s},f)))]})}function _(r,t){if(t==="json")return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/("[\w\s\-/#$]+")(\s*:)/g,'<span style="color:#9cdcfe">$1</span>$2').replace(/:\s*("([^"]*)")/g,(n,s)=>': <span style="color:#ce9178">'+s+"</span>").replace(/:\s*(\d+)/g,': <span style="color:#b5cea8">$1</span>').replace(/:\s*(true|false|null)/g,': <span style="color:#569cd6">$1</span>')}});if(t==="python")return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/(#.*$)/,'<span style="color:#6a9955">$1</span>').replace(/\b(import|from|class|def|self|return|if|else|elif|for|in|and|or|not|pass|None|True|False|staticmethod)\b/g,'<span style="color:#569cd6">$1</span>').replace(/("[^"]*")/g,'<span style="color:#ce9178">$1</span>').replace(/('[^']*')/g,'<span style="color:#ce9178">$1</span>')}});if(t==="markdown"){if(r.startsWith("#"))return e.jsx("span",{style:{color:"#569cd6",fontWeight:600},children:r});if(r.startsWith("```"))return e.jsx("span",{style:{color:"#808080"},children:r});if(r.startsWith("【")||r.startsWith("##"))return e.jsx("span",{style:{color:"#4ec9b0"},children:r})}return r}function C({fileId:r}){if(!r)return e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--foreground-muted, #5a6280)",fontSize:13,flexDirection:"column",gap:10},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("path",{d:"M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"})]}),"选择文件以查看内容"]});const t=u[r];if(!t)return null;const n=t.content.split(`
`);return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background, #0a0b10)"},children:[e.jsxs("div",{style:{padding:"6px 14px",fontSize:11.5,color:"var(--foreground-muted, #5a6280)",background:"var(--surface-1, #0c0d14)",display:"flex",alignItems:"center",gap:8,flexShrink:0},children:[e.jsx("span",{style:{fontFamily:'ui-monospace, "JetBrains Mono", Menlo, monospace',color:"var(--foreground, #cccccc)",fontSize:12},children:r==="risercard"?"14100513_00000001040302023947.sr":r==="hypercard"?"14140130_HyperCard_0.sr":r==="readme"?"README.md":r==="changelog"?"CHANGELOG.md":r==="conan"?"conanfile.py":r==="registry"?"registry.py":r==="ext-json-api"?"northbound-mapping.json":r==="ext-sr-lsp"?"sr-language-server.json":r==="ext-sr-preview"?"sr-file-preview.json":r==="ext-mib"?"HUAWEI-BMC-MIB.md":"SmcDfxInfo配置说明.md"}),e.jsx("span",{style:{marginLeft:"auto",fontSize:10.5},children:"vpd-main · openUBMC Studio"})]}),e.jsxs("div",{style:{flex:1,overflow:"auto",fontFamily:'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',fontSize:12.5,lineHeight:1.7,display:"flex"},children:[e.jsx("div",{style:{padding:"10px 0",minWidth:42,textAlign:"right",paddingRight:10,paddingLeft:12,color:"var(--foreground-muted, #5a6280)",borderRight:"1px solid var(--border-subtle, #1c1d2a)",userSelect:"none",flexShrink:0,fontSize:11},children:n.map((s,o)=>e.jsx("div",{children:o+1},o))}),e.jsx("pre",{style:{margin:0,padding:"10px 18px",flex:1,overflow:"visible",color:"var(--foreground, #d4d4d4)",whiteSpace:"pre"},children:n.map((s,o)=>e.jsx("div",{style:{minHeight:"1.7em"},children:_(s,t.lang)},o))})]})]})}function b(){const[r,t]=c.useState("readme");return e.jsxs("div",{style:{display:"flex",height:"100%",width:"100%",overflow:"hidden",background:"var(--background, #0a0b10)"},children:[e.jsxs("div",{style:{width:280,flexShrink:0,background:"var(--surface-2)",borderRight:"1px solid var(--border-subtle)",overflow:"hidden",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px 0 16px",height:44,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-secondary)",userSelect:"none",flexShrink:0,borderBottom:"1px solid var(--border-subtle)"},children:[e.jsx("span",{children:"资源管理器"}),e.jsx("div",{style:{display:"flex",gap:2},children:e.jsx("button",{style:{background:"none",border:"none",color:"var(--foreground-muted)",cursor:"pointer",padding:5,borderRadius:8,display:"flex",alignItems:"center"},title:"折叠全部",children:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M8 3v3a2 2 0 0 1-2 2H3"}),e.jsx("path",{d:"M21 8h-3a2 2 0 0 1-2-2V3"}),e.jsx("path",{d:"M3 16h3a2 2 0 0 1 2 2v3"}),e.jsx("path",{d:"M16 21v-3a2 2 0 0 1 2-2h3"})]})})})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"0 8px 0 12px",height:32,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",userSelect:"none",flexShrink:0,gap:6},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:{color:"var(--foreground-muted)",transform:"rotate(90deg)",flexShrink:0},fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})}),"vpd-main"]}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:g.map((n,s)=>e.jsx(l,{node:n,depth:0,selectedId:r,onSelect:t},s))}),e.jsxs("div",{style:{flexShrink:0,borderTop:"1px solid var(--border-subtle)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"0 8px 0 12px",height:32,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",userSelect:"none",gap:6},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:{color:"var(--foreground-muted)",transform:"rotate(90deg)",flexShrink:0},fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})}),"代码辅助扩展"]}),m.map(n=>{const s=r===n.id;return e.jsxs("div",{onClick:()=>t(n.id),style:{display:"flex",alignItems:"center",gap:8,padding:"0 12px",height:28,cursor:"pointer",fontSize:12,color:s?"var(--foreground)":"var(--foreground-secondary)",background:s?"var(--state-selected, rgba(67,105,239,0.14))":"transparent",borderLeft:s?"2px solid var(--primary)":"2px solid transparent",userSelect:"none",transition:"background 0.1s"},onMouseEnter:o=>{s||(o.currentTarget.style.background="var(--state-hover)")},onMouseLeave:o=>{s||(o.currentTarget.style.background="transparent")},children:[e.jsx("div",{style:{width:18,height:18,borderRadius:4,background:n.iconBg,color:n.iconColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:n.icon}),n.name]},n.id)}),e.jsx("div",{style:{height:8}})]})]}),e.jsx(C,{fileId:r})]})}export{b as ExplorerView};
