import { ref, computed } from 'vue';

/**
 * Композабл для управления состоянием терминала
 * Выносит логику состояния из основного компонента
 */
export function useTerminalState() {
  // Основные параметры состояния терминала
  const isTerminalOn = ref(false);
  const isTerminalBooted = ref(false);
  const bootingProgress = ref(0);
  const isFullScreen = ref(false);
  const currentColorScheme = ref('green');
  
  // Параметры для визуальных эффектов
  const isGlitchActive = ref(false);
  const isStaticActive = ref(false);
  
  // Вычисляемые свойства для оптимизации
  const isTerminalReady = computed(() => isTerminalOn.value && isTerminalBooted.value);
  const canAcceptInput = computed(() => isTerminalReady.value && !isGlitchActive.value);
  
  // Методы для управления состоянием
  const setTerminalOn = (value) => {
    isTerminalOn.value = value;
  };
  
  const setTerminalBooted = (value) => {
    isTerminalBooted.value = value;
  };
  
  const setBootingProgress = (value) => {
    bootingProgress.value = Math.max(0, Math.min(100, value));
  };
  
  const setColorScheme = (scheme) => {
    currentColorScheme.value = scheme;
  };
  
  const triggerGlitch = (duration = 500) => {
    isGlitchActive.value = true;
    setTimeout(() => {
      isGlitchActive.value = false;
    }, duration);
  };
  
  const toggleFullScreen = () => {
    isFullScreen.value = !isFullScreen.value;
  };
  
  return {
    // Состояние
    isTerminalOn,
    isTerminalBooted,
    bootingProgress,
    isFullScreen,
    currentColorScheme,
    isGlitchActive,
    isStaticActive,
    
    // Вычисляемые свойства
    isTerminalReady,
    canAcceptInput,
    
    // Методы
    setTerminalOn,
    setTerminalBooted,
    setBootingProgress,
    setColorScheme,
    triggerGlitch,
    toggleFullScreen
  };
} 