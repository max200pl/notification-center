# HTML Template Builder - Documentation

## Overview

Dynamic HTML template builder for creating customizable notification templates with fluent API.

## Features

- **Fluent API** - Chain configuration methods
- **Type-safe** - Full TypeScript support
- **Presets** - Dark theme, minimal, compact configurations
- **Customizable** - Colors, dimensions, buttons, i18n, and more
- **Reactive** - Built-in counter, language switching, and payload updates
- **Bridge-ready** - Sciter integration via `window.__fromSciter` and `jsBridgeCall`

## Quick Start

```typescript
import { HtmlTemplateBuilder } from './lib/htmlTemplateBuilder';

// Simple example
const html = new HtmlTemplateBuilder()
  .setTitle('My Notification')
  .setSubtitle('This is a subtitle')
  .setColors({ cardBackground: '#f0f0f0' })
  .build();
```

## API Reference

### Constructor

```typescript
const builder = new HtmlTemplateBuilder();
```

### Configuration Methods

#### Dimensions

```typescript
builder.setDimensions(width: number, minHeight: number): this
```

Sets card width and minimum height in pixels.

```typescript
builder.setDimensions(600, 500);
```

#### Colors

```typescript
builder.setColors(colors: Partial<TemplateColors>): this
```

Configure theme colors:

```typescript
builder.setColors({
  background: 'transparent',
  cardBackground: 'white',
  textColor: 'black',
  subtitleColor: '#333',
  borderColor: '#ddd',
  buttonBg: '#f0f0f0',
  buttonBorder: '#ccc',
  badgeBg: '#efefef',
  dotColorActive: '#10b04a',
  dotColorDanger: '#ff3b30',
  debugBg: '#f6f6f6',
});
```

#### Content

```typescript
builder.setTitle(title: string): this
builder.setSubtitle(subtitle: string): this
```

Set main title and subtitle text:

```typescript
builder
  .setTitle('Installation Complete')
  .setSubtitle('Click OK to continue');
```

#### Badge

```typescript
builder.setBadge(badge: Partial<BadgeConfig>): this
```

Configure or hide the badge with counter:

```typescript
// Show badge with custom label
builder.setBadge({ show: true, label: 'Status' });

// Hide badge
builder.setBadge({ show: false });
```

#### Buttons

```typescript
builder.setButtons(buttons: ButtonConfig[]): this
builder.addButton(button: ButtonConfig): this
```

Configure buttons:

```typescript
// Replace all buttons
builder.setButtons([
  { id: 'ok', label: 'OK', action: 'confirm' },
  { id: 'cancel', label: 'Cancel', action: 'cancel' },
]);

// Add button incrementally
builder
  .addButton({ id: 'save', label: 'Save', action: 'save' })
  .addButton({ id: 'close', label: 'Close', action: 'close' });
```

Button configuration:
- `id` - HTML element ID
- `label` - Button text
- `action` (optional) - Action name sent via `jsBridgeCall`

#### Debug Area

```typescript
builder.showDebugArea(show: boolean): this
```

Show or hide the debug `<pre>` element:

```typescript
builder.showDebugArea(false); // Hide debug area
```

#### Internationalization

```typescript
builder.setI18n(i18n: I18nDictionary): this
builder.setDefaultLang(lang: string): this
```

Configure translations:

```typescript
builder
  .setI18n({
    en: {
      title: 'File deleted: {fileName}',
      subtitle: 'Size: {fileSize} MB',
      counter: 'Time elapsed',
      switch: 'Change language',
    },
    es: {
      title: 'Archivo eliminado: {fileName}',
      subtitle: 'Tamaño: {fileSize} MB',
      counter: 'Tiempo transcurrido',
      switch: 'Cambiar idioma',
    },
  })
  .setDefaultLang('en');
```

Translations support placeholders like `{fileName}` that are replaced from payload.

#### Initial Payload

```typescript
builder.setInitialPayload(payload: Record<string, any>): this
```

Set initial data for template variable substitution:

```typescript
builder.setInitialPayload({
  programName: 'WinZip',
  count: 12,
  version: '2.0',
});
```

#### Counter Interval

