import './player.css'
import React from 'react'
import ReactDOM from 'react-dom'
import * as screenfull from 'screenfull'
import { EventEmitter } from 'events'
import PlayerContext from './context'
import LoadingStatus from './LoadingStatus'
import { clamp } from 'lodash'

const KEY_SPACE = 32
const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40
const KEY_F = 70
const KEY_N = 78
const KEY_P = 80

export default class Player extends React.PureComponent {

  componentDidMount () {

    this.setTimeRange(this.props.start, this.props.start + this.props.duration)
    this.setState({ refLoaded: true })
    if (this.props.updatePlayer) {
      this.props.updatePlayer(this)
    }

    // this._nativePlayer.addEventListener('durationchange', this._handleNativeDurationChange)
    // this._nativePlayer.addEventListener('pause', this._handleNativePause)
    // this._nativePlayer.addEventListener('play', this._handleNativePlay)
    // this._nativePlayer.addEventListener('volumechange', this._handleNativeVolumeChange)
    // this._nativePlayer.addEventListener('waiting', this._handleNativeAndEmit)
    // this._nativePlayer.addEventListener('playing', this._handleNativeAndEmit)
    // this._nativePlayer.addEventListener('loadeddata', this._handleNativeAsStateChange)
    // this._nativePlayer.addEventListener('canplay', this._handleNativeAsStateChange)

    // this._containerRef.addEventListener('mouseenter', this._handleMouseEnter)
    // this._containerRef.addEventListener('mousemove', this._handleMouseMove)
    // this._containerRef.addEventListener('mouseleave', this._handleMouseLeave)

    // this._emitter.on('timeupdate', this._handleTimeUpdate)

    // here we attach all events
    Object.keys(this._events).forEach(k => {
      this._events[k].events.forEach(evt => {
        this._events[k].on(evt.name, evt.handler())
      })
    })
    this._destroyTimeWatcher = this._startTimeWatcher()
  }

  componentWillUnmount () {
    // here we detach all events
    Object.keys(this._events).forEach(k => {
      this._events[k].events.forEach(evt => {
        this._events[k].off(evt.name, evt.handler())
      })
    })
    this._destroyTimeWatcher()
  }

  state = {
    zoom: { factor: 1, x: 0, y: 0 },
    refLoaded: false,
    overlayHided: false,
  }

  _videoStartTime = undefined
  _videoEndTime = undefined
  _emitter = new EventEmitter()
  _thumbnails = {}

  _events = {
    nativePlayer: {
      on: (...params) => this._nativePlayer.addEventListener(...params),
      off: (...params) => this._nativePlayer.removeEventListener(...params),
      events: [
        { name: 'durationchange', handler: () => this._handleNativeDurationChange },
        { name: 'volumechange', handler: () => this._handleNativeAsStateChange },
        { name: 'ratechange', handler: () => this._handleNativeAsStateChange },
        { name: 'pause', handler: () => this._handleNativeAsStateChange },
        { name: 'play', handler: () => this._handleNativeAsStateChange },
        { name: 'waiting', handler: () => this._handleNativeAndEmit },
        { name: 'playing', handler: () => this._handleNativeAndEmit },
        { name: 'loadeddata', handler: () => this._handleNativeAsStateChange },
        { name: 'canplay', handler: () => this._handleNativeAndEmit },
        { name: 'error', handler: () => this._handleNativeAndEmit },
        { name: 'loadstart', handler: () => this._handleNativeAndEmit },
      ],
    },
    container: {
      on: (...params) => this._containerRef.addEventListener(...params),
      off: (...params) => this._containerRef.removeEventListener(...params),
      events: [
        { name: 'mouseenter', handler: () => this._handleMouseEnter },
        { name: 'mousemove', handler: () => this._handleMouseMove },
        { name: 'mouseleave', handler: () => this._handleMouseLeave },
        { name: 'keydown', handler: () => this._handleShortcuts },
      ],
    },
    player: {
      on: (...params) => this._emitter.on(...params),
      off: (...params) => this._emitter.off(...params),
      events: [
        { name: 'timeupdate', handler: () => this._handleTimeUpdate },
      ],
    },
  }

  _handleMouseLeave = () => {
    // this.hideOverlay()
  }

  _handleMouseEnter = () => {
    // this.showOverlay()
  }

  _handleMouseMove = () => {
    // clearTimeout(this._autoHideOverlayTimeout)
    // this.showOverlay()
    // this._autoHideOverlayTimeout = setTimeout(() => {
    // this.hideOverlay()
    // }, 3000)
  }

