/**
 * Real-world usage examples for HtmlTemplateBuilder
 */

import { HtmlTemplateBuilder, buildHtmlTemplate, type TemplateConfig } from './htmlTemplateBuilder';

// ============================================
// Example 1: Notification Factory
// ============================================

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export class NotificationFactory {
  private static readonly THEMES: Record<NotificationType, Partial<TemplateConfig>> = {
    success: {
      colors: {
        cardBackground: '#d4edda',
        borderColor: '#28a745',
        textColor: '#155724',
        subtitleColor: '#155724',
        buttonBg: '#c3e6cb',
        buttonBorder: '#28a745',
      },
    },
    error: {
      colors: {
        cardBackground: '#f8d7da',
        borderColor: '#dc3545',
        textColor: '#721c24',
        subtitleColor: '#721c24',
        buttonBg: '#f5c6cb',
        buttonBorder: '#dc3545',
      },
    },
    warning: {
      colors: {
        cardBackground: '#fff3cd',
        borderColor: '#ffc107',
        textColor: '#856404',
        subtitleColor: '#856404',
        buttonBg: '#ffeeba',
        buttonBorder: '#ffc107',
      },
    },
    info: {
      colors: {
        cardBackground: '#d1ecf1',
        borderColor: '#17a2b8',
        textColor: '#0c5460',
        subtitleColor: '#0c5460',
        buttonBg: '#bee5eb',
        buttonBorder: '#17a2b8',
      },
    },
  };

  static create(
    type: NotificationType,
    title: string,
    subtitle: string,
    _customConfig?: Partial<TemplateConfig>
  ): string {
    const theme = this.THEMES[type];

    return new HtmlTemplateBuilder()
      .setTitle(title)
      .setSubtitle(subtitle)
      .setColors(theme.colors!)
      .setButtons([
        { id: 'ok', label: 'OK', action: 'confirm' },
      ])
      .setBadge({ show: false })
      .showDebugArea(false)
      .build();
  }
}

// Usage:
// const html = NotificationFactory.create('success', 'Done!', 'File saved successfully');

// ============================================
// Example 2: Theme Manager
// ============================================

export class ThemeManager {
  private static themes = new Map<string, TemplateConfig>();

  static register(name: string, config: Partial<TemplateConfig>): void {
    this.themes.set(name, {
      width: 450,
      minHeight: 420,
      showDebugArea: false,
      ...config,
    } as TemplateConfig);
  }

  static create(themeName: string, overrides?: Partial<TemplateConfig>): string {
    const theme = this.themes.get(themeName);
    if (!theme) {
      throw new Error(`Theme "${themeName}" not found`);
    }

    return buildHtmlTemplate({ ...theme, ...overrides });
  }
}

// Register themes
ThemeManager.register('corporate', {
  colors: {
    cardBackground: '#ffffff',
    borderColor: '#0066cc',
    textColor: '#003366',
    buttonBg: '#0066cc',
    buttonBorder: '#0066cc',
  },
  buttons: [
    { id: 'confirm', label: 'Confirm', action: 'confirm' },
    { id: 'cancel', label: 'Cancel', action: 'cancel' },
  ],
});

ThemeManager.register('modern', {
  colors: {
    cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    subtitleColor: 'rgba(255, 255, 255, 0.8)',
  },
});

// Usage:
// const html = ThemeManager.create('corporate', { title: 'Welcome' });

// ============================================
// Example 3: Sciter Integration Helper
// ============================================

export interface SciterBridgeConfig {
  templateHtml: string;
  onReady?: (data: { lang: string; ts: number }) => void;
  onSize?: (data: { width: number; height: number }) => void;
  onAction?: (data: { action: string; lang?: string }) => void;
}

export class SciterBridge {
  private config: SciterBridgeConfig;

  constructor(builder: HtmlTemplateBuilder) {
    this.config = {
      templateHtml: builder.build(),
    };
  }

  onReady(callback: (data: { lang: string; ts: number }) => void): this {
    this.config.onReady = callback;
    return this;
  }

  onSize(callback: (data: { width: number; height: number }) => void): this {
    this.config.onSize = callback;
    return this;
  }

  onAction(callback: (data: { action: string; lang?: string }) => void): this {
    this.config.onAction = callback;
    return this;
  }

  getHtml(): string {
    return this.config.templateHtml;
  }

  // Mock jsBridgeCall implementation for testing
  mockBridgeCall(method: string, payload: any): any {
    switch (method) {
      case 'template:onReady':
        return this.config.onReady?.(payload);
      case 'template:onSize':
        return this.config.onSize?.(payload);
      case 'template:onAction':
        return this.config.onAction?.(payload);
      default:
        console.warn('Unknown bridge method:', method);
    }
  }

  // Send message to template
  sendToTemplate(message: any): void {
    // In real implementation, this would call Sciter's evaluate or similar
    console.log('Sending to template:', message);
  }
}

// Usage:
/*
const bridge = new SciterBridge(
  new HtmlTemplateBuilder()
    .setTitle('My App')
)
  .onReady((data) => {
    console.log('Template ready:', data);
  })
  .onAction((data) => {
    if (data.action === 'cta_click') {
      console.log('CTA clicked!');
    }
  });

const html = bridge.getHtml();
*/

// ============================================
// Example 4: Multi-language Notification
// ============================================

