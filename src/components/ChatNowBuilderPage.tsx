import { useMemo, useState, useEffect } from 'react';
import { ChatNowTemplateBuilder, DEFAULT_CANVAS_BLOCKS } from '../lib/chatNowTemplateBuilder';
import type { CanvasBlock } from '../lib/chatNowTemplateBuilder';
import { ComponentLibrary } from './ComponentLibrary';
import type { LibraryComponent } from './ComponentLibrary';

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const LANG_PRESETS = {
  en: {
    flag: '🇺🇸', name: 'EN',
    mainTitle: 'Still having performance problems<br>with your computer?',
    description: 'Our agents are standing by. Chat with us now to see how we<br>can help resolve your PC issues.',
    chatLinkText: 'CHAT NOW',
    checkboxLabel: 'Do not show this window again',
  },
  ja: {
    flag: '🇯🇵', name: 'JP',
    mainTitle: 'まだコンピューターのパフォーマンスに<br>問題がありますか？',
    description: 'エージェントが待機中です。今すぐチャットして<br>PC の問題を解決しましょう。',
    chatLinkText: '今すぐチャット',
    checkboxLabel: 'このウィンドウを再表示しない',
  },
  zh: {
    flag: '🇨🇳', name: 'ZH',
    mainTitle: '您的计算机仍有<br>性能问题吗？',
    description: '我们的代理随时为您服务。立即聊天<br>了解我们如何解决您的电脑问题。',
    chatLinkText: '立即聊天',
    checkboxLabel: '不再显示此窗口',
  },
  fr: {
    flag: '🇫🇷', name: 'FR',
    mainTitle: 'Vous avez encore des problèmes de<br>performance sur votre PC ?',
    description: 'Nos agents sont disponibles. Chattez maintenant<br>pour résoudre vos problèmes informatiques.',
    chatLinkText: 'DISCUTER MAINTENANT',
    checkboxLabel: 'Ne plus afficher cette fenêtre',
  },
} as const;
type LangKey = keyof typeof LANG_PRESETS;

