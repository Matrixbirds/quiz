import Vue from 'vue'
import App from '../App'
import Router from 'vue-router'
import ChallengePanel from 'components/ChallengePanel'
import CommitPanel from 'components/CommitPanel'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  exact: true,
  mode: 'history',
  routes: [
    {
      path: '/',
      component: {
        default: App
      }
    },
    {
      path: '/board',
      component: App,
      subRoutes: {
        '/': {
          component: {
            default: ChallengePanel,
            panel: ChallengePanel
          }
        },
        '/commit_history': {
          component: {
            panel: CommitPanel
          }
        }
      }
    }
  ]
})

export default router
