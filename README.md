# dsh-client-ui-session-pin

English | [中文](README.zh.md)

Pinned sessions and group following for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI sidebar.

A DSH client plugin that adds:

- **Pinned board** — a collapsible **Pinned** section above the session list (wide mode). Pinned sessions sort most-recently-pinned first and show their owning workspace label. Click a row to open the session; unpin from the row.
- **Row pin toggle** — every session row gets a pin button beside its menu (revealed on hover, like the menu itself). The provisional blank New Session row cannot be pinned.
- **Auto-follow** — an optional, persisted toggle in the board header. While on, each change of the current session moves its workspace group to the top of the group order (the same Host-persisted reorder as the workspace menu's **Move to top**), at most once per group. The ungrouped bucket never moves. Off by default.
- **Move to top** — a core workspace-menu item (shipped with the required harness changes): move any group to the top of the sidebar manually.

Pin state persists in browser localStorage (`dsh.sessionPin.v1`).

## Screenshots

Captured against a GUI running the required core changes; see [Requirements](#requirements).

| Pinned board + row toggle | Auto-follow |
|---|---|
| ![Pinned board](screenshots/pinned-board.png) | ![Auto-follow](screenshots/auto-follow.png) |

## Requirements

The plugin builds on two additive slot mount points and three icons that only exist in a harness source checkout — **the released npm `dsh` does not include them yet**:

- `sidebar.workspaces.sections` and `sidebar.workspaces.sessionActions` slots (declared by `ui-workspace`)
- `IconPinOutline16` / `IconPinFill16` / `IconToTopOutline16` (in `ui-primitives`)

Currently that means running the GUI from [Wzh0718/deepseek-harness](https://github.com/Wzh0718/deepseek-harness) branch `feat/session-pin` (or any checkout containing those core changes). Installing the plugin on a released GUI fails at client-bundle load.

## Install

```sh
dsh plugin --profile web add github:Wzh0718/dsh-client-ui-session-pin
```

That's all. The repo ships prebuilt `lib/`, so nothing compiles at install time. The command pnpm-installs the package into `$DSH_HOME/profiles/web/` (default `~/.dsh/profiles/web/`), syncs the profile's `dsh.profile.bundles` list, and on the next boot the bundle's `cordis.patch.yml` mounts the plugin. Restart `dsh web` (or refresh the page) to load it.

Pin a tag or branch by appending `#v0.1.0` / `#branch` to the spec. To uninstall:

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-session-pin
```

`scripts/install.sh` remains as a manual, offline fallback (copies the package into the profile's healed `node_modules` and appends the insert row to the profile's `cordis.patch.yml`).

## Uninstall

```sh
dsh plugin --profile web remove @deepseek-ai/dsh-client-ui-session-pin
```

Both extension holes render empty; nothing else changes.

## Build from source

`lib/` is prebuilt and committed — you only need this to hack on the plugin.

```sh
# 1. sibling checkout of the harness containing the core mount points
git clone -b feat/session-pin https://github.com/Wzh0718/deepseek-harness.git ../deepseek-harness
(cd ../deepseek-harness && pnpm install)

# 2. this repo (devDependencies link: into the sibling checkout)
pnpm install
pnpm run typecheck   # tsc -b
pnpm run bundle      # tsdown → lib/client.js
pnpm run test        # vitest (jsdom component specs)
```

The `link:` devDependencies expect the harness checkout at `../deepseek-harness`; adjust the paths in `package.json` if yours lives elsewhere. If `pnpm install` rejects a `link:` target (pnpm validates linked-package exports), create the symlinks by hand instead:

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

The component specs (`tests/*.client.spec.tsx`) run under `vitest.config.ts`, which resolves `@deepseek-ai/*` imports through the sibling checkout's `src` via the mapping table in `tsconfig.test.json`. Regenerate that table (`pnpm run gen:tsconfig`) after the harness adds or renames packages.

## Development notes

- The plugin registers into the two holes via `ctx.slots.inject()` and reads live data through the framework hooks (`useSessions` / `useWorkspaces`); the only reorder channel it needs is the sections hole's `moveWorkspaceToTop` owner prop.
- The same source also lives in the harness checkout at `packages/client/ui-session-pin`, where the full harness gates (coverage, i18n, slot catalog) run against it. This repo is the standalone distribution.
- Design record: [Agent Note](https://github.com/Wzh0718/deepseek-harness/blob/feat/session-pin/.agents/notes/implemented/feature/2026-09-22-workspace-browser-extension-holes.md) in the harness fork.

## License

[MIT](LICENSE)
