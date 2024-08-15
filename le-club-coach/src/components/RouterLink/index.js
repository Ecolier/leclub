import React, { PureComponent } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 

class RouterLink extends PureComponent {

  handleClick = (evt) => {

    evt.preventDefault()
    this.props.dispatch(router.navigate, this.props.to)
    return false
  }

  render () {
    const { children, to, target, ...props } = this.props

    if (target !== '_blank') { props.onClick = this.handleClick }
    props.href = to
    props.dispatch = null
    props.target = target || ''

    return React.createElement('a', props, children)
  }

}

export default connectStoreon(
  'dispatch',
  RouterLink,
)
