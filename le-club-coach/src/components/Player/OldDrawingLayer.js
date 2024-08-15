import React from 'react'
import PlayerContext from './context'

export default class extends React.PureComponent {

  componentDidMount () {
    this._unsubscribeTimeUpate = this.player.subscribe('timeupdate', this.handlePlayerTimeUpdate)
    this._unsubscribePlayerStateChange = this.player.subscribeToStateChange(this.handlePlayerStateChange)
  }

  componentWillUnmount () {
    this._unsubscribeTimeUpate()
    this._unsubscribePlayerStateChange()
  }

  static contextType = PlayerContext

  get player () {
    return this.context
  }

  get drawings () {
    return this.props.drawings || []
  }

  drawImageFromUrl = (url) => {
    const ctx = this.canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    }
    img.src = url
  }

  clearCanvas = () => {
    this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  clearResumeTimeout = () => {
    clearTimeout(this._resumeTimeout)
    this._resumeTimeout = undefined
  }

  resume = () => {
    this.clearResumeTimeout()
    this.clearCanvas()
    if (this.player.paused && !this.player.ended) {
      this.player.play()
    }
  }

  handlePlayerStateChange = () => {
    if (!this.player.paused && this._resumeTimeout) {
      this.resume()
    }
  }

  get start () {
    return this.props.start || 0
  }

  handlePlayerTimeUpdate = (evt) => {
    const drawing = this.drawings.find(d => {
      return (d.time - Math.floor(this.start)) === evt.currentTime
    })
    if (!drawing) return

    this.player.pause()
    this.drawImageFromUrl(drawing.fileUrl)
    this._resumeTimeout = setTimeout(this.resume, 3000)
  }

  render () {
    return this.player.playerPortal(
      <canvas
        ref={el => this.canvas = el}
        id='c1'
        width={1920}
        height={1080}
        style={{ width: '100%', height: '100%', opacity: 1 }}
      />
    )
  }
}
