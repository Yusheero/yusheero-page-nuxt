<script setup>
import { computed } from 'vue';

const props = defineProps({
  point: { type: Object, required: true },
  isActive: { type: Boolean, required: true },
});

const emit = defineEmits(['toggle', 'close']);

const getPointStyle = computed(() => ({
  left: `calc(50% - 200px + ${props.point.position}px)`
}));

function handleToggle() {
  emit('toggle', props.point.id);
}
function handleKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleToggle();
  }
}
function handleClose(e) {
  e.stopPropagation();
  emit('close');
}
</script>

<template>
  <div
    class="map-point"
    :style="getPointStyle"
    @click.stop="handleToggle"
    @keydown="handleKeydown"
    :aria-label="`Информация о ${point.label}`"
    :aria-expanded="isActive"
    role="button"
    tabindex="0"
  >
    <div class="point-pulse"></div>
    <div class="point-dot"></div>
    <div class="point-label">{{ point.label }}</div>
    <div
      class="point-info"
      v-if="isActive"
      role="dialog"
      :aria-labelledby="`point-title-${point.id}`"
      :aria-describedby="`point-description-${point.id}`"
    >
      <div class="point-info-header">
        <h3 :id="`point-title-${point.id}`">{{ point.info.title }}</h3>
        <button
          class="point-info-close"
          @click="handleClose"
          aria-label="Закрыть информацию о компании"
          type="button"
        >×</button>
      </div>
      <div class="point-info-content">
        <p>{{ point.info.role }}</p>
        <p>{{ point.info.years }}</p>
        <div class="point-info-tags">
          <span class="tag" v-for="tag in point.info.tags" :key="tag">{{ tag }}</span>
        </div>
        <p :id="`point-description-${point.id}`" class="point-info-description">
          {{ point.info.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:root {
  --terminal-text: #4afa9a;
  --point-distance: 200px;
  --line-offset: 18px;
  --line-width: 164px;
}

/* Стили для точек на карте */
.map-point {
  position: absolute;
  top: 50%;
  /* left задается через style */
  transform: translate(-50%, -50%);
  z-index: 10;
  cursor: pointer;
}

.point-dot {
  width: 12px;
  height: 12px;
  background-color: #4FFA9A;
  border-radius: 50%;
  border: 2px solid rgba(79, 250, 154, 0.8);
  box-shadow: 0 0 10px rgba(79, 250, 154, 0.8);
  position: relative;
  z-index: 2;
}

.point-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(79, 250, 154, 0.3);
  box-shadow: 0 0 10px rgba(79, 250, 154, 0.5);
  animation: pulse 2s infinite;
  z-index: 1;
}

.point-label {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  color: #4FFA9A;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 0 8px rgba(79, 250, 154, 0.8);
  z-index: 3;
  pointer-events: none;
}

/* Стили для информационного окна */
.point-info {
  position: absolute;
  top: 30px;
  left: 0;
  width: 300px;
  background-color: rgba(10, 26, 18, 0.95);
  border: 1px solid #4FFA9A;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(79, 250, 154, 0.3);
  padding: 12px;
  color: #E0E0E0;
  z-index: 20;
  
  /* Соединительная линия от точки к окну */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #4FFA9A;
  }
}

.point-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(79, 250, 154, 0.3);
  padding-bottom: 8px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    color: #4FFA9A;
    text-shadow: 0 0 5px rgba(79, 250, 154, 0.5);
  }
}

.point-info-close {
  background: none;
  border: none;
  color: #4FFA9A;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
}

.point-info-content {
  font-size: 14px;
  
  p {
    margin: 0 0 8px;
    line-height: 1.4;
  }
}

.point-info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
  
  .tag {
    background-color: rgba(79, 250, 154, 0.15);
    border: 1px solid rgba(79, 250, 154, 0.4);
    border-radius: 12px;
    padding: 3px 8px;
    font-size: 12px;
    color: #4FFA9A;
  }
}

.point-info-description {
  font-size: 13px;
  color: #CCCCCC;
  line-height: 1.5;
  margin-top: 10px;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  70% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

</style>