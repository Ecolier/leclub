import { callApi } from '@/utils/callApi.js'

import { notification } from 'antd'
import store from '@/store'
import i18n from 'i18n-js'
import '@/i18n'

async function subscribeBasicTier (coach, body) {
  const reqType = coach.accountType === 'T0' ? 'chossingTier1' : 'newChangeSubscription'
  const res = await callApi(`tier/${reqType}/${coach._id}?&favoriteTeam=${body.team1}`, 'put', body)
  return store.dispatch('seasons/setSeason', {
    season: res.season,
  })
}

async function subscribePremiumTier (coach, body, stripe) {
  const reqType = coach.accountType === 'T0' ? 'chossingTier1' : 'newChangeSubscription'
  const privateActivate = body.privateActivate === 'private'
  const res = await callApi(`tier/${reqType}/${coach._id}?privateActivate=${privateActivate}&favoriteTeam=${body.team1}`, 'put', body)

  if (res.status === 'incomplete') {
    const { error, paymentIntent } = await stripe.handleCardPayment(res.pi)
    if (error) {
      throw new Error(i18n.t('Stripe.billingError.unverified'))
    }
    try {
      body.paymentIntent = paymentIntent.id
      const res2 = await callApi(`tier/saveAfterGoodPayment/${coach._id}?privateActivate=${privateActivate}&favoriteTeam=${body.team1}`, 'post', body)
      notification.success({ message: i18n.t('Stripe.subscribed'), description: res.message })
      store.dispatch('coach/updateStripe', {
        data: res2,
      })
      return store.dispatch('seasons/setSeason', {
        data: res2.season,
      })
    } catch (err) {
      throw new Error(i18n.t('Stripe.billingError.contactAdmin'))
    }
  }
  notification.success({ message: i18n.t('Stripe.subscribed'), description: res.message })
  store.dispatch('coach/updateStripe', {
    data: res,
  })
  return store.dispatch('seasons/setSeason', {
    season: res.season,
  })
}

async function subscribeCoachTier (coach, body, stripe) {
  const reqType = coach.accountType === 'T0' ? 'chossingTier2' : 'newChangeSubscription'
  const privateActivate = body.privateActivate === 'private'
  const res = await callApi(`tier/${reqType}/${coach._id}?privateActivate=${privateActivate}&team1=${body.team1}&team2=${body.team2}&email=${body.coachEmail}&firstName=${body.coachFirstName}&lastName=${body.coachLastName}`, 'put', body)

  if (res.status === 'incomplete') {
    const { error, paymentIntent } = await stripe.handleCardPayment(res.pi)
    if (error) {
      throw new Error(i18n.t('Stripe.billingError.unverified'))
    }
    body.paymentIntent = paymentIntent.id
    try {
      const res2 = await callApi(`tier/saveAfterGoodPayment/${coach._id}?privateActivate=${body.privateActivate === 'private'}&team1=${body.team1}&team2=${body.team2}&email=${body.coachEmail}&firstName=${body.coachFirstName}&lastName=${body.coachLastName}`, 'post', body)

      notification.success({ message: i18n.t('Stripe.subscribed'), description: res.message })
      store.dispatch('coach/updateStripe', {
        data: res2,
      })
      return store.dispatch('seasons/setSeason', {
        season: res2.season,
      })
    } catch (err) {
      throw new Error(i18n.t('Stripe.billingError.contactAdmin'))
    }
  }
  notification.success({ message: i18n.t('Stripe.subscribed'), description: res.message })
  store.dispatch('coach/updateStripe', {
    data: res,
  })
  return store.dispatch('seasons/setSeason', {
    season: res.season,
  })
}

