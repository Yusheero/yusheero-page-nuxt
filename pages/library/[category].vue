<script setup>
import { ArrowLeft } from 'lucide-vue-next';
import { useDataStore } from '@/stores/data';

const dataStore = useDataStore();

// Получаем параметр категории из URL
const route = useRoute();
const router = useRouter();
const category = route.params.category;

// Находим данные для текущей категории
const categoryData = dataStore.getLibraryCategory(category);

// Если категория не найдена, перенаправляем на главную страницу библиотеки
if (!categoryData) {
  await navigateTo('/library');
}

// Функция для возврата к списку категорий
const goBackToLibrary = () => {
  router.push('/library');
};

useHead({
  title: `${categoryData?.name || 'Категория'} | Библиотека | Yusheero`
})
</script>

<template>
  <div class="category-page">
    <div class="category-page__container">

      <div class="category-page__header">

        <button class="back-button" @click="goBackToLibrary">
          <ArrowLeft color="#4afa9a" size="24px" />
        </button>  
      </div>
      
      <!-- Вертикальный контейнер с элементами категории -->
      <div class="category-page__content">
        <div 
          v-for="(item, index) in categoryData.items" 
          :key="index" 
          class="category-item"
        >
          <div class="category-item__title">{{ item.title }}</div>
          <div v-if="item.score" class="category-item__score">{{ item.score }}</div>
          <div v-if="item.genre" class="category-item__genre">{{ item.genre }}</div>
          <a 
            v-if="item.link" 
            :href="item.link" 
            target="_blank" 
            class="category-item__link"
          >
            open link
          </a>
        </div>
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
$terminal-green: #4afa9a;
$terminal-dark-green: #052505;
$terminal-frame: rgba(79, 250, 154, 0.1);
$terminal-text: #4afa9a;
$terminal-background: rgba(10, 26, 18, 0.95);
$terminal-highlight: rgba(79, 250, 154, 0.15);
$terminal-button: rgba(79, 250, 154, 0.2);
$terminal-button-hover: rgba(79, 250, 154, 0.4);

.category-page {
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
    grid-area: content;
    overflow: hidden;
    position: relative;
  }

  &__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $terminal-frame;
    position: relative;
    z-index: 2;
  }

  &__title {
    font-size: 2em;
    color: $terminal-green;
    margin: 0;
  }

  &__back {
    background: rgba(79, 250, 154, 0.1);
    border: 1px solid $terminal-frame;
    color: $terminal-text;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(79, 250, 154, 0.2);
    }
  }

  &__content {
    padding: 25px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    overflow-y: auto;
    max-height: calc(100vh - 150px);
    
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

.category-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 230px;
  padding: 20px;
  background-color: rgba(79, 250, 154, 0.05);
  border: 1px solid $terminal-frame;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(79, 250, 154, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(79, 250, 154, 0.1);
    box-shadow: 0 0 12px rgba(79, 250, 154, 0.2);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &__title {
    font-size: 24px;
    font-weight: 700;
    color: $terminal-green;
    text-align: center;
    text-shadow: 0 0 5px rgba(79, 250, 154, 0.3);
  }
  
  &__score {
    font-size: 20px;
  }

  &__genre {
    font-size: 14px;
    opacity: 0.8;
    color: $terminal-green;
  }
  
  &__link {
    display: inline-block;
    padding: 10px 20px;
    background-color: $terminal-button;
    border: 1px solid $terminal-frame;
    color: $terminal-green;
    font-size: 14px;
    border-radius: 4px;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: $terminal-button-hover;
    }
  }
}

.back-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: $terminal-green;
  border: unset;
  border-right: 1px solid $terminal-frame;
  padding: 20px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: $terminal-button-hover;
  }
}
</style> 