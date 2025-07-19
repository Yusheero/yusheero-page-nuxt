<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { terminalData, voightKampffQuestions } from './terminal-data.js';
import './terminal-styles.scss';

/**
 * Основной компонент ретро-терминала с эффектами старого монитора
 * Включает в себя:
 * - Симуляцию загрузки системы
 * - Эффект печатной машинки для вывода текста
 * - Тест Войта-Кампфа для доступа к контактам
 * - Мини-игры
 * - Смену цветовых схем
 * - Полноэкранный режим
 * - Визуальные эффекты (глитч, помехи, мерцание)
 */

// Ссылки на DOM элементы терминала
const terminalRef = ref(null); // Контейнер терминала для прокрутки
const cursorRef = ref(null); // Курсор ввода

/**
 * Основные параметры состояния терминала
 */
const isTerminalOn = ref(false); // Включен ли терминал
const isTerminalBooted = ref(false); // Загружена ли система
const terminalText = ref(''); // Текущий текст, который печатается
const bootingProgress = ref(0); // Прогресс загрузки (0-100%)
const inputText = ref(''); // Введенный пользователем текст
const terminalHistory = ref([]); // История команд и выводов
const cursorVisible = ref(true); // Видимость курсора
const currentCommand = ref(''); // Текущая команда в поле ввода
const isFullScreen = ref(false); // Полноэкранный режим

/**
 * Параметры для визуальных эффектов терминала
 */
const currentColorScheme = ref('green'); // Текущая цветовая схема: green, amber, blue
const isGlitchActive = ref(false); // Активен ли эффект глитча
const isStaticActive = ref(false); // Активны ли помехи

/**
 * Флаги для теста Войта-Кампфа (проверка на человека)
 */
const isVoightKampffTestActive = ref(false); // Активен ли тест
const currentVoightKampffQuestion = ref(0); // Номер текущего вопроса
const voightKampffPassed = ref(false); // Прошел ли пользователь тест
const voightKampffAttempts = ref(0); // Количество попыток прохождения

/**
 * Переменные для управления анимациями и таймерами
 */
let currentTextPosition = 0; // Текущая позиция в тексте при печати
let typingInterval; // Интервал для эффекта печатной машинки
let cursorBlinkInterval; // Интервал мигания курсора
let bootSequenceTimeout; // Таймаут для последовательности загрузки

/**
 * Переменная для активной игры в терминале
 */
const activeGame = ref(null);

/**
 * Симуляция загрузки терминала с эффектами старого монитора
 * Включает:
 * - Эффект мерцания при включении
 * - Случайные задержки в процессе загрузки
 * - Визуальные эффекты глитча
 * - Последовательный вывод сообщений загрузки
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
 * @param {string} text - Текст для печати
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
 * Запуск теста Войта-Кампфа для проверки на человека
 * Тест основан на анализе эмоциональных реакций
 */
const startVoightKampffTest = () => {
  isVoightKampffTestActive.value = true;
  currentVoightKampffQuestion.value = 0;
  
  printTextToTerminal(terminalData.contactForm.join('\n'));
  
  // Показываем первый вопрос после задержки
  setTimeout(() => {
    askVoightKampffQuestion();
  }, terminalData.contactForm.join('\n').length * 15 + 1000);
};

/**
 * Задаем текущий вопрос теста Войта-Кампфа
 */
const askVoightKampffQuestion = () => {
  if (currentVoightKampffQuestion.value >= voightKampffQuestions.length) {
    // Тест завершен
    completeVoightKampffTest();
    return;
  }
  
  const question = voightKampffQuestions[currentVoightKampffQuestion.value];
  
  let questionText = `>>> ВОПРОС ${currentVoightKampffQuestion.value + 1}/${voightKampffQuestions.length}:\n${question.question}\n`;
  
  printTextToTerminal(questionText);
};

/**
 * Обрабатываем ответ на текущий вопрос теста Войта-Кампфа
 * @param {string} answer - Ответ пользователя
 */
