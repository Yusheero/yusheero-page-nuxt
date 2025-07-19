<script setup>
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue';
import { terminalData, voightKampffQuestions } from './terminal-data.js';
import { useTerminalState } from '~/composables/useTerminalState.js';
import { useTerminalText } from '~/composables/useTerminalText.js';
import { useVoightKampff } from '~/composables/useVoightKampff.js';
import { CommandManager, CommandFactory, CommandParser } from '~/utils/terminalCommands.js';
import { Debouncer, Throttler, TextRenderer, HistoryOptimizer } from '~/utils/terminalOptimizations.js';
import './terminal-styles.scss';

/**
 * Оптимизированный компонент терминала
 * Использует композаблы, систему команд и оптимизации производительности
 */

// Ссылки на DOM элементы
const terminalRef = ref(null);
const inputRef = ref(null);

// Композаблы для управления состоянием
const terminalState = useTerminalState();
const terminalText = useTerminalText();
const voightKampff = useVoightKampff(terminalText.printTextToTerminal, terminalText.addToHistory);

// Система команд
const commandManager = new CommandManager();
const commandParser = new CommandParser();

// Оптимизации производительности
const scrollDebouncer = new Debouncer(16); // ~60fps
const inputThrottler = new Throttler(100);
const textRenderer = new TextRenderer();
const historyOptimizer = new HistoryOptimizer(500);

// Переменные для игр
const activeGame = ref(null);

// Вычисляемые свойства для оптимизации рендеринга
const terminalClasses = computed(() => ({
  'fullscreen': terminalState.isFullScreen.value,
  [`theme-${terminalState.currentColorScheme.value}`]: true,
  'glitch-effect': terminalState.isGlitchActive.value
}));

const canAcceptInput = computed(() => 
  terminalState.isTerminalReady.value && 
  !terminalState.isGlitchActive.value && 
  !terminalText.isPrinting()
);

// Инициализация системы команд
const initializeCommands = () => {
  // Регистрируем базовые команды
  commandManager.register(CommandFactory.createHelpCommand(terminalData));
  commandManager.register(CommandFactory.createSkillsCommand(terminalData));
  commandManager.register(CommandFactory.createProjectsCommand(terminalData));
  commandManager.register(CommandFactory.createAboutCommand(terminalData));
  commandManager.register(CommandFactory.createBlogCommand(terminalData));
  commandManager.register(CommandFactory.createThemeCommand());
  commandManager.register(CommandFactory.createClearCommand());
  commandManager.register(CommandFactory.createOffCommand());
  
  // Регистрируем команды с псевдонимами
  commandManager.register(
    new CommandFactory.createThemeCommand(),
    ['THEMES', 'COLOR', 'COLORS']
  );
  
  commandManager.register(
    new CommandFactory.createClearCommand(),
    ['CLS', 'CLEARSCREEN']
  );
};

/**
 * Загрузка терминала с оптимизированной анимацией
 */
const bootTerminal = async () => {
  terminalState.setTerminalOn(true);
  terminalState.setBootingProgress(0);
  terminalText.clearHistory();
  
  // Активируем эффект глитча
  terminalState.triggerGlitch(1000);
  
  // Симулируем мерцание при включении
  const terminalElement = document.querySelector('.retro-terminal-container');
  if (terminalElement) {
    terminalElement.classList.add('power-on');
    setTimeout(() => {
      terminalElement.classList.remove('power-on');
    }, 1000);
  }
  
  // Оптимизированная загрузка с requestAnimationFrame
  const animateBoot = () => {
    if (terminalState.bootingProgress.value < 100) {
      // Случайные приращения с ограничением
      if (Math.random() > 0.2) {
        const increment = Math.random() * 5;
        terminalState.setBootingProgress(
          terminalState.bootingProgress.value + increment
        );
      }
      
      // Периодические задержки
      if (Math.random() > 0.95 && 
          terminalState.bootingProgress.value > 10 && 
          terminalState.bootingProgress.value < 90) {
        terminalState.setBootingProgress(
          terminalState.bootingProgress.value - Math.random() * 2
        );
      }
      
      requestAnimationFrame(animateBoot);
    } else {
      // Загрузка завершена
      setTimeout(async () => {
        terminalState.setTerminalBooted(true);
        
        await nextTick();
        
        // Печатаем сообщения загрузки
        await terminalText.printTextToTerminal(terminalData.bootMessages.join('\n'));
        
        // Показываем приветствие
        await terminalText.printTextToTerminal(terminalData.welcomeMessage.join('\n'));
        
        // Запускаем мигание курсора
        terminalText.startCursorBlink();
        
        // Фокусируемся на поле ввода
        if (inputRef.value) {
          inputRef.value.focus();
        }
      }, 500);
    }
  };
  
  requestAnimationFrame(animateBoot);
};

