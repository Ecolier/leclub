import React, { Component, Fragment } from 'react'
import fr_FR from 'antd/lib/locale-provider/fr_FR'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { notification, ConfigProvider } from 'antd'
import Router from '@/router'
import { restoreCoach } from '@/actions/coach'
import Dashboard from '@/layouts/Dashboard'

/* Style */

import '@/styles/index.scss'
import '@/styles/player.scss'
import '@/styles/logStyle.scss'
import '@/styles/clubStyle.scss'
import '@/styles/homeStyle.scss'
import '@/styles/carousel.scss'
import '@/styles/aliceCarousel.scss'

/* End of style */

notification.config({
  placement: 'bottomRight',
})

const openNotification = (type, title, description) => {
  notification[type]({
    message: title,
    description,
  })
}

class App extends Component {

  async componentDidMount () {
    await restoreCoach()
    this.setState({ loading: false })
  }

  state = {
    loading: true,
  }

  render () {
    if (this.state.loading) {
      // TODO: Better loading style :)
      return null
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {screen.width > 800 && <Header />}
        <div id={'leClubApp'} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ConfigProvider locale={fr_FR}>
            <Dashboard>
              <Router openNotification={openNotification}/>
            </Dashboard>
          </ConfigProvider>
        </div>
        {screen.width > 425 && <Footer />}
      </div>
    )
  }
}

export default App