const processVoightKampffAnswer = (answer) => {
  const currentQuestion = voightKampffQuestions[currentVoightKampffQuestion.value];
  const answerUpperCase = answer.toUpperCase().trim();
  
  // Записываем ответ
  terminalHistory.value.push(`> ${answer}`);
  
  // Определяем, является ли ответ "человеческим"
  let isHumanLikeResponse = false;
  
  // Проверяем, есть ли ответ пользователя в списке правильных ответов
  if (currentQuestion.correctAnswers.includes(answerUpperCase)) {
    isHumanLikeResponse = true;
  } else if (currentQuestion.incorrectAnswers.includes(answerUpperCase)) {
    isHumanLikeResponse = false;
  } else {
    // Если ответ не найден ни в правильных, ни в неправильных ответах,
    // проверяем, содержит ли он какой-либо из правильных ответов
    isHumanLikeResponse = currentQuestion.correctAnswers.some(
      correctAnswer => answerUpperCase.includes(correctAnswer)
    );
  }
  
  // Анализ ответа с медицинскими показателями
  let analysisText = '';
  if (isHumanLikeResponse) {
    analysisText = [
      '>>> АНАЛИЗ ОТВЕТА...',
      '>>> Расширение зрачков: НОРМАЛЬНОЕ',
      '>>> Частота дыхания: В ПРЕДЕЛАХ ЧЕЛОВЕЧЕСКИХ ПАРАМЕТРОВ',
      '>>> Задержка ответа: ПРИЕМЛЕМАЯ',
      ''
    ].join('\n');
  } else {
    analysisText = [
      '>>> АНАЛИЗ ОТВЕТА...',
      '>>> Расширение зрачков: АНОМАЛЬНОЕ',
      '>>> Частота дыхания: ПОВЫШЕННАЯ',
      '>>> Задержка ответа: ПОДОЗРИТЕЛЬНАЯ',
      ''
    ].join('\n');
  }
  
  printTextToTerminal(analysisText);
  
  // Переходим к следующему вопросу
  setTimeout(() => {
    if (isHumanLikeResponse) {
      currentVoightKampffQuestion.value++;
      
      // Если есть еще вопросы, задаем следующий
      if (currentVoightKampffQuestion.value < voightKampffQuestions.length) {
        askVoightKampffQuestion();
      } else {
        // Тест успешно завершен
        voightKampffPassed.value = true;
        completeVoightKampffTest();
      }
    } else {
      // Показываем предупреждение о неправильном ответе
      printTextToTerminal(terminalData.wrongAnswer.join('\n'));
      
      // Задержка перед провалом теста
      setTimeout(() => {
        // Тест провален
        failVoightKampffTest();
      }, terminalData.wrongAnswer.join('\n').length * 15 + 1000);
    }
  }, analysisText.length * 15 + 1000);
};

/**
 * Завершение теста Войта-Кампфа
 */
const completeVoightKampffTest = () => {
  if (voightKampffPassed.value) {
    printTextToTerminal(terminalData.contactSuccess.join('\n'));
    
    // После сообщения об успехе завершаем тест
    setTimeout(() => {
      isVoightKampffTestActive.value = false;
    }, terminalData.contactSuccess.join('\n').length * 15 + 1000);
  } else {
    failVoightKampffTest();
  }
};

/**
 * Провал теста Войта-Кампфа
 */
