import React from 'react'
import { connectStoreon } from 'storeon/react'
import { Select } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

import { changeCurrentTeam } from '@/actions/coach'

const { Option } = Select

class TeamSelect extends React.PureComponent {

  handleTeamChange = async team => {
    if (this.props.coach.accountType !== 'T2' && this.props.coach.accountType !== 'T3') {
      return
    }
    await changeCurrentTeam(team)
  }

  get isLoading () {
    const { currentSeason } = this.props.coachSeason
    return (
      !currentSeason
      || !currentSeason.club
    )
  }

  get currentTeam () {
    const { currentSeason } = this.props.coachSeason
    const { teams } = currentSeason.club
    const currentTeamId = currentSeason.team

    return this.props.value || teams.find(t => t._id === currentTeamId)
  }

  get availableTeams () {
    const { currentSeason } = this.props.coachSeason
    const tier = this.props.coach.accountType
    const teams = currentSeason.club.teams || []
    const currentTeamId = currentSeason.team
    const haveTeam = !!currentTeamId

    if (!haveTeam) {
      return []
    }

    if (haveTeam && (tier === 'T0' || tier === 'T1')) {
      return teams.filter(t => t._id === currentTeamId)
    }

    if (tier === 'T2') {
      return teams.filter(t => !!currentSeason.chosenTeams.find(e => e === t._id))
    }

    return teams
  }

  get selectValue () {
    if (this.currentTeam) {
      return this.currentTeam.name
    }
    return i18n.t('Common_word.choose_team')
  }

  // renderDropdown = (menu) => {
  //   console.log(menu)
  //   if (menu) {
  //    console.log(menu)
  //     return (<div style={{ position: 'relative', maxHeight: 'calc(1.4rem * 3)', background: 'red' }}>
  //       {menu.props.menuItems.map(items => (
  //         <div>
  //           {items.props.value}
  //         </div>
  //       ))}
  //     </div>)
  //   }
  // }

  render () {
    if (this.isLoading) {
      return null
    }

    const teams = this.availableTeams
    return (
      <React.Fragment>
        {teams.length === 0 && (
          <Select value={i18n.t('Common_word.no_team_available')} disabled/>
        )}
        {teams.length > 0 && (
          <Select value={this.selectValue} onChange={this.handleTeamChange} dropdownMatchSelectWidth={this.props.mobile.isOnMobile} dropdownAlign={{ overflow: { adjustX: 1, adjustY: 1 } }}>
            {teams.map(t => (
              <Option key={t._id} value={t._id}>{t.name}</Option>
            ))}
          </Select>
        )}
      </React.Fragment>
    )
  }
}

export default connectStoreon('coachSeason', 'coach', 'mobile', TeamSelect)
