import { ref } from 'vue';
import { terminalData } from '@/data/terminal';
import { voightKampffQuestions } from '@/data/voightKampffQuestions';
import type { VoightKampffQuestion } from '@/data/voightKampffQuestions';
import type { TerminalMessages } from '@/data/terminal';

interface UseVoightKampffTestOptions {
  printTextToTerminal: (text: string) => void;
  terminalHistory: { value: string[] };
  rebootTerminal: () => void;
  shutdownTerminal: () => void;
}

export function useVoightKampffTest({ printTextToTerminal, terminalHistory, rebootTerminal, shutdownTerminal }: UseVoightKampffTestOptions) {
  const isVoightKampffTestActive = ref(false);
  const currentVoightKampffQuestion = ref(0);
  const voightKampffPassed = ref(false);
  const voightKampffAttempts = ref(0);

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
    let questionText = `>>> ВОПРОС ${currentVoightKampffQuestion.value + 1}/${voightKampffQuestions.length}:\n${question.question}\n`;
    printTextToTerminal(questionText);
  };

  const processVoightKampffAnswer = (answer: string) => {
    const currentQuestion = voightKampffQuestions[currentVoightKampffQuestion.value];
    const answerUpperCase = answer.toUpperCase().trim();
    terminalHistory.value.push(`> ${answer}`);
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

  return {
    isVoightKampffTestActive,
    currentVoightKampffQuestion,
    voightKampffPassed,
    voightKampffAttempts,
    startVoightKampffTest,
    askVoightKampffQuestion,
    processVoightKampffAnswer,
    completeVoightKampffTest,
    failVoightKampffTest
  };
} 