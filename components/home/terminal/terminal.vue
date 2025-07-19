<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { terminalData } from '@/data/terminal';
import './terminal-styles.scss';
import { useVoightKampffTest } from '@/utils/useVoightKampffTest';
import TerminalOffScreen from './parts/terminal-off.vue';
import TerminalBootingScreen from './parts/terminal-boot.vue';
import TerminalScreen from './parts/terminal-default.vue';
import ExpandButton from './parts/expand-button.vue';

/**
 * Основной компонент ретро-терминала с эффектами старого монитора
*/

// Ссылки на DOM элементы терминала
const terminalRef = ref(null); // Контейнер терминала для прокрутки

/**
 * Основные параметры состояния терминала
*/
const isTerminalOn = ref(false); // Включен ли терминал
const isTerminalBooted = ref(false); // Загружена ли система
const terminalText = ref(''); // Текущий текст, который печатается
const bootingProgress = ref(0); // Прогресс загрузки (0-100%)
const terminalHistory = ref([]); // История команд и выводов
const cursorVisible = ref(true); // Видимость курсора
const currentCommand = ref(''); // Текущая команда в поле ввода
const isFullScreen = ref(false); // Полноэкранный режим

/**
 * Параметры для визуальных эффектов терминала
 */
const currentColorScheme = ref('green'); // Текущая цветовая схема: green, amber, blue
const isGlitchActive = ref(false); // Активен ли эффект глитча

/**
 * Переменные для управления анимациями и таймерами
 */
let currentTextPosition = 0; // Текущая позиция в тексте при печати
let typingInterval; // Интервал для эффекта печатной машинки
let cursorBlinkInterval; // Интервал мигания курсора
let bootSequenceTimeout; // Таймаут для последовательности загрузки

/**
 * Симуляция загрузки терминала с эффектами старого монитора
*/
const bootTerminal = () => {
  isTerminalOn.value = true;
  bootingProgress.value = 0;
  terminalHistory.value = []; // Очищаем историю
  
  // Активируем эффект глитча при загрузке
  triggerGlitchEffect(1000);
  
  // Симулируем мерцание при включении (эффект старого ЭЛТ монитора)
  const terminalElement = document.querySelector('.retro-terminal-container');
  if (terminalElement) {
    terminalElement.classList.add('power-on');
    setTimeout(() => {
      terminalElement.classList.remove('power-on');
    }, 1000);
  }
  
  // Симулируем загрузку с случайными задержками для реалистичности
  const bootInterval = setInterval(() => {
    // Случайные приращения прогресса с периодическими паузами
    if (Math.random() > 0.2) { // 80% вероятность приращения
      bootingProgress.value += Math.random() * 5;
    }
    
    // Периодически показываем небольшую задержку в загрузке
    if (Math.random() > 0.95 && bootingProgress.value > 10 && bootingProgress.value < 90) {
      bootingProgress.value -= Math.random() * 2; // Небольшое обратное движение
    }
    
    if (bootingProgress.value >= 100) {
      bootingProgress.value = 100;
      clearInterval(bootInterval);
      
      // После заполнения прогресс-бара ждем момент перед продолжением
      bootSequenceTimeout = setTimeout(() => {
        // Теперь переходим к экрану сообщений загрузки
        isTerminalBooted.value = true;
        
        // Очищаем историю и начинаем печатать сообщения загрузки
        setTimeout(() => {
          terminalText.value = ''; // Убеждаемся, что нет частичного текста
          printTextToTerminal(terminalData.bootMessages.join('\n'));
          
          // После завершения сообщений загрузки показываем приветствие
          setTimeout(() => {
            printTextToTerminal(terminalData.welcomeMessage.join('\n'));
            startCursorBlink();
          }, terminalData.bootMessages.join('\n').length * 15 + 1000);
        }, 500);
      }, 800);
    }
  }, 100);
};

/**
 * Печать текста с эффектом печатной машинки
 */
const printTextToTerminal = (text) => {
  if (typingInterval) {
    clearInterval(typingInterval);
  }
  
  currentTextPosition = 0;
  terminalText.value = '';
  
  typingInterval = setInterval(() => {
    if (currentTextPosition < text.length) {
      // Симулируем случайные задержки для более реалистичного эффекта печати
      if (Math.random() > 0.95) {
        setTimeout(() => {
          terminalText.value += text[currentTextPosition];
          currentTextPosition++;
          scrollToBottom();
        }, 50 + Math.random() * 100);
      } else {
        terminalText.value += text[currentTextPosition];
        currentTextPosition++;
        scrollToBottom();
      }
    } else {
      clearInterval(typingInterval);
      terminalHistory.value.push(terminalText.value);
      terminalText.value = '';
      scrollToBottom();
    }
  }, 15); // Скорость печати
};