/**
 * Обработка команд с оптимизированным парсингом
 */
const handleCommand = async () => {
  if (!terminalText.currentCommand.value.trim() || !canAcceptInput.value) {
    return;
  }
  
  const commandString = terminalText.currentCommand.value.trim();
  terminalText.addToHistory(`> ${commandString}`);
  terminalText.currentCommand.value = '';
  
  // Если активна игра
  if (activeGame.value) {
    const result = activeGame.value.handleCommand(commandString);
    if (result) {
      await terminalText.printTextToTerminal(result.join('\n'));
    }
    
    if (!activeGame.value.isActive) {
      activeGame.value = null;
    }
    return;
  }
  
  // Если активен тест Войта-Кампфа
  if (voightKampff.isVoightKampffTestActive.value) {
    await voightKampff.processVoightKampffAnswer(
      commandString,
      voightKampffQuestions,
      terminalData.wrongAnswer
    );
    return;
  }
  
  // Парсим команду
  const { command, params } = commandParser.parse(commandString);
  
  // Специальная обработка для команды CONTACT
  if (command.toUpperCase() === 'CONTACT') {
    if (voightKampff.voightKampffPassed.value) {
      await terminalText.printTextToTerminal(terminalData.contactSuccess.join('\n'));
    } else {
      await terminalText.printTextToTerminal(terminalData.accessDenied.join('\n'));
      
      setTimeout(() => {
        voightKampff.startVoightKampffTest(terminalData.contactForm, voightKampffQuestions);
      }, 2000);
    }
    return;
  }
  
  // Выполняем команду через систему команд
  const context = {
    clearHistory: terminalText.clearHistory,
    shutdown: shutdownTerminal,
    theme: terminalState.currentColorScheme.value,
    onThemeChange: terminalState.setColorScheme,
    triggerGlitch: terminalState.triggerGlitch
  };
  
  const result = commandManager.execute(command, params, context);
  
  if (result.success) {
    if (result.result.type === 'text') {
      await terminalText.printTextToTerminal(result.result.content);
    } else if (result.result.type === 'clear') {
      // История уже очищена в контексте
    } else if (result.result.type === 'shutdown') {
      await terminalText.printTextToTerminal(result.result.content);
    }
  } else {
    await terminalText.printTextToTerminal(result.message);
    terminalState.triggerGlitch(300);
  }
  
  // Оптимизированная прокрутка
  scrollToBottom();
};

/**
 * Оптимизированная прокрутка к низу
 */
