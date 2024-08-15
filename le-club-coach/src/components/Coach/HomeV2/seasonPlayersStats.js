import React from 'react'
import { useStoreon } from 'storeon/react'
import { Spin, Table, Avatar } from 'antd'
import { callApi } from '@/utils/callApi'
import i18n from 'i18n-js'
import '@/i18n'
import MediaQuery from 'react-responsive'
import MobileTable from '../../MobileTable/MobileTable'

const PlayerHeader = (props) => {
  const { data } = props
  const user = data.user

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size={'large'} shape={'circle'} alt={user.firstName || ''} style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)', marginRight: '10px' }} src={user.picture || 'https://d1ceovtllg6jml.cloudfront.net/defaultprofile.svg'} />
        <p>{`${user.firstName} ${user.lastName}`}</p>
      </div>
    </div>
  )
}

const PlayerDetails = (props) => {
  const { data } = props

  return (
    <div>
      <p><b>{i18n.t('Common_word.played_matches')}:</b> {data.matchPlay}</p>
      <p><b>{i18n.t('Common_word.position')}:</b> {data.whichSide}</p>
      <p><b>G/N/P:</b> {`${data.matchWin}/${data.matchPlay - (data.matchWin + data.matchLost)}/${data.matchLost}`}</p>
      <p><b>{`% ${i18n.t('Common_word.victory')}`}:</b> {Number.isNaN((data.matchWin / data.matchPlay * 100)) ? '-' : `${(data.matchWin / data.matchPlay * 100).toFixed(0)}%`}</p>
      <p><b>{i18n.t('Common_word.goal')}:</b> {data.buts}</p>
      <p><b>{i18n.t('Common_word.assists')}:</b> {data.passesD}</p>
      <p><b>{i18n.t('Common_word.average_rating')}:</b> {Number.isNaN(parseFloat(data.note)) ? '-' : parseFloat(data.note)}</p>
    </div>
  )
}

class SeasonPlayersStats extends React.Component {

  componentDidMount () {
    this._isMounted = true
    this.fetchPlayers()
  }

  componentDidUpdate (prevProps) {
    if (this.props.team !== prevProps.team) {
      this.fetchPlayers()
    }
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  state = {
    players: undefined,
    loading: false,
  }

  fetchPlayers = () => {
    const { season, team, club } = this.props
    if (!club || !team || !season) {
      return
    }
    const coachId = this.props.coach._id
    this.setState({ loading: true })
    callApi(`${coachId}/club/${club._id}/team/${team}/players?season=${season}`).then(data => {
      if (this._isMounted) {
        const players = [...data.players]
          .sort((p1, p2) => p2.matchPlay - p1.matchPlay)
          .slice(0, 10)
        this.setState({ players, loading: false })
      }
    })
  }

  columns = [
    {
      title: i18n.t('Common_word.player_name'),
      dataIndex: 'user',
      key: 'name',
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      title: i18n.t('Common_word.played_matches'),
      dataIndex: 'matchPlay',
      key: 'played',
    },
    {
      title: i18n.t('Common_word.position'),
      dataIndex: 'whichSide',
      key: 'pos',
    },
    {
      title: 'G/N/P',
      key: 'gnp',
      render: (v, { matchPlay, matchWin, matchLost }) => {
        const matchDraw = matchPlay - (matchWin + matchLost)
        return `${matchWin}/${matchDraw}/${matchLost}`
      },
    },
    {
      title: `% ${i18n.t('Common_word.victory')}`,
      key: 'winPercent',
      render: (v, { matchPlay, matchWin }) => {
        const percent = matchWin / matchPlay * 100
        return Number.isNaN(percent) ? '-' : `${percent.toFixed(0)}%`
      },
    },
    {
      title: i18n.t('Common_word.goal'),
      dataIndex: 'buts',
      key: 'goals',
    },
    {
      title: i18n.t('Common_word.assists'),
      dataIndex: 'passesD',
      key: 'assists',
    },
    {
      title: i18n.t('Common_word.average_rating'),
      dataIndex: 'note',
      key: 'note',
      render: (text) => {
        const note = parseFloat(text)
        return Number.isNaN(note) ? '-' : note
      },
    },
  ]

  render () {
    const { players } = this.state
    if (this.state.loading) {
      return <Spin />
    }
    if (!players) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ color: '#888', fontSize: 18 }}>{i18n.t('Common_word.no_player_found')}</span>
        </div>
      )
    }
    return (
      <React.Fragment>
        <MediaQuery minDeviceWidth='1200px'>
          {(matches) =>
            matches
              ? <Table scroll={{ x: 'max-content' }} dataSource={players} columns={this.columns} pagination={false} rowKey='_id' bordered/>
              : <MobileTable
                dataSource={players}
                InCollapse={PlayerDetails}
                InVisible={PlayerHeader}
              />
          }
        </MediaQuery>
      </React.Fragment>
    )
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  return React.createElement(SeasonPlayersStats, {
    ...initialProps,
    dispatch,
    coach,
  })
}