/**
 * Перезагрузка терминала с сохранением количества попыток
 */
const rebootTerminal = () => {
  // Остановим любой процесс печати
  if (typingInterval) {
    clearInterval(typingInterval);
    typingInterval = null;
  }
  
  // Сбросим текущий текст
  terminalText.value = '';
  
  // Сначала показываем сообщение о перезагрузке
  terminalHistory.value = []; // Очистим историю перед сообщением о перезагрузке
  printTextToTerminal('>>> ПЕРЕЗАГРУЗКА СИСТЕМЫ...');
  
  // Активируем эффект глитча при перезагрузке
  triggerGlitchEffect(1500);
  
  // Сбрасываем состояние терминала, но сохраняем количество попыток
  setTimeout(() => {
    // Устанавливаем прогресс загрузки в 0 немедленно
    bootingProgress.value = 0;
    // Отключаем состояние загрузки ДО показа экрана загрузки
    isTerminalBooted.value = false;
    
    // Показываем сообщение "перезагрузка" на момент перед началом последовательности загрузки
    setTimeout(() => {
      // Симулируем загрузку
      const bootInterval = setInterval(() => {
        bootingProgress.value += Math.random() * 8; // Немного быстрее перезагрузка
        if (bootingProgress.value >= 100) {
          bootingProgress.value = 100;
          clearInterval(bootInterval);
          
          // После заполнения прогресс-бара ждем момент
          bootSequenceTimeout = setTimeout(() => {
            // Теперь переходим к экрану загрузки
            isTerminalBooted.value = true;
            
            // Начинаем печатать сообщения загрузки
            setTimeout(() => {
              terminalText.value = ''; // Убеждаемся, что нет частичного текста
              printTextToTerminal(terminalData.bootMessages.join('\n'));
              
              // После завершения сообщений загрузки показываем приветствие
              setTimeout(() => {
                printTextToTerminal(terminalData.welcomeMessage.join('\n'));
                startCursorBlink();
              }, terminalData.bootMessages.join('\n').length * 15 + 800);
            }, 500);
          }, 800);
        }
      }, 100);
    }, 2000);
  }, 1500);
};

/**
 * Обработка команд терминала
*/
const handleCommand = () => {
  if (!currentCommand.value.trim()) return;
  
  // Если тест Войта-Кампфа активен, обрабатываем ответ как ответ на тест
  if (isVoightKampffTestActive.value) {
    const answer = currentCommand.value.trim();
    currentCommand.value = '';
    processVoightKampffAnswer(answer);
    return;
  }
  
  const command = currentCommand.value.trim().toUpperCase();
  terminalHistory.value.push(`> ${currentCommand.value}`);
  currentCommand.value = '';
  
  // Обработка команд
  switch (command) {
    case 'HELP':
      printTextToTerminal(terminalData.helpText.join('\n'));
      break;
    case 'CONTACT':
      if (voightKampffPassed.value) {
        printTextToTerminal(terminalData.contactSuccess.join('\n'));
      } else {
        printTextToTerminal(terminalData.accessDenied.join('\n'));
        
        // Запускаем тест Войта-Кампфа после задержки
        setTimeout(() => {
          startVoightKampffTest();
        }, 2000);
      }
      break;
    case 'CLEAR':
      terminalHistory.value = [];
      break;
    case 'OFF':
      shutdownTerminal();
      break;
    case 'THEME':
      printTextToTerminal(terminalData.themeHelp.join('\n'));
      break;
    default:
      // Проверка команд с параметрами
      if (command.startsWith('BLOG -')) {
        handleBlogCommand(command);
      } else if (command.startsWith('THEME ')) {
        const themeName = command.split(' ')[1];
        changeColorScheme(themeName);
      } else {
        printTextToTerminal(terminalData.unknownCommand.join('\n'));
        triggerGlitchEffect(300); // Небольшой эффект помех при ошибке
      }
  }
  
  scrollToBottom();
};

/**
 * Выключение терминала
 */
const shutdownTerminal = () => {
  printTextToTerminal('>>> ВЫКЛЮЧЕНИЕ СИСТЕМЫ...');
  
  setTimeout(() => {
    isTerminalBooted.value = false;
    isTerminalOn.value = false;
    clearAllIntervals();
  }, 2000);
};