const failVoightKampffTest = () => {
  voightKampffAttempts.value++;
  printTextToTerminal(terminalData.errorMessages[1]);
  
  // Перезагружаем терминал после провала
  setTimeout(() => {
    isVoightKampffTestActive.value = false;
    
    // Если слишком много попыток, полностью блокируем доступ
    if (voightKampffAttempts.value >= 3) {
      shutdownTerminal();
    } else {
      // Просто перезагружаем терминал
      rebootTerminal();
    }
  }, 3000);
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
 * Поддерживает:
 * - Базовые команды (HELP, SKILLS, PROJECTS, etc.)
 * - Команды с параметрами (BLOG -FULL, THEME)
 * - Тест Войта-Кампфа
 * - Мини-игры
 */
const handleCommand = () => {
  if (!currentCommand.value.trim()) return;
  
  // Если активна игра
  if (activeGame.value) {
    const input = currentCommand.value.trim();
    terminalHistory.value.push(`> ${currentCommand.value}`);
    currentCommand.value = '';
    
    // Обрабатываем ввод для активной игры
    const result = activeGame.value.handleCommand(input);
    if (result) {
      printTextToTerminal(result.join('\n'));
    }
    
    // Если игра завершена, сбрасываем активную игру
    if (!activeGame.value.isActive) {
      activeGame.value = null;
    }
    
    return;
  }
  
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
    case 'SKILLS':
      printTextToTerminal(terminalData.skills.join('\n'));
      break;
    case 'PROJECTS':
      printTextToTerminal(terminalData.projects.join('\n'));
      break;
    case 'ABOUT':
      printTextToTerminal(terminalData.aboutMe.join('\n'));
      break;
    case 'BLOG':
      printTextToTerminal(terminalData.blog.join('\n'));
      break;
    case 'SERVICES':
      printTextToTerminal(terminalData.services.join('\n'));
      break;
    case 'LS':
      printTextToTerminal(terminalData.directory.join('\n'));
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
    case 'GAME':
    case 'GAMES':
      printTextToTerminal(terminalData.gameHelp.join('\n'));
      break;
    case 'GUESS':
      if (terminalGames.hasGame('guess')) {
        activeGame.value = terminalGames.getGame('guess');
        const introMessage = activeGame.value.start();
        printTextToTerminal(introMessage.join('\n'));
      }
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
 * Обработка команд блога с параметрами
 * @param {string} command - Команда с параметрами
 */
const handleBlogCommand = (command) => {
  if (command.startsWith('BLOG -FULL')) {
    // Проверяем, есть ли номер статьи
    const parts = command.split(' ');
    const articleNumber = parts[2] ? parseInt(parts[2]) : 1;
    
    if (articleNumber && terminalData.blogFull[articleNumber]) {
      printTextToTerminal(terminalData.blogFull[articleNumber].join('\n'));
    } else {
      printTextToTerminal([
        '>>> ОШИБКА: СТАТЬЯ НЕ НАЙДЕНА',
        '>>> ИСПОЛЬЗОВАНИЕ: BLOG -FULL [номер]',
        '>>> ДОСТУПНЫЕ СТАТЬИ: 1, 2, 3',
        ''
      ].join('\n'));
    }
  } else {
    printTextToTerminal([
      '>>> ОШИБКА: НЕИЗВЕСТНАЯ КОМАНДА БЛОГА',
      '>>> ДОСТУПНЫЕ КОМАНДЫ БЛОГА:',
      '    BLOG       - список последних постов',
      '    BLOG -FULL [номер] - показать полную статью',
      ''
    ].join('\n'));
  }
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
 * Обработчик нажатий клавиш
 * @param {KeyboardEvent} e - Событие клавиши
 */
const handleKeyDown = (e) => {
  if (!isTerminalBooted.value) return;
  
  if (e.key === 'Enter') {
    handleCommand();
  }
};

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
      `>>> ОШИБКА: НЕДОПУСТИМАЯ ТЕМА "${theme}"`,
      '>>> ДОСТУПНЫЕ ТЕМЫ: GREEN, AMBER, BLUE',
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
    <!-- Expand/collapse button -->
    <button v-if="isTerminalOn && isTerminalBooted" class="expand-button" @click.stop="toggleFullScreen">
      <div class="expand-icon">{{ isFullScreen ? '▼' : '▲' }}</div>
    </button>
    
    <!-- Turned off terminal screen -->
    <div v-if="!isTerminalOn" class="terminal-off" @click="bootTerminal">
      <div class="terminal-off-text">
        CLICK TO POWER ON TERMINAL
      </div>
      <div class="system-info">
        YUSHEERO OS v1.0.666 | STANDBY MODE | POWER SAVING ENABLED
      </div>
      <div class="scanlines"></div>
      <div class="terminal-glow"></div>
    </div>
    
    <!-- Loading screen -->
    <div v-else-if="!isTerminalBooted" class="terminal-booting">
      <div class="boot-progress">
        <div class="boot-progress-bar" :style="{ width: bootingProgress + '%' }"></div>
      </div>
      <div class="boot-text">SYSTEM LOADING... {{ Math.floor(bootingProgress) }}%</div>
      <div class="boot-info">
        INITIALIZING MEMORY | CONFIGURING INTERFACE | LOADING CORE MODULES
      </div>
      <div class="scanlines"></div>
      <div class="terminal-glow"></div>
    </div>
    
    <!-- Working terminal -->
    <div v-else class="terminal-screen">
      <div class="terminal-content" ref="terminalRef">
        <div class="terminal-history">
          <div v-for="(line, index) in terminalHistory" :key="index" class="terminal-line" v-html="line.replace(/\n/g, '<br>')"></div>
        </div>
        
        <div class="terminal-current-line" v-if="terminalText">
          <div v-html="terminalText.replace(/\n/g, '<br>')"></div>
        </div>
        
        <div class="terminal-input">
          <span class="terminal-prompt">&gt;</span>
          <input 
            type="text" 
            v-model="currentCommand" 
            class="terminal-command-input"
            :class="{ 'cursor-visible': cursorVisible }"
            @keydown.enter="handleCommand"
            autofocus
          />
        </div>
      </div>
      
      <div class="scanlines"></div>
      <div class="terminal-glow"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

/**
 * Цветовые переменные для различных тем терминала
 */
$terminal-green: #4afa9a; // Основной зеленый цвет (классический терминал)
$terminal-dark-green: #052505; // Темно-зеленый фон
$terminal-amber: #ffb000; // Янтарный цвет (старые мониторы)
$terminal-dark-amber: #251500; // Темно-янтарный фон
$terminal-blue: #00ccff; // Синий цвет (современные терминалы)
$terminal-dark-blue: #001825; // Темно-синий фон

/**
 * Основной контейнер терминала
 * Содержит все состояния: выключен, загрузка, рабочий режим
 */
.retro-terminal-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: #000;
  font-family: 'VT323', monospace; // Ретро-шрифт для аутентичности
  color: $terminal-green;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  z-index: 1;
  
  /**
   * Зеленая тема (по умолчанию) - классический терминал
   */
  &.theme-green {
    color: $terminal-green;
    background-color: $terminal-dark-green;
    
    .terminal-command-input {
      color: $terminal-green;
    }
    
    .terminal-screen {
      background-color: $terminal-dark-green;
    }
    
    .boot-progress-bar {
      background-color: $terminal-green;
    }
    
    .terminal-glow {
      box-shadow: inset 0 0 150px rgba($terminal-green, 0.1);
    }
    
    .expand-button {
      border-color: $terminal-green;
      .expand-icon {
        color: $terminal-green;
      }
    }
  }
  
  /**
   * Янтарная тема - имитация старых мониторов
   */
  &.theme-amber {
    color: $terminal-amber;
    background-color: $terminal-dark-amber;
    box-shadow: 0 0 20px rgba(255, 176, 0, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.8);
    
    .terminal-command-input {
      color: $terminal-amber;
    }
    
    .terminal-screen {
      background-color: $terminal-dark-amber;
    }
    
    .boot-progress-bar {
      background-color: $terminal-amber;
    }
    
    .terminal-glow {
      box-shadow: inset 0 0 150px rgba($terminal-amber, 0.1);
    }
    
    .expand-button {
      border-color: $terminal-amber;
      .expand-icon {
        color: $terminal-amber;
      }
    }
  }
  
  /**
   * Синяя тема - современный терминал
   */
  &.theme-blue {
    color: $terminal-blue;
    background-color: $terminal-dark-blue;
    box-shadow: 0 0 20px rgba(0, 204, 255, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.8);
    
    .terminal-command-input {
      color: $terminal-blue;
    }
    
    .terminal-screen {
      background-color: $terminal-dark-blue;
    }
    
    .boot-progress-bar {
      background-color: $terminal-blue;
    }
    
    .terminal-glow {
      box-shadow: inset 0 0 150px rgba($terminal-blue, 0.1);
    }
    
    .expand-button {
      border-color: $terminal-blue;
      .expand-icon {
        color: $terminal-blue;
      }
    }
  }
  
  /**
   * Эффект глитча - визуальное искажение экрана
   */
  &.glitch-effect {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -10%;
      width: 120%;
      height: 100%;
      background: linear-gradient(
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      transform: skewX(-20deg);
      animation: glitch-scan 0.5s linear infinite;
      z-index: 10;
      pointer-events: none;
    }
    
    .terminal-line, .terminal-current-line, .terminal-prompt, .terminal-command-input, .boot-text, .boot-info {
      animation: glitch-text 0.2s ease-in-out infinite;
    }
  }
  
  /**
   * Градиентные затемнения сверху и снизу для эффекта глубины
   */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
    z-index: 3;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    z-index: 3;
    pointer-events: none;
  }
  
  /**
   * Стили для полноэкранного режима
   */
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    z-index: 9999;
  }
}

