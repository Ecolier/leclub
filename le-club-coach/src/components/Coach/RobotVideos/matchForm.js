import React from 'react'
import { Form, DatePicker, Radio } from 'antd'
import ClubAutoComplete from '../../ClubAutoComplete'
import TeamSelect from '../TeamSelect'
import moment from 'moment'
import i18n from 'i18n-js'
import '@/i18n'

const MatchForm = React.forwardRef((props, ref) => {
  const { getFieldValue, getFieldDecorator } = props.form
  const club = getFieldValue('oppositeClub')
  const dropdownAlign = {
    overflow: { adjustX: 1, adjustY: 1 },
  }
  return (
    <Form>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Form.Item label={i18n.t('Sheets.match.match_date')}>
          {getFieldDecorator('date', {
            rules: [
              {
                type: 'object',
                required: true,
                message: i18n.t('MatchCreate.date.title'),
              },
            ],
            initialValue: moment(),
          })(
            <DatePicker
              name={'date'}
              format={'DD-MM-YYYY'}
              placeholder={i18n.t('MatchCreate.date.placeholder')}
            />,
          )}
        </Form.Item>
        <Form.Item label={i18n.t('MatchCreate.which_side.title')}>
          {getFieldDecorator('isHome', {
            rules: [
              { required: true, message: i18n.t('MatchCreate.which_categorie.error') },
            ],
            initialValue: null,
          })(
            <Radio.Group buttonStyle='solid'>
              <Radio.Button value>{i18n.t('MatchCreate.which_side.home')}</Radio.Button>
              <Radio.Button value={false}>{i18n.t('MatchCreate.which_side.away')}</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
      </div>
      <Form.Item label={i18n.t('MatchCreate.opponent_club.title')}>
        {getFieldDecorator('oppositeClub', {
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
        })(<ClubAutoComplete
          allowSame={false}
        />)}
      </Form.Item>
      <Form.Item label={i18n.t('MatchCreate.opponent_team.title')}>
        {getFieldDecorator('oppositeTeam', {
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
        })(
          <TeamSelect club={club} disabled={club === undefined} dropdownAlign={dropdownAlign}/>
        )}
      </Form.Item>
    </Form>
  )
})

export default Form.create({ name: 'MatchForm' })(MatchForm)
