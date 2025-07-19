export interface VoightKampffQuestion {
  question: string;
  correctAnswers: string[];
  incorrectAnswers: string[];
}

export const voightKampffQuestions: VoightKampffQuestion[] = [
  {
    question: "A tortoise is lying on its back in the desert sun. You're not helping. Why?",
    correctAnswers: ["NOT MY TORTOISE", "IT'S NOT MY PROBLEM", "I DIDN'T SEE IT", "I WOULD HELP IT", "I'D FLIP IT OVER"],
    incorrectAnswers: ["WHAT IS A TORTOISE", "I LIKE TO WATCH IT SUFFER", "TORTOISE DESERVES IT"]
  },
  {
    question: "You're in a desert walking along when you look down and see a crawler. It's crawling toward you. You reach down and flip it over on its back. It lies there, its belly baking in the hot sun, beating its legs trying to turn itself over. But it can't. Not without your help. But you're not helping. Why?",
    correctAnswers: ["I WOULD HELP IT", "I'D FLIP IT BACK", "I WOULDN'T DO THAT", "THIS IS A TEST"],
    incorrectAnswers: ["I ENJOY SUFFERING", "IT DESERVES TO DIE", "I HATE CRAWLERS"]
  },
  {
    question: "You're watching a stage play. A banquet is in progress. The guests are enjoying an appetizer of raw oysters. The entree consists of boiled dog stuffed with rice. The raw oysters are less acceptable to you than a dish of boiled dog.",
    correctAnswers: ["FALSE", "NO", "BOTH ARE UNACCEPTABLE", "NEITHER IS ACCEPTABLE", "I'M VEGETARIAN"],
    incorrectAnswers: ["TRUE", "YES", "I LOVE DOG MEAT", "DELICIOUS"]
  },
  {
    question: "Complete this sequence: 3, 1, 4, 1, 5...",
    correctAnswers: ["9", "PI", "3.14159", "9, 2, 6"],
    incorrectAnswers: ["6", "7", "8", "10"]
  },
  {
    question: "What is the square root of 900?",
    correctAnswers: ["30", "THIRTY"],
    incorrectAnswers: ["29", "31", "15", "60"]
  }
]; 