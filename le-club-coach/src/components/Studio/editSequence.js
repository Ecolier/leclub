import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Collapse, Button, Form, Input, Tag, Checkbox, AutoComplete, Select, Spin, Menu, Dropdown, Icon, notification } from 'antd'
import { callApi } from '@/utils/callApi'

import 'moment/locale/fr'
import moment from 'moment'

moment.locale('fr')

import VideoPlayer from '@/components/Player/playlistVideos'

import { updateCut } from '@/actions/coach'
import pullAllBy from 'lodash/pullAllBy'
import { deleteDrawing } from '@/actions/coach.js'

import i18n from 'i18n-js'
import '@/i18n'

const { CheckableTag } = Tag

const Panel = Collapse.Panel
const WAIT_INTERVAL = 700

const Option = Select.Option

class EditSequence extends Component {

  componentDidMount () {
    if (this.props.tags && this.props.tags.length !== 0) {
      const tmpTags = this.props.tags
      this.props.tags.forEach((t, key) => { tmpTags[key].status = t.status })
      this.setState({ tags: tmpTags })
    } else {
      this.setState({ tags: this.props.coach.prefStudio && this.props.coach.prefStudio.tags ? this.props.coach.prefStudio.tags : [] })
    }
  }

  state = {
    tagsPlayer: this.props.tagsPlayer || [],
    tags: this.props.currentCut ? this.props.currentCut.tags : [],
    tag: '',
    list: [],
    isPublic: this.props.isPublic === 'true' ? 'publicCut' : 'privateCut',
    players: this.props.currentCut ? this.props.currentCut.players : [],
    playerName: '',
    dataSource: null,
    title: this.props.currentCut ? this.props.currentCut.title : '',
    about: this.props.currentCut ? this.props.currentCut.about : '',
  }

  onSubmit = e => {
    e.preventDefault()
    const event = {}
    const whitelist = []

    if (this.state.isPublic === 'privateCut') {
      // this.props.coach.club.coachs.forEach(c => { whitelist.push(c) })
      this.state.list.forEach(c => { whitelist.push(c) })
      whitelist.push(this.props.coach.club._id)
    }

    if (!this.state.title) {
      notification.error({
        message: i18n.t('Common_word.title'),
        description: i18n.t('CutSample.updateClip.titleError'),
      })
      return
    }

    if (!this.state.about) {
      notification.error({
        message: i18n.t('Common_word.commentary'),
        description: i18n.t('CutSample.updateClip.commentaryError'),
      })
      return
    }

    pullAllBy(this.state.tags, [{ status: false }], 'status')
    event.title = this.state.title
    event.about = this.state.about
    event.whitelist = whitelist
    event.isPublic = this.state.isPublic !== 'privateCut'
    event.tags = this.state.tags
    event.users = this.state.tagsPlayer
    event.cutId = this.props.cutId
    updateCut(this.props.coach._id, event)
    this.props.closeModal()
  }

