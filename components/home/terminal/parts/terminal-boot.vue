<template>
  <div class="terminal-booting">
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
</template>

<script setup lang="ts">
defineProps<{ bootingProgress: number }>();
</script>

<style scoped>
/* Стили берутся из terminal-styles.scss */
</style> 