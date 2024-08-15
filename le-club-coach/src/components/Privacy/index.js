import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Button, Table, Input } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

class PrivacyVideo extends Component {
  componentDidMount () {
    this.createArray(this.props.users)
    this.createArrayCoach(this.props.coaches)
  }

  state = {
    list: this.props.list ? this.props.list : [],
    isPublic: this.props.isPublic || 'private',
    data: [],
    dataCoach: [],
    teamsColumns: [],
    teamsColumnsCoach: [],
    selectedRows: [],
    selectedRowsCoach: [],
    searchText: '',
  }

  createArrayCoach = (coachs) => {
    const dataCoach = []
    const teamFilter = []

    this.props.coach.club.teams.forEach((e, k) => { teamFilter.push({ text: e.name, value: e.name, key: k }) })

    const teamsColumnsCoach = [{
      filterMultiple: false,
      title: i18n.t('Common_word.name'),
      dataIndex: 'firstName',
      key: 'firstName',
    }, {
      filterMultiple: false,
      title: i18n.t('Common_word.firstname'),
      dataIndex: 'lastName',
      key: 'lastName',
    }, {
      title: i18n.t('Common_word.team'),
      dataIndex: 'team',
      key: 'team',
      filters: teamFilter,
      filterMultiple: true,
      onFilter: (value, record) => record.team.indexOf(value) === 0,
      sorter: (a, b) => a.team.length - b.team.length,
      sortDirections: ['descend', 'ascend'],
    }]

    const selectedRowsCoach = this.state.selectedRowsCoach
    coachs.forEach((u, x) => {

      if (u._id !== this.props.coach._id) {
        const testList = this.props.list.findIndex(i => u._id && i.toString() === u._id.toString())

        if (testList !== -1) {
          selectedRowsCoach.push({ key: u._id, firstName: u.firstName, lastName: u.lastName, team: u.team || i18n.t('Common_word.no_team') })
        }

        dataCoach.push({ key: u._id, firstName: u.firstName, lastName: u.lastName, team: u.team || i18n.t('Common_word.no_team') })
      }

    })

    this.setState({ dataCoach, teamsColumnsCoach, selectedRowsCoach })

  }
  createArray = (users) => {
    const data = []
    const teamFilter = []

    this.props.coach.club.teams.forEach((e, k) => { teamFilter.push({ text: e.name, value: e.name, key: k }) })

    const teamsColumns = [{
      filterMultiple: false,
      title: i18n.t('Common_word.name'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: i18n.t('Common_word.team'),
      dataIndex: 'team',
      key: 'team',
      filters: teamFilter,
      filterMultiple: true,
      onFilter: (value, record) => record.team.indexOf(value) === 0,
      sorter: (a, b) => a.team.length - b.team.length,
      sortDirections: ['descend', 'ascend'],
    }]
    const selectedRows = this.state.selectedRows
    users.forEach((u, x) => {
      const testList = this.props.list.findIndex(i => i.toString() === u._id.toString())
      if (testList !== -1) {
        selectedRows.push({ key: u._id, name: u.completeName, team: u.team })
      }
      data.push({ key: u._id, name: u.completeName, team: u.team })
    })
    this.setState({ data, teamsColumns, selectedRows })
  }

  searchUser = (e) => {
    const re = new RegExp(`${e.target.value}`, 'i')
    const newUser = this.props.users.filter(u => re.test(u.completeName))
    this.createArray(newUser)
    this.setState({ searchText: e.target.value })
  }

  preSave = () => {

    if (!this.props.coach.privateActivate) {
      this.props.savePrivacy('public', [], [])

    } else {
      let list = this.state.selectedRows.map(e => e.key)
      const coachlist = this.state.selectedRowsCoach.map(e => e.key)
      list = list.concat(coachlist)
      list.unshift(this.props.coach._id)
      this.props.savePrivacy(this.state.isPublic, list)
    }
  }
  render () {
    const rowSelection = {
      onSelect: (value, cheked) => {
        const { selectedRows } = this.state

        const index = selectedRows.findIndex(e => e.key === value.key)
        if (cheked && index === -1) {
          selectedRows.push(value)
        } else if (index !== -1) {
          selectedRows.splice(index, 1)
        }
        this.setState({ selectedRows })
      },
      onSelectAll: (cheked, values) => {
        if (cheked) {
          return this.setState({ selectedRows: values })
        }
        return this.setState({ selectedRows: [] })

      },
      selectedRowKeys: this.state.selectedRows.map(e => e.key),
    }
    const rowSelectionCoach = {
      onSelect: (value, cheked) => {
        const { selectedRowsCoach } = this.state

        const index = selectedRowsCoach.findIndex(e => e.key === value.key)
        if (cheked && index === -1) {
          selectedRowsCoach.push(value)
        } else if (index !== -1) {
          selectedRowsCoach.splice(index, 1)
        }
        this.setState({ selectedRowsCoach })
      },
      onSelectAll: (cheked, values) => {
        if (cheked) {
          return this.setState({ selectedRowsCoach: values })
        }
        return this.setState({ selectedRowsCoach: [] })

      },
      selectedRowKeys: this.state.selectedRowsCoach.map(e => e.key),
    }
    return (
      <div className={'video_privacy_modal_container'}>
        <div style={{ margin: 'auto', width: '100%', padding: '10px', maxWidth: '1000px' }}>
          <h2>{i18n.t('VideoPrivacyModal.private_modal.title')}</h2>
          <h3 style={{ marginBottom: '20px' }}>{i18n.t('VideoPrivacyModal.private_modal.player_access_description')}</h3>

          <Input style={{ marginBottom: '10px' }} placeholder={i18n.t('Common_word.player_name')} onChange={this.searchUser} />
          {this.state.teamsColumns && this.state.teamsColumns.length > 0 && (
            <Table bordered showHeader={this.state.searchText === ''} size='middle' pagination={false} rowSelection={rowSelection} dataSource={this.state.data} columns={this.state.teamsColumns} />
          )}

          <h3 style={{ marginBottom: '20px', marginTop: '20px' }}>{i18n.t('VideoPrivacyModal.private_modal.coach_access_description')}</h3>
          {this.state.teamsColumns && this.state.teamsColumns.length > 0 && (
            <Table bordered showHeader={this.state.searchText === ''} size='middle' pagination={false} rowSelection={rowSelectionCoach} dataSource={this.state.dataCoach} columns={this.state.teamsColumnsCoach} />
          )}
        </div>
        <Button type='primary' onClick={() => { this.preSave() }}>{i18n.t('Common_word.save')}</Button>
      </div>
    )
  }
}

export default initialProps => {
  const { coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    coach,
  }
  return <PrivacyVideo {...props}/>
}
