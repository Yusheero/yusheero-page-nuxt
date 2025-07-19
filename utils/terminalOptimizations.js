/**
 * Утилиты для оптимизации производительности терминала
 */

/**
 * Дебаунсер для оптимизации частых вызовов
 */
export class Debouncer {
  constructor(delay = 300) {
    this.delay = delay;
    this.timeoutId = null;
  }
  
  /**
   * Выполнение функции с задержкой
   * @param {Function} func - Функция для выполнения
   * @param {...any} args - Аргументы функции
   */
  debounce(func, ...args) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      func.apply(this, args);
      this.timeoutId = null;
    }, this.delay);
  }
  
  /**
   * Отмена отложенного выполнения
   */
  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

/**
 * Троттлер для ограничения частоты вызовов
 */
export class Throttler {
  constructor(limit = 100) {
    this.limit = limit;
    this.lastCall = 0;
  }
  
  /**
   * Выполнение функции с ограничением частоты
   * @param {Function} func - Функция для выполнения
   * @param {...any} args - Аргументы функции
   */
  throttle(func, ...args) {
    const now = Date.now();
    
    if (now - this.lastCall >= this.limit) {
      func.apply(this, args);
      this.lastCall = now;
    }
  }
}

/**
 * Виртуализация для больших списков истории
 */
export class VirtualizedList {
  constructor(containerHeight, itemHeight, buffer = 5) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.buffer = buffer;
    this.items = [];
    this.scrollTop = 0;
  }
  
  /**
   * Установка элементов списка
   * @param {Array} items - Элементы списка
   */
  setItems(items) {
    this.items = items;
  }
  
  /**
   * Получение видимых элементов
   * @param {number} scrollTop - Позиция прокрутки
   */
  getVisibleItems(scrollTop) {
    this.scrollTop = scrollTop;
    
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + this.buffer,
      this.items.length
    );
    
    const visibleItems = this.items.slice(startIndex, endIndex);
    
    return {
      items: visibleItems,
      startIndex,
      endIndex,
      totalHeight: this.items.length * this.itemHeight,
      offsetY: startIndex * this.itemHeight
    };
  }
}

/**
 * Кэш для часто используемых данных
 */
export class Cache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  /**
   * Получение значения из кэша
   * @param {string} key - Ключ
   */
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // Обновляем порядок использования
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }
  
  /**
   * Установка значения в кэш
   * @param {string} key - Ключ
   * @param {any} value - Значение
   */
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Удаляем самый старый элемент
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  /**
   * Очистка кэша
   */
  clear() {
    this.cache.clear();
  }
  
  /**
   * Получение размера кэша
   */
  size() {
    return this.cache.size;
  }
}

/**
 * Оптимизированный рендерер текста
 */
export class TextRenderer {
  constructor() {
    this.textCache = new Cache(50);
    this.animationFrameId = null;
  }
  
  /**
   * Рендеринг текста с кэшированием
   * @param {string} text - Текст для рендеринга
   * @param {Object} options - Опции рендеринга
   */
  renderText(text, options = {}) {
    const cacheKey = `${text}_${JSON.stringify(options)}`;
    let cached = this.textCache.get(cacheKey);
    
    if (!cached) {
      cached = this.processText(text, options);
      this.textCache.set(cacheKey, cached);
    }
    
    return cached;
  }
  
  /**
   * Обработка текста для рендеринга
   * @param {string} text - Текст
   * @param {Object} options - Опции
   */
  processText(text, options) {
    let processed = text;
    
    // Замена переносов строк
    if (options.replaceNewlines !== false) {
      processed = processed.replace(/\n/g, '<br>');
    }
    
    // Экранирование HTML
    if (options.escapeHtml) {
      processed = processed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    
    return processed;
  }
  
  /**
   * Плавная прокрутка к элементу
   * @param {HTMLElement} element - Элемент для прокрутки
   * @param {Object} options - Опции прокрутки
   */
  smoothScrollTo(element, options = {}) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    const {
      duration = 300,
      easing = 'easeInOutQuad'
    } = options;
    
    const start = performance.now();
    const startScrollTop = element.scrollTop;
    const targetScrollTop = element.scrollHeight - element.clientHeight;
    const distance = targetScrollTop - startScrollTop;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easedProgress = this.ease(easing, progress);
      const newScrollTop = startScrollTop + (distance * easedProgress);
      
      element.scrollTop = newScrollTop;
      
      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }
  
  /**
   * Функции плавности
   * @param {string} type - Тип плавности
   * @param {number} t - Время (0-1)
   */
  ease(type, t) {
    switch (type) {
      case 'easeInOutQuad':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      case 'easeInQuad':
        return t * t;
      case 'easeOutQuad':
        return t * (2 - t);
      default:
        return t;
    }
  }
  
  /**
   * Очистка ресурсов
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.textCache.clear();
  }
}

/**
 * Оптимизатор памяти для истории терминала
 */
export class HistoryOptimizer {
  constructor(maxEntries = 1000) {
    this.maxEntries = maxEntries;
  }
  
  /**
   * Оптимизация истории терминала
   * @param {Array} history - История терминала
   */
  optimizeHistory(history) {
    if (history.length <= this.maxEntries) {
      return history;
    }
    
    // Удаляем старые записи, сохраняя важные
    const importantEntries = history.filter(entry => 
      entry.includes('>>>') || entry.includes('ERROR') || entry.includes('SUCCESS')
    );
    
    const regularEntries = history.filter(entry => 
      !entry.includes('>>>') && !entry.includes('ERROR') && !entry.includes('SUCCESS')
    );
    
    // Оставляем последние обычные записи
    const recentRegular = regularEntries.slice(-this.maxEntries / 2);
    
    // Оставляем важные записи
    const recentImportant = importantEntries.slice(-this.maxEntries / 2);
    
    return [...recentImportant, ...recentRegular];
  }
  
  /**
   * Сжатие истории для экономии памяти
   * @param {Array} history - История терминала
   */
  compressHistory(history) {
    return history.map(entry => {
      // Удаляем лишние пробелы
      let compressed = entry.trim();
      
      // Сокращаем повторяющиеся символы
      compressed = compressed.replace(/(.)\1{3,}/g, '$1$1$1');
      
      return compressed;
    });
  }
} 