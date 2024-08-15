import React, { PureComponent } from 'react'
import './style.scss'

export default class extends PureComponent {

  state = {
    selected: [],
  }

  toggleItem = (item) => {
    return () => {
      const selected = [...this.props.selected || this.state.selected]
      const index = selected.findIndex(s => s.name === item.name)
      const exists = index >= 0

      if (!exists) {
        selected.push(item)
      } else {
        selected.splice(index, 1)
      }
      this.setState({ selected })
      this.props.onChange(selected)
    }
  }

  renderItems = () => {
    return this.props.themes && this.props.themes.map(t => {
      const selected = (this.props.selected ? this.props.selected.findIndex(s => s.name === t.name) : -1) >= 0
      const classNames = `theme-button ${selected ? 'theme-button--selected' : ''}`
      return (
        <div key={t.name} className={classNames} style={{ background: selected ? t.color : '#aaa' }} onClick={this.toggleItem(t)}>{ t.name }</div>
      )
    })
  }

  render () {
    return (
      <div className='themes-picker'>{ this.renderItems() }</div>
    )
  }
}
