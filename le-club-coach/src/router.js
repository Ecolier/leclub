import React, { Suspense, lazy } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import * as router from '@storeon/router' 
import { initialize, set, pageview } from 'react-ga'
import { Spin, Icon } from 'antd'
import store from '@/store'

let logPageView = null

const antIcon = <Icon type='loading' spin />
const Loading = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin indicator={antIcon} size={'large'}/>
    </div>
  )
}

const CoachGuard = (state) => {
  // if (!state.coach.isAuthenticated) {
  //   return '/'
  // }
  // const currentSeason = state.coachSeason.currentSeason
  // if (!currentSeason || !currentSeason.onboarded) {
  //   return '/coach/onBoarding'
  // }
}

const HomeGuard = (state) => {
  if (state.coach.isAuthenticated) {
    return '/coach/home'
  }
}

const OnboardingGuard = (state) => {
  const currentSeason = state.coachSeason.currentSeason
  if (currentSeason && currentSeason.onboarded) {
    return '/coach/home'
  }
}

export const createRouter = router.createRouter([
  ['/', () => ({ page: () => import('@/pages/Login'), guards: [HomeGuard] })],
  // ['/cgv', () => ({ page: () => import('@/pages/Home/cgv') })],
  // ['/faq', () => ({ page: () => import('@/pages/Home/faq') })],
  // ['/app-link-players', () => ({ page: () => import('@/pages/AppLink') })],
  ['/login', () => ({ page: () => import('@/pages/Login'), guards: [HomeGuard] })],
  ['/inscription', () => ({ page: () => import('@/pages/Login/signup'), guards: [HomeGuard] })],
  ['/newpassword', () => ({ page: () => import('@/pages/ActiveAccount/choseEmail.js') })],
  ['/activeAccount', () => ({ page: () => import('@/pages/ActiveAccount/index.js') })],
  // ['/pricing', () => ({ page: () => import('@/pages/Home/pricing') })],
  // ['/products/*', (id) => ({ page: () => import('@/pages/Products'), props: { id } })],
  // ['/mentionslegales', () => ({ page: () => import('@/pages/Home/mentionsLegales') })],
  // ['/joueurs', () => ({ page: () => import('@/pages/Home/players') })],
  ['/disconnect', () => ({ page: () => import('@/pages/Coach/disconnect'), guards: [CoachGuard] })],
  ['/coach/edit/*/*', (type, id) => ({
    page: () => import('@/pages/Studio/contextStudioPage'),
    props: { type, id },
    guards: [CoachGuard],
  })],
  ['/coach/home', () => ({
    page: () => import('@/components/Coach/HomeV2/index'),
    guards: [CoachGuard],
  })],
  ['/coach/onBoarding', () => ({ page: () => import('@/components/Coach/OnBoarding'), guards: [OnboardingGuard] })],
  ['/coach/tryLeClub', () => ({ page: () => import('@/components/Studio/tryLeClub/tryLeClub.js'), guards: [CoachGuard] })],
  ['/coach/matches', () => ({ page: () => import('@/components/Coach/MyMatches'), guards: [CoachGuard] })],
  ['/coach/match/*/*', (matchSeason, matchId) => ({
    page: () => import('@/components/Coach/MatchSheet'),
    props: { matchSeason, matchId },
    guards: [CoachGuard],
  })],
  // ['/coach/trainings', () => ({ page: () => import('@/components/Coach/MyTrainings'), guards: [CoachGuard] })],
  // ['/coach/training/*/*', (trainingSeason, trainingId) => ({
  //   page: () => import('@/components/Coach/TrainingSheet'),
  //   props: { trainingSeason, trainingId },
  //   guards: [CoachGuard],
  // })],
  // ['/coach/players', () => ({ page: () => import('@/components/Coach/MyPlayers'), guards: [CoachGuard] })],
  // ['/coach/all/players', () => ({ page: () => import('@/pages/PublicUser/users.js'), guards: [CoachGuard] })],
  // ['/coach/player/*', (playerId) => ({ page: () => import('@/pages/PublicUser'), props: { playerId }, guards: [CoachGuard] })],
  // ['/coach/robots', () => ({ page: () => import('@/components/Coach/RobotVideos'), guards: [CoachGuard] })],
  // ['/coach/robot/*', (videoId) => ({ page: () => import('@/components/Coach/RobotVideos/manage.js'), props: { videoId }, guards: [CoachGuard] })],
  ['/coach/mediatheque', () => ({ page: () => import('@/components/Coach/Mediatheque'), guards: [CoachGuard] })],
  // ['/coach/detection', () => ({ page: () => import('@/components/Coach/Detection'), guards: [CoachGuard] })],
  // ['/coach/subscribe', () => ({ page: () => import('@/pages/Stripe/abonnezVous'), guards: [CoachGuard] })],
  // ['/coach/subscribe/checkout/*', (type) => ({ page: () => import('@/pages/Stripe/add'), props: { type }, guards: [CoachGuard] })],
  // ['/coach/subscribe/option', () => ({ page: () => import('@/pages/Stripe/optionAbonnez'), guards: [CoachGuard] })],
  // ['/coach/subscribe/billing', () => ({ page: () => import('@/pages/Stripe/infoUpdate'), guards: [CoachGuard] })],
  // ['/coach/subscribe/tracking', () => ({ page: () => import('@/pages/Stripe/suivi'), guards: [CoachGuard] })],
  // ['/coach/unsubscribe', () => ({ page: () => import('@/pages/Stripe/desabonner'), guards: [CoachGuard] })],
  ['/coach/tutorial/pdf', () => ({ page: () => import('@/components/Coach/Tuto/pdfFormatHelp'), guards: [CoachGuard] })],
  // ['/coach/tutorial/video', () => ({ page: () => import('@/components/Coach/Tuto/materiel'), guards: [CoachGuard] })],
  ['/coach/settings/profile', () => ({ page: () => import('@/components/Coach/Parametre'), guards: [CoachGuard] })],
  ['/coach/settings/studio', () => ({ page: () => import('@/pages/Studio/preferenceStudio.js'), guards: [CoachGuard] })],
  ['/coach/presequencage/*/*', (season, matchId) => ({ page: () => import('@/components/Coach/Presequencage/presequencage.js'), props: { season, matchId }, guards: [CoachGuard] })],
])

const asyncComponent = (importComponent, props = {}) => {
  const Component = lazy(importComponent)
  return (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  )
}

if (process.env.NODE_ENV === 'production') {
  initialize('UA-121876711-1', {
    debug: false,
    titleCase: false,
    gaOptions: {
      userId: 123,
    },
  })

  initialize('UA-121876711-1')

  logPageView = () => {
    set({ page: window.location.pathname + window.location.search })
    pageview(window.location.pathname + window.location.search)
  }

} else {
  logPageView = () => {
    return null
  }
}

export default () => {
  const { [router.routerKey]: route } = useStoreon(router.routerKey)
  if (route.match) {
    for (const guard of route.match.guards || []) {
      const redirectUrl = guard(store.get())
      if (redirectUrl) {
        setImmediate(() => store.dispatch(router.routerNavigate, redirectUrl))
        return null
      }
    }
    logPageView()
    return asyncComponent(route.match.page, route.match.props)
  }
  setImmediate(() => store.dispatch(router.routerNavigate, '/'))
  return null
}
