import './LoadingStatus.css'
import React from 'react'
import PlayerContext from './context'

export default class extends React.PureComponent {

  componentDidMount () {
    this.subscribedEvents = [
      this.player.subscribe('loadstart', this.handleWaiting),
      this.player.subscribe('canplay', this.handlePlaying),
      this.player.subscribe('waiting', this.handleWaiting),
      this.player.subscribe('playing', this.handlePlaying),
    ]
  }

  componentWillUnmount () {
    this.subscribedEvents.forEach(unsubscribe => unsubscribe())
  }

  static contextType = PlayerContext

  state = {
    loading: false,
  }

  get player () {
    return this.context
  }

  handleWaiting = () => {
    this.setState({ loading: true })
  }

  handlePlaying = () => {
    this.setState({ loading: false })
  }

  render () {
    if (!this.state.loading) {
      return null
    }
    return (
      <div className='leClub-player-loading'>
        <div className='double-bounce1' />
        <div className='double-bounce2' />
      </div>
    )
  }
}
