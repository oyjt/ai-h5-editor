import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'editor', component: () => import('@/views/EditorView.vue') },
    { path: '/workspace', name: 'workspace', component: () => import('@/views/WorkspaceView.vue') },
    { path: '/templates', name: 'templates', component: () => import('@/views/TemplateView.vue') },
    { path: '/projects', name: 'projects', component: () => import('@/views/ProjectsView.vue') },
    { path: '/assets', name: 'assets', component: () => import('@/views/AssetsView.vue') },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/preview', name: 'preview', component: () => import('@/views/PreviewView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/workspace' },
  ],
})

export default router
