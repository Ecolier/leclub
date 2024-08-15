import { decode } from 'jsonwebtoken'
import { Cookies } from 'react-cookie'
import { callApi } from '@/utils/callApi.js'
import store from '@/store'
import { routerNavigate } from '@storeon/router'
import i18n from 'i18n-js'
import '@/i18n'

export function logOut (msg) {
  const cookies = new Cookies()
  cookies.remove('googleGWP', { path: '/' })
  store.dispatch('coach/logOutCoach')
  store.dispatch('notifications/success', msg || i18n.t('Common_word.successfulLogout'))
  store.dispatch(routerNavigate, '/login')
}

export function activeAccount (dataRequest) {
  callApi('settings/saveNewPassword', 'post', dataRequest).then(body => {
    store.dispatch(routerNavigate, '/login')
    return null
  }).catch(e => {
    store.dispatch('notifications/error', e)
  })
}

export function verifeTokenActiveAccount (token) {
  const tokenDecode = decode(token)
  if (!tokenDecode || !tokenDecode.token || !tokenDecode.id || !tokenDecode.type) {
    throw new Error('bad token')
  }
  return tokenDecode
}

export async function createAccountCoach (event, onCancel, onSuccesValue) {
  const payload = { ...event }
  delete payload.passwordVerification
  delete payload.contrat
  try {
    const body = await callApi('coach/create', 'post', payload)
    store.dispatch('notifications/success', body.message ? body.message : '200')
    onCancel && onCancel()
    onSuccesValue && onSuccesValue()
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}