```typescript
builder.setCounterInterval(interval: number): this
```

Set counter update interval in milliseconds (default: 1000):

```typescript
builder.setCounterInterval(500); // Update every 500ms
```

### Build Method

```typescript
builder.build(): string
```

Generates the final HTML string:

```typescript
const html = builder.build();
// Returns complete HTML document
```

## Presets

Pre-configured templates for common use cases:

### Dark Theme

```typescript
const html = HtmlTemplateBuilder.createDarkTheme()
  .setTitle('Dark Notification')
  .build();
```

### Minimal

```typescript
const html = HtmlTemplateBuilder.createMinimal()
  .setTitle('Simple Alert')
  .build();
```

Minimal preset:
- No debug area
- Single CTA button
- No badge

### Compact

```typescript
const html = HtmlTemplateBuilder.createCompact()
  .setTitle('Compact View')
  .build();
```

Compact preset:
- Smaller dimensions (350×300)
- No debug area

### Light Theme (Default)

```typescript
const html = HtmlTemplateBuilder.createLightTheme()
  .setTitle('Light Notification')
  .build();
```

## Convenience Function

Simple configuration without chaining:

```typescript
import { buildHtmlTemplate } from './lib/htmlTemplateBuilder';

const html = buildHtmlTemplate({
  width: 600,
  minHeight: 500,
  title: 'Quick Setup',
  subtitle: 'Using convenience function',
  colors: {
    cardBackground: '#e8f5e9',
    borderColor: '#4caf50',
  },
  buttons: [
    { id: 'ok', label: 'OK', action: 'confirm' },
  ],
  showDebugArea: false,
});
```

## Runtime Communication

### From Template to Host (Sciter)

Template calls host via `jsBridgeCall`:

```javascript
// Automatically called on load
window.jsBridgeCall('template:onReady', { lang: 'en', ts: Date.now() });

// Size reporting
window.jsBridgeCall('template:onSize', { width: 450, height: 420 });

// Button actions
window.jsBridgeCall('template:onAction', { action: 'cta_click', lang: 'en' });
```

### From Host (Sciter) to Template

Host calls template via `window.__fromSciter`:

```javascript
// Initialize with data
window.__fromSciter({
  type: 'init',
  lang: 'uk',
  i18n: { /* translations */ },
  payload: { programName: 'Adobe', count: 25 }
});

// Update language
window.__fromSciter({
  type: 'setLang',
  lang: 'ru'
});

// Update translations
window.__fromSciter({
  type: 'setI18n',
  i18n: { /* new translations */ }
});

// Update payload
window.__fromSciter({
  type: 'update',
  payload: { count: 30 }
});
```

## Examples

### Example 1: Custom Branding

```typescript
const html = new HtmlTemplateBuilder()
  .setTitle('WinZip Cleaner')
  .setSubtitle('Optimizing your system')
  .setColors({
    cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    buttonBg: 'rgba(255, 255, 255, 0.2)',
    buttonBorder: 'rgba(255, 255, 255, 0.3)',
    dotColorActive: '#4ade80',
    dotColorDanger: '#f87171',
  })
  .setButtons([
    { id: 'clean', label: 'Clean Now', action: 'clean' },
    { id: 'settings', label: 'Settings', action: 'settings' },
  ])
  .showDebugArea(false)
  .build();
```

### Example 2: Multi-language Support

```typescript
const html = new HtmlTemplateBuilder()
  .setI18n({
    en: {
      title: 'Update Available',
      subtitle: 'Version {version} is ready to install',
      counter: 'Download time',
      switch: 'Language',
    },
    de: {
      title: 'Update verfügbar',
      subtitle: 'Version {version} ist installationsbereit',
      counter: 'Download-Zeit',
      switch: 'Sprache',
    },
    ja: {
      title: 'アップデート可能',
      subtitle: 'バージョン {version} のインストール準備完了',
      counter: 'ダウンロード時間',
      switch: '言語',
    },
  })
  .setDefaultLang('en')
  .setInitialPayload({ version: '2.5.0' })
  .build();
```

### Example 3: Conditional Styling

