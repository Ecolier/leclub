import React from 'react'
import { Table, Form } from 'antd'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'

class EditableTable extends React.PureComponent {

  componentDidMount () {
    window.addEventListener('click', this.saveTable)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.saveTable)
  }

  state = {
    index: undefined,
    column: undefined,
    key: undefined,
  }

  saveTable = () => {
    return new Promise((resolve, reject) => {
      const { column } = this.state
      if (!column) {
        return resolve()
      }

      const { dataIndex } = column
      const data = cloneDeep(this.props.dataSource)

      this.props.form.validateFields((errors, { value }) => {
        set(data[this.state.index], dataIndex, value)
        const edited = {}
        edited[dataIndex.split('.').pop()] = value
        this.props.onChange && this.props.onChange(edited, data[this.state.index], this.state.index)
        this.setState({ index: undefined, column: undefined }, resolve)
      })
    })
  }

   handleCellClick = async (evt, index, column) => {
     evt.stopPropagation()
     await this.saveTable()
     this.setState({ index, column, key: column.key })
   }

  createColumns = () => {
    const columns = this.props.columns
    return columns.map(c => {
      return {
        title: c.title,
        key: c.key,
        dataIndex: c.dataIndex,
        render: (v, record, index) => {
          const isEditing = this.state.index === index && this.state.key === c.key
          const editable = c.renderEdit !== undefined
          if (isEditing) {
            const decorateField = this.props.form.getFieldDecorator('value', {
              initialValue: v,
            })
            return (
              <div onClick={evt => evt.stopPropagation()}>
                { decorateField(c.renderEdit(v, record, index)) }
              </div>
            )
          }
          if (!editable) {
            return c.render(v, record, index)
          }
          return (
            <div style={{ cursor: 'pointer' }} onClick={evt => this.handleCellClick(evt, index, c)}>
              { c.render(v, record, index) }
            </div>
          )
        },
      }
    })
  }

  render () {
    const columns = this.createColumns()
    return (
      <Table {...this.props} columns={columns} />
    )
  }
}

export default Form.create({})(EditableTable)
