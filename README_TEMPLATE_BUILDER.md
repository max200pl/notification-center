# HTML Template Builder

Dynamic, type-safe HTML template builder for notification templates with fluent API.

## ✨ Features

- 🎨 **Fluent API** - Chain methods for clean configuration
- 🔒 **Type-Safe** - Full TypeScript support
- 🎭 **Presets** - Dark theme, minimal, compact configurations
- 🌍 **i18n Ready** - Built-in internationalization support
- ⚡ **Reactive** - Live counter, language switching, dynamic updates
- 🔌 **Bridge Ready** - Sciter integration out of the box
- 🎯 **Drag & Drop** - Visual button positioning with mouse (NEW!)

## 🚀 Quick Start

```typescript
import { HtmlTemplateBuilder } from './src/lib/htmlTemplateBuilder';

// Simple example
const html = new HtmlTemplateBuilder()
  .setTitle('My Notification')
  .setSubtitle('This is a subtitle')
  .setColors({ cardBackground: '#f0f0f0' })
  .build();
```

## 📖 Basic Examples

### Default Template
```typescript
const html = new HtmlTemplateBuilder().build();
```

### Dark Theme
```typescript
const html = HtmlTemplateBuilder.createDarkTheme()
  .setTitle('Dark Notification')
  .build();
```

### Minimal Template
```typescript
const html = HtmlTemplateBuilder.createMinimal()
  .setTitle('Simple Alert')
  .setSubtitle('Click OK to continue')
  .build();
```

### Custom Colors
```typescript
const html = new HtmlTemplateBuilder()
  .setTitle('Custom Theme')
  .setColors({
    cardBackground: '#e8f5e9',
    borderColor: '#4caf50',
    textColor: '#1b5e20',
  })
  .build();
```

### Custom Buttons
```typescript
const html = new HtmlTemplateBuilder()
  .setTitle('Choose Action')
  .setButtons([
    { id: 'confirm', label: 'Confirm', action: 'confirm' },
    { id: 'cancel', label: 'Cancel', action: 'cancel' },
  ])
  .build();
```

### Multi-language Support
```typescript
const html = new HtmlTemplateBuilder()
  .setI18n({
    en: {
      title: 'File deleted: {fileName}',
      subtitle: 'Size: {fileSize} MB',
    },
    es: {
      title: 'Archivo eliminado: {fileName}',
      subtitle: 'Tamaño: {fileSize} MB',
    },
  })
  .setDefaultLang('en')
  .setInitialPayload({ fileName: 'document.pdf', fileSize: 2.5 })
  .build();
```

## 🎯 Common Use Cases

### Success Notification
```typescript
const html = new HtmlTemplateBuilder()
  .setTitle('Success!')
  .setSubtitle('Operation completed')
  .setColors({
    cardBackground: '#d4edda',
    borderColor: '#28a745',
    textColor: '#155724',
  })
  .setButtons([{ id: 'ok', label: 'OK', action: 'confirm' }])
  .setBadge({ show: false })
  .showDebugArea(false)
  .build();
```

### Error Notification
```typescript
const html = new HtmlTemplateBuilder()
  .setTitle('Error')
  .setSubtitle('Something went wrong')
  .setColors({
    cardBackground: '#f8d7da',
    borderColor: '#dc3545',
    textColor: '#721c24',
  })
  .setButtons([
    { id: 'retry', label: 'Retry', action: 'retry' },
    { id: 'cancel', label: 'Cancel', action: 'cancel' },
  ])
  .showDebugArea(false)
  .build();
```

### Branded Template
```typescript
const html = new HtmlTemplateBuilder()
  .setTitle('WinZip Cleaner')
  .setSubtitle('Optimizing your system')
  .setColors({
    cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.8)',
  })
  .setButtons([
    { id: 'clean', label: 'Clean Now', action: 'clean' },
    { id: 'settings', label: 'Settings', action: 'settings' },
  ])
  .showDebugArea(false)
  .build();
```

## 🛠️ API Reference