```typescript
function createNotification(type: 'success' | 'error' | 'warning') {
  const configs = {
    success: {
      colors: {
        cardBackground: '#d4edda',
        borderColor: '#28a745',
        textColor: '#155724',
      },
      title: 'Success',
    },
    error: {
      colors: {
        cardBackground: '#f8d7da',
        borderColor: '#dc3545',
        textColor: '#721c24',
      },
      title: 'Error',
    },
    warning: {
      colors: {
        cardBackground: '#fff3cd',
        borderColor: '#ffc107',
        textColor: '#856404',
      },
      title: 'Warning',
    },
  };

  const config = configs[type];

  return new HtmlTemplateBuilder()
    .setTitle(config.title)
    .setColors(config.colors)
    .build();
}
```

### Example 4: Step-by-Step Configuration

```typescript
const builder = new HtmlTemplateBuilder();

// Configure in steps
builder.setTitle('Installation Progress');
builder.setDimensions(480, 450);

// Add buttons dynamically
const actions = ['install', 'skip', 'cancel'];
actions.forEach(action => {
  builder.addButton({
    id: action,
    label: action.charAt(0).toUpperCase() + action.slice(1),
    action: `${action}_action`,
  });
});

// Conditional debug area
if (process.env.NODE_ENV === 'development') {
  builder.showDebugArea(true);
} else {
  builder.showDebugArea(false);
}

const html = builder.build();
```

## TypeScript Types

```typescript
interface TemplateColors {
  background?: string;
  cardBackground?: string;
  textColor?: string;
  subtitleColor?: string;
  borderColor?: string;
  buttonBg?: string;
  buttonBorder?: string;
  badgeBg?: string;
  dotColorActive?: string;
  dotColorDanger?: string;
  debugBg?: string;
}

interface ButtonConfig {
  id: string;
  label: string;
  action?: string;
}

interface BadgeConfig {
  show: boolean;
  dotColor?: string;
  label?: string;
}

interface I18nDictionary {
  [lang: string]: {
    [key: string]: string;
  };
}

interface TemplateConfig {
  width?: number;
  minHeight?: number;
  colors?: TemplateColors;
  title?: string;
  subtitle?: string;
  badge?: BadgeConfig;
  buttons?: ButtonConfig[];
  showDebugArea?: boolean;
  defaultLang?: string;
  i18n?: I18nDictionary;
  initialPayload?: Record<string, any>;
  counterInterval?: number;
}
```

## Best Practices

1. **Use Presets** - Start with presets and customize from there
2. **Hide Debug Area** - In production, always use `.showDebugArea(false)`
3. **Validate Actions** - Ensure button actions match your bridge handlers
4. **Escape User Data** - When setting titles/subtitles from user input, sanitize first
5. **Test Responsiveness** - Check different dimensions for your use case
6. **Language Fallbacks** - Always include 'en' translations as fallback
7. **Gradient Backgrounds** - Use linear-gradient for modern card backgrounds

## Migration from Static Template

Before:
```typescript
export const templateHtml = `<html>...</html>`;
```

After:
```typescript
import { HtmlTemplateBuilder } from './lib/htmlTemplateBuilder';

export const templateHtml = new HtmlTemplateBuilder()
  .setColors({ /* your colors */ })
  .setButtons([ /* your buttons */ ])
  .build();
```

## Performance

- Template generation is fast (< 1ms)
- No runtime dependencies
- Minimal JavaScript in generated HTML
- Optimized for Sciter WebView

## Troubleshooting

### Badge not showing
```typescript
builder.setBadge({ show: true }); // Explicitly enable
```

### Colors not applied
```typescript
// Make sure to use valid CSS colors
builder.setColors({
  cardBackground: '#ffffff', // ✓ Valid
  // cardBackground: 'invalid', // ✗ Invalid
});
```

### Buttons not calling bridge
```typescript
// Ensure jsBridgeCall is available in your Sciter environment
window.jsBridgeCall = async (method, payload) => {
  // Your bridge implementation
};
```

### i18n placeholders not replaced
```typescript
// Ensure payload has matching keys
builder
  .setI18n({ en: { title: 'Hello {name}' } })
  .setInitialPayload({ name: 'World' }); // ✓ Correct
```

## License

Part of notification-center project.
