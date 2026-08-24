# 🐱 Cat Companion Tools for DeepSeek Harness

A DeepSeek Harness plugin that provides AI agents with tools to fetch random cat facts and images from public APIs.

## ✨ Features

- **`get_cat_fact`**: Fetches a random, interesting fact about cats.
  - *Optional Parameter*: `maxLength` (number) - Limits the length of the fact in characters.
- **`get_cat_image`**: Fetches a random cat image URL and displays it as a Markdown image.

## 📦 Installation

To install this plugin in your DeepSeek Harness profile, run:

```bash
git clone https://github.com/vikasranax/dsh-plugin-cats.git

cd dsh-plugin-cats

pnpm install

pnpm dsh web --patch ./cordis.yml
```
## ⚙️ Configuration

You can configure the default behavior of the plugin. If no configuration is provided, the plugin uses sensible defaults.

### Setting · Type · Default · Description
- **Setting**: `defaultMaxLength` · **Type**: `number` · **Default**: `200` · **Description**: The default maximum length for cat facts if not specified in the prompt.