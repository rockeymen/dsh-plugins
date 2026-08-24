![MindMemOS Memory For AI Agents](./assets/mindmemos-readme-hero.png)

  [简体中文](README_ZH.md)
    │
  [Website](https://mindmemos.cn)
    │
  [API Docs](https://mindmemos.cn/api-docs)
    │
  [PYPI SDK](https://pypi.org/project/mindmemos-sdk/)
    │
  [Deployment Guide](docs/deploy/instruction.md)

  Accurately remember user and task context and reuse it across agents; evolve memory through ongoing interactions, automatically distill Skills, and connect with file-based knowledge systems so experience truly becomes capability.

> ⭐ **Star us on GitHub to automatically upgrade to a Pro quota membership.**

## 📰 News

- **2026-08-18**: We released the [DeepSeek Harness Plugin](https://www.npmjs.com/package/@mindmemos/deepseek-harness-plugin), letting DeepSeek Harness (dsh) agents automatically recall and write MindMemOS memories.
- **2026-08-14**: We released the [MindMemOS 1.0 technical report](https://arxiv.org/abs/2608.12428), *MindMemOS: A Portable and Self-Evolving Memory Operating Layer for AI Agents*.
- **2026-07-17**: MindMemOS integrated with [LLM4AD_NEXT](https://github.com/Optima-CityU/LLM4AD_Next), providing searchable long-term memory for algorithm design tasks and enabling the accumulation and reuse of cross-task experience, domain knowledge, and constraints.
- **2026-06-30**: MindMemOS was officially released!

## 🌟 Core Features

- **Portable across agents**: Persist user profiles, preferences, project facts, tool experience, and skill candidates as reusable assets, allowing OpenClaw, Hermes, Claude Code, OpenHands, and other agents to share or transfer the same long-term memory.
- **Self-evolving memory system**: Continuously improve memory quality through schema learning, dreaming, and feedback by automatically learning frequent memory patterns, consolidating memories offline, and using interaction corrections to optimize add/search workflows.
- **Memory and Skills integration**: Experience memories can be distilled into skill candidates, while skill execution results, failure traces, and user feedback flow back into the memory system to drive continuous skill evolution.
- **Plugin integrations**: Connect MindMemOS to different agents and workflows through plugins that retrieve and inject relevant memories before interactions and automatically write conversations back afterward. The [OpenClaw Plugin](https://www.npmjs.com/package/@mindmemos/openclaw-plugin) and [DeepSeek Harness Plugin](https://www.npmjs.com/package/@mindmemos/deepseek-harness-plugin) are currently available, with more integrations in progress.

  ![MindMemOS benchmark results overview](./assets/mindmemos-benchmark-overview.png)

## 🚀 Quick Start

MindMemOS offers **two deployment modes** (official cloud service, local self-hosting) and **three access methods** (HTTP API, Python SDK / CLI, agent plugin). Any combination works — server and client speak the same protocol:

### Access Method · Use Case · Cloud base_url · Local base_url
- **Access Method**: [HTTP API](https://mindmemos.cn/api-docs) · **Use Case**: Call directly from business apps · **Cloud base_url**: `https://mindmemos.cn` · **Local base_url**: `http://127.0.0.1:8000`
- **Access Method**: [Python SDK / CLI](https://pypi.org/project/mindmemos-sdk/) · **Use Case**: Integrate into business apps · **Cloud base_url**: `https://mindmemos.cn` · **Local base_url**: `http://127.0.0.1:8000`
- **Access Method**: [OpenClaw Plugin](https://www.npmjs.com/package/@mindmemos/openclaw-plugin) · **Use Case**: Agent auto-recalls / writes memory · **Cloud base_url**: `https://mindmemos.cn` · **Local base_url**: `http://127.0.0.1:8000`
- **Access Method**: [DeepSeek Harness Plugin](https://www.npmjs.com/package/@mindmemos/deepseek-harness-plugin) · **Use Case**: Agent auto-recalls / writes memory (dsh) · **Cloud base_url**: `https://mindmemos.cn` · **Local base_url**: `http://127.0.0.1:8000`

To try it without deploying, use the official cloud service (request an API key on the [website](https://mindmemos.cn)); for on-premises or offline use, start with Local Deployment below.

### 1. Local Deployment

MindMemOS uses `uv` to manage dependencies and run local commands. For detailed configuration instructions, see [docs/deploy/instruction.md](docs/deploy/instruction.md).

#### 1.1 Prepare Configuration Files

```bash
cp .env.example .env
cp config/mindmemos/dev.example.yaml config/mindmemos/dev.yaml
```

Before startup, configure at least the following three model routers in `config/mindmemos/dev.yaml`:

- `chat_model_router`: supports memory extraction, Skill evolution, and other generation tasks.
- `embed_model_router`: generates semantic embeddings; make sure its dimensions match the Qdrant dimension configuration.
- `rerank_model_router`: optional; reranks memory retrieval results.

Configure an API key and its bound `project_id` in `config/mindmemos/api_keys.yaml`.

#### 1.2 Start the Service

Start the local service:

```bash
make dev
```

`make dev` starts the full Docker dependency stack before starting FastAPI.

To start only core dependencies:

```bash
make dev-core          # Qdrant + Neo4j + Kafka
make db-observability  # Qdrant + Neo4j + Kafka + ClickHouse + OTel + Grafana
```

The default local service port is 8000:

```text
FastAPI:   http://127.0.0.1:8000
```

Stop the local service:

```bash
make dev-down
```

### 2. Access Methods

Cloud and local self-hosting use the same access protocol. Local keys come from `config/mindmemos/api_keys.yaml`; cloud keys are obtained from the [website](https://mindmemos.cn).

#### 2.1 HTTP API

HTTP is the base access method — the SDK and plugins also talk HTTP underneath. Once the service is up, first use curl to verify the endpoints work, then wire up your business logic. Define the address and key before calling (pick local or cloud):

```bash
export BASE_URL=http://127.0.0.1:8000   # Local self-host; change to https://mindmemos.cn for cloud
export API_KEY=dev-api-key-001          # Local example key; use a website-issued key for cloud
```

Add a memory:

```bash
curl -sS -X POST "$BASE_URL/v1/memory/add" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "u_123",
    "messages": [{"role": "user", "content": "I like iced Americanos."}]
  }'
```

Search memories:

```bash
curl -sS -X POST "$BASE_URL/v1/memory/search" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "What kind of coffee does the user like?", "top_k": 3}'
```

A `code` of `ok` with readable memory content means the access works. curl is just a smoke-test helper; the shown format is for bash. Other environments / languages and the remaining endpoints (get / list / delete / update / feedback / dreaming / skills, etc.) are all covered in the [API docs](https://mindmemos.cn/api-docs).

#### 2.2 Configure the SDK

Install the Python SDK:

```bash
pip install mindmemos-sdk
```

Run the authentication command and configure the service address, API key, and default user when prompted:

```bash
mindmemos auth
```

### Setting · Local Service · Cloud Service
- **Setting**: `base_url` · **Local Service**: `http://127.0.0.1:8000` · **Cloud Service**: `https://mindmemos.cn`
- **Setting**: `api_key` · **Local Service**: An enabled API key from `config/mindmemos/api_keys.yaml` · **Cloud Service**: An API key obtained from the [MindMemOS website](https://mindmemos.cn)
- **Setting**: `user_id` · **Local Service**: A stable identifier for the current end user, such as `u_123` · **Cloud Service**: A stable identifier for the current end user, such as `u_123`

The configuration is saved to `~/.mindmemos/settings.json`. Check the current configuration with:

```bash
mindmemos config show
```

The local service automatically determines the `project_id` and memory algorithm from the API key, so SDK calls do not need to pass `project_id`. The `user_id` distinguishes users within the same project and can be overridden in an individual `add` or `search` call.

If you prefer not to use the local configuration file, pass connection parameters explicitly when creating the client:

```python
from mindmemos_sdk import MindMemOSClient

with MindMemOSClient(
    base_url="http://127.0.0.1:8000",
    api_key="<api_key>",
    user_id="u_123",
) as client:
    ...
```

Explicit parameters take precedence over values in `~/.mindmemos/settings.json`.

#### 2.3 Add and Search Memories with the SDK

After completing the configuration above, `MindMemOSClient()` automatically reads the service address, API key, and default `user_id`. The SDK adds the authentication header automatically, so there is no need to construct HTTP requests manually:

```python
from mindmemos_sdk import DialogueMessage, MindMemOSClient

with MindMemOSClient() as client:
    add_result = client.memory.add(
        messages=[
            DialogueMessage(
                role="user",
                content="I like iced Americanos.",
            )
        ],
        mode="sync",
    )

    for item in add_result.memories:
        print(item.operation, item.memory_id, item.content)

    search_result = client.memory.search(
        "What kind of coffee does the user like?",
        top_k=5,
        search_strategy="fast",
    )

    for memory in search_result.memories:
        print(memory.id, memory.memory)
```

Trigger cloud evolution for a registered Skill:

```python
from mindmemos_sdk import MindMemOSClient

with MindMemOSClient() as client:
    result = client.skills.evolve("my-skill", mode="sync")

    print("evolved:", result.evolved)
    print("pending:", result.pending_count)
    print("threshold:", result.threshold)
    print("new versions:", result.new_version_ids)
```

Local and cloud services use the same SDK call pattern. To switch between them, reconfigure only the `base_url` and corresponding API key.

#### 2.4 Use the CLI

After running `mindmemos auth`, you can also add and search memories directly with the CLI included in the SDK:

```bash
mindmemos memory add --content "I like iced Americanos"
mindmemos memory search "coffee preferences" --top-k 5
```

The `memory` subcommand also supports get / update / delete / feedback / dreaming, and the `skill` subcommand supports register / list / evolve / push / pull / history and more. For the full command list, parameter reference, and troubleshooting, see the [CLI Guide](docs/cli/instruction.md).

#### 2.5 OpenClaw Plugin

**Installing via our [`mindmemos-cli` skill](skills/mindmemos-cli/SKILL.md) is recommended**: deploy `skills/mindmemos-cli/` to your agent's skills directory and let the agent follow its instructions. The skill's [reference docs](skills/mindmemos-cli/references/openclaw-plugin.md) cover installation, permissions, and common troubleshooting.

Manual installation (not recommended)

**First install the SDK and complete `auth` configuration (required)**: the plugin communicates with the local machine through the `mindmemos` CLI, so you must install the Python SDK first and make sure the `mindmemos` command is available:

```bash
pip install mindmemos-sdk    # or: uv add mindmemos-sdk
mindmemos --version          # confirm the command is available
```

Then configure `base_url`, API key, and `user_id` with `mindmemos auth` (pointing at either the cloud or a local service):

```bash
mindmemos auth
mindmemos config show        # confirm the configuration took effect
```

> Skipping these two steps before installing the plugin causes the logs to error out (`mindmemos` command not found / auth not configured), and the plugin will not be able to read or write memories properly.

Install and enable the plugin:

```bash
openclaw plugins install @mindmemos/openclaw-plugin
openclaw plugins enable mindmemos-memory
```

(`@mindmemos/openclaw-plugin` is the npm package name; `mindmemos-memory` is the plugin id.) Manual installation easily runs into two pitfalls:

- **Write permission (required)**: the plugin's `agent_end` write hook needs `allowConversationAccess`; otherwise everything looks fine, but memories are never actually stored after a turn:
  ```bash
  openclaw config set plugins.entries.mindmemos-memory.hooks.allowConversationAccess true
  openclaw gateway restart
  ```
- **`cli` PATH**: an OpenClaw process launched from the GUI does not inherit your terminal PATH. Configure `mindmemos` as an absolute path or wrap it with `uv run mindmemos`, or the logs will report `ENOENT`.

Once installed, enabled, and the gateway restarted, the plugin recalls and injects relevant memories before each user turn and writes the conversation back automatically when the turn ends.

Full commands, configuration options, and troubleshooting are in the [OpenClaw plugin integration docs](skills/mindmemos-cli/references/openclaw-plugin.md).

#### 2.6 DeepSeek Harness Plugin

**Installing via our [`mindmemos-cli` skill](skills/mindmemos-cli/SKILL.md) is recommended**: deploy `skills/mindmemos-cli/` to your agent's skills directory and let the agent follow its instructions. The skill's [reference docs](skills/mindmemos-cli/references/deepseek-harness-plugin.md) cover installation and common troubleshooting.

Manual installation (not recommended)

**First install the SDK and complete `auth` configuration (required)**: the plugin communicates with the local machine through the `mindmemos` CLI, so you must install the Python SDK first and make sure the `mindmemos` command is available:

```bash
pip install mindmemos-sdk    # or: uv add mindmemos-sdk
mindmemos --version          # confirm the command is available
```

Then configure `base_url`, API key, and `user_id` with `mindmemos auth` (pointing at either the cloud or a local service):

```bash
mindmemos auth
mindmemos config show        # confirm the configuration took effect
```

> Skipping these two steps before installing the plugin causes the logs to error out (`mindmemos` command not found / auth not configured), and the plugin will not be able to read or write memories properly.

Install the plugin into a dsh profile (`dsh plugin` forwards to pnpm and installs the package into the profile's `node_modules`):

```bash
dsh plugin --profile <name> add @mindmemos/deepseek-harness-plugin
```

(`@mindmemos/deepseek-harness-plugin` is the npm package name; `mindmemos-memory` is the plugin id.) dsh composes plugins through layered `cordis.patch.yml` files, so register the plugin by adding an `insert` entry to the profile patch (`~/.dsh/profiles/<name>/cordis.patch.yml`):

```yaml
- insert:
    - id: mindmemos-memory
      name: '@mindmemos/deepseek-harness-plugin'
      config:
        userId: alice
        appId: deepseek-harness
```

Restart dsh with that profile. Once registered, the plugin recalls and injects relevant memories before each user turn and writes the conversation back automatically when the turn ends.

Full commands, configuration options, and troubleshooting are in the [DeepSeek Harness plugin integration docs](skills/mindmemos-cli/references/deepseek-harness-plugin.md).

## 📊 Benchmark

### 💬 Conversational Memory: LoCoMo

- **Benchmark**: [LoCoMo](https://arxiv.org/abs/2402.17753), a mainstream benchmark for long-conversation memory covering single-hop, multi-hop, temporal, and open-domain question answering.

### Method · Single-hop · Multi-hop · Temporal · Open-domain · Overall
- **Method**: Mem0 · **Single-hop**: 68.97 · **Multi-hop**: 61.70 · **Temporal**: 58.26 · **Open-domain**: 50.00 · **Overall**: 64.20
- **Method**: MemU · **Single-hop**: 74.91 · **Multi-hop**: 72.34 · **Temporal**: 43.61 · **Open-domain**: 54.17 · **Overall**: 66.67
- **Method**: MemOS · **Single-hop**: 85.37 · **Multi-hop**: 79.43 · **Temporal**: 75.08 · **Open-domain**: 64.58 · **Overall**: 80.76
- **Method**: Zep · **Single-hop**: 90.84 · **Multi-hop**: 81.91 · **Temporal**: 77.26 · **Open-domain**: 75.00 · **Overall**: 85.22
- **Method**: EverOS · **Single-hop**: 96.67 · **Multi-hop**: 91.84 · **Temporal**: 89.72 · **Open-domain**: 76.04 · **Overall**: 93.05
- **Method**: **MindMemOS-MindVanilla** · **Single-hop**: 92.03 · **Multi-hop**: 85.82 · **Temporal**: 83.80 · **Open-domain**: 66.67 · **Overall**: 87.60
- **Method**: **MindMemOS-MindSchema** · **Single-hop**: **96.79** · **Multi-hop**: **93.97** · **Temporal**: **90.34** · **Open-domain**: **82.29** · **Overall**: **94.03**

### 👤 User Profile Memory: PersonaMem

- **Benchmark**: [PersonaMem](https://arxiv.org/abs/2504.14225), a memory benchmark centered on user profiles and preference understanding that evaluates recall, tracking, revisiting, suggestion, recommendation, and generalization of user traits.

### Method · Recall · Ack. Lat. · Trk. Evo. · Revisit · Suggest · Recom. · General. · Overall
- **Method**: Mem0 · **Recall**: 46.51 · **Ack. Lat.**: 41.18 · **Trk. Evo.**: 65.47 · **Revisit**: 90.91 · **Suggest**: 12.90 · **Recom.**: 34.55 · **General.**: 43.86 · **Overall**: 51.61
- **Method**: MemU · **Recall**: 64.34 · **Ack. Lat.**: 64.71 · **Trk. Evo.**: 66.20 · **Revisit**: 87.88 · **Suggest**: 31.18 · **Recom.**: 67.27 · **General.**: 84.21 · **Overall**: 65.70
- **Method**: MemOS · **Recall**: 53.49 · **Ack. Lat.**: 82.35 · **Trk. Evo.**: 66.91 · **Revisit**: 79.80 · **Suggest**: 41.94 · **Recom.**: 69.09 · **General.**: 75.44 · **Overall**: 63.67
- **Method**: EverOS · **Recall**: 74.42 · **Ack. Lat.**: 64.71 · **Trk. Evo.**: 64.03 · **Revisit**: 85.86 · **Suggest**: 35.48 · **Recom.**: 65.45 · **General.**: 84.21 · **Overall**: 67.57
- **Method**: **MindMemOS-MindVanilla** · **Recall**: 76.74 · **Ack. Lat.**: 88.24 · **Trk. Evo.**: 65.47 · **Revisit**: 87.88 · **Suggest**: 17.20 · **Recom.**: 80.00 · **General.**: 82.46 · **Overall**: 67.74
- **Method**: **MindMemOS-MindSchema** · **Recall**: 81.40 · **Ack. Lat.**: 64.71 · **Trk. Evo.**: 64.75 · **Revisit**: 82.83 · **Suggest**: 47.31 · **Recom.**: 76.36 · **General.**: 73.68 · **Overall**: 70.63

### 🌙 Memory Consolidation: MemoryAgentBench (FactC