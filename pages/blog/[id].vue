<script setup>
import { useDataStore } from '@/stores/data';
import { useRoute, useRouter } from 'vue-router';
import TerminalWindow from '@/components/terminal/window.vue';
import { ArrowLeft } from 'lucide-vue-next';

const dataStore = useDataStore();
const route = useRoute();
const router = useRouter();

const id = Number(route.params.id);
const blogData = dataStore.getBlog();
const post = blogData[id];

if (!post) {
  await router.push('/blog');
}

const goBack = () => {
  router.push('/blog');
};

useHead({
  title: `${post?.title || 'Новость'} | Блог | Yusheero`
});
</script>

<template>
  <div class="blog-post-page">
    <div class="blog-post-page__container">
      <div class="blog-post-page__header">
        <button class="back-button" @click="goBack">
          <ArrowLeft color="#4afa9a" size="24px" />
        </button>
        <h1 class="blog-post-page__title">{{ post.title }}</h1>
      </div>
      <div class="blog-post-page__content">
        <div class="blog-post-page__date" v-if="post.date">
          <span>{{ post.date }}</span>
        </div>
        <div class="blog-post-page__text">
          {{ post.text }}
        </div>
      </div>
      <TerminalWindow />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$terminal-text: #4afa9a;

.blog-post-page {
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__header {
    height: 5rem;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
    border-bottom: 1px solid rgba(79, 250, 154, 0.3);
  }

  &__title {
    font-size: 2rem;
    font-weight: 700;
    color: $terminal-text;
    margin: 0;
  }

  .back-button {
    width: 5rem;
    height: 100%;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
    border-right: 1px solid rgba(79, 250, 154, 0.3);
    opacity: 0.8;

    &:hover {
      background: rgba(79, 250, 154, 0.4);
      opacity: 1;
    }
  }

  &__content {
    padding: 25px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__date {
    font-size: 1rem;
    color: $terminal-text;
    opacity: 0.7;
  }

  &__text {
    font-size: 1.2rem;
    color: #e0e0e0;
    line-height: 1.6;
    white-space: pre-line;
  }
}
</style> 