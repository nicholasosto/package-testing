# AI coding agent guide for this repo (roblox-ts)

## Big picture
- roblox-ts project; TypeScript compiles to Lua. Source in `src/{client,server,shared}` → build output in `out/{client,server,shared}` (see `tsconfig.json`).
- `default.project.json` (Rojo) maps build output into the DataModel:
  - `ServerScriptService/TS` ← `out/server`
  - `StarterPlayer/StarterPlayerScripts/TS` ← `out/client`
  - `ReplicatedStorage/TS` ← `out/shared`
- Shared code lives in `src/shared` and is imported from both sides, e.g. `import { makeHello } from "shared/module"`.

## Dev workflow (PowerShell)
```powershell
# install node deps (pnpm pinned in package.json)
pnpm install

# install toolchain from aftman (Rojo 7.5.1)
aftman install

# compile once / watch
yarn --version > $null 2>&1; pnpm run build
pnpm run watch

# live sync to Studio
rojo serve default.project.json
```

## Conventions that matter here
- Imports are root-relative to `src` (`baseUrl: "src"`). Use paths like `shared/module`, `client/...`, `server/...`.
- Don’t import from `out/`; it’s generated. Author only in `src/*`.
- Side separation:
  - `src/server`: server-only APIs; emitted under `ServerScriptService/TS`.
  - `src/client`: client-only scripts; emitted under `StarterPlayerScripts/TS`.
  - `src/shared`: platform-neutral utilities and types.
- Strict TS is enabled; JSX is configured (`jsx: react`) but not used yet. Prefer Roblox primitives (e.g., `print`) over `console`.
- Runtime libs (`include/Promise.lua`, `include/RuntimeLib.lua`) and `node_modules/@rbxts` are exposed via `ReplicatedStorage/rbxts_include` per `default.project.json`.

## MCP servers — use them here
- Pattern scaffolds: generate ready-to-use starters for common needs (player-data, networking, UI app, zone). Place new files only under `src/{server,client,shared}` and import via baseUrl (e.g., `shared/util/foo`).
- Syntax guardrails: validate Roblox-ts syntax before large edits to catch typing/roblox-ts specifics early.
- Fast compile checks: simulate TypeScript→Lua for target side (server/client/shared) to surface side-only API mistakes before running `rbxtsc`.
- Docs help: search/summarize official Roblox docs for specific APIs (RemoteEvents, DataStoreService, TweenService, etc.) and prefer examples aligned with roblox-ts.
- Package intelligence: analyze/troubleshoot `@rbxts/*` packages and get integration suggestions for use cases (e.g., net, profile-store, Fusion/Roact).

Recommended flow with MCP
1) New feature: generate pattern → adapt filenames/exports to repo conventions → simulate-build per side (server/client/shared) → run full build and Rojo serve.
2) Bugfix: validate syntax → simulate-build on the affected side → if third-party libs are involved, run package analysis/troubleshoot → apply focused edits.
3) API usage: search docs and/or summarize a doc page; prefer official Roblox references and keep code platform-neutral when under `shared`.

Contracts for generators/edits
- Never write to `out/` or `include/`; only author in `src/*`.
- Keep shared code free of server/client-only APIs; split code if needed.
- Preserve style: tabs and semicolons; imports root-relative to `src`.
- Small, acyclic modules; avoid cross-layer circular deps.

## What’s already here (use as examples)
- `src/shared/module.ts` exports `makeHello(name: string): string`.
- `src/client/main.client.ts` and `src/server/main.server.ts` both import that and `print(...)` to demonstrate shared usage.
- `default.project.json` sets safety toggles: `Workspace.FilteringEnabled = true`, `HttpService.HttpEnabled = true`, `SoundService.RespectFilteringEnabled = true`.

## Lint/format
- ESLint/Prettier are in devDependencies (`eslint-plugin-roblox-ts` included) but no configs are checked in. Keep the current style (tabs, semicolons). If you add configs, keep roblox-ts rules compatible.

## Adding things correctly
- New server feature: `src/server/MyFeature.server.ts` (or under a folder). It will be mapped to `ServerScriptService/TS` after build.
- New shared util: `src/shared/util/foo.ts`, import with `import { foo } from "shared/util/foo"`.
- New client script: `src/client/HUD.client.ts`, mapped under `StarterPlayerScripts/TS`.
- Dependencies: prefer `@rbxts/*` packages only. Avoid generic Node packages.

## Adding packages (@rbxts/*) and using them
- Install runtime libraries with `pnpm add <pkg>` (e.g., `@rbxts/fusion`, `@rbxts/net`, `@rbxts/profile-store`). They should be dependencies (not devDeps) so they ship to runtime via `rbxts_include`.
- No Rojo changes are needed: `default.project.json` exposes `include/` and `node_modules/@rbxts` under `ReplicatedStorage/rbxts_include`.
- Import external packages by scope name and locals via baseUrl:
  - External: `import Fusion from "@rbxts/fusion"` (don’t use unscoped names like `fusion`).
  - Local: `import { makeHello } from "shared/module"`.
- Side separation: place UI libs (Fusion/Roact) usage in `src/client`; keep `src/shared` free of client/server-only APIs and only export platform-neutral helpers/types.
- After install: run `pnpm run build` (or `pnpm run watch`) to compile; Rojo will serve from `out/*`.
- MCP assist after adding a package:
  - Run package intelligence to check for peer deps and typical wiring.
  - Simulate builds per side to catch API misuse early (e.g., UI code in shared or server-only services on client).
  - If unsure about an API, search/summarize Roblox docs and prefer roblox-ts examples.

## Pitfalls to avoid
- Putting server-only APIs into `src/shared` breaks client side; keep shared code platform-neutral.
- Circular imports across `client/server/shared` will surface at runtime; keep modules small and acyclic.
- Don’t edit `out/` or `rbxts_include` by hand; they’re build/runtime artifacts.

If any workflow differs in your setup (e.g., alternative Rojo usage), let me know so I can update these instructions accordingly.
