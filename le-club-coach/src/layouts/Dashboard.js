import React, { useState, useEffect } from 'react'
import { Menu, Icon, Layout, Badge, Button } from 'antd'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import i18n from 'i18n-js'
import { last, compact } from 'lodash'
import UploadNotification from '@/components/Coach/Upload/notification'
import store from '@/store'
import './style.scss'
import { logOut } from '@/actions/service'
import Sponsorship from '@/pages/Coach/sponsorship.js'
import Notification from './Notification.js'
import { closeParrainagePopup } from '@/actions/coach.js'
import { routerNavigate, routerKey } from '@storeon/router';

import { callApi } from '@/utils/callApi'

const { Sider, Content } = Layout

const { SubMenu } = Menu

const checkIfBurgerIsNeeded = (urlPath) => {
  if (urlPath[1] !== 'presequencage' && urlPath[1] !== 'player'
      && urlPath[1] !== 'edit' && urlPath[1] !== 'match'
      && urlPath[1] !== 'training' && urlPath[1] !== 'robot') {
    return true
  }
  return false
}

const Category = ({ icon, title, ...props }) => {
  return (
    <SubMenu {...props} title={
      <React.Fragment>
        <span>{icon}</span>
        <span className='nav-text'>{title}</span>
      </React.Fragment>
    }/>
  )
}

const CategoryLink = ({ title, icon, route, onLinkClick, visible = true, ...props }) => {
  const urlPath = window.location.pathname
  if (!visible) {
    return null
  }
  const handleClick = () => {
    onLinkClick && onLinkClick()
    if (route && route !== urlPath) {
      store.dispatch(routerNavigate, route)
    }
  }
  return (
    <Menu.Item {...props} onClick={handleClick}>
      <React.Fragment>
        <span>{icon}</span>
        <span className='nav-text'>{title}</span>
      </React.Fragment>
    </Menu.Item>
  )
}

class DashboardSider extends React.Component {
  toggle = () => {
    this.props.onCollapse && this.props.onCollapse()
  }

  handleSelect = () => {
    if (screen.width <= 425) {
      this.toggle()
    }
  }

  logOutUser = () => {
    this.toggle()
    logOut()
  }

  render () {
    if (!this.props.visible) {
      return null
    }
    const coach = this.props.coach
    const mobile = this.props.mobile
    const haveSubscription = coach.firstName && coach.accountType !== 'T0'
    return (
      <Sider
        trigger={null}
        className={this.props.collapsed ? 'hidden' : 'visible'}
        style={{ zIndex: 2, backgroundColor:'#EBEDEF' }}>
        <div className='logo_container'>
          <div className='leClub-logo'></div>
          <img className='burger-btn' src={'https://d1ceovtllg6jml.cloudfront.net/burger_white.svg'} style={{ width: '1.25rem', margin: '1rem', cursor: 'pointer' }} onClick={this.toggle}/>
        </div>
        <Menu
          mode='inline'
          style={{backgroundColor:'#EBEDEF'}}
          defaultSelectedKeys={[this.props.route.path]}
        >
          <Category title={i18n.t('Sider.profile_section.title')} icon={<Icon style={{ fontSize: '20px' }} type='solution' />}>
            <CategoryLink title={i18n.t('Sider.profile_section.personnal_space')} route='/coach/home' onLinkClick={this.handleSelect}/>
            <CategoryLink title={i18n.t('Sider.profile_section.my_match')} route='/coach/matches' onLinkClick={this.handleSelect}/>
            {/* <CategoryLink title={i18n.t('Sider.profile_section.my_trainings')} route='/coach/trainings' onLinkClick={this.handleSelect}/> */}
            {/* <CategoryLink title={i18n.t('Sider.profile_section.my_team')} route='/coach/players' onLinkClick={this.handleSelect}/> */}

            {/* {process.env.NODE_ENV !== 'production' && <CategoryLink title={i18n.t('Sider.profile_section.my_robot')} route='/coach/robots' onLinkClick={this.handleSelect}/>} */}

            <CategoryLink title={i18n.t('Sider.profile_section.my_media_library')} route='/coach/mediatheque' onLinkClick={this.handleSelect}/>
            {/* <CategoryLink title={i18n.t('Sider.profile_section.allPlayer')} route='/coach/all/players' onLinkClick={this.handleSelect}/> */}
            {/* <CategoryLink title={i18n.t('Sider.profile_section.detection')} route='/coach/detection' onLinkClick={this.handleSelect}/> */}
          </Category>
          {/* {!mobile.isOnIOS && <Category title={i18n.t('Sider.subscribe_section.title')} icon={<Icon style={{ fontSize: '20px' }} type='video-camera' />}>
            <CategoryLink title={i18n.t('Sider.subscribe_section.subscribe')} route='/coach/subscribe' onLinkClick={this.handleSelect}/>
            <CategoryLink visible={haveSubscription} title={i18n.t('Sider.subscribe_section.privacy_management')} route='/coach/subscribe/option' onLinkClick={this.handleSelect}/>
            <CategoryLink visible={haveSubscription} title={i18n.t('Sider.subscribe_section.billing_information')} route='/coach/subscribe/billing' onLinkClick={this.handleSelect}/>
            <CategoryLink visible={haveSubscription} title={i18n.t('Sider.subscribe_section.subscription_tracking')} route='/coach/subscribe/tracking' onLinkClick={this.handleSelect}/>
            <CategoryLink visible={haveSubscription} title={i18n.t('Sider.subscribe_section.unsubscribe')} route='/coach/unsubscribe' onLinkClick={this.handleSelect}/>
          </Category>} */}
          <Category title={i18n.t('Sider.tutorial_section.title')} icon={<Icon style={{ fontSize: '20px' }} type='experiment'/>}>
            <CategoryLink title={i18n.t('Sider.tutorial_section.pdf_tutorial')} route='/coach/tutorial/pdf' onLinkClick={this.handleSelect}/>
            {/* <CategoryLink title={i18n.t('Sider.tutorial_section.equipment')} route='/coach/tutorial/video' onLinkClick={this.handleSelect}/> */}
          </Category>
          <Category title={i18n.t('Sider.settings_section.title')} icon={<Icon style={{ fontSize: '20px' }} type='setting'/>}>
            <CategoryLink title={i18n.t('Sider.settings_section.profile_settings')} route='/coach/settings/profile' onLinkClick={this.handleSelect}/>
            <CategoryLink title={i18n.t('Sider.settings_section.editing_settings')} route='/coach/settings/studio' onLinkClick={this.handleSelect}/>
          </Category>
          <CategoryLink title={i18n.t('Sider.disconnect')} onLinkClick={this.logOutUser} icon={<Icon type='logout' style={{ fontSize: '20px' }} />} />
        </Menu>
        {/* {!mobile.isOnIOS && <div style={{ backgroundColor: '#1C246C' }}>
          <div onClick={this.props.openModal} style={{
            cursor: 'pointer',
            color: 'white',
            background: 'linear-gradient(-90deg, rgba(21, 55, 255, 0.4), transparent 60%), linear-gradient(90deg, rgba(21, 55, 255, 0.4), transparent 60%)',
            padding: '30px 10px',
            border: 'solid 1px rgba(21, 55, 255, 1)',
          }}>
            <p style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              marginBottom: '6px',
            }}>{i18n.t('Sider.sponsorship_section.title')}</p>
            <p style={{ textAlign: 'center' }}>{i18n.t('Sider.sponsorship_section.description')}</p>
            <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '3px' }}>{i18n.t('Sider.sponsorship_section.free')}</p>
          </div>
        </div>} */}
      </Sider>
    )
  }
}