// Drop zone component - always in DOM, expands on drag
function DropZone({
  index,
  isOver,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: {
  index: number;
  isOver: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      className="drop-zone"
      onDragEnter={onDragEnter}
      onDragLeave={(e) => {
        // Only fire if we actually left this element (not entering a child)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onDragLeave();
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-index={index}
      style={{
        height: isOver ? 52 : 6,
        margin: '2px 0',
        border: isOver ? '2px dashed #667eea' : '2px dashed transparent',
        borderRadius: 8,
        background: isOver ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
        transition: 'height 0.15s, border-color 0.15s, background 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#667eea',
        fontSize: 12,
        fontWeight: 600,
        pointerEvents: 'auto',
      }}
    >
      {isOver ? '+ Drop here' : ''}
    </div>
  );
}

// Inline editable text
function InlineEdit({
  value,
  multiline = false,
  style,
  displayStyle,
  onSave,
  onStartEdit,
  isEditing,
}: {
  value: string;
  multiline?: boolean;
  style?: React.CSSProperties;
  displayStyle?: React.CSSProperties;
  onSave: (v: string) => void;
  onStartEdit: () => void;
  isEditing: boolean;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value, isEditing]);

  const commit = () => onSave(draft);

  if (isEditing) {
    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '4px 6px',
      border: '2px solid #667eea',
      borderRadius: 4,
      fontSize: 'inherit',
      fontFamily: 'inherit',
      background: '#fffbf0',
      outline: 'none',
      resize: 'vertical',
      ...style,
    };
    return multiline ? (
      <textarea
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Escape') commit(); }}
        style={{ ...inputStyle, minHeight: 60 }}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') commit(); }}
        style={inputStyle}
      />
    );
  }

  return (
    <div
      onDoubleClick={onStartEdit}
      title="Double-click to edit"
      style={{ cursor: 'text', ...displayStyle }}
      dangerouslySetInnerHTML={{ __html: value || '<span style="opacity:0.4">Double-click to edit...</span>' }}
    />
  );
}

// Render a single canvas block visually
function CanvasBlockView({
  block,
  mainTitle,
  description,
  chatLinkText,
  checkboxLabel,
  showCheckbox,
  isEditing,
  onStartEdit,
  onSaveEdit,
  onDelete,
}: {
  block: CanvasBlock;
  mainTitle: string;
  description: string;
  chatLinkText: string;
  checkboxLabel: string;
  showCheckbox: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (value: string) => void;
  onDelete?: () => void;
}) {
  const content = (() => {
    if (block.isTemplate) {
      const ts = block.style ?? {};
      switch (block.templateField) {
        case 'title':
          return (
            <InlineEdit
              value={mainTitle}
              multiline
              isEditing={isEditing}
              onStartEdit={onStartEdit}
              onSave={onSaveEdit}
              displayStyle={{ fontSize: ts.fontSize ?? 20, fontWeight: 600, color: ts.color ?? 'rgba(0,0,0,0.8)', lineHeight: 1.3, textAlign: ts.textAlign }}
            />
          );
        case 'description':
          return (
            <InlineEdit
              value={description}
              multiline
              isEditing={isEditing}
              onStartEdit={onStartEdit}
              onSave={onSaveEdit}
              displayStyle={{ fontSize: ts.fontSize ?? 14, color: ts.color ?? '#333', lineHeight: 1.4, textAlign: ts.textAlign }}
            />
          );
        case 'chatlink':
          return (
            <div style={{ display: 'flex', justifyContent: ts.textAlign === 'right' ? 'flex-end' : ts.textAlign === 'left' ? 'flex-start' : 'center', width: '100%' }}>
              <InlineEdit
                value={chatLinkText}
                isEditing={isEditing}
                onStartEdit={onStartEdit}
                onSave={onSaveEdit}
                displayStyle={{ fontSize: ts.fontSize ?? 18, fontWeight: 500, color: ts.color ?? '#0111e0', background: ts.background, textDecoration: 'underline', cursor: 'text' }}
              />
            </div>
          );
        case 'checkbox':
          if (!showCheckbox) return null;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" style={{ width: 14, height: 14, flexShrink: 0 }} readOnly />
              <InlineEdit
                value={checkboxLabel}
                isEditing={isEditing}
                onStartEdit={onStartEdit}
                onSave={onSaveEdit}
                displayStyle={{ fontSize: ts.fontSize ?? 12, color: ts.color ?? '#333' }}
              />
            </div>
          );
        default:
          return null;
      }
    }

    // Custom block
    const custStyle: React.CSSProperties = {
      fontSize: block.style?.fontSize,
      color: block.style?.color,
      background: block.style?.background,
      padding: block.style?.padding,
      borderRadius: block.style?.borderRadius,
      border: block.style?.border,
      textAlign: block.style?.textAlign,
    };
    const label = block.label ?? '';
    switch (block.customType) {
      case 'button':
        return (
          <div style={{ width: '100%', textAlign: custStyle.textAlign ?? 'left' }}>
            <InlineEdit
              value={label}
              isEditing={isEditing}
              onStartEdit={onStartEdit}
              onSave={onSaveEdit}
              displayStyle={{ ...custStyle, textAlign: undefined, display: 'inline-block', fontWeight: 500 }}
            />
          </div>
        );
      case 'text':
        return (
          <InlineEdit
            value={label}
            multiline
            isEditing={isEditing}
            onStartEdit={onStartEdit}
            onSave={onSaveEdit}
            displayStyle={{ ...custStyle, lineHeight: 1.5 }}
          />
        );
      case 'title':
        return (
          <InlineEdit
            value={label}
            isEditing={isEditing}
            onStartEdit={onStartEdit}
            onSave={onSaveEdit}
            displayStyle={{ ...custStyle, fontWeight: 600 }}
          />
        );
      case 'checkbox':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" style={{ width: 16, height: 16, flexShrink: 0 }} readOnly />
            <InlineEdit
              value={label}
              isEditing={isEditing}
              onStartEdit={onStartEdit}
              onSave={onSaveEdit}
              displayStyle={{ fontSize: custStyle.fontSize, color: custStyle.color }}
            />
          </div>
        );
      case 'input':
        return <input readOnly placeholder={label} style={{ ...custStyle, width: '100%' }} />;
      case 'image':
        return block.svgContent
          ? <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }} dangerouslySetInnerHTML={{ __html: block.svgContent }} />
          : <div style={{ width: '100%', height: 60, background: '#f3f4f6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 12 }}>No SVG</div>;
      default:
        return <span style={custStyle}>{label}</span>;
    }
  })();

  if (content === null) return null;

  return (
    <div
      style={{
        position: 'relative',
        padding: '10px 12px',
        background: isEditing ? '#fffbf0' : block.isTemplate ? '#fafafa' : 'white',
        border: isEditing ? '2px solid #667eea' : block.isTemplate ? '1px solid #e5e7eb' : '1px solid #d1d5db',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {/* Label badge with drag handle */}
      <div
        style={{
          position: 'absolute',
          top: -8,
          left: 10,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: block.isTemplate ? '#9ca3af' : '#667eea',
          background: block.isTemplate ? '#f3f4f6' : '#eef2ff',
          padding: '1px 6px',
          borderRadius: 4,
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: 0, opacity: 0.6 }}>⠿</span>
        {block.isTemplate ? block.templateField : block.customType}
        {!isEditing && <span style={{ opacity: 0.6, marginLeft: 1 }}>✎</span>}
      </div>

      <div style={{ flex: 1 }}>{content}</div>

      {onDelete && (
        <button
          onClick={onDelete}
          title="Remove"
          style={{
            position: 'absolute',
            top: -7,
            right: 8,
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e5e7eb',
            border: 'none',
            borderRadius: '50%',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: 9,
            fontWeight: 700,
            lineHeight: 1,
            padding: 0,
            flexShrink: 0,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fca5a5'; (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function ChatNowBuilderPage() {
  const [width, setWidth] = useState(480);
  const [headerBg, setHeaderBg] = useState('#546e7a');
  const [headerText, setHeaderText] = useState('PC Helpsoft PC Cleaner Recommends');
  const [contentBg, setContentBg] = useState('#ffffff');
  const [contentBgImage, setContentBgImage] = useState<string | null>(null);
  const [contentBgMode, setContentBgMode] = useState<'color' | 'image'>('color');
  const [language, setLanguage] = useState<LangKey>('en');
  const [mainTitle, setMainTitle] = useState<string>(LANG_PRESETS.en.mainTitle);
  const [description, setDescription] = useState<string>(LANG_PRESETS.en.description);
  const [chatLinkText, setChatLinkText] = useState<string>('CHAT NOW');
  const [checkboxLabel, setCheckboxLabel] = useState<string>('Do not show this windows again');
  const [showCheckbox, setShowCheckbox] = useState(true);
  const [dragMode, setDragMode] = useState(false);
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>(DEFAULT_CANVAS_BLOCKS);
  const [dragOverZone, setDragOverZone] = useState<number | null>(null);
  const [isDraggingFromLibrary, setIsDraggingFromLibrary] = useState(false);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const handleLibraryDragStart = () => setIsDraggingFromLibrary(true);

  // Reset dragging state on global dragend
  useEffect(() => {
    const reset = () => { setIsDraggingFromLibrary(false); setDraggingBlockId(null); setDragOverZone(null); };
    window.addEventListener('dragend', reset);
    return () => window.removeEventListener('dragend', reset);
  }, []);

  const handleDropAtZone = (e: React.DragEvent, zoneIndex: number) => {
    e.preventDefault();
    setDragOverZone(null);

    // Block reorder drop
    const blockId = e.dataTransfer.getData('text/block-id');
    if (blockId) {
      setDraggingBlockId(null);
      const srcIdx = canvasBlocks.findIndex(b => b.id === blockId);
      if (srcIdx === -1) return;
      const updated = [...canvasBlocks];
      const [moved] = updated.splice(srcIdx, 1);
      const insertAt = zoneIndex <= srcIdx ? zoneIndex : zoneIndex - 1;
      updated.splice(insertAt, 0, moved);
      setCanvasBlocks(updated);
      return;
    }

    // Library drop
    setIsDraggingFromLibrary(false);
    try {
      const componentData: LibraryComponent = JSON.parse(e.dataTransfer.getData('application/json'));
      const newBlock: CanvasBlock = {
        id: `${componentData.type}-${Date.now()}`,
        isTemplate: false,
        customType: componentData.type as CanvasBlock['customType'],
        label: componentData.label,
        style: componentData.defaultStyle,
      };
      const updated = [...canvasBlocks];
      updated.splice(zoneIndex, 0, newBlock);
      setCanvasBlocks(updated);
    } catch (err) {
      console.error('Drop failed:', err);
    }
  };

  const deleteBlock = (id: string) => {
    setCanvasBlocks(canvasBlocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, patch: Partial<CanvasBlock>) => {
    setCanvasBlocks(canvasBlocks.map(b => b.id === id ? { ...b, ...patch } : b));
  };

  const updateBlockStyle = (id: string, stylePatch: Partial<CanvasBlock['style']>) => {
    setCanvasBlocks(canvasBlocks.map(b =>
      b.id === id ? { ...b, style: { ...b.style, ...stylePatch } } : b
    ));
  };

  const applyLanguage = (lang: LangKey) => {
    const p = LANG_PRESETS[lang];
    setLanguage(lang);
    setMainTitle(p.mainTitle);
    setDescription(p.description);
    setChatLinkText(p.chatLinkText);
    setCheckboxLabel(p.checkboxLabel);
  };

  const openPreview = () => {
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  };

  const handleBgSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setContentBgImage(ev.target?.result as string);
      setContentBgMode('image');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const html = useMemo(() => {
    const builder = new ChatNowTemplateBuilder();
    builder
      .setWidth(width)
      .setHeaderBg(headerBg)
      .setHeaderText(headerText)
      .setContentBg(contentBg)
      .setContentBgImage(contentBgMode === 'image' && contentBgImage ? contentBgImage : '')
      .setMainTitle(mainTitle)
      .setDescription(description)
      .setChatLinkText(chatLinkText)
      .setCheckboxLabel(checkboxLabel)
      .showCheckbox(showCheckbox)
      .setCanvasBlocks(canvasBlocks);
    return builder.build();
  }, [width, headerBg, headerText, contentBg, contentBgImage, contentBgMode, mainTitle, description, chatLinkText, checkboxLabel, showCheckbox, canvasBlocks]);

  return (
    <div style={{ display: 'flex', height: '100%', padding: 24, gap: 16, background: '#f5f7fa' }}>
      {/* Component Library */}
      {dragMode && (
        <ComponentLibrary onDragStart={handleLibraryDragStart} />
      )}

      {/* Left Panel - Configuration */}
      <div
        style={{
          width: 360,
          background: 'white',
          border: '1px solid #e1e4e8',
          borderRadius: 16,
          padding: 20,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>
          💬 Chat Now Template
        </h2>

        {/* Language selector */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>🌍 Language</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(Object.keys(LANG_PRESETS) as LangKey[]).map(lang => {
              const p = LANG_PRESETS[lang];
              const active = language === lang;
              return (
                <button
                  key={lang}
                  onClick={() => applyLanguage(lang)}
                  style={{
                    flex: 1,
                    padding: '7px 4px',
                    borderRadius: 8,
                    border: `2px solid ${active ? '#667eea' : '#e5e7eb'}`,
                    background: active ? '#eef2ff' : 'white',
                    color: active ? '#4338ca' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{p.flag}</span>
                  <span style={{ fontSize: 10, letterSpacing: 0.5 }}>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Width */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>
            <span>📏 Width</span>
            <span style={{ color: '#667eea' }}>{width}px</span>
          </label>
          <input type="range" min="300" max="800" value={width} onChange={e => setWidth(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        {/* Header color */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>🎨 Header Color</label>
          <input type="color" value={headerBg} onChange={e => setHeaderBg(e.target.value)} style={{ width: '100%', height: 40, cursor: 'pointer', borderRadius: 8, border: '2px solid #e5e7eb' }} />
        </div>

        {/* Background — color or SVG image */}
        <div style={{ background: '#f9fafb', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>🖼 Background</label>
          {/* Toggle */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
            {(['color', 'image'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setContentBgMode(mode)}
                style={{
                  flex: 1, padding: '6px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `2px solid ${contentBgMode === mode ? '#667eea' : '#e5e7eb'}`,
                  background: contentBgMode === mode ? '#eef2ff' : 'white',
                  color: contentBgMode === mode ? '#4338ca' : '#6b7280',
                }}
              >
                {mode === 'color' ? '🎨 Color' : '🖼 SVG Image'}
              </button>
            ))}
          </div>

          {contentBgMode === 'color' ? (
            <input type="color" value={contentBg} onChange={e => setContentBg(e.target.value)}
              style={{ width: '100%', height: 40, cursor: 'pointer', borderRadius: 8, border: '2px solid #e5e7eb' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {contentBgImage && (
                <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb', height: 80 }}>
                  <img src={contentBgImage} alt="bg preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => { setContentBgImage(null); setContentBgMode('color'); }}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 20, height: 20, color: 'white', cursor: 'pointer', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >✕</button>
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 8, border: '2px dashed #c7d2fe', background: '#f8f9ff', cursor: 'pointer', fontSize: 12, color: '#667eea', fontWeight: 600 }}>
                ⬆️ {contentBgImage ? 'Replace SVG' : 'Upload SVG'}
                <input type="file" accept=".svg,image/svg+xml" onChange={handleBgSvgUpload} style={{ display: 'none' }} />
              </label>
            </div>
          )}
        </div>

        {/* Header Text */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>Header Text</label>
          <input value={headerText} onChange={e => setHeaderText(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
        </div>

        {/* Main Title */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>📰 Main Title</label>
          <textarea value={mainTitle} onChange={e => setMainTitle(e.target.value)} rows={2} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }} />
          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>Use &lt;br&gt; for line breaks</div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>📄 Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }} />
        </div>

        {/* Chat Link Text */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13, color: '#374151' }}>🔗 Chat Link Text</label>
          <input value={chatLinkText} onChange={e => setChatLinkText(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
        </div>

        {/* Checkbox */}
        <div style={{ background: '#f9fafb', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, marginBottom: showCheckbox ? 10 : 0 }}>
            <input type="checkbox" checked={showCheckbox} onChange={e => setShowCheckbox(e.target.checked)} style={{ width: 15, height: 15 }} />
            ☑️ Show Checkbox
          </label>
          {showCheckbox && (
            <input value={checkboxLabel} onChange={e => setCheckboxLabel(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
          )}
        </div>

        {/* Drag Mode */}
        <div style={{ background: dragMode ? '#eef2ff' : '#f9fafb', padding: 12, borderRadius: 10, border: dragMode ? '2px solid #667eea' : '1px solid #e5e7eb' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <input type="checkbox" checked={dragMode} onChange={e => setDragMode(e.target.checked)} style={{ width: 15, height: 15 }} />
            <span style={{ color: dragMode ? '#4338ca' : '#374151' }}>🎯 Drag & Drop Mode</span>
          </label>
          {dragMode && (
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#6b7280' }}>
              Drag components from the library into the canvas. Drop zones appear between elements.
            </p>
          )}
        </div>

        {/* Block Editors — all blocks when drag mode is on */}
        {dragMode && canvasBlocks.map((block, idx) => {
          // skip hidden checkbox
          if (block.isTemplate && block.templateField === 'checkbox' && !showCheckbox) return null;

          const isBtn  = block.isTemplate ? block.templateField === 'chatlink' : block.customType === 'button';
          const isText = block.isTemplate ? ['title','description','checkbox'].includes(block.templateField!) : ['text','title','checkbox'].includes(block.customType!);
          const hasAlign = block.isTemplate ? ['title','description','chatlink'].includes(block.templateField!) : ['text','title','button'].includes(block.customType!);
          const hasFontSize = block.isTemplate || (block.customType !== 'input' && block.customType !== 'checkbox');
          const hasBg = isBtn;
          const hasBorderRadius = isBtn || block.customType === 'input';
          const hasPadding = isBtn;

          // label for template blocks
          const TEMPLATE_LABELS: Record<string, string> = { title: 'Main Title', description: 'Description', chatlink: 'Chat Link', checkbox: 'Checkbox' };
          const blockName = block.isTemplate ? (TEMPLATE_LABELS[block.templateField!] ?? block.templateField) : block.customType;
          const blockColor = block.isTemplate ? '#546e7a' : '#667eea';

          return (
            <div
              key={block.id}
              style={{ background: block.isTemplate ? '#f8fafc' : '#f0f4ff', padding: 12, borderRadius: 10, border: `1px solid ${block.isTemplate ? '#cbd5e1' : '#c7d2fe'}`, display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, background: blockColor, color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                    {blockName}
                  </span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>#{idx + 1}</span>
                </div>
                <button
                  onClick={() => deleteBlock(block.id)}
                  style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                >
                  ✕ Remove
                </button>
              </div>

              {/* Label — only for custom blocks */}
              {!block.isTemplate && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    {block.customType === 'input' ? 'Placeholder' : 'Label / Text'}
                  </label>
                  <input
                    value={block.label ?? ''}
                    onChange={e => updateBlock(block.id, { label: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #c7d2fe', fontSize: 12, background: 'white' }}
                  />
                </div>
              )}

              {/* Text Content — for template blocks */}
              {block.isTemplate && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    Text Content
                  </label>
                  {(block.templateField === 'title' || block.templateField === 'description') ? (
                    <textarea
                      value={block.templateField === 'title' ? mainTitle : description}
                      onChange={e => block.templateField === 'title' ? setMainTitle(e.target.value) : setDescription(e.target.value)}
                      rows={2}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: 'white', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      value={block.templateField === 'chatlink' ? chatLinkText : checkboxLabel}
                      onChange={e => block.templateField === 'chatlink' ? setChatLinkText(e.target.value) : setCheckboxLabel(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: 'white' }}
                    />
                  )}
                  {(block.templateField === 'title' || block.templateField === 'description') && (
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>Use &lt;br&gt; for line breaks</div>
                  )}
                </div>
              )}

              {/* Background + Text color */}
              {(hasBg || isText) && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {hasBg && (
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Background</label>
                      <input type="color" value={block.style?.background ?? '#0111e0'} onChange={e => updateBlockStyle(block.id, { background: e.target.value })}
                        style={{ width: '100%', height: 32, cursor: 'pointer', borderRadius: 6, border: '1px solid #cbd5e1' }} />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Text Color</label>
                    <input type="color" value={block.style?.color ?? '#000000'} onChange={e => updateBlockStyle(block.id, { color: e.target.value })}
                      style={{ width: '100%', height: 32, cursor: 'pointer', borderRadius: 6, border: '1px solid #cbd5e1' }} />
                  </div>
                </div>
              )}

              {/* Alignment */}
              {hasAlign && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Alignment</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['left', 'center', 'right'] as const).map(align => {
                      const active = (block.style?.textAlign ?? 'left') === align;
                      return (
                        <button key={align} onClick={() => updateBlockStyle(block.id, { textAlign: align })}
                          style={{ flex: 1, padding: '6px', borderRadius: 6, border: `1px solid ${active ? '#667eea' : '#c7d2fe'}`, background: active ? '#667eea' : 'white', color: active ? 'white' : '#374151', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                          title={align}
                        >
                          {align === 'left' ? '≡ L' : align === 'center' ? '≡ C' : '≡ R'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Font size */}
              {hasFontSize && (
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    <span>Font Size</span>
                    <span style={{ color: '#667eea' }}>{block.style?.fontSize ?? 'default'}</span>
                  </label>
                  <input type="range" min="10" max="48"
                    value={parseInt(block.style?.fontSize ?? (block.isTemplate ? (block.templateField === 'title' ? '25' : block.templateField === 'chatlink' ? '23' : '16') : '14'))}
                    onChange={e => updateBlockStyle(block.id, { fontSize: `${e.target.value}px` })}
                    style={{ width: '100%' }} />
                </div>
              )}

              {/* Border radius */}
              {hasBorderRadius && (
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    <span>Border Radius</span>
                    <span style={{ color: '#667eea' }}>{block.style?.borderRadius ?? '0px'}</span>
                  </label>
                  <input type="range" min="0" max="32"
                    value={parseInt(block.style?.borderRadius ?? '0')}
                    onChange={e => updateBlockStyle(block.id, { borderRadius: `${e.target.value}px` })}
                    style={{ width: '100%' }} />
                </div>
              )}

              {/* Padding */}
              {hasPadding && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Padding</label>
                  <input value={block.style?.padding ?? ''} onChange={e => updateBlockStyle(block.id, { padding: e.target.value })}
                    placeholder="e.g. 10px 20px"
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, background: 'white' }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={openPreview}
              style={{ flex: 1, padding: '12px', borderRadius: 10, border: '2px solid #667eea', background: 'white', color: '#4338ca', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
            >
              👁️ Quick Preview
            </button>
            <button
              onClick={() => downloadHtml('chat-now.html', html)}
              style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
            >
              💾 Download
            </button>
          </div>
          {dragMode && canvasBlocks.some(b => !b.isTemplate) && (
            <button
              onClick={() => setCanvasBlocks(DEFAULT_CANVAS_BLOCKS)}
              style={{ padding: '10px', borderRadius: 10, border: '2px solid #ef4444', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
            >
              🗑️ Reset to Default
            </button>
          )}
        </div>

        <details style={{ background: '#f9fafb', padding: 12, borderRadius: 10, border: '1px solid #e5e7eb' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#374151' }}>&lt;/&gt; View Source</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10, background: '#1e1e1e', color: '#d4d4d4', padding: 12, borderRadius: 6, maxHeight: 250, overflow: 'auto', marginTop: 8 }}>
            {html}
          </pre>
        </details>
      </div>

      {/* Right Panel - Preview or Editable Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        {/* Header bar */}
        <div style={{ padding: '12px 16px', background: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14, color: '#1a1a1a', border: '1px solid #e1e4e8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{dragMode ? '✏️ Editable Canvas' : '👁️ Live Preview'}</span>
          {dragMode && (
            <span style={{ fontSize: 11, padding: '3px 8px', background: '#eef2ff', color: '#667eea', borderRadius: 6, fontWeight: 600 }}>
              DRAG MODE
            </span>
          )}
          <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
        </div>

        {/* Canvas or Iframe */}
        {dragMode ? (
          // DRAG MODE: Editable canvas with drop zones
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: Math.min(width, 700),
                backgroundColor: contentBg,
                border: '1px solid #ccc',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                borderRadius: 4,
                overflow: 'visible',
              }}
            >
              {/* Template header (fixed) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 15px', background: headerBg }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>{headerText}</span>
                <div style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>✕</div>
              </div>

              {/* Content with drop zones */}
              <div style={{
                padding: '20px 28px 20px', display: 'flex', flexDirection: 'column',
                backgroundColor: contentBg,
                ...(contentBgMode === 'image' && contentBgImage ? { backgroundImage: `url("${contentBgImage}")`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : {}),
              }}>
                {/* Drop zone before first block */}
                <DropZone
                  index={0}
                  isOver={dragOverZone === 0}
                  onDragEnter={() => (isDraggingFromLibrary || draggingBlockId !== null) && setDragOverZone(0)}
                  onDragLeave={() => setDragOverZone(null)}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => handleDropAtZone(e, 0)}
                />

                {canvasBlocks.map((block, i) => {
                  // Skip template blocks that are conditionally hidden
                  if (block.isTemplate && block.templateField === 'checkbox' && !showCheckbox) return null;

                  return (
                    <div
                      key={block.id}
                      draggable={editingBlockId !== block.id}
                      onDragStart={(e) => {
                        if (editingBlockId === block.id) { e.preventDefault(); return; }
                        setDraggingBlockId(block.id);
                        e.dataTransfer.setData('text/block-id', block.id);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => { setDraggingBlockId(null); setDragOverZone(null); }}
                      style={{ opacity: draggingBlockId === block.id ? 0.35 : 1, cursor: editingBlockId === block.id ? 'default' : 'grab' }}
                    >
                      <CanvasBlockView
                        block={block}
                        mainTitle={mainTitle}
                        description={description}
                        chatLinkText={chatLinkText}
                        checkboxLabel={checkboxLabel}
                        showCheckbox={showCheckbox}
                        isEditing={editingBlockId === block.id}
                        onStartEdit={() => setEditingBlockId(block.id)}
                        onSaveEdit={(value) => {
                          if (block.isTemplate) {
                            if (block.templateField === 'title') setMainTitle(value);
                            else if (block.templateField === 'description') setDescription(value);
                            else if (block.templateField === 'chatlink') setChatLinkText(value);
                            else if (block.templateField === 'checkbox') setCheckboxLabel(value);
                          } else {
                            updateBlock(block.id, { label: value });
                          }
                          setEditingBlockId(null);
                        }}
                        onDelete={() => deleteBlock(block.id)}
                      />
                      <DropZone
                        index={i + 1}
                        isOver={dragOverZone === i + 1}
                        onDragEnter={() => (isDraggingFromLibrary || draggingBlockId !== null) && setDragOverZone(i + 1)}
                        onDragLeave={() => setDragOverZone(null)}
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => handleDropAtZone(e, i + 1)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // PREVIEW MODE: iframe
          <div style={{ flex: 1, border: '1px solid #e1e4e8', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', background: 'white' }}>
            <iframe
              title="preview"
              srcDoc={html}
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  );
}
