import React from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Card, Tooltip, Icon } from 'antd'

import TranscodingStatus from '../Upload/status'
import { UploadModalButton } from '../Upload/modal'
import moment from 'moment'
import i18n from 'i18n-js'
import '@/i18n'
import './training_card.scss'

class TrainingCard extends React.PureComponent {

  renderActions = () => {
    const training = this.props.training
    const upload = training.upload
    const haveVideo = training.url !== ''
    const isWhitelisted = training && (training.isPublic === 'public' || training.whitelist.indexOf(this.props.coach._id) !== -1)
    return [
      haveVideo && isWhitelisted && (
        <Tooltip title={i18n.t('Common_word.edit_video')}>
          <div onClick={() => this.openVideo()}>
            <Icon type='play-circle' style={{ color: '#EA178C' }}/>
            <div style={{ color: '#EA178C' }}>{i18n.t('Common_word.analyse')}</div>
          </div>
        </Tooltip>
      ),

      !haveVideo && !upload && (
        <Tooltip title={i18n.t('Common_word.add_video')}>
          <UploadModalButton noButton training={this.props.training}>
            <Icon type='plus' style={{ color: '#EA178C' }}/>
            <div style={{ color: '#EA178C' }}>{i18n.t('Common_word.add_video')}</div>
          </UploadModalButton>
        </Tooltip>
      ),

      <Tooltip title={i18n.t('TrainingCard.training_sheet')}>
        <div onClick={this.openTrainingSheet}>
          <Icon type='profile' style={{ color: '#EA178C' }}/>
          <div style={{ color: '#EA178C' }}>{i18n.t('TrainingCard.training_sheet')}</div>
        </div>
      </Tooltip>,
    ].filter(v => !!v)
  }

  openTrainingSheet = () => {
    this.props.dispatch(router.navigate, `/coach/training/${this.props.training.season}/${this.props.training._id}`)
  }

  openVideo = () => {
    this.props.dispatch(router.navigate, `/coach/edit/training/${this.props.training._id}`)
  }

  renderFloatingLeftBar = () => {
    const upload = this.props.training.upload
    const haveVideo = this.props.training.url !== ''
    return (
      <div style={{ position: 'absolute', left: 10, top: 10 }}>
        {upload && (<TranscodingStatus upload={upload} />)}
        {haveVideo && (
          <Tooltip title={i18n.t('TrainingCard.filmed_training')}>
            <Icon type='video-camera' style={{
              backgroundColor: '#EA178C',
              color: 'white',
              padding: 7,
              borderRadius: 25,
            }} />
          </Tooltip>
        )}
      </div>
    )
  }

  render () {
    const { training } = this.props

    const FloatingLeftBar = this.renderFloatingLeftBar
    return (
      <Card className={'training_card'} actions={this.renderActions()}>
        <FloatingLeftBar />
        <div style={{ marginTop: 20 }}>
          <h1>{training.title}</h1>
          <p>{training.description}</p>
          <p>{moment(training.date).format('LL')}</p>
        </div>
      </Card>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return React.createElement(TrainingCard, props)
}
