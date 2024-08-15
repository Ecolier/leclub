import React from 'react'
import { Button, Tooltip, notification } from 'antd'
import { useStoreon } from 'storeon/react'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'

class AskWhitelistButton extends React.PureComponent {

  handleAsk = () => {
    const { video, coach } = this.props
    const coachId = coach._id
    const videoId = video._id
    const matchId = video.match
    callApi(`${coachId}/video/${videoId}/whitelist/ask`, 'post').then(() => {
      this.props.dispatch('http/updateMatchVideo', {
        matchId,
        videoId,
        video: {
          pendingWhitelist: [
            ...this.props.video.pendingWhitelist,
            coachId,
          ],
        },
      })
      notification.success({ message: i18n.t('Sheets.video_management.ask_video_access_confirm') })
    })
  }

  render () {
    const isPending = this.props.video.pendingWhitelist?.indexOf(this.props.coach._id) !== -1
    const tooltip = isPending
      ? i18n.t('Sheets.video_management.already_ask_video_access')
      : i18n.t('Sheets.video_management.unauthorized_video_access')

    return (<Tooltip title={tooltip} placement='bottom'>
      <Button icon='lock' shape={this.props.children
        ? null
        : 'circle'} style={{
        fontSize: 12,
      }} onClick={this.handleAsk} disabled={isPending}>
        {this.props.children}
      </Button>
    </Tooltip>)
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <AskWhitelistButton {...props}/>
}
