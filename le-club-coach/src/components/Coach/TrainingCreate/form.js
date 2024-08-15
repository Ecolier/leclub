import React from 'react'
import moment from 'moment'
import { Form, Input, DatePicker } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

class TrainingCreateForm extends React.PureComponent {

  renderTitleInput = () => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      initialValue: undefined,
      rules: [
        {
          required: true,
          message: i18n.t('TrainingCreate.training_title.error'),
        },
      ],
    }
    return getFieldDecorator('title', opts)(
      <Input />
    )
  }

  renderDescriptionInput = () => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      initialValue: '',
    }
    return getFieldDecorator('description', opts)(
      <Input.TextArea autosize={{ minRows: 4, maxRows: 6 }} />
    )
  }

  renderDatePicker = () => {
    const { getFieldDecorator } = this.props.form
    const opts = {
      initialValue: moment(),
      rules: [
        {
          required: true,
          message: i18n.t('TrainingCreate.training_date.error'),
        },
      ],
    }
    return getFieldDecorator('date', opts)(
      <DatePicker />
    )
  }

  render () {
    return (
      <Form>
        <Form.Item label={i18n.t('Sheets.training.training_date')}>
          { this.renderDatePicker() }
        </Form.Item>
        <Form.Item label={i18n.t('TrainingCreate.training_title.title')}>
          { this.renderTitleInput() }
        </Form.Item>
        <Form.Item label={i18n.t('TrainingCreate.training_description')}>
          { this.renderDescriptionInput() }
        </Form.Item>
      </Form>
    )
  }
}

export default TrainingCreateForm;
