import React, { Component } from 'react'

import Player from './'
import OldDrawingLayer from './OldDrawingLayer'
import Controls from './ControlBar'

const CUT_VIEW_COUNT_TIMEOUT = (10 * 1000) // 10 seconds
const VIDEO_VIEW_COUNT_TIMEOUT = (60 * 5) * 1000 // 5 minutes

class PlaylistVideo extends Component {

  // componentDidMount () {
  //   if (this.props.video) {
  //     const isCut = this.props.video && this.props.video.timeOfCut
  //     const time = isCut ? CUT_VIEW_COUNT_TIMEOUT : VIDEO_VIEW_COUNT_TIMEOUT
  //     this._viewCountTimeout = setTimeout(async () => {
  //       await callApi(`service/update/views?type=video&updateId=${this.props.video._id}&ip=${this.props.home.ip}`, 'get')
  //     }, time)
  //   }
  // }

  componentWillUnmount () {
    clearTimeout(this._viewCountTimeout)
  }

  state = {
    time: null,
    file: null,
  }

  // updatePlayer = (time) => {
  //   const index = this.props.cut.drawings.findIndex(d => d.time === time)
  //   if (index !== -1) {
  //     let urlCreator = window.URL || window.webkitURL;
  //     let imageUrl = urlCreator.createObjectURL(this.props.drawings[index].file.fileUrl);
  //     this.setState({ time, file: imageUrl })
  //   } else {
  //     this.setState({ time, file: null })
  //   }
  // }

  getDrawings () {
    return this.props.drawings || []
  }

  // updatePlayer = (player) => {
  // if (!this.props.drawings) { return }
  // const index = this.getDrawings().findIndex(d => (d.time - this.props.start).toFixed(1) === player.currentTime.toString())
  // if (index !== -1) {
  // player.pause()
  // const imageUrl = this.getDrawings()[index].file.fileUrl || URL.createObjectURL(this.getDrawings()[index].file)
  // this.setState({ file: imageUrl })
  // } else if (this.state.file) {
  // this.setState({ file: null })
  // }
  // player.subscribe('timeupdate', (e) => {
  // const index = this.getDrawings().findIndex(d => (d.time - this.props.start).toFixed(1) === e.currentTime.toString())
  // if (index !== -1) {
  // player.pause()
  // const imageUrl = this.getDrawings()[index].file.fileUrl || URL.createObjectURL(this.getDrawings()[index].file)
  // this.setState({ file: imageUrl })
  // } else if (this.props.spotlight) {
  // if (!this.state.file) {
  // this.setState({ file: this.props.spotlight })
  // }
  // } else if (this.state.file) {
  // this.setState({ file: null })
  // }
  // })
  // this.setState({ player })
  // }

  render () {
    return (
      <Player
        source={this.props.url}
        start={this.props.start}
        duration={this.props.duration}
        autoPlay={this.props.autoPlay}
        updatePlayer={this.updatePlayer}
        playbackRate={this.props.playbackRate}
        ref={this.handlePlayerRef}
      >
        <Controls />
        {this.state.file && (
          <img src={this.state.file} width={'100%'} height={'100%'} />
        )}
        <OldDrawingLayer drawings={this.getDrawings()} start={this.props.start} />
      </Player>
    )
  }
}

export default PlaylistVideo
