# Notification Center

A notification center project built with React + TypeScript + Vite, featuring a dynamic HTML template builder.

## Features

- **React + TypeScript + Vite** - Modern development setup with HMR
- **HTML Template Builder** - Dynamic, type-safe notification templates
- **Sciter Integration** - Ready for native bridge communication
- **Multi-language Support** - Built-in i18n for notifications

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## HTML Template Builder

Dynamic, type-safe HTML template builder for creating customizable notification templates.

### Quick Start

```typescript
import { HtmlTemplateBuilder } from './src/lib/htmlTemplateBuilder';

// Simple example
const html = new HtmlTemplateBuilder()
  .setTitle('My Notification')
  .setSubtitle('This is a subtitle')
  .setColors({ cardBackground: '#f0f0f0' })
  .build();
```

### Presets

```typescript
// Dark theme
const html = HtmlTemplateBuilder.createDarkTheme()
  .setTitle('Dark Mode')
  .build();

// Minimal
const html = HtmlTemplateBuilder.createMinimal()
  .setTitle('Simple Alert')
  .build();
```

### Demo

```bash
npm run demo
```

Opens an interactive browser demo with live examples.

### Documentation

- **[Quick Start Guide](README_TEMPLATE_BUILDER.md)** - Basic usage and examples
- **[Full Documentation](docs/HTML_TEMPLATE_BUILDER.md)** - Complete API reference
- **[Usage Examples](src/lib/examples.ts)** - 11 real-world examples
- **[Advanced Patterns](src/lib/usage-example.ts)** - 7 advanced patterns
- **[Summary](SUMMARY.md)** - Implementation overview

### Features

- ✅ Fluent API with method chaining
- ✅ Type-safe configuration
- ✅ Multiple presets (Dark, Minimal, Compact)
- ✅ Full i18n support
- ✅ Sciter bridge integration
- ✅ Interactive demo
- ✅ Extensive documentation
