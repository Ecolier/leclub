import React from 'react'
import { connectStoreon } from 'storeon/react'
import { Select } from 'antd'
import { callApi } from '@/utils/callApi'

const { Option } = Select

class TeamSelect extends React.PureComponent {

  componentDidMount () {
    this.fetchTeamsList()
  }

  componentDidUpdate (prevProps) {
    if (this.props.club !== prevProps.club) {
      this.fetchTeamsList()
    }
  }

  state = {
    teams: [],
  }

  fetchTeamsList = () => {
    const { club } = this.props
    const coachId = this.props.coach._id
    if (!club) {
      return
    }

    callApi(`${coachId}/club/${club}/teams`, 'get').then(data => {
      this.setState({
        teams: data.teams,
      })
    })
  }

  handleChange = (value) => {
    if (!this.props.onChange) {
      return
    }
    if (Array.isArray(value)) {
      return this.props.onChange(value.map(id => this.state.teams.find(t => t._id === id)))
    }
    this.props.onChange(this.state.teams.find(t => t._id === value))
  }

  handleSelect = (id) => {
    const team = this.state.teams.find(t => t._id === id)
    this.props.onSelect && this.props.onSelect(team)
  }

  handleDeselect = (id) => {
    const team = this.state.teams.find(t => t._id === id)
    this.props.onDeselect && this.props.onDeselect(team)
  }

  getValue = () => {
    const { value } = this.props
    if (Array.isArray(value)) {
      return value.map(v => v._id)
    }
    if (typeof value === 'object') {
      return value._id
    }
    return value
  }

  render () {
    return (
      <Select
        {...this.props}
        value={this.getValue()}
        showSearch
        onSelect={this.handleSelect}
        onChange={this.handleChange}
        onDeselect={this.handleDeselect}
        style={this.props.style}
        placeholder={this.props.placeholder}
        ref={this.props.forwardedRef}
        dropdownMatchSelectWidth
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        dropdownAlign={this.props.dropdownAlign}
      >
        {this.state.teams.map(team => (
          <Option key={team._id} value={team._id}>{team.name}</Option>
        ))}
      </Select>
    )
  }
}

const ConnectedTeamSelect = connectStoreon('coach', TeamSelect)

export default React.forwardRef((props, ref) => (
  <ConnectedTeamSelect {...props} forwardedRef={ref} />
))
