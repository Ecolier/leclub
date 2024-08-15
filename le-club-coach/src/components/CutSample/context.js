import React, { PureComponent } from 'react'
import { EventEmitter } from 'events'
import { clamp } from 'lodash'

export const ClipContext = React.createContext({})

export class ClipContextProvider extends PureComponent {

  constructor (props) {
    super(props)

    this._emitter = new EventEmitter()
    this.state = {
      player: undefined,
      playlist: undefined,
      scrubber: undefined,
      currentTime: 0,
      timePreview: 0,
      startOffset: 0,
      maxTime: 0,
      clipStart: 0,
      clipEnd: 0,
      editing: false,
      drawing: false,
      spotlight: false,
      seek: this.seek,
      restart: this.restart,
      setCurrentTime: this.setCurrentTime,
      setClipEnd: this.setClipEnd,
      setClipStart: this.setClipStart,
      setPlayer: this.setPlayer,
      setPlaylist: this.setPlaylist,
      setStartOffset: this.setStartOffset,
      startEdit: this.startEdit,
      stopEdit: this.stopEdit,
      setRange: this.setRange,
      setVolume: this.setVolume,
      startEditRealClip: this.startEditRealClip,
      pause: this.pause,
      setDrawing: this.setDrawing,
      setSpotlight: this.setSpotlight,
      getAbsoluteClipStart: () => {
        return this.absoluteClipStart
      },
      getRelativeTime: () => {
        return this.absoluteCurrentTime - this.absoluteClipStart
      },
      getAbsoluteClipEnd: () => {
        return this.absoluteClipEnd
      },
      getMaxTimeCut: () => {
        return this.maxTimeCut
      },
      getAbsoluteCurrentTime: () => {
        return this.absoluteCurrentTime
      },
      getCurrentVolume: () => {
        return this.currentVolume
      },
      getStartOffset: () => {
        return this.startOffset
      },
      getTimePreview: () => {
        return this.timePreview
      },
      on: (event, handler) => {
        this._emitter.on(event, handler)
      },
      once: (event, handler) => {
        this._emitter.once(event, handler)
      },
      off: (event, handler) => {
        this._emitter.off(event, handler)
      },
    }
  }

  seek = (time) => {
    const player = this.state.player
    if (player) {
      player.seek(this.state.startOffset + time)
    }
  }

  pause = () => {
    const player = this.state.player
    if (player) {
      player.pause()
    }
  }

  restart = () => {
    const player = this.state.player
    if (!player) {
      return
    }
    player.seek(this.state.startOffset + this.state.clipStart)
    player.play()
  }

  setVolume = (r) => {
    const player = this.state.player
    if (player) {
      player.volume = r
    }
  }

  setStartOffset = (startOffset) => {
    this.setState({ startOffset })
  }

  stopEdit = () => {
    if (this.state.editing) {
      this._emitter.emit('stop')
      return this.setState({
        editing: false,
        spotlight: false,
        drawing: false,
        timePreview: 0,
        startOffset: 0,
        maxTime: 0,
        clipStart: 0,
        clipEnd: 0,
      })
    }
  }

  startEditRealClip = (startEditProps) => {

    if (!this.state.player) {
      return
    }

    const player = this.state.player

    if (player.readyState !== 4) {
      return
    }

    this.pause()

    if (startEditProps < 0) {
      startEditProps = 0
    }
    const timePreview = startEditProps + 30
    if (timePreview > player.duration) {
      startEditProps = player.duration - 60
    }
    this.setState({
      editing: true,
      drawing: false,
      spotlight: false,
      clipStart: startEditProps,
      clipEnd: startEditProps + 10,
      timePreview,
      startOffset: 0,
    }, () => {
      this.restart()
    })

  }

