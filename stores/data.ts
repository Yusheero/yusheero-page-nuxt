import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Импортируем все данные
import reviewsData from '@/data/reviews.json'
import blogData from '@/data/blog.json'
import libraryData from '@/data/library.json'
import projectsData from '@/data/projects.json'

export const useDataStore = defineStore('data', () => {
  // Состояние для каждого типа данных
  const reviews = ref(reviewsData.data)
  const blog = ref(blogData.data)
  const library = ref(libraryData)
  const projects = ref(projectsData.data)

  // Геттеры для удобного доступа к данным
  const getReviews = () => reviews.value
  const getBlog = () => blog.value
  const getLibrary = () => library.value
  const getProjects = () => projects.value

  // Геттеры для получения последних постов
  const getLastBlogPost = () => {
    if (blog.value.length === 0) return null
    return blog.value[blog.value.length - 1]
  }

  const getLastReview = () => {
    if (reviews.value.length === 0) return null
    return reviews.value[reviews.value.length - 1]
  }

  // Геттер для получения данных библиотеки по категории
  const getLibraryCategory = (categoryId: string) => {
    return library.value.find(category => category.id === categoryId)
  }

  // Геттер для получения проектов по категории
  const getProjectsByCategory = (category: string) => {
    return projects.value.filter(project => project.category === category)
  }

  // Computed свойства для дополнительной функциональности
  const blogPostsCount = computed(() => blog.value.length)
  const reviewsCount = computed(() => reviews.value.length)
  const projectsCount = computed(() => projects.value.length)
  const libraryCategoriesCount = computed(() => library.value.length)

  return {
    // Состояние
    reviews,
    blog,
    library,
    projects,
    
    // Геттеры
    getReviews,
    getBlog,
    getLibrary,
    getProjects,
    getLastBlogPost,
    getLastReview,
    getLibraryCategory,
    getProjectsByCategory,
    
    // Computed свойства
    blogPostsCount,
    reviewsCount,
    projectsCount,
    libraryCategoriesCount,
  }
}) 