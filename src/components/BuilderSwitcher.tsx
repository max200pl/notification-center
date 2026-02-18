import React, { useState } from 'react';
import { SimpleBuilderPage } from './SimpleBuilderPage';
import { AdvancedHtmlBuilderPage } from './AdvancedHtmlBuilderPage';
import { ChatNowBuilderPage } from './ChatNowBuilderPage';

type ViewMode = 'simple' | 'advanced' | 'chatnow';

export function BuilderSwitcher() {
  const [mode, setMode] = useState<ViewMode>('simple');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header with mode switcher */}
      <div
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>
            🎨 HTML Template Builder
          </h1>
          <p style={{ margin: '6px 0 0', opacity: 0.95, fontSize: 14, fontWeight: 400 }}>
            Dynamic notification template generator
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 12,
            padding: 6,
            backdropFilter: 'blur(10px)',
          }}
        >
          <button
            onClick={() => setMode('simple')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: mode === 'simple' ? 'white' : 'transparent',
              color: mode === 'simple' ? '#667eea' : 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s',
              boxShadow: mode === 'simple' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}
            onMouseOver={(e) => {
              if (mode !== 'simple') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (mode !== 'simple') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            📝 Simple
          </button>
          <button
            onClick={() => setMode('advanced')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: mode === 'advanced' ? 'white' : 'transparent',
              color: mode === 'advanced' ? '#667eea' : 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s',
              boxShadow: mode === 'advanced' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}
            onMouseOver={(e) => {
              if (mode !== 'advanced') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (mode !== 'advanced') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            ⚙️ Advanced
          </button>
          <button
            onClick={() => setMode('chatnow')}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: mode === 'chatnow' ? 'white' : 'transparent',
              color: mode === 'chatnow' ? '#667eea' : 'white',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s',
              boxShadow: mode === 'chatnow' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
            }}
            onMouseOver={(e) => {
              if (mode !== 'chatnow') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (mode !== 'chatnow') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            💬 Chat Now
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {mode === 'simple' && <SimpleBuilderPage />}
        {mode === 'advanced' && <AdvancedHtmlBuilderPage />}
        {mode === 'chatnow' && <ChatNowBuilderPage />}
      </div>
    </div>
  );
}
