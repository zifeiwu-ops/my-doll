"""把 src/ 里的分片拼成单文件网页：index.html（可直接双击打开 / 部署到任意静态托管）。
用法：python3 build.py
"""
import os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src') + os.sep
OUT = os.path.dirname(os.path.abspath(__file__))
DOC = '''/* =====================================================================
   My doll · 原型（千禧少女贴纸风 · 对齐 Y2K COLLECTION SPRITE SHEET v1.0）
   画布：所有部件画在同一个 300 × 600 坐标里（= 1024 × 2048），天然对齐。底模按参考精灵图描摹。
   【上新衣服】在 WARDROBE 里加一行：
     套版型（画风自动统一）：{ id: 't10', cat: 'top', tpl: 'babyTee', name: '名字', fill: { c: '#颜色' } 或 { p: '图案名' }, isNew: true }
     画师 PNG：{ id: 't11', cat: 'top', name: '名字', png: '图片地址', z: 30, thumb: '84 150 132 150' }
   cat：hair 发型 / top 上衣 / outer 外套 / bottom 下装 / dress 连衣裙 / legs 袜子 / shoes 鞋 / acc 小物
   层级：发型后片 2 · 底模 10 · 袜子 15 · 下装 20 · 连衣裙 25 · 上衣 30 · 外套 35 · 鞋 40 · 腿套 42 · 发型前片 50 · 小物 55+
   ===================================================================== */
'''
PARTS = ['base7.js', 'colors7.js', 'body7_data.js', 'body7.js', 'pat7.js', 'pat10.js', 'pat11.js', 'pat13.js', 'pat15.js', 'pat16.js', 'tpl7.js', 'tpl7b.js', 'tpl7c.js', 'tpl10.js', 'tpl11.js', 'fx14.js', 'tpl15.js', 'tpl16.js', 'redraw18.js', 'drape19.js', 'hair7.js', 'hair7b.js', 'hair10.js', 'hair11.js', 'hair13.js', 'hair15.js', 'hair16.js', 'hair19.js', 'items7.js', 'items7b.js', 'items10.js', 'items11.js', 'items13.js', 'items15.js', 'items16.js', 'wardrobe7.js', 'wardrobe10.js', 'wardrobe11.js', 'wardrobe13.js', 'wardrobe15.js', 'wardrobe16.js', 'wardrobe20.js', 'wardrobe21.js', 'wardrobe22.js', 'acc13.js', 'render7.js', 'pose17.js', 'draw9.js', 'vision7.js', 'studio12.js', 'studio13.js', 'studio15.js', 'ui7.js']
# 源码按分区放在 src/ 的子文件夹里（core / body / patterns / templates / hair / items / wardrobe / studio / ui）。
# PARTS 只写文件名、按拼接顺序排列；这里自动去子文件夹里找到对应文件。
def find(name):
    for root, _, files in os.walk(D):
        if name in files: return os.path.join(root, name)
    raise FileNotFoundError('src/ 里找不到 ' + name)
def build():
    h = open(find('head7.html'), encoding='utf-8').read()
    js = DOC + '\n'.join(open(find(p), encoding='utf-8').read() for p in PARTS)
    out = h + '\n<script>\n' + js + '</script>\n'
    i = out.index('</style>') + 8
    page = '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + out[:i] + '\n</head>\n<body>\n' + out[i:] + '\n</body>\n</html>\n'
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page)
    return len(page)
if __name__ == '__main__': print(build() // 1024, 'KB')
