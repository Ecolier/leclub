import React from 'react'
import { useStoreon } from 'storeon/react'
import { getMatchSheet, fetchMatch, fetchMatchPlayers } from '@/actions/matches'

import Banner from './banner'
import Statistic from './stats'
import Players from './players'
import Settings from './settings'

class MatchSheet extends React.PureComponent {

  componentDidMount () {
    this.fetchSheet()
    fetchMatchPlayers(this.props.matchId)

    // Since we fetch all match of current season
    // If match season is different of currentSeason we need to fetch match manually
    // Maybe: Switch current season to the match season
    if (!this.props.matchSeason !== this.props.currentSeason.season) {
      fetchMatch(this.props.matchId)
    }
  }

  state = {
    sheet: undefined,
  }

  async fetchSheet () {
    const sheet = await getMatchSheet(this.props.matchId)
    this.setState({ sheet })
  }

  handleSheetUpdate = (data) => {
    const sheet = Object.assign({}, { ...this.state.sheet }, data)
    this.setState({ sheet })
  }

  render () {

    // since we inject upload state in our match, we need to check another key to make sure we fetched match
    // here we use season field :)
    if (!this.props.match || !this.props.match.season || !this.state.sheet) {
      return null
    }

    return (
      <div>
        <Banner match={this.props.match} />
        <Settings match={this.props.match} sheet={this.state.sheet} onSheetUpdate={this.handleSheetUpdate} />
        <Statistic match={this.props.match} sheet={this.state.sheet} />
        <Players match={this.props.match} />
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, matches, coachSeason } = useStoreon('matches', 'coachSeason')
  return React.createElement(MatchSheet, {
    ...initialProps,
    dispatch,
    currentSeason: coachSeason.currentSeason,
    match: matches[initialProps.matchId],
  })
}
