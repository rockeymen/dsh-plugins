# 🐱 DeepSeek Harness 猫伴侣工具

一个 DeepSeek Harness 插件，为 AI 代理提供从公共 API 获取随机猫事实和图像的工具。

## ✨ 特点

- **`get_cat_fact`**：获取有关猫的随机有趣事实。
  - *可选参数*：`maxLength`（数字） - 限制事实的字符长度。
- **`get_cat_image`**：获取随机猫图像 URL 并将其显示为 Markdown 图像。

## 📦 安装

要在您的 DeepSeek Harness 配置文件中安装此插件，请运行：

```bash
git clone https://github.com/vikasranax/dsh-plugin-cats.git

cd dsh-plugin-cats

pnpm install

pnpm dsh web --patch ./cordis.yml
```
## ⚙️ 配置

您可以配置插件的默认行为。如果未提供配置，则插件将使用合理的默认值。

### 设置·类型·默认值·描述
- **设置**：`defaultMaxLength` · **类型**：`number` · **默认**：`200` · **描述**：如果提示中未指定，则猫事实的默认最大长度。