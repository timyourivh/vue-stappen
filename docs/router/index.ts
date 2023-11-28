import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/examples',
      name: 'examples',
      component: () => import('../views/examples/index.vue'),
      children: [
        {
          path: 'basic',
          name: 'basic',
          meta: {
            group: 'examples',
          },
          component: () => import('../views/examples/basic.vue')
        },
        {
          path: 'extra-steps',
          name: 'extra steps',
          meta: {
            group: 'examples',
          },
          component: () => import('../views/examples/extra-steps.vue')
        },
        {
          path: 'guards',
          name: 'guards',
          meta: {
            group: 'examples',
          },
          component: () => import('../views/examples/guards.vue')
        }
      ]
    }
    // {
    //   path: '/examples',
    //   name: 'examples',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/ExamplesView.vue')
    // }
  ]
})

export default router
