<script setup>
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();
const libraryData = dataStore.getLibrary();

useHead({
  title: 'Библиотека | Yusheero'
})
</script>

<template>
  <div class="library-page">
    <div class="library-page__container">
      <div class="library-page__content">
        <LibraryItem
          v-for="data in libraryData"
          :data="data.items" 
          :index="data.name" 
          :route="`/library/${data.id}`"
          class="library-page__item" 
        />
      </div>

      <TerminalWindow />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$terminal-text: #4afa9a;
$terminal-card-bg: rgba(10, 26, 18, 0.7);
$terminal-green: #4afa9a;
$terminal-frame: rgba(79, 250, 154, 0.1);

.library-page {
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

  &__item {
    width: 100%;
    height: 100%;
    background-color: rgba(79, 250, 154, 0.05);
    border: 1px solid $terminal-frame;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(79, 250, 154, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(79, 250, 154, 0.1);
      box-shadow: 0 0 12px rgba(79, 250, 154, 0.2);
      transform: translateY(-2px);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>