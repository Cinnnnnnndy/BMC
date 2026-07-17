import{a as v,j as e}from"./vendor-xyflow-D0FvDkLz.js";const _={readme:{lang:"markdown",content:`# vpd 重要产品数据（vital product data）

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
}`}},C={risercard:[{line:26,severity:"warn",token:"Connector_PCIE_1",msg:"I2cMux_Pca9545_PCA9545_1 总线下仅包含 1 个 Connector，PCIe Riser 通常挂载 2 个以上插槽，建议确认是否遗漏"},{line:45,severity:"info",token:"HealthStatus",msg:"HealthStatus 将通过北向接口暴露为 Redfish /Status/Health，建议枚举值与规范保持一致（0=OK, 1=Warning, 2=Critical）"}],hypercard:[{line:9,severity:"warn",token:"Chip_CPLD",msg:"I2c_1 总线同时挂载 3 个芯片（Chip_CPLD, Chip_BMC, Chip_FRU），建议评估总线带宽与时序裕量"},{line:16,severity:"error",token:"Address",msg:"Chip_CPLD 地址 0x26 (38) 与 Chip_BMC 0x20 (32) 同在 I2c_1 总线，请确认 7-bit 地址无冲突"}]},S={HealthStatus:{redfish:"/redfish/v1/Chassis/{id}#/Status/Health",snmp:"1.3.6.1.4.1.2011.2.235.1.1.4.1",ipmi:"SEL Event Data Byte1"},Address:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Id",snmp:"1.3.6.1.4.1.2011.2.235.1.1.3.1",ipmi:"SDR Sensor Number"},WriteTmout:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/WriteTimeout",snmp:"1.3.6.1.4.1.2011.2.235.1.1.5.1",ipmi:"N/A"},ReadTmout:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/ReadTimeout",snmp:"1.3.6.1.4.1.2011.2.235.1.1.5.2",ipmi:"N/A"},Type:{redfish:"/redfish/v1/Chassis/{id}#/ChassisType",snmp:"1.3.6.1.4.1.2011.2.235.1.1.1.1",ipmi:"FRU 0x01 Product Name"},OffsetWidth:{redfish:"/redfish/v1/Chassis/{id}/PCIeDevices/{dev}#/Oem/RegisterOffsetWidth",snmp:"1.3.6.1.4.1.2011.2.235.1.1.6.1",ipmi:"N/A"}};function k({tip:r}){const n=Math.min(r.x+14,window.innerWidth-330),c=r.y+18;if(r.kind==="diag"){const{entry:o}=r,d=o.severity==="error"?"#f87171":o.severity==="warn"?"#fbbf24":"#94a3b8",s=o.severity==="error"?"ERROR":o.severity==="warn"?"WARN":"INFO";return e.jsxs("div",{style:{position:"fixed",left:n,top:c,zIndex:9999,pointerEvents:"none",maxWidth:320,padding:"8px 12px",background:"#1a1a2e",border:`1px solid ${d}55`,borderRadius:6,boxShadow:"0 4px 20px rgba(0,0,0,0.55)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:5},children:[e.jsx("span",{style:{fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:3,background:d+"22",color:d},children:s}),e.jsx("span",{style:{fontSize:10.5,color:"#64748b"},children:"sr-language-server · 0.9.4"})]}),e.jsx("div",{style:{fontSize:12,color:"#e2e8f0",lineHeight:1.55},children:o.msg})]})}const{key:p,nb:t}=r;return e.jsxs("div",{style:{position:"fixed",left:n,top:c,zIndex:9999,pointerEvents:"none",width:310,padding:"8px 12px",background:"#1a1a2e",border:"1px solid rgba(79,110,247,0.35)",borderRadius:6,boxShadow:"0 4px 20px rgba(0,0,0,0.55)"},children:[e.jsxs("div",{style:{fontSize:10.5,color:"#64748b",marginBottom:7},children:["北向接口映射 · ",e.jsx("span",{style:{color:"#9cdcfe",fontFamily:"ui-monospace, monospace"},children:p})]}),[["Redfish",t.redfish,"#60a5fa"],["SNMP",t.snmp,"#a78bfa"],["IPMI",t.ipmi,"#34d399"]].map(([o,d,s])=>e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:4,alignItems:"flex-start"},children:[e.jsx("span",{style:{fontSize:10,color:s,fontWeight:700,width:42,flexShrink:0,paddingTop:1},children:o}),e.jsx("span",{style:{fontSize:10.5,color:"#94a3b8",fontFamily:"ui-monospace, monospace",wordBreak:"break-all",lineHeight:1.4},children:d})]},o))]})}function w(r,n,c,p,t,o){const d=r.match(/^(\s*)("([\w]+)")(\s*:)(.*)/);if(d){const[,s,a,u,y,g]=d,i=p?S[u]:void 0,l=c&&(n==null?void 0:n.token)===u,x=(n==null?void 0:n.severity)==="error"?"#f87171":"#fbbf24",f=g.trim().replace(/,$/,""),h=f==="{"||f==="["||f==="]"||f==="}"||f===","||f===""?"rgba(255,255,255,0.4)":/^-?\d/.test(f)?"#b5cea8":/^(true|false|null)$/.test(f)?"#569cd6":"#ce9178";return e.jsxs(e.Fragment,{children:[s,e.jsx("span",{style:{color:"#9cdcfe",textDecoration:l?`underline wavy ${x}`:i?"underline dotted rgba(148,163,184,0.38)":"none",textUnderlineOffset:"3px",cursor:i?"help":void 0},onMouseEnter:i?b=>t(u,i,b):void 0,onMouseLeave:i?o:void 0,children:a}),e.jsx("span",{style:{color:"rgba(255,255,255,0.35)"},children:y}),e.jsx("span",{style:{color:h},children:g})]})}if(c&&(n!=null&&n.token)){const s=`"${n.token}"`,a=r.indexOf(s);if(a>=0){const u=r.slice(0,a),y=r.slice(a,a+s.length),g=r.slice(a+s.length),i=n.severity==="error"?"#f87171":"#fbbf24";return e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{color:"rgba(255,255,255,0.5)"},children:u}),e.jsx("span",{style:{color:"#ce9178",textDecoration:`underline wavy ${i}`,textUnderlineOffset:"3px"},children:y}),e.jsx("span",{style:{color:"rgba(255,255,255,0.5)"},children:g})]})}}return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/("[\w\s\-/#$.]+")(\s*:)/g,'<span style="color:#9cdcfe">$1</span>$2').replace(/:\s*("([^"]*)")/g,(s,a)=>': <span style="color:#ce9178">'+a+"</span>").replace(/:\s*(-?\d+)/g,': <span style="color:#b5cea8">$1</span>').replace(/:\s*(true|false|null)/g,': <span style="color:#569cd6">$1</span>')}})}function M(r,n){if(n==="python")return e.jsx("span",{dangerouslySetInnerHTML:{__html:r.replace(/(#.*$)/,'<span style="color:#6a9955">$1</span>').replace(/\b(import|from|class|def|self|return|if|else|elif|for|in|and|or|not|pass|None|True|False|staticmethod)\b/g,'<span style="color:#569cd6">$1</span>').replace(/("[^"]*")/g,'<span style="color:#ce9178">$1</span>').replace(/('[^']*')/g,'<span style="color:#ce9178">$1</span>')}});if(n==="markdown"){if(r.startsWith("#"))return e.jsx("span",{style:{color:"#569cd6",fontWeight:600},children:r});if(r.startsWith("```"))return e.jsx("span",{style:{color:"#808080"},children:r});if(r.startsWith("【")||r.startsWith("##"))return e.jsx("span",{style:{color:"#4ec9b0"},children:r})}return r}const I=[{name:"vpd-main",type:"dir",children:[{name:"README.md",type:"file",fileId:"readme",lang:"md"},{name:"CHANGELOG.md",type:"file",fileId:"changelog",lang:"md"},{name:"conanfile.py",type:"file",fileId:"conan",lang:"py"},{name:"registry.py",type:"file",fileId:"registry",lang:"py"},{name:"SmcDfxInfo配置说明.md",type:"file",fileId:"smcdfx",lang:"md"},{name:"vendor",type:"dir",children:[{name:"openUBMC",type:"dir",children:[{name:"14100513_...023947.sr",type:"file",fileId:"risercard",lang:"sr"}]},{name:"Customer",type:"dir",children:[{name:"DPU",type:"dir",children:[{name:"14140130_HyperCard_0.sr",type:"file",fileId:"hypercard",lang:"sr"}]}]},{name:"Huawei",type:"dir",children:[{name:"Server",type:"dir",children:[{name:"Kunpeng",type:"dir",children:[{name:"BM320",type:"dir",children:[]}]}]},{name:"BMCSoC",type:"dir",children:[]},{name:"Nic",type:"dir",children:[]},{name:"TianChi",type:"dir",children:[]}]}]}]}];function P({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:r?e.jsx("path",{d:"M1.5 3.5h13l-1.5 9h-10L1.5 3.5zM1.5 3.5L4 1.5h5l1 2",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"}):e.jsx("path",{d:"M1.5 2.5h4l1.5 2H14.5v9h-13v-11z",stroke:"currentColor",strokeWidth:"1",strokeLinejoin:"round"})})}function B({lang:r}){const n=r==="py"?"#4ec9b0":r==="md"?"#89d7e9":r==="sr"?"#ce9178":"#cccccc";return e.jsxs("svg",{viewBox:"0 0 16 16",width:"14",height:"14",fill:"none",style:{flexShrink:0,marginTop:1},children:[e.jsx("path",{d:"M2 1.5h8l3.5 3.5V14.5H2V1.5z",stroke:n,strokeWidth:"1",strokeLinejoin:"round"}),e.jsx("path",{d:"M10 1.5V5H13.5",stroke:n,strokeWidth:"1"})]})}function T({open:r}){return e.jsx("svg",{viewBox:"0 0 16 16",width:"12",height:"12",fill:"none",style:{flexShrink:0,transform:r?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.12s",opacity:.5},children:e.jsx("path",{d:"M6 4l4 4-4 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}function j({node:r,depth:n,selectedId:c,onSelect:p}){var s;const[t,o]=v.useState(n<2),d=r.type==="file"&&r.fileId===c;return e.jsxs("div",{children:[e.jsxs("div",{onClick:()=>r.type==="dir"?o(a=>!a):r.fileId&&p(r.fileId),style:{display:"flex",alignItems:"center",gap:4,padding:`2px 8px 2px ${8+n*14}px`,cursor:"pointer",fontSize:12.5,color:d?"var(--foreground, #e8e8e8)":"var(--foreground-secondary, #9aa0b8)",background:d?"rgba(255,255,255,0.08)":"transparent",borderLeft:"2px solid transparent",userSelect:"none",lineHeight:"1.6",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},onMouseEnter:a=>{d||(a.currentTarget.style.background="rgba(255,255,255,0.04)")},onMouseLeave:a=>{d||(a.currentTarget.style.background="transparent")},children:[r.type==="dir"&&e.jsx(T,{open:t}),r.type==="dir"?e.jsx(P,{open:t}):e.jsx(B,{lang:r.lang}),e.jsx("span",{style:{overflow:"hidden",textOverflow:"ellipsis"},children:r.name})]}),r.type==="dir"&&t&&((s=r.children)==null?void 0:s.map((a,u)=>e.jsx(j,{node:a,depth:n+1,selectedId:c,onSelect:p},u)))]})}function R({fileId:r,lspActive:n,nbActive:c}){var i;const[p,t]=v.useState(null);if(!r)return e.jsxs("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--foreground-muted, #5a6280)",fontSize:13,flexDirection:"column",gap:10},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"32",height:"32",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("path",{d:"M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2"})]}),"选择文件以查看内容"]});const o=_[r];if(!o)return null;const d=r==="risercard"?"14100513_00000001040302023947.sr":r==="hypercard"?"14140130_HyperCard_0.sr":r==="readme"?"README.md":r==="changelog"?"CHANGELOG.md":r==="conan"?"conanfile.py":r==="registry"?"registry.py":"SmcDfxInfo配置说明.md",s=o.content.split(`
`),a=o.lang==="json",u={};n&&(C[r]??[]).forEach(l=>{u[l.line]=l});const y=(l,x,f)=>{t({kind:"nb",x:f.clientX,y:f.clientY,key:l,nb:x})},g=()=>t(null);return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background, #0a0b10)",position:"relative"},children:[e.jsxs("div",{style:{padding:"6px 14px",fontSize:11.5,color:"var(--foreground-muted)",background:"var(--surface-1, #0c0d14)",display:"flex",alignItems:"center",gap:8,flexShrink:0},children:[e.jsx("span",{style:{fontFamily:"ui-monospace, monospace",color:"var(--foreground)",fontSize:12},children:d}),n&&(((i=C[r])==null?void 0:i.length)??0)>0&&e.jsx("span",{style:{marginLeft:4,fontSize:10.5,color:"#fbbf24"},children:C[r].filter(l=>l.severity==="error").length>0?`✗ ${C[r].filter(l=>l.severity==="error").length} error`:`⚠ ${C[r].length} warning`}),e.jsx("span",{style:{marginLeft:"auto",fontSize:10.5},children:"vpd-main · openUBMC Studio"})]}),e.jsxs("div",{style:{flex:1,overflow:"auto",display:"flex",fontFamily:'ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace',fontSize:12.5,lineHeight:1.7},children:[e.jsx("div",{style:{padding:"10px 0",flexShrink:0,userSelect:"none",borderRight:"1px solid var(--border-subtle)",background:"var(--background)"},children:s.map((l,x)=>{const f=x+1,h=u[f],b=(h==null?void 0:h.severity)==="error"?"#f87171":(h==null?void 0:h.severity)==="warn"?"#fbbf24":"#94a3b8";return e.jsxs("div",{style:{display:"flex",alignItems:"center",height:"1.7em",paddingRight:4,paddingLeft:8},children:[h&&n?e.jsx("span",{style:{fontSize:11,color:b,width:14,textAlign:"center",flexShrink:0},children:h.severity==="error"?"✗":h.severity==="warn"?"⚠":"ℹ"}):e.jsx("span",{style:{width:14,flexShrink:0}}),e.jsx("span",{style:{fontSize:11,color:"var(--foreground-muted)",textAlign:"right",minWidth:28,display:"inline-block"},children:f})]},x)})}),e.jsx("pre",{style:{margin:0,padding:"10px 0",flex:1,overflow:"visible",color:"var(--foreground, #d4d4d4)",whiteSpace:"pre"},children:s.map((l,x)=>{const f=x+1,h=u[f],b=h&&n?h.severity==="error"?"rgba(248,113,113,0.06)":h.severity==="warn"?"rgba(251,191,36,0.06)":"rgba(148,163,184,0.05)":void 0;return e.jsx("div",{style:{minHeight:"1.7em",paddingLeft:18,paddingRight:18,background:b},onMouseEnter:h&&n?m=>t({kind:"diag",x:m.clientX,y:m.clientY,entry:h}):void 0,onMouseLeave:h&&n?()=>t(m=>(m==null?void 0:m.kind)==="diag"?null:m):void 0,children:a?w(l,h,n,c,y,g):M(l,o.lang)},x)})})]}),p&&e.jsx(k,{tip:p})]})}function W(){const r=[{id:"Anchor",x:120,y:10,label:"Anchor",kind:"anchor"},{id:"H0",x:120,y:72,label:"Hisport_0",kind:"bus"},{id:"Pca",x:120,y:134,label:"Pca9545",kind:"chip"},{id:"Mux4",x:20,y:200,label:"Mux_4",kind:"bus"},{id:"Mux1",x:120,y:200,label:"Mux_1",kind:"bus"},{id:"Mux2",x:220,y:200,label:"Mux_2",kind:"bus"},{id:"Io",x:0,y:266,label:`Pca9555
IO`,kind:"chip"},{id:"MCU",x:60,y:266,label:`Chip
MCU1`,kind:"chip"},{id:"P1",x:120,y:266,label:`Conn
PCIE1`,kind:"connector"},{id:"P2",x:220,y:266,label:`Conn
PCIE2`,kind:"connector"},{id:"Sw",x:60,y:332,label:"McuSw",kind:"bus"},{id:"Eeprom",x:60,y:398,label:`Eeprom
IEU`,kind:"chip"}],n=[["Anchor","H0"],["H0","Pca"],["Pca","Mux4"],["Pca","Mux1"],["Pca","Mux2"],["Mux4","Io"],["Mux4","MCU"],["Mux1","P1"],["Mux2","P2"],["MCU","Sw"],["Sw","Eeprom"]],c={anchor:"#64748b",bus:"#4f6ef7",chip:"#22c55e",connector:"#f59e0b"},p=Object.fromEntries(r.map(t=>[t.id,t]));return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background)"},children:[e.jsx("div",{style:{padding:"8px 16px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,background:"var(--surface-1)"},children:"SR 文件预览 — 14100513_...023947.sr"}),e.jsx("div",{style:{padding:"6px 12px",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,display:"flex",gap:14},children:Object.entries(c).map(([t,o])=>e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:4,fontSize:10.5,color:"var(--foreground-muted)"},children:[e.jsx("span",{style:{width:8,height:8,borderRadius:2,background:o,display:"inline-block"}}),t]},t))}),e.jsx("div",{style:{flex:1,overflow:"auto",padding:12},children:e.jsxs("svg",{width:"300",height:"450",style:{display:"block"},children:[n.map(([t,o],d)=>{const s=p[t],a=p[o];return!s||!a?null:e.jsx("line",{x1:s.x+30,y1:s.y+28,x2:a.x+30,y2:a.y,stroke:"rgba(255,255,255,0.12)",strokeWidth:"1"},d)}),r.map(t=>e.jsxs("g",{children:[e.jsx("rect",{x:t.x,y:t.y,width:60,height:28,rx:4,fill:c[t.kind]+"22",stroke:c[t.kind],strokeWidth:"1"}),t.label.split(`
`).map((o,d)=>e.jsx("text",{x:t.x+30,y:t.y+11+d*11,textAnchor:"middle",fontSize:"8.5",fill:c[t.kind],children:o},d))]},t.id))]})})]})}function L(){const[r,n]=v.useState(""),c=[{oid:"1.3.6.1.4.1.2011.2.235.1.1.1.1",name:"bmcProductName",type:"String",desc:"产品型号"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.1.2",name:"bmcFirmwareVersion",type:"String",desc:"固件版本"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.2.1",name:"bmcBoardCount",type:"Integer",desc:"在线板卡总数"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.3.1",name:"bmcSensorValue",type:"Gauge32",desc:"传感器当前读数"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.4.1",name:"bmcHealthStatus",type:"Integer",desc:"0=OK, 1=Warn, 2=Crit"},{oid:"1.3.6.1.4.1.2011.2.235.2.1.1",name:"bmcHardwareTrap",type:"Trap",desc:"硬件故障告警"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.5.1",name:"bmcWriteTimeout",type:"Integer",desc:"写超时时间 (ms)"},{oid:"1.3.6.1.4.1.2011.2.235.1.1.5.2",name:"bmcReadTimeout",type:"Integer",desc:"读超时时间 (ms)"}],p=r.toLowerCase(),t=p?c.filter(s=>s.name.toLowerCase().includes(p)||s.oid.includes(p)||s.desc.includes(p)):c,o={padding:"5px 12px",fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",color:"var(--foreground-muted)",background:"var(--surface-2)",borderBottom:"1px solid var(--border-subtle)",textAlign:"left"},d={padding:"5px 12px",fontSize:11.5,color:"var(--foreground-secondary)",borderBottom:"1px solid var(--border-subtle)",verticalAlign:"top"};return e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--background)"},children:[e.jsx("div",{style:{padding:"8px 16px",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,background:"var(--surface-1)"},children:"HUAWEI-BMC-MIB v2"}),e.jsx("div",{style:{padding:"6px 10px",borderBottom:"1px solid var(--border-subtle)",flexShrink:0,background:"var(--surface-1)"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,background:"var(--surface-2)",borderRadius:6,padding:"4px 8px",border:"1px solid var(--border-subtle)"},children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",style:{color:"var(--foreground-muted)",flexShrink:0},children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.35-4.35"})]}),e.jsx("input",{value:r,onChange:s=>n(s.target.value),placeholder:"搜索 OID / 名称...",style:{flex:1,background:"none",border:"none",outline:"none",fontSize:12,color:"var(--foreground)",padding:0}})]})}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:e.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{style:o,children:"名称"}),e.jsx("th",{style:o,children:"类型"}),e.jsx("th",{style:o,children:"说明"})]})}),e.jsxs("tbody",{children:[t.map((s,a)=>e.jsxs("tr",{children:[e.jsxs("td",{style:d,children:[e.jsx("div",{style:{fontSize:11.5,color:"var(--foreground)"},children:s.name}),e.jsx("div",{style:{fontSize:10,color:"var(--foreground-muted)",fontFamily:"ui-monospace, monospace",marginTop:1},children:s.oid})]}),e.jsx("td",{style:{...d,whiteSpace:"nowrap"},children:s.type}),e.jsx("td",{style:d,children:s.desc})]},a)),!t.length&&e.jsx("tr",{children:e.jsx("td",{colSpan:3,style:{...d,textAlign:"center",color:"var(--foreground-muted)"},children:"无匹配结果"})})]})]})})]})}const H=[{id:"nb",title:"JSON 北向接口 (悬停属性查看映射)",icon:e.jsx("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M16 18l6-6-6-6M8 6l-6 6 6 6"})})},{id:"lsp",title:"SR 语言服务器 (内联诊断)",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"4 17 10 11 4 5"}),e.jsx("line",{x1:"12",y1:"19",x2:"20",y2:"19"})]})},{id:"sr-preview",title:"SR 文件预览",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2"}),e.jsx("path",{d:"M8 21h8M12 17v4"})]})},{id:"mib",title:"MIB 支持",icon:e.jsxs("svg",{viewBox:"0 0 24 24",width:"13",height:"13",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}),e.jsx("path",{d:"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"})]})}];function D(){const[r,n]=v.useState("readme"),[c,p]=v.useState(!1),[t,o]=v.useState(!1),[d,s]=v.useState(null),a=i=>s(l=>l===i?null:i),u=i=>({background:i?"rgba(255,255,255,0.10)":"none",border:"none",color:i?"var(--foreground)":"var(--foreground-muted)",cursor:"pointer",padding:5,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",transition:"color 0.1s, background 0.1s"}),y=i=>i==="lsp"?c:i==="nb"?t:d===i,g=i=>{i==="lsp"?p(l=>!l):i==="nb"?o(l=>!l):a(i)};return e.jsxs("div",{style:{display:"flex",height:"100%",width:"100%",overflow:"hidden",background:"var(--background)"},children:[e.jsxs("div",{style:{width:280,flexShrink:0,background:"var(--surface-2)",borderRight:"1px solid var(--border-subtle)",overflow:"hidden",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 8px 0 16px",height:44,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-secondary)",userSelect:"none",flexShrink:0,borderBottom:"1px solid var(--border-subtle)"},children:[e.jsx("span",{children:"资源管理器"}),e.jsx("div",{style:{display:"flex",gap:2},children:H.map(i=>e.jsx("button",{style:u(y(i.id)),title:i.title,onClick:()=>g(i.id),onMouseEnter:l=>{y(i.id)||(l.currentTarget.style.color="var(--foreground-secondary)")},onMouseLeave:l=>{y(i.id)||(l.currentTarget.style.color="var(--foreground-muted)")},children:i.icon},i.id))})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"0 8px 0 12px",height:32,font:"500 11px/1.2 var(--font-sans)",textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--foreground-muted)",userSelect:"none",flexShrink:0,gap:6},children:[e.jsx("svg",{viewBox:"0 0 24 24",width:"10",height:"10",style:{transform:"rotate(90deg)",flexShrink:0},fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",children:e.jsx("path",{d:"m9 18 6-6-6-6"})}),"vpd-main"]}),e.jsx("div",{style:{flex:1,overflowY:"auto"},children:I.map((i,l)=>e.jsx(j,{node:i,depth:0,selectedId:r,onSelect:x=>{n(x),s(null)}},l))})]}),d==="sr-preview"?e.jsx(W,{}):d==="mib"?e.jsx(L,{}):e.jsx(R,{fileId:r,lspActive:c,nbActive:t})]})}export{D as ExplorerView};
