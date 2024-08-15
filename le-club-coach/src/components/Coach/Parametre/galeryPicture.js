import { Upload, Icon, Modal } from 'antd'
import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import { updateGalery, addGalery } from '@/actions/coach.js'
import { Cookies } from 'react-cookie'
import i18n from 'i18n-js'
import '@/i18n'

class GaleryPicture extends Component {

  componentDidMount () {
    const fileListTmp = []
    this.props.galleryImages.forEach((e, key) => {
      fileListTmp.push({ uid: key, name: `picture${key}`, status: 'done', url: e })
    })
    this.setState({ fileList: fileListTmp })
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

  handleRemove = (e) => {
    if (!e.url) {
      const fileList = this.state.fileList
      fileList.slice(fileList.length - 1, 1)
      return this.setState({ fileList })
    }
    updateGalery(this.props.id, e.url || e.response.club.galleryImages[e.response.club.galleryImages.length - 1], 'remove')
  }

  customRequest = ({ onSuccess, onError, file }) => {
    addGalery(this.props.id, file)
      .then((e) => {
        onSuccess(null, file)
      })
      .catch(() => {
        onError()
      })
  };

  render () {
    const { previewVisible, previewImage, fileList } = this.state
    const cookies = new Cookies()
    const token = cookies.get('googleGWP')
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>{i18n.t('Common_word.add_photo')}</div>
      </div>
    )
    return (
      <div className='clearfix'>
        <p>{i18n.t('Common_word.club_photos')}: </p>
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
          {uploadButton}
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
