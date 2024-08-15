import React, { Component } from 'react'
import { connectStoreon } from 'storeon/react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 

import { Button } from 'antd'

class Players extends Component {
  render () {

    return (
      <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '20px', paddingLeft: '20px' }}>
        <Button onClick={() => { this.props.dispatch(router.navigate, '/login') }} type='primary' style={{ zIndex: 10, position: 'fixed', top: '50%', left: '50%', fontSize: '2rem', height: 'auto', fontWeight: 'bold', transform: 'translate(-50%, 0%)' }}>SE CONNECTER</Button>
        <img src ='https://d1ceovtllg6jml.cloudfront.net/fakeUser1.png' />
        <img src ='https://d1ceovtllg6jml.cloudfront.net/fakeUser.png' />
      </div>
    )
  }
}

export default connectStoreon('dispatch', Players)
