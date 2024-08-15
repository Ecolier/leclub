import Uppy from '@uppy/core'
import UppyS3Multipart from '@uppy/aws-s3-multipart'
import { message } from 'antd'

import { setMatchVideo } from './matches'
import { callApi } from '@/utils/callApi'
import { notification } from 'antd'
import store from '@/store'
import i18n from 'i18n-js'
import '@/i18n'

const TRANSCODER_POLL_INTERVAL = 1000

let serverUrl = ''
if (process.env.NODE_ENV === 'production') {
  serverUrl = 'https://apiprod.coach.leclub.football'
} else if (process.env.NODE_ENV === 'staging') {
  serverUrl = 'https://api.coach.leclub.football'
} else {
  serverUrl = 'http://localhost:8080'
}

export const UPLOAD_STATE = {
  VIDEO_UPLOADING: 0,
  VIDEO_UPLOADING_COMPLETED: 1,
  VIDEO_UPLOADING_ERROR: 2,

  TRANSCODING: 3,
  TRANSCODING_COMPLETED: 4,
  TRANSCODING_ERROR: 5,
  TRANSCODING_WAITING: 6,

  OVERLAY_GENERATING: 7,
  OVERLAY_UPLOADING: 8,
  OVERLAY_UPLOADING_COMPLETED: 9,
  OVERLAY_UPLOADING_ERROR: 10,

  COMPLETED: 11,
  UKN: 12,
}

const uppyInstances = []
const watchers = {}

function preventBrowserClose (e) {
  e.returnValue = i18n.t('Upload.browserClose')
  return e.returnValue
}

function startWatchingTranscoderStatus (type, id, taskId) {
  const { coach } = store.get()

  // here we're already watching transcoder, that useless to watch multiple times :)
  if (watchers[taskId] !== undefined) {
    return
  }

  function pollTranscoderStatus () {
    callApi(`upload/${coach._id}/${taskId}/transcode/status`, 'get')
      .then(data => {
        if (data.status === 'encoding') {
          return setUploadStatus(type, id, UPLOAD_STATE.TRANSCODING, data.percent)
        }
        if (data.status === 'completed') {
          setTimeout(() => removeUploadStatus(type, id)), 3000
          message.success(i18n.t('Upload.videoUploaded'), 5)
          setUploadStatus(type, id, UPLOAD_STATE.COMPLETED, 100)
          if (type === 'match') {
            setMatchVideo({
              matchId: id,
              videoAway: data.match.videoAway,
              videoHome: data.match.videoHome,
            })
          }
          if (type === 'training') {
            store.dispatch('trainings/setTraining', data.training)
          }
          return stopWatchingTranscoderStatus()
        }
        return setUploadStatus(type, id, UPLOAD_STATE.TRANSCODING_WAITING)
      })
      .catch(err => {
        if (typeof err === 'object') {
          if (err.status !== 404) {
            notification.error({
              message: err.message,
            })
          }
        }
        stopWatchingTranscoderStatus(taskId)
        removeUploadStatus(type, id)
      })
      .finally(() => {
        if (watchers[taskId] !== undefined) {
          watchers[taskId] = setTimeout(pollTranscoderStatus, TRANSCODER_POLL_INTERVAL)
        }
      })
  }

  // start poll interval :)
  watchers[taskId] = setTimeout(pollTranscoderStatus, 0)
}

function stopWatchingTranscoderStatus (taskId) {
  clearTimeout(watchers[taskId])
  watchers[taskId] = undefined
}

export function startTranscoder (params) {
  const payload = {
    keys: params.files.map(f => f.s3Multipart.key),
  }
  callApi(`upload/${params.coachId}/${params.taskId}/transcode`, 'post', payload).then(() => {
    setUploadStatus(params.type, params.id, UPLOAD_STATE.TRANSCODING_WAITING)
    startWatchingTranscoderStatus(params.type, params.id, params.taskId)
  })
}

