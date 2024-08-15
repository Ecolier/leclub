import React from 'react'
import { Checkbox } from 'antd'
import i18n from 'i18n-js'
import '@/i18n.js'

export default class extends React.PureComponent {

  get onFiltersChange () {
    return this.props.onFiltersChange
  }

  get filters () {
    return this.props.filters || {}
  }

  render () {
    return (
      <div style={{ backgroundColor: 'black', padding: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Checkbox onChange={e => { this.onFiltersChange({ ...this.filters, lost: !this.filters.lost }) }} checked={this.filters.lost} style={{ color: '#2CC1EB', fontFamily: 'Roboto' }}>{i18n.t('VideoPlayer.seekbar.ballLoss')}</Checkbox>
        <Checkbox onChange={e => { this.onFiltersChange({ ...this.filters, win: !this.filters.win }) }} checked={this.filters.win} style={{ color: '#2CC1EB', fontFamily: 'Roboto' }}>{i18n.t('VideoPlayer.seekbar.ballWin')}</Checkbox>
        <Checkbox onChange={e => { this.onFiltersChange({ ...this.filters, momentum: !this.filters.momentum }) }} checked={this.filters.momentum} style={{ color: '#2CC1EB', fontFamily: 'Roboto' }}>{i18n.t('VideoPlayer.seekbar.highlight')}</Checkbox>
      </div>
    )
  }
}
