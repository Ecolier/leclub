import React, { Component } from 'react'
import { connectStoreon } from 'storeon/react'
import { Spin } from 'antd'
import { ClipContextProvider } from '@/components/CutSample/context'
import Studio from '@/components/Studio/Studio'
import { callApi } from '@/utils/callApi'

class ContextStudioPage extends Component {

  async componentDidMount () {
    const { coach, type, id } = this.props
    try {
      const data = await this.fetchVideo(coach, type, id)
      const video = data.video || data.training
      video.training = type === 'training' ? id : undefined

      this.props.dispatch('coach/setCurrentMachVideo', {
        video,
        cuts: data.cuts,
      })
      this.setState({ loading: false })
    } catch (err) {
      console.log(err)
    }
  }

  fetchVideo (coach, type, id) {
    switch (type) {
    case 'match':
      return callApi(`studio/getCut/video/${coach._id}?videoId=${id}`)
    case 'training':
      return callApi(`studio/getCut/training/${coach._id}?trainingId=${id}`)
    default:
      Promise.reject(`Unimplemented video type ${type}`)
    }
  }

  state = {
    loading: true,
    video: undefined,
    match: undefined,
    training: undefined,
    currentCuts: undefined,
  }

  static getDerivedStateFromProps (nextProps) {
    /* Do we need this in the futur ? */
    return {
      video: nextProps.coach.currentVideo,
      match: nextProps.coach.currentMatch,
      training: nextProps.coach.currentTraining,
      currentCuts: nextProps.coach.currentCuts,
    }
  }

  render () {
    if (this.state.loading) {
      return <Spin />
    }
    return (
      <ClipContextProvider>
        <Studio {...this.props} {...this.state} />
      </ClipContextProvider>
    )
  }
}


export default connectStoreonStoreon('coach', ContextStudioPage)
