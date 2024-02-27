import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import PlaygroundView from '../views/PlaygroundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: WelcomeView
    },
    {
      path: '/playground',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/PlaygroundView.vue')
      component: PlaygroundView,
      children: [
        {
          path: '',
          component: () => import('../views/playground/IndexView.vue')
        },
        {
          path: 'unstyled',
          component: () => import('../views/playground/UnstyledView.vue')
        },
        {
          path: 'basic',
          component: () => import('../views/playground/BasicView.vue')
        },
        {
          path: 'stepper-guard',
          component: () => import('../views/playground/StepperGuardView.vue')
        },
        {
          path: 'step-guard',
          component: () => import('../views/playground/StepGuardView.vue')
        },
        {
          path: 'dynamic-steps',
          component: () => import('../views/playground/DynamicStepsView.vue')
        },
        {
          path: 'form-submit',
          component: () => import('../views/playground/FormSubmitView.vue')
        }
      ]
    }
  ]
})

export default router
