---
name: dark-light-mode
description: Guidelines, color tokens, and standards for creating and updating ClientScope UI components with complete Light and Dark mode support.
---

# Skill: Dark and Light Mode Implementation

Use this skill whenever building, updating, or reviewing UI components, pages, or layouts in ClientScope.

## Architecture

ClientScope uses a zero-flicker, hydration-safe theme architecture:
1. **Core Provider**: `src/components/theme/theme-provider.tsx`
   - Stores preference in `localStorage` under `clientscope-theme`.
   - Supports `"light"`, `"dark"`, and `"system"` modes.
   - Listens to OS `prefers-color-scheme` when in system mode.
   - Subscribes via `useSyncExternalStore` for React 19 compatibility.
2. **FOUC Prevention**: `ThemeScript` in `src/app/layout.tsx`
   - Executes synchronously in `<head>` to avoid flash of white when loading in dark mode.
3. **Tailwind v4 Configuration**:
   - `src/app/globals.css` declares `@custom-variant dark (&:where(.dark, .dark *));`.
   - Uses `.dark` on `document.documentElement` to trigger all `dark:...` utility classes.
4. **Header Toggle**: `src/components/theme/theme-toggle.tsx`
   - Interactive dropdown with keyboard accessibility and status indicator.

## Standard Color Mappings

| Role | Light Mode Class | Dark Mode Class |
| :--- | :--- | :--- |
| Main Page Background | `bg-[#F5F6FA]` | `dark:bg-zinc-950` |
| Primary Card Surface | `bg-white` | `dark:bg-zinc-900` |
| Secondary/Muted Surface | `bg-zinc-50`, `bg-zinc-100` | `dark:bg-zinc-800`, `dark:bg-zinc-800/80` |
| Primary Text | `text-slate-950`, `text-zinc-900` | `dark:text-zinc-50`, `dark:text-zinc-100` |
| Secondary Text | `text-slate-500`, `text-zinc-500` | `dark:text-zinc-400` |
| Subtle/Placeholder Text | `text-zinc-400` | `dark:text-zinc-500` |
| Primary Border | `border-zinc-200` | `dark:border-zinc-800` |
| Subtle Border/Divider | `border-zinc-100` | `dark:border-zinc-800` |
| Interactive Border | `border-zinc-200 hover:border-zinc-300` | `dark:border-zinc-700 dark:hover:border-zinc-600` |
| Primary Accent | `text-blue-600` / `bg-blue-600` | `dark:text-blue-400` / `dark:bg-blue-500` |

## Implementation Rules
1. Never commit a component that looks great in light mode but lacks `dark:` styling.
2. Avoid dark text on dark backgrounds or white text on white backgrounds.
3. Always test interactive states (`hover`, `focus-visible`, `active`) in both modes.
