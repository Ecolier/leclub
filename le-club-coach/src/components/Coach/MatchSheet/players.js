import React from 'react'
import { useStoreon } from 'storeon/react'
import { InputNumber, Select } from 'antd'
import EditableTable from '../EditableTable'
import MatchSection from './section'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'

const { Option } = Select

const positionsEnum = [
  i18n.t('FootballPositions.goalkeeper'),
  i18n.t('FootballPositions.left_defender'),
  i18n.t('FootballPositions.centre-backs'),
  i18n.t('FootballPositions.right_defender'),
  i18n.t('FootballPositions.defensive_midfielders'),
  i18n.t('FootballPositions.left_midfielders'),
  i18n.t('FootballPositions.midfielders'),
  i18n.t('FootballPositions.right_midfielders'),
  i18n.t('FootballPositions.offensive_midfielders'),
  i18n.t('FootballPositions.left_wingers'),
  i18n.t('FootballPositions.right_wingers'),
  i18n.t('FootballPositions.strikers'),
]

const PositionSelect = (props) => {
  return (
    <Select {...props}>
      {positionsEnum.map(v => (
        <Option key={v} value={v}>{v}</Option>
      ))}
    </Select>
  )
}

class MatchPlayers extends React.PureComponent {

  getVideo = () => {
    const { match, currentSeason } = this.props
    const isHome = match.teamHome._id === currentSeason.team
    return isHome ? match.videoHome : match.videoAway
  }

  removeRecord = (record, index) => {
    const { match, coach } = this.props
    const players = [...match.players]
    const matchId = match._id
    const playerId = record.user._id

    callApi(`${coach._id}/match/${matchId}/player/${playerId}`, 'put', { isActive: false }).then(res => {
      players[index].sheet = res.sheet
      this.props.dispatch({
        type: 'http/setMatchPlayers',
        data: { matchId, players },
      })
    })
  }

  handleTableChange = (value, record, index) => {
    const { match, coach } = this.props
    const players = [...match.players]
    const matchId = match._id
    const playerId = record.user._id

    callApi(`${coach._id}/match/${matchId}/player/${playerId}`, 'put', value).then(res => {
      players[index].sheet = res.sheet
      this.props.dispatch({
        type: 'http/setMatchPlayers',
        data: { matchId, players },
      })
    })
  }

  columns = [
    {
      title: i18n.t('Common_word.player_name'),
      dataIndex: 'user.completeName',
      key: 'player',
      render: (v) => v || '',
    },
    {
      title: i18n.t('Common_word.position'),
      dataIndex: 'sheet.position',
      key: 'position',
      render: v => v || 'N/A',
      renderEdit: () => <PositionSelect defaultOpen dropdownMatchSelectWidth={false} />,
    },
    {
      title: i18n.t('Common_word.number'),
      dataIndex: 'sheet.playerNumber',
      key: 'number',
      render: (v) => v || 'N/A',
      renderEdit: () => <InputNumber min={0} max={99} autoFocus />,
    },
    {
      title: i18n.t('Sheets.ball_loss'),
      dataIndex: 'sheet.ballLost',
      key: 'ballLost',
      render: v => v || 0,
      renderEdit: () => <InputNumber min={0} autoFocus />,
    },
    {
      title: i18n.t('Sheets.ball_taken'),
      dataIndex: 'sheet.ballWin',
      key: 'ballWin',
      render: v => v || 0,
      renderEdit: () => <InputNumber min={0} autoFocus />,
    },
    {
      title: i18n.t('Common_word.assists'),
      dataIndex: 'sheet.passesD',
      key: 'assists',
      render: v => v || 0,
      renderEdit: () => <InputNumber min={0} autoFocus />,
    },
    {
      title: i18n.t('Common_word.goal'),
      dataIndex: 'sheet.buts',
      key: 'goals',
      render: v => v || 0,
      renderEdit: () => <InputNumber min={0} autoFocus />,
    },
    {
      title: i18n.t('Common_word.rating'),
      dataIndex: 'sheet.note',
      key: 'note',
      render: v => v || 'N/A',
      renderEdit: () => <InputNumber min={0} max={10} autoFocus />,
    },
  ]

  renderDescription = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <div>{i18n.t('Sheets.team_players.description')}</div>
        <i style={{ fontSize: 14, color: '#EA178C' }}>{i18n.t('Sheets.team_players.advice')}</i>
      </div>
    )
  }

  render () {
    const SectionDescription = this.renderDescription
    return (
      <MatchSection title={i18n.t('Common_word.players')} description={<SectionDescription />}>
        <EditableTable
          style={{ width: '100%' }}
          dataSource={this.props.match.players}
          columns={this.columns}
          rowKey='_id'
          pagination={false}
          size='medium'
          onChange={this.handleTableChange}
          bordered
        />
      </MatchSection>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coachSeason, coach } = useStoreon('coachSeason', 'coach')
  const { currentSeason } = coachSeason
  const props = {
    ...initialProps,
    dispatch,
    coach,
    currentSeason,
  }

  return React.createElement(MatchPlayers, props)
}
