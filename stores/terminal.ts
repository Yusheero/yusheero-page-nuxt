import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { terminalData } from '@/data/terminal';
import { voightKampffQuestions } from '@/data/voightKampffQuestions';
import type { VoightKampffQuestion as VKQ } from '@/data/voightKampffQuestions';

// Расширяем тип VoightKampffQuestion для поддержки _shuffledAnswers
declare module '@/data/voightKampffQuestions' {
  interface VoightKampffQuestion {
    _shuffledAnswers?: string[];
  }
}

export const useTerminalStore = defineStore('terminal', () => {
  // Основные параметры состояния терминала
  const isTerminalOn = ref(false);
  const isTerminalBooted = ref(false);
  const terminalText = ref('');
  const bootingProgress = ref(0);
  const terminalHistory = ref<string[]>([]);
  const cursorVisible = ref(true);
  const currentCommand = ref('');
  const isFullScreen = ref(false);
  
  // Параметры для визуальных эффектов
  const currentColorScheme = ref('green');
  const isGlitchActive = ref(false);
  
  // Состояние теста Войта-Кампфа
  const isVoightKampffTestActive = ref(false);
  const currentVoightKampffQuestion = ref(0);
  const voightKampffPassed = ref(false);
  const voightKampffAttempts = ref(0);
  
  // Переменные для управления анимациями
  let currentTextPosition = 0;
  let typingInterval: ReturnType<typeof setInterval> | null = null;
  let cursorBlinkInterval: ReturnType<typeof setInterval> | null = null;
  let bootSequenceTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // Методы управления терминалом
  const printTextToTerminal = (text: string) => {
    if (typingInterval) {
      clearInterval(typingInterval);
    }
    
    currentTextPosition = 0;
    terminalText.value = '';
    
    typingInterval = setInterval(() => {
      if (currentTextPosition < text.length) {
        if (Math.random() > 0.95) {
          setTimeout(() => {
            terminalText.value += text[currentTextPosition];
            currentTextPosition++;
          }, 50 + Math.random() * 100);
        } else {
          terminalText.value += text[currentTextPosition];
          currentTextPosition++;
        }
      } else {
        if (typingInterval) {
          clearInterval(typingInterval);
        }
        terminalHistory.value.push(terminalText.value);
        terminalText.value = '';
      }
    }, 15);
  };
  
  const bootTerminal = () => {
    isTerminalOn.value = true;
    bootingProgress.value = 0;
    terminalHistory.value = [];
    
    // Сбрасываем состояние теста Войта-Кампфа
    isVoightKampffTestActive.value = false;
    currentVoightKampffQuestion.value = 0;
    voightKampffPassed.value = false;
    voightKampffAttempts.value = 0;
    
    triggerGlitchEffect(1000);
    
    const bootInterval = setInterval(() => {
      if (Math.random() > 0.2) {
        bootingProgress.value += Math.random() * 5;
      }
      
      if (Math.random() > 0.95 && bootingProgress.value > 10 && bootingProgress.value < 90) {
        bootingProgress.value -= Math.random() * 2;
      }
      
      if (bootingProgress.value >= 100) {
        bootingProgress.value = 100;
        clearInterval(bootInterval);
        
        bootSequenceTimeout = setTimeout(() => {
          isTerminalBooted.value = true;
          
          setTimeout(() => {
            terminalText.value = '';
            printTextToTerminal(terminalData.bootMessages.join('\n'));
            
            setTimeout(() => {
              printTextToTerminal(terminalData.welcomeMessage.join('\n'));
              startCursorBlink();
            }, terminalData.bootMessages.join('\n').length * 15 + 1000);
          }, 500);
        }, 800);
      }
    }, 100);
  };
  
  const rebootTerminal = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    
    terminalText.value = '';
    terminalHistory.value = [];
    
    // Сбрасываем состояние теста Войта-Кампфа
    isVoightKampffTestActive.value = false;
    currentVoightKampffQuestion.value = 0;
    voightKampffPassed.value = false;
    
    triggerGlitchEffect(1500);
    
    setTimeout(() => {
      bootingProgress.value = 0;
      isTerminalBooted.value = false;
      
      setTimeout(() => {
        const bootInterval = setInterval(() => {
          bootingProgress.value += Math.random() * 8;
          if (bootingProgress.value >= 100) {
            bootingProgress.value = 100;
            clearInterval(bootInterval);
            
            bootSequenceTimeout = setTimeout(() => {
              isTerminalBooted.value = true;
              
              setTimeout(() => {
                terminalText.value = '';
                printTextToTerminal(terminalData.bootMessages.join('\n'));
                
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
  
  const shutdownTerminal = () => {
    printTextToTerminal('TURN OFF SYSTEM...');
    
    setTimeout(() => {
      isTerminalBooted.value = false;
      isTerminalOn.value = false;
      
      // Сбрасываем все состояния
      terminalText.value = '';
      terminalHistory.value = [];
      currentCommand.value = '';
      isVoightKampffTestActive.value = false;
      currentVoightKampffQuestion.value = 0;
      voightKampffPassed.value = false;
      voightKampffAttempts.value = 0;
      
      clearAllIntervals();
    }, 2000);
  };
  
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
        if (command.startsWith('THEME ')) {
          const themeName = command.split(' ')[1];
          changeColorScheme(themeName);
        } else {
          printTextToTerminal(terminalData.unknownCommand.join('\n'));
          triggerGlitchEffect(300);
        }
    }
  };
  
  // Методы теста Войта-Кампфа
  const startVoightKampffTest = () => {
    isVoightKampffTestActive.value = true;
    currentVoightKampffQuestion.value = 0;
    printTextToTerminal(terminalData.contactForm.join('\n'));
    setTimeout(() => {
      askVoightKampffQuestion();
    }, terminalData.contactForm.join('\n').length * 15 + 1000);
  };
  
  const askVoightKampffQuestion = () => {
    if (currentVoightKampffQuestion.value >= voightKampffQuestions.length) {
      completeVoightKampffTest();
      return;
    }
    const question = voightKampffQuestions[currentVoightKampffQuestion.value];
    // Формируем список всех вариантов (правильные + неправильные), перемешиваем
    const allAnswers = [...question.correctAnswers, ...question.incorrectAnswers];
    // Перемешиваем варианты
    const shuffledAnswers = allAnswers
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    // Сохраняем варианты для текущего вопроса
    question._shuffledAnswers = shuffledAnswers;
    // Формируем текст вопроса с вариантами
    let questionText = `THE QUESTION ${currentVoightKampffQuestion.value + 1}/${voightKampffQuestions.length}:
${question.question}\n`;
    shuffledAnswers.forEach((ans, idx) => {
      questionText += `${idx + 1}. ${ans}\n`;
    });
    questionText += '\TYPE THE RIGHT ANSWER NUMBER:';
    printTextToTerminal(questionText);
  };
  
  const processVoightKampffAnswer = (answer: string) => {
    const currentQuestion = voightKampffQuestions[currentVoightKampffQuestion.value];
    // Если есть _shuffledAnswers, ожидаем номер
    let answerText = answer.trim();
    let isHumanLikeResponse = false;
    if (currentQuestion._shuffledAnswers) {
      const idx = parseInt(answerText, 10) - 1;
      if (!isNaN(idx) && idx >= 0 && idx < currentQuestion._shuffledAnswers.length) {
        answerText = currentQuestion._shuffledAnswers[idx];
      }
    }
    terminalHistory.value.push(`> ${answer}`);
    if (currentQuestion.correctAnswers.includes(answerText)) {
      isHumanLikeResponse = true;
    } else if (currentQuestion.incorrectAnswers.includes(answerText)) {
      isHumanLikeResponse = false;
    } else {
      isHumanLikeResponse = currentQuestion.correctAnswers.some(
        correctAnswer => answerText.includes(correctAnswer)
      );
    }
    let analysisText = '';
    if (isHumanLikeResponse) {
      analysisText = [
        '>>> RESPONSE ANALYSIS...',
        '>>> Pupil Dilation: NORMAL',
        '>>> Respiratory Rate: WITHIN HUMAN PARAMETERS',
        '>>> Response Latency: ACCEPTABLE',
        ''
      ].join('\n');
    } else {
      analysisText = [
        '>>> RESPONSE ANALYSIS...',
        '>>> Pupil Dilation: ABNORMAL',
        '>>> Respiratory Rate: INCREASED',
        '>>> Response Delay: SUSPICIOUS',
        ''
      ].join('\n');
    }
    printTextToTerminal(analysisText);
    setTimeout(() => {
      if (isHumanLikeResponse) {
        currentVoightKampffQuestion.value++;
        if (currentVoightKampffQuestion.value < voightKampffQuestions.length) {
          askVoightKampffQuestion();
        } else {
          voightKampffPassed.value = true;
          completeVoightKampffTest();
        }
      } else {
        printTextToTerminal(terminalData.errorMessages[1]);
        setTimeout(() => {
          failVoightKampffTest();
        }, terminalData.errorMessages[1].length * 15 + 1000);
      }
    }, analysisText.length * 15 + 1000);
  };
  
  const completeVoightKampffTest = () => {
    if (voightKampffPassed.value) {
      printTextToTerminal(terminalData.contactSuccess.join('\n'));
      setTimeout(() => {
        isVoightKampffTestActive.value = false;
      }, terminalData.contactSuccess.join('\n').length * 15 + 1000);
    } else {
      failVoightKampffTest();
    }
  };
  
  const failVoightKampffTest = () => {
    voightKampffAttempts.value++;
    printTextToTerminal(terminalData.errorMessages[1]);
    setTimeout(() => {
      isVoightKampffTestActive.value = false;
      if (voightKampffAttempts.value >= 3) {
        shutdownTerminal();
      } else {
        rebootTerminal();
      }
    }, 3000);
  };
  
  const startCursorBlink = () => {
    if (cursorBlinkInterval) {
      clearInterval(cursorBlinkInterval);
    }
    
    cursorBlinkInterval = setInterval(() => {
      cursorVisible.value = !cursorVisible.value;
    }, 530);
  };
  
  const clearAllIntervals = () => {
    if (typingInterval) clearInterval(typingInterval);
    if (cursorBlinkInterval) clearInterval(cursorBlinkInterval);
    if (bootSequenceTimeout) clearTimeout(bootSequenceTimeout);
  };
  
  const toggleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value;
  };
  
  const changeColorScheme = (theme: string) => {
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
    
    triggerGlitchEffect(1000);
    currentColorScheme.value = themeName.toLowerCase();
    
    printTextToTerminal([
      `>>> TERMINAL COLOR SCHEME CHANGED TO: ${themeName}`,
      '>>> SYSTEM IS RECALIBRATING DISPLAY PARAMETERS...',
      '>>> DISPLAY RECALIBRATION COMPLETE',
      ''
    ].join('\n'));
  };
  
  const triggerGlitchEffect = (duration = 500) => {
    isGlitchActive.value = true;
    
    setTimeout(() => {
      isGlitchActive.value = false;
    }, duration);
  };
  
  const updateCurrentCommand = (value: string) => {
    // Дополнительная фильтрация и преобразование в верхний регистр
    let filteredValue = value.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/g, '');
    filteredValue = filteredValue.toUpperCase();
    currentCommand.value = filteredValue;
  };
  
  return {
    // Состояние терминала
    isTerminalOn,
    isTerminalBooted,
    terminalText,
    bootingProgress,
    terminalHistory,
    cursorVisible,
    currentCommand,
    isFullScreen,
    currentColorScheme,
    isGlitchActive,
    
    // Состояние теста Войта-Кампфа
    isVoightKampffTestActive,
    currentVoightKampffQuestion,
    voightKampffPassed,
    voightKampffAttempts,
    
    // Методы терминала
    bootTerminal,
    rebootTerminal,
    shutdownTerminal,
    handleCommand,
    printTextToTerminal,
    startCursorBlink,
    clearAllIntervals,
    toggleFullScreen,
    changeColorScheme,
    triggerGlitchEffect,
    updateCurrentCommand,
    
    // Методы теста Войта-Кампфа
    startVoightKampffTest,
    askVoightKampffQuestion,
    processVoightKampffAnswer,
    completeVoightKampffTest,
    failVoightKampffTest
  };
}); 