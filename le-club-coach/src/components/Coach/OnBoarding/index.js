import React from 'react'
import Pricing from './pricing'
import Stripe from '@/pages/Stripe/add'
import { callApi } from '@/utils/callApi'
import { populateCoach } from '@/actions/coach'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 

class OnBoarding extends React.PureComponent {

  state = {
    subscribeType: undefined,
  }

  getSubscribeType = () => {
    if (this.state.subscribeType) {
      return this.state.subscribeType
    }
    switch (this.props.coach.accountType) {
    case 'T0':
      return 'basic'
    case 'T1':
      return 'premium'
    case 'T2':
      return 'coach'
    case 'T3':
      return 'club'
    default:
      return undefined
    }
  }

  handlePricingSelect = (subscribeType) => {
    this.setState({ subscribeType })
  }

  handleStripeClick = ({ key }) => {
    if (key === 'home') {
      this.props.dispatch(router.navigate, '/coach/home')
    }
  }

  handleSuccess = async () => {
    const coachId = this.props.coach._id
    await callApi(`${coachId}/onboarded`, 'put')
    this.props.dispatch('seasons/setOnboarded')
    await populateCoach()
    this.props.dispatch(router.navigate, '/coach/home')
  }

  handleStripeBack = () => {
    return this.setState({ subscribeType: undefined })
  }

  renderSelectClub = () => {
    return (
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: 40 }}>
        <h1>{i18n.t('onBoarding.inactiveClub')}</h1>
        <h2 style={{ color: '#777' }}>{i18n.t('onBoarding.disclaimer')}: <a href='mailto:equipe@leClub.co'>equipe@leClub.co</a></h2>
      </div>
    )
  }

  render () {
    const SelectClub = this.renderSelectClub
    const { coach, currentSeason } = this.props

    if (!currentSeason.club) {
      return <SelectClub />
    }
    // if coach is already T3 just skip onboarding
    if (coach.accountType === 'T3' && currentSeason.club) {
      this.handleSuccess()
      return null
    }
    if (!this.state.subscribeType && coach.accountType === 'T0') {
      return (
        <Pricing onSelect={this.handlePricingSelect} />
      )
    }
    return (
      <Stripe
        subscribeType={this.getSubscribeType()}
        handleClick={this.handleStripeClick}
        onSuccess={this.handleSuccess}
        onBack={this.handleStripeBack}
        isOnboarding
      />
    )
  }
}

export default initialeProps => {
  const { dispatch, coach, coachSeason } = useStoreon('coach', 'coachSeason')

  return React.createElement(OnBoarding, {
    ...initialeProps,
    dispatch,
    coach,
    currentSeason: coachSeason.currentSeason,
  })
}
