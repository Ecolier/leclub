import React, { PureComponent } from 'react'
import Player from '../../CutSample/Player'
import DrawingSidebar from './drawingSidebar'
import { ClipContext } from '../../CutSample/context'

class PlayerTryLeClub extends PureComponent {

    static contextType = ClipContext

    render () {
      return (
        <Player
          source='https://d1ceovtllg6jml.cloudfront.net/ballin_8eme_france_argentine_demo_cut_sequencage.mp4'
          drawingsV2={this.props.drawings}
          coachId={this.props.coach._id}
          currentTime={this.context.currentTime}
          handleChangeCutFormTitle={this.handleChangeCutFormTitle}
          handleChangeCutFormSelectedTags={this.handleChangeCutFormSelectedTags}
          drawingElement={this.context.editing && (<DrawingSidebar drawings={this.props.drawings} pushDrawings={this.props.pushDrawings}/>)}
          isTrying
        />
      )
    }
}

export default PlayerTryLeClub
