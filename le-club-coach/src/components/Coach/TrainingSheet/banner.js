import '../MatchSheet/banner.scss'

import React from 'react'
import moment from 'moment'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Button, Tooltip, Popconfirm } from 'antd'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'

import TranscodingStatus from '../Upload/status'
import { UploadModalButton } from '../Upload/modal'

class TrainingBanner extends React.PureComponent {

  isUpcoming = () => {
    return moment().unix() < moment(this.props.training.date).unix()
  }

  openVideo = () => {
    this.props.dispatch(router.navigate, `/coach/edit/training/${this.props.training._id}`)
  }

  deleteVideo = () => {
    const { coach, training } = this.props
    callApi(`${coach._id}/training/${training._id}/video`, 'delete').then(data => {
      const t = Object.assign({}, training, data)
      this.props.dispatch('trainings/setTraining', t)
    })
  }

  renderDeleteVideoButton = () => {
    const title = (
      <React.Fragment>
        <div>{i18n.t('Sheets.video_management.training_video_delete.title')}</div>
        <div style={{ color: 'red', fontWeight: 'bold' }}>{i18n.t('Common_word.disclaimer')}</div>
      </React.Fragment>
    )
    const { video, coach } = this.props

    if (!video || video.coach !== coach._id) {
      return null
    }

    return (
      <Popconfirm placement='bottom' onConfirm={this.deleteVideo} okText={i18n.t('Common_word.yes')} cancelText={i18n.t('Common_word.no')} title={title}>
        <Button icon='delete' type='danger' style={{ margin: '5px 0' }}>{i18n.t('Sheets.video_management.delete_video')}</Button>
      </Popconfirm>
    )
  }

  renderVideoButton = () => {
    const { training } = this.props
    const uploading = training.upload !== undefined
    const haveVideo = training.url !== ''
    const DeleteVideoButton = this.renderDeleteVideoButton

    return (
      <div>
        {uploading && (<TranscodingStatus upload={training.upload} />)}
        {!uploading && (
          <React.Fragment>
            {!haveVideo && (
              <Tooltip title={i18n.t('Common_word.add_video')}>
                <UploadModalButton button={{ icon: 'plus', type: 'primary' }} training={training}>
                  <span>{i18n.t('Common_word.add_video')}</span>
                </UploadModalButton>
              </Tooltip>
            )}
            {haveVideo && (
              <React.Fragment>
                <Button icon='video-camera' style={{ margin: '5px 0' }} onClick={this.openVideo}>{i18n.t('Common_word.edit_video')}</Button>
                <DeleteVideoButton />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }

  renderVideoActions = () => {
    const VideoButton = this.renderVideoButton
    return (
      <React.Fragment>
        <VideoButton />
      </React.Fragment>
    )
  }

  render () {
    const { training } = this.props
    const VideoActions = this.renderVideoActions

    return (
      <div className='b-match-banner'>
        <div className='b-match-banner-season'>{i18n.t('Common_word.season')} {training.season}</div>
        <div className='b-match-banner-date'>{moment(training.date).format('LLL')}</div>
        <div className='b-match-banner-teams' />
        <div className='b-match-banner-actions'>
          <VideoActions />
        </div>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')
  const video = initialProps.training.url !== '' ? initialProps.training : undefined

  const props = {
    ...initialProps,
    dispatch,
    coach,
    video,
    currentTeam: coachSeason.currentSeason.team,
  }
  return React.createElement(TrainingBanner, props)
}
