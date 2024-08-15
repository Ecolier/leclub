import './editableList.css'
import React from 'react'
import { Button, Input, Icon } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

const { TextArea } = Input

export default class EditableList extends React.PureComponent {

  state = {
    inputValue: undefined,
    showInput: this.props.setToStart || false,
    editIndex: undefined,
  }

  handleItemEdit = (index, item) => {
    item = item && item.trim()
    if (!item || item.length === 0) {
      return
    }

    const items = [...this.props.items]
    items[index] = item
    const onChange = this.props.onChange

    this.setState({
      showInput: false,
      inputValue: undefined,
      editIndex: undefined,
    })

    if (onChange) {
      onChange([...items])
    }
  }

  handleItemAdd = (item) => {
    item = item && item.trim()
    if (!item || item.length === 0) {
      return
    }

    const items = [...this.props.items]
    const onChange = this.props.onChange

    this.setState({
      showInput: false,
      inputValue: undefined,
    })

    if (onChange) {
      onChange([...items, item])
    }
  }

  handleInputChange = (evt) => {
    this.setState({ inputValue: evt.target.value })
  }

  deleteItem = (index) => {
    const items = [...this.props.items]
    const onChange = this.props.onChange

    if (onChange) {
      items.splice(index, 1)
      onChange(items)
    }
  }

  showItemAddInput = () => {
    this.setState({
      inputValue: undefined,
      showInput: true,
    })
  }

  saveItem = () => {
    const isEditing = this.state.editIndex !== undefined
    if (isEditing) {
      return this.handleItemEdit(this.state.editIndex, this.state.inputValue)
    }
    this.handleItemAdd(this.state.inputValue)
  }

  renderItemAddInput = () => {
    return (
      <TextArea
        style={{ flex: 1, marginBottom: 10 }}
        autosize={{ minRows: 4 }}
        onChange={this.handleInputChange}
        onBlur={this.saveItem}
        value={this.state.inputValue}
      />
    )
  }

  renderFooter = () => {
    const { showInput, editIndex } = this.state
    return (
      <React.Fragment>
        {(!showInput && editIndex === undefined) && (
          <Button onClick={this.showItemAddInput} type='primary'>{this.props.addLabel || i18n.t('Common_word.add')}</Button>
        )}
      </React.Fragment>
    )
  }

  editItem = (i) => {
    this.setState({
      showInput: false,
      inputValue: this.props.items[i],
      editIndex: i,
    })
  }

  renderItem = (item, i) => {
    const isEditing = this.state.editIndex === i
    const ItemInput = this.renderItemAddInput
    if (isEditing) {
      return (
        <ItemInput key={i} />
      )
    }
    return (
      <div className='b-editable-list-item' key={i}>
        <div className='b-editable-list-item-content'>{item}</div>
        <div className='b-editable-list-item-actions'>
          <a onClick={() => this.editItem(i)}>
            <Icon type='edit' />
          </a>
          <a onClick={() => this.deleteItem(i)}>
            <Icon type='delete' />
          </a>
        </div>
      </div>
    )
  }

  render () {

    const Footer = this.renderFooter
    const ItemInput = this.renderItemAddInput

    return (
      <React.Fragment>
        {this.props.items.map(this.renderItem)}
        <div>
          {this.state.showInput && (<ItemInput />)}
        </div>
        <Footer />
      </React.Fragment>
    )
  }

}
