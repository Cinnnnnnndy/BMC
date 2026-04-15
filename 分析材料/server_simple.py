"""
openUBMC Server Hardware - 简化版
Blender 4.5 LTS Intel Mac
去掉 Collection 管理，直接建模，避免 API 兼容问题
"""

import bpy
import math

# ── 清空场景 ──────────────────────────────────────────────
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for mat in bpy.data.materials:
    bpy.data.materials.remove(mat)

# ── 材质工厂 ──────────────────────────────────────────────
def make_mat(name, r, g, b):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.4
    bsdf.inputs["Roughness"].default_value = 0.5
    return mat

MAT = {
    "chassis":  make_mat("M_Chassis",  0.72, 0.72, 0.68),
    "board":    make_mat("M_Board",    0.18, 0.48, 0.22),
    "cpu":      make_mat("M_CPU",      0.60, 0.55, 0.45),
    "dimm":     make_mat("M_DIMM",     0.20, 0.35, 0.70),
    "storage":  make_mat("M_Storage",  0.28, 0.28, 0.28),
    "power":    make_mat("M_Power",    0.40, 0.42, 0.50),
    "cooling":  make_mat("M_Cooling",  0.68, 0.68, 0.62),
    "pcie":     make_mat("M_PCIe",     0.22, 0.22, 0.58),
    "bmc":      make_mat("M_BMC",      0.58, 0.18, 0.18),
    "io":       make_mat("M_IO",       0.45, 0.45, 0.45),
}

# ── 部件建模函数 ──────────────────────────────────────────
def add_box(name, x, y, z, sx, sy, sz, mat_key):
    bpy.ops.mesh.primitive_cube_add(location=(x, y, z))
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name + "_mesh"
    obj.scale = (sx * 0.5, sy * 0.5, sz * 0.5)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mat = MAT[mat_key]
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    print(f"OK: {name}")
    return obj

# ── 21 个部件 ─────────────────────────────────────────────
# add_box(名称, x, y, z,  宽, 深, 高,  材质)
# 坐标以机箱中心为原点，参考爆炸图轴侧比例

# 机箱结构
add_box("TopCover",    0.0,  0.0,  2.30,  5.6, 4.0, 0.12, "chassis")
add_box("Chassis",     0.0,  0.0,  1.00,  5.6, 4.0, 2.00, "chassis")

# 主板 & 子板
add_box("Motherboard", -1.2,  0.2,  2.46,  2.8, 3.2, 0.08, "board")
add_box("DIMM_A",      -2.0,  0.8,  2.60,  0.18,1.4, 0.28, "dimm")
add_box("DIMM_B",      -2.0,  0.3,  2.60,  0.18,1.4, 0.28, "dimm")
add_box("IOPanel",     -2.6,  0.0,  2.50,  0.22,3.0, 0.40, "io")
add_box("BMC",         -1.8, -0.8,  2.50,  1.00,0.6, 0.14, "bmc")
add_box("Backplane",   -1.2, -1.4,  2.42,  2.6, 0.22,0.08, "board")

# CPU & 散热
add_box("CPU_0",        -0.3,  1.2,  2.55,  0.9, 0.9, 0.10, "cpu")
add_box("CPU_1",         0.8,  1.2,  2.55,  0.9, 0.9, 0.10, "cpu")
add_box("Heatsink_0",   -0.3,  1.2,  2.78,  0.85,0.85,0.36, "cooling")
add_box("Heatsink_1",    0.8,  1.2,  2.78,  0.85,0.85,0.36, "cooling")
add_box("FanModule",     1.8,  1.4,  2.65,  1.0, 1.0, 0.80, "cooling")

# 存储
add_box("DriveBay",     2.4,  0.0,  2.20,  1.0, 3.6, 1.60, "storage")
add_box("HDDCage",      0.2, -1.5,  2.50,  0.8, 0.4, 0.40, "storage")
add_box("SSDBay",       1.0, -1.5,  2.45,  1.0, 0.28,0.28, "storage")

# PCIe 扩展
add_box("PCIeBoard",    1.6, -0.2,  2.80,  0.10,1.0, 1.10, "pcie")
add_box("PCIeRiser",   -0.8, -1.6,  2.45,  1.6, 0.42,0.42, "pcie")
add_box("GPU",         -1.0, -1.8,  2.38,  1.2, 0.36,0.30, "pcie")
add_box("OCP",          1.8, -1.2,  2.50,  1.0, 0.45,0.20, "pcie")
add_box("VGA",          2.2, -1.6,  2.52,  0.60,0.35,0.18, "io")

# 电源 & 网络
add_box("PSU",         -2.2, -1.5,  1.60,  1.2, 1.0, 0.80, "power")
add_box("NIC",         -1.4, -1.6,  1.75,  0.55,0.50,0.25, "pcie")

# 前置风扇
add_box("FanFront",     0.0, -2.0,  1.80,  1.4, 0.20,0.75, "cooling")

# ── 摄像机（2.5D 轴侧视角）──────────────────────────────
cam_data = bpy.data.cameras.new("Camera_Iso")
cam_data.type = 'ORTHO'
cam_data.ortho_scale = 11.0
cam_obj = bpy.data.objects.new("Camera_Iso", cam_data)
bpy.context.scene.collection.objects.link(cam_obj)
cam_obj.location = (8.0, -8.0, 8.5)
cam_obj.rotation_euler = (
    math.radians(56),
    0.0,
    math.radians(45),
)
bpy.context.scene.camera = cam_obj

# ── 灯光 ────────────────────────────────────────────────
light_data = bpy.data.lights.new("Light_Main", type='SUN')
light_data.energy = 3.0
light_obj = bpy.data.objects.new("Light_Main", light_data)
bpy.context.scene.collection.objects.link(light_obj)
light_obj.location = (5, -3, 10)
light_obj.rotation_euler = (math.radians(35), 0, math.radians(-45))

# ── 渲染设置 ─────────────────────────────────────────────
bpy.context.scene.render.engine = 'BLENDER_EEVEE'
bpy.context.scene.render.film_transparent = True

# ── 完成 ─────────────────────────────────────────────────
print("\n=============================")
print("✅ 全部完成！共建立 23 个物体")
print("=============================")
print("下一步：")
print("  1. 按 A 全选，再按 Home 查看全部")
print("  2. 按 Numpad 0 切摄像机视角")
print("  3. File → Export → glTF 2.0 → server.glb")
