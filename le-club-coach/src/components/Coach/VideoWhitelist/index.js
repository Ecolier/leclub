import React from 'react'
import { useStoreon } from 'storeon/react'
import VideoPrivacy from '../../Privacy'
import VideoPrivacyModal from '../../Privacy/modal'
import { callApi } from '@/utils/callApi'

class VideoWhitelist extends React.PureComponent {

  componentDidMount () {
    const { coach, currentSeason } = this.props
    const coachId = coach._id
    const season = currentSeason.season
    callApi(`${coachId}/whitelistable/${season}`, 'get').then(data => {
      this.setState({
        whitelistableUsers: data.users,
        whitelistableCoaches: data.coaches,
      })
    })
  }

  state = {
    whitelistableCoaches: [],
    whitelistableUsers: [],
  }

  handlePrivacyChange = (privacy, whitelist) => {
    this.props.onChange && this.props.onChange({ privacy, whitelist })
  }

  renderWhitelist = () => {
    if (this.state.whitelistableCoaches.length === 0) {
      return null
    }
  }

  render () {
    if (this.state.whitelistableCoaches.length === 0) {
      return null
    }
    const Component = this.props.modal ? VideoPrivacyModal : VideoPrivacy
    return (
      <Component
        savePrivacy={this.handlePrivacyChange}
        visible={this.props.visible}
        list={this.props.whitelist || []}
        users={this.state.whitelistableUsers}
        coaches={this.state.whitelistableCoaches}
        isPublic='private'
      />
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')
  const { currentSeason } = coachSeason
  const props = {
    ...initialProps,
    dispatch,
    coach,
    currentSeason,
  }
  return <VideoWhitelist {...props} />
}
