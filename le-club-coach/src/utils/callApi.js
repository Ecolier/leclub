import { post, get, put, del } from 'superagent'
import { Cookies } from 'react-cookie'
import store from '@/store'
import { logOut } from '@/actions/service'
import i18n from 'i18n-js'
import '@/i18n.js'

let serverUrl = ''
const storeValue = store.get()

if (process.env.NODE_ENV === 'production') {
  serverUrl = 'https://apiprod.teamballinfc.club'
} else if (process.env.NODE_ENV === 'staging') {
  serverUrl = 'https://api.teamballinfc.club'
} else {
  serverUrl = 'http://localhost:8080'
}

export function callApi (endpoint, method = 'get', body, psw) {
  const cookies = new Cookies()
  const token = cookies.get('googleGWP')

  return new Promise((resolve, reject) => {
    let request
    if (method === 'post') {
      request = post(`${serverUrl}/${endpoint}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
    }
    if (method === 'get') {
      request = get(`${serverUrl}/${endpoint}`)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .set('X-Pass', psw)
    }
    if (method === 'put') {
      request = put(`${serverUrl}/${endpoint}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
    }
    if (method === 'delete') {
      request = del(`${serverUrl}/${endpoint}`)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
    }

    request
      .then((res) => resolve(JSON.parse(res.text)))
      .catch((e) => {
        if (e && !e.response) {
          return reject(i18n.t('Common_word.500ErrorMessage'))
        }
        if (e && e.response.statusCode === 403 && storeValue.coach.isAuthenticated) {
          return logOut(e.response.body.message)
        }
        reject(e.response.body.message || e.message)
      })
  })
}
/* Remplacer par callAPIGoogle
export function callApiGateWay (endpoint, method = 'get', body, psw) {
  let serverUrl = ''
  if (process.env.NODE_ENV === 'production') { serverUrl = 'https://d18xsvlltj.execute-api.eu-west-3.amazonaws.com/Production' } else if (process.env.NODE_ENV === 'staging') { serverUrl = 'https://9cabd3tkx6.execute-api.eu-west-3.amazonaws.com/staging' } else { serverUrl = 'https://4u6hacva92.execute-api.eu-west-3.amazonaws.com/Dev' }
  const cookies = new Cookies()
  const token = cookies.get('googleGWP')
  return new Promise((resolve, reject) => {
    if (method === 'post') {
      post(`${serverUrl}/${endpoint}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else if (method === 'get') {
      get(`${serverUrl}/${endpoint}`)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .set('X-Pass', psw)
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else if (method === 'put') {
      put(`${serverUrl}/${endpoint}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else if (method === 'delete') {
      del(`${serverUrl}/${endpoint}`)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else {
      return resolve()
    }
  })
}*/

export function callApiGoogle (endpoint, method = 'get', body, psw) {
  const serverUrl = 'https://europe-west1-theta-disk-310109.cloudfunctions.net'
  const cookies = new Cookies()
  const token = cookies.get('googleGWP')
  return new Promise((resolve, reject) => {
    if (method === 'post') {
      post(`${serverUrl}/${endpoint}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else if (method === 'get') {
      get(`${serverUrl}/${endpoint}`)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .set('X-Pass', psw)
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else if (method === 'put') {
      put(`${serverUrl}/${endpoint}`)
        .send(body)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else if (method === 'delete') {
      del(`${serverUrl}/${endpoint}`)
        .set('Accept', 'application/json')
        .set('X-Access-Token', token || '')
        .then((res) => { const body = JSON.parse(res.text); return resolve(body) })
        .catch(e => {
          if (e && !e.response) { return reject(i18n.t('Common_word.500ErrorMessage')) }
          return reject(e.response.body.message || e.message)
        })
    } else {
      return resolve()
    }
  })
}