/**
 * Экран выключенного терминала
 * Показывается когда терминал не включен
 */
.terminal-off {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  cursor: pointer;
  position: relative;
  
  &-text {
    color: rgba($terminal-green, 0.3);
    font-size: 24px;
    letter-spacing: 2px;
    text-transform: uppercase;
    animation: pulse 2s infinite; // Пульсирующий эффект для привлечения внимания
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
    margin-bottom: 20px;
  }
  
  .system-info {
    color: rgba($terminal-green, 0.15);
    font-size: 14px;
    letter-spacing: 1px;
    margin-top: 30px;
    font-family: 'VT323', monospace;
  }
}

/**
 * Экран загрузки терминала
 * Показывается во время процесса загрузки системы
 */
.terminal-booting {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: $terminal-dark-green;
  position: relative;
  
  /**
   * Прогресс-бар загрузки
   */
  .boot-progress {
    width: 70%;
    height: 30px;
    background-color: rgba($terminal-dark-green, 0.7);
    border: 2px solid $terminal-green;
    border-radius: 4px;
    margin-bottom: 30px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 10px rgba($terminal-green, 0.3);
    
    &-bar {
      height: 100%;
      background-color: $terminal-green;
      background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 30px 30px;
      transition: width 0.1s ease-out;
    }
  }
  
  .boot-text {
    font-size: 24px;
    letter-spacing: 2px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.7);
    margin-bottom: 20px;
    font-family: 'VT323', monospace;
  }
  
  .boot-info {
    font-size: 16px;
    letter-spacing: 1px;
    color: rgba($terminal-green, 0.7);
    margin-top: 30px;
    text-shadow: 0 0 3px rgba($terminal-green, 0.5);
    animation: flicker 2s infinite; // Эффект мерцания для реалистичности
  }
  
  /**
   * Радиальный градиент для эффекта глубины
   */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
}

