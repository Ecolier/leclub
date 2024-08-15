import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { Upload, Icon, Modal } from 'antd'
import { Cookies } from 'react-cookie'
import { updateImageCover } from '@/actions/coach'
import i18n from 'i18n-js'
import '@/i18n'

class GaleryPicture extends Component {

  componentDidMount () {
    const fileListTmp = []
    if (this.props.url) {
      fileListTmp.push({ uid: 0, name: 'picture0', status: 'done', url: this.props.url })
      this.setState({ fileList: fileListTmp })
    }
  }
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };
  handleCancel = (e) => { this.setState({ previewVisible: false }) }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = ({ fileList }) => { this.setState({ fileList }) }

  customRequest = ({ onSuccess, onError, file }) => {
    updateImageCover(this.props.id, this.props.urlBack, file, this.props.who)
      .then((e) => {
        onSuccess(null, file)
      })
      .catch(() => {
        onError()
      })
  };

  handleRemove = (e) => { this.props.handleRemove(e) }
  render () {
    const { previewVisible, previewImage, fileList } = this.state
    const { title } = this.props
    const cookies = new Cookies()
    const token = cookies.get('googleGWP')
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>{i18n.t('Common_word.add_photo')}</div>
      </div>
    )
    return (
      <div>
        <p style={{ marginBottom: '10px' }}>{title}</p>
        <Upload
          name='file'
          headers={{ 'X-Access-Token': `${token}` }}
          listType='picture-card'
          fileList={fileList}
          customRequest={this.customRequest}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} style={{ height: '80px' }}>
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch } = useStoreon()
  const props = {
    ...initialProps,
    dispatch,
  }
  return <GaleryPicture {...props} />
}
