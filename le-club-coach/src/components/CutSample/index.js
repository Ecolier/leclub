import './style.scss'
import React, { PureComponent } from 'react'
import { ClipContextProvider } from './context'
import Content from './content'

export default class extends PureComponent {
  render () {
    return (
      <ClipContextProvider>
        <Content {...this.props} />
      </ClipContextProvider>
    )
  }
}
