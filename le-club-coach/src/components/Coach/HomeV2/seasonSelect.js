import React from 'react'
import { connectStoreon } from 'storeon/react'
import { changeCurrentSeason } from '@/actions/coach'
import { Select } from 'antd'
import { get } from 'lodash'

const { Option } = Select

class SeasonSelect extends React.PureComponent {

  handleChange = seasonId => {
    changeCurrentSeason(seasonId)
  }

  render () {
    const season = get(this.props.coachSeason.currentSeason, 'season')

    return (
      <Select value={season} style={this.props.style} onChange={this.handleChange} dropdownMatchSelectWidth={false}>
        {this.props.coachSeason.seasons.map(s => (
          <Option key={s.season} value={s._id}>{s.season}</Option>
        ))}
      </Select>
    )
  }
}

export default connectStoreon('coachSeason', SeasonSelect)
