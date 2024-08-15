import React from 'react'
import throttle from 'lodash/throttle'
import PlayerContext from '@/components/Player/context'
import { Popover, message } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

const isFirefox = typeof InstallTrigger !== 'undefined'
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)

export default class extends React.PureComponent {

  componentDidMount = () => {
    this._unsubscribeWindowResize = this.subscribeToWindowResize(this.handleWindowResize)
    this._unsubscribeWindowMouseMove = this.subscribeToWindowMouseMove(this.handleWindowMouseMove)
    this._unsubscribeToKeyUp = this.subscribeToWindowKeyUp(this.handleKeyUp)
    this._unsubscribeToKeyDown = this.subscribeToWindowKeyDown(this.handleKeyDown)
  }

  componentWillUnmount = () => {
    this._unsubscribeWindowResize()
    this._unsubscribeWindowMouseMove()
    this._unsubscribeToKeyDown()
    this._unsubscribeToKeyUp()
  }

  static contextType = PlayerContext

  state = {
    isActivated: false,
  }

  get player () {
    return this.context
  }

  subscribeToWindowResize = (handler) => {
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }

  subscribeToWindowMouseMove = (handler) => {
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }

  subscribeToWindowKeyUp = (handler) => {
    window.addEventListener('keyup', handler)
    return () => window.removeEventListener('keyup', handler)
  }

