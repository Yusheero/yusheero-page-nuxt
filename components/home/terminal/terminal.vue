<script setup>
import { onUnmounted, ref } from 'vue';
import { useTerminalStore } from '@/stores/terminal';
import './terminal-styles.scss';
import TerminalOffScreen from './parts/terminal-off.vue';
import TerminalBootingScreen from './parts/terminal-boot.vue';
import TerminalScreen from './parts/terminal-default.vue';
import ExpandButton from './parts/expand-button.vue';

/**
 * Основной компонент ретро-терминала с эффектами старого монитора
*/

// Используем store для управления состоянием терминала
const terminalStore = useTerminalStore();

/**
 * Жизненный цикл компонента
 */
onUnmounted(() => {
  terminalStore.clearAllIntervals();
});
</script>

<template>
  <div class="retro-terminal-container" 
       :class="{
         'fullscreen': terminalStore.isFullScreen, 
         'theme-green': terminalStore.currentColorScheme === 'green',
         'theme-amber': terminalStore.currentColorScheme === 'amber',
         'theme-blue': terminalStore.currentColorScheme === 'blue',
         'glitch-effect': terminalStore.isGlitchActive
       }">
    <!-- Кнопка "Развернуть/Свернуть" -->
    <ExpandButton 
      v-if="terminalStore.isTerminalOn && terminalStore.isTerminalBooted" 
      :isFullScreen="terminalStore.isFullScreen" 
      :onToggle="terminalStore.toggleFullScreen" 
    />
    
    <!-- Экран выключеннного терминала -->
    <TerminalOffScreen 
      v-if="!terminalStore.isTerminalOn" 
      :onPowerOn="terminalStore.bootTerminal" 
    />
    
    <!-- Экран загрузки терминала -->
    <TerminalBootingScreen 
      v-else-if="!terminalStore.isTerminalBooted" 
      :bootingProgress="terminalStore.bootingProgress" 
    />
    
    <!-- Экран рабочего терминала -->
    <TerminalScreen
      v-else
      :terminalHistory="terminalStore.terminalHistory"
      :terminalText="terminalStore.terminalText"
      :currentCommand="terminalStore.currentCommand"
      :cursorVisible="terminalStore.cursorVisible"
      :handleCommand="terminalStore.handleCommand"
      @update:currentCommand="terminalStore.updateCurrentCommand"
    />
  </div>
</template>

<style lang="scss" scoped></style>
