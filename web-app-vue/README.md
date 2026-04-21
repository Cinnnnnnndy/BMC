# 拓扑视图 Vue (web-app-vue)

Vue 3 + VueFlow port of the TaiShan topology view from `web-app/`. The React
view under `web-app/` is left untouched — this is a parallel subproject that
mirrors the same functionality and styling using the team's preferred stack.

## Stack

- Vue 3.4 (`<script setup>` + TS)
- [`@vue-flow/core`](https://vueflow.dev/) + `background` / `controls` / `minimap`
- Vite 5 + `vue-tsc`

## Run

```bash
cd web-app-vue
npm install
npm run dev
```

Opens on http://localhost:5180 (chosen to avoid clashing with the React
dev server on 5175).

If your local `~/.npm` cache has permission residue, install with an
alternate cache folder:

```bash
npm install --cache /tmp/npm-cache-vue
```

Other scripts:

- `npm run typecheck` — runs `vue-tsc --noEmit`
- `npm run build` — typecheck + `vite build` (output in `dist/`)
- `npm run preview` — preview the built bundle

> **zsh tip:** zsh does not treat `#` as a comment on the interactive command
> line by default. If you paste a command with a trailing `# …` note, zsh
> passes `#` as an argument and npm/vite will fail. Either strip the trailing
> comment or run `setopt interactive_comments` once in your shell.

## Layout

```
web-app-vue/
├─ src/
│  ├─ main.ts                 # bootstraps Vue + imports VueFlow CSS + tokens
│  ├─ App.vue                 # thin wrapper around <TopologyView/>
│  ├─ TopologyView.vue        # main SFC: palette + VueFlow canvas + panel
│  ├─ data/
│  │  ├─ palette.ts           # color palette `C` (pink/purple/green/chipColor…)
│  │  └─ initialGraph.ts      # ported buildInitialNodes/Edges
│  ├─ nodes/
│  │  ├─ ChipIcon.vue         # shared SVG chip icon
│  │  ├─ GroupNode.vue        # board container
│  │  ├─ BusNode.vue  SMBusNode.vue  MuxNode.vue
│  │  ├─ ChipNode.vue  BigChipNode.vue
│  ├─ composables/
│  │  └─ useAutoLayout.ts     # port of computeAutoLayout() (bus→mux→chips)
│  └─ styles/
│     ├─ design-tokens.css    # full copy of the React app's CSS variables
│     └─ topology.css         # palette / panel / overlay styling
```

## Notes

- Uses VueFlow's `parentNode` (the equivalent of ReactFlow's `parentId`).
- Node component definitions are wrapped with `markRaw` to skip Vue reactivity.
- ELK cross-board layout is intentionally deferred for v1 — the initial
  positions from `buildInitialNodes()` already match the reference screenshot,
  and `computeAutoLayout` only tightens per-board sizes + stacks bus/mux/chips.