  handleSearch = (value) => {
    const id = this.props.coach._id
    callApi(`service/searchUser/${id}?page=${0}&name=${value}&team=${this.props.teamId || ''}`, 'get').then(body => {
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
  handleSelect = (e) => {
    const { players, tagsPlayer } = this.state
    tagsPlayer.push({ name: players[e].completeName, _id: players[e]._id })
    this.setState({ tagsPlayer, playerName: '' })

  }
  handleChange = (e) => {
    clearTimeout(this.timer)
    this.setState({ playerName: e })
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL)
  }

  triggerChange = () => { this.handleSearch(this.state.playerName) }
  updateList = (checked, id) => {
    const newList = this.state.list
    if (checked) {
      newList.push(id)
      this.setState({ list: newList })
    } else {
      const index = newList.findIndex(i => i.toString() === id.toString())
      if (index !== -1) {
        newList.splice(index, 1)
        this.setState({ list: newList })
      }
    }
  }
  changeTagStatus = (key) => {
    const tags = this.state.tags
    tags[key].status = !tags[key].status
    this.setState({ tags })
  }
  deleteDrawingFunc = (name) => {
    deleteDrawing(this.props.coach._id, name, 'cut', this.props.currentCut._id)
  }

  render () {

    const { videoUrl, currentCut } = this.props

    return (
      <div style={{ width: '100%', height: '70vh', overflow: 'auto' }}>
        <Spin spinning={false}>
          <h3>{`${i18n.t('CutSample.updateClip.editAt')} ${moment.duration(this.props.timeOfCut, 'minutes').format('h:mm')} ${i18n.t('CutSample.updateClip.ofTheVideo')}`}</h3>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

            <VideoPlayer
              playerStyle={{ width: '60vw' }}
              nbrVideoPlayer={1}
              propsId={'video-2'}
              shareOff
              titleOff
              toolbar
              drawings={currentCut.drawings}
              poster={this.props.poster}
              url={videoUrl} />
          </div>
          <Form title='EditSequence' onSubmit={this.onSubmit} onKeyPress={e => { if (e.key === 'Enter') e.preventDefault() }} >

            <div style={{ display: 'flex', flexDirection: 'row' }}>

              <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                <h4 style={{ marginBottom: '0px' }}>{i18n.t('Common_word.title')}: </h4>
                <Input value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} name='title' placeholder={i18n.t('Common_word.title')} label={i18n.t('Common_word.title')} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: '1', marginLeft: '10px' }}>
                <h4 style={{ marginBottom: '0px' }}>{i18n.t('Common_word.tags')}: </h4>
                <div style={{ marginTop: '15px' }}>
                  {this.state.tags && this.state.tags.length !== 0 ? (
                    this.state.tags.map((e, key) => {
                      return (<CheckableTag
                        style={{ fontSize: '1rem', color: e.color, borderRadius: '10px' }}
                        key={key} checked={e.status} onChange={() => { this.changeTagStatus(key) }}>{e.name}</CheckableTag>)
                    })
                  ) : (<p>{i18n.t('CutSample.updateClip.noTags')}</p>)}
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', flexDirection: 'row', height: '30vh' }}>

              <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
                <h4 style={{ marginBottom: '0px' }}>{i18n.t('Common_word.commentary')}:</h4>
                <Input.TextArea value={this.state.about} onChange={(e) => { this.setState({ about: e.target.value }) }} name='about' placeholder={i18n.t('Common_word.commentary')} label={i18n.t('Common_word.commentary')} />
                <h4>{i18n.t('CutSample.updateClip.tagPlayers')}:</h4>
                <AutoComplete
                  style={{ width: '100%', borderRadius: '10px' }}
                  dataSource={this.state.dataSource}
                  onSelect={(e, a) => { this.handleSelect(e) }}
                  onSearch={this.handleChange}
                  placeholder={i18n.t('Sider.CoachPageTitle.all')}
                  value={this.state.playerName}
                />
                <div style={{ padding: '15px', height: '15vh', overflow: 'auto' }}>
                  {this.state.tagsPlayer && this.state.tagsPlayer.length !== 0 && (
                    this.state.tagsPlayer.map((e, key) => {
                      return (
                        <Tag key={key} closable visible onClose={() => {
                          const tagsPlayer = this.state.tagsPlayer
                          tagsPlayer.splice(key, 1)
                          this.setState({ tagsPlayer })
                        }}>{e.name || e.completeName}</Tag>)
                    })
                  )}

                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: '1', marginLeft: '10px' }}>

                <h4>{i18n.t('CutSample.updateClip.tagList')}:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', height: '30vh', overflow: 'auto', padding: '5px' }}>
                  {this.props.coach && this.props.coach.prefStudio && this.props.coach.prefStudio.playerList && (
                    this.props.coach.prefStudio.playerList.map((t, key) => {
                      return (
                        <Collapse style={{ width: '80%' }} key={key}>
                          <Panel header={<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><p>{t.name}</p>
                            <Checkbox size='large' style={{ marginRight: '10px' }}
                              onChange={(e) => {
                                const playerListTmp = this.state.tags
                                if (e.target.checked) {
                                  playerListTmp.push(t)
                                } else {
                                  const index = playerListTmp.findIndex(p => p.name === t.name)
                                  playerListTmp.splice(index, 1)
                                }
                                this.setState({ playerListTmp })

                              }} />
                          </div>} key='1'>
                            {t.players && (t.players.map((p, key) => { return (<p key={key}>{p.name}</p>) }))}
                          </Panel>
                        </Collapse>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '80vw' }}>
              { currentCut.drawings && currentCut.drawings.length !== 0 && (
                currentCut.drawings.map((e, key) => {
                  return (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', paddingBottom: '10px', alignItems: 'center' }}>

                      <img src={e.url || 'https://d1ceovtllg6jml.cloudfront.net/logo_ok.png'} style={{ width: '12vw', height: '10vh' }} />

                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                          <p style={{ fontSize: '1rem' }}>{`${i18n.t('CutSample.updateClip.showAt')}: ${moment.duration(e.start, 'minutes').format('h:mm')} ${e.start < 60 ? 'secondes' : 'minutes'}`}</p>
                          <p style={{ fontSize: '0.7rem' }}>{`${moment(e.createdAt).format('DD/MM/YYYY')}`}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                          <p style={{ fontSize: '1rem' }}>{`${i18n.t('CutSample.updateClip.forDuration')} : ${moment.duration(e.duration, 'minutes').format('h:mm')} ${i18n.t('Common_word.secondes')}`}</p>
                          <Dropdown overlay={
                            <Menu>
                              <Menu.Item>
                                <Button style={{ borderRadius: '10px' }} type='danger' onClick={() => { this.deleteDrawingFunc(e.name) }}>{i18n.t('Common_word.delete')}</Button>
                              </Menu.Item>
                            </Menu>
                          }>
                            <Icon type='bars' style={{ fontSize: '20px' }} />
                          </Dropdown>
                        </div>
                      </div>

                    </div>
                  )
                })
              )}
            </div>
            <Button style={{ marginTop: '20px' }} type='primary' htmlType='submit'>{i18n.t('Common_word.update')}</Button>
          </Form>
        </Spin>
      </div>
    )
  }
}

export default initialProps => {
  const { coach } = useStoreon('coach')
  return React.createElement(EditSequence, {
    ...initialProps,
    coach,
  })
}
