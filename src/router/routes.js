import AbstractRoute from '../views/AbstractRoute.vue'

import IndexPage from '../views/IndexPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import RestoreUserDataPage from '../views/RestoreUserDataPage.vue'

import NotFoundViewPage from '../views/NotFoundViewPage.vue'

import DevPage from '../views/DevPage.vue'

import { mainRoutes } from './mainRoutes'

export const routes = [
  {
    path: '/',
    name: 'index',
    component: IndexPage,
    meta: {
      title: 'App'
    },
  },
  {
    path: '/signin',
    name: 'signin',
    component: IndexPage,
    meta: {
      title: 'Вход | App'
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: {
      title: 'Регистрация | App'
    },
  },
  {
    path: '/restore',
    name: 'restore',
    component: RestoreUserDataPage,
    meta: {
      title: 'Восстановление пароля | App'
    },
  },
  {
    path: '/dev',
    name: 'dev',
    component: DevPage,
    meta: {
      title: 'Тестирование элементов'
    },
  },
  mainRoutes,
  {
    path: '*',
    name: 'notFound',
    component: NotFoundViewPage,
    meta: {
      title: 'Страница не найдена | LO'
    }
  },
]