/**
 * Рабочий экран терминала
 * Основной интерфейс для взаимодействия
 */
.terminal-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: $terminal-dark-green;
  overflow: hidden;
  padding: 20px 20px 20px 30px;
  
  /**
   * Контейнер содержимого терминала
   */
  .terminal-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 2;
    
    /**
     * Стилизация скроллбара
     */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba($terminal-green, 0.5);
      border-radius: 4px;
    }
  }
  
  /**
   * История команд и выводов
   */
  .terminal-history {
    margin-bottom: 10px;
  }
  
  /**
   * Отдельная строка в истории
   */
  .terminal-line {
    line-height: 1.3;
    white-space: pre-wrap;
    font-size: 20px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
  }
  
  /**
   * Текущая строка, которая печатается
   */
  .terminal-current-line {
    line-height: 1.3;
    white-space: pre-wrap;
    font-size: 20px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
    margin-bottom: 10px;
  }
  
  /**
   * Строка ввода команд
   */
  .terminal-input {
    display: flex;
    align-items: center;
    font-size: 20px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
    
    .terminal-prompt {
      margin-right: 5px;
    }
    
    /**
     * Поле ввода команд
     */
    .terminal-command-input {
      background: transparent;
      border: none;
      color: $terminal-green;
      font-family: 'VT323', monospace;
      font-size: 20px;
      outline: none;
      flex: 1;
      text-shadow: 0 0 5px rgba($terminal-green, 0.5);
      position: relative;
      
      /**
       * Мигающий курсор
       */
      &.cursor-visible::after {
        content: '█';
        animation: blink 1s step-end infinite;
      }
    }
  }
  
  /**
   * Эффект свечения экрана
   */
  .terminal-glow {
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 150px rgba($terminal-green, 0.1);
    z-index: 1;
  }
}

