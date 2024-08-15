import React, { Component } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { activeAccount, verifeTokenActiveAccount } from '@/actions/service.js'
import ChangePassword from '@/components/ChangePassword'
import { getQueryStringValue } from '@/utils/helper.js'

class ActiveAccount extends Component {

  componentDidMount () {
    const token = getQueryStringValue('token')
    if (token) {
      try {
        const tokenDecode = verifeTokenActiveAccount(token)
        this.setState({ token: tokenDecode.token, id: tokenDecode.id })
      } catch (err) {
        this.props.dispatch(router.navigate, '/')
      }
    } else {
      this.props.dispatch(router.navigate, '/')
    }
  }

  state = {
    id: null,
    token: null,
  }

  onSubmit = (event) => {
    const { id, token } = this.state
    activeAccount({ password: event.password, id, token, type: 'coach' })
  }

  render () {
    return (
      <div className='baseInformation'>
        <div className='middleIcons'>
          <div className='activePasswordForm' style={{ backgroundColor: '#f1f1ef' }}>
            <ChangePassword onSubmit={this.onSubmit}/>
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
  return <ActiveAccount {...props} />
}
