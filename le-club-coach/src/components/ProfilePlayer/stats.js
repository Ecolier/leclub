import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import i18n from 'i18n-js'
import '@/i18n'
import './style.scss'

class Stats extends Component {
  componentDidMount () {
    this.setState({ heightOfScreen: document.documentElement.offsetHeight })
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.setState({ onPhone: true })
    }
  }

    capitalizeFirstLetter = (string) => {
      return string && string.length ? string[0].toUpperCase() + string.slice(1) : null
    }

    render () {
      const { season } = this.props
      if (!season) {
        return null
      }
      return (
        <div style={{ marginBottom: '50px', minHeight: '40vh' }}>
          <div style={{ maxWidth: '1000px', width: '100%', margin: 'auto', padding: '0 5%' }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f2f2f2', borderRadius: '10px', boxShadow: '0 1px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1) inset' }}>
              <div style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', fontSize: '1.5rem', padding: '20px 0' }}>
                <i className='fas fa-futbol'/>
                <p>{i18n.t('Common_word.matchPlayed')}</p>
                <p>{season.matchPlay}</p>
              </div>
              <hr style={{ width: '100%' }}/>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', fontSize: '1.5rem' }}>
                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <i className='fas fa-trophy'/>
                  <p>{i18n.t('Common_word.victory')}</p>
                  <p>{season.matchWin}</p>
                </div>
                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', borderLeft: 'solid 1px grey', borderRight: 'solid 1px grey', padding: '20px 0' }}>
                  <i className='fas fa-adjust'/>
                  <p>{i18n.t('Common_word.draw')}</p>
                  <p>{season.matchPlay - season.matchWin - season.matchLost}</p>
                </div>
                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <i className='fas fa-times-circle'/>
                  <p>{i18n.t('Common_word.defeat')}</p>
                  <p>{season.matchLost}</p>
                </div>
              </div>
              <hr style={{ width: '100%' }}/>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', fontSize: '1.5rem' }}>
                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', borderRight: 'solid 1px grey', padding: '20px 0' }}>
                  <i className='fas fa-futbol'/>
                  <p>{i18n.t('Common_word.goal')}</p>
                  <p>{season.buts}</p>
                </div>
                <div style={{ display: 'flex', flex: '1', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                  <i className='fas fa-hands-helping'/>
                  <p>{i18n.t('Common_word.assists')}</p>
                  <p>{season.passesD}</p>
                </div>
              </div>
            </div>
          </div>
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
  return <Stats {...props} />
}
