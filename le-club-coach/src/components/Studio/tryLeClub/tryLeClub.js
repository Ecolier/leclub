import React, { PureComponent } from 'react'
import { ClipContextProvider } from '../../CutSample/context'
import ContentTryLeClub from './contentTryLeClub'
import { connectStoreon } from 'storeon/react'

class TryLeClub extends PureComponent {

  state = {
    drawings: [],
  }

  resetDrawings = () => {
    this.setState({ drawings: [] })
  }

  render () {
    return (
      <ClipContextProvider>
        <ContentTryLeClub {...this.props} />
      </ClipContextProvider>
    )
  }
}

export default connectStoreon('coach', TryLeClub)
