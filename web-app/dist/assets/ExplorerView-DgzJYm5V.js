import{a as f,j as e}from"./vendor-xyflow-D0FvDkLz.js";const y={readme:{lang:"markdown",content:`# vpd 重要产品数据（vital product data）

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
}`},hypercard:{lang:"json",content:`{
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
}`}},v=[{name:"vpd-main",type:"dir",children:[{name:"README.md",type:"file",fileId:"readme",lang:"md"},{name:"CHANGELOG.md",type:"file",fileId:"changelog",lang:"md"},{name:"conanfile.py",type:"file",fileId:"conan",lang:"py"},{name:"registry.py",type:"file",fileId:"registry",lang:"py"},{name:"SmcDfxInfo配置说明.md",type:"file",fileId:"smcdfx",lang:"md"},{name:"vendor",type:"dir",children:[{name:"openUBMC",type:"dir",children:[{name:"14100513_...023947.sr",type:"file",fileId:"risercard",lang:"sr"}]},{name:"Customer",type:"dir",children:[{name:"DPU",type:"dir",children:[{name:"14140130_HyperCard_0.sr",type:"file",fileId:"hypercard",lang:"sr"}]}]},{name:"Huawei",type:"dir",children:[{name:"Server",type:"dir",children:[{name:"Kunpeng",type:"dir",children:[{name:"BM320",type:"dir",children:[]}]}]},{name:"BMCSoC",type:"dir",children:[]},{name:"Nic",type:"dir",children:[]},{name:"TianChi",type:"dir",children:[]}]}]}]}];function b({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:r?e.jsx("path",{d:"M1.5 3.5h13l-1.5 9h-10L1.5 3.5zM1.5 3.5L4 1.5h5l1 2",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"}):e.jsx("path",{d:"M1.5 2.5h4l1.5 2H14.5v9h-13v-11z",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"})})}function j({lang:r}){const o=r==="py"?"#4ec9b0":r==="md"?"#89d7e9":r==="sr"?"#ce9178":"#cccccc";return e.jsxs("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:[e.jsx("path",{d:"M2 1.5h8l3.5 3.5V14.5H2V1.5z",stroke:o,strokeWidth:"1",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 1.5V5H13.5",stroke:o,strokeWidth:"1"})]})}function S({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"12",height:"12",fill:"none",style:{flexShrink:0,transform:r?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.12s",opacity:.5},children:e.jsx("path",{d:"M6 4l4 4-4 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}function m({node:r,depth:o,selectedId:t,onSelect:d}){var c;const[n,s]=f.useState(o<2),i=r.type==="file"&&r.fileId===t,a=()=>{r.type==="dir"?s(p=>!p):r.fileId&&d(r.fileId)};return e.jsxs("div",{children:[e.jsxs("div",{onClick:a,style:{display:"flex",alignItems:"center",gap:4,padding:`2px 8px 2px ${8+o*14}px`,cursor:"pointer",fontSize:12.5,color:i?"var(--foreground, #e8e8e8)":"var(--foreground-secondary, #9aa0b8)",background:i?"rgba(255,255,255,0.08)":"transparent",borderLeft:"2px solid transparent",userSelect:"none",lineHeight:"1.6",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},onMouseEnter:p=>{i||(p.currentTarget.style.background="rgba(255,255,255,0.04)")},onMouseLeave:p=>{i||(p.currentTarget.style.background="transparent")},children:[r.type==="dir"&&e.jsx(S,{open:n}),r.type==="dir"?e.jsx(b,{open:n}):e.jsx(j,{lang:r.lang}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:r.name})]}),r.type==="dir"&&n&&((c=r.children)==null?void 0:c.map((p,g)=>e.jsx(m,{node:p,depth:o+1,selectedId:t,onSelect:d},g)))]})}function _(r,o){if(o==="json")return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/("[\w\s\-/#$]+")(\s*:)/g,'<span style="color:#9cdcfe">$1</span>$2').replace(/:\s*("([^"]*)")/g,(t,d)=>': <span style="color:#ce9178">'+d+"</span>").replace(/:\s*(\d+)/g,': <span style="color:#b5cea8">$1</span>').replace(/:\s*(true|false|null)/g,': <span style="color:#569cd6">$1</span>')}});if(o==="python")return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/(#.*$)/,'<span style="color:#6a9955">$1</span>').replace(/\b(import|from|class|def|self|return|if|else|elif|for|in|and|or|not|pass|None|True|False|staticmethod)\b/g,'<span style="color:#569cd6">$1</span>').replace(/("[^"]*")/g,'<span style="color:#ce9178">$1</span>').replace(/('[^']*')/g,'<span style="color:#ce9178">$1</span>')}});if(o==="markdown"){if(r.startsWith("#"))return e.jsx("span",{style:{color:"#569cd6",fontWeight:600},children:r});if(r.startsWith("```"))return e.jsx("span",{style:{color:"#808080"},children:r});if(r.startsWith("【")||r.startsWith("##"))return e.jsx("span",{style:{color:"#4ec9b0"},children:r})}return r}function C({fileId:r}){if(!r)return e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--foreground-muted, #5a6280)",fontSize:13,flexDirection:"column",gap:10},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("path",{d:"M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"})]}),"选择文件以查看内容"]});const o=y[r];if(!o)return null;const t=o.content.split(`
`),d=r==="risercard"?"14100513_00000001040302023947.sr":r==="hypercard"?"14140130_HyperCard_0.sr":r==="readme"?"README.md":r==="changelog"?"CHANGELOG.md":r==="conan"?"conanfile.py":r==="registry"?"registry.py":"SmcDfxInfo配置说明.md";return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background, #0a0b10)"},children:[e.jsxs("div",{style:{padding:"6px 14px",fontSize:11.5,color:"var(--foreground-muted, #5a6280)",background:"var(--surface-1, #0c0d14)",display:"flex",alignItems:"center",gap:8,flexShrink:0},children:[e.jsx("span",{style:{fontFamily:'ui-monospace, "JetBrains Mono", Menlo, monospace',color:"var(--foreground, #cccccc)",fontSize:12},children:d}),e.jsx("span",{style:{marginLeft:"auto",fontSize:10.5},children:"vpd-main · openUBMC Studio"})]}),e.jsxs("div",{style:{flex:1,overflow:"auto",fontFamily:'ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',fontSize:12.5,lineHeight:1.7,display:"flex"},children:[e.jsx("div",{style:{padding:"10px 0",minWidth:42,textAlign:"right",paddingRight:10,paddingLeft:12,color:"var(--foreground-muted, #5a6280)",borderRight:"1px solid var(--border-subtle, #1c1d2a)",userSelect:"none",flexShrink:0,fontSize:11},children:t.map((n,s)=>e.jsx("div",{children:s+1},s))}),e.jsx("pre",{style:{margin:0,padding:"10px 18px",flex:1,overflow:"visible",color:"var(--foreground, #d4d4d4)",whiteSpace:"pre"},children:t.map((n,s)=>e.jsx("div",{style:{minHeight:"1.7em"},children:_(n,o.lang)},s))})]})]})}const u={flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background, #0a0b10)"},x={padding:"8px 16px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,background:"var(--surface-1)"},l={padding:"6px 12px",fontSize:12,color:"var(--foreground-secondary)",borderBottom:"1px solid var(--border-subtle)",verticalAlign:"top"},h={...l,color:"var(--foreground-muted)",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",background:"var(--surface-2)"};function k(){const[r,o]=f.useState("redfish"),t=[{srPath:"Unit.Type",redfish:"/redfish/v1/Chassis/{id}#/ChassisType",snmp:"1.3.6.1.4.1.2011.2.235.1.1.1.1",ipmi:"FRU 0x01 Product Name"},{srPath:"ManagementTopology.Anchor.Buses",redfish:"/redfish/v1/Systems/{id}/NetworkInterfaces",snmp:"1.3.6.1.4.1.2011.2.235.1.1.2.1",ipmi:"N/A"},{srPath:"Objects.*.Address",redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Id",snmp:"1.3.6.1.4.1.2011.2.235.1.1.3.1",ipmi:"SDR Sensor Number"},{srPath:"Objects.*.HealthStatus",redfish:"/redfish/v1/Chassis/{id}#/Status/Health",snmp:"1.3.6.1.4.1.2011.2.235.1.1.4.1",ipmi:"SEL Event Data Byte1"},{srPath:"Objects.*.WriteTmout",redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/WriteTimeout",snmp:"1.3.6.1.4.1.2011.2.235.1.1.5.1",ipmi:"N/A"},{srPath:"FormatVersion",redfish:"/redfish/v1/Chassis/{id}#/Oem/FormatVersion",snmp:"1.3.6.1.4.1.2011.2.235.1.1.6.1",ipmi:"FRU 0x02 Board Product"}],d=s=>({padding:"4px 12px",fontSize:11.5,fontWeight:500,border:"none",borderBottom:r===s?"2px solid var(--foreground-secondary)":"2px solid transparent",background:"transparent",color:r===s?"var(--foreground)":"var(--foreground-muted)",cursor:"pointer",transition:"color 0.1s"}),n=r==="redfish"?"redfish":r==="snmp"?"snmp":"ipmi";return e.jsxs("div",{style:u,children:[e.jsx("div",{style:x,children:"JSON 北向接口映射"}),e.jsxs("div",{style:{display:"flex",gap:0,borderBottom:"1px solid var(--border-subtle)",flexShrink:0,padding:"0 8px",background:"var(--surface-1)"},children:[e.jsx("button",{style:d("redfish"),onClick:()=>o("redfish"),children:"Redfish"}),e.jsx("button",{style:d("snmp"),onClick:()=>o("snmp"),children:"SNMP"}),e.jsx("button",{style:d("ipmi"),onClick:()=>o("ipmi"),children:"IPMI"})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto"},children:[e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:12},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{...h,width:"40%"},children:"SR 路径"}),e.jsx("th",{style:h,children:r==="redfish"?"Redfish URI":r==="snmp"?"SNMP OID":"IPMI"})]})}),e.jsx("tbody",{children:t.map((s,i)=>e.jsxs("tr",{style:{background:i%2===0?"transparent":"rgba(255,255,255,0.02)"},children:[e.jsx("td",{style:{...l,fontFamily:"ui-monospace, monospace",fontSize:11,color:"var(--foreground)"},children:s.srPath}),e.jsx("td",{style:{...l,fontFamily:"ui-monospace, monospace",fontSize:11},children:s[n]})]},i))})]}),e.jsx("div",{style:{padding:"10px 12px",fontSize:11,color:"var(--foreground-muted)"},children:"协议版本：Redfish 1.16.0 · SNMP v2c/v3 · IPMI 2.0"})]})]})}function M(){const r=[{name:"textDocumentSync",val:"Incremental (2)"},{name:"completionProvider",val:'触发字符：. # / "'},{name:"hoverProvider",val:"✓"},{name:"definitionProvider",val:"✓"},{name:"referencesProvider",val:"✓"},{name:"documentSymbolProvider",val:"✓"},{name:"diagnosticProvider",val:"跨文件依赖 + 工作区诊断"}],o=[{sev:"warn",file:"14140130_HyperCard_0.sr",msg:"Chip_CPLD 地址 0x26 与同总线 Chip_BMC 地址相近，建议确认",line:34},{sev:"info",file:"README.md",msg:"文档中引用的路径 ./vendor/Huawei/Nic/hi1822 未在当前工作区中找到",line:28}];return e.jsxs("div",{style:u,children:[e.jsx("div",{style:x,children:"SR 语言服务器"}),e.jsxs("div",{style:{padding:"12px 16px",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,display:"flex",alignItems:"center",gap:10},children:[e.jsx("span",{style:{width:8,height:8,borderRadius:"50%",background:"#22c55e",display:"inline-block",flexShrink:0}}),e.jsx("span",{style:{fontSize:12,color:"var(--foreground)"},children:"sr-language-server v0.9.4"}),e.jsx("span",{style:{marginLeft:"auto",fontSize:11,color:"var(--foreground-muted)"},children:"PID 41872 · :2087"})]}),e.jsxs("div",{style:{flex:1,overflowY:"auto"},children:[e.jsx("div",{style:{padding:"8px 16px 4px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",color:"var(--foreground-muted)"},children:"能力"}),e.jsx("table",{style:{width:"100%",borderCollapse:"collapse"},children:e.jsx("tbody",{children:r.map((t,d)=>e.jsxs("tr",{style:{borderBottom:"1px solid var(--border-subtle)"},children:[e.jsx("td",{style:{...l,fontFamily:"ui-monospace, monospace",fontSize:11,width:"44%",color:"var(--foreground)"},children:t.name}),e.jsx("td",{style:{...l,fontSize:11},children:t.val})]},d))})}),e.jsx("div",{style:{padding:"8px 16px 4px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",color:"var(--foreground-muted)"},children:"诊断"}),o.map((t,d)=>e.jsxs("div",{style:{padding:"8px 16px",borderBottom:"1px solid var(--border-subtle)",display:"flex",gap:8,alignItems:"flex-start"},children:[e.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:3,flexShrink:0,marginTop:1,background:t.sev==="warn"?"rgba(255,170,59,0.18)":"rgba(148,163,184,0.14)",color:t.sev==="warn"?"#ffaa3b":"#94a3b8"},children:t.sev.toUpperCase()}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:11.5,color:"var(--foreground)",marginBottom:2},children:t.msg}),e.jsxs("div",{style:{fontSize:10.5,color:"var(--foreground-muted)",fontFamily:"ui-monospace, monospace"},children:[t.file,":",t.line]})]})]},d))]})]})}function w(){const r=[{id:"Anchor",x:140,y:24,label:"Anchor",kind:"anchor"},{id:"Hisport_0",x:80,y:100,label:"Hisport_0",kind:"bus"},{id:"Pca9545",x:80,y:176,label:`Pca9545
PCA9545`,kind:"chip"},{id:"Mux4",x:10,y:260,label:"Mux_4",kind:"bus"},{id:"Mux1",x:80,y:260,label:"Mux_1",kind:"bus"},{id:"Mux2",x:150,y:260,label:"Mux_2",kind:"bus"},{id:"Pca9555",x:10,y:336,label:`Pca9555
IO`,kind:"chip"},{id:"MCU1",x:70,y:336,label:`Chip
MCU1`,kind:"chip"},{id:"PCIE1",x:80,y:336,label:`Conn
PCIE1`,kind:"connector"},{id:"PCIE2",x:150,y:336,label:`Conn
PCIE2`,kind:"connector"},{id:"McuSwitch",x:70,y:410,label:"McuSw",kind:"bus"},{id:"Eeprom",x:70,y:484,label:`Eeprom
IEU`,kind:"chip"}],o=[["Anchor","Hisport_0"],["Hisport_0","Pca9545"],["Pca9545","Mux4"],["Pca9545","Mux1"],["Pca9545","Mux2"],["Mux4","Pca9555"],["Mux4","MCU1"],["Mux1","PCIE1"],["Mux2","PCIE2"],["MCU1","McuSwitch"],["McuSwitch","Eeprom"]],t={anchor:"#64748b",bus:"#4f6ef7",chip:"#22c55e",connector:"#f59e0b"},d=Object.fromEntries(r.map(n=>[n.id,n]));return e.jsxs("div",{style:u,children:[e.jsx("div",{style:x,children:"SR 文件预览 — 14100513_...023947.sr"}),e.jsx("div",{style:{padding:"6px 12px",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,display:"flex",gap:16},children:Object.entries(t).map(([n,s])=>e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:4,fontSize:10.5,color:"var(--foreground-muted)"},children:[e.jsx("span",{style:{width:8,height:8,borderRadius:2,background:s,display:"inline-block"}}),n]},n))}),e.jsx("div",{style:{flex:1,overflowY:"auto",overflowX:"auto",padding:"8px"},children:e.jsxs("svg",{width:"220",height:"530",style:{display:"block"},children:[o.map(([n,s],i)=>{const a=d[n],c=d[s];return!a||!c?null:e.jsx("line",{x1:a.x+30,y1:a.y+18,x2:c.x+30,y2:c.y,stroke:"rgba(255,255,255,0.12)",strokeWidth:"1"},i)}),r.map(n=>e.jsxs("g",{children:[e.jsx("rect",{x:n.x,y:n.y,width:60,height:36,rx:5,fill:t[n.kind]+"22",stroke:t[n.kind],strokeWidth:"1"}),n.label.split(`
`).map((s,i)=>e.jsx("text",{x:n.x+30,y:n.y+14+i*13,textAnchor:"middle",fontSize:"9",fill:t[n.kind],children:s},i))]},n.id))]})})]})}function I(){const[r,o]=f.useState(""),t=[{oid:"1.3.6.1.4.1.2011.2.235.1.1.1.1",name:"bmcProductName",type:"String",desc:"产品型号"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.1.2",name:"bmcFirmwareVersion",type:"String",desc:"固件版本"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.2.1",name:"bmcBoardCount",type:"Integer",desc:"在线板卡总数"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.3.1",name:"bmcSensorValue",type:"Gauge32",desc:"传感器当前读数"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.4.1",name:"bmcHealthStatus",type:"Integer",desc:"0=OK, 1=Warn, 2=Crit"},{oid:"1.3.6.1.4.1.2011.2.235.2.1.1",name:"bmcHardwareTrap",type:"Trap",desc:"硬件故障告警"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.5.1",name:"bmcPowerStatus",type:"Integer",desc:"电源状态"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.6.1",name:"bmcCpuTemp",type:"Gauge32",desc:"CPU 温度传感器"}],d=r.toLowerCase(),n=d?t.filter(s=>s.name.toLowerCase().includes(d)||s.oid.includes(d)||s.desc.toLowerCase().includes(d)):t;return e.jsxs("div",{style:u,children:[e.jsx("div",{style:x,children:"HUAWEI-BMC-MIB v2"}),e.jsx("div",{style:{padding:"6px 10px",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,background:"var(--surface-1)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,background:"var(--surface-2)",borderRadius:6,padding:"4px 8px",border:"1px solid var(--border-subtle)"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",style:{color:"var(--foreground-muted)",flexShrink:0},children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.35-4.35"})]}),e.jsx("input",{value:r,onChange:s=>o(s.target.value),placeholder:"搜索 OID / 名称...",style:{flex:1,background:"none",border:"none",outline:"none",fontSize:12,color:"var(--foreground)",padding:0}})]})}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:{...h},children:"名称"}),e.jsx("th",{style:{...h},children:"类型"}),e.jsx("th",{style:{...h},children:"说明"})]})}),e.jsxs("tbody",{children:[n.map((s,i)=>e.jsxs("tr",{style:{borderBottom:"1px solid var(--border-subtle)"},children:[e.jsxs("td",{style:{...l,padding:"5px 12px"},children:[e.jsx("div",{style:{fontSize:11.5,color:"var(--foreground)"},children:s.name}),e.jsx("div",{style:{fontSize:10,color:"var(--foreground-muted)",fontFamily:"ui-monospace, monospace",marginTop:1},children:s.oid})]}),e.jsx("td",{style:{...l,fontSize:11,padding:"5px 12px",whiteSpace:"nowrap"},children:s.type}),e.jsx("td",{style:{...l,fontSize:11,padding:"5px 12px"},children:s.desc})]},i)),n.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:3,style:{...l,textAlign:"center",color:"var(--foreground-muted)"},children:"无匹配结果"})})]})]})})]})}const P=[{id:"json-api",title:"JSON 北向接口",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M16 18l6-6-6-6M8 6l-6 6 6 6"})})},{id:"sr-lsp",title:"SR 语言服务器",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"4 17 10 11 4 5"}),e.jsx("line",{x1:"12",y1:"19",x2:"20",y2:"19"})]})},{id:"sr-preview",title:"SR 文件预览",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2"}),e.jsx("path",{d:"M8 21h8M12 17v4"})]})},{id:"mib",title:"MIB 支持",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}),e.jsx("path",{d:"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"})]})}];function B(){const[r,o]=f.useState("readme"),[t,d]=f.useState(null),n=i=>{d(a=>a===i?null:i)},s=i=>({background:i?"rgba(255,255,255,0.10)":"none",border:"none",color:i?"var(--foreground)":"var(--foreground-muted)",cursor:"pointer",padding:5,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",transition:"color 0.1s, background 0.1s"});return e.jsxs("div",{style:{display:"flex",height:"100%",width:"100%",overflow:"hidden",background:"var(--background, #0a0b10)"},children:[e.jsxs("div",{style:{width:280,flexShrink:0,background:"var(--surface-2)",borderRight:"1px solid var(--border-subtle)",overflow:"hidden",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8px 0 16px",height:44,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-secondary)",userSelect:"none",flexShrink:0,borderBottom:"1px solid var(--border-subtle)"},children:[e.jsx("span",{children:"资源管理器"}),e.jsx("div",{style:{display:"flex",gap:2,marginLeft:"auto"},children:P.map(i=>e.jsx("button",{style:s(t===i.id),title:i.title,onClick:()=>n(i.id),onMouseEnter:a=>{t!==i.id&&(a.currentTarget.style.color="var(--foreground-secondary)")},onMouseLeave:a=>{t!==i.id&&(a.currentTarget.style.color="var(--foreground-muted)")},children:i.icon},i.id))})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"0 8px 0 12px",height:32,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",userSelect:"none",flexShrink:0,gap:6},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:{color:"var(--foreground-muted)",transform:"rotate(90deg)",flexShrink:0},fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})}),"vpd-main"]}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:v.map((i,a)=>e.jsx(m,{node:i,depth:0,selectedId:r,onSelect:c=>{o(c),d(null)}},a))})]}),t==="json-api"?e.jsx(k,{}):t==="sr-lsp"?e.jsx(M,{}):t==="sr-preview"?e.jsx(w,{}):t==="mib"?e.jsx(I,{}):e.jsx(C,{fileId:r})]})}export{B as ExplorerView};
