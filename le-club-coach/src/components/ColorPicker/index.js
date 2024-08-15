import React, { Component } from 'react'
import { CirclePicker, ChromePicker } from 'react-color'

class colorPicker extends Component {

  componentDidMount () {
    const circlePicker = document.getElementsByClassName('circle-picker')
    for (let i = 0; circlePicker[i]; i++) {
      circlePicker[i].style.width = 'auto'
      circlePicker[i].style.marginBottom = '0'
      circlePicker[i].style.marginRight = '0'
    }
  }

  state = {
    visible: false,
    color: this.props.initialValue,
  }

  chromeVisibility = () => {
    const etat = !this.state.visible
    this.setState({ visible: etat, color: 'fff' })
  }

  render () {

    const { color } = this.state
    const { changeColor, params } = this.props

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
          <CirclePicker
            color={color}
            onChangeComplete={(e) => { this.setState({ color: e }); changeColor({ value: e, whichOne: params }) }}
            style={{ width: '100%' }}
          />
          <a onClick={() => { this.chromeVisibility() }}>...autres</a>
        </div>
        { this.state.visible ? (
          <ChromePicker
            color={color}
            onChangeComplete={(e) => { this.setState({ color: e }); changeColor({ value: e, whichOne: params }) }}
            disableAlpha={false}
          />
        ) : null }
      </div>
    )
  }
}
export default colorPicker
