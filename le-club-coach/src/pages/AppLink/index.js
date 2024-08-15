import React, { PureComponent } from 'react'

export default class LinkApp extends PureComponent {

  componentDidMount () {
    const isPlaystore = (/Android/i).test(navigator.userAgent)

    const isAppleStore = (
      /iPad/i.test(navigator.userAgent)
      || (/i(Phone|Pod)/i).test(navigator.platform)
    )

    if (isPlaystore) {
      window.location = 'https://play.google.com/store/apps/details?id=leClubProduction.app'

    } else if (isAppleStore) {
      window.location = 'itms-apps://itunes.apple.com/app/id1457171138'
    } else {
      window.location = 'https://teamballinfc.com/products/players-app'
    }
  }

  render () {
    return (
      <div/>
    )
  }
}
