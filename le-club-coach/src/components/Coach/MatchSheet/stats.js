import React from 'react'
import MatchSection from './section'
import { Card, Statistic } from 'antd'
import moment from 'moment'
import i18n from 'i18n-js'
import '@/i18n'

class MatchStats extends React.PureComponent {

  renderCard = (props) => {
    return (
      <Card style={{ minWidth: 270, margin: 10 }}>{props.children}</Card>
    )
  }

  renderSuffix = (props) => {
    return (
      <span style={{ color: '#888', fontSize: '13px' }}>{props.children}</span>
    )
  }

  getAverageNote = () => {
    const players = (this.props.match.players || []).filter(({ sheet }) => sheet && sheet.note !== undefined)
    return players.reduce((acc, { sheet }) => acc + parseInt(sheet.note, 10), 0) / players.length
  }

  formatNote = (v) => {
    if (v === 0 || Number.isNaN(v)) {
      return '-'
    }
    return v.toFixed(2)
  }

  render () {
    const Card = this.renderCard
    const Suffix = this.renderSuffix
    const players = this.props.match.players || []

    const ballLost = players.reduce((acc, { sheet }) => acc + parseInt(((sheet && sheet.ballLost) || 0), 10), 0)
    const ballWin = players.reduce((acc, { sheet }) => acc + parseInt(((sheet && sheet.ballWin) || 0), 10), 0)
    const averageAge = players.reduce((acc, { user }) => acc + moment().diff(user && user.birthdate, 'years'), 0) / players.length || 'N/A'
    return (
      <MatchSection title={i18n.t('Common_word.statistics')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1200, width: '100%' }}>
          <Card>
            <Statistic title={i18n.t('Sheets.ball_taken')} value={ballWin} />
          </Card>
          <Card>
            <Statistic title={i18n.t('Sheets.ball_loss')} value={ballLost} />
          </Card>
          <Card>
            <Statistic title={i18n.t('Sheets.mean_age')} value={averageAge} />
          </Card>
          <Card>
            <Statistic title={i18n.t('Sheets.mean_players_rating')} formatter={this.formatNote} value={this.getAverageNote()} suffix={<Suffix>/ 10</Suffix>} />
          </Card>
        </div>
      </MatchSection>
    )
  }
}

export default MatchStats
