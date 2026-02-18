import { useMemo, useState, useEffect } from 'react';
import { HtmlTemplateBuilder, type ButtonConfig, type TemplateColors } from '../lib/htmlTemplateBuilder';

type PresetType = 'default' | 'dark' | 'minimal' | 'compact' | 'success' | 'error' | 'warning' | 'custom';

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function savePositionsToJson(buttons: any[], elementPositions: any) {
  const positions = {
    buttons: buttons.map(btn => ({
      id: btn.id,
      label: btn.label,
      position: btn.position,
    })),
    elements: elementPositions,
    timestamp: new Date().toISOString(),
  };

  const json = JSON.stringify(positions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'element-positions.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function AdvancedHtmlBuilderPage() {
  const [preset, setPreset] = useState<PresetType>('default');
  const [title, setTitle] = useState('Program removed: WinZip');
  const [subtitle, setSubtitle] = useState('Leftover files: 12');
  const [width, setWidth] = useState(450);
  const [minHeight, setMinHeight] = useState(420);
  const [showBadge, setShowBadge] = useState(true);
  const [showDebugArea, setShowDebugArea] = useState(true);
  const [language, setLanguage] = useState('en');
  const [globalDragMode, setGlobalDragMode] = useState(false);

  const [customColors, setCustomColors] = useState<TemplateColors>({
    cardBackground: '#ffffff',
    textColor: '#000000',
    borderColor: '#dddddd',
  });

  const [buttons, setButtons] = useState<ButtonConfig[]>([
    { id: 'switchLang', label: 'Switch language', position: { x: 10, y: 10 } },
    { id: 'applyPayload', label: 'Apply payload', position: { x: 200, y: 10 } },
    { id: 'closeWebview', label: 'Close WebView', position: { x: 10, y: 70 } },
    { id: 'cta', label: 'CTA', action: 'cta_click', position: { x: 200, y: 70 } },
  ]);

  // Store positions for all elements in global drag mode
  const [elementPositions, setElementPositions] = useState({
    header: { x: 10, y: 10 },
    badgeElement: { x: 10, y: 50 },
    subtitle: { x: 10, y: 90 },
    out: { x: 10, y: 400 },
  });

  // Listen for position updates from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'buttonPositionsUpdate') {
        const positions = event.data.positions;
        setButtons((prevButtons) =>
          prevButtons.map((btn) => ({
            ...btn,
            position: positions[btn.id] || btn.position || { x: 0, y: 0 },
          }))
        );
      }

      if (event.data?.type === 'elementPositionsUpdate') {
        const positions = event.data.positions;

        // Update button positions
        if (positions.buttons) {
          setButtons((prevButtons) =>
            prevButtons.map((btn) => ({
              ...btn,
              position: positions.buttons[btn.id] || btn.position || { x: 0, y: 0 },
            }))
          );
        }

        // Update other element positions
        if (positions.elements) {
          setElementPositions((prev) => ({
            ...prev,
            ...positions.elements,
          }));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Check if any button has draggable enabled
  const hasDraggableButtons = buttons.some(btn => btn.draggable);

  const html = useMemo(() => {
    let builder: HtmlTemplateBuilder;

    // Apply preset
    switch (preset) {
      case 'dark':
        builder = HtmlTemplateBuilder.createDarkTheme();
        break;
      case 'minimal':
        builder = HtmlTemplateBuilder.createMinimal();
        break;
      case 'compact':
        builder = HtmlTemplateBuilder.createCompact();
        break;
      case 'success':
        builder = new HtmlTemplateBuilder().setColors({
          cardBackground: '#d4edda',
          borderColor: '#28a745',
          textColor: '#155724',
          subtitleColor: '#155724',
          buttonBg: '#c3e6cb',
          buttonBorder: '#28a745',
        });
        break;
      case 'error':
        builder = new HtmlTemplateBuilder().setColors({
          cardBackground: '#f8d7da',
          borderColor: '#dc3545',
          textColor: '#721c24',
          subtitleColor: '#721c24',
          buttonBg: '#f5c6cb',
          buttonBorder: '#dc3545',
        });
        break;
      case 'warning':
        builder = new HtmlTemplateBuilder().setColors({
          cardBackground: '#fff3cd',
          borderColor: '#ffc107',
          textColor: '#856404',
          subtitleColor: '#856404',
          buttonBg: '#ffeeba',
          buttonBorder: '#ffc107',
        });
        break;
      case 'custom':
        builder = new HtmlTemplateBuilder().setColors(customColors);
        break;
      default:
        builder = new HtmlTemplateBuilder();
    }

    // Apply configuration
    builder
      .setTitle(title)
      .setSubtitle(subtitle)
      .setDimensions(width, minHeight)
      .setBadge({ show: showBadge })
      .showDebugArea(showDebugArea)
      .setDefaultLang(language)
      .setGlobalDragMode(globalDragMode)
      .setElementPositions(elementPositions);

    // Apply buttons if not minimal preset
    if (preset !== 'minimal') {
      builder.setButtons(buttons);
    }

    return builder.build();
  }, [preset, title, subtitle, width, minHeight, showBadge, showDebugArea, language, customColors, buttons, globalDragMode, elementPositions]);

  return (
    <div style={{ display: 'flex', height: '100%', padding: 24, gap: 24, background: '#f5f7fa' }}>
      {/* Left Panel - Configuration */}
      <div
        style={{
          width: 420,
          background: 'white',
          border: '1px solid #e1e4e8',
          borderRadius: 16,
          padding: 24,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a1a' }}>
          ⚙️ Configuration
        </h2>

        {/* Preset Selection */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            🎨 Preset Theme
          </label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as PresetType)}
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
            <option value="default">Default</option>
            <option value="dark">Dark Theme</option>
            <option value="minimal">Minimal</option>
            <option value="compact">Compact</option>
            <option value="success">Success (Green)</option>
            <option value="error">Error (Red)</option>
            <option value="warning">Warning (Yellow)</option>
            <option value="custom">Custom Colors</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            📝 Title
          </label>
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
              transition: 'border-color 0.2s',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            📄 Subtitle
          </label>
          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter notification subtitle..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 14,
              transition: 'border-color 0.2s',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          />
        </div>

        {/* Dimensions */}
        <div
          style={{
            background: '#f9fafb',
            padding: '16px',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10,
                fontWeight: 600,
                fontSize: 14,
                color: '#374151',
              }}
            >
              <span>📏 Width</span>
              <span style={{ color: '#667eea', fontWeight: 700 }}>{width}px</span>
            </label>
            <input
              type="range"
              min="300"
              max="800"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10,
                fontWeight: 600,
                fontSize: 14,
                color: '#374151',
              }}
            >
              <span>📐 Min Height</span>
              <span style={{ color: '#667eea', fontWeight: 700 }}>{minHeight}px</span>
            </label>
            <input
              type="range"
              min="200"
              max="600"
              value={minHeight}
              onChange={(e) => setMinHeight(Number(e.target.value))}
              style={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* Toggles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '16px',
            background: '#f9fafb',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                background: 'white',
                borderRadius: 8,
                cursor: 'pointer',
                flex: 1,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={showBadge}
                onChange={(e) => setShowBadge(e.target.checked)}
                style={{ cursor: 'pointer', width: 16, height: 16 }}
              />
              Show Badge
            </label>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                background: 'white',
                borderRadius: 8,
                cursor: 'pointer',
                flex: 1,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={showDebugArea}
                onChange={(e) => setShowDebugArea(e.target.checked)}
                style={{ cursor: 'pointer', width: 16, height: 16 }}
              />
              Show Debug
            </label>
          </div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: globalDragMode ? 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' : 'white',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              border: globalDragMode ? '2px solid #667eea' : '1px solid #e5e7eb',
              transition: 'all 0.2s',
            }}
          >
            <input
              type="checkbox"
              checked={globalDragMode}
              onChange={(e) => setGlobalDragMode(e.target.checked)}
              style={{ cursor: 'pointer', width: 16, height: 16 }}
            />
            <span style={{ color: globalDragMode ? '#4338ca' : '#374151' }}>
              🎯 Global Drag Mode (All Elements)
            </span>
          </label>
          {globalDragMode && (
            <div
              style={{
                padding: '10px 12px',
                background: '#fef3c7',
                borderRadius: 6,
                border: '1px solid #fbbf24',
                fontSize: 12,
                color: '#92400e',
                lineHeight: 1.5,
              }}
            >
              <strong>💡 Tip:</strong> In Global Drag Mode, all elements (title, subtitle, badge, buttons, debug area) can be dragged anywhere. Press <kbd style={{
                background: '#fff',
                padding: '2px 6px',
                borderRadius: 3,
                border: '1px solid #d97706',
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: 600
              }}>G</kbd> to toggle grid snap.
            </div>
          )}
        </div>

        {/* Language */}
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#374151',
            }}
          >
            🌍 Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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
            <option value="en">🇺🇸 English</option>
            <option value="uk">🇺🇦 Українська</option>
            <option value="ru">🇷🇺 Русский</option>
          </select>
        </div>

        {/* Custom Colors (only visible when custom preset is selected) */}
        {preset === 'custom' && (
          <details
            open
            style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 16,
                fontSize: 14,
                color: '#374151',
              }}
            >
              🎨 Custom Colors
            </summary>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#6b7280',
                    marginBottom: 6,
                    display: 'block',
                  }}
                >
                  Card Background
                </label>
                <input
                  type="color"
                  value={customColors.cardBackground}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, cardBackground: e.target.value })
                  }
                  style={{
                    width: '100%',
                    height: 48,
                    cursor: 'pointer',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#6b7280',
                    marginBottom: 6,
                    display: 'block',
                  }}
                >
                  Text Color
                </label>
                <input
                  type="color"
                  value={customColors.textColor}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, textColor: e.target.value })
                  }
                  style={{
                    width: '100%',
                    height: 48,
                    cursor: 'pointer',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#6b7280',
                    marginBottom: 6,
                    display: 'block',
                  }}
                >
                  Border Color
                </label>
                <input
                  type="color"
                  value={customColors.borderColor}
                  onChange={(e) =>
                    setCustomColors({ ...customColors, borderColor: e.target.value })
                  }
                  style={{
                    width: '100%',
                    height: 48,
                    cursor: 'pointer',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </details>
        )}

        {/* Buttons Configuration - hide in global drag mode */}
        {!globalDragMode && (
          <details
            open
            style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 16,
                fontSize: 14,
                color: '#374151',
              }}
            >
              🔘 Buttons Library ({buttons.length})
            </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {buttons.map((btn, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  background: 'white',
                  border: btn.draggable ? '2px solid #667eea' : '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      fontWeight: 500,
                    }}
                  >
                    <strong>ID:</strong> {btn.id}
                  </div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      cursor: 'pointer',
                      background: btn.draggable ? '#eef2ff' : '#f9fafb',
                      padding: '4px 8px',
                      borderRadius: 6,
                      fontWeight: 500,
                      color: btn.draggable ? '#667eea' : '#6b7280',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={btn.draggable || false}
                      onChange={(e) => {
                        const newButtons = [...buttons];
                        newButtons[index] = {
                          ...btn,
                          draggable: e.target.checked,
                          position: btn.position || { x: 10 + index * 100, y: 10 }
                        };
                        setButtons(newButtons);
                      }}
                      style={{ cursor: 'pointer', width: 14, height: 14 }}
                    />
                    🎯 Draggable
                  </label>
                </div>

                <input
                  placeholder="Button label"
                  value={btn.label}
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index] = { ...btn, label: e.target.value };
                    setButtons(newButtons);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    marginBottom: 6,
                    fontSize: 13,
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#667eea')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />

                {/* Position display */}
                {btn.draggable && btn.position && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        fontSize: 11,
                        color: '#6b7280',
                        background: '#f3f4f6',
                        padding: '6px 8px',
                        borderRadius: 4,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                      }}
                    >
                      X: {Math.round(btn.position.x)}px
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: 11,
                        color: '#6b7280',
                        background: '#f3f4f6',
                        padding: '6px 8px',
                        borderRadius: 4,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                      }}
                    >
                      Y: {Math.round(btn.position.y)}px
                    </div>
                  </div>
                )}

                {btn.action && (
                  <div
                    style={{
                      fontSize: 11,
                      color: '#667eea',
                      fontWeight: 500,
                      background: '#eef2ff',
                      padding: '4px 8px',
                      borderRadius: 4,
                      display: 'inline-block',
                    }}
                  >
                    Action: {btn.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        </details>
        )}

        {/* Reset button for draggable buttons */}
        {!globalDragMode && hasDraggableButtons && (
          <button
            onClick={() => {
              setButtons((prevButtons) =>
                prevButtons.map((btn, index) => ({
                  ...btn,
                  position: { x: 10 + (index % 2) * 190, y: 10 + Math.floor(index / 2) * 60 },
                }))
              );
            }}
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              border: '2px solid #f59e0b',
              background: '#fff7ed',
              color: '#b45309',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fed7aa';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#fff7ed';
            }}
          >
            🔄 Reset All Positions
          </button>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => downloadHtml('notification.html', html)}
            style={{
              padding: '14px 20px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 15,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
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
            💾 Download HTML
          </button>

          {globalDragMode && (
            <>
              <button
                onClick={() => savePositionsToJson(buttons, elementPositions)}
                style={{
                  padding: '14px 20px',
                  borderRadius: 12,
                  border: '2px solid #10b981',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  color: '#065f46',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                📥 Save Positions (JSON)
              </button>

              <button
                onClick={() => {
                  // Reset all element positions to defaults
                  setElementPositions({
                    header: { x: 10, y: 10 },
                    badgeElement: { x: 10, y: 50 },
                    subtitle: { x: 10, y: 90 },
                    out: { x: 10, y: 400 },
                  });
                  // Reset button positions
                  setButtons((prevButtons) =>
                    prevButtons.map((btn, index) => ({
                      ...btn,
                      position: { x: 10 + (index % 2) * 200, y: 140 + Math.floor(index / 2) * 50 },
                    }))
                  );
                }}
                style={{
                  padding: '12px 18px',
                  borderRadius: 10,
                  border: '2px solid #f59e0b',
                  background: '#fff7ed',
                  color: '#b45309',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#fed7aa';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fff7ed';
                }}
              >
                🔄 Reset All Positions
              </button>
            </>
          )}
        </div>

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
            &lt;/&gt; View Source Code
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              animation: 'pulse 2s infinite',
            }}
          />
        </div>

        {/* Drag mode info banner */}
        {(globalDragMode || hasDraggableButtons) && (
          <div
            style={{
              padding: '14px 18px',
              background: globalDragMode
                ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
              borderRadius: 12,
              border: globalDragMode ? '2px solid #f59e0b' : '2px solid #667eea',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>{globalDragMode ? '🌍' : '🎯'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: globalDragMode ? '#92400e' : '#4338ca', fontSize: 14 }}>
                {globalDragMode
                  ? '🎯 Global Drag Mode Active - All Elements Draggable'
                  : `${buttons.filter(b => b.draggable).length} Draggable Button${buttons.filter(b => b.draggable).length > 1 ? 's' : ''}`}
              </div>
              <div style={{ fontSize: 12, color: globalDragMode ? '#b45309' : '#6366f1', marginTop: 2 }}>
                {globalDragMode
                  ? 'Drag any element (title, subtitle, badge, buttons, debug) anywhere • Press '
                  : 'Drag buttons anywhere in the template • Press '}
                <kbd style={{
                  background: '#fff',
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: globalDragMode ? '1px solid #f59e0b' : '1px solid #6366f1',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 600
                }}>G</kbd> to toggle grid snap (20px)
              </div>
            </div>
          </div>
        )}

        <iframe
          title="preview"
          srcDoc={html}
          style={{
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
