import './style.scss'
import React, { PureComponent } from 'react'
import { connectStoreon } from 'storeon/react'
import asyncComponent from '@/AsyncComponent'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 

const products = {
  clips: asyncComponent(() => import('./clips')),
  'pre-made-clips': asyncComponent(() => import('./preClips')),
  drawings: asyncComponent(() => import('./drawings')),
  storage: asyncComponent(() => import('./storage')),
  stuff: asyncComponent(() => import('./stuff')),
  reports: asyncComponent(() => import('./reports')),
  detection: asyncComponent(() => import('./detection')),
  'players-app': asyncComponent(() => import('./players')),
  custom: asyncComponent(() => import('./custom')),
  plus: asyncComponent(() => import('./plus')),
}

class Products extends PureComponent {

  render () {
    const Product = products[this.props.id]

    if (!Product) {
      this.props.dispatch(router.navigate, '/')
      return null
    }

    return (
      <div className='b-product-page'>
        <Product />
      </div>
    )
  }
}

export default connectStoreon('dispatch', Products)
