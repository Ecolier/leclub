import React from 'react'
import { useStoreon } from 'storeon/react'
import UploadStatus from './status'
import { Card, Icon } from 'antd'
import { cancelMatchVideoUpload, cancelTrainingVideoUpload } from '@/actions/upload'
import './notification.scss'
import { removeUploadStatus } from '@/actions/upload'
import i18n from 'i18n-js'
import '@/i18n'

class UploadNotification extends React.PureComponent {

  cancelMatchUpload = async matchId => {
    document.getElementById(matchId).classList.add('disabledItem')
    await cancelMatchVideoUpload(this.props.coach._id, matchId)
    removeUploadStatus('match', matchId)
  }

  cancelTrainingUpload = async trainingId => {
    document.getElementById(trainingId).classList.add('disabledItem')
    await cancelTrainingVideoUpload(this.props.coach._id, trainingId)
    removeUploadStatus('training', trainingId)
  }

  renderUploadingMatchesVideo = matches => (
    matches.map((m, i) => (
      <div id={m._id} key={i} className={'uploading_item'}>
        <span>{m.clubHome.name} - {m.clubAway.name}</span>
        <UploadStatus upload={m.upload}/>
        {m.upload.state === 0 && m.upload.percent > 0
        && <Icon type={'close'} onClick={() => this.cancelMatchUpload(m._id, 'match')}/>}
      </div>
    ))
  )

  renderUploadingTrainingsVideo = trainings => (
    trainings.map((t, i) => (
      <div id={t._id} key={i} className={'uploading_item'}>
        <span>{t.title}</span>
        <UploadStatus upload={t.upload}/>
        {t.upload.state === 0 && t.upload.percent > 0
        && <Icon type={'close'} onClick={() => this.cancelTrainingUpload(t._id, 'training')}/>}
      </div>
    ))
  )

  render () {
    const { matches, trainings } = this.props
    // TODO: Remove on sequencage
    if (matches.length === 0 && trainings.length === 0) {
      return null
    }
    return (
      <div className='ant-notification ant-notification-bottomRight' style={{ right: '0px', bottom: '48px' }}>
        <Card title={<p style={{ margin: 0, color: 'white' }}>{i18n.t('Import.importProgress')}</p>}
          headStyle={{ background: 'rgb(50, 50, 50)' }} bodyStyle={{ padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {this.renderUploadingMatchesVideo(matches)}
            {this.renderUploadingTrainingsVideo(trainings)}
          </div>
        </Card>
      </div>
    )
  }
}

export default initialProps => {
  const { coach, matches, trainings } = useStoreon('coach', 'matches', 'trainings')
  const uploadingMatches = Object.keys(matches)
    .map(k => matches[k])
    .filter(m => !!m)
    .filter(m => m.upload !== undefined)
    .filter(m => m.teamAway && m.teamHome)
  const uploadingTrainings = Object.keys(trainings)
    .map(k => trainings[k])
    .filter(t => !!t)
    .filter(t => t.upload !== undefined)
  return React.createElement(UploadNotification, {
    ...initialProps,
    coach,
    matches: uploadingMatches,
    trainings: uploadingTrainings,
  })
}
