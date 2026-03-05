# 加拿大 PR 打分计算器（静态网页）

这个仓库是一个可直接部署到 **GitHub Pages** 的单页应用，包含：

- 联邦 CRS（1200）计算器
- 联邦 FSW（67/100）计算器
- 安省 OINP EOI（5个流派）计算器
- URL 参数回填 + 分享链接（可直接复制）

## 本地预览

直接双击打开 `index.html` 即可，或使用任意静态服务器：

```bash
python3 -m http.server 8080
```

然后访问：`http://localhost:8080`

## URL 参数分享

页面会自动把选项写入 URL 查询参数，并在打开时自动回填。

示例：

```text
https://<你的用户名>.github.io/<仓库名>/?tool=crs&crs_age=37&crs_has_spouse=1&crs_l1_r=9&crs_l1_w=9&crs_l1_l=9&crs_l1_s=9
```

同时兼容你参考站点常见参数（如 `age`、`pa_1reading`、`checkbox_has_spouse` 等），会自动转换并回填到本页面字段。

## 部署到 GitHub Pages

1. 新建 GitHub 仓库并推送代码：

```bash
git add .
git commit -m "Add Chinese Canada PR score calculator"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

2. 打开仓库页面：`Settings` -> `Pages`
3. 在 `Build and deployment` 里选择：
   - `Source`: **Deploy from a branch**
   - `Branch`: `main` + `/ (root)`
4. 保存后等待发布完成。
5. 访问：
   - `https://<你的用户名>.github.io/<仓库名>/`

## 免责声明

该工具仅用于信息整理与自测，不构成法律建议。请以 IRCC / Ontario 官网最新规则为准。
