import './style.css'
import 'moment-duration-format'
import React from 'react'
import Player from '../Player'
import Controls from '../Player/ControlBar'
import Chrono from '../Player/Chrono'
import OldDrawingLayer from '@/components/Player/OldDrawingLayer.js'
import { Button } from 'antd'
import i18n from 'i18n-js'
import '@/i18n.js'

import moment from 'moment'

const KEY_ESCAPE = 27

export default class extends React.PureComponent {

  componentDidMount () {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', this.handleEscapeKey)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleEscapeKey)
    this.handleClose()
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose()
    document.body.style.overflow = null
  }

  handleEscapeKey = evt => {
    if (evt.keyCode === KEY_ESCAPE) {
      this.handleClose()
    }
  }

  handleOverlayClick = evt => {
    if (evt.target.classList.contains('media-modal-preview', 'media-modal-overlay')) {
      this.handleClose()
    }
  }

  renderThemes = () => {
    const themes = this.props.tags || []

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {themes.map(t => (
          <div key={t.name} style={{ display: 'inline-block', padding: '10px 15px', marginBottom: 10, marginRight: 10, backgroundColor: t.color }}>
            <span>{t.name}</span>
          </div>
        ))}
      </div>
    )
  }

  getMatchTitle = () => {
    const match = this.props.match
    return `${match.teamHome.name} vs ${match.teamAway.name}`
  }

  getCutTime = () => {
    const duration = this.props.timeOfCut
    const text = moment.duration(duration * 1000).format('mm:ss')
    if (duration > 60) {
      return `${text} ${i18n.t('Common_word.minutes')}`
    }
    return `${text} ${i18n.t('Common_word.secondes')}`
  }

  getDrawings () {
    return this.props.videoProps ? this.props.videoProps.drawings : []
  }

  render () {

    if (!this.props.visible) {
      return null
    }
    const Themes = this.renderThemes
    const videoProps = this.props.videoProps || {}

    return (
      <div className='media-modal-overlay' onClick={this.handleOverlayClick}>
        <div className='media-modal-inner'>
          <div className='media-modal-preview'>
            {this.props.type.startsWith('video') && (
              <Player source={this.props.url} {...videoProps}>
                <Chrono />
                <Controls />
                <OldDrawingLayer drawings={this.getDrawings()} start={this.props.start} />
              </Player>
            )}
            {this.props.type.startsWith('image') && (
              <img src={this.props.url} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(this.props.match || this.props.training) && (
                <div className='media-modal-meta'>
                  <div className='media-modal-title'>
                    {this.props.match ? this.getMatchTitle() : this.props.training.title}
                  </div>
                  <div style={{ fontSize: 16 }}>{i18n.t('Common_word.duration')}: {this.getCutTime()}</div>
                </div>
              )}
              <div className='media-modal-meta'>
                <div className='media-modal-title'>{this.props.title}</div>
                <div className='media-modal-desc'>{this.props.about}</div>
                <Themes />
              </div>
            </div>
          </div>
        </div>
        <Button onClick={this.handleClose} type='primary'>
          {i18n.t('Common_word.clickToClose')}
        </Button>
      </div>
    )
  }
}