export class I18nNotificationBuilder {
  private builder: HtmlTemplateBuilder;

  constructor() {
    this.builder = new HtmlTemplateBuilder();
  }

  // Add language pack
  addLanguage(
    lang: string,
    translations: {
      title: string;
      subtitle: string;
      counter?: string;
      switch?: string;
      [key: string]: string | undefined;
    }
  ): this {
    const currentI18n = (this.builder as any).config.i18n || {};
    (this.builder as any).config.i18n = {
      ...currentI18n,
      [lang]: translations,
    };
    return this;
  }

  setPayload(payload: Record<string, any>): this {
    this.builder.setInitialPayload(payload);
    return this;
  }

  build(): string {
    return this.builder.build();
  }
}

// Usage:
/*
const html = new I18nNotificationBuilder()
  .addLanguage('en', {
    title: 'Update Available',
    subtitle: 'Version {version} is ready',
  })
  .addLanguage('fr', {
    title: 'Mise à jour disponible',
    subtitle: 'Version {version} est prête',
  })
  .addLanguage('de', {
    title: 'Update verfügbar',
    subtitle: 'Version {version} ist bereit',
  })
  .setPayload({ version: '2.5.0' })
  .build();
*/

// ============================================
// Example 5: Configuration Presets
// ============================================

export const PRESETS = {
  // Clean modern design
  modern: () =>
    new HtmlTemplateBuilder()
      .setDimensions(500, 400)
      .setColors({
        cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        subtitleColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        buttonBg: 'rgba(255, 255, 255, 0.2)',
        buttonBorder: 'rgba(255, 255, 255, 0.3)',
        badgeBg: 'rgba(255, 255, 255, 0.2)',
      })
      .showDebugArea(false),

  // Corporate professional
  corporate: () =>
    new HtmlTemplateBuilder()
      .setColors({
        cardBackground: '#ffffff',
        borderColor: '#0066cc',
        textColor: '#003366',
        subtitleColor: '#666666',
        buttonBg: '#0066cc',
        buttonBorder: '#0066cc',
      })
      .showDebugArea(false),

  // Minimalist
  minimalist: () =>
    HtmlTemplateBuilder.createMinimal()
      .setDimensions(400, 250)
      .setColors({
        cardBackground: '#fafafa',
        borderColor: '#e0e0e0',
      }),

  // Gaming style
  gaming: () =>
    new HtmlTemplateBuilder()
      .setColors({
        background: 'transparent',
        cardBackground: '#1a1a2e',
        textColor: '#eee',
        subtitleColor: '#16213e',
        borderColor: '#0f3460',
        buttonBg: '#e94560',
        buttonBorder: '#e94560',
        badgeBg: '#0f3460',
        dotColorActive: '#00ff88',
      })
      .showDebugArea(false),

  // Eco-friendly
  eco: () =>
    new HtmlTemplateBuilder()
      .setColors({
        cardBackground: '#e8f5e9',
        borderColor: '#4caf50',
        textColor: '#1b5e20',
        subtitleColor: '#2e7d32',
        buttonBg: '#66bb6a',
        buttonBorder: '#4caf50',
        badgeBg: '#c8e6c9',
        dotColorActive: '#4caf50',
      })
      .showDebugArea(false),
};

// Usage:
// const html = PRESETS.modern().setTitle('My App').build();

// ============================================
// Example 6: Builder with Validation
// ============================================

export class ValidatedTemplateBuilder {
  private builder: HtmlTemplateBuilder;
  private errors: string[] = [];

  constructor() {
    this.builder = new HtmlTemplateBuilder();
  }

  setTitle(title: string): this {
    if (!title || title.trim().length === 0) {
      this.errors.push('Title cannot be empty');
    } else if (title.length > 100) {
      this.errors.push('Title is too long (max 100 characters)');
    }
    this.builder.setTitle(title);
    return this;
  }

  setDimensions(width: number, height: number): this {
    if (width < 300 || width > 1000) {
      this.errors.push('Width must be between 300 and 1000');
    }
    if (height < 200 || height > 800) {
      this.errors.push('Height must be between 200 and 800');
    }
    this.builder.setDimensions(width, height);
    return this;
  }

  validate(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): string[] {
    return [...this.errors];
  }

  build(): string {
    if (!this.validate()) {
      throw new Error(`Validation failed:\n${this.errors.join('\n')}`);
    }
    return this.builder.build();
  }
}

// Usage:
/*
try {
  const html = new ValidatedTemplateBuilder()
    .setTitle('My Title')
    .setDimensions(450, 420)
    .build();
} catch (error) {
  console.error('Template validation failed:', error);
}
*/

// ============================================
// Example 7: Responsive Builder
// ============================================

export class ResponsiveTemplateBuilder {
  static createResponsive(screenSize: 'mobile' | 'tablet' | 'desktop'): HtmlTemplateBuilder {
    const configs = {
      mobile: {
        width: 320,
        minHeight: 300,
      },
      tablet: {
        width: 450,
        minHeight: 400,
      },
      desktop: {
        width: 600,
        minHeight: 500,
      },
    };

    const config = configs[screenSize];
    return new HtmlTemplateBuilder().setDimensions(config.width, config.minHeight);
  }
}

// Usage:
// const html = ResponsiveTemplateBuilder.createResponsive('mobile')
//   .setTitle('Mobile Notification')
//   .build();
