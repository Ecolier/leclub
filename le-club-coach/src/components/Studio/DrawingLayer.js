import React from 'react'
import PlayerContext from '@/components/Player/context'
import Drawing from './drawingV2'
import { Modal } from 'antd'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends React.Component {

  componentDidMount () {
    this._unsubscribeTimeUpdate = this.player.subscribe('timeupdate', this.handleTimeUpdate)
  }

  componentWillUnmount () {
    this._unsubscribeTimeUpdate()
  }

  state = {
    isLoading: false,
    isStarted: false,
    imageTmp: null,
    drawings: [],
  }

  static contextType = PlayerContext

  get player () {
    return this.context
  }

  handleTimeUpdate = () => {
    this._drawingRef.resetStage()
  }

  preSaveCanvas = () => {
    const video = this.player._nativePlayer
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.msImageSmoothingEnabled = true
    ctx.imageSmoothingEnabled = true
    const imageTmp = new Image()
    imageTmp.width = 1280
    imageTmp.height = 720
    canvas.width = 1920
    canvas.height = 1080
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    imageTmp.src = canvas.toDataURL()
    imageTmp.onload = () => { this.setState({ imageTmp }) }
    this.player.pause()
  }

  showDeleteConfirm = () => {
    Modal.confirm({
      title: i18n.t('Common_word.quit'),
      content: <div><p>{i18n.t('Studio.drawingLayer.exitDrawingDisclaimer')}</p></div>,
      okText: i18n.t('Common_word.yes'),
      okType: 'danger',
      cancelText: i18n.t('Common_word.no'),
      onOk: () => {
        this.setState({ imageTmp: null, pausing: false }); this.context.setDrawing(false)
      },
    })
  }

  updateDrawings = drawings => {
    this.setState({ drawings }, () => {
      this.props.onDrawingsUpdate && this.props.onDrawingsUpdate(drawings)
    })
  }

  render () {
    const video = this.props.video
    return (
      <Drawing
        ref={ref => this._drawingRef = ref}
        topSetings={'25%'}
        leftSetings={'0px'}
        deleteCanvas={this.showDeleteConfirm}
        preSaveCanvas={this.preSaveCanvas}
        videoId={video._id}
        videoElement={this.player._nativePlayer}
        isType={video.type}
        closeModal={() => { this.setState({ imageTmp: null }) }}
        imageTmp={this.state.imageTmp}
        timeOfimage={this.context.currentTime}
        video={video}
        heightVideo={this.state.heightVideo}
        widthVideo={this.state.widthVideo}
        isStarted={this.state.isStarted}
        isLoading={this.state.isLoading}
        drawings={this.state.drawings.filter(d => d.shapes.length > 0)}
        pushDrawings={drawing => {
          const drawings = this.state.drawings
          const index = drawings.findIndex(d => d.time === drawing.time)
          if (index !== -1) {
            drawings[index] = drawing
          } else {
            drawings.push(drawing)
          }
          this.updateDrawings(drawings.filter(d => d.shapes.length > 0))
        }}
      />
    )
  }
}
