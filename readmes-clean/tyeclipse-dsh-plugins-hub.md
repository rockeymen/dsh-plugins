# dsh-plugins-hub

> An independent, community-friendly plugin index for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness).
> Curated by automation + human review. Topic: `dsh-plugin`.

## Featured Plugins

### Plugin · Description · Install · Status · Security · Trial · Checked at · Commit
- **Plugin**: [dsh-netdoctor](https://github.com/TYEclipse/dsh-netdoctor) · **Description**: Network diagnostics toolbox: DNS lookup, ICMP ping, TCP port check, TLS cert check, traceroute, public IP — six read-only probes, zero runtime dependencies · **Install**: `dsh plugin --profile web add github:TYEclipse/dsh-netdoctor` · **Status**: ✅ active · **Security**: ✅ · **Trial**: ✅ e2e (dns_lookup ×2: system + 8.8.8.8) · **Checked at**: 2026-08-16 · **Commit**: 43de786b
- **Plugin**: [dsh-webfetch](https://github.com/TYEclipse/dsh-webfetch) · **Description**: Web page reader: fetch any URL and extract clean Markdown / plain text plus a link inventory — zero runtime dependencies, read-only · **Install**: `dsh plugin --profile web add github:TYEclipse/dsh-webfetch` · **Status**: ✅ active · **Security**: ✅ · **Trial**: ✅ e2e (web_fetch) · **Checked at**: 2026-08-16 · **Commit**: 6296371d
- **Plugin**: [dsh-units](https://github.com/TYEclipse/dsh-units) · **Description**: Unit conversion toolbox: 14 categories (length, mass, temperature, data sizes decimal-vs-binary, speed, time, volume, pressure, energy, angle, frequency, typography px/pt/em/rem, fuel economy mpg ↔ L/100km) — zero runtime dependencies, pure math · **Install**: `dsh plugin --profile web add github:TYEclipse/dsh-units` · **Status**: ✅ active · **Security**: ✅ · **Trial**: ✅ e2e (convert_unit) · **Checked at**: 2026-08-16 · **Commit**: 2bdfae10
- **Plugin**: [dsh-color](https://github.com/TYEclipse/dsh-color) · **Description**: Color conversion toolbox: parse/convert any CSS color (hex, rgb()/hsl()/hwb(), all 148 CSS Color 4 named colors), WCAG 2.x contrast ratio with AA/AAA verdicts, named-color lookup by name or value — zero runtime dependencies, pure math · **Install**: `dsh plugin --profile web add github:TYEclipse/dsh-color` · **Status**: ✅ active · **Security**: ✅ · **Trial**: ✅ e2e (contrast_ratio) · **Checked at**: 2026-08-16 · **Commit**: 2783169
- **Plugin**: [Code2Skill](https://github.com/leechen298/Code2Skill) · **Description**: Three agent skills that generate portable Function / MCP Tool / workflow Skill packages (with offline tests) from user-authorized code, plus independent flow and source-semantics review — pure skill bundle, MIT · **Install**: `dsh plugin --profile web add github:leechen298/Code2Skill#v1.1.3` · **Status**: ✅ active · **Security**: ✅ · **Trial**: ✅ e2e (code2skill-review-source skill invoked headless) · **Checked at**: 2026-08-16 · **Commit**: 7815d8f1

Columns: **Security** = passed preliminary source review (TRACE-lite: trust / reliability / auditability / confidentiality / effectiveness); **Trial** = verified in an isolated profile with a real end-to-end tool call; **Commit** = the exact revision that was verified.

## How to add your plugin

1. Add the `dsh-plugin` topic to your plugin repository
2. Open an issue in this repository using the **Plugin Submission** template (plugin name, repo link, release tag, license, install command)
3. The pipeline verifies the submission in an isolated profile — security review, install, and one real end-to-end tool call
4. Verified plugins are added to the index and the issue is closed; failed submissions stay open with a `needs-fix` label and a summary reply

## About

- Independent community index (not affiliated with DeepSeek AI)
- Updated automatically on a daily basis
- MIT License

*Maintained by the dsh-autopilot pipeline.*