export function setUploadStatus (type, id, state, percent) {
  if (type === 'match') {
    const { matches } = store.get()
    const match = matches[id] || {}
    const upload = match.upload || {}

    if (upload.percent === (percent || 0) && upload.state === state) {
      return
    }
    store.dispatch('matches/setMatchUploadState', {
      state,
      percent,
      matchId: id,
    })
  }
  if (type === 'training') {
    store.dispatch('trainings/setTrainingUploadState', {
      state,
      percent,
      trainingId: id,
    })
  }
}

export function removeUploadStatus (type, id) {
  if (type === 'match') {
    return store.dispatch('matches/removeMatchUploadState', {
      matchId: id,
    })
  }
  if (type === 'training') {
    return store.dispatch('trainings/removeTrainingUploadState', {
      trainingId: id,
    })
  }
}

export function generateVideoWatermark (type, id, taskId, sponsorFile, size) {
  return new Promise(async (resolve, reject) => {
    const state = store.get()
    const coach = state.coach
    const coachSeason = state.coachSeason

    setUploadStatus(type, id, UPLOAD_STATE.OVERLAY_GENERATING, 0)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = size.width
    canvas.height = size.height
    canvas.style.width = `${canvas.width}px`
    canvas.style.height = `${canvas.height}px`

    function getImage (src) {
      return new Promise(resolve => {
        const img = document.createElement('img')
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const ratio = img.width / img.height
          img.height = 96 * (size.height / 1080)
          img.width = img.height * ratio
          resolve(img)
        }
        img.src = src
      })
    }

    const leClubLogo = await getImage('/assets/logo_ok.png')

    if (coach.accountType !== 'T0') {
      const clubLogo = await getImage(`${coachSeason.currentSeason.club.urlLogo}?watermark`)
      ctx.drawImage(clubLogo, 60, (canvas.height - 60) - clubLogo.height, clubLogo.width, clubLogo.height)

      if (sponsorFile) {
        const url = URL.createObjectURL(sponsorFile)
        const sponsorLogo = await getImage(url)
        URL.revokeObjectURL(url)
        ctx.drawImage(sponsorLogo, (canvas.width - 60) - sponsorLogo.width, 60, sponsorLogo.width, sponsorLogo.height)
      }
    }

    ctx.drawImage(leClubLogo, (canvas.width - 60) - leClubLogo.width, (canvas.height - 60) - leClubLogo.height, leClubLogo.width / 2, leClubLogo.height / 2)

    // here we need to upload freshly created watermark on s3
    callApi(`upload/${coach._id}/${taskId}/s3/watermark`, 'post', { size }).then(data => {
      canvas.toBlob(blob => {
        const url = data.url
        const options = {
          method: 'PUT',
          body: blob,
        }
        setUploadStatus(type, id, UPLOAD_STATE.OVERLAY_GENERATING, 50)
        fetch(url, options).then(res => {
          if (!res.ok) {
            return reject(res)
          }
          setUploadStatus(type, id, UPLOAD_STATE.OVERLAY_GENERATING, 100)
          resolve()
        })
      })
    })
  })
}

