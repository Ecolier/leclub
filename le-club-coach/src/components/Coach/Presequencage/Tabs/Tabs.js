import React, { useState } from 'react'
import { Tabs } from 'antd'
import Numbers from '../Numbers/Number'
import Highlights from '../Highlights/Highlights'
import './tabs.css'
import i18n from 'i18n-js'
import '@/i18n'

export default (props) => {
  const { coach, createLap, timerRef, teamComp } = props
  const [activeKey, setActiveKey] = useState('1')

  const handleActiveKey = (value) => {
    setActiveKey(value)
  }
  return (

    <Tabs activeKey={activeKey} onChange={handleActiveKey} tabBarStyle={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
      <Tabs.TabPane tab={<div><p style={{ textAlign: 'center' }}>{i18n.t('Presequencage.tab1')}</p></div>} key='1'>
        <Numbers timerRef={timerRef} createLap={createLap} teamComp={teamComp}/>
      </Tabs.TabPane>
      <Tabs.TabPane tab={<div><p style={{ textAlign: 'center' }}>{i18n.t('Presequencage.tab2')}</p></div>} key='2'>
        <Highlights coach={coach} timerRef={timerRef} createLap={createLap}/>
      </Tabs.TabPane>
    </Tabs>
  )
}
