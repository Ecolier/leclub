import React from 'react'
import ReactDOM from 'react-dom'
import { ZoomIcon } from './icons'
import PlayerContext from './context'
import Draggable from '../Draggable'

class Slider extends React.PureComponent {

  componentDidMount () {
    this.slideBar = ReactDOM.findDOMNode(this)
  }

  get min () {
    return this.props.min || 0
  }

  get max () {
    return this.props.max || 1
  }

  get value () {
    return Math.min(Math.max(this.props.value || this.min, this.min), this.max)
  }

  get valueRatio () {
    return (this.value - this.min) / (this.max - this.min)
  }

  get height () {
    return this.props.height || 4
  }

  get style () {
    const height = this.props.height || 4
    const width = this.props.width || '100%'
    const barColor = this.props.barColor || 'white'
    const cursorColor = this.props.cursorColor || 'black'
    const cursorSize = height * 3

    return {
      bar: {
        ...this.props.style,
        height,
        width,
        background: barColor,
      },
      cursor: {
        position: 'relative',
        background: cursorColor,
        top: '50%',
        left: `${this.valueRatio * 100}%`,
        transform: 'translate(-50%, -50%)',
        height: cursorSize,
        width: cursorSize,
        borderRadius: cursorSize / 2,
      },
    }
  }

  handleDrag = (evt) => {
    const barX = this.slideBar.getBoundingClientRect().x
    const barWidth = this.slideBar.offsetWidth
    const ratio = ((evt.startX + evt.x) - barX) / barWidth
    const clampedRatio = Math.max(Math.min(ratio, 1), 0)
    const value = this.min + ((this.max - this.min) * clampedRatio)

    this.props.onChange && this.props.onChange(value)
  }

  render () {
    return (
      <Draggable onDrag={this.handleDrag} onDragStart={this.handleDrag} cursor='grab'>
        <div style={this.style.bar} ref={e => this.slideBar = e}>
          <div style={this.style.cursor} />
        </div>
      </Draggable>
    )
  }
}

export class Minimap extends React.PureComponent {

  componentDidMount () {
    this.unsubscribeZoom = this.player.subscribe('zoomchange', this.handleZoomChange)
  }

  componentWillUnmount () {
    this.unsubscribeZoom()
  }

  static contextType = PlayerContext

  state = {
    zoom: this.player.getZoom(),
  }

  handleZoomChange = () => {
    this.setState({ zoom: this.player.getZoom() })
  }

  setZoom = (f, x, y) => {
    this.player.zoom(f, x, y)
  }

  handleBoxDrag = (evt) => {
    const zoom = this.state.zoom
    const zoomboxEl = evt.target
    const minimapEl = this._minimapEl

    const zoomboxWidth = zoomboxEl.offsetWidth
    const zoomboxHeight = zoomboxEl.offsetHeight

    const minimapWidth = minimapEl.offsetWidth
    const minimapHeight = minimapEl.offsetHeight

    const nextLeft = Math.max(evt.targetStartX + evt.x, 0)
    const nextRight = nextLeft + zoomboxEl.offsetWidth
    const nextTop = Math.max(evt.targetStartY + evt.y, 0)
    const nextBottom = nextTop + zoomboxEl.offsetHeight

    const left = nextRight >= minimapWidth ? (minimapWidth - zoomboxWidth) : nextLeft
    const top = nextBottom >= minimapHeight ? (minimapHeight - zoomboxHeight) : nextTop

    this.setZoom(zoom.factor, left / minimapWidth, top / minimapHeight)
  }

  get player () {
    return this.context
  }

  get zoomboxStyle () {
    const zoom = this.state.zoom
    return {
      position: 'absolute',
      top: `${zoom.y * 100}%`,
      left: `${zoom.x * 100}%`,
      background: 'transparent',
      border: '1px solid white',
      width: `${100 / zoom.factor}%`,
      height: `${100 / zoom.factor}%`,
    }
  }

  render () {
    const zoom = this.state.zoom
    return (
      <div style={{ display: 'flex', position: 'absolute', right: 5, top: 5, flexDirection: 'column' }}>
        <div style={{ position: 'relative', width: 256, height: 144, background: 'rgba(255, 255, 255, .4)' }} ref={el => this._minimapEl = el}>
          <Draggable onDrag={this.handleBoxDrag} cursor='grab'>
            <div style={this.zoomboxStyle} />
          </Draggable>
        </div>
        <Slider style={{ marginTop: 10 }} barColor='rgba(255, 255, 255, .6)' cursorColor='white' value={zoom.factor} min={1} max={4} onChange={v => this.setZoom(v, 0, 0)}/>
      </div>
    )
  }
}

export default () => {
  const player = React.useContext(PlayerContext)
  const [active, setActive] = React.useState(false)

  function toggleMinimap () {
    const nextActive = !active

    // here we reset zoom on minimap close
    if (nextActive === false) {
      player.zoom(1, 0, 0)
    }

    setActive(nextActive)
  }

  return (
    <React.Fragment>
      { active && player.overlayPortal(<Minimap />)}
      <div className='leClub-player-controls-item' onClick={toggleMinimap}>
        <ZoomIcon className='leClub-player-video-control-icon' />
      </div>
    </React.Fragment>
  )
}
