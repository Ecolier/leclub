import './form.scss'
import pullAllBy from 'lodash/pullAllBy'
import React, { Component } from 'react'
import { Radio, Input, notification, Select, Popover, Spin, Button } from 'antd'
import { ClipContext } from './context'
import ThemesPicker from './themesPicker'
import VideoWhitelist from '../Coach/VideoWhitelist'
import { callApi } from '@/utils/callApi'
import { updateCutV2 } from '@/actions/coach'
import i18n from 'i18n-js'
import '@/i18n.js'

const Option = Select.Option

notification.config({
  placement: 'bottomRight',
})

export default class extends Component {
  componentDidMount () {
    this.setState({
      title: this.props.cut.title,
      description: this.props.cut.about,
      themes: this.props.cut.tags,
      clipPrivacy: this.props.cut.isPublic,
      clipWhitelist: this.props.cut.clipWhitelist,
    })
  }

  static contextType = ClipContext

  state = {
    description: undefined,
    tagsPlayer: [],
    playerListTmp: [],
    isPublic: 'publicCut',
    players: [],
    playerName: '',
    dataSource: null,
    loading: false,
    themes: [],
    title: undefined,
    whitelistModal: false,
    clipPrivacy: (this.props.video && this.props.video.isPublic) || 'public',
    clipWhitelist: (this.props.video && this.props.video.whitelist) || [],
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

  onSubmit = async () => {
    const event = {}

    if (this.state.playerListTmp && this.state.playerListTmp.length !== 0) {
      this.state.playerListTmp.forEach(l => {
        l.players.forEach(p => {
          this.state.tagsPlayer.push(p)
        })
      })
    }
    if (!this.state.title) {
      notification.error({
        message: i18n.t('Common_word.title'),
        description: i18n.t('CutSample.updateClip.titleError'),
      })
      return
    }

    pullAllBy(this.state.tags, [{ status: false }], 'status')
    event.title = this.state.title
    event.about = this.state.description
    event.tags = this.state.themes
    event.videoId = this.props.video._id
    event.matchId = this.props.video.match
    event.whitelist = this.state.clipWhitelist
    event.isPublic = this.state.clipPrivacy
    event.trainingId = this.props.video.training
    event.coachId = this.props.coach._id
    event.cutId = this.props.cut._id
    // this.setState({ loading: true })
    const cut = await updateCutV2(event, this.props.handleUpdateCut)
    this.context.playlist.updateItems([cut])
  }

  handleSelect = (e) => {
    const { players, tagsPlayer } = this.state
    tagsPlayer.push({ name: players[e].completeName, _id: players[e]._id })
    this.setState({ tagsPlayer, playerName: '' })
  }

  triggerChange = () => {
    this.handleSearch(this.state.playerName)
  }

  handleSearch = (value) => {
    const id = this.props.coach._id
    callApi(`service/searchUser/${id}?page=${0}&name=${value}&team=${this.props.video.teams[0].team._id}`, 'get').then(body => {
      const data = []
      body.users.forEach((e, key) => {
        data.push(<Option key={key} style={{ margin: '15px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}><p>{`${e.completeName}`}</p></Option>)
      })
      this.setState({
        playerName: value,
        dataSource: data,
        players: body.users,
      })
    }).catch((e) => { return e })
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
    const PrivacySection = this.renderPrivacySection
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ width: '100%', padding: '10px 20px', flex: '1', color: 'white', overflow: 'auto' }}>
          <Spin tip={(<p style={{ color: 'white' }}>{i18n.t('CutSample.updateClip.savingChanges')}...</p>)} spinning={this.state.loading}>
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
                    placeholder={i18n.t('CutSample.cutDescription')}
                    onChange={this.handleChange('description')}
                  />
                </div>
                <div className='cut-editor-form-right'>
                  <div className='cut-editor-field'>
                    <div>{i18n.t('Common_word.theme')}</div>
                    <ThemesPicker onChange={this.handleThemesChange} themes={this.props.pickableTags} selected={this.state.themes}/>
                  </div>
                  <div className='cut-editor-field'>
                    <PrivacySection />
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
        <div style={{ height: '100px', width: '100%', padding: '15px 20px', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', height: '60px', display: 'flex', alignItems: 'center' }}>
            <Popover content={i18n.t('CutSample.updateClip.cancelChanges')}>
              <Button type='primary' className={'cut-btn-bottom'} onClick={() => this.props.handleUpdateCut(false)} style={{ background: '#313a45', border: 'solid 1px #313a45', width: '100px' }}>{i18n.t('Common_word.cancel')}</Button>
            </Popover>
            <div style={{ borderRight: 'solid 1px grey', margin: '0 5px', height: '25px' }}/>
            <Popover content={(<p>{i18n.t('CutSample.updateClip.saveChanges')}</p>)}>
              <Button type='primary' className={'cut-btn-bottom cut-btn-bottom-valide'} onClick={() => { !this.props.test ? this.onSubmit() : this.saveCut(this.props.drawings || null, null, this.props.resetDrawings) }} style={{ width: '100%', background: 'rgba(44, 193, 235, 1)', border: 'solid 1px #2CC1EB' }}>{i18n.t('Common_word.save')}</Button>
            </Popover>
          </div>
        </div>

      </div>
    )
  }
}