async function subscribeClubTier (coach, body, stripe) {
  const reqType = coach.accountType === 'T0' ? 'chossingTier3' : 'newChangeSubscription'
  const privateActivate = body.privateActivate === 'private'
  const res = await callApi(`tier/${reqType}/${coach._id}?privateActivate=${privateActivate}`, 'put', body)

  if (res.status === 'incomplete') {
    const { error, paymentIntent } = await stripe.handleCardPayment(res.pi)
    if (error) {
      throw new Error(i18n.t('Stripe.billingError.unverified'))
    }
    body.paymentIntent = paymentIntent.id
    try {
      const res2 = await callApi(`tier/saveAfterGoodPayment/${coach._id}?privateActivate=${privateActivate}`, 'post', body)
      notification.success({ message: i18n.t('Stripe.subscribed'), description: res.message })
      store.dispatch('coach/updateStripe', {
        data: res2,
      })
      return store.dispatch('seasons/setSeason', {
        season: res2.season,
      })
    } catch (err) {
      throw new Error(i18n.t('Stripe.billingError.contactAdmin'))
    }
  }
  notification.success({ message: i18n.t('Stripe.subscribed'), description: res.message })
  store.dispatch('coach/updateStripe', {
    data: res,
  })
  return store.dispatch('seasons/setSeason', {
    season: res.season,
  })
}

export async function addStripe (coach, body, subscribeType, nextPage, stripe, callBackChecker) {
  try {
    if (subscribeType === 'basic') {
      await subscribeBasicTier(coach, body)
      callBackChecker()
    }
    if (subscribeType === 'premium') {
      await subscribePremiumTier(coach, body, stripe)
      callBackChecker()
    }
    if (subscribeType === 'coach') {
      await subscribeCoachTier(coach, body, stripe)
      callBackChecker()
    }
    if (subscribeType === 'club') {
      await subscribeClubTier(coach, body, stripe)
      callBackChecker()
    }
    nextPage()
  } catch (err) {
    store.dispatch('notifications/error', err)
    callBackChecker()
  }
}

export async function updateStripe (id, body, handleClick) {
  try {
    const res = await callApi(`stripe/update/${id}`, 'put', body)
    notification.success({ message: i18n.t('Common_word.infos_updated'), description: res.message })
    store.dispatch('coach/updateStripe', res)
    handleClick()
  } catch (e) {
    store.dispatch('notifications/error', e)
  }
}

export async function updateCoachTeamChosen (id, team1, team2) {
  try {
    const res = await callApi(`tier/chossingTeams/${id}?team1=${team1}&team2=${team2}`, 'put')
    store.dispatch('coach/updateCoach', {
      data: res,
    })
  } catch (e) {
    store.dispatch('notifications/error', e)
  }
}

export async function updateCoachOption (id, body, stripe) {
  try {
    const res = await callApi(`tier/newChangeOption/${id}`, 'put', body)
    if (res.status === 'incomplete') {
      const { error, paymentIntent } = await stripe.handleCardPayment(res.pi)
      if (error) {
        throw new Error(i18n.t('Stripe.billingError.unverified'))
      }
      body.paymentIntent = paymentIntent.id
      try {
        const resu = await callApi(`tier/SuccessPaymentChangeOption/${id}`, 'post', body)
        notification.success({ message: resu.message })
        return store.dispatch('coach/updateCoachOption', resu)
      } catch (err) {
        throw new Error(i18n.t('Stripe.billingError.contactAdmin'))
      }
    }
    store.dispatch('coach/updateCoachOption', res)
    notification.success({ message: res.message })
  } catch (e) {
    store.dispatch('notifications/error', e)
  }
}

export async function cancelSubscription (id, changePage) {
  try {
    const res = await callApi(`tier/chossingTier0/${id}`, 'put')
    store.dispatch('coach/updateStripe', {
      data: res,
    })
    notification.success({
      message: i18n.t('Stripe.unsubscribed'),
      description: res.message,
    })
    changePage({ key: 'abonnezvous' })
  } catch (err) {
    store.dispatch('notifications/error', i18n.t('Stripe.unsubscribedError'))
  }
}
