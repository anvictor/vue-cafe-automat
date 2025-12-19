import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'client',
            component: () => import('@/views/ClientView.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/AdminView.vue')
        }
    ]
})

export default router
