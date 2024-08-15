import React from 'react'
import { Drawer, Avatar, Divider } from 'antd'
import moment from 'moment'
import './style.scss'
import i18n from 'i18n-js'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import store from '@/store'
import { callApi } from '@/utils/callApi'

export default (props) => {

  const chaneSatusAndFallBack = async (n) => {

    await callApi(`coach/${props.coach._id}/setCoachNotifications?notificationId=${n._id}`, 'put')
    store.dispatch(router.navigate, n.faleBackUrl)
    props.onClose()
    props.fetchNotification()
  }
  return (
    <Drawer
      title={i18n.t('Notification.title')}
      headerStyle={{ padding: '13.7px 24px' }}
      placement='right'
      closable
      onClose={props.onClose}
      visible={props.visible}>
      {props.notif.length > 0 ? (
        props.notif.map((n, key) =>
          (<div key={key} onClick={() => chaneSatusAndFallBack(n)}>
            <div className='notificationCards' style={{ backgroundColor: n.isActive ? '#2cc1ebcf' : null }}>
              <div style={{ width: '25%' }}>
                <Avatar size={44} shape='square' src={n.url} />
              </div>
              <div className='notificationTexts'>
                <p>{n.info}</p>
                <p className='notificationDate'>{moment(n.date).fromNow()}</p>
              </div>
            </div>
            <Divider style={{ margin: '0px' }}/>
          </div>)
        )
      ) : (
        <p>{`${i18n.t('Notification.noNotification')}`}</p>
      )}

    </Drawer>
  )
}
