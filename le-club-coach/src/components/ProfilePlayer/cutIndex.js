import React, { Component } from 'react'
import { callApi } from '@/utils/callApi'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import VideoPlayer from '@/components/Player/playlistVideos'
import { Tag, notification } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

import './style.scss'

const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

const mapStateToProps = state => {
  return {
    state,
    coach: state.coach.toJS(),
  }
}

class CutIndex extends Component {
  componentDidMount () {
    callApi(`user/getCut/${this.props.coach._id}?userId=${this.props.user._id}&cutId=${this.props.cutId}`, 'get').then(res => {
      this.setState({ cut: res.cut })
      return null
    }).catch(err => {
      notification.error({ message: i18n.t('Common_word.error'), description: err })
      this.props.dispatch(push('/coach'))
    })
  }

  state = {
    visible: false,
    selectedMatch: null,
    videoDisponible: false,
    playerId: this.props.location && this.props.location.pathname ? this.props.location.pathname.split('/')[3] : '',
  }

  render () {

    const { cut } = this.state
    return (
      <div>
        {cut && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1>{cut.title}</h1>
            <VideoPlayer
              playerStyle={{ width: '80%' }}
              shareOff
              titleOff
              toolbar
              poster={cut.poster}
              url={cut.url}
              propsId={'video-1'}
              drawings={cut.drawings || []}
            />
            <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
              <h2>{i18n.t('Common_word.commentary')}:</h2>
              <h3>{cut.about}</h3>
              <div style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
                <h3>{i18n.t('Common_word.tags')}:</h3>
                {cut.tags && cut.tags.length !== 0 && (
                  cut.tags.map((e, key) => {
                    return (<Tag
                      color={e.color}
                      style={{ padding: '3px', height: 'auto', width: 'auto', fontSize: '1.5rem' }}
                      key={key} checked={e.status}>{e.name}</Tag>)
                  })
                )}
              </div>
              <div style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
                <h3>{i18n.t('Common_word.players')}:</h3>

                {cut.users && cut.users.length !== 0 && (
                  cut.users.map((e, key) => {
                    return (
                      <Tag
                        style={{ padding: '10px', height: 'auto', width: 'auto', fontSize: '1rem' }}
                        key={key} onClose={() => {
                          const users = cut.users
                          users.splice(key, 1)
                          this.setState({ users })
                        }}>{e.name || e.completeName}</Tag>)
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connectStoreon(mapStateToProps, mapDispatchToProps)(CutIndex)
