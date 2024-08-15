import React from 'react'
import { Tooltip, Icon } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

export default class extends React.PureComponent {

  renderTooltip = (props) => {
    switch (this.props.match.type) {
    case 'championship':
      return <Tooltip title={i18n.t('Common_word.championship')}>{ props.children }</Tooltip>
    case 'cup':
      return <Tooltip title={i18n.t('Common_word.cup')}>{ props.children }</Tooltip>
    case 'custom':
      return <Tooltip title={i18n.t('Common_word.friendly')}>{ props.children }</Tooltip>
    default:
      return <Tooltip title='???'>{ props.children }</Tooltip>
    }
  }

  renderIcon = () => {
    switch (this.props.match.type) {
    case 'championship':
      return <Icon type='star' />
    case 'cup':
      return <Icon type='trophy' />
    case 'custom':
      return <Icon type='team' />
    default:
      return <Icon type='rocket' />
    }
  }

  render = () => {
    const Tooltip = this.renderTooltip
    const Icon = this.renderIcon
    return (
      <Tooltip><div><Icon /></div></Tooltip>
    )
  }
}
