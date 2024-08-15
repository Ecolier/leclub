import React, { PureComponent } from 'react'
import { ClipContext } from '../../context'
import Draggable from '../../Draggable'
import { callApi } from '@/utils/callApi'
import { Popover, Icon } from 'antd'
import './style.scss'
import ModalVideo from '../../Playlist/modalVideo'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends PureComponent {

  componentDidMount () {
    if (this.props.coachId && this.props.matchId) {
      callApi(`app/coach/preset/${this.props.coachId}?matchId=${this.props.matchId}`, 'get').then(body => {
        this.setState({ laps: body.laps })
      })
    }
  }

  static contextType = ClipContext

  state = {
    modal: false,
    cut: undefined,
  }

  get filters () {
    return this.props.filters || {}
  }

  get currentTimePercent () {
    return this.props.currentTime / this.props.duration * 100
  }

  get clipStartPercent () {
    if (!this.context.editing) return 0
    return (this.context.clipStart / this.context.timePreview) * 100
  }

  get clipEndPercent () {
    if (!this.context.editing) return 0
    return (this.context.clipEnd - this.context.clipStart) / this.context.timePreview * 100
  }

  handleCursorDrag = (pos) => {
    const { width, left } = this.refs.bar.getBoundingClientRect()
    const ratio = (pos - left) / width
    const max = 1
    const min = 0

    const r = Math.max(Math.min(ratio, max), min)
    this.context.setCurrentTime(this.props.duration * r)
  }

  handleSeekDrag = (pos) => {
    const { width, left } = this.refs.bar.getBoundingClientRect()
    const ratio = (pos - left) / width
    const max = 1
    const min = 0

    const r = Math.max(Math.min(ratio, max), min)
    this.context.setCurrentTime(this.props.duration * r)
  }

  renderLaps = () => {
    const { laps } = this.props
    const { win, lost, momentum } = this.filters

    const render = []
    let oldLeft = 0
    laps.map((lap, key) => {
      let title = ''
      let content = ''
      let mustNotRender = false
      if (lap.type === 'lost') {
        if (!lost) { mustNotRender = true }

        title = (
          <div>
            <Icon type='close' style={{ color: 'red', marginRight: '5px' }}/>
            {i18n.t('Sheets.ball_loss')}
          </div>
        )
        content = `No: ${lap.name}, ${i18n.t('VideoPlayer.seekbar.ballLossDescription')}`
      } else if (lap.type === 'win') {
        if (!win) { mustNotRender = true }
        title = (
          <div>
            <Icon type='check' style={{ color: 'green', marginRight: '5px' }}/>
            {i18n.t('Sheets.ball_taken')}
          </div>
        )
        content = `No: ${lap.name}, ${i18n.t('VideoPlayer.seekbar.ballWinDescription')}`
      } else {
        if (!momentum) { mustNotRender = true }
        title = (
          <div>
            <Icon type='star' theme='filled' style={{ color: lap.name.color || 'yellow', marginRight: '5px' }}/>
            {i18n.t('VideoPlayer.seekbar.highlight')}
          </div>
        )
        content = lap.name.name
      }

      if (!this.context.editing) {
        let left = Math.round(lap.value) * 100 / Math.round((this.context.editing ? this.context.timePreview : this.context.player.duration) * 1000)

        if (oldLeft + 0.2 > left) {
          left = oldLeft + 0.2
        }
        oldLeft = left
        if (left <= 100) {
          if (mustNotRender) {
            render.push(<div style={{ display: 'none' }} />)
          } else {

            render.push(
              <Popover content={content} title={title} key={key}>
                <div
                  className={'arrow_box'}
                  style={{
                    left: `${left}%`,
                  }}
                  onClick={async () => {
                    await this.context.setCurrentTime(Math.round((lap.value - 5000) / 1000))
                    setTimeout(async () => {
                      await this.context.startEdit(Math.round((lap.value - 5000) / 1000))
                      if (lap.type === 'moment') {
                        this.props.handleChangeCutFormSelectedTags([lap.name])
                        this.props.handleChangeCutFormTitle(lap.name.name)
                      } else {
                        this.props.handleChangeCutFormSelectedTags([])
                        this.props.handleChangeCutFormTitle(lap.type === 'win' ? `No: ${lap.name}, ${i18n.t('VideoPlayer.seekbar.ballWin')}` : `No: ${lap.name}, ${i18n.t('VideoPlayer.seekbar.ballLoss')}`)
                      }
                    })
                  }}
                >
                  {key + 1}
                </div>
              </Popover>
            )
          }
        }
      }
      return null
    })
    return render
  }

  render () {
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
        {this.context.player && this.props.laps && this.props.laps.length > 0 && this.renderLaps()}
        {!this.state.modal && !this.context.editing && this.context.playlist && this.context.playlist.cuts.map(cut => (
          <Popover content={(
            <div key={cut._id} className='b-cut-playlist-item' onClick={() => { this.setState({ modal: true, cut }) }} style={{ width: '300px' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', marginRight: '15px' }}>
                  <img src={cut.poster} className='b-cut-playlist-item-thumb' />
                </div>
                <div style={{ flex: 1 }}>
                  <div className='b-cut-playlist-item-title' style={{ color: 'white' }}>{ cut.title }</div>
                  <div className='b-cut-playlist-item-desc'>{ cut.description || cut.about }</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className='b-cut-playlist-item-themes'>{ cut.tags && cut.tags.map((tag, key) => <div style={{ background: tag.color }} key={key}>{ tag.name }</div>) }</div>
              </div>
            </div>
          )} key={cut._id}>
            <div style={{ width: '4px', height: '4px', backgroundColor: this.currentTimePercent > cut.startAt * 100 / this.props.duration ? 'grey' : 'white', position: 'absolute', top: '0%', left: `${cut.startAt * 100 / this.props.duration}%`, zIndex: 8 }} />
          </Popover>
        ))}
        {!this.state.modal && !this.props.isTrying && this.context.editing && this.props.drawings && this.props.drawings.map((draw, key) => {
          const urlCreator = window.URL || window.webkitURL
          const imageUrl = urlCreator.createObjectURL(draw.file)
          return (
            <Popover content={(
              <div key={key} className='b-cut-playlist-item' style={{ minWidth: '300px' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', marginRight: '15px' }}>
                    <img src={imageUrl} className='b-cut-playlist-item-thumb'/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className='b-cut-playlist-item-title' style={{ color: 'white' }}>{i18n.t('Common_word.time')}: { draw.time }</div>
                  </div>
                </div>
              </div>
            )} key={key}>
              <div style={{ width: '4px', height: '4px', backgroundColor: '#2CC1EB', position: 'absolute', top: '0%', left: `${(draw.time - this.context.getStartOffset()) * 100 / this.context.getTimePreview()}%`, zIndex: 8 }} />
            </Popover>
          )
        })}
        {this.state.modal && (
          <ModalVideo closeCut={() => { this.setState({ modal: false }) }} cut={this.state.cut}/>
        )}
        <Draggable ref='bar' className='b-video-player-seek-bar' onDragStart={this.handleSeekDrag} onDrag={this.handleSeekDrag}>
          <Draggable
            className='b-video-player-seek-bar-cursor'
            style={{ left: `${this.currentTimePercent}%` }}
            onDrag={this.handleCursorDrag}
          />
          { !this.context.editing && (<div className='b-video-player-seek-bar-elapsed' style={{ width: `${this.currentTimePercent}%` }} />) }
          { this.context.editing && (<div className='b-video-player-seek-bar-cut-segment' style={{ left: `${this.clipStartPercent}%`, width: `${this.clipEndPercent}%` }} />) }
        </Draggable>
      </div>
    )
  }
}