  startEdit = (opts = {}) => {

    const player = this.state.player
    if (!player) {
      return
    }

    if (player.readyState < 1) {
      return
    }

    this.pause()

    const coach = this.props.children && this.props.children.props ? this.props.children.props.coach : null

    const padding = this.props.padding || 20
    const maxTime = this.props.maxTime || 180
    const minTime = this.props.minTime || 10
    const defaultTime = (coach && coach.prefStudio) ? coach.prefStudio.range : (maxTime / 2)

    const videoCurrent = player.accurateCurrentTime
    const videoDuration = opts.duration || player.duration

    const timePreview = Math.min(maxTime + (padding * 2), videoDuration)

    const startOffset = clamp(videoCurrent - padding, 0, videoDuration - timePreview)
    const clipStart = (videoCurrent - startOffset) + minTime > videoDuration ? videoDuration - minTime : (videoCurrent - startOffset)
    const clipEnd = clipStart + defaultTime > videoDuration - startOffset ? videoDuration - startOffset : clipStart + defaultTime
    const currentTime = clipStart

    this.setState({
      editing: true,
      drawing: false,
      spotlight: false,
      timePreview,
      maxTime,
      currentTime: currentTime || (videoCurrent - startOffset),
      startOffset,
      clipStart: Math.max(opts.start || clipStart),
      clipEnd: Math.min(opts.end || clipEnd),
    }, () => {
      this.seek(currentTime)
    })
  }

  setCurrentTime = (currentTime, seek = true) => {
    currentTime = parseFloat(currentTime.toFixed(5), 10)
    if (seek) {
      this.seek(currentTime)
    }
    this.setState({ currentTime })
  }

  setRange = (clipStart, clipEnd, restart = false) => {
    clipStart = parseFloat(clipStart.toFixed(5), 10)
    clipEnd = parseFloat(clipEnd.toFixed(5), 10)
    if (clipStart === this.state.clipStart && clipEnd === this.state.clipEnd) {
      return
    }

    clipStart = clipStart > 0 ? clipStart : 0
    clipEnd = clipEnd < this.state.timePreview ? clipEnd : this.state.timePreview

    let duration = clipEnd - clipStart

    if (clipStart === 0 && !(duration >= 10 && duration <= 180)) {
      clipEnd = 10
    }
    if (clipEnd === Math.round(this.state.player.duration) && !(duration >= 10 && duration <= 180)) {
      clipStart = Math.round(this.state.player.duration) - 10
    }
    duration = clipEnd - clipStart
    if (duration >= 10 && duration <= 180) {
      this.setState({ clipStart, clipEnd })
      if (restart) {
        this.restart()
      }
    }
  }

  setClipStart = (clipStart) => {
    this.setRange(clipStart, this.state.clipEnd, true)
  }

  setClipEnd = (clipEnd) => {
    this.setRange(this.state.clipStart, clipEnd)
  }

  setPlayer = (player) => {
    this.setState({ player })
  }

  setPlaylist = (playlist) => {
    this.setState({ playlist })
  }

  setDrawing = (value) => {
    this.setState({ drawing: value, spotlight: false })
  }

  setSpotlight = (value) => {
    this.setState({ spotlight: value, drawing: false })
  }

  get absoluteClipStart () {
    return this.state.startOffset + this.state.clipStart
  }

  get absoluteClipEnd () {
    return this.state.startOffset + this.state.clipEnd
  }

  get absoluteCurrentTime () {
    return this.state.startOffset + this.state.currentTime
  }

  get startOffset () {
    return this.state.startOffset
  }

  get timePreview () {
    return this.state.timePreview
  }

  get maxTimeCut () {
    if (!this.state.player) {
      return 0
    }
    if ((this.state.timePreview + this.state.startOffset) > this.state.player.duration) {
      return this.state.player.duration
    }
    return this.state.timePreview + this.state.startOffset
  }

  render () {
    return (
      <ClipContext.Provider value={this.state}>
        { this.props.children }
      </ClipContext.Provider>
    )
  }
}
