<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Данные о точках
const points = [
  {
    id: 'dns',
    label: 'DNS Technologies',
    position: 75, // px относительно центра (левее на 200)
    info: {
      title: 'DNS Technologies',
      role: 'Frontend Developer',
      years: '2022 - 2025',
      tags: ['Vue.js', 'Node.js', 'TypeScript'],
      description: 'Development and maintenance of enterprise web applications. Performance optimization, implementation of new technologies.'
    }
  },
  {
    id: 'housevl',
    label: 'House VL',
    position: 300,
    info: {
      title: 'House VL',
      role: 'Frontend Developer',
      years: '2025 - present',
      tags: ['Node.js', 'TypeScript', 'NextJS', 'React'],
      description: 'Development NextJS applications'
    }
  }
];

const glitchEffect = ref(false);
const activePointId = ref(null);

// При монтировании компонента
let intervalId;
onMounted(() => {
  intervalId = setInterval(() => {
    glitchEffect.value = true;
    setTimeout(() => {
      glitchEffect.value = false;
    }, 150);
  }, 5000);
});
onUnmounted(() => {
  clearInterval(intervalId);
});

// Переключение видимости информации о точке
const togglePointInfo = (id) => {
  activePointId.value = activePointId.value === id ? null : id;
};

// Закрытие информации о точке
const closePointInfo = () => {
  activePointId.value = null;
};

useHead({
  title: 'Опыт | Yusheero'
})
</script>

<template>
  <div class="experience-page">
    <div class="experience-page__container">
      <ExperiencePoint
        v-for="point in points"
        :key="point.id"
        :point="point"
        :is-active="activePointId === point.id"
        @toggle="togglePointInfo"
        @close="closePointInfo"
      />
      <TerminalGrid />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:root {
  --terminal-text: #4afa9a;
}

$terminal-text: var(--terminal-text);

.experience-page {
  position: relative;
  height: 100%;
  width: 100%;
  color: $terminal-text;
  display: flex;
  align-items: center;
  justify-content: center;

  &__container {
    z-index: 1;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    padding: 0;
    grid-area: content;
    overflow: hidden;
    position: relative;
  }

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 20px;
    padding: 25px;
    overflow: auto;
    z-index: 1;
    
    /* Стилизация скроллбара */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(79, 250, 154, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(79, 250, 154, 0.5);
      border-radius: 4px;
      
      &:hover {
        background: rgba(79, 250, 154, 0.7);
      }
    }
  }
}
</style>