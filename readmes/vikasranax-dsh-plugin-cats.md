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

| Setting | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `defaultMaxLength` | `number` | `200` | The default maximum length for cat facts if not specified in the prompt. |

## Contributing

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This Project is licensed under the MIT License. See [LICENCE.md](LICENCE)

## Acknowledgements

This plugin relies on the free public APIs.

https://catfact.ninja
https://thecatapi.com