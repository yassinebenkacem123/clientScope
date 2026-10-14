# Dark and Light Mode Parity Rule

## Core Directive
Whenever writing, modifying, creating, or refactoring UI components, pages, layouts, modals, forms, dropdowns, navigation items, or interactive elements in ClientScope, you **MUST ALWAYS** design and implement full support for **both Light Mode and Dark Mode**.

Never write single-mode CSS or Tailwind classes that assume only a light or only a dark theme.

## Requirements

### 1. Color Pairings & Semantic Classes
Every background, text, border, and ring utility class must have a corresponding `dark:` variant:
- **Backgrounds**:
  - Light shell: `bg-[#F5F6FA]` -> Dark shell: `dark:bg-zinc-950`
  - Light card/surface: `bg-white` -> Dark card/surface: `dark:bg-zinc-900`
  - Light muted/subtle: `bg-zinc-100` / `bg-zinc-50` -> Dark muted: `dark:bg-zinc-800` / `dark:bg-zinc-800/60`
  - Light hover: `hover:bg-zinc-50` / `hover:bg-zinc-100` -> Dark hover: `dark:hover:bg-zinc-800` / `dark:hover:bg-zinc-700`
- **Text & Typography**:
  - Primary text: `text-slate-950` / `text-zinc-900` -> `dark:text-zinc-100` / `dark:text-zinc-50`
  - Secondary/muted text: `text-zinc-500` / `text-slate-500` -> `dark:text-zinc-400`
  - Tertiary/subtle text: `text-zinc-400` -> `dark:text-zinc-500`
  - Accents/links: `text-blue-600 dark:text-blue-400`
- **Borders & Dividers**:
  - Card/container borders: `border-zinc-200` / `border-zinc-200/80` -> `dark:border-zinc-800`
  - Subtle dividers: `border-zinc-100` -> `dark:border-zinc-800`
  - Interactive/input borders: `border-zinc-200 hover:border-zinc-300 focus:border-zinc-400` -> `dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-zinc-500`
- **Focus Rings & Outlines**:
  - Focus rings: `focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-900`

### 2. Shadows & Elevations
- Drop shadows in light mode (`shadow-xs`, `shadow-sm`, `shadow-[...]`) often look harsh or dirty in dark mode. Pair them with subtle dark borders or `dark:shadow-none` / `dark:shadow-zinc-950/40`.

### 3. Theme Provider Integration
- ClientScope uses the `ThemeProvider` (`@/components/theme/theme-provider`) with modes `"light"`, `"dark"`, and `"system"`.
- Dark mode is activated via the `.dark` class on `document.documentElement` and `@custom-variant dark (&:where(.dark, .dark *))` in `src/app/globals.css`.
- If your component needs to know the resolved theme dynamically in TypeScript/React, use the `useTheme()` hook:
  ```tsx
  import { useTheme } from "@/components/theme/theme-provider";
  const { theme, resolvedTheme, setTheme } = useTheme();
  ```

### 4. Verification Checklist Before Marking Done
Before concluding any UI work:
1. Check that text is clearly legible with sufficient contrast in both light and dark themes.
2. Verify that borders, cards, and dividers are distinct and not washed out in dark mode.
3. Test that interactive hover, active, and focus states trigger properly in both themes.
4. Ensure no unstyled white flashes occur during theme toggling or page reloads.
