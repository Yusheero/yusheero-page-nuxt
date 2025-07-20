<script setup>
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const blogData = dataStore.getBlog();

useHead({
  title: 'Блог | Yusheero'
})
</script>

<template>
  <div class="blog-page">
    <div class="blog-page__container">
      <div class="blog-page__content">
        <BlogItem
          v-for="(data, index) in blogData" 
          :key="data.id || index"
          :blogData="data"
          :blogIndex="index"
          class="blog-page__item" 
        />
      </div>

      <TerminalWindow />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$terminal-text: #4afa9a;

.blog-page {
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
    overflow-y: auto;

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

  &__item {
    height: 15rem;
  }
}
</style>