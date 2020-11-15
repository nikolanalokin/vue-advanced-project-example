import AbstractRoute from '../views/AbstractRoute.vue'

import MainContainer from '../views/MainContainer.vue'
import UserProfilePage from '../views/pages/user/UserProfilePage.vue'

import TermsPage from '../views/pages/terms/TermsPage.vue'
import LicenseModule from '../views/pages/terms/LicenseModule.vue'
import TermsOfUseModule from '../views/pages/terms/TermsOfUseModule.vue'
import TermsProcessingModule from '../views/pages/terms/TermsProcessingModule.vue'

export const mainRoutes = {
  path: '/:path',
  name: 'main',
  component: MainContainer,
  children: [
    {
      path: '/id:uid(\\d+)',
      component: AbstractRoute,
      children: [
        {
          path: '',
          props: true,
          name: 'userProfile',
          component: UserProfilePage,
          meta: {
            title: 'Профиль',
            appbar: {
              back: true
            }
          },
        }
      ]
    },
    {
      path: '/legal',
      component: TermsPage,
      name: 'legal',
      children: [
        {
          path: 'licence',
          name: 'licence',
          component: LicenseModule,
          meta: {
            title: 'Лицензионное соглашение'
          },
        },
        {
          path: 'terms',
          name: 'terms',
          component: TermsOfUseModule,
          meta: {
            title: 'Правила пользования'
          },
        },
        {
          path: 'ccterms',
          name: 'ccterms',
          component: TermsProcessingModule,
          meta: {
            title: 'Правила рассмотрения заявлений'
          },
        },
      ]
    },
  ]
}