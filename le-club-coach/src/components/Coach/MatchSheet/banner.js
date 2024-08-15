import './banner.scss'
import React from 'react'
import moment from 'moment'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Button, Popconfirm, Popover, notification, Modal, Icon } from 'antd'
import { UploadModalButton } from '../../Coach/Upload/modal'
import UploadStatus from '../Upload/status'
import { setMatchVideo } from '@/actions/matches'
import { callApi } from '@/utils/callApi'
import AskWhitelistButton from '../VideoWhitelist/askButton'
import i18n from 'i18n-js'
import '@/i18n'

class MatchBanner extends React.PureComponent {

  state = {
    settingsOpened: false,
    allRemove: false,
  }

  openSequencage = (video) => {
    this.props.dispatch(router.navigate, `/coach/edit/match/${video._id}`)
  }

  getVideo = () => {
    const { match } = this.props
    const isHome = match.teamHome._id === this.props.currentTeam
    return isHome ? match.videoHome : match.videoAway
  }

  deleteVideo = (allVideo) => {
    const coachId = this.props.coach._id
    const match = { ...this.props.match }
    const isHome = match.teamHome._id === this.props.currentTeam
    const video = isHome ? match.videoHome : match.videoAway

    callApi(`${coachId}/video/${video._id}?allRemove=${allVideo ? 'true' : 'false'}`, 'delete').then(() => {
      setMatchVideo({
        matchId: match._id,
        videoHome: undefined,
        videoAway: undefined,
        allRemove: false,
      })
    }).catch(err => {
      notification.error({
        message: err,
      })
    })
    this.setState({ allRemove: false })
  }

  renderDeleteVideoButton = () => {
    const title = (
      <React.Fragment>
        <div>{i18n.t('Sheets.video_management.match_video_delete.title')}</div>
        <div style={{ color: 'red', fontWeight: 'bold' }}>{i18n.t('Subscribe.warning_message')}</div>
      </React.Fragment>
    )
    return (
      <Popconfirm placement='bottom' onConfirm={() => { this.setState({ allRemove: true }) }} okText={i18n.t('Common_word.yes')} cancelText={i18n.t('Common_word.no')} title={title}>
        <Button icon='delete' type='danger' style={{ margin: '5px 0' }}>{i18n.t('Sheets.video_management.delete_video')}</Button>
      </Popconfirm>
    )
  }

  renderVideoButton = () => {
    const video = this.getVideo()
    const upload = this.props.match.upload
    const isUploading = upload && !UploadStatus.isCompleted(upload)
    const buttonProps = {
      icon: !video ? 'plus' : 'video-camera',
      type: 'primary',
    }
    if (!video) {
      if (isUploading) {
        return <UploadStatus upload={upload} />
      }
      return (
        <UploadModalButton button={buttonProps} match={this.props.match}>{i18n.t('Common_word.add_video')}</UploadModalButton>
      )
    }

    const isVideoAuthor = video.coach === this.props.coach._id
    const isWhitelisted = video.isPublic === 'public' || video?.whitelist.indexOf(this.props.coach._id) !== -1

    if (!isWhitelisted) {
      return (
        <AskWhitelistButton video={video}>
          {i18n.t('Sheets.video_management.ask_video_access')}
        </AskWhitelistButton>
      )
    }

    const DeleteVideoButton = this.renderDeleteVideoButton
    return (
      <React.Fragment>
        <Button {...buttonProps} onClick={() => this.openSequencage(video)}>{i18n.t('Common_word.edit_video')}</Button>
        {isVideoAuthor && (
          <DeleteVideoButton />
        )}
      </React.Fragment>
    )
  }

  renderShareButton = () => {
    const popoverProps = {
      trigger: 'hover',
      placement: 'bottom',
      title: null,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button style={{ margin: '5px 0' }}>{i18n.t('Common_word.send_to_coach')}</Button>
          <Button style={{ margin: '5px 0' }}>{i18n.t('Common_word.send_to_player')}</Button>
          <Button style={{ margin: '5px 0' }}>{i18n.t('Common_word.send_to_technical_director')}</Button>
        </div>
      ),
    }
    return (
      <Popover {...popoverProps}>
        <Button icon='share-alt'>Partage</Button>
      </Popover>
    )
  }

  renderVideoAction = () => {
    const VideoButton = this.renderVideoButton
    // const ShareButton = this.renderShareButton
    return (
      <React.Fragment>
        <VideoButton />
        {/* <ShareButton />*/}
      </React.Fragment>
    )
  }

  isUpcoming = () => {
    return moment().unix() < moment(this.props.match.date).unix()
  }

  modalFooter = () => {
    return (
      <div style={{ width: '100%', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Button type='default' onClick={this.closeModal}>
            <Icon type='arrow-left' style={{ marginRight: '5px' }}/>
              Annuler
          </Button>
        </div>
        <div>
          <Button type='default' onClick={() => { this.deleteVideo(false) }}>{i18n.t('Common_word.yes')}</Button>
          <Button type='primary' onClick={() => { this.deleteVideo(true) }}>{i18n.t('Common_word.no')}</Button>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.setState({
      allRemove: false,
    })
  }

  render () {
    const { match } = this.props
    const upcoming = this.isUpcoming()

    const VideoActions = this.renderVideoAction

    return (
      <div className='b-match-banner'>
        <div className='b-match-banner-season'>{i18n.t('Common_word.season')} {match.season}</div>
        <div className='b-match-banner-date'>{moment(match.date).format('LLL')}</div>
        <div className='b-match-banner-teams'>
          <div className='b-match-banner-team'>
            <div className='b-match-banner-team-name'>{match.clubHome ? match.clubHome.name : ''}</div>
            <div className='b-match-banner-team-logo' style={{ backgroundImage: `url(${match.clubHome ? match.clubHome.urlLogo : ''})` }} />
          </div>
          <div className='b-match-banner-team-separator'>
            <div className='b-match-banner-team-score'>{!upcoming && match.scoreHome.score}</div>
            -
            <div className='b-match-banner-team-score'>{!upcoming && match.scoreAway.score}</div>
          </div>
          <div className='b-match-banner-team'>
            <div className='b-match-banner-team-name'>{match.clubAway ? match.clubAway.name : ''}</div>
            <div className='b-match-banner-team-logo' style={{ backgroundImage: `url(${match.clubAway ? match.clubAway.urlLogo : ''})` }} />
          </div>
        </div>
        <div className='b-match-banner-actions'>
          <VideoActions />
        </div>
        <Modal
          visible={this.state.allRemove}
          onOk={() => { this.deleteVideo(true) }}
          onCancel={this.closeModal}
          footer={this.modalFooter()}
          closable
          maskClosable
        >
          <h2 style={{ fontSize: '1.3rem' }}><Icon type='question-circle' style={{ marginRight: '10px', color: '#faad14' }}/>{i18n.t('Sheets.video_management.delete_related_files.title')}</h2>
          <p>{i18n.t('Sheets.video_management.delete_related_files.disclaimer')}</p>
          <b>{i18n.t('Subscribe.warning_message')}</b>
        </Modal>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')
  return React.createElement(MatchBanner, {
    ...initialProps,
    dispatch,
    coach,
    currentTeam: coachSeason.currentSeason.team,
  })
}
