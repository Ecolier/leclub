import { callApi, callApiGoogle } from '@/utils/callApi.js'
import { logOut } from './service'
import uuid from 'uuid/v1'

import { Cookies } from 'react-cookie'

import Evaporate from 'evaporate'
import sparkMD5 from 'spark-md5'
import sha256 from 'js-sha256'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { getQueryStringValue } from '@/utils/helper'
import { decode } from 'jsonwebtoken'
import { fetchMatches } from '@/actions/matches'
import { fetchTrainings } from '@/actions/trainings'
import { restoreTranscodingVideos } from '@/actions/upload'
import store from '@/store'

let host = 'http://localhost:8080'
if (process.env.NODE_ENV === 'production') {
  host = 'https://apiprod.coach.leclub.football'
} else if (process.env.NODE_ENV === 'staging') {
  host = 'https://api.coach.leclub.football'
}

async function populateSeasons (coachId) {
  const data = await callApi(`coach/${coachId}/seasons`, 'get')
  store.dispatch('seasons/populateSeasons', data)
}

export async function restoreCoach () {
  const cookies = new Cookies()
  const token = cookies.get('googleGWP')
  if (!token) {
    return
  }
  try {
    await callApi(`settings/isValidToken/${token}`)
    await populateCoach()
    store.dispatch('coach/loginCoach')
  } catch (err) {
    logOut()
  }
}