  subscribeToWindowKeyDown = (handler) => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }

  mouse = {
    x: 0,
    y: 0,
  }

  _isRecording = false
  _recordedChunks = []

  handleWindowResize = () => {
    this.updateLayerBoundings()
  }

  handleKeyUp = () => {
    if (!this.state.isActivated) {
      return null
    }
    this.stopRecording(this.props.onSpotlightSave)
  }

  handleKeyDown = () => {
    if (!this.state.isActivated) {
      return null
    }
    this.startRecording()
  }

  getRecordBitrate = () => {
    return this.props.bitrate || 3 * Math.pow(10, 6) // 3 MBPS
  }

  getRecordFramerate = () => {
    return this.props.framerate || 29.97
  }

  handleWindowMouseMove = throttle((evt) => {
    this.mouse = {
      x: evt.clientX,
      y: evt.clientY,
    }
  }, 1000 / this.getRecordFramerate())

  getCursorRadius = () => {
    return this.props.cursorRadius || 40
  }

  getRecordType = () => {
    return isFirefox ? 'video/webm' : 'video/webm;codecs=h264'
  }

  getCursorColor = () => {
    return this.props.cursorColor || 'rgba(255, 255, 255, .5)'
  }

  getMaxRecordHeight = () => {
    return this.props.maxRecordHeight || 720
  }

  getMediaStream (media, framerate) {
    if (media.captureStream) {
      return media.captureStream(framerate)
    }
    if (media.mozCaptureStream) {
      return media.mozCaptureStream(framerate)
    }
    return null
  }

  initMediaRecorder = async () => {
    const framerate = this.getRecordFramerate()

    // SEE: https://github.com/w3c/mediacapture-fromelement/issues/31
    if (isFirefox) {
      this._layer.getContext('2d')
    }

    const stream = this.getMediaStream(this._layer, framerate)

    // We add sound track for chrome only
    // When audio is added on firefox, we cant record the canvas :(
    if (isChrome) {
      const playerStream = this.getMediaStream(this.player._nativePlayer, framerate)
      playerStream.getAudioTracks().forEach(t => stream.addTrack(t))
    }

    this._mediaRecorder = new MediaRecorder(stream, {
      mimeType: this.getRecordType(),
      bitsPerSecond: this.getRecordBitrate(),
    })
    this._mediaRecorder.addEventListener('dataavailable', (evt) => {
      this._recordedChunks.push(evt.data)
    })
  }

  clearLayer = () => {
    const layer = this._layer
    const ctx = layer.getContext('2d')
    ctx.clearRect(0, 0, layer.width, layer.height)
  }

  layerRenderTick = () => {
    if (!this._isRecording) {
      return
    }
    const player = this.player._nativePlayer
    const layer = this._layer
    const ctx = layer.getContext('2d')
    const layerRect = this._layer.getBoundingClientRect()
    const hRatio = layer.width / layer.offsetWidth
    const vRatio = layer.height / layer.offsetHeight

    ctx.drawImage(player, 0, 0, player.videoWidth, player.videoHeight, 0, 0, layer.width, layer.height)

    const x = (this.mouse.x - layerRect.x) * hRatio
    const y = (this.mouse.y - layerRect.y) * vRatio
    const radius = 60

    const gradient = ctx.createRadialGradient(x, y, radius / 2, x, y, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 255, .2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, .6)')

    ctx.beginPath()
    ctx.lineWidth = 4
    ctx.strokeStyle = '#EA178C'
    ctx.fillStyle = gradient
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()

    window.requestAnimationFrame(this.layerRenderTick)
  }

  updateLayerBoundings = () => {
    const player = this.player._nativePlayer
    const ratio = player.videoWidth / player.videoHeight

    this._layer.height = Math.min(player.videoHeight, this.getMaxRecordHeight())
    this._layer.width = this._layer.height * ratio
    this._layer.style.width = `${player.offsetWidth}px`
    this._layer.style.height = `${player.offsetWidth / ratio}px`
  }

  handleLayerRef = (layer) => {
    if (!layer) {
      return
    }
    this._layer = layer
    this._layer.style.position = 'absolute'
    this._layer.style.left = '50%'
    this._layer.style.top = '50%'
    this._layer.style.transform = 'translate(-50%, -50%)'
  }

  hideMouseCursor = () => {
    document.body.style.cursor = 'none'
  }

  showMouseCursor = () => {
    document.body.style.cursor = null
  }

  showRecordingMessage = () => {
    message.open({
      key: 'recordMessage',
      content: i18n.t('Studio.spotlightLayer.creation'),
      icon: (
        <i className='fas fa-circle flashing' style={{ color: 'red', marginRight: '10px' }}/>
      ),
      duration: 0,
    })
  }

  hideRecordingMessage = () => {
    message.open({
      key: 'recordMessage',
      content: i18n.t('Studio.spotlightLayer.created'),
      duration: 1,
    })
  }

  startRecording = () => {
    if (this._isRecording) {
      return
    }
    this._isRecording = true
    this.showRecordingMessage()
    this.updateLayerBoundings()
    this.hideMouseCursor()
    this._startTime = this.player.accurateCurrentTime
    this.player.playbackRate = 0.5
    this.player.play()
    this._mediaRecorder.start(10000)
    window.requestAnimationFrame(this.layerRenderTick)
  }

  stopRecording = (cb) => {
    if (!this._isRecording) {
      return
    }
    this._isRecording = false
    this._mediaRecorder.onstop = () => {
      const chunks = this._recordedChunks.splice(0)
      if (cb) {
        const start = this._startTime
        const duration = this.player.accurateCurrentTime - this._startTime
        const end = start + duration
        cb({
          start,
          end,
          duration,
          blob: new Blob(chunks, { type: this.getRecordType() }),
        })
      }
      this._mediaRecorder.onstop = null
    }
    this._mediaRecorder.stop()
    this.showMouseCursor()
    this.toggleSpotlight()
    this.hideRecordingMessage()
    this.player.playbackRate = 1
    this.player.pause()
    this.clearLayer()
  }

  showTipsMessage = () => {
    message.open({
      key: 'tips',
      content: i18n.t('Studio.spotlightLayer.tips'),
      duration: 0,
    })
  }

  hideTipsMessage = () => {
    message.open({
      key: 'tips',
      content: i18n.t('Studio.spotlightLayer.tips'),
      duration: 0.1,
    })
  }

  activateSpotlight = () => {
    if (this.player.readyState < 3) {
      return message.error(i18n.t('Stuido.spotlightLayer.error'), 3)
    }
    this.updateLayerBoundings()
    this.initMediaRecorder()
    this.showTipsMessage()
    this.player.pause()
    this.props.onActivate && this.props.onActivate()
  }

  deactivateSpotlight = () => {
    this.props.onDeactivate && this.props.onDeactivate()
  }

  toggleSpotlight = () => {
    this.setState({ isActivated: !this.state.isActivated }, () => {
      this.state.isActivated ? this.activateSpotlight() : this.deactivateSpotlight()
    })
  }

  renderSpotlightButton = () => {
    const isBrowserCompatible = isFirefox || isChrome
    let popoverMessage
    if (!isBrowserCompatible) {
      popoverMessage = (
        <React.Fragment>
          <div>{i18n.t('Studio.spotlightLayer.navigatorError')}</div>
          <div>{i18n.t('Studio.spotlightLayer.navigatorSuggestion')}</div>
        </React.Fragment>
      )
    } else {
      popoverMessage = this.state.isActivated ? i18n.t('Studio.spotlightLayer.desactivate') : i18n.t('Studio.spotlightLayer.activate')
    }
    return (
      <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '30px', zIndex: '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          width: '100%',
          borderTopLeftRadius: '5px',
          borderBottomLeftRadius: '5px',
          padding: '5px',
          cursor: 'pointer',
        }}>
          <Popover
            onClick={isBrowserCompatible && this.toggleSpotlight}
            content={popoverMessage}
          >
            <svg viewBox='-65 -50 600 600' style={{ padding: '5px' }}>
              <path
                fill={this.state.isActivated ? 'white' : 'grey'}
                d='M159.7 237.4C108.4 308.3 43.1 348.2 14 326.6-15.2 304.9 2.8 230 54.2 159.1c51.3-70.9 116.6-110.8 145.7-89.2 29.1 21.6 11.1 96.6-40.2 167.5zm351.2-57.3C437.1 303.5 319 367.8 246.4 323.7c-25-15.2-41.3-41.2-49-73.8-33.6 64.8-92.8 113.8-164.1 133.2 49.8 59.3 124.1 96.9 207 96.9 150 0 271.6-123.1 271.6-274.9.1-8.5-.3-16.8-1-25z'
              />
            </svg>
          </Popover>
        </div>
      </div>
    )
  }

  render () {
    const SpotlightButton = this.renderSpotlightButton
    return this.player.playerPortal(
      <React.Fragment>
        <SpotlightButton />
        <canvas
          ref={this.handleLayerRef}
        />
      </React.Fragment>
    )
  }
}
