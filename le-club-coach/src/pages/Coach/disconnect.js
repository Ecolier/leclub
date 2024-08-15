import React, { Fragment } from 'react'
import { logOut } from '@/actions/service'

export default () => {
  logOut()
  return <Fragment />
}
