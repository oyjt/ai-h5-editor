import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'editor',
      component: () => import('@/views/EditorView.vue'),
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('@/views/TemplateView.vue'),
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/PreviewView.vue'),
    },
  ],
})

export default router
