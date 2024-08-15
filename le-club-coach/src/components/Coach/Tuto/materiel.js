import React, { Component } from 'react'
import Iframe from 'react-iframe'
import './style.css'
import i18n from 'i18n-js'
import '@/i18n'
class Tuto extends Component {
  render () {
    return (
      <div style={{ padding: '10px' }}>
        <div className='materielHelpContainer'>
          <h1>Materiel:</h1>
          <hr style={{ width: '100%' }} />
          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.batterieInstallation')}</h3>
            <Iframe url='https://www.youtube.com/embed/0yPXlMG0QzE?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>
          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.qualitiOfVideo')}</h3>
            <Iframe url='https://www.youtube.com/embed/cJySNIyKUnU?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>

          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.connectPhone')}</h3>
            <Iframe url='https://www.youtube.com/embed/vhK6gT6TbPQ?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>

          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.outTrepied')}</h3>
            <Iframe url='https://www.youtube.com/embed/kTzfrpc2v74?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>

          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.fixCamera')}</h3>
            <Iframe url='https://www.youtube.com/embed/6I-UpMb_QgA?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>

          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.incCamera')}</h3>
            <Iframe url='https://www.youtube.com/embed/s-zS9KjL54c?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>
          <div className='materielHelpSection'>
            <h3>{i18n.t('helpCenter.materiel.inTrepied')}</h3>
            <Iframe url='https://www.youtube.com/embed/P2HE9PrLOwM?list=UUTGeBrvb0Laoy368Qt6aUIw'
              width='100%'
              height='250px'
              display='initial'
              position='relative'
              allowFullScreen/>
          </div>
        </div>

      </div>
    )
  }
}

export default (Tuto)
