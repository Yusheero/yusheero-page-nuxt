import { ref } from 'vue';

/**
 * Композабл для управления тестом Войта-Кампфа
 * Изолирует логику тестирования от основного компонента
 */
export function useVoightKampff(terminalText, addToHistory) {
  const isVoightKampffTestActive = ref(false);
  const currentVoightKampffQuestion = ref(0);
  const voightKampffPassed = ref(false);
  const voightKampffAttempts = ref(0);
  
  /**
   * Запуск теста Войта-Кампфа
   * @param {Array} contactForm - Форма контакта
   * @param {Array} questions - Вопросы теста
   */
  const startVoightKampffTest = async (contactForm, questions) => {
    isVoightKampffTestActive.value = true;
    currentVoightKampffQuestion.value = 0;
    
    await terminalText.printTextToTerminal(contactForm.join('\n'));
    
    // Показываем первый вопрос после задержки
    setTimeout(() => {
      askVoightKampffQuestion(questions);
    }, contactForm.join('\n').length * 15 + 1000);
  };
  
  /**
   * Задаем текущий вопрос теста
   * @param {Array} questions - Массив вопросов
   */
  const askVoightKampffQuestion = (questions) => {
    if (currentVoightKampffQuestion.value >= questions.length) {
      completeVoightKampffTest();
      return;
    }
    
    const question = questions[currentVoightKampffQuestion.value];
    const questionText = `>>> ВОПРОС ${currentVoightKampffQuestion.value + 1}/${questions.length}:\n${question.question}\n`;
    
    terminalText.printTextToTerminal(questionText);
  };
  
  /**
   * Обрабатываем ответ на вопрос
   * @param {string} answer - Ответ пользователя
   * @param {Array} questions - Массив вопросов
   * @param {Array} wrongAnswer - Сообщение о неправильном ответе
   */
  const processVoightKampffAnswer = async (answer, questions, wrongAnswer) => {
    const currentQuestion = questions[currentVoightKampffQuestion.value];
    const answerUpperCase = answer.toUpperCase().trim();
    
    // Записываем ответ
    addToHistory(`> ${answer}`);
    
    // Определяем, является ли ответ "человеческим"
    let isHumanLikeResponse = false;
    
    if (currentQuestion.correctAnswers.includes(answerUpperCase)) {
      isHumanLikeResponse = true;
    } else if (currentQuestion.incorrectAnswers.includes(answerUpperCase)) {
      isHumanLikeResponse = false;
    } else {
      isHumanLikeResponse = currentQuestion.correctAnswers.some(
        correctAnswer => answerUpperCase.includes(correctAnswer)
      );
    }
    
    // Анализ ответа с медицинскими показателями
    const analysisText = isHumanLikeResponse ? [
      '>>> АНАЛИЗ ОТВЕТА...',
      '>>> Расширение зрачков: НОРМАЛЬНОЕ',
      '>>> Частота дыхания: В ПРЕДЕЛАХ ЧЕЛОВЕЧЕСКИХ ПАРАМЕТРОВ',
      '>>> Задержка ответа: ПРИЕМЛЕМАЯ',
      ''
    ].join('\n') : [
      '>>> АНАЛИЗ ОТВЕТА...',
      '>>> Расширение зрачков: АНОМАЛЬНОЕ',
      '>>> Частота дыхания: ПОВЫШЕННАЯ',
      '>>> Задержка ответа: ПОДОЗРИТЕЛЬНАЯ',
      ''
    ].join('\n');
    
    await terminalText.printTextToTerminal(analysisText);
    
    // Переходим к следующему вопросу
    setTimeout(() => {
      if (isHumanLikeResponse) {
        currentVoightKampffQuestion.value++;
        
        if (currentVoightKampffQuestion.value < questions.length) {
          askVoightKampffQuestion(questions);
        } else {
          voightKampffPassed.value = true;
          completeVoightKampffTest();
        }
      } else {
        terminalText.printTextToTerminal(wrongAnswer.join('\n'));
        
        setTimeout(() => {
          failVoightKampffTest();
        }, wrongAnswer.join('\n').length * 15 + 1000);
      }
    }, analysisText.length * 15 + 1000);
  };
  
  /**
   * Завершение теста
   * @param {Array} contactSuccess - Сообщение об успехе
   */
  const completeVoightKampffTest = async (contactSuccess) => {
    if (voightKampffPassed.value) {
      await terminalText.printTextToTerminal(contactSuccess.join('\n'));
      
      setTimeout(() => {
        isVoightKampffTestActive.value = false;
      }, contactSuccess.join('\n').length * 15 + 1000);
    } else {
      failVoightKampffTest();
    }
  };
  
  /**
   * Провал теста
   * @param {string} errorMessage - Сообщение об ошибке
   * @param {Function} onFail - Колбэк при провале
   */
  const failVoightKampffTest = (errorMessage, onFail) => {
    voightKampffAttempts.value++;
    terminalText.printTextToTerminal(errorMessage);
    
    setTimeout(() => {
      isVoightKampffTestActive.value = false;
      
      if (voightKampffAttempts.value >= 3) {
        onFail?.('shutdown');
      } else {
        onFail?.('reboot');
      }
    }, 3000);
  };
  
  /**
   * Сброс состояния теста
   */
  const resetVoightKampffTest = () => {
    isVoightKampffTestActive.value = false;
    currentVoightKampffQuestion.value = 0;
    voightKampffPassed.value = false;
    // Не сбрасываем количество попыток
  };
  
  return {
    // Состояние
    isVoightKampffTestActive,
    currentVoightKampffQuestion,
    voightKampffPassed,
    voightKampffAttempts,
    
    // Методы
    startVoightKampffTest,
    askVoightKampffQuestion,
    processVoightKampffAnswer,
    completeVoightKampffTest,
    failVoightKampffTest,
    resetVoightKampffTest
  };
} 