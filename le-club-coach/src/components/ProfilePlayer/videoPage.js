import React, { Component } from 'react'
import VideoPlayer from '@/components/Player/playlistVideos'
import { Icon } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

import 'moment/locale/fr'
import moment from 'moment'

moment.locale('fr')
import './style.scss'

class videoPage extends Component {

  componentDidMount () {
    this.setState({ keyPlayer: this.props.selectedMatch.video.teams[0].players.findIndex(player => player._id === this.props.user._id) })
    if (this.props.selectedMatch && this.props.selectedMatch.video && (this.props.selectedMatch.video.url === '' || this.props.selectedMatch.video.url === undefined) && this.props.goBack) {
      this.props.goBack()
    }
  }

  state = {
    keyPlayer: null,
  }

  render () {

    const { user, selectedMatch } = this.props
    const { keyPlayer } = this.state

    return (
      <div style={{ width: '100%' }}>
        <div className='background-image' style={{ height: '100%', background: '#212020', zIndex: '-1', marginTop: '-50px' }}/>
        <h1 style={{ fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center', marginTop: '50px' }}>{i18n.t('Mediateque.Search.videoSearch')}</h1>
        <div style={{ width: '100%', margin: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px 50px', color: '#eeeeef' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1rem', color: '#817976' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Icon type='clock-circle-o' style={{ marginLeft: '20px', marginRight: '10px', color: '#2CC1EB' }} />
              <p style={{ letterSpacing: '1.5px', color: '#2CC1EB' }}>
                {moment(selectedMatch.video.matchDate).format('LL')}</p>
            </div>
            <p style={{ letterSpacing: '1.5px', color: '#2CC1EB', textAlign: 'center' }}>{i18n.t('Common_word.league')}, {selectedMatch.opponentTeamId.league}</p>
          </div>
        </div>

        <div style={{ width: '100%', marginTop: '15px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', fontSize: '1rem', height: '80px' }}>
          <p style={{ width: '125px', textAlign: 'center' }}>{user.club.name || i18n.t('Common_word.unknown') }</p>
          <p style={{ width: '125px', backgroundColor: '#2CC1EB', fontSize: '2rem', textAlign: 'center', borderRadius: '15%', boxShadow: 'rgba(0, 0, 0, 0.2) -1px 1px 11px 8px' }}>{`${selectedMatch.video && selectedMatch.video.teams.length > 1 ? selectedMatch.video.teams[0].score : '0'}-${selectedMatch.video && selectedMatch.video.teams.length > 1 ? selectedMatch.video.teams[1].score : '0'}`}</p>
          <p style={{ width: '125px', textAlign: 'center' }}>{selectedMatch.opponentClubId.name || i18n.t('Common_word.unknown') }</p>
        </div>
        <div style={{ padding: '20px', background: '#eeeeef' }}>
          {selectedMatch.video.url !== '' ? (

            <VideoPlayer
              playerStyle={{ width: '100%', maxWidth: '1500px', margin: 'auto' }}
              toolbar
              titleOff
              url={selectedMatch.video.url}
              video={selectedMatch.video}
              propsId={'video-1'}
              drawings={selectedMatch.video.drawings || []}
            />
          ) : (
            <h3 style={{ textAlign: 'center', color: '#EA178C' }}>{i18n.t('PlayerProfile.video.coachPrivate')}</h3>
          )}

        </div>
        { keyPlayer !== null && keyPlayer !== -1 ? (
          <div style={{ padding: '30px' }}>
            <div style={{ maxWidth: '1500px', margin: 'auto', display: 'flex', flexDirection: 'column', width: '100%', flex: 1, background: '#eeeeef', borderRadius: '10px', boxShadow: '0 1px 40px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset' }}>
              <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '1.5rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className='fas fa-shield-alt' style={{ fontSize: '2rem' }}/>
                  <div style={{ fontSize: '2.5rem', marginLeft: '20px' }}>{i18n.t('Common_word.team')}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.5vw' }}>{user.team.name}</div>
                </div>
              </div>
              <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '1.5rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className='fas fa-map-marker-alt' style={{ fontSize: '2rem' }}/>
                  <div style={{ fontSize: '2.5rem', marginLeft: '20px' }}>{i18n.t('Common_word.position')}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.5vw' }}>{this.props.selectedMatch.video.teams[0].players[keyPlayer].position || i18n.t('PlayerProfile.noPosition')}</div>
                </div>
              </div>
              <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '1.5rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className='fas fa-tshirt' style={{ fontSize: '2rem' }}/>
                  <div style={{ fontSize: '2.5rem', marginLeft: '20px' }}>{i18n.t('Common_word.number')}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{this.props.selectedMatch.video.teams[0].players[keyPlayer].number || i18n.t('PlayerProfile.noNumber')}</div>
                </div>
              </div>
              <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '1.5rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className='fas fa-futbol' style={{ fontSize: '2rem' }}/>
                  <div style={{ fontSize: '2.5rem', marginLeft: '20px' }}>{i18n.t('Common_word.goal')}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{this.props.selectedMatch.video.teams[0].players[keyPlayer].buts}</div>
                </div>
              </div>
              <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '1.5rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i className='fas fa-hands-helping' style={{ fontSize: '2rem' }}/>
                  <div style={{ fontSize: '2.5rem', marginLeft: '20px' }}>{i18n.t('Common_word.assists')}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{this.props.selectedMatch.video.teams[0].players[keyPlayer].passesD}</div>
                </div>
              </div>
            </div>
          </div>
        ) : <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginTop: '50px' }}>{i18n.t('PlayerProfile.noFormation')}</h2> }
      </div>
    )
  }
}

export default videoPage
