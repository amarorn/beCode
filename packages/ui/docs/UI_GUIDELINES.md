# UI Guidelines & Design System

This document describes the design tokens, visual guidelines, and base components for the **beCode IDE**. The goal is to provide a consistent, accessible, and easily maintainable user interface.

## Design Tokens

We use Tailwind CSS for our design tokens to ensure consistency. The tokens are configured in `tailwind.config.js`.

### 1. Colors

The color palette is designed specifically for an IDE environment, supporting both Light and Dark modes.

#### Brand
- `brand-500` (#14b8a6) - Primary action color.
- Used for primary buttons, active states, and important highlights.

#### Surfaces & Backgrounds
- `surface`: The main background color (White in light mode, `#0f172a` in dark mode).
- `surface-alt`: Used for sidebars and panels (`#f8fafc` / `#1e293b`).
- `surface-muted`: Used for inactive tabs and subtle backgrounds.

#### Content (Text)
- `content`: Primary text color (`#0f172a` in light, `#f8fafc` in dark).
- `content-muted`: Secondary text for descriptions and less important information.

#### Semantic States (Status)
- `info`: Blue (`#3b82f6`)
- `success`: Green (`#22c55e`)
- `warning`: Yellow (`#eab308`)
- `error`: Red (`#ef4444`)

### 2. Typography

- **UI Font**: `Inter`, system-ui, sans-serif. Used for all general interface elements.
- **Code Font**: `Fira Code`, `JetBrains Mono`, monospace. Used for code editors, terminal output, and raw data display.

### 3. Spacing

We use a dense spacing scale optimized for IDEs where screen real estate is valuable:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px

## Base Components

All base components are accessible, support both light and dark modes, and do not hardcode colors (relying on the semantic tokens instead).

### Button
- **Variants**: `primary`, `secondary`, `ghost`, `danger`.
- **Sizes**: `sm`, `md`, `lg`.
- Used for user actions. Always use `ghost` or `secondary` for non-primary actions to reduce visual noise.

### Badge
- **Status**: `default`, `info`, `success`, `warning`, `error`.
- Used to represent the status of workspaces, jobs, or items.

### Input
- Supports `label`, `helperText`, and `error` states.
- Always use the `error` state when validation fails to give clear visual feedback.

### Modal
- Used for focused tasks like settings, confirmations, or complex forms.
- Traps focus and closes on `Escape` key for accessibility.

### Panel
- The base container for grouping UI elements.
- Automatically handles background colors and borders for light/dark mode.

## Best Practices

1. **No Hardcoded Colors**: Never use absolute colors like `#ff0000` or `text-red-500` directly in feature components. Always use semantic tokens like `text-status-error` or `text-content`.
2. **Accessibility (a11y)**: Ensure all interactive elements are focusable (using `ide-focus-ring`) and semantic HTML tags are used.
3. **Contrast**: The defined token palette ensures sufficient contrast. Do not deviate from the semantic pairings (e.g., `text-content` on `bg-surface`).
4. **Dark Mode First**: The IDE defaults to dark mode support. Ensure any new component looks native in both themes.