export async function uploadVideo (params) {
  // create upload task
  try {
    const { taskId } = await callApi(`upload/${params.coachId}`, 'post', {
      match: params.matchId,
      season: params.season,
      training: params.trainingId,
      team: params.teamId,
      privacy: params.privacy,
      whitelist: params.whitelist,
      files: params.files.map(f => f.uid),
    })

    params.type = params.trainingId ? 'training' : 'match'
    params.id = params.trainingId ? params.trainingId : params.matchId

    await generateVideoWatermark(params.type, params.id, taskId, params.sponsorFile, {
      width: 1920,
      height: 1080,
    })

    await generateVideoWatermark(params.type, params.id, taskId, params.sponsorFile, {
      width: 720,
      height: 480,
    })

    const uppy = Uppy()
    uppy.use(UppyS3Multipart, {
      limit: 10,
      companionUrl: `${serverUrl}/upload/${params.coachId}/${taskId}`,
    })
    uppyInstances[params.id] = uppy

    /* eslint-disable-next-line */
    function handleUpload () {
      setUploadStatus(params.type, params.id, UPLOAD_STATE.VIDEO_UPLOADING, 0)
    }

    /* eslint-disable-next-line */
    function handleProgress (percent) {
      setUploadStatus(params.type, params.id, UPLOAD_STATE.VIDEO_UPLOADING, percent)
    }

    /* eslint-disable-next-line */
    function handleError (_, error) {
      notification.error({
        message: error,
      })
      removeUploadStatus(params.type, params.id)
      window.removeEventListener('beforeunload', preventBrowserClose)
    }

    /* eslint-disable-next-line */
    function handleComplete (res) {
      setUploadStatus(params.type, params.id, UPLOAD_STATE.VIDEO_UPLOADING_COMPLETED, 100)

      // here we clean our uppy instance
      uppy.off('upload', handleUpload)
      uppy.off('progress', handleProgress)
      uppy.off('complete', handleComplete)
      uppy.off('error', handleError)
      uppy.close()

      // start transcoder there :)
      startTranscoder({
        taskId,
        type: params.type,
        id: params.id,
        files: res.successful,
        coachId: params.coachId,
      })
      window.removeEventListener('beforeunload', preventBrowserClose)
    }

    uppy.on('upload', handleUpload)
    uppy.on('progress', handleProgress)
    uppy.on('complete', handleComplete)
    uppy.on('error', handleError)

    // add all files to uppy instance
    params.files.map(file => uppy.addFile({
      name: file.name,
      type: file.type,
      data: file,
      source: 'Local',
      isRemote: false,
    }))

    // and now start upload :)
    window.addEventListener('beforeunload', preventBrowserClose)
    return uppy.upload()
  } catch (err) {
    notification.error({
      message: err,
    })
    removeUploadStatus(params.type, params.id)
  }
}

export function restoreTranscodingVideos (coachId) {
  callApi(`upload/${coachId}/transcoding`, 'get').then(data => {
    data.tasks.forEach(task => {
      if (task.match) {
        setUploadStatus('match', task.match, UPLOAD_STATE.UKN, 0)
        startWatchingTranscoderStatus('match', task.match, task._id)
      }
      if (task.training) {
        setUploadStatus('training', task.training, UPLOAD_STATE.UKN, 0)
        startWatchingTranscoderStatus('training', task.training, task._id)
      }
    })
  })
}

export const cancelMatchVideoUpload = async (coachId, matchId) => {
  const uppy = uppyInstances[matchId]
  const files = uppy.getFiles()
  await callApi(`upload/${coachId}/${matchId}/s3/multipart/${files[0].s3Multipart.uploadId}/cancelMatch?key=${files[0].s3Multipart.key}`, 'delete')
  uppy.cancelAll()
  if (!(uppy.getFiles()).length) {
    window.removeEventListener('beforeunload', preventBrowserClose)
  }
  const index = uppyInstances.findIndex(el => matchId === el)
  uppyInstances.splice(index, 1)
  uppy.close()
}

export const cancelTrainingVideoUpload = async (coachId, trainingId) => {
  const uppy = uppyInstances[trainingId]
  const files = uppy.getFiles()
  await callApi(`upload/${coachId}/${trainingId}/s3/multipart/${files[0].s3Multipart.uploadId}/cancelTraining?key=${files[0].s3Multipart.key}`, 'delete')
  uppy.cancelAll()
  if (!(uppy.getFiles()).length) {
    window.removeEventListener('beforeunload', preventBrowserClose)
  }
  const index = uppyInstances.findIndex(el => trainingId === el)
  uppyInstances.splice(index, 1)
  uppy.close()
}
