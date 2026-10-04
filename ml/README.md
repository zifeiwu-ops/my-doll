# 照片识别版型用到的模型（全部在浏览器里运行，照片不上传）

- `u2netp.onnx`：U²-Net-p 去背景模型（Apache-2.0，来自 https://github.com/xuebinqin/U-2-Net ，文件取自 rembg 的发布页）
- `ort.wasm.min.js`、`ort-wasm-simd-threaded.mjs`、`ort-wasm-simd-threaded.wasm`：onnxruntime-web 1.20.1（MIT）

衣服类型识别网络的权重在 `src/studio/clsdata22.js`，用 clothing-dataset-small（CC0）里约 800 张照片训练。
