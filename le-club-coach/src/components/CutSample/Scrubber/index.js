import './style.scss'

import React, { PureComponent } from 'react'
import moment from 'moment'

import Draggable from '../Draggable'
import { ClipContext } from '../context'
import RangeDragger from './rangeDragger'
import { callApi } from '@/utils/callApi'
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

  state = {
    scrub: undefined,
    laps: [],
  }

  static contextType = ClipContext

  handleMinDrag = (pos) => {
    const { width, left } = this.state.scrub.getBoundingClientRect()
    const ratio = (pos - left) / width
    const max = 1
    const min = 0

    const r = Math.max(Math.min(ratio, max), min)
    this.context.setClipStart(this.context.timePreview * r)
  }

  handleMaxDrag = (pos) => {
    const { width, left } = this.state.scrub.getBoundingClientRect()
    const ratio = (pos - left) / width
    const max = 1
    const min = 0

    const r = Math.max(Math.min(ratio, max), min)
    this.context.setClipEnd(this.context.timePreview * r)
  }

  get currentTimePercent () {
    return (this.context.currentTime / this.context.timePreview) * 100
  }

  get clipEndPercent () {
    return (this.context.clipEnd - this.context.clipStart) / this.context.timePreview * 100
  }

  get clipStartPercent () {
    return (this.context.clipStart / this.context.timePreview) * 100
  }

  get formattedStartTime () {
    return moment.utc(this.context.clipStart * 1000).format('HH:mm:ss')
  }

  get formattedEndTime () {
    return moment.utc(this.context.clipEnd * 1000).format('HH:mm:ss')
  }

  get formattedCurrentTime () {
    return moment.utc((this.context.startOffset + this.context.currentTime) * 1000).format('HH:mm:ss')
  }

  get maxClipDuration () {
    return this.context.maxTime
  }

  get clipDuration () {
    return Math.round(this.context.clipEnd - this.context.clipStart)
  }

  handleDoubleClick = (key) => {
    return () => {
      const player = this.context.player
      if (player) {
        player.seek(this.context.startOffset + this.context[key])
      }
    }
  }

  startEdit = () => {
    this.context.startEdit()
  }

  renderTicks = () => {
    const n = Math.floor(this.context.timePreview / 5)
    const ticks = []
    const padding = 100 / n
    for (let i = 0; i < n; i++) {
      const props = {
        key: i,
        className: [
          'b-cut-scrubbing-tick',
          i % 6 === 0 && 'b-cut-scrubbing-tick--main',
        ].filter(v => !!v).join(' '),
        style: {
          left: `calc(${padding * i}% + 1px)`,
        },
      }
      ticks.push(React.createElement('div', props, null))
    }
    return ticks
  }

  render () {

    const { editing } = this.context

    if (!editing) {
      return (
        <div className='b-cut-scrubbing' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button className='b-button b-button--small b-button--primary' onClick={this.startEdit}>{i18n.t('VideoPlayer.scrubber.takeClip')}</button>
        </div>
      )
    }

    return (
      <div className='b-cut-scrubbing' ref={(elem) => { this.setState({ scrub: elem }) }}>
        <div className='b-cut-scrubbing-inner'>
          <div className='b-cut-scrubbing-ticks'>
            { this.renderTicks() }
          </div>
          <div className='b-cut-scrubbing-range' style={{ left: `${this.clipStartPercent}%`, width: `${this.clipEndPercent}%` }}>
            <div className='b-cut-infos'>
              <div>{this.clipDuration}s / {this.maxClipDuration}s</div>
              <div>{this.formattedStartTime} - {this.formattedEndTime}</div>
            </div>
            <RangeDragger scrub={this.state.scrub} />
            <Draggable
              className='b-cut-scrubbing-range-controller'
              onDrag={this.handleMinDrag}
              onDoubleClick={this.handleDoubleClick('clipStart')}
            />
            <Draggable
              className='b-cut-scrubbing-range-controller'
              onDrag={this.handleMaxDrag}
              onDoubleClick={this.handleDoubleClick('clipEnd')}
            />
          </div>
        </div>
      </div>
    )
  }
}
