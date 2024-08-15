import React, { PureComponent } from 'react'
import PlayerContext from '@/components/Player/context'
import Drawing from '../drawingV2'

class TryLeClub extends PureComponent {

  componentDidMount () {
    this._unsubscribeTimeUpdate = this.player.subscribe('timeupdate', this.handleTimeUpdate)
  }

  componentWillUnmount () {
    this._unsubscribeTimeUpdate()
  }

  state = {
    isStarted: false,
    isLoading: false,
  }

  static contextType = PlayerContext

  get player () {
    return this.context
  }

  handleTimeUpdate = () => {
    this._drawingRef.resetStage()
  }

  render () {
    return (
      <Drawing
        ref={ref => this._drawingRef = ref}
        topSetings={'25%'}
        leftSetings={'0px'}
        deleteCanvas={this.showDeleteConfirm}
        preSaveCanvas={this.preSaveCanvas}
        videoElement={document.getElementById('video-1')}
        closeModal={() => { this.setState({ imageTmp: null }) }}
        heightVideo={this.state.heightVideo}
        widthVideo={this.state.widthVideo}
        isStarted={this.state.isStarted}
        isLoading={this.state.isLoading}
        pushDrawings={this.props.pushDrawings}
        drawings={this.props.drawings}
        isTrying
      />
    )
  }
}

export default TryLeClub
