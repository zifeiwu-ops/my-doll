# 千禧衣橱 · Y2K 贴纸风换装小游戏

纯前端单文件网页游戏：给千禧少女娃娃换发型、衣服、鞋袜和小物，摆姿势、进拍照小屋拍大头贴。
画风对齐 Y2K COLLECTION SPRITE SHEET v1.0，所有部件画在同一张 300 × 600 的 SVG 画布上，天然对齐。

## 直接玩

双击 `index.html` 用浏览器打开即可（不需要服务器、不需要安装）。

## 目录

- `index.html`：拼好的成品（可以直接部署到任意静态托管）
- `src/`：源码分片
  - `base7.js` `body7.js` `body7_data.js`：画布工具、底模身体 / 五官
  - `pat*.js`：面料图案；`tpl*.js` `fx14.js`：衣服版型和布料褶皱、荷叶边等效果
  - `hair*.js`：发型；`items*.js`：鞋袜小物等；`wardrobe*.js`：衣橱清单（每期上新一个文件）
  - `render7.js`：分层渲染、关节姿势；`pose17.js`：自然站姿（整个人一起矢量变形，没有关节接缝）
  - `studio*.js`：拍照小屋（场景、相框、贴纸、导出照片）；`draw9.js`：手绘 DIY；`vision7.js`：照片取色做面料
  - `ui7.js`：界面逻辑；`head7.html`：页面结构和样式
- `build.py`：把 `src/` 拼成 `index.html`

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
