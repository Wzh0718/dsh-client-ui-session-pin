# dsh-client-ui-session-pin

[English](README.md) | 中文

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI 侧边栏提供会话置顶与分组跟随能力。

一个 DSH client 插件,提供:

- **置顶区块**——宽屏模式下会话列表上方的可折叠「已置顶」区块。按最近置顶在前列出已置顶会话,并显示所属工作区标签;点击行打开会话,行上可取消置顶。
- **行内置顶开关**——每个会话行在菜单旁新增图钉按钮(与菜单一样悬停显现)。临时的空白新会话行无法置顶。
- **自动跟随**——区块头部可选、持久化的开关。开启后,每次切换当前会话都会把其所在分组移到分组顺序顶部(与工作区菜单「移到顶部」项相同的 Host 持久化重排),每组至多一次;未分组桶永不移动。默认关闭。
- **移到顶部**——核心工作区菜单项(随所需 harness 改动一同交付):手动把任意分组移到侧边栏顶部。

置顶状态保存在浏览器 localStorage(`dsh.sessionPin.v1`)。

## 截图

截图基于运行所需核心改动的 GUI;见[环境要求](#环境要求)。

| 置顶区块 + 行内开关 | 自动跟随 |
|---|---|
| ![置顶区块](screenshots/pinned-board.png) | ![自动跟随](screenshots/auto-follow.png) |

## 环境要求

本插件依赖两个增量 slot 挂载点和三个图标,它们只存在于 harness 源码检出中——**官方 npm 版 `dsh` 尚未包含**:

- `sidebar.workspaces.sections` 与 `sidebar.workspaces.sessionActions` slot(由 `ui-workspace` 声明)
- `IconPinOutline16` / `IconPinFill16` / `IconToTopOutline16`(位于 `ui-primitives`)

目前这意味着需要使用 [Wzh0718/deepseek-harness](https://github.com/Wzh0718/deepseek-harness) 的 `feat/session-pin` 分支(或任何包含这些核心改动的检出)运行 GUI。在官方发布的 GUI 上安装本插件会在 client bundle 加载时失败。

## 安装

```sh
dsh plugin --profile web add github:Wzh0718/dsh-client-ui-session-pin
```

一条命令即可。仓库已随附预构建的 `lib/`,安装时无需任何编译。该命令会把包 pnpm 安装到 `$DSH_HOME/profiles/web/`(默认 `~/.dsh/profiles/web/`)、同步 profile 的 `dsh.profile.bundles` 列表,下次启动时由 bundle 自带的 `cordis.patch.yml` 挂载插件。重启 `dsh web`(或刷新页面)即可加载。

需要锁定版本时在 spec 后追加 `#v0.1.0` 或 `#分支名`。卸载:

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-session-pin
```

`scripts/install.sh` 保留为手工/离线回退方案(把包复制进 profile 的 healed `node_modules`,并向 profile 的 `cordis.patch.yml` 追加 insert 行)。

## 卸载

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-session-pin
```

两个扩展 slot 渲染为空,其余不变。

## 从源码构建

`lib/` 已预构建并随仓库提交——只有当你要修改插件时才需要以下步骤。

```sh
# 1. 包含核心挂载点的 harness 同级检出
git clone -b feat/session-pin https://github.com/Wzh0718/deepseek-harness.git ../deepseek-harness
(cd ../deepseek-harness && pnpm install)

# 2. 本仓库(devDependencies 通过 link: 指向同级检出)
pnpm install
pnpm run typecheck   # tsc -b
pnpm run bundle      # tsdown → lib/client.js
pnpm run test        # vitest(jsdom 组件测试)
```

`link:` devDependencies 默认 harness 检出位于 `../deepseek-harness`;若你的检出在其他位置,请调整 `package.json` 中的路径。若 `pnpm install` 拒绝某个 `link:` 目标(pnpm 会校验 link 包的 exports),可手工创建符号链接:

```sh
mkdir -p node_modules/@deepseek-ai
link_pkg() { ln -s "../../../deepseek-harness/$1" "node_modules/@deepseek-ai/$2"; }
link_pkg vendor/cordis @deepseek-ai/cordis
link_pkg packages/api/session-controller @deepseek-ai/dsh-api-session-controller
link_pkg packages/api/workspace-controller @deepseek-ai/dsh-api-workspace-controller
link_pkg packages/client/locale @deepseek-ai/dsh-client-locale
link_pkg packages/client/store @deepseek-ai/dsh-client-store
link_pkg packages/client/ui-primitives @deepseek-ai/dsh-client-ui-primitives
link_pkg packages/client/ui-renderer @deepseek-ai/dsh-client-ui-renderer
link_pkg packages/client/ui-session @deepseek-ai/dsh-client-ui-session
link_pkg packages/client/ui-slots @deepseek-ai/dsh-client-ui-slots
link_pkg packages/client/ui-workspace @deepseek-ai/dsh-client-ui-workspace
link_pkg packages/core/session @deepseek-ai/dsh-session
link_pkg packages/test-support/client-runtime @deepseek-ai/dsh-client-test-runtime
```

组件测试(`tests/*.client.spec.tsx`)运行在 `vitest.config.ts` 上:它通过 `tsconfig.test.json` 中的映射表把 `@deepseek-ai/*` 导入解析到同级检出的 `src`。harness 新增或重命名包后,运行 `pnpm run gen:tsconfig` 重新生成该表。

## 开发备注

- 插件通过 `ctx.slots.inject()` 注册进两个挂载点,经框架 hook(`useSessions` / `useWorkspaces`)读取实时数据;它唯一需要的重排通道是 sections 挂载点的 `moveWorkspaceToTop` owner prop。
- 同一份源码也存在于 harness 检出的 `packages/client/ui-session-pin`,完整的 harness 门禁(覆盖率、i18n、slot catalog)在那里运行。本仓库是独立分发版。
- 设计记录:harness fork 中的 [Agent Note](https://github.com/Wzh0718/deepseek-harness/blob/feat/session-pin/.agents/notes/implemented/feature/2026-09-22-workspace-browser-extension-holes.md)。

## 许可证

[MIT](LICENSE)
