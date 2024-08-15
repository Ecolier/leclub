import React from 'react'
import { useStoreon } from 'storeon/react'
import Banner from './banner'
import Settings from './settings'

class TrainingSheet extends React.PureComponent {

  render () {
    if (!this.props.training || !this.props.training.season) {
      return null
    }

    return (
      <div>
        <Banner training={this.props.training} />
        <Settings training={this.props.training} />
      </div>
    )
  }
}

export default (initialProps) => {
  const { coachSeason, trainings } = useStoreon('coachSeason', 'trainings')
  const { currentSeason } = coachSeason
  const props = {
    ...initialProps,
    currentSeason,
    training: trainings[initialProps.trainingId],

  }
  return React.createElement(TrainingSheet, props)
}
