import React from 'react'
import moment from 'moment'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Card, Tooltip, Icon } from 'antd'
import { UPLOAD_STATE } from '@/actions/upload'
import { UploadModalButton } from '../../Coach/Upload/modal'
import TranscodingStatus from '../Upload/status'
import MatchTypeIcon from '../MatchType'
import i18n from 'i18n-js'
import '@/i18n'
import './match_card.scss'

moment.locale('fr')

class MatchCard extends React.PureComponent {

  homeLogo = () => {
    return this.props.match.clubHome.urlLogo
  }

  awayLogo = () => {
    return this.props.match.clubAway.urlLogo
  }

  isUpcoming = () => {
    return moment().unix() < moment(this.props.match.date).unix()
  }

  renderResult = () => {
    const { match, team } = this.props

    if (this.isUpcoming()) {
      return <span style={{ textTransform: 'uppercase' }}>{i18n.t('Common_word.incoming')}</span>
    }

    const awayScore = match.scoreAway.score
    const homeScore = match.scoreHome.score

    const isHome = team === match.teamHome._id

    const draw = awayScore === homeScore
    const win = isHome ? homeScore > awayScore : homeScore < awayScore

    if (draw) {
      return <span style={{ textTransform: 'uppercase' }}>{i18n.t('Common_word.draw')}</span>
    }

    if (win) {
      return <span style={{ color: 'green', textTransform: 'uppercase' }}>{i18n.t('Common_word.victory')}</span>
    }

    return <span style={{ color: 'red', textTransform: 'uppercase' }}>{i18n.t('Common_word.defeat')}</span>
  }

  renderDate = () => {
    const { date } = this.props.match
    return <span style={{ fontSize: 12 }}>{ moment(date).format('dddd DD MMMM YYYY') }</span>
  }

  openVideo = (video) => {
    this.props.dispatch(router.navigate, `/coach/edit/match/${video._id}`)
  }

  isUploading = () => {
    const upload = this.props.match.upload
    return upload !== undefined && upload.state !== UPLOAD_STATE.COMPLETED
  }

  openMatchSheet = () => {
    this.props.dispatch(router.navigate, `/coach/match/${this.props.match.season}/${this.props.match._id}`)
  }

  openPresequencage = () => {
    this.props.dispatch(router.navigate, `/coach/presequencage/${this.props.match.season}/${this.props.match._id}`)
  }

  getVideo = () => {
    const { match, team } = this.props
    const isHome = team === match.teamHome._id
    return isHome ? match.videoHome : match.videoAway
  }

  renderActionsBar = () => {
    const video = this.getVideo()
    const upload = this.props.match.upload
    const mobile = this.props.mobile
    const isWhitelisted = video && (video.isPublic === 'public' || video?.whitelist.indexOf(this.props.coach._id) !== -1)

    return [
      video && isWhitelisted && (
        <Tooltip title={i18n.t('MatchCard.editing_title')}>
          <div onClick={() => this.openVideo(video)}>
            <Icon type='play-circle' style={{ color: '#EA178C' }}/>
            <div style={{ color: '#EA178C' }}>{i18n.t('Common_word.editing')}</div>
          </div>
        </Tooltip>
      ),

      !video && !upload && (
        <Tooltip title={i18n.t('Common_word.add_video')}>
          <UploadModalButton noButton match={this.props.match}>
            <Icon type='plus' style={{ color: '#EA178C' }}/>
            <div style={{ color: '#EA178C' }}>{i18n.t('Common_word.add_video')}</div>
          </UploadModalButton>
        </Tooltip>
      ),

      <Tooltip title={i18n.t('MatchCard.match_sheet')}>
        <div onClick={this.openMatchSheet}>
          <Icon type='profile' style={{ color: '#EA178C' }} />
          <div style={{ color: '#EA178C' }}>{i18n.t('MatchCard.match_sheet')}</div>
        </div>
      </Tooltip>,
      mobile.isOnMobile
        && <Tooltip title={i18n.t('Common_word.presequencage')}>
          <div onClick={this.openPresequencage}>
            <Icon type='scissor' style={{ color: '#EA178C' }}/>
            <div style={{ color: '#EA178C' }}>{i18n.t('Common_word.presequencage')}</div>
          </div>
        </Tooltip>,
    ].filter(v => !!v)
  }

  renderFloatingLeftBar = () => {
    const upload = this.props.match.upload
    const video = this.getVideo()
    return (
      <div className={'match_floating_left_bar_container'}>
        {upload && (<TranscodingStatus upload={upload} />)}
        {video && (
          <Tooltip title={i18n.t('Common_word.filmed_match')}>
            <Icon type='video-camera' style={{
              backgroundColor: '#EA178C',
              color: 'white',
              padding: 10,
              borderRadius: 25,
            }} />
          </Tooltip>
        )}
      </div>
    )
  }

  renderFloatingType = () => {
    return (
      <div className={'match_card_floating_type'}>
        <MatchTypeIcon match={this.props.match} />
      </div>
    )
  }

  renderTeam = ({ club }) => {
    return (
      <div className={'match_card_team'}>
        <Tooltip title={club ? club.name : ''}>
          <img src={club ? club.urlLogo : ''} height='64px' style={{ objectFit: 'cover', maxWidth: '120px' }}/>
        </Tooltip>
      </div>
    )
  }

  renderScore = () => {
    const scoreHome = this.props.match.scoreHome.score
    const scoreAway = this.props.match.scoreAway.score
    return (
      <div className={'match_card_score'}>
        <span>{scoreHome}</span>
        <span>-</span>
        <span>{scoreAway}</span>
      </div>
    )
  }

  render () {
    const FloatingLeftBar = this.renderFloatingLeftBar
    const FloatingMatchType = this.renderFloatingType

    const MatchTeam = this.renderTeam
    const MatchScore = this.renderScore
    const MatchResult = this.renderResult
    const MatchDate = this.renderDate

    return (
      <React.Fragment>
        <Card actions={this.renderActionsBar()} className={'match_card'}>
          <FloatingLeftBar />
          <FloatingMatchType />
          <div className={'match_card_teams_container'}>
            <MatchTeam club={this.props.match.clubHome} />
            <MatchScore />
            <MatchTeam club={this.props.match.clubAway} />
          </div>
          <div className={'match_card_info'}>
            <div><MatchResult /></div>
            <div><MatchDate /></div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default initialProps => {
  const { dispatch, coach, mobile } = useStoreon('coach', 'mobile')
  return React.createElement(MatchCard, {
    ...initialProps,
    dispatch,
    coach,
    mobile,
  })
}
