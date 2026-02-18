import { useState } from 'react';

export interface LibraryComponent {
  id: string;
  type: 'button' | 'text' | 'title' | 'checkbox' | 'image' | 'input';
  label: string;
  icon: string;
  defaultStyle?: {
    fontSize?: string;
    color?: string;
    background?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
  };
}

const LIBRARY_COMPONENTS: LibraryComponent[] = [
  {
    id: 'btn-primary',
    type: 'button',
    label: 'Primary Button',
    icon: '🔵',
    defaultStyle: {
      background: '#667eea',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
    },
  },
  {
    id: 'btn-secondary',
    type: 'button',
    label: 'Secondary Button',
    icon: '⚪',
    defaultStyle: {
      background: 'white',
      color: '#667eea',
      padding: '12px 24px',
      borderRadius: '8px',
      border: '2px solid #667eea',
      fontSize: '14px',
    },
  },
  {
    id: 'btn-success',
    type: 'button',
    label: 'Success Button',
    icon: '🟢',
    defaultStyle: {
      background: '#10b981',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
    },
  },
  {
    id: 'btn-danger',
    type: 'button',
    label: 'Danger Button',
    icon: '🔴',
    defaultStyle: {
      background: '#ef4444',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
    },
  },
  {
    id: 'btn-link',
    type: 'button',
    label: 'Link Button',
    icon: '🔗',
    defaultStyle: {
      background: 'transparent',
      color: '#0111e0',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      fontSize: '16px',
    },
  },
  {
    id: 'text-heading',
    type: 'title',
    label: 'Heading',
    icon: '📰',
    defaultStyle: {
      fontSize: '24px',
      color: '#1a1a1a',
      padding: '0',
    },
  },
  {
    id: 'text-paragraph',
    type: 'text',
    label: 'Paragraph',
    icon: '📄',
    defaultStyle: {
      fontSize: '14px',
      color: '#4b5563',
      padding: '0',
    },
  },
  {
    id: 'checkbox',
    type: 'checkbox',
    label: 'Checkbox',
    icon: '☑️',
    defaultStyle: {
      fontSize: '13px',
      color: '#374151',
    },
  },
  {
    id: 'input-text',
    type: 'input',
    label: 'Text Input',
    icon: '📝',
    defaultStyle: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
    },
  },
];

interface ComponentLibraryProps {
  onDragStart?: (component: LibraryComponent) => void;
  collapsed?: boolean;
}

export function ComponentLibrary({ onDragStart, collapsed = false }: ComponentLibraryProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = LIBRARY_COMPONENTS.filter((comp) =>
    comp.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, component: LibraryComponent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';

    if (onDragStart) {
      onDragStart(component);
    }
  };

  return (
    <div
      style={{
        width: isCollapsed ? 60 : 280,
        background: 'white',
        border: '1px solid #e1e4e8',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'width 0.3s',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              🎨 Component Library
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.9 }}>
              Drag to add
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 8,
            padding: '8px',
            cursor: 'pointer',
            color: 'white',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Search */}
          <div style={{ padding: '12px' }}>
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {/* Components */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 12px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                style={{
                  padding: '12px',
                  background: '#f9fafb',
                  border: '2px dashed #d1d5db',
                  borderRadius: 8,
                  cursor: 'grab',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#eef2ff';
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: 20 }}>{component.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                    {component.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>
                    {component.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
