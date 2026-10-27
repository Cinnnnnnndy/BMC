import{a as v,j as e}from"./vendor-xyflow-D0FvDkLz.js";const k={readme:{lang:"markdown",content:`# vpd 重要产品数据（vital product data）

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
【解读】白牌定制的配置信息，包括DPU等特殊硬件`},changelog:{lang:"markdown",content:`# Changelog

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
修复拔插电源线产生电源误告警`},conan:{lang:"python",content:`# Copyright (c) 2024 Huawei Technologies Co., Ltd.
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
                dst=os.path.join(self.package_folder, "opt/bmc/profile_schema/product"))`},registry:{lang:"python",content:`# Copyright (c) 2024 Huawei Technologies Co., Ltd.
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
        return severity_str[int(severity_index)]`},smcdfx:{lang:"markdown",content:`# SmcDfxInfo 类定义说明

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
}`}},_={risercard:[{line:26,severity:"warn",token:"Connector_PCIE_1",msg:"I2cMux_Pca9545_PCA9545_1 总线下仅包含 1 个 Connector，PCIe Riser 通常挂载 2 个以上插槽，建议确认是否遗漏"},{line:45,severity:"info",token:"HealthStatus",msg:"HealthStatus 将通过北向接口暴露为 Redfish /Status/Health，建议枚举值与规范保持一致（0=OK, 1=Warning, 2=Critical）"}],hypercard:[{line:9,severity:"warn",token:"Chip_CPLD",msg:"I2c_1 总线同时挂载 3 个芯片（Chip_CPLD, Chip_BMC, Chip_FRU），建议评估总线带宽与时序裕量"},{line:16,severity:"error",token:"Address",msg:"Chip_CPLD 地址 0x26 (38) 与 Chip_BMC 0x20 (32) 同在 I2c_1 总线，请确认 7-bit 地址无冲突"}]},w={HealthStatus:{redfish:"/redfish/v1/Chassis/{id}#/Status/Health",snmp:"1.3.6.1.4.1.2011.2.235.1.1.4.1",ipmi:"SEL Event Data Byte1"},Address:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Id",snmp:"1.3.6.1.4.1.2011.2.235.1.1.3.1",ipmi:"SDR Sensor Number"},WriteTmout:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/WriteTimeout",snmp:"1.3.6.1.4.1.2011.2.235.1.1.5.1",ipmi:"N/A"},ReadTmout:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/ReadTimeout",snmp:"1.3.6.1.4.1.2011.2.235.1.1.5.2",ipmi:"N/A"},Type:{redfish:"/redfish/v1/Chassis/{id}#/ChassisType",snmp:"1.3.6.1.4.1.2011.2.235.1.1.1.1",ipmi:"FRU 0x01 Product Name"},OffsetWidth:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/RegisterOffsetWidth",snmp:"1.3.6.1.4.1.2011.2.235.1.1.6.1",ipmi:"N/A"}};function M({tip:r}){const n=Math.min(r.x+14,window.innerWidth-330),s=r.y+18;if(r.kind==="diag"){const{entry:i}=r,l=i.severity==="error"?"#f87171":i.severity==="warn"?"#fbbf24":"#94a3b8",p=i.severity==="error"?"ERROR":i.severity==="warn"?"WARN":"INFO";return e.jsxs("div",{style:{position:"fixed",left:n,top:s,zIndex:9999,pointerEvents:"none",maxWidth:320,padding:"8px 12px",background:"#1a1a2e",border:`1px solid ${l}55`,borderRadius:6,boxShadow:"0 4px 20px rgba(0,0,0,0.55)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:5},children:[e.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:3,background:l+"22",color:l},children:p}),e.jsx("span",{style:{fontSize:10.5,color:"#64748b"},children:"sr-language-server · 0.9.4"})]}),e.jsx("div",{style:{fontSize:12,color:"#e2e8f0",lineHeight:1.55},children:i.msg})]})}const{key:h,nb:a}=r;return e.jsxs("div",{style:{position:"fixed",left:n,top:s,zIndex:9999,pointerEvents:"none",width:310,padding:"8px 12px",background:"#1a1a2e",border:"1px solid rgba(79,110,247,0.35)",borderRadius:6,boxShadow:"0 4px 20px rgba(0,0,0,0.55)"},children:[e.jsxs("div",{style:{fontSize:10.5,color:"#64748b",marginBottom:7},children:["北向接口映射 · ",e.jsx("span",{style:{color:"#9cdcfe",fontFamily:"ui-monospace, monospace"},children:h})]}),[["Redfish",a.redfish,"#60a5fa"],["SNMP",a.snmp,"#a78bfa"],["IPMI",a.ipmi,"#34d399"]].map(([i,l,p])=>e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:4,alignItems:"flex-start"},children:[e.jsx("span",{style:{fontSize:10,color:p,fontWeight:700,width:42,flexShrink:0,paddingTop:1},children:i}),e.jsx("span",{style:{fontSize:10.5,color:"#94a3b8",fontFamily:"ui-monospace, monospace",wordBreak:"break-all",lineHeight:1.4},children:l})]},i))]})}function T(r,n,s,h,a,i){const l=r.match(/^(\s*)("([\w]+)")(\s*:)(.*)/);if(l){const[,p,o,u,m,t]=l,d=h?w[u]:void 0,g=s&&(n==null?void 0:n.token)===u,x=(n==null?void 0:n.severity)==="error"?"#f87171":"#fbbf24",f=t.trim().replace(/,$/,""),c=f==="{"||f==="["||f==="]"||f==="}"||f===","||f===""?"rgba(255,255,255,0.4)":/^-?\d/.test(f)?"#b5cea8":/^(true|false|null)$/.test(f)?"#569cd6":"#ce9178";return e.jsxs(e.Fragment,{children:[p,e.jsx("span",{style:{color:"#9cdcfe",textDecoration:g?`underline wavy ${x}`:d?"underline dotted rgba(148,163,184,0.38)":"none",textUnderlineOffset:"3px",cursor:d?"help":void 0},onMouseEnter:d?C=>a(u,d,C):void 0,onMouseLeave:d?i:void 0,children:o}),e.jsx("span",{style:{color:"rgba(255,255,255,0.35)"},children:m}),e.jsx("span",{style:{color:c},children:t})]})}if(s&&(n!=null&&n.token)){const p=`"${n.token}"`,o=r.indexOf(p);if(o>=0){const u=r.slice(0,o),m=r.slice(o,o+p.length),t=r.slice(o+p.length),d=n.severity==="error"?"#f87171":"#fbbf24";return e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{color:"rgba(255,255,255,0.5)"},children:u}),e.jsx("span",{style:{color:"#ce9178",textDecoration:`underline wavy ${d}`,textUnderlineOffset:"3px"},children:m}),e.jsx("span",{style:{color:"rgba(255,255,255,0.5)"},children:t})]})}}return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/("[\w\s\-/#$.]+")(\s*:)/g,'<span style="color:#9cdcfe">$1</span>$2').replace(/:\s*("([^"]*)")/g,(p,o)=>': <span style="color:#ce9178">'+o+"</span>").replace(/:\s*(-?\d+)/g,': <span style="color:#b5cea8">$1</span>').replace(/:\s*(true|false|null)/g,': <span style="color:#569cd6">$1</span>')}})}function I(r,n){if(n==="python")return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/(#.*$)/,'<span style="color:#6a9955">$1</span>').replace(/\b(import|from|class|def|self|return|if|else|elif|for|in|and|or|not|pass|None|True|False|staticmethod)\b/g,'<span style="color:#569cd6">$1</span>').replace(/("[^"]*")/g,'<span style="color:#ce9178">$1</span>').replace(/('[^']*')/g,'<span style="color:#ce9178">$1</span>')}});if(n==="markdown"){if(r.startsWith("#"))return e.jsx("span",{style:{color:"#569cd6",fontWeight:600},children:r});if(r.startsWith("```"))return e.jsx("span",{style:{color:"#808080"},children:r});if(r.startsWith("【")||r.startsWith("##"))return e.jsx("span",{style:{color:"#4ec9b0"},children:r})}return r}const P=[{name:"vpd-main",type:"dir",children:[{name:"README.md",type:"file",fileId:"readme",lang:"md"},{name:"CHANGELOG.md",type:"file",fileId:"changelog",lang:"md"},{name:"conanfile.py",type:"file",fileId:"conan",lang:"py"},{name:"registry.py",type:"file",fileId:"registry",lang:"py"},{name:"SmcDfxInfo配置说明.md",type:"file",fileId:"smcdfx",lang:"md"},{name:"vendor",type:"dir",children:[{name:"openUBMC",type:"dir",children:[{name:"14100513_...023947.sr",type:"file",fileId:"risercard",lang:"sr"}]},{name:"Customer",type:"dir",children:[{name:"DPU",type:"dir",children:[{name:"14140130_HyperCard_0.sr",type:"file",fileId:"hypercard",lang:"sr"}]}]},{name:"Huawei",type:"dir",children:[{name:"Server",type:"dir",children:[{name:"Kunpeng",type:"dir",children:[{name:"BM320",type:"dir",children:[]}]}]},{name:"BMCSoC",type:"dir",children:[]},{name:"Nic",type:"dir",children:[]},{name:"TianChi",type:"dir",children:[]}]}]}]}];function R({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:r?e.jsx("path",{d:"M1.5 3.5h13l-1.5 9h-10L1.5 3.5zM1.5 3.5L4 1.5h5l1 2",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"}):e.jsx("path",{d:"M1.5 2.5h4l1.5 2H14.5v9h-13v-11z",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"})})}function B({lang:r}){const n=r==="py"?"#4ec9b0":r==="md"?"#89d7e9":r==="sr"?"#ce9178":"#cccccc";return e.jsxs("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:[e.jsx("path",{d:"M2 1.5h8l3.5 3.5V14.5H2V1.5z",stroke:n,strokeWidth:"1",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 1.5V5H13.5",stroke:n,strokeWidth:"1"})]})}function W({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"12",height:"12",fill:"none",style:{flexShrink:0,transform:r?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.12s",opacity:.5},children:e.jsx("path",{d:"M6 4l4 4-4 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}function S({node:r,depth:n,selectedId:s,onSelect:h}){var p;const[a,i]=v.useState(n<2),l=r.type==="file"&&r.fileId===s;return e.jsxs("div",{children:[e.jsxs("div",{onClick:()=>r.type==="dir"?i(o=>!o):r.fileId&&h(r.fileId),style:{display:"flex",alignItems:"center",gap:4,padding:`2px 8px 2px ${8+n*14}px`,cursor:"pointer",fontSize:12.5,color:l?"var(--foreground, #e8e8e8)":"var(--foreground-secondary, #9aa0b8)",background:l?"rgba(255,255,255,0.08)":"transparent",borderLeft:"2px solid transparent",userSelect:"none",lineHeight:"1.6",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},onMouseEnter:o=>{l||(o.currentTarget.style.background="rgba(255,255,255,0.04)")},onMouseLeave:o=>{l||(o.currentTarget.style.background="transparent")},children:[r.type==="dir"&&e.jsx(W,{open:a}),r.type==="dir"?e.jsx(R,{open:a}):e.jsx(B,{lang:r.lang}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:r.name})]}),r.type==="dir"&&a&&((p=r.children)==null?void 0:p.map((o,u)=>e.jsx(S,{node:o,depth:n+1,selectedId:s,onSelect:h},u)))]})}function L({fileId:r,lspActive:n,nbActive:s}){var d;const[h,a]=v.useState(null);if(!r)return e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--foreground-muted, #5a6280)",fontSize:13,flexDirection:"column",gap:10},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("path",{d:"M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"})]}),"选择文件以查看内容"]});const i=k[r];if(!i)return null;const l=r==="risercard"?"14100513_00000001040302023947.sr":r==="hypercard"?"14140130_HyperCard_0.sr":r==="readme"?"README.md":r==="changelog"?"CHANGELOG.md":r==="conan"?"conanfile.py":r==="registry"?"registry.py":"SmcDfxInfo配置说明.md",p=i.content.split(`
`),o=i.lang==="json",u={};n&&(_[r]??[]).forEach(g=>{u[g.line]=g});const m=(g,x,f)=>{a({kind:"nb",x:f.clientX,y:f.clientY,key:g,nb:x})},t=()=>a(null);return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background, #0a0b10)",position:"relative"},children:[e.jsxs("div",{style:{padding:"6px 14px",fontSize:11.5,color:"var(--foreground-muted)",background:"var(--surface-1, #0c0d14)",display:"flex",alignItems:"center",gap:8,flexShrink:0},children:[e.jsx("span",{style:{fontFamily:"ui-monospace, monospace",color:"var(--foreground)",fontSize:12},children:l}),n&&(((d=_[r])==null?void 0:d.length)??0)>0&&e.jsx("span",{style:{marginLeft:4,fontSize:10.5,color:"#fbbf24"},children:_[r].filter(g=>g.severity==="error").length>0?`✗ ${_[r].filter(g=>g.severity==="error").length} error`:`⚠ ${_[r].length} warning`}),e.jsx("span",{style:{marginLeft:"auto",fontSize:10.5},children:"vpd-main · openUBMC Studio"})]}),e.jsxs("div",{style:{flex:1,overflow:"auto",display:"flex",fontFamily:'ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace',fontSize:12.5,lineHeight:1.7},children:[e.jsx("div",{style:{padding:"10px 0",flexShrink:0,userSelect:"none",borderRight:"1px solid var(--border-subtle)",background:"var(--background)"},children:p.map((g,x)=>{const f=x+1,c=u[f],C=(c==null?void 0:c.severity)==="error"?"#f87171":(c==null?void 0:c.severity)==="warn"?"#fbbf24":"#94a3b8";return e.jsxs("div",{style:{display:"flex",alignItems:"center",height:"1.7em",paddingRight:4,paddingLeft:8},children:[c&&n?e.jsx("span",{style:{fontSize:11,color:C,width:14,textAlign:"center",flexShrink:0},children:c.severity==="error"?"✗":c.severity==="warn"?"⚠":"ℹ"}):e.jsx("span",{style:{width:14,flexShrink:0}}),e.jsx("span",{style:{fontSize:11,color:"var(--foreground-muted)",textAlign:"right",minWidth:28,display:"inline-block"},children:f})]},x)})}),e.jsx("pre",{style:{margin:0,padding:"10px 0",flex:1,overflow:"visible",color:"var(--foreground, #d4d4d4)",whiteSpace:"pre"},children:p.map((g,x)=>{const f=x+1,c=u[f],C=c&&n?c.severity==="error"?"rgba(248,113,113,0.06)":c.severity==="warn"?"rgba(251,191,36,0.06)":"rgba(148,163,184,0.05)":void 0;return e.jsx("div",{style:{minHeight:"1.7em",paddingLeft:18,paddingRight:18,background:C},onMouseEnter:c&&n?y=>a({kind:"diag",x:y.clientX,y:y.clientY,entry:c}):void 0,onMouseLeave:c&&n?()=>a(y=>(y==null?void 0:y.kind)==="diag"?null:y):void 0,children:o?T(g,c,n,s,m,t):I(g,i.lang)},x)})})]}),h&&e.jsx(M,{tip:h})]})}const D=[{id:"nb",title:"JSON 北向接口 (悬停属性查看映射)",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M16 18l6-6-6-6M8 6l-6 6 6 6"})})},{id:"lsp",title:"SR 语言服务器 (内联诊断)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"4 17 10 11 4 5"}),e.jsx("line",{x1:"12",y1:"19",x2:"20",y2:"19"})]})}];function j({title:r,defaultOpen:n=!0,action:s,children:h}){const[a,i]=v.useState(n);return e.jsxs("div",{style:{flexShrink:0,borderTop:"1px solid var(--border-subtle)",background:"var(--surface-2)",display:"flex",flexDirection:"column",maxHeight:"42%"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,height:30,padding:"0 6px 0 12px",flexShrink:0,userSelect:"none",cursor:"pointer"},onClick:()=>i(l=>!l),children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:{transform:a?"rotate(90deg)":"none",flexShrink:0,opacity:.55},fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})}),e.jsx("span",{style:{flex:1,font:"600 11px/1.2 var(--font-sans)",letterSpacing:".06em",textTransform:"uppercase",color:"var(--foreground-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r}),s]}),a&&e.jsx("div",{style:{overflowY:"auto",padding:"2px 12px 12px"},children:h})]})}function H({label:r,onClick:n,title:s}){return e.jsx("button",{onClick:n,title:s,style:{padding:"5px 11px",borderRadius:100,border:"none",background:"rgba(255,255,255,0.06)",cursor:"pointer",fontFamily:"inherit",fontSize:11.5,fontWeight:600,color:"rgba(255,255,255,0.82)",transition:"background .15s"},onMouseEnter:h=>{h.currentTarget.style.background="rgba(255,255,255,0.12)"},onMouseLeave:h=>{h.currentTarget.style.background="rgba(255,255,255,0.06)"},children:r})}const A=[{group:"传感器",items:[{name:"TMP112 温度 Scanner",open:"sensor"},{name:"ADC 电压采样",open:"sensor"}]},{group:"事件",items:[{name:"CPU 过温事件",open:"event"},{name:"电源掉电告警",open:"event"}]},{group:"拓扑",items:[{name:"I2C Mux · PCA9545",open:"topology"},{name:"Riser Card",open:"topology"}]}];function E({onOpenView:r}){return e.jsx(j,{title:"模版浏览器",defaultOpen:!1,children:A.map(n=>e.jsxs("section",{style:{marginBottom:9},children:[e.jsx("div",{style:{fontSize:10.5,fontWeight:600,color:"rgba(255,255,255,0.35)",marginBottom:6},children:n.group}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:6},children:n.items.map(s=>e.jsx(H,{label:s.name,title:"从模版新建",onClick:()=>r(s.open)},s.name))})]},n.group))})}const b=[{time:"14:32",text:"修改 RiserCard I2C 拓扑"},{time:"11:08",text:"CSR 全量校验通过 · 0 error"},{time:"昨天",text:"新增 CPU0 过温事件"},{time:"3 天前",text:"修复 PCA9545 地址冲突"}];function O(){return e.jsx(j,{title:"Timeline",defaultOpen:!1,children:b.map((r,n)=>e.jsxs("div",{style:{display:"flex",gap:8,padding:"6px 0",borderBottom:n<b.length-1?"1px solid rgba(255,255,255,0.06)":"none"},children:[e.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,0.28)",flexShrink:0,marginTop:5}}),e.jsxs("div",{style:{minWidth:0,flex:1},children:[e.jsx("div",{style:{fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.35},children:r.text}),e.jsx("div",{style:{fontSize:10.5,color:"rgba(255,255,255,0.38)",marginTop:1},children:r.time})]})]},n))})}function N({onOpenView:r,onRunAgent:n}={}){const[s,h]=v.useState("readme"),[a,i]=v.useState(!1),[l,p]=v.useState(!1),o=t=>({background:t?"rgba(255,255,255,0.10)":"none",border:"none",color:t?"var(--foreground)":"var(--foreground-muted)",cursor:"pointer",padding:5,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",transition:"color 0.1s, background 0.1s"}),u=t=>t==="lsp"?a:l,m=t=>{t==="lsp"?i(d=>!d):p(d=>!d)};return e.jsxs("div",{style:{display:"flex",height:"100%",width:"100%",overflow:"hidden",background:"var(--background)"},children:[e.jsxs("div",{style:{width:280,flexShrink:0,background:"var(--surface-2)",borderRight:"1px solid var(--border-subtle)",overflow:"hidden",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8px 0 16px",height:44,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-secondary)",userSelect:"none",flexShrink:0,borderBottom:"1px solid var(--border-subtle)"},children:[e.jsx("span",{children:"资源管理器"}),e.jsx("div",{style:{display:"flex",gap:2},children:D.map(t=>e.jsx("button",{style:o(u(t.id)),title:t.title,onClick:()=>m(t.id),onMouseEnter:d=>{u(t.id)||(d.currentTarget.style.color="var(--foreground-secondary)")},onMouseLeave:d=>{u(t.id)||(d.currentTarget.style.color="var(--foreground-muted)")},children:t.icon},t.id))})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"0 8px 0 12px",height:32,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",userSelect:"none",flexShrink:0,gap:6},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:{transform:"rotate(90deg)",flexShrink:0},fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})}),"vpd-main"]}),e.jsx("div",{style:{flex:1,overflowY:"auto",minHeight:60},children:P.map((t,d)=>e.jsx(S,{node:t,depth:0,selectedId:s,onSelect:h},d))}),e.jsx(E,{onOpenView:t=>r==null?void 0:r(t)}),e.jsx(O,{})]}),e.jsx(L,{fileId:s,lspActive:a,nbActive:l})]})}export{N as ExplorerView};
