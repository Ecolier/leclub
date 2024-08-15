import React from 'react'

import { Table, Input, Form, Button, Rate } from 'antd'
import i18n from 'i18n-js'
import '@/i18n.js'

const FormItem = Form.Item
const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.type === 'comment') {
      return <Input.TextArea autosize={{ minRows: 5, maxRows: 20 }} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}/>
    } else if (this.props.type === 'star') {
      return <Rate allowHalf setFieldsValue={2.5} />
    }
    return <Input />
  };

  render () {
    const {
      editing,
      dataIndex,
      title,
      record,
      ...restProps
    } = this.props
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form
          return (
            <td {...restProps} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `${i18n.t('Common_word.addInfo')} "${title}".`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          )
        }}
      </EditableContext.Consumer>
    )
  }
}

class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = { data: this.props.data, editingKey: '' }
    this.columns = this.props.infos.map((info, key) => {
      if (info.type === 'star') {
        return ({
          type: info.type,
          title: info.title,
          dataIndex: info.dataIndex,
          width: info.width,
          editable: info.editable,
          render: (test, record) => {
            return (<Rate disabled allowHalf value={test} />)
          },
        })
      }

      return ({
        type: info.type,
        title: info.title,
        dataIndex: info.dataIndex,
        width: info.width,
        editable: info.editable,
      })

    })
    if (this.props.edit) {

      this.columns.push({
        title: '',
        dataIndex: 'operation',
        width: '5%',
        render: (text, record) => {
          const editable = this.isEditing(record)
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <Button
                        type='primary' style={{ width: '100px' }}
                        onClick={() => this.save(form, record.key)}
                      >
                        {i18n.t('Common_word.lock')}
                      </Button>
                    )}
                  </EditableContext.Consumer>
                </span>
              ) : (
                <Button type='primary' style={{ width: '100px' }} onClick={() => this.edit(record.key)}>{i18n.t('Common_word.edit')}</Button>
              )}
            </div>
          )
        },
      })
    }
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey
  };

  edit (key) {
    this.setState({ editingKey: key })
  }

  save (form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = [...this.state.data]
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        this.setState({ data: newData, editingKey: '' })
        this.props.updateData(newData)
      } else {
        newData.push(row)
        this.setState({ data: newData, editingKey: '' })
        this.props.updateData(newData)

      }
    })
  }

  cancel = () => {
    this.setState({ editingKey: '' })
  };

  render () {
    const components = { body: { row: EditableFormRow, cell: EditableCell } }

    const columns = this.columns.map((col) => {

      if (!col.editable) { return col }

      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          type: col.type,
          editing: this.isEditing(record),
          edit: col.edit,
        }),
      }
    })
    return (
      <Table
        style={{ width: '100%' }}
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columns}
        rowClassName='editable-row'
        pagination={false}
      />
    )
  }
}
export default EditableTable
