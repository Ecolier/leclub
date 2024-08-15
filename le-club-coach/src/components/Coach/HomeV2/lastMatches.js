import './lastMatches.scss'
import React from 'react'
import moment from 'moment'
import { connectStoreon } from 'storeon/react'
import MatchCard from '../../Coach/MatchCard'
moment.locale('fr')

class LastMatches extends React.Component {
  getLastMatches = () => {
    const { currentSeason } = this.props

    const currentTeam = currentSeason.team
    const season = currentSeason.season

    return Object.keys(this.props.matches)
      .map(k => this.props.matches[k])
      .filter(m => m.type !== 'custom')
      .filter(m => m.teamHome && m.teamAway)
      .filter(m => m.teamHome._id === currentTeam || m.teamAway._id === currentTeam)
      .filter(m => m.season === season)
      .filter(m => moment().unix() > moment(m.date).unix())
      .sort((m1, m2) => moment(m2.date).unix() - moment(m1.date).unix())
      .slice(0, 5)
  }

  render () {
    if (!this.props.currentSeason) {
      return null
    }
    return (
      <div className='last-matches'>
        <div className='last-matches-match-list'>
          {this.getLastMatches().map(m => (
            <MatchCard key={m._id} match={m} team={this.props.currentSeason.team} />
          ))}
        </div>
      </div>
    )
  }
}

export default connectStoreon('coach', 'currentSeason', 'matches', LastMatches)
