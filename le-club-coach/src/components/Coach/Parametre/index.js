import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import UpdateCoachInfo from './updateInfo'
import UpdateProfileInfo from './profile'
import { Tabs } from 'antd'
import './style.css'
const TabPane = Tabs.TabPane
import i18n from 'i18n-js'
import '@/i18n'

class UpdateCoach extends Component {

  render () {
    const { coach } = this.props
    return (
      <div style={{ padding: '10px', height: '100%' }}>
        <Tabs
          defaultActiveKey='1'
          tabPosition='left'
        >
          <TabPane tab={i18n.t('Common_word.private_infos')} key='1'>
            {this.props.initialValues && this.props.initialValues.email && (
              <UpdateCoachInfo initialValues={this.props.initialValues}/>
            )}
          </TabPane>
          <TabPane tab={i18n.t('Common_word.public_infos')} key='2'>
            <UpdateProfileInfo initialValues={{
              biographie: coach.biographie ? coach.biographie : '',
              philosophie: coach.philosophie ? coach.philosophie : '',
              favoriteCoach: coach.favoriteCoach ? coach.favoriteCoach : '',
              playerCareer: coach.playerCareer ? coach.playerCareer : '',
              succesTitle: coach.succesTitle ? coach.succesTitle : '',
              succesValue: coach.succesValue ? coach.succesValue : '',
            }}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    initialValues: { email: coach.email, firstName: coach.firstName, lastName: coach.lastName, password: '', newPassword: '' },
    coach,
  }
  return <UpdateCoach {...props}/>
}
