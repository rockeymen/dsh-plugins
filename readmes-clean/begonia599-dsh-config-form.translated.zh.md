#dsh-config-form

每个选择加入的插件都有一个设置页面。采用的插件声明其字段；该插件呈现表单，存储值，为浏览器提供服务，并强制执行路线的准入检查。

如果 Fabric 的拆分是类比：dsh 已经提供了 *Mod Menu* 部分 - 设置 shell、插件部分和 `settings.plugins.tab` 插槽。缺少的是 *Cloth Config*：声明式表单 API。就是这个。

状态：**完成、已验证、可打包。** 设置 → 插件中的一个选项卡：左侧采用插件，右侧选择的表单。在发布之前设置 LICENSE 版权所有者。

## 为什么选择加入而不是自动发现

第一个设计是一个自动发现每个插件配置的页面。它被测量并被放弃，因为前提不成立。

安装并检查了十二个第三方插件。 **一个** 注册一个设置命名空间。六个发布了自己的设置页面，但将配置保留在缝隙之外——四个在浏览器 `localStorage` 中，其余的在他们自己编写的文件中。因此，`ctx.settings.describe()` 几乎看不到任何生态系统，模式驱动的渲染器将有大约 12 个官方命名空间来渲染，树内手写卡已经涵盖了这些命名空间。

瓶颈从来都不是线路允许列表（绕过它就获得了一个命名空间）。问题是没有人采用这种接缝——因为采用它本身并不会给你带来一页。

调查*确实*显示的是需求：每个带有设置页面的插件都手写相同的四件事。

### 每个插件手卷 · 采用这个反而会带来什么
- **每个插件手卷**：一个React表单（12个中的12个，包括正确存储的一个）· **采用这个会带来什么**：一个声明；渲染器是共享的
- **每个插件手卷**：存储 - `localStorage` 在缓存清除时丢失，或者忽略 `DSH_HOME` 的路径 · **采用此方法会带来什么**：`ctx.settings`：分层分辨率、修订防护、外部编辑重新加载
- **每个插件手卷**：一个 HTTP 路由加上其安全检查 · **采用此方法会带来什么**：一个共享路由，检查写入一次
- **每个插件手卷**：秘密处理 · **采用此方法会带来什么**：`ctx.credentials`，`.credentials.yaml` 中的值

第三排不太方便。在七个被调查的暴露自己路由的插件中，**两个检查同源，两个检查环回，没有一个检查两者** - 其中一些路由写入文件。

## 采用它

采用插件编写的所有内容。没有 React，没有路由，没有存储，没有准入检查，不知道设置或凭证接缝：

````ts
导出常量注入 = ['configForm']