/**
 * Эффект сканирующих линий (имитация старого монитора)
 */
.scanlines {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.3) 50%
  );
  background-size: 100% 4px;
  z-index: 2;
  opacity: 0.2;
  
  /**
   * Дополнительные вертикальные линии
   */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) 50%, transparent 50%, transparent);
    background-size: 2px 100%;
    z-index: 1;
  }
}

/**
 * Анимация мигания курсора
 */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/**
 * Анимация пульсации для привлечения внимания
 */
@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/**
 * Анимация мерцания для эффекта старого монитора
 */
@keyframes flicker {
  0% { opacity: 0.97; }
  5% { opacity: 0.95; }
  10% { opacity: 0.9; }
  15% { opacity: 0.95; }
  20% { opacity: 0.98; }
  25% { opacity: 0.94; }
  30% { opacity: 0.98; }
  35% { opacity: 0.95; }
  40% { opacity: 0.97; }
  45% { opacity: 0.94; }
  50% { opacity: 0.98; }
  55% { opacity: 0.95; }
  60% { opacity: 0.97; }
  65% { opacity: 0.95; }
  70% { opacity: 0.96; }
  75% { opacity: 0.94; }
  80% { opacity: 0.98; }
  85% { opacity: 0.96; }
  90% { opacity: 0.95; }
  95% { opacity: 0.94; }
  100% { opacity: 0.95; }
}

/**
 * Анимация включения питания (эффект старого монитора)
 */
@keyframes powerOn {
  0% { 
    filter: brightness(5);
    background-color: #fff;
  }
  20% { 
    filter: brightness(0.2);
    background-color: #000;
  }
  40% { 
    filter: brightness(2);
    background-color: #0a0a0a;
  }
  60% { 
    filter: brightness(0.3);
    background-color: #000;
  }
  80% { 
    filter: brightness(1.5);
    background-color: #050505;
  }
  100% { 
    filter: brightness(1);
    background-color: #000;
  }
}

/**
 * Кнопка переключения полноэкранного режима
 */
.expand-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid $terminal-green;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;
  padding: 0;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0 0 10px rgba($terminal-green, 0.5);
  }
  
  .expand-icon {
    color: $terminal-green;
    font-size: 14px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.7);
  }
}

/**
 * Анимация сканирования глитча
 */
@keyframes glitch-scan {
  0% { top: -100%; }
  100% { top: 100%; }
}

/**
 * Анимация дрожания текста при глитче
 */
@keyframes glitch-text {
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(2px); }
  100% { transform: translateX(0); }
}
</style>
