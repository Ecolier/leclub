import React, { Component } from 'react'
import { Input, Button, Select, Slider } from 'antd'
import { updateStudioPref } from '@/actions/coach'
import { CirclePicker, ChromePicker } from 'react-color'
import { callApi } from '@/utils/callApi'
import { useStoreon } from 'storeon/react'
import i18n from 'i18n-js'
import '@/i18n.js'

const WAIT_INTERVAL = 700

const Option = Select.Option

class LeClubStudioPref extends Component {
  componentDidMount () {
    const circlePicker = document.getElementsByClassName('circle-picker')
    for (let i = 0; circlePicker[i]; i++) {
      circlePicker[i].style.width = 'auto'
      circlePicker[i].style.marginBottom = '0'
      circlePicker[i].style.marginRight = '0'
    }
  }

  state = {
    visible: false,
    tagName: '',
    color: this.props.initialValue,
    tagsPlayer: [],
    listName: '',
  }

  chromeVisibility = () => {
    const etat = !this.state.visible
    this.setState({ visible: etat, color: 'fff' })
  }

  handleSearch = (value) => {
    const id = this.props.coach._id
    callApi(`service/searchUser/${id}?page=${0}&name=${value}&club=${this.props.coach.club._id}`, 'get').then(body => {
      const data = []
      body.users.forEach((e, key) => {
        data.push(<Option key={key} style={{ margin: '15px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}><p>{`${e.completeName}`}</p></Option>)
      })
      this.setState({
        playerName: value,
        dataSource: data,
        players: body.users,
      })
    }).catch((e) => { return e })

  }
  handleSelect = (e) => {
    const { players, tagsPlayer } = this.state
    tagsPlayer.push({ name: players[e].completeName, _id: players[e]._id })
    this.setState({ tagsPlayer, playerName: '' })

  }
  handleChange = (e) => {
    clearTimeout(this.timer)
    this.setState({ playerName: e })
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL)
  }

  triggerChange = () => { this.handleSearch(this.state.playerName) }

  render () {
    const { color, tagName } = this.state
    return (

      <div style={{ padding: '20px' }}>
        <h2>{i18n.t('StudioPreference.theme.title')}</h2>
        <h3 style={{ marginBottom: '10px' }}>{i18n.t('StudioPreference.theme.explanation')}</h3>
        <h4>{i18n.t('StudioPreference.theme.name')}:</h4>
        <Input style={{ width: '80%' }} value={tagName} onChange={(e) => { this.setState({ tagName: e.target.value }) }}/>
        <h4 style={{ marginTop: '10px' }}>{i18n.t('StudioPreference.theme.color')}:</h4>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}>
            <CirclePicker
              color={color}
              onChangeComplete={(e) => { this.setState({ color: e }) }}
              style={{ width: '100%' }}
            />
            <a onClick={() => { this.chromeVisibility() }}>{i18n.t('Common_word.other')}</a>
          </div>
          { this.state.visible ? (
            <ChromePicker
              color={color}
              onChangeComplete={(e) => { this.setState({ color: e }) }}
              disableAlpha={false}
            />
          ) : null }
        </div>
        <Button type='primary' onClick={() => {
          if (this.state.color && this.state.tagName) {
            const playerList = this.props.coach.prefStudio && this.props.coach.prefStudio.playerList ? this.props.coach.prefStudio.playerList : []

            const tags = this.props.coach.prefStudio && this.props.coach.prefStudio.tags ? this.props.coach.prefStudio.tags : []
            tags.push({ name: this.state.tagName, color: this.state.color.hex, status: false })
            updateStudioPref(this.props.coach._id, { tags, playerList, range: this.props.coach.prefStudio.range })
            this.setState({ tagName: '' })
          }
        }}>{i18n.t('Common_word.add')}</Button>
        <h2 style={{ marginTop: '15px' }} >{i18n.t('StudioPreference.theme.yours')}:</h2>
        <div style={{ marginTop: '20px', overflow: 'auto', maxHeight: '20vh', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {this.props.coach && this.props.coach.prefStudio && this.props.coach.prefStudio.tags && (
            this.props.coach.prefStudio.tags.map((t, key) => {
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px' }}>
                  <Button
                    shape='circle' icon='delete'
                    type='danger' style={{ marginRight: '10px' }}onClick={() => {
                      const tags = this.props.coach.prefStudio && this.props.coach.prefStudio.tags ? this.props.coach.prefStudio.tags : []
                      const playerList = this.props.coach.prefStudio && this.props.coach.prefStudio.playerList ? this.props.coach.prefStudio.playerList : []

                      tags.splice(key, 1)
                      updateStudioPref(this.props.coach._id, { tags, playerList, range: this.props.coach.prefStudio.range })
                    }}/>
                  <p style={{ color: t.color }}>{t.name}</p>
                </div>
              )
            })
          )}
        </div>
        <div>
          <h2 style={{ marginTop: '15px' }}>{i18n.t('StudioPreference.clipsSize')}:</h2>
          <Slider onChange={(e) => { this.setState({ range: e }) }} defaultValue={this.props.coach.prefStudio.range} max={180} min={10} />
          <Button onClick={() => {
            const tags = this.props.coach.prefStudio && this.props.coach.prefStudio.tags ? this.props.coach.prefStudio.tags : []
            const playerList = this.props.coach.prefStudio && this.props.coach.prefStudio.playerList ? this.props.coach.prefStudio.playerList : []
            updateStudioPref(this.props.coach._id, { playerList, tags, range: this.state.range })

          }}>{i18n.t('Common_word.save')}</Button>
        </div>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach } = useStoreon('coach')

  const props = {
    ...initialProps,
    coach,
    dispatch,
  }
  return <LeClubStudioPref {...props} />
}
