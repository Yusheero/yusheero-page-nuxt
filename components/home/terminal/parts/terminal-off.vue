<template>
  <div class="terminal-off" @click="onPowerOn">
    <div class="terminal-off-text">
      CLICK TO POWER ON TERMINAL
    </div>
    <div class="system-info">
      YUSHEERO OS v1.0.666 | STANDBY MODE | POWER SAVING ENABLED
    </div>
    <div class="scanlines"></div>
    <div class="terminal-glow"></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ onPowerOn: () => void }>();
</script>

<style scoped>
/* Стили берутся из terminal-styles.scss */
</style> 