export async function populateCoach () {
  try {
    const cookies = new Cookies()
    const tokenDecode = decode(cookies.get('googleGWP'))
    const id = tokenDecode._id
    const coachData = await callApi(`coach/me/${id}`, 'get')

    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    cookies.set('googleGWP', cookies.get('googleGWP'), {
      path: '/',
      httpOnly: false,
      expires,
    })

    store.dispatch('coach/populateCoach', coachData)
    await populateSeasons(id)
    const storeData = store.get()
    if (storeData.coachSeason.currentSeason.onboarded) {
      await fetchMatches()
      await fetchTrainings()
      await restoreTranscodingVideos(id)
    }
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function loginCoach (event) {
  try {
    console.log('IN LOGIN =>')

    const body = await callApi(`coach/${event.email}?pushToken=${event.pushToken}`, 'get', {}, event.password)
    const cookies = new Cookies()
    const dt = new Date()
    dt.setDate(dt.getDate() + 7)

    console.log('LOL =>')

    cookies.set('googleGWP', body.token, {
      path: '/',
      httpOnly: false, // the cookies is used as a storage mean and wont be send in the HTTP requests (as usual)
      expires: dt,
    })

    cookies.set('googleAT', body.algoliaToken, {
      path: '/',
      httpOnly: false, // the cookies is used as a storage mean and wont be send in the HTTP requests (as usual)
      expires: dt,
    })
    console.log('TOTO =>')

    await populateCoach()
    store.dispatch('coach/loginCoach')
    console.log('icic MAN =>')
    // TODO: Replace with good routes
    // if (getQueryStringValue('type') === 'premium') {
    //   return store.dispatch(router.navigate, '/coach/paiement?type=premium')
    // }
    // if (getQueryStringValue('type') === 'coach') {
    //   return store.dispatch(router.navigate, '/coach/paiement?type=coach')
    // }
    // if (getQueryStringValue('type') === 'club') {
    //   return store.dispatch(router.navigate, '/coach/paiement?type=club')
    // }
    // const currentSeason = store.get().coachSeason.currentSeason
    // if (!currentSeason || !currentSeason.onboarded) {
    //   return store.dispatch(router.navigate, '/coach/onBoarding')
    // }
    store.dispatch(router.navigate, '/coach/home')
  } catch (err) {
    console.log(err)
    store.dispatch('notifications/error', err)
  }
}

export async function updateCoach (id, event) {
  try {
    const res = await callApi(`coach/update/${id}`, 'post', event)
    store.dispatch('coach/updateCoach', res)
    store.dispatch('notifications/success', res.message)
  } catch (e) {
    store.dispatch('notifications/error', e)
  }
}

export function updateImageCover (id, urlBack, file) {
  return new Promise((resolve, reject) => {
    const dataForm = new FormData()
    dataForm.append('file', file)
    callApi(urlBack, 'post', dataForm).then(res => {
      dispatch('coach/updateLogoCoverCoach', res)
      resolve(res)
      return null
    }).catch(e => {
      reject(e)
    })
  })
}

export function createSequence (id, event) {
  return new Promise(async (resolve, reject) => {
    // TODO: dispatch(setLoading('loading'))
    try {
      const data = await callApiGoogle(`${process.env.NODE_ENV === 'production' ? 'cut-production' : process.env.NODE_ENV === 'staging' ? 'cut-staging' : 'cut-development'}`, 'post', event)
      store.dispatch('coach/updateCut', data)
      resolve(data)
      store.dispatch('notifications/success', 'Séquence créée avec succès')
    } catch (err) {
      store.dispatch('notifications/error', err)
      reject(err)
    }
  })
}

export function createSpotlightClip (id, event, resetClip) {
  return new Promise(async (resolve, reject) => {
    // TODO: dispatch(setLoading('loading'))
    try {
      const { spotlight, ...evt } = event
      evt.id = id
      evt.coachId = id

      const formdata = new FormData()
      formdata.append('spotlight', spotlight)
      formdata.append('data', JSON.stringify(evt))

      const data = await callApiGoogle(`${process.env.NODE_ENV === 'production' ? 'spotlight-production' : process.env.NODE_ENV === 'staging' ? 'spotlight-staging' : 'spotlight-development'}`, 'post', formdata)
      store.dispatch('coach/updateCut', data)
      store.dispatch('notifications/success', i18n.t('VideoPlayer.spotlightCreated'))
      resolve(data)
    } catch (err) {
      store.dispatch('notifications/error', err)
      reject(err)
    }
  })
}

// ? CHECK IF THIS FUNCTION IS STILL USED
export async function updateCut (id, event) {
  try {
    const data = await callApi(`studio/updateSequece/${id}`, 'post', event)
    // store.dispatch('coach/updateCutArray', data)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function deleteCut (coachId, cutId) {
  try {
    const data = await callApi(`studio/deleteSequece/${coachId}?cutId=${cutId}`, 'delete')
    store.dispatch('coach/deleteCut', data)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function saveDrawing (coachId, params, closeModal) {

  let formData = {}
  formData = new FormData()
  formData.append('file', params.blob)
  formData.append('videoId', params.videoId)
  formData.append('duration', params.duration)
  formData.append('isPrivate', params.isPrivate === 'privateDrawing')
  formData.append('whitelist', params.whitelist)
  formData.append('timeOfimage', params.timeOfimage)
  formData.append('isType', params.isType)

  try {
    const data = await callApi(`studio/saveDrawing/${coachId}`, 'post', formData)
    if (closeModal) {
      closeModal()
    }
    store.dispatch('coach/updateCurrentVideoDrawing', data)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function deleteDrawing (coachId, name, type, videoId) {
  try {
    const data = await callApi(`studio/deleteDrawing/${coachId}?name=${name}&isType=${type}&videoId=${videoId}`, 'delete')
    store.dispatch('coach/updateCurrentVideoDrawing', data)
    store.dispatch('notifications/success', data.message)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function updateStudioPref (id, event) {
  try {
    const data = await callApi(`studio/updatePref/${id}`, 'post', event)
    store.dispatch('coach/updateCoachPref', data)
    store.dispatch('notifications/success', data.message)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export function sortMatch (data) {
  store.dispatch('coach/sortMatch', data)
}

export async function updateLogoCoverCoach (id, type) {
  try {
    const res = await callApi(`coach/update/coverlogo/${id}?mode=remove&type=${type}`, 'post', {})
    store.dispatch('coach/updateLogoCoverCoach', res)
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export function createDrawingClip (coachId, body) {
  return new Promise((onCreated, onError) => {
    try {
      // dispatch({ type: 'client/resetPercents', data: {} })
      const cookies = new Cookies()
      const token = cookies.get('googleGWP')
      let bucket = 'videos-ressources1'//'dev-videos-ressources-1'
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        bucket = 'videos-ressources-1'
      }
      const config = {
        signerUrl: `${host}/studio/signedurl/multipart/`,
        bucket,
        progressIntervalMS: 500,
        cloudfront: true,
        logging: true,
        maxConcurrentParts: 5,
        s3Acceleration: false,
        partSize: 20 * 1024 * 1024,
        aws_key: 'AKIAQYU4RX2BU7S4YFXC',//'AKIAIXLEZPB4WNTJFJ5A',
        awsRegion: 'eu-west-1',
        computeContentMd5: true,
        cryptoMd5Method: (d) => btoa(sparkMD5.ArrayBuffer.hash(d, true)),
        cryptoHexEncodedHash256: sha256,
        signHeaders: { 'X-Access-Token': token || '' },
      }
      body.drawings.sort((a, b) => a.time - b.time)
      const all = []
      body.drawings.forEach((draw, key) => {
        all.push(new Promise(async (resolve, reject) => {
          const file = draw.file
          const uid = uuid()
          body.fileName = uid
          body.drawings[key].file = { fileName: uid }
          const evaporate = await Evaporate.create(config)
          const addConfig = {
            name: `${coachId}/${uid}.png`,
            file,
            error () {
              reject()
            },
          }
          await evaporate.add(addConfig, { signerUrl: `${host}/studio/signedurl/multipart/${coachId}/${uid}/png` })
          const fileUrl = await callApi(`studio/getSignedUrlFile/${coachId}?uid=${uid}&ext=png`, 'get')
          body.drawings[key].file.fileUrl = fileUrl.signedUrl
          resolve()
        }))
      })
      Promise.all(all).then(async () => {
        body.id = coachId
        const res = await callApiGoogle(`${process.env.NODE_ENV === 'production' ? 'drawing-production' : process.env.NODE_ENV === 'staging' ? 'drawing-staging' : 'drawing-development'}`, 'post', body)
        store.dispatch('coach/updateCut', { data: res })
        return onCreated(res)
      }).catch((e) => {
        onError(e)
      })
    } catch (e) {
      onError(e)
    }
  })
}

export async function setSeasonTeams ({ teams }) {
  const { coach } = store.get()
  const coachId = coach._id

  try {
    const res = await callApi(`coach/${coachId}/teams/update`, 'put', { teams })
    store.dispatch('seasons/setSeason', { season: res.season })
  } catch (err) {
    store.dispatch('notifications/error', err)
  }
}

export async function changeCurrentTeam (teamId) {
  const { coach, coachSeason } = store.get()
  const season = coachSeason.currentSeason.season

  // Here we want to update coach default team only if the chosen team is a current season team
  const shouldSetFavoriteTeam = (
    coachSeason.adminSeason === season
  )

  if (shouldSetFavoriteTeam) {
    await callApi(`coach/${coach._id}/team/select/${teamId}`, 'put')
  }

  await fetchMatches({ team: teamId, season })
  await fetchTrainings({ team: teamId, season })

  store.dispatch('seasons/changeCurrentTeam', teamId)
}

export function changeCurrentSeason (seasonId) {
  const { coach, coachSeason } = store.get()
  const coachId = coach._id

  callApi(`coach/${coachId}/season/${seasonId}`, 'get').then(data => {
    store.dispatch('seasons/populateSeasons', {
      currentSeason: data.season,
      seasons: coachSeason.seasons,
      adminSeason: coachSeason.adminSeason,
    })
    changeCurrentTeam(data.season.team)
  })
}

export function updateCutV2 (body, closeForm) {
  return new Promise((resolve, reject) => {
    callApi(`studio/updateSequeceV2/${body.coachId}`, 'post', body).then(res => {
      const cutData = {
        _id: res.cut._id,
        about: res.cut.about,
        title: res.cut.title,
        tags: res.cut.tags,
        whitelist: res.cut.whitelist,
        isPublic: res.cut.isPublic,
      }
      store.dispatch('coach/updateCutV2', cutData)
      if (closeForm) {
        closeForm()
      }
      resolve(cutData)
    }).catch(e => {
      reject(e)
    })
  })
}

export function closeParrainagePopup (coachId) {
  callApi(`stripe/parrainagePopup/${coachId}`, 'post').then(data => {
    store.dispatch('coach/parrainagePopup', { parrainagePopup: true })
  })
}

export function closePreSequencageTutorialModal (coachId) {
  callApi(`coach/presequencageTutorial/${coachId}`, 'put').then(data => {
    store.dispatch('coach/presequencageTutorial', { presequencageTutorial: false })
  })
}