/**
 * Использую composable:
 */
const {
  isVoightKampffTestActive,
  voightKampffPassed,
  startVoightKampffTest,
  processVoightKampffAnswer,
} = useVoightKampffTest({
  printTextToTerminal,
  terminalHistory,
  rebootTerminal,
  shutdownTerminal
});

/**
 * Мигание курсора
 */
const startCursorBlink = () => {
  if (cursorBlinkInterval) {
    clearInterval(cursorBlinkInterval);
  }
  
  cursorBlinkInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 530); // Частота мигания курсора
};

/**
 * Автоматическая прокрутка к низу терминала
 */
const scrollToBottom = () => {
  if (terminalRef.value) {
    setTimeout(() => {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
    }, 10);
  }
};

/**
 * Очистка всех интервалов и таймаутов
 */
const clearAllIntervals = () => {
  if (typingInterval) clearInterval(typingInterval);
  if (cursorBlinkInterval) clearInterval(cursorBlinkInterval);
  if (bootSequenceTimeout) clearTimeout(bootSequenceTimeout);
};

/**
 * Переключение полноэкранного режима терминала
 */
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
  
  // После переключения в полноэкранный режим перематываем терминал вниз
  if (isFullScreen.value) {
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }
};

/**
 * Смена цветовой схемы терминала
 * @param {string} theme - Название темы (GREEN, AMBER, BLUE)
 */
const changeColorScheme = (theme) => {
  const validThemes = ['GREEN', 'AMBER', 'BLUE'];
  const themeName = theme.toUpperCase();
  
  if (!validThemes.includes(themeName)) {
    printTextToTerminal([
      `>>> ERROR: UNDEFINED THEME "${theme}"`,
      '>>> CHOOSE ONE: GREEN, AMBER, BLUE',
      ''
    ].join('\n'));
    triggerGlitchEffect(300);
    return;
  }
  
  // Активируем эффект глитча при смене темы
  triggerGlitchEffect(1000);
  
  // Устанавливаем новую тему
  currentColorScheme.value = themeName.toLowerCase();
  
  printTextToTerminal([
    `>>> ЦВЕТОВАЯ СХЕМА ТЕРМИНАЛА ИЗМЕНЕНА НА: ${themeName}`,
    '>>> СИСТЕМА ПЕРЕКАЛИБРОВЫВАЕТ ПАРАМЕТРЫ ДИСПЛЕЯ...',
    '>>> ПЕРЕКАЛИБРОВКА ДИСПЛЕЯ ЗАВЕРШЕНА',
    ''
  ].join('\n'));
};

/**
 * Создание эффекта глитча/помех на экране
 * @param {number} duration - Продолжительность эффекта в миллисекундах
 */
const triggerGlitchEffect = (duration = 500) => {
  isGlitchActive.value = true;
  
  setTimeout(() => {
    isGlitchActive.value = false;
  }, duration);
};

/**
 * Жизненный цикл компонента
 */
const handleKeyDown = (e) => {
  if (!isTerminalBooted.value) return;
  if (e.key === 'Enter') {
    handleCommand();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  clearAllIntervals();
});
</script>

<template>
  <div class="retro-terminal-container" 
       :class="{
         'fullscreen': isFullScreen, 
         'theme-green': currentColorScheme === 'green',
         'theme-amber': currentColorScheme === 'amber',
         'theme-blue': currentColorScheme === 'blue',
         'glitch-effect': isGlitchActive
       }">
    <!-- Кнопка "Развернуть/Свернуть" -->
    <ExpandButton v-if="isTerminalOn && isTerminalBooted" :isFullScreen="isFullScreen" :onToggle="toggleFullScreen" />
    
    <!-- Экран выключеннного терминала -->
    <TerminalOffScreen v-if="!isTerminalOn" :onPowerOn="bootTerminal" />
    
    <!-- Экран загрузки терминала -->
    <TerminalBootingScreen v-else-if="!isTerminalBooted" :bootingProgress="bootingProgress" />
    
    <!-- Экран рабочего терминала -->
    <TerminalScreen
      v-else
      :terminalHistory="terminalHistory"
      :terminalText="terminalText"
      :currentCommand="currentCommand"
      :cursorVisible="cursorVisible"
      :handleCommand="handleCommand"
      :terminalRef="terminalRef"
      @update:currentCommand="val => currentCommand.value = val"
    />
  </div>
</template>

<style lang="scss" scoped></style>
