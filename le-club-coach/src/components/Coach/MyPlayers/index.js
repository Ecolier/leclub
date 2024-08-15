import React from 'react'
import { Divider, Col, Row } from 'antd'
import { useStoreon } from 'storeon/react'
import TeamSwitcher from '../TeamSelect/switcher'
import SeasonSelect from '../HomeV2/seasonSelect'
import SeasonPlayersStats from '../HomeV2/seasonPlayersStats'
import i18n from 'i18n-js'
import '@/i18n'
import './my_players.scss'

class MyPlayers extends React.PureComponent {

  render () {
    const { season, team, club } = this.props.currentSeason

    return (
      <div className={'leClub-coach-my-players'}>
        <Row>
          <Col>
            <div className={'my_players_header_title'}>
              <h2>{i18n.t('Common_word.my_players')}</h2>
              <SeasonSelect/>
            </div>
            <div className={'my_players_button_container'}>
              <div className={'my_players_select_container'}>
                <p>{i18n.t('Common_word.my_team')}</p>
                <TeamSwitcher/>
              </div>
            </div>
            <Divider/>
            <SeasonPlayersStats season={season} team={team} club={club}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coachSeason } = useStoreon('coachSeason')
  const { currentSeason } = coachSeason
  const props = {
    ...initialProps,
    dispatch,
    currentSeason,
  }
  return <MyPlayers {...props} />
}
