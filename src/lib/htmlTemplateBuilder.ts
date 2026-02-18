export interface TemplateColors {
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

export interface ButtonConfig {
  id: string;
  label: string;
  action?: string;
  position?: { x: number; y: number };
  draggable?: boolean;
}

export interface BadgeConfig {
  show: boolean;
  dotColor?: string;
  label?: string;
}

export interface I18nDictionary {
  [lang: string]: {
    [key: string]: string;
  };
}

export interface ElementPositions {
  header?: { x: number; y: number };
  badgeElement?: { x: number; y: number };
  subtitle?: { x: number; y: number };
  out?: { x: number; y: number };
}

export interface TemplateConfig {
  // Dimensions
  width?: number;
  minHeight?: number;

  // Colors & Theme
  colors?: TemplateColors;

  // Content
  title?: string;
  subtitle?: string;

  // Elements
  badge?: BadgeConfig;
  buttons?: ButtonConfig[];
  showDebugArea?: boolean;

  // Behavior
  defaultLang?: string;
  i18n?: I18nDictionary;
  initialPayload?: Record<string, any>;
  counterInterval?: number;

  // Drag and drop
  globalDragMode?: boolean;
  elementPositions?: ElementPositions;
}

export class HtmlTemplateBuilder {
  private config: Required<TemplateConfig> = {
    width: 450,
    minHeight: 420,
    colors: {
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
    },
    title: 'Notification Title',
    subtitle: 'Notification subtitle',
    badge: {
      show: true,
      label: 'Counter',
    },
    buttons: [
      { id: 'switchLang', label: 'Switch language' },
      { id: 'applyPayload', label: 'Apply payload' },
      { id: 'closeWebview', label: 'Close WebView' },
      { id: 'cta', label: 'CTA', action: 'cta_click' },
    ],
    showDebugArea: true,
    defaultLang: 'en',
    i18n: {
      en: {
        title: 'Program removed: {programName}',
        subtitle: 'Leftover files: {count}',
        counter: 'Live counter',
        switch: 'Switch language',
      },
      uk: {
        title: 'Програму видалено: {programName}',
        subtitle: 'Залишкових файлів: {count}',
        counter: 'Лічильник',
        switch: 'Змінити мову',
      },
      ru: {
        title: 'Программа удалена: {programName}',
        subtitle: 'Остаточных файлов: {count}',
        counter: 'Счётчик',
        switch: 'Сменить язык',
      },
    },
    initialPayload: { programName: 'WinZip', count: 12 },
    counterInterval: 1000,
    globalDragMode: false,
    elementPositions: {
      header: { x: 10, y: 10 },
      badgeElement: { x: 10, y: 50 },
      subtitle: { x: 10, y: 90 },
      out: { x: 10, y: 400 },
    },
  };

  setDimensions(width: number, minHeight: number): this {
    this.config.width = width;
    this.config.minHeight = minHeight;
    return this;
  }

  setColors(colors: Partial<TemplateColors>): this {
    this.config.colors = { ...this.config.colors, ...colors };
    return this;
  }

  setTitle(title: string): this {
    this.config.title = title;
    return this;
  }

  setSubtitle(subtitle: string): this {
    this.config.subtitle = subtitle;
    return this;
  }

  setBadge(badge: Partial<BadgeConfig>): this {
    this.config.badge = { ...this.config.badge, ...badge };
    return this;
  }

  setButtons(buttons: ButtonConfig[]): this {
    this.config.buttons = buttons;
    return this;
  }

  addButton(button: ButtonConfig): this {
    this.config.buttons.push(button);
    return this;
  }

  showDebugArea(show: boolean): this {
    this.config.showDebugArea = show;
    return this;
  }

  setI18n(i18n: I18nDictionary): this {
    this.config.i18n = { ...this.config.i18n, ...i18n };
    return this;
  }

  setDefaultLang(lang: string): this {
    this.config.defaultLang = lang;
    return this;
  }

  setInitialPayload(payload: Record<string, any>): this {
    this.config.initialPayload = { ...this.config.initialPayload, ...payload };
    return this;
  }

  setCounterInterval(interval: number): this {
    this.config.counterInterval = interval;
    return this;
  }

  enableDraggableButtons(draggable: boolean = true): this {
    this.config.buttons = this.config.buttons.map(btn => ({ ...btn, draggable }));
    return this;
  }

  setGlobalDragMode(enabled: boolean): this {
    this.config.globalDragMode = enabled;
    return this;
  }

  setElementPositions(positions: Partial<ElementPositions>): this {
    this.config.elementPositions = { ...this.config.elementPositions, ...positions };
    return this;
  }

  updateButtonPositions(positions: Record<string, { x: number; y: number }>): this {
    this.config.buttons = this.config.buttons.map(btn => ({
      ...btn,
      position: positions[btn.id] || btn.position || { x: 0, y: 0 },
    }));
    return this;
  }

  private generateStyles(): string {
    const { colors, width, minHeight, globalDragMode } = this.config;

    return `
      html,
      body {
        font-family: system-ui;
        background: ${colors.background};
        color: ${colors.textColor};
        margin: 0;
        padding: 0;
        overflow: hidden;
      }

      .card {
        border: 1px solid ${colors.borderColor};
        border-radius: 12px;
        padding: 16px;
        color: ${colors.textColor};
        width: ${width}px;
        min-height: ${minHeight}px;
        background: ${colors.cardBackground};
        ${globalDragMode ? 'position: relative;' : 'display: flex; flex-direction: column; gap: 10px;'}
        box-sizing: border-box;
      }

      ${globalDragMode ? `
      .card.grid-visible {
        background-image:
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(102, 126, 234, 0.2) 19px, rgba(102, 126, 234, 0.2) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(102, 126, 234, 0.2) 19px, rgba(102, 126, 234, 0.2) 20px);
        background-size: 20px 20px;
      }
      ` : ''}

      .row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      button {
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        background: ${colors.buttonBg};
        border: 1px solid ${colors.buttonBorder};
        color: ${colors.textColor};
        user-select: none;
      }

      .buttons-container {
        position: relative;
        min-height: 200px;
        flex: 1;
        background-image:
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(102, 126, 234, 0.1) 19px, rgba(102, 126, 234, 0.1) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(102, 126, 234, 0.1) 19px, rgba(102, 126, 234, 0.1) 20px);
        background-size: 20px 20px;
      }

      .buttons-container.grid-visible {
        background-image:
          repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(102, 126, 234, 0.2) 19px, rgba(102, 126, 234, 0.2) 20px),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(102, 126, 234, 0.2) 19px, rgba(102, 126, 234, 0.2) 20px);
      }

      button.draggable {
        cursor: move;
        transition: box-shadow 0.2s;
        z-index: 1;
      }

      button.draggable:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 10;
      }

      button.draggable.dragging {
        opacity: 0.7;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 100;
      }

      ${globalDragMode ? `
      .draggable-element {
        position: absolute;
        cursor: move;
        transition: box-shadow 0.2s;
        z-index: 1;
        user-select: none;
      }

      .draggable-element:hover {
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        outline: 2px dashed rgba(102, 126, 234, 0.4);
        outline-offset: 4px;
        z-index: 10;
      }

      .draggable-element.dragging {
        opacity: 0.8;
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
        z-index: 100;
      }
      ` : ''}

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        border-radius: 999px;
        background: ${colors.badgeBg};
        font-size: 12px;
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: ${colors.dotColorActive};
      }

      .title {
        margin: 0;
        color: ${colors.textColor};
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: ${colors.subtitleColor};
      }

      pre {
        background: ${colors.debugBg};
        padding: 10px;
        border-radius: 10px;
        white-space: pre-wrap;
        font-size: 12px;
        overflow: auto;
        box-sizing: border-box;
        flex: none;
        max-height: 120px;
      }
    `;
  }

  private generateButtonsHTML(): string {
    const { buttons, globalDragMode } = this.config;

    if (!buttons.length) return '';

    // Global drag mode: all buttons are draggable
    if (globalDragMode) {
      return buttons
        .map((btn, index) => {
          // Use saved position if exists, otherwise calculate default
          let pos = btn.position;
          if (!pos || (pos.x === undefined && pos.y === undefined)) {
            pos = { x: 10 + (index % 2) * 200, y: 140 + Math.floor(index / 2) * 50 };
          }
          return `      <button id="${btn.id}" class="draggable-element" data-x="${pos.x}" data-y="${pos.y}" style="position: absolute; left: ${pos.x}px; top: ${pos.y}px;">${btn.label}</button>`;
        })
        .join('\n');
    }

    // Check if any button has draggable enabled
    const hasDraggable = buttons.some(btn => btn.draggable);

    if (hasDraggable) {
      // Render buttons with absolute positioning for drag-and-drop
      return `<div class="buttons-container" id="buttonsContainer">
        ${buttons
          .map((btn) => {
            const pos = btn.position || { x: 0, y: 0 };
            const draggableAttr = btn.draggable ? 'draggable="true"' : '';
            const draggableClass = btn.draggable ? 'draggable' : '';
            return `<button id="${btn.id}" class="${draggableClass}" ${draggableAttr} data-x="${pos.x}" data-y="${pos.y}" style="position: absolute; left: ${pos.x}px; top: ${pos.y}px;">${btn.label}</button>`;
          })
          .join('\n        ')}
      </div>`;
    }

    // Group buttons by 2 (default layout)
    const rows: ButtonConfig[][] = [];
    for (let i = 0; i < buttons.length; i += 2) {
      rows.push(buttons.slice(i, i + 2));
    }

    return rows
      .map(
        (row) => `
      <div class="row">
        ${row.map((btn) => `<button id="${btn.id}">${btn.label}</button>`).join('\n        ')}
      </div>`
      )
      .join('\n');
  }

  private generateBadgeHTML(): string {
    if (!this.config.badge.show) return '';

    if (this.config.globalDragMode) {
      // Return only inner content for global drag mode
      return `
        <span class="dot" id="dot"></span>
        <span id="counterLabel">${this.config.badge.label || ''}</span>
        <b id="counter">0</b>`;
    }

    return `
      <div class="badge">
        <span class="dot" id="dot"></span>
        <span id="counterLabel">${this.config.badge.label || ''}</span>
        <b id="counter">0</b>
      </div>`;
  }

  private generateScript(): string {
    const { defaultLang, i18n, initialPayload, counterInterval, buttons, colors } = this.config;

    const buttonHandlers = buttons
      .map((btn) => {
        if (btn.id === 'switchLang') {
          return `      document.getElementById("${btn.id}").onclick = () => switchLang();`;
        } else if (btn.id === 'applyPayload') {
          return `      document.getElementById("${btn.id}").onclick = () =>
        applyPayload({ programName: "Adobe Reader", count: 27 });`;
        } else if (btn.action) {
          return `      document.getElementById("${btn.id}").onclick = () =>
        safeCall("template:onAction", { action: "${btn.action}", lang: state.lang });`;
        } else {
          return `      document.getElementById("${btn.id}").onclick = () =>
        safeCall("template:onAction", { action: "${btn.id}" });`;
        }
      })
      .join('\n\n');

    return `
      const out = document.getElementById("out");
      const headerEl = document.getElementById("header");
      const subtitleEl = document.getElementById("subtitle");
      const counterEl = document.getElementById("counter");
      const counterLabelEl = document.getElementById("counterLabel");
      const dotEl = document.getElementById("dot");

      const state = {
        lang: "${defaultLang}",
        ticks: 0,
        payload: ${JSON.stringify(initialPayload)},
        i18n: ${JSON.stringify(i18n, null, 10)},
      };

      function log(msg) {
        if (out) {
          const next = (out.textContent ? out.textContent + "\\n" : "") + msg;
          const lines = next.split("\\n");
          out.textContent =
            lines.length > 120 ? lines.slice(lines.length - 120).join("\\n") : next;
        }
        console.log(msg);
      }

      function mergeI18n(hostI18n) {
        if (!hostI18n || typeof hostI18n !== "object") return false;

        for (const [lang, dict] of Object.entries(hostI18n)) {
          if (!dict || typeof dict !== "object") continue;
          state.i18n[lang] = { ...(state.i18n[lang] || {}), ...dict };
        }
        return true;
      }

      const t = (key) =>
        state.i18n[state.lang]?.[key] ?? state.i18n.en?.[key] ?? key;

      const fmt = (str) =>
        String(str).replace(/\\{(\\w+)\\}/g, (_, k) => state.payload[k] ?? "");

      let __measureScheduled = false;
      let __lastSizeKey = "";

      function reportCardSize() {
        const card = document.querySelector(".card");
        if (!card) return;

        const width = card.offsetWidth;
        const height = card.offsetHeight;

        const key = width + "x" + height;
        if (key === __lastSizeKey) return;
        __lastSizeKey = key;

        safeCall("template:onSize", { width, height });
      }

      function requestMeasure() {
        if (__measureScheduled) return;
        __measureScheduled = true;

        setTimeout(() => {
          __measureScheduled = false;
          reportCardSize();
        }, 0);
      }

      function render() {
        headerEl.textContent = fmt(t("title"));
        subtitleEl.textContent = fmt(t("subtitle"));
        if (counterLabelEl) counterLabelEl.textContent = t("counter");

        const switchBtn = document.getElementById("switchLang");
        if (switchBtn) switchBtn.textContent = t("switch");

        if (dotEl) {
          dotEl.style.background =
            state.payload.count > 20 ? "${colors.dotColorDanger}" : "${colors.dotColorActive}";
        }

        log(
          "render -> lang=" +
            state.lang +
            " payload=" +
            JSON.stringify(state.payload),
        );

        requestMeasure();
      }

      setInterval(() => {
        state.ticks++;
        if (counterEl) counterEl.textContent = state.ticks;
        if (dotEl) dotEl.style.opacity = state.ticks % 2 ? "0.5" : "1";
      }, ${counterInterval});

      function switchLang() {
        const order = Object.keys(state.i18n);
        const idx = order.indexOf(state.lang);
        state.lang = order[(idx + 1) % order.length];
        render();
      }

      function applyPayload(p) {
        state.payload = { ...state.payload, ...p };
        render();
      }

      async function safeCall(method, payload) {
        if (!window.jsBridgeCall) {
          log("❌ jsBridgeCall not found");
          return;
        }
        const res = await window.jsBridgeCall(method, payload);
        log("➡️ " + method + " " + JSON.stringify(payload));
        log("⬅️ " + JSON.stringify(res));
      }

      // Drag and drop functionality
      let draggedElement = null;
      let offsetX = 0;
      let offsetY = 0;
      let snapToGrid = ${this.config.globalDragMode ? 'true' : 'true'}; // Enable snap by default
      const gridSize = 20; // Grid size in pixels
      const isGlobalDragMode = ${this.config.globalDragMode ? 'true' : 'false'};

      function initDragAndDrop() {
        const card = document.getElementById('mainCard') || document.querySelector('.card');

        if (isGlobalDragMode) {
          // Global drag mode: all elements with draggable-element class
          const draggableElements = document.querySelectorAll('.draggable-element');

          if (draggableElements.length > 0 && card) {
            card.classList.add('grid-visible');
          }

          // Toggle grid visibility with 'G' key
          document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'g' && card) {
              snapToGrid = !snapToGrid;
              card.classList.toggle('grid-visible');
              log('Grid snap: ' + (snapToGrid ? 'ON' : 'OFF'));
            }
          });

          draggableElements.forEach(element => {
            element.addEventListener('mousedown', (e) => {
              e.preventDefault();
              e.stopPropagation();
              draggedElement = element;

              const rect = element.getBoundingClientRect();
              const cardRect = card.getBoundingClientRect();

              offsetX = e.clientX - rect.left;
              offsetY = e.clientY - rect.top;

              element.classList.add('dragging');

              document.addEventListener('mousemove', onMouseMoveGlobal);
              document.addEventListener('mouseup', onMouseUpGlobal);
            });
          });
        } else {
          // Original drag mode for buttons only
          const draggableButtons = document.querySelectorAll('button.draggable');
          const container = document.getElementById('buttonsContainer');

          if (!container) return;

          // Show grid by default when draggable buttons exist
          if (draggableButtons.length > 0) {
            container.classList.add('grid-visible');
          }

          // Toggle grid visibility with 'G' key
          document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'g' && draggableButtons.length > 0) {
              snapToGrid = !snapToGrid;
              container.classList.toggle('grid-visible');
              log('Grid snap: ' + (snapToGrid ? 'ON' : 'OFF'));
            }
          });

          draggableButtons.forEach(button => {
            button.addEventListener('mousedown', (e) => {
              e.preventDefault();
              draggedElement = button;

              const rect = button.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              offsetX = e.clientX - rect.left;
              offsetY = e.clientY - rect.top;

              button.classList.add('dragging');

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            });
          });
        }
      }

      function snapToGridValue(value) {
        return Math.round(value / gridSize) * gridSize;
      }

      function onMouseMoveGlobal(e) {
        if (!draggedElement) return;

        const card = document.getElementById('mainCard') || document.querySelector('.card');
        if (!card) return;

        const cardRect = card.getBoundingClientRect();

        // Calculate position relative to card
        let x = e.clientX - cardRect.left - offsetX;
        let y = e.clientY - cardRect.top - offsetY;

        // Apply snap to grid if enabled
        if (snapToGrid) {
          x = snapToGridValue(x);
          y = snapToGridValue(y);
        }

        // Constrain to card boundaries with padding
        const maxX = cardRect.width - draggedElement.offsetWidth - 20;
        const maxY = cardRect.height - draggedElement.offsetHeight - 20;

        x = Math.max(10, Math.min(x, maxX));
        y = Math.max(10, Math.min(y, maxY));

        draggedElement.style.left = x + 'px';
        draggedElement.style.top = y + 'px';

        // Store position in data attributes
        draggedElement.dataset.x = x;
        draggedElement.dataset.y = y;
      }

      function onMouseUpGlobal(e) {
        if (!draggedElement) return;

        draggedElement.classList.remove('dragging');

        log('Element ' + draggedElement.id + ' moved to: x=' + draggedElement.dataset.x + ', y=' + draggedElement.dataset.y);

        // Collect all element positions and send to parent
        const elementPositions = {};
        const buttonPositions = {};

        document.querySelectorAll('.draggable-element').forEach(el => {
          const pos = {
            x: parseFloat(el.dataset.x) || 0,
            y: parseFloat(el.dataset.y) || 0,
          };

          // Separate buttons from other elements
          if (el.tagName.toLowerCase() === 'button') {
            buttonPositions[el.id] = pos;
          } else {
            elementPositions[el.id] = pos;
          }
        });

        // Post message to parent window
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'elementPositionsUpdate',
            positions: {
              buttons: buttonPositions,
              elements: elementPositions,
            },
          }, '*');
        }

        draggedElement = null;
        document.removeEventListener('mousemove', onMouseMoveGlobal);
        document.removeEventListener('mouseup', onMouseUpGlobal);
      }

      function onMouseMove(e) {
        if (!draggedElement) return;

        const container = document.getElementById('buttonsContainer');
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const card = document.querySelector('.card');
        const cardRect = card.getBoundingClientRect();

        // Calculate position relative to container
        let x = e.clientX - containerRect.left - offsetX;
        let y = e.clientY - containerRect.top - offsetY;

        // Apply snap to grid if enabled
        if (snapToGrid) {
          x = snapToGridValue(x);
          y = snapToGridValue(y);
        }

        // Allow dragging anywhere in the card (not just container)
        // Only constrain to card boundaries
        const cardWidth = cardRect.width - 32; // account for padding
        const cardHeight = cardRect.height - 32;

        x = Math.max(-containerRect.left, Math.min(x, cardWidth - draggedElement.offsetWidth));
        y = Math.max(-containerRect.top, Math.min(y, cardHeight - draggedElement.offsetHeight));

        draggedElement.style.left = x + 'px';
        draggedElement.style.top = y + 'px';

        // Store position in data attributes
        draggedElement.dataset.x = x;
        draggedElement.dataset.y = y;
      }

      function onMouseUp(e) {
        if (!draggedElement) return;

        draggedElement.classList.remove('dragging');

        // Send position update to parent
        const positions = {};
        document.querySelectorAll('button.draggable').forEach(btn => {
          positions[btn.id] = {
            x: parseFloat(btn.dataset.x) || 0,
            y: parseFloat(btn.dataset.y) || 0,
          };
        });

        // Post message to parent window
        if (window.parent !== window) {
          window.parent.postMessage({
            type: 'buttonPositionsUpdate',
            positions: positions,
          }, '*');
        }

        log('Button positions updated: ' + JSON.stringify(positions));

        draggedElement = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener("load", () => {
        safeCall("template:onReady", { lang: state.lang, ts: Date.now() });
        render();
        window.addEventListener("resize", requestMeasure);
        initDragAndDrop();
      });

${buttonHandlers}

      window.__fromSciter = function (msg) {
        log("⬅️ from Sciter: " + JSON.stringify(msg));

        if (msg?.type === "init") {
          if (mergeI18n(msg.i18n)) log("✅ i18n merged from Sciter");
          if (msg.lang) state.lang = msg.lang;
          if (msg.payload) state.payload = { ...state.payload, ...msg.payload };
          render();
          return;
        }

        if (msg?.type === "setI18n") {
          if (mergeI18n(msg.i18n)) {
            log("✅ i18n updated from Sciter");
            render();
          }
          return;
        }

        if (msg?.type === "setLang") {
          state.lang = msg.lang;
          render();
          return;
        }

        if (msg?.type === "update") {
          applyPayload(msg.payload);
          return;
        }
      };
    `;
  }

  build(): string {
    const styles = this.generateStyles();
    const badgeHTML = this.generateBadgeHTML();
    const buttonsHTML = this.generateButtonsHTML();
    const debugArea = this.config.showDebugArea ? '<pre id="out"></pre>' : '';
    const script = this.generateScript();

    if (this.config.globalDragMode) {
      // Global drag mode: all elements are absolutely positioned with saved positions
      const headerPos = this.config.elementPositions.header || { x: 10, y: 10 };
      const badgePos = this.config.elementPositions.badgeElement || { x: 10, y: 50 };
      const subtitlePos = this.config.elementPositions.subtitle || { x: 10, y: this.config.badge.show ? 90 : 50 };
      const debugPos = this.config.elementPositions.out || { x: 10, y: 400 };

      return `
<html>
  <head>
    <meta charset="utf-8" />
    <title>Template</title>

    <style>
      ${styles}
    </style>
  </head>

  <body>
    <div class="card" id="mainCard">
      <h3 class="title draggable-element" id="header" data-x="${headerPos.x}" data-y="${headerPos.y}" style="position: absolute; left: ${headerPos.x}px; top: ${headerPos.y}px;">${this.config.title}</h3>
${badgeHTML ? `      <div class="badge draggable-element" id="badgeElement" data-x="${badgePos.x}" data-y="${badgePos.y}" style="position: absolute; left: ${badgePos.x}px; top: ${badgePos.y}px;">${badgeHTML.trim()}</div>` : ''}
      <p class="subtitle draggable-element" id="subtitle" data-x="${subtitlePos.x}" data-y="${subtitlePos.y}" style="position: absolute; left: ${subtitlePos.x}px; top: ${subtitlePos.y}px;">${this.config.subtitle}</p>
${buttonsHTML}
      ${debugArea ? `<pre id="out" class="draggable-element" data-x="${debugPos.x}" data-y="${debugPos.y}" style="position: absolute; left: ${debugPos.x}px; top: ${debugPos.y}px; max-width: calc(100% - 40px);"></pre>` : ''}
    </div>

    <script>
      ${script}
    </script>
  </body>
</html>
`.trim();
    }

    return `
<html>
  <head>
    <meta charset="utf-8" />
    <title>Template</title>

    <style>
      ${styles}
    </style>
  </head>

  <body>
    <div class="card">
      <h3 class="title" id="header">${this.config.title}</h3>
${badgeHTML}
      <p class="subtitle" id="subtitle">${this.config.subtitle}</p>
${buttonsHTML}
      ${debugArea}
    </div>

    <script>
      ${script}
    </script>
  </body>
</html>
`.trim();
  }

  // Preset configurations
  static createDarkTheme(): HtmlTemplateBuilder {
    return new HtmlTemplateBuilder().setColors({
      background: 'transparent',
      cardBackground: '#1a1a1a',
      textColor: '#ffffff',
      subtitleColor: '#cccccc',
      borderColor: '#333333',
      buttonBg: '#2a2a2a',
      buttonBorder: '#444444',
      badgeBg: '#2a2a2a',
      debugBg: '#0a0a0a',
    });
  }

  static createLightTheme(): HtmlTemplateBuilder {
    return new HtmlTemplateBuilder();
  }

  static createMinimal(): HtmlTemplateBuilder {
    return new HtmlTemplateBuilder()
      .showDebugArea(false)
      .setButtons([{ id: 'cta', label: 'OK', action: 'cta_click' }])
      .setBadge({ show: false });
  }

  static createCompact(): HtmlTemplateBuilder {
    return new HtmlTemplateBuilder()
      .setDimensions(350, 300)
      .showDebugArea(false);
  }
}

// Export convenience function
export function buildHtmlTemplate(config?: Partial<TemplateConfig>): string {
  const builder = new HtmlTemplateBuilder();

  if (config) {
    if (config.width || config.minHeight) {
      builder.setDimensions(config.width || 450, config.minHeight || 420);
    }
    if (config.colors) builder.setColors(config.colors);
    if (config.title) builder.setTitle(config.title);
    if (config.subtitle) builder.setSubtitle(config.subtitle);
    if (config.badge) builder.setBadge(config.badge);
    if (config.buttons) builder.setButtons(config.buttons);
    if (config.showDebugArea !== undefined) builder.showDebugArea(config.showDebugArea);
    if (config.defaultLang) builder.setDefaultLang(config.defaultLang);
    if (config.i18n) builder.setI18n(config.i18n);
    if (config.initialPayload) builder.setInitialPayload(config.initialPayload);
    if (config.counterInterval) builder.setCounterInterval(config.counterInterval);
  }

  return builder.build();
}
