<template>
  <button class="expand-button" @click.stop="onToggle">
    <div class="expand-icon">{{ isFullScreen ? '▼' : '▲' }}</div>
  </button>
</template>

<script setup lang="ts">
defineProps<{ isFullScreen: boolean; onToggle: () => void }>();
</script>

<style scoped>
/* Стили берутся из terminal-styles.scss */
</style> 