<template>
  <div class="terminal-screen">
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
          :value="currentCommand"
          @input="$emit('update:currentCommand', ($event.target as HTMLInputElement)?.value)"
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
</template>

<script setup lang="ts">
const props = defineProps<{
  terminalHistory: string[];
  terminalText: string;
  currentCommand: string;
  cursorVisible: boolean;
  handleCommand: () => void;
  terminalRef: any;
}>();
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

$terminal-green: #4afa9a;
$terminal-dark-green: #052505;
$terminal-font: 'VT323', monospace;

.terminal-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: $terminal-dark-green;
  overflow: hidden;
  padding: 20px 20px 20px 30px;

  .terminal-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    z-index: 2;
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

  .terminal-history {
    margin-bottom: 10px;
  }
  .terminal-line {
    line-height: 1.3;
    white-space: pre-wrap;
    font-size: 20px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
  }
  .terminal-current-line {
    line-height: 1.3;
    white-space: pre-wrap;
    font-size: 20px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
    margin-bottom: 10px;
  }
  .terminal-input {
    display: flex;
    align-items: center;
    font-size: 20px;
    text-shadow: 0 0 5px rgba($terminal-green, 0.5);
    .terminal-prompt {
      margin-right: 5px;
    }
    .terminal-command-input {
      background: transparent;
      border: none;
      color: $terminal-green;
      font-family: $terminal-font;
      font-size: 20px;
      outline: none;
      flex: 1;
      text-shadow: 0 0 5px rgba($terminal-green, 0.5);
      position: relative;
      &.cursor-visible::after {
        content: '█';
        animation: blink 1s step-end infinite;
      }
    }
  }
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
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes glitch-text {
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(2px); }
  100% { transform: translateX(0); }
}
</style> 