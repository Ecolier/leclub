import React, { Component } from 'react'
import { Icon } from 'antd'
import './index.scss'

class VideoCard extends Component {

  render () {
    const { poster, openModal, keyCut } = this.props
    return (
      <div>
        <div className='videoCard' onClick={() => { openModal(keyCut) }} style={{ background: `url(${poster || ''})  center center / cover no-repeat` }}>
          <div className={'a'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'solid 3px white', borderRadius: '15px', width: '100px', height: '50px', fontSize: '2rem', color: 'white' }}>
            <Icon type='caret-right' />
          </div>
        </div>
      </div>
    )
  }
}

export default VideoCard