export default (props) => {
  const urlPath = compact(window.location.pathname.split('/'))
  const [collapsed, setCollapsed] = useState(screen.width <= 425)
  const [collapsedNotife, setCollapsedNotife] = useState(false)
  const [notif, setNotif] = useState([])

  useEffect(() => {
    if (coach._id) {
      fetchNotification()
    }
    store.dispatch('mobile/setIsOnMobile')
    store.dispatch('mobile/setIsOnIOS')
  }, [])

  const { [routerKey]: route, coach, coachSeason, mobile } = useStoreon(routerKey, 'coach', 'coachSeason', 'mobile')
  const [parrainageModal, setParrainageModal] = useState(coachSeason.currentSeason && coach.parrainagePopup !== null && coachSeason.currentSeason.onboarded ? !coach.parrainagePopup : false)
  const isDashboardNeeded = last(urlPath) !== 'onBoarding' && urlPath[0] === 'coach' && coach.isAuthenticated
  const isBurgerNeeded = checkIfBurgerIsNeeded(urlPath)

  const fetchNotification = async () => {
    const body = await callApi(`coach/${coach._id}/getnotifications`, 'get')
    setNotif(body.notification)
  }

  const toggleSider = () => {
    setCollapsed(!collapsed)
  }

  const notifSider = () => {
    setCollapsedNotife(!collapsedNotife)
  }

  const openParrainageModal = () => {
    setParrainageModal(true)
  }

  const closeParrainageModal = () => {
    if (!coach.parrainagePopup) {
      closeParrainagePopup(coach._id)
    }
    setParrainageModal(false)
  }

  return (
    <Layout style={{ flex: 1, width: '100%' }} className={collapsed ? 'sider-collapsed' : 'sider-opened'}>
      {isDashboardNeeded && <DashboardSider route={route} onCollapse={toggleSider} collapsed={collapsed} visible={isDashboardNeeded} coach={coach} openModal={openParrainageModal} mobile={mobile}/>}
      {isDashboardNeeded && <Notification visible={collapsedNotife} onClose={notifSider} notif={notif} coach={coach} fetchNotification={fetchNotification} />}
      <Layout>
        {isDashboardNeeded && (
          <div className='mobile-header'>
            {isBurgerNeeded && <img src={'https://d1ceovtllg6jml.cloudfront.net/burger.svg'} style={{ width: '1.25rem', margin: '1rem', cursor: 'pointer' }} onClick={toggleSider} />}
            {!isBurgerNeeded && <Button className={'retour-btn'} style={{ fontSize: '1.3rem', padding: 0, margin: 0, marginRight: '10px', marginLeft: '10px' }} icon='left' type='link' onClick={() => { window.history.back() }} />}
            <h1 style={{ margin: 0 }}>{i18n.t(`Sider.CoachPageTitle.${urlPath[1]}`)}</h1>
            <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
              <Badge count={notif.length > 0 ? notif.filter(e => e.isActive).length : 0}>
                <img src={'https://d1ceovtllg6jml.cloudfront.net/bell.svg'} style={{ width: '1.5rem', cursor: 'pointer', marginLeft: 'auto' }} onClick={notifSider} />
              </Badge>
            </div>
          </div>
        )}
        <Content className={'content_container'}>
          {props.children}
        </Content>
      </Layout>
      {!mobile.isOnIOS && <Sponsorship closeParrainageModal={closeParrainageModal} parrainageModal={parrainageModal} parrainageToken={coach.parrainageToken} />}
      <UploadNotification />
    </Layout>
  )
}
