import React, { PureComponent } from 'react'
import { Button, Progress } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

import TierModal from '../../TierModal'

export default class extends PureComponent {
  state = {
    downloading: false,
    progress: 0,
  }

  download = () => {
    if (this.props.coach.accountType === 'T0') {
      this.setState({ downloading: true })
      return
    }
    const media = this.props.media
    const req = new XMLHttpRequest()
    req.open('get', media.url, true)
    req.responseType = 'blob'

    req.onload = (data) => {
      const blob = data.currentTarget.response
      const a = document.createElement('a')
      a.download = `${media.title}.mp4`
      a.href = URL.createObjectURL(blob)
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(a.href)
      a.remove()
    }

    req.onprogress = (evt) => {
      const progress = Math.floor(evt.loaded / evt.total * 100)
      if (progress > this.state.progress) {
        this.setState({ progress })
      }
    }

    this.setState({ downloading: true })
    req.send(null)
  }

  render () {

    if (!this.state.downloading) {
      return (<Button onClick={() => { this.download() }} type='primary'>{i18n.t('Common_word.download')}</Button>)
    } else if (this.state.downloading && this.props.coach.accountType === 'T0') {
      return (<TierModal close={() => { this.setState({ downloading: false }) }}/>)
    }
    return (<Progress percent={this.state.progress} size='small' />)

  }
}
