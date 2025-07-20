<script setup>
/** Метаданные страницы */
useHead({
  title: 'Главная страница | Yusheero',
  description: 'Frontend разработчик Yusheero'
})
</script>

<template>
  <div class="home-page">
    <HomeLogo class="home-page__logo" />
    <HomeGif class="home-page__gif" />
    <HomeName class="home-page__name" />
    <HomeContacts class="home-page__contacts" />
    <HomeLastPost class="home-page__lastpost" />
    <HomeReviews class="home-page__reviews" />
    <HomeTechnologies class="home-page__tech" />
    <HomeTwitch class="home-page__twitch" />
    <HomeTerminal class="home-page__terminal" />
  </div>
</template>

<style lang="scss">
.home-page {
  width: 100%;
  height: 100%;
  position: relative;
  color: var(--color-primary);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 6rem 3fr;
  grid-template-rows: 1fr 2fr 7rem 1.5fr;
  gap: 8px;
  grid-template-areas:
    "logo      twitch    name      name      terminal   terminal"
    "last-post last-post last-post last-post terminal   terminal"
    "tech      tech      tech      tech      tech       tech"
    "gif       gif       reviews   reviews   reviews    contacts";

  &__navigation {
    position: absolute;
    top: 0;
    left: -148px;
    z-index: 100;
  }

  &__logo {
    grid-area: logo;
  }

  &__name {
    grid-area: name;
  }

  &__tech {
    grid-area: tech;
  }

  &__contacts {
    grid-area: contacts;
  }

  &__gif {
    grid-area: gif;
  }

  &__reviews {
    grid-area: reviews;
  }

  &__lastpost {
    grid-area: last-post;
  }

  &__twitch {
    grid-area: twitch;
  }

  &__terminal {
    grid-area: terminal;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding: 1rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 140px 180px 250px 250px 120px 300px 160px;
    grid-template-areas:
      "logo twitch"
      "name name"
      "last-post last-post"
      "reviews reviews"
      "tech tech"
      "gif gif"
      "contacts contacts";

      &__terminal {
        display: none;
      }
  }
}
</style> 