  _handleShortcuts = evt => {
    if (this.props.disableShortcuts) {
      return
    }
    switch (evt.keyCode) {
    case KEY_SPACE:
      return this.paused ? this.play() : this.pause()
    case KEY_UP:
      return this.volume = clamp(this.volume + 0.1, 0, 1)
    case KEY_DOWN:
      return this.volume = clamp(this.volume - 0.1, 0, 1)
    case KEY_RIGHT:
      return this.currentTime += 15
    case KEY_LEFT:
      return this.currentTime -= 15
    case KEY_F:
      return this.toggleFullscreen()
    case KEY_N:
      return this.playbackRate = clamp(this.playbackRate * 2, 0.25, 16)
    case KEY_P:
      return this.playbackRate = clamp(this.playbackRate / 2, 0.25, 16)
    default:
      break
    }
  }

  _handleNativeAsStateChange = () => {
    this._emitter.emit('statechange')
  }

  _handleNativeAndEmit = (evt) => {
    this._emitter.emit(evt.type, evt)
  }

  _startTimeWatcher = () => {
    let shouldDestroy = false
    let lastTime

    const loop = () => {
      if (!this.started) {
        return requestAnimationFrame(loop)
      }
      if (shouldDestroy) {
        return
      }
      const currentTime = this.currentTime
      if (lastTime !== currentTime) {
        lastTime = currentTime
        const evt = {
          currentTime,
          accurateCurrentTime: this.accurateCurrentTime,
        }
        this._emitter.emit('timeupdate', evt)
      }
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
    return () => { shouldDestroy = true }
  }

  // Handle native video player time update
  _handleTimeUpdate = () => {
    const shouldRestart = this._nativePlayer.loop
    if (this.ended) {
      if (shouldRestart) {
        return this.restart()
      }
      return this.pause()
    }
  }

  // Handle native video player duration change
  _handleNativeDurationChange = () => {
    // here we prevent our custom video duration to overflow true video duration
    // when video duration change
    this._setVideoEndTime(this.videoEndTime)
  }

  _setVideoEndTime = (time) => {
    const oldDuration = this.duration
    this._videoEndTime = time
    if (oldDuration !== this.duration) {
      this._emitter.emit('statechange')
    }
  }

  hideOverlay = () => {
    if (!this.state.overlayHided) {
      this.setState({ overlayHided: true })
    }
  }

  showOverlay = () => {
    if (this.state.overlayHided) {
      this.setState({ overlayHided: false })
    }
  }

  get bufferEndTime () {
    const size = this._nativePlayer.buffered.length
    if (size === 0) {
      return 0
    }
    return Math.min(this._nativePlayer.buffered.end(size - 1), this.duration)
  }

  setTimeRange = (start, end) => {
    this._videoStartTime = start || 0
    this._setVideoEndTime(parseInt(end, 10))
    this._nativePlayer.currentTime = start || 0
  }

  subscribeToStateChange = (handler) => {
    return this.subscribe('statechange', handler)
  }

  subscribe = (event, handler) => {
    this._emitter.on(event, handler)
    return () => {
      this._emitter.off(event, handler)
    }
  }

  restart = () => {
    this.currentTime = 0
    this._nativePlayer.play()
  }

  seek = (time) => {
    this.currentTime = time
  }

  pause = () => {
    this._nativePlayer.pause()
  }

  play = () => {
    if (this.ended) {
      return this.restart()
    }
    this._nativePlayer.play()
  }

  getThumbnail = (time, isOnMobile) => {
    if (this._thumbnails[time]) {
      return Promise.resolve({ time, data: this._thumbnails[time] })
    }
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')

      canvas.width = 1280
      canvas.height = 720
      canvas.style.width = `${canvas.width}px`
      canvas.style.height = `${canvas.height}px`

      video.onloadeddata = () => {
        video.currentTime = time
      }

      if (isOnMobile) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        this._thumbnails[time] = canvas.toDataURL()
        resolve({ time, data: this._thumbnails[time] })
      }

      video.onseeked = () => {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        this._thumbnails[time] = canvas.toDataURL()
        resolve({ time, data: this._thumbnails[time] })
      }

      video.onerror = (err) => reject(err)
      video.crossOrigin = 'anonymous'
      video.src = this.props.source
    })
  }

  zoom = (factor, x, y) => {
    const zoom = { factor, x, y }
    this.setState({ zoom })
    this._emitter.emit('zoomchange', zoom)
  }

  getZoom () {
    return { ...this.state.zoom }
  }

  get _zoomComponentStyle () {
    if (!this.state.zoom || !this._containerRef) {
      return {}
    }
    const zoom = this.state.zoom
    const factor = zoom.factor

    const zoomWidth = this._containerRef.offsetWidth * factor
    const zoomHeight = this._containerRef.offsetHeight * factor

    const x = (((zoomWidth - this._containerRef.offsetWidth) / 2) - zoomWidth * zoom.x) / this._containerRef.offsetWidth * 100
    const y = (((zoomHeight - this._containerRef.offsetHeight) / 2) - zoomHeight * zoom.y) / this._containerRef.offsetHeight * 100

    return {
      transform: `translate(${x}%, ${y}%) scale(${factor})`,
    }
  }

  get ended () {
    return this.accurateCurrentTime >= this.duration
  }

  get paused () {
    return this._nativePlayer ? this._nativePlayer.paused : true
  }

  get started () {
    return this._nativePlayer && !this._nativePlayer.paused
  }

  get source () {
    return this.props.source
  }

  set volume (v) {
    this._nativePlayer.volume = v
  }

  get volume () {
    return this._nativePlayer.volume
  }

  get playbackRate () {
    return this._nativePlayer.playbackRate
  }

  set playbackRate (v) {
    this._nativePlayer.playbackRate = v
  }

  set muted (v) {
    this._nativePlayer.muted = v
  }

  get muted () {
    return this._nativePlayer.muted
  }

  get videoEndTime () {
    return this._videoEndTime || this._nativePlayer.duration
  }

  get videoStartTime () {
    return this._videoStartTime || 0
  }

  get duration () {
    const nativePlayer = this._nativePlayer
    if (!nativePlayer) {
      return 0
    }

    const duration = this.videoEndTime - this.videoStartTime
    const max = Number.isNaN(nativePlayer.duration) ? duration : nativePlayer.duration
    return Math.min(duration, max)
  }

  set currentTime (v) {
    this._nativePlayer.currentTime = this.videoStartTime + v
  }

  get _accurateNativeCurrentTime () {
    const nativePlayer = this._nativePlayer
    if (!nativePlayer) {
      return 0
    }
    return nativePlayer.currentTime
  }

  get _nativeCurrentTime () {
    return parseFloat(Math.trunc(this._accurateNativeCurrentTime * 10) / 10)
  }

  get accurateCurrentTime () {
    const currentTime = this._accurateNativeCurrentTime - this.videoStartTime
    const max = this.duration
    return Math.min(currentTime, max)
  }

  get currentTime () {
    return parseFloat(Math.trunc(this.accurateCurrentTime * 10) / 10)
  }

  playerPortal = (component) => {
    return ReactDOM.createPortal(component, this._videoPlayerContainer)
  }

  overlayPortal = (component) => {
    return ReactDOM.createPortal(component, this._overlayRef)
  }

  toggleFullscreen = () => {
    this._handleNativeAsStateChange()
    return screenfull.toggle(this._containerRef)
  }

  get mainContainerElement () {
    return this._containerRef
  }

  get readyState () {
    return this._nativePlayer.readyState
  }

  get _mainContainerClasses () {
    const classes = [
      'leClub-player',
      this.state.overlayHided && 'hide-player-overlay',
    ]
    return classes.filter(v => !!v).join(' ')
  }

  handlePlayerRef = ref => {
    this._nativePlayer = ref
    if (!this._nativePlayer) {
      return
    }
    this.playbackRate = this.props.playbackRate || 1
  }

  render () {
    return (
      <PlayerContext.Provider value={this}>
        <div className={this._mainContainerClasses} ref={ref => this._containerRef = ref} tabIndex='0'>
          <div className='leClub-player-inner'>
            <div className='leClub-player-video' style={this._zoomComponentStyle}>
              <div className='leClub-player-overlay' ref={ref => this._videoPlayerContainer = ref} />
              <video
                playsinline='true'
                width='100%'
                height='100%'
                ref={this.handlePlayerRef}
                crossOrigin={this.props.crossOrigin || 'anonymous'}
                id={this.props.videoId}
                autoPlay={this.props.autoPlay}
                key={this.props.source}>
                <source src={this.props.source} format='video/mp4' />
              </video>
            </div>
            <div className='leClub-player-overlay player-overlay' ref={ref => this._overlayRef = ref}>
              <React.Fragment>{ this.state.refLoaded && this.props.children }</React.Fragment>
            </div>
            <React.Fragment>{ this.state.refLoaded && (<LoadingStatus />) }</React.Fragment>
          </div>
        </div>
      </PlayerContext.Provider>
    )
  }
}
