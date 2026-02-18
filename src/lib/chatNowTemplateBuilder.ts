export type TemplateField = 'title' | 'description' | 'chatlink' | 'checkbox';
export type CustomBlockType = 'button' | 'text' | 'title' | 'checkbox' | 'image' | 'input';

export interface CanvasBlock {
  id: string;
  isTemplate: boolean;
  templateField?: TemplateField;
  customType?: CustomBlockType;
  label?: string;
  svgContent?: string;
  style?: {
    fontSize?: string;
    color?: string;
    background?: string;
    padding?: string;
    borderRadius?: string;
    border?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export const DEFAULT_CANVAS_BLOCKS: CanvasBlock[] = [
  { id: 'tpl-title', isTemplate: true, templateField: 'title' },
  { id: 'tpl-description', isTemplate: true, templateField: 'description' },
  { id: 'tpl-chatlink', isTemplate: true, templateField: 'chatlink' },
  { id: 'tpl-checkbox', isTemplate: true, templateField: 'checkbox' },
];

export interface ChatNowConfig {
  width?: number;
  headerBg?: string;
  headerText?: string;
  contentBg?: string;
  contentBgImage?: string;
  mainTitle?: string;
  description?: string;
  chatLinkText?: string;
  checkboxLabel?: string;
  showCheckbox?: boolean;
  canvasBlocks?: CanvasBlock[];
}

export class ChatNowTemplateBuilder {
  private config: Required<ChatNowConfig> = {
    width: 480,
    headerBg: '#546e7a',
    headerText: 'PC Helpsoft PC Cleaner Recommends',
    contentBg: '#ffffff',
    contentBgImage: '',
    mainTitle: 'Still having performance problems<br>with your computer?',
    description: 'Our agents are standing by Chat wan us now to see how we<br>can help resolve your PC issues.',
    chatLinkText: 'CHAT NOW',
    checkboxLabel: 'Do not show this windows again',
    showCheckbox: true,
    canvasBlocks: DEFAULT_CANVAS_BLOCKS,
  };

  setWidth(width: number): this { this.config.width = width; return this; }
  setHeaderBg(color: string): this { this.config.headerBg = color; return this; }
  setHeaderText(text: string): this { this.config.headerText = text; return this; }
  setContentBg(color: string): this { this.config.contentBg = color; return this; }
  setContentBgImage(url: string): this { this.config.contentBgImage = url; return this; }
  setMainTitle(title: string): this { this.config.mainTitle = title; return this; }
  setDescription(description: string): this { this.config.description = description; return this; }
  setChatLinkText(text: string): this { this.config.chatLinkText = text; return this; }
  setCheckboxLabel(label: string): this { this.config.checkboxLabel = label; return this; }
  showCheckbox(show: boolean): this { this.config.showCheckbox = show; return this; }
  setCanvasBlocks(blocks: CanvasBlock[]): this { this.config.canvasBlocks = blocks; return this; }

  private blockStyleStr(style: CanvasBlock['style'], excludeAlign = false): string {
    if (!style) return '';
    return Object.entries(style)
      .filter(([k]) => !excludeAlign || k !== 'textAlign')
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
      .join('; ');
  }

  private renderTemplateBlock(field: TemplateField, blockStyle?: CanvasBlock['style']): string {
    const { mainTitle, description, chatLinkText, checkboxLabel, showCheckbox } = this.config;
    const s = this.blockStyleStr(blockStyle);
    const textAlign = blockStyle?.textAlign ?? '';
    const alignSelf = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : textAlign === 'left' ? 'flex-start' : '';

    switch (field) {
      case 'title':
        return `<h1 class="main-title"${s ? ` style="${s}"` : ''}>${mainTitle}</h1>`;
      case 'description':
        return `<p class="description"${s ? ` style="${s}"` : ''}>${description}</p>`;
      case 'chatlink': {
        const sNoAlign = this.blockStyleStr(blockStyle, true);
        const selfStyle = alignSelf ? `align-self: ${alignSelf}; ` : '';
        return `<div class="chat-link-wrapper"${alignSelf ? ` style="align-self:${alignSelf}"` : ''}>
          <button class="chat-link" id="chatButton"${sNoAlign ? ` style="${selfStyle}${sNoAlign}"` : ''}>${chatLinkText}</button>
        </div>`;
      }
      case 'checkbox':
        return showCheckbox ? `<div class="checkbox-container">
          <input type="checkbox" class="checkbox" id="doNotShowAgain">
          <label class="checkbox-label"${s ? ` style="${s}"` : ''} for="doNotShowAgain">${checkboxLabel}</label>
        </div>` : '';
      default:
        return '';
    }
  }

  private renderCustomBlock(block: CanvasBlock): string {
    const textAlign = block.style?.textAlign ?? 'left';
    const alignSelf = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';
    const styleWithoutAlign = block.style
      ? Object.entries(block.style)
          .filter(([k]) => k !== 'textAlign')
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
          .join('; ')
      : '';
    const styleStr = block.style
      ? Object.entries(block.style)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
          .join('; ')
      : '';
    const label = block.label ?? '';
    switch (block.customType) {
      case 'button':
        return `<button class="custom-element custom-button" data-id="${block.id}" style="${styleWithoutAlign}; align-self: ${alignSelf}">${label}</button>`;
      case 'text':
        return `<p class="custom-element custom-text" data-id="${block.id}" style="${styleStr}">${label}</p>`;
      case 'title':
        return `<h2 class="custom-element custom-title" data-id="${block.id}" style="${styleStr}">${label}</h2>`;
      case 'checkbox':
        return `<div class="custom-element" data-id="${block.id}" style="display:flex;align-items:center;gap:8px">
          <input type="checkbox" style="width:16px;height:16px;cursor:pointer" />
          <label style="${styleStr};cursor:pointer;user-select:none">${label}</label>
        </div>`;
      case 'input':
        return `<input type="text" class="custom-element" data-id="${block.id}" placeholder="${label}" style="width:100%;${styleStr}" />`;
      case 'image':
        return block.svgContent
          ? `<div class="custom-element custom-image" data-id="${block.id}" style="width:100%;display:flex;justify-content:center;${styleStr}">${block.svgContent}</div>`
          : '';
      default:
        return '';
    }
  }

  build(): string {
    const { width, headerBg, headerText, contentBg, contentBgImage, canvasBlocks } = this.config;
    const bgImageCss = contentBgImage
      ? `background-image: url("${contentBgImage}"); background-size: cover; background-repeat: no-repeat; background-position: center;`
      : '';

    const contentHTML = canvasBlocks
      .map(block => block.isTemplate
        ? this.renderTemplateBlock(block.templateField!, block.style)
        : this.renderCustomBlock(block)
      )
      .filter(Boolean)
      .join('\n        ');

    return `<html>
  <head>
    <meta charset="utf-8" />
    <title>Chat Now</title>
    <style>
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
      body { font-family: 'Roboto', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
      .chat-dialog { width: ${width}px; background: ${contentBg}; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
      .header { display: flex; align-items: center; justify-content: space-between; padding: 10px 15px; background: ${headerBg}; }
      .header-text { font-family: 'Roboto', sans-serif; font-weight: 400; font-size: 14px; color: rgba(255,255,255,0.8); margin: 0; }
      .close-button { width: 16px; height: 16px; cursor: pointer; background: transparent; border: none; padding: 0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: rgba(255,255,255,0.9); }
      .close-button svg { display: block; width: 100%; height: 100%; }
      .close-button:hover { opacity: 0.8; }
      .content { display: flex; flex-direction: column; align-items: flex-start; padding: 30px 35px 25px 35px; gap: 18px; background-color: ${contentBg}; ${bgImageCss} }
      .main-title { font-family: 'Roboto', sans-serif; font-weight: 500; font-size: 25px; line-height: 1.3; color: rgba(0,0,0,0.8); margin: 0; }
      .description { font-family: 'Roboto', sans-serif; font-weight: 400; font-size: 16px; line-height: 1.4; color: black; margin: 0; }
      .chat-link-wrapper { align-self: center; margin-top: 8px; }
      .chat-link { font-family: 'Roboto', sans-serif; font-weight: 500; font-size: 23px; color: #0111e0; text-decoration: underline; cursor: pointer; background: transparent; border: none; padding: 0; }
      .chat-link:hover { opacity: 0.8; }
      .checkbox-container { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
      .checkbox { width: 15px; height: 15px; cursor: pointer; flex-shrink: 0; }
      .checkbox-label { font-family: 'Roboto', sans-serif; font-weight: 400; font-size: 13px; color: black; cursor: pointer; user-select: none; margin: 0; }
      .custom-button { border: none; cursor: pointer; font-weight: 500; font-family: 'Roboto', sans-serif; }
      .custom-button:hover { opacity: 0.9; }
      .custom-text { line-height: 1.5; margin: 0; font-family: 'Roboto', sans-serif; }
      .custom-title { font-weight: 600; line-height: 1.3; margin: 0; font-family: 'Roboto', sans-serif; }
      .custom-element { width: 100%; }
      .custom-image svg { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <div class="chat-dialog">
      <div class="header">
        <p class="header-text">${headerText}</p>
        <button class="close-button" id="closeButton" aria-label="Close">
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="content">
        ${contentHTML}
      </div>
    </div>
    <script>
      async function safeCall(method, payload) {
        if (!window.jsBridgeCall) return;
        try { return await window.jsBridgeCall(method, payload); } catch(e) {}
      }
      window.addEventListener('load', () => {
        safeCall('template:onReady', { type: 'chat_now', ts: Date.now() });
        const dialog = document.querySelector('.chat-dialog');
        if (dialog) setTimeout(() => safeCall('template:onSize', { width: dialog.offsetWidth, height: dialog.offsetHeight }), 100);
      });
      const closeBtn = document.getElementById('closeButton');
      if (closeBtn) closeBtn.addEventListener('click', () => safeCall('template:onAction', { action: 'close_webview' }));
      const chatBtn = document.getElementById('chatButton');
      if (chatBtn) chatBtn.addEventListener('click', () => {
        const cb = document.getElementById('doNotShowAgain');
        safeCall('template:onAction', { action: 'chat_now', doNotShowAgain: cb ? cb.checked : false });
      });
      const checkbox = document.getElementById('doNotShowAgain');
      if (checkbox) checkbox.addEventListener('change', (e) => safeCall('template:onAction', { action: 'checkbox_changed', checked: e.target.checked }));
    </script>
  </body>
</html>`.trim();
  }
}

export function buildChatNowTemplate(config?: Partial<ChatNowConfig>): string {
  const builder = new ChatNowTemplateBuilder();
  if (config) {
    if (config.width) builder.setWidth(config.width);
    if (config.headerBg) builder.setHeaderBg(config.headerBg);
    if (config.headerText) builder.setHeaderText(config.headerText);
    if (config.contentBg) builder.setContentBg(config.contentBg);
    if (config.mainTitle) builder.setMainTitle(config.mainTitle);
    if (config.description) builder.setDescription(config.description);
    if (config.chatLinkText) builder.setChatLinkText(config.chatLinkText);
    if (config.checkboxLabel) builder.setCheckboxLabel(config.checkboxLabel);
    if (config.showCheckbox !== undefined) builder.showCheckbox(config.showCheckbox);
    if (config.canvasBlocks) builder.setCanvasBlocks(config.canvasBlocks);
  }
  return builder.build();
}
