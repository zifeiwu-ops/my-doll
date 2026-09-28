# My doll · Y2K 贴纸风换装小游戏

纯前端单文件网页游戏：给千禧少女娃娃换发型、衣服、鞋袜和小物，摆姿势、进拍照小屋拍大头贴。
画风对齐 Y2K COLLECTION SPRITE SHEET v1.0，所有部件画在同一张 300 × 600 的 SVG 画布上，天然对齐。

## 直接玩

双击 `index.html` 用浏览器打开即可（不需要服务器、不需要安装）。

## 目录

- `index.html`：拼好的成品（可以直接部署到任意静态托管）
- `build.py`：把 `src/` 拼成 `index.html`
- `src/`：源码，按分区放在不同文件夹里

| 文件夹 | 内容 | 文件 |
| --- | --- | --- |
| `src/core/` | 画布工具、颜色小工具 | `base7.js` `colors7.js` |
| `src/body/` | 底模身体 / 五官、分层渲染和关节姿势、自然站姿 | `body7_data.js` `body7.js` `render7.js` `pose17.js` |
| `src/patterns/` | 面料图案 | `pat*.js` |
| `src/templates/` | 衣服版型，布料褶皱、荷叶边等效果 | `tpl*.js` `fx14.js` |
| `src/hair/` | 发型 | `hair*.js` |
| `src/items/` | 鞋袜小物，小物分区 | `items*.js` `acc13.js` |
| `src/wardrobe/` | 衣橱清单（每期上新一个文件） | `wardrobe*.js` |
| `src/studio/` | 拍照小屋（场景、相框、贴纸、导出照片），手绘 DIY，照片取色做面料 | `studio*.js` `draw9.js` `vision7.js` |
| `src/ui/` | 界面逻辑，页面结构和样式 | `ui7.js` `head7.html` |

新加文件时放进对应的文件夹，然后把文件名加到 `build.py` 的 `PARTS` 列表里（只写文件名，按拼接顺序排；`build.py` 会自己去子文件夹里找）。

## 只拉取某一部分

用 git 的 sparse-checkout，只把要改的那个分区拉到本地，比如只改发型：

```bash
git clone --filter=blob:none --sparse https://github.com/zifeiwu-ops/my-doll.git
cd my-doll
git sparse-checkout set src/hair
```

同时改几个分区就一起写上：`git sparse-checkout set src/hair src/wardrobe`。
想恢复成完整仓库：`git sparse-checkout disable`。

注意：`python3 build.py` 要用到 `src/` 下所有文件，只拉了一部分的时候跑不了。改完推上去以后，在完整仓库里重新生成 `index.html`。

## 修改后重新生成

```bash
python3 build.py
```

## 上新衣服

在 `src/wardrobe*.js` 的清单里加一行，套用现成版型画风会自动统一，例如：

```js
{ id: 't99', cat: 'top', tpl: 'babyTee', name: '名字', fill: { c: '#F4A7C0' }, isNew: true }
```

分类 `cat`：hair 发型 / top 上衣 / outer 外套 / bottom 下装 / dress 连衣裙 / legs 袜子 / shoes 鞋 / acc 小物。
