import React, { Component, Fragment } from 'react'
import { useStoreon } from 'storeon/react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Card, Input } from 'antd'
import InfiniteScroll from '@/components/InfiniteScroller'
import { get } from 'superagent'
import { throttle } from 'lodash'
import './style.scss'
import { Cookies } from 'react-cookie'
import i18n from 'i18n-js'
import '@/i18n.js'

const { Meta } = Card
const cookies = new Cookies()
const token = cookies.get('googleGWP')

const PlayersList = props => {
  const { dispatch, name, page, players, refillPlayers, hasMore } = props

  const fetchMorePlayers = async (concat = false) => {
    const response = await get(`${process.env.WEBHOOK_URL_PLAYERS}?token=${token}&name=${name}&skip=${page * 20}`)
    refillPlayers(response.body.users, concat)
  }

  return (
    <InfiniteScroll
      pageStart={1}
      loadMore={() => fetchMorePlayers(true)}
      hasMore={hasMore}>
      <div
        className={'players-list'}>
        {players.map((item, key) => (
          <Card
            className={'player_card'}
            onClick={() => { dispatch(router.navigate, `/coach/player/${item._id.$oid}`) }}
            hoverable
            key={key}
            cover={
              <div style={{ width: '100%', height: '100%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img alt={item.name} src={item.picture || 'https://d1ceovtllg6jml.cloudfront.net/defaultprofile.svg'} style={{ height: '200px', width: 'auto', maxWidth: '100%', maxHeight: '100%' }} />
              </div>
            }>
            <Meta
              title={item.name || i18n.t('Common_word.noClub')}
              description={item.team || i18n.t('Common_word.noTeam')}
            />
          </Card>
        ))}
      </div>
    </InfiniteScroll>
  )
}

class Videos extends Component {

  componentDidMount () {
    window.scrollTo(0, 0)
    const select = document.getElementsByClassName('ant-select-selection--single')
    for (let i = 0; select[i]; i++) {
      select[i].style.height = '100%'
      select[i].style.display = 'flex'
      select[i].style.alignItems = 'center'
    }
    this.fetchPlayers()
  }

  state = {
    name: '',
    players: [],
    region: '',
    hasMoreItems: true,
    departement: '',
    level: '',
    category: '',
    regionKey: 0,
    page: 0,
    hasMore: true,
  }

  setHasMore = (value) => {
    this.setState({
      hasMore: value,
    })
  }

  fetchPlayers = throttle(async () => {
    const res = await get(`${process.env.WEBHOOK_URL_PLAYERS}?token=${token}&name=${this.state.name}&skip=${this.state.page}`)
    this.setState({ players: res.body.users || [], page: this.state.page + 1 })
  }, 700)

  handleChange = (value) => {
    this.setState({ name: value, page: 0, hasMore: true }, () => this.fetchPlayers())
  }

  refillPlayers = (players, concat = false) => {
    const state = {}
    if (!players || players.length !== 20) {
      state.hasMore = false
    } else if (!this.state.hasMore) {
      state.hasMore = true
    }
    if (concat) {
      state.players = this.state.players.concat(players)
      state.page = this.state.page + 1
    } else {
      state.players = players
      state.page = 0
    }
    this.setState(state)
  }

  render () {
    return (
      <Fragment>
        <div style={{ width: '100%', height: '300px' }} className='imgBack' />
        <div className={'players_cards_container'}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', zIndex: '10', marginTop: '-20px', marginBottom: '30px' }} className='ombre'>
            <Input placeholder={i18n.t('Players.inputPlaceholder')} onChange={(e) => this.handleChange(e.target.value)} value={this.state.name} style={{ width: '90%' }}/>
          </div>
          <PlayersList {...this.props} name={this.state.name} page={this.state.page} players={this.state.players} refillPlayers={this.refillPlayers} hasMore={this.state.hasMore}/>
        </div>
      </Fragment>
    )
  }
}

export default initialProps => {
  const { dispatch } = useStoreon()
  const props = {
    ...initialProps,
    dispatch,
  }
  return <Videos {...props} />
}