const scrollToBottom = () => {
  scrollDebouncer.debounce(() => {
    if (terminalRef.value) {
      textRenderer.smoothScrollTo(terminalRef.value, {
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  });
};

/**
 * Обработчик клавиатуры с троттлингом
 */
const handleKeyDown = (e) => {
  if (!terminalState.isTerminalReady.value) return;
  
  inputThrottler.throttle(() => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  });
};

/**
 * Выключение терминала
 */
const shutdownTerminal = async () => {
  await terminalText.printTextToTerminal('>>> ВЫКЛЮЧЕНИЕ СИСТЕМЫ...');
  
  setTimeout(() => {
    terminalState.setTerminalBooted(false);
    terminalState.setTerminalOn(false);
    terminalText.clearAllTimers();
  }, 2000);
};

/**
 * Перезагрузка терминала
 */
const rebootTerminal = async () => {
  terminalText.clearAllTimers();
  terminalText.clearHistory();
  
  await terminalText.printTextToTerminal('>>> ПЕРЕЗАГРУЗКА СИСТЕМЫ...');
  terminalState.triggerGlitch(1500);
  
  setTimeout(() => {
    terminalState.setBootingProgress(0);
    terminalState.setTerminalBooted(false);
    
    setTimeout(() => {
      bootTerminal();
    }, 2000);
  }, 1500);
};

/**
 * Оптимизация истории при изменении
 */
const optimizedHistory = computed(() => {
  return historyOptimizer.optimizeHistory(terminalText.terminalHistory.value);
});

// Инициализация при монтировании
onMounted(() => {
  initializeCommands();
  window.addEventListener('keydown', handleKeyDown);
});

// Очистка при размонтировании
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  terminalText.clearAllTimers();
  textRenderer.destroy();
  scrollDebouncer.cancel();
});
</script>

<template>
  <div class="retro-terminal-container" :class="terminalClasses">
    <!-- Кнопка полноэкранного режима -->
    <button 
      v-if="terminalState.isTerminalReady" 
      class="expand-button" 
      @click.stop="terminalState.toggleFullScreen"
    >
      <div class="expand-icon">
        {{ terminalState.isFullScreen ? '▼' : '▲' }}
      </div>
    </button>
    
    <!-- Выключенный терминал -->
    <div v-if="!terminalState.isTerminalOn" class="terminal-off" @click="bootTerminal">
      <div class="terminal-off-text">
        CLICK TO POWER ON TERMINAL
      </div>
      <div class="system-info">
        YUSHEERO OS v1.0.666 | STANDBY MODE | POWER SAVING ENABLED
      </div>
      <div class="scanlines"></div>
      <div class="terminal-glow"></div>
    </div>
    
    <!-- Экран загрузки -->
    <div v-else-if="!terminalState.isTerminalBooted" class="terminal-booting">
      <div class="boot-progress">
        <div 
          class="boot-progress-bar" 
          :style="{ width: terminalState.bootingProgress + '%' }"
        ></div>
      </div>
      <div class="boot-text">
        SYSTEM LOADING... {{ Math.floor(terminalState.bootingProgress) }}%
      </div>
      <div class="boot-info">
        INITIALIZING MEMORY | CONFIGURING INTERFACE | LOADING CORE MODULES
      </div>
      <div class="scanlines"></div>
      <div class="terminal-glow"></div>
    </div>
    
    <!-- Рабочий терминал -->
    <div v-else class="terminal-screen">
      <div class="terminal-content" ref="terminalRef">
        <!-- Оптимизированная история -->
        <div class="terminal-history">
          <div 
            v-for="(line, index) in optimizedHistory" 
            :key="`history-${index}`" 
            class="terminal-line"
            v-html="textRenderer.renderText(line)"
          ></div>
        </div>
        
        <!-- Текущий текст -->
        <div v-if="terminalText.terminalText" class="terminal-current-line">
          <div v-html="textRenderer.renderText(terminalText.terminalText)"></div>
        </div>
        
        <!-- Строка ввода -->
        <div class="terminal-input">
          <span class="terminal-prompt">&gt;</span>
          <input 
            ref="inputRef"
            type="text" 
            v-model="terminalText.currentCommand" 
            class="terminal-command-input"
            :class="{ 'cursor-visible': terminalText.cursorVisible }"
            :disabled="!canAcceptInput"
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
// Используем существующие стили из terminal-styles.scss
// Дополнительные оптимизации для производительности

.terminal-content {
  // Оптимизация для больших списков
  contain: layout style paint;
  
  .terminal-history {
    // Виртуализация для больших списков
    contain: layout style;
    
    .terminal-line {
      // Оптимизация рендеринга
      contain: layout style;
      will-change: transform;
    }
  }
}

.terminal-command-input {
  // Оптимизация ввода
  contain: layout style;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Оптимизация анимаций
.terminal-line,
.terminal-current-line,
.terminal-prompt,
.terminal-command-input {
  // Используем transform вместо изменения свойств
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style> 