import React from 'react'
import { Form, Input, DatePicker } from 'antd'
import moment from 'moment'
import i18n from 'i18n-js'
import '@/i18n'

const TrainingForm = React.forwardRef((props, ref) => {
  const { getFieldDecorator } = props.form
  return (
    <Form>
      <Form.Item label={i18n.t('Sheets.training.training_date')}>
        {getFieldDecorator('date', {
          rules: [
            {
              type: 'object',
              required: true,
              message: i18n.t('TrainingCreate.training_date.error'),
            },
          ],
          initialValue: moment(),
        })(
          <DatePicker
            name={'date'}
            format={'DD-MM-YYYY'}
            placeholder={i18n.t('TrainingCreate.training_date.title')}
          />,
        )}
      </Form.Item>
      <Form.Item label={'Common_word.title'}>
        {getFieldDecorator('title', {
          rules: [
            { required: true, message: i18n.t('TrainingCreate.training_title.error') },
          ],
          initialValue: '',
        })(<Input name={'title'} placeholder={i18n.t('TrainingCreate.training_title.title')} />)}
      </Form.Item>
      <Form.Item label={i18n.t('TrainingCreate.training_description')}>
        {getFieldDecorator('description', {
          rules: [
            { required: true, message: i18n.t('TrainingCreate.training_description_error') },
          ],
          initialValue: '',
        })(<Input.TextArea rows={4} name={'description'} placeholder={i18n.t('TrainingCreate.training_description')} />)}
      </Form.Item>
    </Form>
  )
})

export default Form.create({ name: 'TrainingForm' })(TrainingForm)
