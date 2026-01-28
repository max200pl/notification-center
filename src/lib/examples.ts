import { HtmlTemplateBuilder, buildHtmlTemplate } from './htmlTemplateBuilder';

// ============================================
// Пример 1: Использование fluent API
// ============================================
export function example1_FluentAPI() {
  const html = new HtmlTemplateBuilder()
    .setTitle('Custom Notification')
    .setSubtitle('This is a custom subtitle')
    .setDimensions(500, 400)
    .setColors({
      cardBackground: '#f0f8ff',
      textColor: '#003366',
      borderColor: '#0066cc',
    })
    .setButtons([
      { id: 'confirm', label: 'Confirm', action: 'confirm_action' },
      { id: 'cancel', label: 'Cancel', action: 'cancel_action' },
    ])
    .showDebugArea(false)
    .build();

  return html;
}

// ============================================
// Пример 2: Темная тема (preset)
// ============================================
export function example2_DarkTheme() {
  const html = HtmlTemplateBuilder.createDarkTheme()
    .setTitle('Dark Mode Notification')
    .setSubtitle('Beautiful dark theme')
    .build();

  return html;
}

// ============================================
// Пример 3: Минимальная конфигурация
// ============================================
export function example3_Minimal() {
  const html = HtmlTemplateBuilder.createMinimal()
    .setTitle('Simple Alert')
    .setSubtitle('Click OK to continue')
    .build();

  return html;
}

// ============================================
// Пример 4: Компактная версия
// ============================================
export function example4_Compact() {
  const html = HtmlTemplateBuilder.createCompact()
    .setTitle('Compact Notification')
    .setColors({
      cardBackground: '#fff9e6',
      borderColor: '#ffcc00',
    })
    .build();

  return html;
}

// ============================================
// Пример 5: Кастомные кнопки
// ============================================
export function example5_CustomButtons() {
  const html = new HtmlTemplateBuilder()
    .setTitle('Multiple Actions')
    .setButtons([
      { id: 'save', label: 'Save', action: 'save_action' },
      { id: 'delete', label: 'Delete', action: 'delete_action' },
      { id: 'archive', label: 'Archive', action: 'archive_action' },
      { id: 'close', label: 'Close', action: 'close_action' },
    ])
    .build();

  return html;
}

// ============================================
// Пример 6: Без badge
// ============================================
export function example6_NoBadge() {
  const html = new HtmlTemplateBuilder()
    .setTitle('Clean Notification')
    .setSubtitle('No badge, no distractions')
    .setBadge({ show: false })
    .build();

  return html;
}

// ============================================
// Пример 7: Кастомная локализация
// ============================================
export function example7_CustomI18n() {
  const html = new HtmlTemplateBuilder()
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
      fr: {
        title: 'Fichier supprimé: {fileName}',
        subtitle: 'Taille: {fileSize} MB',
        counter: 'Temps écoulé',
        switch: 'Changer de langue',
      },
    })
    .setDefaultLang('en')
    .setInitialPayload({ fileName: 'document.pdf', fileSize: 2.5 })
    .build();

  return html;
}

// ============================================
// Пример 8: Быстрый счетчик
// ============================================
export function example8_FastCounter() {
  const html = new HtmlTemplateBuilder()
    .setTitle('Fast Counter')
    .setCounterInterval(500) // обновление каждые 500ms вместо 1000ms
    .build();

  return html;
}

// ============================================
// Пример 9: Использование convenience функции
// ============================================
export function example9_ConvenienceFunction() {
  const html = buildHtmlTemplate({
    width: 600,
    minHeight: 500,
    title: 'Quick Setup',
    subtitle: 'Using convenience function',
    colors: {
      cardBackground: '#e8f5e9',
      borderColor: '#4caf50',
      textColor: '#1b5e20',
    },
    buttons: [
      { id: 'ok', label: 'OK', action: 'confirm' },
    ],
    showDebugArea: false,
  });

  return html;
}

// ============================================
// Пример 10: Пошаговое построение
// ============================================
export function example10_StepByStep() {
  const builder = new HtmlTemplateBuilder();

  // Шаг 1: Установка базовых параметров
  builder.setTitle('Step-by-Step Builder');
  builder.setSubtitle('Building configuration step by step');

  // Шаг 2: Настройка размеров
  builder.setDimensions(480, 450);

  // Шаг 3: Настройка цветов
  builder.setColors({
    cardBackground: '#fef7ff',
    borderColor: '#9c27b0',
    textColor: '#4a148c',
  });

  // Шаг 4: Добавление кнопок по одной
  builder.addButton({ id: 'action1', label: 'Action 1', action: 'action1' });
  builder.addButton({ id: 'action2', label: 'Action 2', action: 'action2' });

  // Шаг 5: Настройка badge
  builder.setBadge({
    show: true,
    label: 'Status',
  });

  // Шаг 6: Отключение debug area
  builder.showDebugArea(false);

  // Шаг 7: Генерация HTML
  return builder.build();
}

// ============================================
// Пример 11: Брендированная тема
// ============================================
export function example11_BrandedTheme() {
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
      badgeBg: 'rgba(255, 255, 255, 0.2)',
      dotColorActive: '#4ade80',
      dotColorDanger: '#f87171',
    })
    .setButtons([
      { id: 'clean', label: 'Clean Now', action: 'clean' },
      { id: 'settings', label: 'Settings', action: 'settings' },
    ])
    .showDebugArea(false)
    .build();

  return html;
}

// ============================================
// Экспорт всех примеров
// ============================================
export const examples = {
  fluentAPI: example1_FluentAPI,
  darkTheme: example2_DarkTheme,
  minimal: example3_Minimal,
  compact: example4_Compact,
  customButtons: example5_CustomButtons,
  noBadge: example6_NoBadge,
  customI18n: example7_CustomI18n,
  fastCounter: example8_FastCounter,
  convenienceFunction: example9_ConvenienceFunction,
  stepByStep: example10_StepByStep,
  brandedTheme: example11_BrandedTheme,
};
