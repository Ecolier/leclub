import React from 'react'
import ReactDOM from 'react-dom'

import PlayButton from './PlayButton'
import PlayerTime from './Time'
import FullscreenButton from './FullscreenButton'
import Seekbar from './Seekbar'
import ZoomButton from './ZoomButton'
import AudioControl from './AudioControl'
import PlaybackControl from './PlaybackControl'

const ControlsContext = React.createContext()

export default class extends React.PureComponent {

  componentDidMount () {
    this.setState({ refLoaded: true })
  }

  state = {
    hideTime: false,
    refLoaded: false,
    seekbarReplaced: false,
  }

  static Seekbar = class extends React.PureComponent {
    static contextType = ControlsContext
    render () {
      return this.context.seekbarPortal(this.props.children)
    }
  }

  static Left = class extends React.PureComponent {
    static contextType = ControlsContext
    render () {
      return this.context.leftControlsPortal(this.props.children)
    }
  }

  static Right = class extends React.PureComponent {
    static contextType = ControlsContext
    render () {
      return this.context.rightControlsPortal(this.props.children)
    }
  }

  get Seekbar () {
    return this.state.Seekbar || <Seekbar />
  }

  leftControlsPortal = (component) => {
    if (this._leftControlsContainer) {
      return ReactDOM.createPortal(component, this._leftControlsContainer)
    }
  }

  rightControlsPortal = (component) => {
    if (this._rightControlsContainer) {
      return ReactDOM.createPortal(component, this._rightControlsContainer)
    }
  }

  seekbarPortal = (component) => {
    if (this._rightControlsContainer) {
      this.setState({
        seekbarReplaced: true,
      })
      return ReactDOM.createPortal(component, this._seekbarContainer)
    }
  }

  render () {
    return (
      <ControlsContext.Provider value={this}>
        <div className='leClub-player-control-bar'>
          <div style={{ margin: '10px 0' }} ref={ref => this._seekbarContainer = ref}>
            { !this.state.seekbarReplaced && this.Seekbar }
          </div>
          <div className='leClub-player-controls'>
            <div className='leClub-player-controls-item' ref={ref => this._leftControlsContainer = ref}>
              <PlayButton />
              <AudioControl />
              {!this.state.hideTime && (
                <PlayerTime />
              )}
            </div>
            <div className='leClub-player-controls-item' ref={ref => this._rightControlsContainer = ref}>
              <PlaybackControl />
              <ZoomButton />
              <FullscreenButton />
            </div>
          </div>
          <div style={{ display: 'none' }}>{ this.state.refLoaded && this.props.children }</div>
        </div>
      </ControlsContext.Provider>
    )
  }
}
