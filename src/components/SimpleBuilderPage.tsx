import React, { useMemo, useState } from 'react';
import { HtmlTemplateBuilder } from '../lib/htmlTemplateBuilder';

type ThemeType = 'light' | 'dark' | 'minimal' | 'success' | 'error';

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SimpleBuilderPage() {
  const [title, setTitle] = useState('License expiring');
  const [subtitle, setSubtitle] = useState('Your license will expire in 3 days.');
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [buttonLabel, setButtonLabel] = useState('Renew');

  const html = useMemo(() => {
    let builder: HtmlTemplateBuilder;

    // Create builder based on theme
    switch (theme) {
      case 'dark':
        builder = HtmlTemplateBuilder.createDarkTheme();
        break;
      case 'minimal':
        builder = HtmlTemplateBuilder.createMinimal();
        break;
      case 'success':
        builder = new HtmlTemplateBuilder().setColors({
          cardBackground: '#d4edda',
          borderColor: '#28a745',
          textColor: '#155724',
        });
        break;
      case 'error':
        builder = new HtmlTemplateBuilder().setColors({
          cardBackground: '#f8d7da',
          borderColor: '#dc3545',
          textColor: '#721c24',
        });
        break;
      default: // light
        builder = new HtmlTemplateBuilder();
    }

    // Configure builder
    builder
      .setTitle(title)
      .setSubtitle(subtitle)
      .showDebugArea(false);

    // Add custom button for minimal theme
    if (theme === 'minimal') {
      builder.setButtons([{ id: 'cta', label: buttonLabel, action: 'cta_click' }]);
    } else {
      // Keep default buttons but update CTA label
      builder.setButtons([
        { id: 'switchLang', label: 'Switch language' },
        { id: 'applyPayload', label: 'Apply payload' },
        { id: 'closeWebview', label: 'Close WebView' },
        { id: 'cta', label: buttonLabel, action: 'cta_click' },
      ]);
    }

    return builder.build();
  }, [title, subtitle, theme, buttonLabel]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: 24,
        height: '100%',
        padding: 24,
        background: '#f5f7fa',
      }}
    >
      {/* Left Panel - Controls */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e1e4e8',
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
          📝 Simple Builder
        </h3>

        <label>
          <div
            style={{
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            Title
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </label>

        <label>
          <div
            style={{
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            Subtitle
          </div>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter notification subtitle..."
            rows={5}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </label>

        <label>
          <div
            style={{
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            Button text
          </div>
          <input
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
            placeholder="Enter button label..."
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </label>

        <label>
          <div
            style={{
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            Theme
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeType)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 14,
              background: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = '#667eea')}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            <option value="light">☀️ Light</option>
            <option value="dark">🌙 Dark</option>
            <option value="minimal">📋 Minimal</option>
            <option value="success">✅ Success (Green)</option>
            <option value="error">❌ Error (Red)</option>
          </select>
        </label>

        <button
          onClick={() => downloadHtml('notification.html', html)}
          style={{
            padding: '14px 20px',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: 15,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            marginTop: 8,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        >
          💾 Save as .html
        </button>

        <details
          style={{
            background: '#f9fafb',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
          }}
        >
          <summary
            style={{
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
              padding: '4px 0',
            }}
          >
            &lt;/&gt; Show HTML
          </summary>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 11,
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 16,
              borderRadius: 8,
              maxHeight: 300,
              overflow: 'auto',
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            {html}
          </pre>
        </details>
      </div>

      {/* Right Panel - Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            padding: '16px 20px',
            background: 'white',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            color: '#1a1a1a',
            border: '1px solid #e1e4e8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>👁️</span>
          <span>Live Preview</span>
          <div
            style={{
              marginLeft: 'auto',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
        </div>
        <iframe
          title="preview"
          srcDoc={html}
          style={{
            width: '100%',
            flex: 1,
            border: '1px solid #e1e4e8',
            borderRadius: 16,
            background: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
}
