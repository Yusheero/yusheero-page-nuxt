<script setup>
// Данные о планах на английском
const plansData = [
  {
    id: 1,
    title: 'Experience page update',
    description: 'More tips and tricks for experience view',
    date: '2025-03-28'
  },
  {
    id: 2,
    title: 'Library page update',
    description: 'More tips and tricks for library view',
    date: '2025-04-23'
  },
];

// Форматирование даты на английском
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

useHead({
  title: 'Планы | Yusheero'
})
</script>

<template>
  <div class="plans-page">
    <div class="plans-page__container">
      <!-- Контейнер с планами -->
      <div class="plans-page__content">
        <div v-for="plan in plansData" :key="plan.id" class="plan-item">
          <div class="plan-item__header">
            <h3 class="plan-item__title">{{ plan.title }}</h3>
          </div>
          <div class="plan-item__body">
            <p class="plan-item__description">{{ plan.description }}</p>
          </div>
          <div class="plan-item__footer">
            <span class="plan-item__date">{{ formatDate(plan.date) }}</span>
          </div>
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

.plans-page {
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

// Стили для карточки плана
.plan-item {
  position: relative;
  background-color: $terminal-card-bg;
  border: 1px solid rgba(79, 250, 154, 0.3);
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  
  &:hover::before {
    opacity: 1;
  }
  
  &__header {
    margin-bottom: 12px;
  }
  
  &__title {
    font-size: 16px;
    font-weight: bold;
    color: $terminal-green;
    margin: 0;
    text-shadow: 0 0 5px rgba(79, 250, 154, 0.5);
    letter-spacing: 0.5px;
  }
  
  &__body {
    flex: 1;
    margin-bottom: 12px;
  }
  
  &__description {
    font-size: 14px;
    line-height: 1.5;
    color: #cccccc;
    margin: 0;
  }
  
  &__footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px dashed rgba(79, 250, 154, 0.2);
    padding-top: 8px;
  }
  
  &__date {
    font-size: 12px;
    color: #888;
    font-style: italic;
  }
}
</style>