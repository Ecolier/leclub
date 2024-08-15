import React from 'react'
import { Spin, Row, Col } from 'antd'
import { useStoreon } from 'storeon/react'
import { callApi } from '@/utils/callApi'
import BarChart from '../../Charts/BarCharts/BarCharts'
import i18n from 'i18n-js'
import '@/i18n'
import './seasonStats.scss'

class SeasonStats extends React.Component {

  componentDidMount () {
    this._isMounted = true
    this.fetchStats()
  }

  componentDidUpdate (prevProps) {
    if (this.props.team !== prevProps.team) {
      this.fetchStats()
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  state = {
    stats: undefined,
    loading: false,
  }

  fetchStats = () => {
    const { season, team } = this.props
    const coachId = this.props.coach._id
    this.setState({ loading: true })
    callApi(`coach/${coachId}/stats?season=${season}&team=${team}`).then(data => {
      if (this._isMounted) {
        this.setState({ stats: data.stats, loading: false })
      }
    })
  }

  formatVictoryPercent = (v) => {
    return Number.isNaN(v) ? 'N/A' : `${v.toFixed(0)} %`
  }

  render () {
    const { stats } = this.state
    const { season } = this.props
    if (this.state.loading) {
      return <Spin/>
    }
    if (!stats) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: 18 }}>{i18n.t('HomeV2.season_stats.noStats')}: {season}</span>
        </div>
      )
    }
    return (
      <React.Fragment>
        <Row gutter={24}>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.matchPlay}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('Common_word.played_matches')}</p>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.matchWin}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('Common_word.victory')}</p>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.matchPlay > 0 ? stats.matchPlay - (stats.matchWin + stats.matchLost) : 0}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('Common_word.draw')}</p>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.matchLost}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('Common_word.defeat')}</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.goals.for}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('SeasonsStats.goal_for')}</p>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.goals.taken}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('SeasonsStats.goal_against')}</p>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {stats.averageTeamAge || 'N/A'}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('SeasonsStats.mean_age_team')}</p>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 6 }}>
            <div className={'statistic_card_container'}>
              <div className={'statistic_number'}>
                {this.formatVictoryPercent(stats.matchWin / stats.matchPlay * 100)}
              </div>
              <div className={'statistic_title'}>
                <p>{i18n.t('SeasonsStats.victory_percent')}</p>
              </div>
            </div>
          </Col>
        </Row>
        <div id={'graphic_container'}>
          <BarChart responsive data={stats.days} label={i18n.t('SeasonsStats.goal_for')} title={i18n.t('SeasonsStats.goal_for')}/>
          <BarChart responsive data={stats.days} label={i18n.t('SeasonsStats.goal_against')} title={i18n.t('SeasonsStats.goal_against')}/>
        </div>
      </React.Fragment>
    )
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  return React.createElement(SeasonStats, {
    ...initialProps,
    dispatch,
    coach,
  })
}
