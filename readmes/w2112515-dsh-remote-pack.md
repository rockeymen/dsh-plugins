# DSH Remote pack

A marketplace solution pack with one item: [`w2112515/dsh-remote-host`](https://github.com/w2112515/dsh-remote-host).

This project acknowledges the [LINUX DO](https://linux.do) community.

[![LINUX DO](https://img.shields.io/badge/LINUX%20DO-acknowledged-6A8DFF?style=flat-square)](https://linux.do)

Install the pack from Settings → Plugins → Marketplace (or add the Host plugin with `dsh plugin`). Then download **one APK** from [dsh-remote-android releases](https://github.com/w2112515/dsh-remote-android/releases). The pack cannot install an Android app.

```json
{
  "schemaVersion": 1,
  "name": "DSH Remote",
  "description": "Host plugin for pairing an Android phone to DeepSeek Harness over LAN.",
  "items": ["w2112515/dsh-remote-host"]
}
```
