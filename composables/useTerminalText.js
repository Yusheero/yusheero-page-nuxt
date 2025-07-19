import { ref, nextTick } from 'vue';

/**
 * Композабл для управления текстом и печатью в терминале
 * Оптимизирует работу с текстом и эффектами печати
 */
export function useTerminalText() {
  const terminalText = ref('');
  const terminalHistory = ref([]);
  const currentTextPosition = ref(0);
  const cursorVisible = ref(true);
  const currentCommand = ref('');
  
  // Таймеры для оптимизации
  let typingInterval = null;
  let cursorBlinkInterval = null;
  
  /**
   * Печать текста с эффектом печатной машинки
   * @param {string} text - Текст для печати
   * @param {number} speed - Скорость печати (мс)
   */
  const printTextToTerminal = (text, speed = 15) => {
    if (typingInterval) {
      clearInterval(typingInterval);
    }
    
    currentTextPosition.value = 0;
    terminalText.value = '';
    
    return new Promise((resolve) => {
      typingInterval = setInterval(() => {
        if (currentTextPosition.value < text.length) {
          // Симулируем случайные задержки для реалистичности
          if (Math.random() > 0.95) {
            setTimeout(() => {
              terminalText.value += text[currentTextPosition.value];
              currentTextPosition.value++;
            }, 50 + Math.random() * 100);
          } else {
            terminalText.value += text[currentTextPosition.value];
            currentTextPosition.value++;
          }
        } else {
          clearInterval(typingInterval);
          typingInterval = null;
          terminalHistory.value.push(terminalText.value);
          terminalText.value = '';
          resolve();
        }
      }, speed);
    });
  };
  
  /**
   * Добавление текста в историю без печати
   * @param {string} text - Текст для добавления
   */
  const addToHistory = (text) => {
    terminalHistory.value.push(text);
  };
  
  /**
   * Очистка истории терминала
   */
  const clearHistory = () => {
    terminalHistory.value = [];
  };
  
  /**
   * Запуск мигания курсора
   */
  const startCursorBlink = () => {
    if (cursorBlinkInterval) {
      clearInterval(cursorBlinkInterval);
    }
    
    cursorBlinkInterval = setInterval(() => {
      cursorVisible.value = !cursorVisible.value;
    }, 530);
  };
  
  /**
   * Остановка мигания курсора
   */
  const stopCursorBlink = () => {
    if (cursorBlinkInterval) {
      clearInterval(cursorBlinkInterval);
      cursorBlinkInterval = null;
    }
  };
  
  /**
   * Очистка всех таймеров
   */
  const clearAllTimers = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    stopCursorBlink();
  };
  
  /**
   * Получение последней строки из истории
   */
  const getLastHistoryEntry = () => {
    return terminalHistory.value[terminalHistory.value.length - 1] || '';
  };
  
  /**
   * Проверка, идет ли печать
   */
  const isPrinting = () => {
    return typingInterval !== null;
  };
  
  return {
    // Состояние
    terminalText,
    terminalHistory,
    currentTextPosition,
    cursorVisible,
    currentCommand,
    
    // Методы
    printTextToTerminal,
    addToHistory,
    clearHistory,
    startCursorBlink,
    stopCursorBlink,
    clearAllTimers,
    getLastHistoryEntry,
    isPrinting
  };
} 