export function apply(ctx: Context) {
  const cfg = ctx.configForm.declare<GitSettings>(ctx, {
    id: 'demo-git',                          // becomes the settings namespace
    title: { zh: 'Git', en: 'Git' },
    groups: [
      { title: { zh: '常规', en: 'General' }, fields: [
        { kind: 'text', key: 'defaultBranch', label: { zh: '默认分支', en: 'Default branch' },
          default: 'main', pattern: '^[^\\s]+$' },
        { kind: 'boolean', key: 'signCommits', label: { zh: '签名提交', en: 'Sign commits' }, default: false },
      ] },
      { title: { zh: '高级', en: 'Advanced' }, collapsed: true, fields: [
        { kind: 'number', key: 'fetchDepth', label: { zh: '抓取深度', en: 'Fetch depth' }, default: 0, min: 0, step: 1 },
        { kind: 'select', key: 'conflictStyle', label: { zh: '冲突风格', en: 'Conflict style' },
          default: 'merge', options: [{ value: 'merge', label: 'merge' }, { value: 'diff3', label: 'diff3' }] },
      ] },
      { title: { zh: '凭据', en: 'Credentials' }, fields: [
        { kind: 'secret', key: 'token', label: { zh: '访问令牌', en: 'Access token' }, ref: 'DEMO_GIT_TOKEN' },
      ] },
    ],
  })

  cfg.get().defaultBranch                    // resolved: default → base → user
  cfg.watch(next => { /* the user saved; apply it */ })
  await cfg.secret('token')                  // resolved only at the operation boundary
}
```

The context is passed explicitly because it decides **ownership**: the settings registration and the form's row both unwind with the declaring plugin's fiber, so unloading removes the form and a hot reload can re-declare the same id.

`declare` is a hard dependency (`inject: ['configForm']`), matching Cloth Config: without the base plugin there is nowhere to render.

`base` carries a deployment layer, so a plugin with its own `cordis.yml` config passes it and a user's reset returns to the deployed value:

```ts
ctx.configForm.declare(ctx, spec, { base: { defaultBranch: config.defaultBranch }, applies: 'live' })
```

## Two properties the design guarantees

**秘密无法到达设置文档。** `secret` 字段从架构中编译出来并路由到 `ctx.credentials`。因此，设置部分不包含 `role('secret')` 节点，这使得接缝的不完整编辑不适用：`redactSecrets` 仅行走 `object`/`dict`/`array`，因此 `union`、`intersect`、`transform` 或 `lazy` 节点背后的秘密将逐字返回，而不会记录未命中的任何内容（`TODO(settings-wire-redaction)`、`packages/settings/settings/src/redact.ts:86`）。 `src/redaction-guard.ts` 精确地重新遍历这些关系，并保留它无法清除的任何名称空间的值 - 它永远不应该为编译的声明而触发，并保留作为接受原始模式的未来逃生舱口的守卫。它还从秘密节点中剥离 `meta.default`，从而关闭了单独的泄漏，其中在值被编辑后，声明的后备会依赖于模式。

**写入只能触及声明的值字段。**编辑作为修订栅栏下的路径操作行进，而不是作为整个部分替换：页面通过构造保留部分视图，并从中重建部分会删除响应从未携带的内容 - 当编辑器保存 `{baseURL, reasoning}` （[配置平面边界](../.agents/notes/implemented/architecture/2026-07-30-config-plane-boundaries.md)）时删除存储的 `apiKey` 的缺陷。未声明的密钥或秘密密钥在触及接缝之前会被拒绝。

## 安全

`dsh-host-webserver` 应用**无 TLS、身份验证或源策略**，因此在其上注册的路由不会继承任何内置接口的强制执行。 `src/admission.ts` 需要全部三个：

1. 环回对端地址；
2. 环回 `Host` 标头 — 解析到 127.0.0.1 的反弹 DNS 名称在此失败，仅对等检查不会停止；
3.任何状态改变方法的同源出处。

这遵循了该工具自己的结论，即读取配置与写入配置具有同样的特权。

## HTTP 面孔

### 请求·效果
- **请求**：`GET <route>/api/forms` · **效果**：列表窗格：每个采用的插件一行
- **请求**：`GET <route>/api/forms/` · **效果**：详细信息窗格：声明、值、`base`/`user` 层、`revision`、秘密状态
- **请求**：`POST <route>/api/forms/` · **效果**：`{ revision, set, unset }` → 受保护的路径操作写入；以重读状态回答
- **请求**：`PUT <route>/api/forms//secret/<key>` · **效果**：`{ value }` → 通过凭证缝存储
- **请求**：`DELETE <route>/api/forms//secret/<key>` · **效果**：删除该凭证
- **请求**：`GET <route>/api/namespaces` · **效果**：对每个名称空间的审核视图，无论是否采用，及其编辑判决

配置：`route`（默认`/config-form`）。

## 运行它

需要构建结帐和**节点满足存储库的 `engines` (`^22.19.0 || >=24.0.0`)**。在 22.17.x 上，`tsdown` 将其配置加载器解析为 `unrun`（无人安装的可选对等点），而不是 Node 的本机 TypeScript 支持，并且 `pnpm run build` 失败； `NODE_OPTIONS=--experimental-strip-types` 可以解决这个问题，但升级 Node 可以解决这个问题。 `pnpm run build` 的 `build:web` 步骤会扩展到 `pnpm`，因此即使外部运行通过 corepack，`PATH` 上也需要 `pnpm`。

```sh
pnpm pack                                            # in this package
dsh plugin --profile web add ./dsh-config-form-0.1.0.tgz
dsh web --patch <abs-path>/cordis.dev.yml
curl http://127.0.0.1:3080/config-form/api/forms
```

**安装 tarball，而不是 `link:`。** `link:` 安装通过链接解析
realpath，离开 Harness 主树，因此插件的 `@deepseek-ai/*`
进口永远达不到195链接`dsh`规定
`$DSH_HOME/profiles/node_modules/@deepseek-ai/`——“in-box”背后的机制
捆绑包名称始终从 dsh 安装本身解析”。下一个来源
无论如何，launch tsx 都会解决这个问题，并且损坏是不可见的；在内置的 CLI 下
`Cannot find package '@deepseek-ai/schemastery'` 失败。 tarball 解压成
`$DSH_HOME/profiles/<name>/node_modules/`，比这些链接低一级，所以它
在两次启动下都得到解决。每次编辑后重新打包。

`cordis.dev.yml` 使用绝对的 **`file://` URL** 命名 TypeScript 源：加载器将 `n