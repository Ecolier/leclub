import './style.scss'
import React, { PureComponent, Fragment } from 'react'
import moment from 'moment'
import Player from '../../Player'
import Controls from '../../Player/ControlBar'
import Chrono from '../../Player/Chrono'
import { callApi } from '@/utils/callApi'
import { ClipContext } from '../context'
import SeekBar from './Controls/seekbar'
import TagFilters from './Controls/tagFilters'
import { connectStoreon } from 'storeon/react'

class CutSample extends PureComponent {

  componentDidMount = () => {
    if (this.props.coachId && this.props.matchId) {

      callApi(`app/coach/preset/${this.props.coachId}?matchId=${this.props.matchId}`, 'get').then(body => {
        this.setState({ laps: body.laps || [] })
      })
    }
    this.context.setPlayer(this.refs.player)
    this.refs.player.seek(this.props.start || 0)
    this.refs.player.volume = 0.5

    this.context.setStartOffset(this.props.start || 0)
    this.context.setCurrentTime(this.props.start || 0)
    this._unsubscribe = this.refs.player.subscribeToStateChange(this.handleStateChange)
    this._unsubscribeTimeUpdate = this.refs.player.subscribe('timeupdate', this.handleStateChange)
    this.setState({ loaded: true })
  }

  componentWillUnmount = () => {
    this.context.setPlayer(undefined)
    if (this._unsubscribe) {
      this._unsubscribe()
    }
    if (this._unsubscribeTimeUpdate) {
      this._unsubscribeTimeUpdate()
    }
  }

  static contextType = ClipContext

  state = {
    loaded: false,
    currentTime: 0,
    duration: 0,
    images: [],
    laps: [],
    timeForImage: true,
    paused: true,
    filters: {
      lost: true,
      win: true,
      momentum: true,
    },
  }

  restrictContextMenu = (evt) => {
    evt.preventDefault()
  }

  handleStateChange = () => {
    const player = this.refs.player
    this.setState({ currentTime: player.currentTime, duration: player.duration })
    const currentTime = player.currentTime - this.context.startOffset

    if (this.context.editing) {
      if (currentTime > this.context.clipEnd) {
        return this.context.restart()
      }
    }

    if (currentTime > this.duration) {
      return this.context.restart()
    }
    this.context.setCurrentTime(currentTime, false)
  }

  get duration () {
    if (this.context.editing) {
      return this.context.timePreview
    }
    return this.props.duration || this.state.duration
  }

  get currentTime () {
    return this.context.currentTime
  }

  get formattedDuration () {
    return moment.utc(this.duration * 1000).format('HH:mm:ss')
  }

  get formattedCurrentTime () {
    let minutes = Math.floor(this.currentTime / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    return `${minutes || '00'}:${moment.utc((this.currentTime || 0) * 1000).format('ss')}`
  }

  render () {

    return (
      <div className='b-video-player'>
        <Player source={this.props.source} disableShortcuts={this.props.disableShortcuts} ref='player' crossOrigin='anonymous' videoId={'video-1'} autoPlay={this.props.mobile.isOnIOS}>
          <Chrono />
          { window.innerWidth > 425 && (<Fragment>{this.props.drawingElement}</Fragment>) }
          {/* this.props.spotlightElement*/}
          {this.state.loaded && this.props.children}
          <React.Fragment>
            <Controls ref={ref => this._controls = ref} />
            {this._controls && (
              <React.Fragment>
                {this._controls.leftControlsPortal(
                  <div>
                    { !this.props.isTrying && this.state.laps.length > 0 && (<TagFilters onFiltersChange={filters => this.setState({ filters })} filters={this.state.filters} />) }
                  </div>
                )}
                {this._controls.seekbarPortal(
                  <SeekBar isTrying={this.props.isTrying} currentTime={this.currentTime} duration={this.duration} laps={!this.props.isTrying ? this.state.laps : []} handleChangeCutFormTitle={this.props.handleChangeCutFormTitle} handleChangeCutFormSelectedTags={this.props.handleChangeCutFormSelectedTags} filters={this.state.filters} drawings={this.props.drawingsV2} />
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        </Player>
      </div>
    )
  }
}

export default connectStoreon('mobile', CutSample)
