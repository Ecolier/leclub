import React, { Component } from 'react'
import { Divider, Icon, Spin } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import 'moment/locale/fr'
import moment from 'moment'

moment.locale('fr')
import './style.scss'

const mapDispatchToProps = (dispatch) => { return { dispatch } }

class Profile extends Component {

  componentDidMount () {
    this.setState({ heightOfScreen: document.documentElement.offsetHeight })
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.setState({ onPhone: true })
    }
  }

  state = {
    onPhone: false,
    heightOfScreen: 0,
  }

    capitalizeFirstLetter = (string) => {
      return string && string.length ? string[0].toUpperCase() + string.slice(1) : null
    }

    render () {

      const { user } = this.props

      return (

        <div>
          { user ? (
            <div style={{ height: this.state.onPhone ? this.state.heightOfScreen - 100 : 'none', display: 'flex', flexDirection: 'column' }}>
              <div onClick={() => {
                this.props.dispatch(push('/users'))
              }} style={{ cursor: 'pointer', position: 'absolute', marginTop: '10px' }}>
                <Icon type='left' style={{ fontSize: '4rem', fontWeight: 'bold' }} />
              </div>
              <div className='background-image' style={{ height: '100%', background: `linear-gradient(${user.club && user.club.primaryColor ? user.club.primaryColor : '#ffffff'}, ${user.club && user.club.secondaryColor ? user.club.secondaryColor : '#607d8b'})`, zIndex: '-100' }}/>
              <div className='background-image' style={{ height: '100%', background: 'rgba(0, 0, 0, 0.4)', zIndex: '-100' }}/>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px 10%' }}>
                <div style={{ border: 'solid #fed000 3px', borderRadius: '50%', width: '300px', height: '300px', background: `url(${user.picture || 'https://d1ceovtllg6jml.cloudfront.net/23.jpg'}) no-repeat center / cover`, boxShadow: '0px 0px 58px 0px rgba(0,0,0,0.75)' }}/>
                <div style={{ width: '100%', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px #000000', margin: '0' }}>{user.completeName || ''}</h1>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={user.club ? user.club.urlLogo : ''} alt='' style={{ height: '100px', margin: '0 15px' }}/>
                    <p style={{ fontSize: '2rem', margin: '0 15px' }}>{user.club ? user.club.name : 'Pas encore de club'}</p>
                  </div>
                  <div style={{ display: 'flex', marginTop: '40px', width: '100%', maxWidth: '1000px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                      <p style={{ fontSize: '3rem' }}>{user && user.whichFoot ? (
                        <Icon type='yuque' style={{ marginRight: '15px' }}/>
                      ) : null}{user ? user.whichFoot : null}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Divider type='vertical' style={{ height: '100%' }}/>
                      <p style={{ fontSize: '3rem' }}><Icon type='calendar' style={{ marginRight: '15px' }}/>{moment(user && user.birthdate).format('DD/MM/YYYY') || ''}</p>
                      <Divider type='vertical' style={{ height: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flex: '1', justifyContent: 'flex-end' }}>
                      <p style={{ fontSize: '3rem' }}>{user && user.contrat ? this.capitalizeFirstLetter(user.contrat.contrat) : null}</p>
                    </div>
                  </div>

                </div>
              </div>
              <div style={{ maxWidth: '1500px', margin: 'auto', display: 'flex', flexDirection: 'column', width: '100%', flex: 1, background: '#ffffff' }}>
                <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '3rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <i className='fas fa-shield-alt' style={{ fontSize: '4rem' }}/>
                    <div style={{ color: '#c7c7c7', fontSize: '2.5rem', marginLeft: '20px' }}>EQUIPE</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '4vw' }}>{user.team ? user.team.name : 'Pas d\'équipe'}</div>
                  </div>
                </div>
                <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '3rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <i className='fas fa-map-marker-alt' style={{ fontSize: '4rem' }}/>
                    <div style={{ color: '#c7c7c7', fontSize: '2.5rem', marginLeft: '20px' }}>POSITION</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{user && user.whichSide ? user.whichSide : 'Poste non renseigné'}</div>
                  </div>
                </div>
                <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '3rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <i className='fas fa-tshirt' style={{ fontSize: '4rem' }}/>
                    <div style={{ color: '#c7c7c7', fontSize: '2.5rem', marginLeft: '20px' }}>NUMERO</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{user && user.number ? user.number : 'Numéro non renseigné'}</div>
                  </div>
                </div>
                <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '3rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <i className='fas fa-futbol' style={{ fontSize: '4rem' }}/>
                    <div style={{ color: '#c7c7c7', fontSize: '2.5rem', marginLeft: '20px' }}>BUTS</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{user ? user.buts : 'Pas de but'}</div>
                  </div>
                </div>
                <div className='card' style={{ width: '100%', flex: '1', display: 'flex', alignItems: 'center', fontSize: '3rem', letterSpacing: '1px', padding: '30px 5%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <i className='fas fa-hands-helping' style={{ fontSize: '4rem' }}/>
                    <div style={{ color: '#c7c7c7', fontSize: '2.5rem', marginLeft: '20px' }}>PASSE D.</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>{user ? user.passesD : 'Pas de passe decisif'}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : <Spin className='loadingPages' indicator={<Icon type='loading' style={{ fontSize: '10rem' }} spin />}/> }
        </div>
      )
    }

}

export default connectStoreon(null, mapDispatchToProps)(Profile)