### Configuration Methods

| Method | Description |
|--------|-------------|
| `setDimensions(width, minHeight)` | Set card width and minimum height |
| `setColors(colors)` | Configure theme colors |
| `setTitle(title)` | Set main title text |
| `setSubtitle(subtitle)` | Set subtitle text |
| `setBadge(config)` | Configure or hide badge |
| `setButtons(buttons)` | Set all buttons |
| `addButton(button)` | Add single button |
| `showDebugArea(show)` | Show/hide debug area |
| `setI18n(i18n)` | Configure translations |
| `setDefaultLang(lang)` | Set default language |
| `setInitialPayload(payload)` | Set initial data |
| `setCounterInterval(ms)` | Set counter update interval |
| `build()` | Generate HTML string |

### Presets

| Preset | Description |
|--------|-------------|
| `HtmlTemplateBuilder.createDarkTheme()` | Pre-configured dark theme |
| `HtmlTemplateBuilder.createLightTheme()` | Default light theme |
| `HtmlTemplateBuilder.createMinimal()` | Minimal template (single button, no badge) |
| `HtmlTemplateBuilder.createCompact()` | Compact dimensions (350×300) |

### Convenience Function

```typescript
import { buildHtmlTemplate } from './src/lib/htmlTemplateBuilder';

const html = buildHtmlTemplate({
  width: 600,
  minHeight: 500,
  title: 'Quick Setup',
  colors: { cardBackground: '#f0f0f0' },
  buttons: [{ id: 'ok', label: 'OK', action: 'confirm' }],
  showDebugArea: false,
});
```

## 📱 Runtime Communication

### From Template to Host (Sciter)

```javascript
// Template calls these automatically
window.jsBridgeCall('template:onReady', { lang: 'en', ts: Date.now() });
window.jsBridgeCall('template:onSize', { width: 450, height: 420 });
window.jsBridgeCall('template:onAction', { action: 'cta_click', lang: 'en' });
```

### From Host (Sciter) to Template

```javascript
// Initialize
window.__fromSciter({ type: 'init', lang: 'uk', payload: { count: 25 } });

// Update language
window.__fromSciter({ type: 'setLang', lang: 'ru' });

// Update translations
window.__fromSciter({ type: 'setI18n', i18n: { /* ... */ } });

// Update payload
window.__fromSciter({ type: 'update', payload: { count: 30 } });
```

## 🧪 Demo

Open `demo.html` in your browser to see live examples:

```bash
open demo.html
```

The demo includes:
- Default template
- Dark theme
- Minimal template
- Custom colors
- Custom buttons
- Success theme

## 📚 Full Documentation

See [docs/HTML_TEMPLATE_BUILDER.md](docs/HTML_TEMPLATE_BUILDER.md) for:
- Complete API reference
- All configuration options
- Advanced examples
- TypeScript types
- Best practices
- Troubleshooting

## 📁 Files

```
src/lib/
  ├── htmlTemplateBuilder.ts  # Main builder class
  ├── examples.ts             # 11 usage examples
  └── buildHtml.ts            # Updated with exports

docs/
  └── HTML_TEMPLATE_BUILDER.md  # Full documentation

demo.html                     # Interactive demo
README_TEMPLATE_BUILDER.md    # This file
```

## 💡 Tips

1. **Use presets** - Start with `createDarkTheme()` or `createMinimal()`
2. **Hide debug area in production** - Always use `.showDebugArea(false)`
3. **Test with demo** - Open `demo.html` to preview your templates
4. **Check examples** - See `examples.ts` for 11 real-world examples

## 🔧 Migration from Static Template

**Before:**
```typescript
export const templateHtml = `<html>...</html>`;
```

**After:**
```typescript
import { HtmlTemplateBuilder } from './lib/htmlTemplateBuilder';

export const templateHtml = new HtmlTemplateBuilder()
  .setColors({ /* your colors */ })
  .build();
```

## 📝 License

Part of notification-center project.

---

Made with ❤️ for dynamic HTML templates
