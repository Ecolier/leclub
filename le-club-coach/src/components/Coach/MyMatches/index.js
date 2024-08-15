import React from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, Col, Row, Select } from 'antd'
import { upperFirst } from 'lodash'
import moment from 'moment'
import TeamSwitcher from '../TeamSelect/switcher'
import SeasonSelect from '../HomeV2/seasonSelect'
import MatchCard from '../MatchCard'
import CreateMatchButton from '../MatchCreate/button'
import { fetchMatches } from '@/actions/matches'
import i18n from 'i18n-js'
import '@/i18n'
import './my_matches.scss'

const { Option } = Select

class MyMatches extends React.PureComponent {

  state = {
    filters: {
      type: '',
    },
  }

  getGroupedMatchesByMonth () {
    const groups = {}
    const matches = this.props.matches.filter(m => {
      const filters = this.state.filters
      return (
        filters.type !== '' ? m.type === filters.type : true
      )
    })
    for (const m of matches) {
      const date = moment(m.date)
      const label = date.format('MMMM - YYYY')
      groups[label] = groups[label] || {
        date,
        label,
        matches: [],
      }
      groups[label].matches.push(m)
    }
    return Object.keys(groups)
      .map(k => {
        const group = groups[k]
        group.matches.sort((m1, m2) => moment(m2.date).unix() - moment(m1.date).unix())
        return group
      })
      .sort((g1, g2) => g1.date - g2.date)
  }

  handleMatchTypeFilterChange = (type) => {
    const filters = { ...this.state.filters }
    filters.type = type
    this.setState({ filters })
  }

  renderMatchTypeSelect = () => {
    return (
      <Select value={this.state.filters.type} dropdownMatchSelectWidth={false} onChange={this.handleMatchTypeFilterChange}>
        <Option value=''>{i18n.t('Common_word.all')}</Option>
        <Option value='custom'>{i18n.t('Common_word.friendly')}</Option>
        <Option value='championship'>{i18n.t('Common_word.championship')}</Option>
        <Option value='cup'>{i18n.t('Common_word.cup')}</Option>
      </Select>
    )
  }

  renderMatches = () => {
    const groups = this.getGroupedMatchesByMonth()
    return (
      <div>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ marginBottom: 20, fontSize: 18 }}>{upperFirst(g.label)}</div>
            <div className={'my_matches_card_container'}>
              {g.matches.sort((a, b) => new Date(a.date) - new Date(b.date)).map(match => (
                <MatchCard key={match._id} match={match} team={this.props.currentTeam}/>
              ))}
            </div>
            <Divider />
          </div>
        ))}
      </div>
    )
  }

  render () {
    const Matches = this.renderMatches
    const MatchTypeSelect = this.renderMatchTypeSelect

    return (
      <div className={'leClub-coach-my-matches'}>
        <Row>
          <Col>
            <div>
              <div className={'my_matches_header_title'}>
                <h2>{i18n.t('Common_word.my_matches')}</h2>
                <SeasonSelect />
              </div>
              <div className={'my_matches_button_container'}>
                <div className={'my_matches_select_container'}>
                  <p>{i18n.t('Common_word.my_team')}</p>
                  <TeamSwitcher/>
                </div>
                <div className={'my_matches_select_container'}>
                  <p>{i18n.t('Common_word.match_type')}</p>
                  <MatchTypeSelect />
                </div>
                <div className={'my_matches_select_container'}>
                  <CreateMatchButton />
                </div>
              </div>
            </div>
            <Divider />
            <Matches />
          </Col>
        </Row>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coachSeason, matches } = useStoreon('coachSeason', 'matches')
  const currentSeason = coachSeason.currentSeason

  const currentTeam = currentSeason.team
  const seasonDate = currentSeason.season

  return React.createElement(MyMatches, {
    ...initialProps,
    dispatch,
    currentTeam,
    seasonDate,
    matches: Object.keys(matches)
      .map(k => matches[k])
      .filter(m => m.season === seasonDate)
      .filter(m => m.teamHome._id === currentTeam || m.teamAway._id === currentTeam),
  })
}
