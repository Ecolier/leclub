import './homeV2.scss'
import React from 'react'
import { Row, Col } from 'antd'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import i18n from 'i18n-js'

import LastMatches from './lastMatches'
import SeasonStats from './seasonStats'
import SeasonPlayersStats from './seasonPlayersStats'
import SeasonSelect from './seasonSelect'
import FakeMatchCard from '../MatchCard/fake'
import TeamSwitcher from '../TeamSelect/switcher'
import FastUpload from '../FastUpload'
import MatchCreateButton from '../MatchCreate/button'
import TrainingCreateButton from '../TrainingCreate/button'
import '@/i18n'

class HomeV2 extends React.PureComponent {

  renderSection = (props) => (
    <div className='dashboard-section'>
      <div className='dashboard-section-title'>
        <div>
          <h1 style={{ display: 'inline-block' }}>{props.title}</h1>
        </div>
        {props.actions}
      </div>
      <div className='dashboard-inner'>
        {props.children}
      </div>
    </div>
  )

  render () {
    const Section = this.renderSection

    // const { club, team, season } = this.props.coachSeason.currentSeason
    const { hideSequencageTry } = this.props.coach

    return (
      <div className='leClub-coach-dashboard'>
        <Row style={{ padding: 0 }}>
          <Col style={{ marginBottom: 20 }}>
            <Section title={i18n.t('HomeV2.my_season.title')}>
              <div className={'dashboard_select_container'}>
                <div className={'dashboard_select'}>
                  <p>{i18n.t('HomeV2.my_season.my_team')}</p>
                  <TeamSwitcher/>
                </div>
                <div className={'dashboard_select'}>
                  <p>{i18n.t('HomeV2.my_season.title')}</p>
                  <SeasonSelect/>
                </div>
              </div>
            </Section>
          </Col>

          {!hideSequencageTry && (
            <Col style={{ margin: '20px 0' }}>
              <FakeMatchCard/>
            </Col>
          )}

          <Col style={{ margin: '20px 0' }}>
            <Section title={i18n.t('HomeV2.platform_shortcuts.title')}>
              <div className={'dashboard_shortcut_button_container'}>
                <MatchCreateButton/>
                <TrainingCreateButton/>
              </div>
              <FastUpload/>
            </Section>
          </Col>
          <Col>
            <Section title={i18n.t('HomeV2.last_matches.title')} actions={(
              <a onClick={() => this.props.dispatch(router.navigate, '/coach/matches')}>{i18n.t('HomeV2.see_all')}</a>
            )}>
              <LastMatches/>
            </Section>
          </Col>
          <Col>
            <Section title={i18n.t('HomeV2.season_stats.title')}>
              {/* <SeasonStats season={season} team={team}/> */}
            </Section>
          </Col>
          <Col>
            <Section title={i18n.t('HomeV2.most_used_players.title')} actions={(
              <a onClick={() => this.props.dispatch(router.navigate, '/coach/players')}>{i18n.t('HomeV2.see_all')}</a>
            )}>
              {/* <SeasonPlayersStats season={season} team={team} club={club} limit={10}/> */}
            </Section>
          </Col>
        </Row>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coachSeason, coach } = useStoreon('coachSeason', 'coach')
  return React.createElement(HomeV2, {
    ...initialProps,
    dispatch,
    coach,
    coachSeason,
  })
}
