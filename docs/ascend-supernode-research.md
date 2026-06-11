# 昇腾超节点（Ascend SuperPoD）架构调研笔记

> 用途：`web-app/src/supernode/`（首页「昇腾超节点模型」3D 视图）的数据依据。
> 调研日期：2026-06-11。可信度按 **官方 > 论文 > 技术媒体 > 转载** 排序，建模只采用前三档数字。

---

## 1. 产品谱系

| 产品 | 规模 | 机柜 | 状态 |
|---|---|---|---|
| **Atlas 900 A3 SuperPoD**（云上名 CloudMatrix 384） | 384× 910C + 192× 鲲鹏 920 | 16 柜 = 12 计算 + 4 总线 | 已商用，300+ 套（HC2025 口径） |
| Atlas 950 SuperPoD | 8192× 950DT，每卡 UB 2TB/s | 160 柜 = 128 计算 + 32 互联，~1000㎡ | 2026 Q4 |
| Atlas 960 SuperPoD | 15488× 960，互联 34 PB/s | 220 柜 = 176 计算 + 44 通信 | 2027 Q4 |
| Atlas 850 / 850E | 风冷超节点服务器，可扩 768 卡 | 标准机房 | 850E 2026 Q4 |

互联协议：**灵衢 UnifiedBus**。HC2025 开放灵衢 2.0 规范（基础/固件/OS 参考设计三份），
社区官网 unifiedbus.com，配套文档亦托管于 openEuler（UB Service Core 白皮书）。

**3D 模型基线选择 Atlas 900 A3 / CM384**：唯一有论文级硬件细节披露的已商用机型。

## 2. 机柜级（全景视图依据）

- 16 柜 = **12 计算柜(47U) + 4 总线设备柜(47U)**，总线柜居中、计算柜两侧各 6（官方 + SemiAnalysis）。
- 机柜尺寸 **2250 × 600 × 1150 mm**；三相 380V AC（官方产品页）。
- 散热：**计算柜冷板液冷 + 总线设备柜风冷**（官方口径；"浸没式"为讹传）。
- 柜间 100% 光互联：约 **6912 个 400G OSFP 硅光 LPO**（scale-up 5376 + scale-out 1536，
  技术媒体估算口径；速率有 400G/800G 两种说法，无官方确认）。
- 系统总功耗约 **559 kW**（华为数据，经 Tom's Hardware 转述）。

## 3. 计算柜与节点（机柜/节点视图依据）

计算柜部件清单（官方 3D 展示页）：机框、**Manifold 液冷分集水器**、**Busbar 供电母排**、
电源框、柜管模块、电源转换板、**计算节点 ×4**、GE 管理交换机。

每计算节点（≈ Atlas 800T A3 同架构，风冷独立版为 10U / 442×447×920mm / 16.2kW max）：

- **8× 昇腾 910C**：双 die 封装（SIO 互联成 HiAM 模组），128 GB HBM / 3.2 TB/s，约 752 TFLOPS BF16/封装；
- **4× 鲲鹏 920 CPU**：全网状 NUMA，其中一颗挂**擎天卡（Qingtian DPU）**作为 VPC 出口；
- **7× 板载灵衢 L1 交换芯片**：每颗对应一个 UB 子平面，上行 448 GB/s（16×28GB/s）；
- **32× DDR5**（4 CPU × 8 通道；系统共 1536 根）；
- 对外光口 **56× 400G OSFP（UB scale-up）+ 8× 400G QSFP-DD（RoCE scale-out）**；
- 电源 6× 3.0kW（5+1 冗余，风冷版口径）。

## 4. 灵衢互联（拓扑视图依据）

三平面分离：

| 平面 | 参与者 | 带宽 | 用途 |
|---|---|---|---|
| **UB**（scale-up） | 384 NPU + 192 CPU | NPU 392 GB/s、CPU 160 GB/s（单向） | 超节点内全对等 |
| **RDMA**（scale-out） | 384 NPU | 400 Gbps/NPU（RoCE） | 跨超节点 |
| **VPC** | 每节点擎天卡 | 400 Gbps/节点 | 接数据中心网络 |

UB 平面 = **两层无阻塞 Clos**（非 full-mesh）：

- L1：节点板载 7 颗芯片（全系统 336 颗），7 个独立子平面；
- L2：**7 平面 × 16 颗 = 112 颗芯片**，分布于 4 个总线柜（转载口径约 56 台设备、每台 2 芯片）；
- L1↔L2 同平面一一映射；每颗 L2 芯片 **48 × 28 GB/s** 端口，1:1 无收敛；
- 实测：NPU↔NPU 节点内 167 GB/s / 跨节点 164 GB/s（衰减 <3%），单跳时延 200ns，跨节点时延增加 <1μs。

注意区分：arXiv 的 **UB-Mesh 论文（2503.20377）是 nD-FullMesh 研究路线**（柜内 86.7% 电缆），
与已商用 CM384 的 Clos 式全光 UB 平面是两条不同路径，建模时不要混用。

## 5. 展出实拍要点（用户提供照片）

- 机柜外观：黑色钣金 + **红色竖向饰条**，前面板深色单元 + 状态灯；
- 新一代（950 系）机柜刀片自上而下：**电源管理 → 资源管理刀片（UB Management Blade）→
  CPU 计算刀片 → NPU 计算刀片（标注 "8P FullMesh 全电互联"）**——CPU/NPU 分离刀片 + 正交背板；
- **灵衢互联设备 UnifiedBus LinkDevice**：液冷设计、128×800GE、全光互联；前面板成组圆形液冷快接头；
- Atlas 850E 抽屉式结构：PSU drawer / NPU drawer / CPU drawer 分层。

## 6. 主要来源

- arXiv:2506.12708 《Serving Large Language Models on Huawei CloudMatrix384》
- arXiv:2503.20377 《UB-Mesh》（路线参考，未用于建模数字）
- 华为企业业务：Atlas 900 A3 SuperPoD / Atlas 800T A3 产品页；官方 3D 展示页（info.support.huawei.com）
- hiascend.com 集群页 / MindCluster 亲和性文档（HiAM/HCCS 层次）
- 华为 HC2025 新闻稿与徐直军 keynote（灵衢 2.0、Atlas 950/960）
- SemiAnalysis、QSFPTEK、FiberMall、Tom's Hardware（机柜划分、光模块、功耗等估算口径）
- 灵衢社区 unifiedbus.com；openEuler UB Service Core 白皮书；openUBMC 论坛
