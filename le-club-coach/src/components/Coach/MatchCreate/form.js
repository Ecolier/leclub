import React from 'react'
import moment from 'moment'
import { Form, DatePicker, Select, Radio } from 'antd'
import ClubAutoComplete from '../../ClubAutoComplete'
import TeamSelect from '../TeamSelect'
import i18n from 'i18n-js'
import '@/i18n'

class MatchCreateForm extends React.PureComponent {

  renderTypeSelect = () => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      rules: [
        { required: true },
      ],
      initialValue: 'custom',
    }
    return getFieldDecorator('type', opts)(
      <Radio.Group>
        <Radio.Button value='custom'>{i18n.t('Common_word.friendly')}</Radio.Button>
        {/* <Radio.Button value='championship'>Championat</Radio.Button>*/}
      </Radio.Group>
    )
  }

  // renderDayInput = () => {
  //   const { getFieldDecorator } = this.props.form
  //   const opts = {
  //     rules: [
  //       { required: true },
  //     ],
  //     initialValue: 1,
  //   }
  //   return getFieldDecorator('day', opts)(
  //     <Select>
  //       <Select.Option value={1}>Journee 1</Select.Option>
  //       <Select.Option value={2}>Journee 2</Select.Option>
  //     </Select>
  //   )
  // }

  renderDateInput = () => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      rules: [
        { required: true },
      ],
      initialValue: moment(),
    }
    return getFieldDecorator('date', opts)(
      <DatePicker />
    )
  }

  renderClubSelect = (props) => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      rules: [
        {
          required: true,
          message: i18n.t('MatchCreate.opponent_club.error'),
        },
      ],
      normalize: (v) => {
        if (typeof v === 'object') {
          return v._id
        }
        return v
      },
    }
    return getFieldDecorator('oppositeClub', opts)(
      <ClubAutoComplete
        onChange={() => this.props.form.resetFields('oppositeTeam')}
        {...props}
      />
    )
  }

  renderTeamSelect = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const club = getFieldValue('oppositeClub')
    const dropdownAlign = {
      overflow: { adjustX: 1, adjustY: 1 },
    }
    const opts = {
      rules: [
        {
          required: true,
          message: i18n.t('MatchCreate.opponent_team.error'),
        },
      ],
      normalize: (v) => {
        if (typeof v === 'object') {
          return v._id
        }
        return v
      },
    }
    return getFieldDecorator('oppositeTeam', opts)(
      <TeamSelect club={club} disabled={club === undefined} dropdownAlign={dropdownAlign}/>
    )
  }

  renderHomeAwaySelect = () => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      rules: [
        { required: true },
      ],
      initialValue: true,
    }
    return getFieldDecorator('isHome', opts)(
      <Radio.Group buttonStyle='solid'>
        <Radio.Button value>{i18n.t('MatchCreate.which_side.home')}</Radio.Button>
        <Radio.Button value={false}>{i18n.t('MatchCreate.which_side.away')}</Radio.Button>
      </Radio.Group>
    )
  }

  renderCustomFields = () => {
    return (
      <React.Fragment>
        <Form.Item label='Date'>
          { this.renderDateInput() }
        </Form.Item>

        <Form.Item label={i18n.t('MatchCreate.opponent_club.title')}>
          { this.renderClubSelect({ allowSame: false }) }
        </Form.Item>

        <Form.Item label={i18n.t('MatchCreate.opponent_team.title')}>
          { this.renderTeamSelect() }
        </Form.Item>

        <Form.Item label={i18n.t('MatchCreate.which_side.title')}>
          { this.renderHomeAwaySelect() }
        </Form.Item>
      </React.Fragment>
    )
  }

  // renderChampionshipFields = () => {
  //   const DayInput = this.renderDayInput
  //   return (
  //     <Form.Item label='Journee'>
  //       <DayInput />
  //     </Form.Item>
  //   )
  // }

  render () {
    const TypeSelect = this.renderTypeSelect

    const CustomFields = this.renderCustomFields
    // const ChampionshipFields = this.renderChampionshipFields

    const matchType = this.props.form.getFieldValue('type') || 'custom'

    return (
      <Form>
        <Form.Item label='Type'>
          <TypeSelect />
        </Form.Item>

        {/* matchType === 'championship' && <ChampionshipFields />*/}
        {matchType === 'custom' && <CustomFields />}

      </Form>
    )
  }
}

export default MatchCreateForm;
