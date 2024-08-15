import React, { Component } from 'react'
import { Avatar, Icon, Select, Divider } from 'antd'
import { callApi } from '@/utils/callApi'
import Stats from '@/components/ProfilePlayer/stats'
import GalleryVideos from '@/components/ProfilePlayer/galleryVideos'
import { useStoreon } from 'storeon/react'
import 'moment/locale/fr'
import moment from 'moment'
import i18n from 'i18n-js'
import '@/i18n.js'

moment.locale('fr')

import './style.scss'

const { Option } = Select

class PublicUser extends Component {

  async componentDidMount () {
    const name = this.props.playerId
    window.scrollTo(0, 0)
    await this.callUser(name)
  }

  state = {
    seasons: [],
    selectedSeason: this.props.globalSelectedSeason,
    user: {},
    videos: [],
    cuts: [],
    trainings: [],
  }

  callUser = async (name) => {
    try {
      this.setState({ id: name })
      const body = await callApi(`${this.props.coach._id}/user/${name}`, 'get')
      this.setState({ seasons: body.seasons, user: body.user, videos: body.videos, cuts: body.cuts, trainings: body.trainings })
    } catch (err) {
      // TODO: No stats
      // this.props.dispatch(push('/home'))
    }
  }

  handleSeasonSelect = (selectedSeason) => {
    this.setState({ selectedSeason })
  }

  renderSeasonPicker = () => {
    const { seasons } = this.state
    const selectedSeason = seasons.find(s => s.season === this.state.selectedSeason) || seasons[0]
    return (
      <div>
        <span style={{ marginRight: 10, fontWeight: 'bold', fontSize: 16 }}>Saison</span>
        <Select defaultValue={selectedSeason.season} dropdownMatchSelectWidth={false} onSelect={this.handleSeasonSelect}>
          {seasons.map(s => (
            <Option key={s.season} value={s.season}>{s.season}</Option>
          ))}
        </Select>
      </div>
    )
  }

  renderSection = (props) => {
    return (
      <div className={'player_stats_container'}>
        <h1 style={{ fontSize: 24, textTransform: 'uppercase', textAlign: 'center', fontWeight: 'bold' }}>{ props.title }</h1>
        <Divider />
        <React.Fragment>{ props.children }</React.Fragment>
      </div>
    )
  }

  render () {
    const SeasonPicker = this.renderSeasonPicker
    const Section = this.renderSection

    const { user, seasons, videos, cuts, trainings } = this.state
    const selectedSeason = seasons.find(s => s.season === this.state.selectedSeason) || seasons[0]

    if (!selectedSeason) {
      return null
    }

    return (
      <div>
        <div style={{ backgroundImage: `url(${selectedSeason.club ? selectedSeason.club.urlLogo : 'https://d1ceovtllg6jml.cloudfront.net/MG_1971-1.jpg'})`, backgroundPosition: 'center', backgroundSize: user.club && user.club.urlCover ? 'cover' : '300px', backgroundRepeat: 'no-repeat', height: '200px' }} className='imgBackClub'/>
        <div className={'player_infos_container'}>
          <div className={'player_infos_content'}>
            <Avatar className={'player_infos_avatar'} shape='square' size='large' icon='user' src={user.picture || 'https://d1ceovtllg6jml.cloudfront.net/defaultprofile.svg'} />
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '25px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '5px' }}>
                <h2 style={{ color: '#ffffff', margin: '0px' }}>{user.completeName}</h2>
                <div className='title-separateur-white' />
                <Icon style={{ color: '#ffffff', marginRight: '5px' }} type='environment-o' />
                <p style={{ color: '#ffffff' }}>{selectedSeason.club ? selectedSeason.club.name : ''}</p>
              </div>
              <div className={'player_infos_personal'}>
                <h3 style={{ alignSelf: 'flex-start', marginTop: '20px', fontWeight: 'bold', color: '#373737' }}>{`${i18n.t('Common_word.born')}: ${moment(user && user.birthdate).format('DD/MM/YYYY') || ''}`}</h3>
                <h3 style={{ alignSelf: 'flex-start', marginTop: '20px', fontWeight: 'bold', color: '#373737' }}>{`${i18n.t('Common_word.position')}: ${selectedSeason.whichSide ? selectedSeason.whichSide : i18n.t('Common_word.notRegister')}`}</h3>
              </div>
              <hr style={{ width: '100%', marginBottom: '20px' }}/>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 20 }}>
          <SeasonPicker />
        </div>
        <Section title={i18n.t('Common_word.statistics')}>
          <Stats season={selectedSeason} />
        </Section>
        <Section title={i18n.t('Header.BrowseNavigation.videos')}>
          <GalleryVideos user={user} videos={videos} type='video' playerId={this.props.playerId} />
        </Section>
        <Section title={i18n.t('Header.ProductNavigation.clips')}>
          <GalleryVideos user={user} videos={cuts} type='cut' playerId={this.props.playerId} />
        </Section>
        <Section title={i18n.t('Sider.CoachPageTitle.training')}>
          <GalleryVideos user={user} videos={trainings} type='training' playerId={this.props.playerId} />
        </Section>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')
  const props = {
    ...initialProps,
    dispatch,
    coach,
    globalSelectedSeason: coachSeason.currentSeason.season,
  }
  return <PublicUser {...props} />
}
