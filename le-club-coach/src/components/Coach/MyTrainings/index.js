import React from 'react'
import { Divider, Col, Row } from 'antd'
import moment from 'moment'
import { upperFirst } from 'lodash'
import { useStoreon } from 'storeon/react'

import TeamSwitcher from '../TeamSelect/switcher'
import SeasonSelect from '../HomeV2/seasonSelect'
import CreateTrainingButton from '../TrainingCreate/button'
import TrainingCard from './card'
import i18n from 'i18n-js'
import '@/i18n'
import './my_trainings.scss'

class MyTrainings extends React.PureComponent {

  renderTrainings = () => {
    const groups = this.getGroupedTrainingsByMonth()
    return (
      <div>
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ marginBottom: 20, fontSize: 18 }}>{upperFirst(g.label)}</div>
            <div className={'my_trainings_container'}>
              {g.trainings.map(training => (
                <TrainingCard key={training._id} training={training} />
              ))}
            </div>
            <Divider />
          </div>
        ))}
      </div>
    )
  }

  getGroupedTrainingsByMonth () {
    const groups = {}
    const trainings = this.props.trainings
    for (const m of trainings) {
      const date = moment(m.date)
      const label = date.format('MMMM - YYYY')
      groups[label] = groups[label] || {
        date,
        label,
        trainings: [],
      }
      groups[label].trainings.push(m)
    }
    return Object.keys(groups)
      .map(k => {
        const group = groups[k]
        group.trainings.sort((m1, m2) => moment(m2.date).unix() - moment(m1.date).unix())
        return group
      })
      .sort((g1, g2) => g1.date - g2.date)
  }

  render () {
    const Trainings = this.renderTrainings

    return (
      <div className={'leClub-coach-my-trainings'}>
        <Row>
          <Col>
            <div>
              <div className={'my_trainings_header_title'}>
                <h2>{i18n.t('Common_word.my_trainings')}</h2>
                <SeasonSelect />
              </div>
              <div className={'my_trainings_button_container'}>
                <div className={'my_trainings_select_container'}>
                  <p>{i18n.t('Common_word.my_team')}</p>
                  <TeamSwitcher/>
                </div>
                <CreateTrainingButton />
              </div>
            </div>
            <Divider />
            <Trainings />
          </Col>
        </Row>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coachSeason, trainings } = useStoreon('coachSeason', 'trainings')
  const { currentSeason } = coachSeason
  const currentTeam = currentSeason.team
  const seasonDate = currentSeason.season
  const props = {
    ...initialProps,
    dispatch,
    currentTeam,
    seasonDate,
    trainings: Object.keys(trainings)
      .map(k => trainings[k])
      .filter(t => t.season === seasonDate)
      .filter(t => t.team === currentTeam),
  }
  return <MyTrainings {...props} />
}
