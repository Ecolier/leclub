import './form.scss'
import React, { Component } from 'react'
import { Radio, Input, notification, Spin, Button } from 'antd'
import { ClipContext } from './context'
import ThemesPicker from './themesPicker'
import VideoWhitelist from '../Coach/VideoWhitelist'
import i18n from 'i18n-js'
import '@/i18n.js'

notification.config({
  placement: 'bottomRight',
})

export default class extends Component {

  componentDidMount = () => {
    this.context.on('stop', this.resetState)
  }

  componentWillUnmount = () => {
    this.context.off('stop', this.resetState)
  }

  state = {
    description: undefined,
    dataSource: null,
    loading: false,
    themes: [],
    title: undefined,
    whitelistModal: false,
    clipPrivacy: (this.props.video && this.props.video.isPublic) || 'public',
    clipWhitelist: (this.props.video && this.props.video.whitelist) || [],
  }

  static contextType = ClipContext

  resetState = () => {
    this.setState({
      title: undefined,
      clipPrivacy: (this.props.video && this.props.video.isPublic) || 'public',
      clipWhitelist: (this.props.video && this.props.video.whitelist) || [],
      whitelistModal: false,
      themes: [],
      description: undefined,
    })
  }

  createThumbnail = (video) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = 720
    canvas.style.width = `${canvas.width}px`
    canvas.style.height = `${canvas.height}px`

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL()
  }

  lockCutCreation = () => {
    this.cutCreationLocked = true
    setTimeout(() => {
      this.cutCreationLocked = false
    }, 1000)
  }

  resetCut = () => {
    this.context.stopEdit()
    this.setState({
      description: undefined,
      dataSource: null,
      themes: [],
      title: undefined,
    })
  }

  deleteCut = () => {
    this.context.stopEdit()
    this.resetState()
    if (this.props.resetDrawings) { this.props.resetDrawings() }
  }

  handleChange = (key) => {
    return (evt) => {
      const state = {}
      state[key] = evt.target.value
      this.setState(state)
    }
  }

  get pickableThemes () {
    return [
      {
        name: i18n.t('CutSample.tryThemes.defensivePhase'),
        color: '#f44336',
      },
      {
        name: i18n.t('CutSample.tryThemes.off/defTransition'),
        color: '#ff9800',
      },
      {
        name: i18n.t('CutSample.tryThemes.defensiveCPA'),
        color: '#888',
      },
      {
        name: i18n.t('CutSample.tryThemes.offensivePhase'),
        color: '#3f51b5',
      },
      {
        name: i18n.t('CutSample.tryThemes.off/defTransition'),
        color: '#03a9f4',
      },
      {
        name: i18n.t('CutSample.tryThemes.offensiveCPA'),
        color: '#4caf50',
      },
    ]
  }

  handleSubmit = () => {
    if (!this.props.onSubmit) {
      return
    }
    const start = this.context.getAbsoluteClipStart()
    const end = this.context.getAbsoluteClipEnd()
    this.props.onSubmit({
      title: this.state.title,
      about: this.state.description,
      tags: this.state.themes,
      start,
      end,
      duration: end - start,
      whitelist: this.state.clipWhitelist,
      isPublic: this.state.clipPrivacy,
    })
  }

  handleThemesChange = (themes) => {
    this.setState({ themes })
  }

  handlePrivacyChange = (privacy) => {
    this.setState({
      clipPrivacy: privacy,
      whitelistModal: privacy === 'private',
    })
  }

  handleWhitelistChange = (evt) => {
    this.setState({
      clipPrivacy: evt.privacy,
      clipWhitelist: evt.whitelist,
      whitelistModal: false,
    })
  }

  renderPrivacySection = () => {
    const { video } = this.props
    if (!video) {
      return null
    }
    return (
      <div>
        <Radio.Group value={this.state.clipPrivacy}>
          <Radio.Button value='private' onClick={() => this.handlePrivacyChange('private')}>{i18n.t('Common_word.private')}</Radio.Button>
          <Radio.Button value='public' onClick={() => this.handlePrivacyChange('public')}>{i18n.t('Common_word.public')}</Radio.Button>
        </Radio.Group>
        {this.state.clipPrivacy === 'private' && (
          <VideoWhitelist
            onChange={this.handleWhitelistChange}
            whitelist={video.whitelist}
            visible={this.state.whitelistModal}
            modal
          />
        )}
      </div>
    )
  }

  render () {
    if (!this.context.editing) {
      return (null)
    }
    const PrivacySection = this.renderPrivacySection
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ width: '100%', padding: '10px 20px', flex: '1', color: 'white', overflow: 'auto' }}>
          <Spin tip={(<p style={{ color: 'white' }}>{i18n.t('CutSample.clipCreation')}...</p>)} spinning={this.state.loading}>

            <div className='cut-editor-form'>
              <div className='cut-editor-form-left'>
                <div className='cut-editor-field'>
                  <div>{i18n.t('Common_word.title')}</div>
                  <Input
                    value={this.state.title}
                    placeholder={i18n.t('Common_word.yourTitle')}
                    onChange={(e) => {
                      this.setState({ title: e.target.value })
                    }}
                  />
                </div>
                <div className='cut-editor-field'>
                  <div>{i18n.t('Common_word.description')}</div>
                  <Input.TextArea
                    value={this.state.description}
                    placeholder={'CutSample.cutDescription'}
                    onChange={this.handleChange('description')}
                  />
                </div>
                <div className='cut-editor-form-right'>
                  <div className='cut-editor-field'>
                    <div>{i18n.t('Common_word.themes')}</div>
                    <ThemesPicker onChange={this.handleThemesChange} themes={this.props.tags || this.pickableThemes} selected={this.state.themes}/>
                  </div>
                  <div className='cut-editor-field'>
                    <PrivacySection />
                  </div>
                </div>
              </div>
            </div>
          </Spin>
          <div style={{ width: '100%', padding: '15px 20px', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center' }}>
              <Button type='primary' size='large' onClick={this.deleteCut} style={{ background: '#313a45', border: 'solid 1px #313a45', width: '100px' }}>{i18n.t('Common_word.cancel')}</Button>
              <div style={{ borderRight: 'solid 1px grey', margin: '0 5px', height: '25px' }}/>
              <Button type='primary' size='large' onClick={this.handleSubmit} style={{ background: 'rgba(44, 193, 235, 1)', border: 'solid 1px #2CC1EB' }}>{i18n.t('CutSample.submitButton')}</Button>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
