<script setup>
import { onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useStore } from '~/stores/store'

const Navigation = defineAsyncComponent(() => import('@/components/navigation.vue'));

const store = useStore()

const onResize = () => {
  store.isMobile = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => { 
  window.removeEventListener('resize', onResize)
})

onBeforeMount(() => {
  store.isMobile = window.innerWidth <= 768
  console.log('before mount', store.isMobile)
})
</script>

<template>
  <main class="main">
    <div class="main__container">
      <Navigation class="main__navigation" />
      <NuxtPage />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Gabarito", serif;
  font-weight: 600;
  font-size: 22px;
  background: var(--color-primary);

  &__container {
    width: 1100px;
    height: 90%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  &__navigation {
    width: 9rem;
    position: absolute;
    top: 0;
    left: -158px;
    z-index: 100;
  }
}
</style>
