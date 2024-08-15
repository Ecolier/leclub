import React, { useState, useEffect, useRef } from 'react'
import { Select, Button, Radio, notification, Drawer } from 'antd'
import VideoWhiteList from '../VideoWhitelist'
import MissingMatchVideoSelect from '../FastUpload/missingMatchVideoSelect'
import Player from '../../Player'
import Controls from '../../Player/ControlBar'
import Chrono from '../../Player/Chrono'
import { ClipContextProvider } from '../../CutSample/context'
import MatchForm from './matchForm'
import TrainingForm from './trainingForm'
import TeamSelect from '../TeamSelect/switcher'
import { useStoreon } from 'storeon/react'
import { isEmpty } from 'lodash'
import { callApi } from '@/utils/callApi.js'
import { setMatch, fetchMatch } from '@/actions/matches'
import './manage.scss'
import i18n from 'i18n-js'
import '@/i18n'

const ManageRobotVideo = props => {
  const { videoId, coach, currentSeason } = props
  const [video, setVideo] = useState({})
  const [daySelected, setDaySelected] = useState('')
  const [isDaySelectedTouched, setIsDaySelectedTouched] = useState(true)
  const [formChoice, setFormChoice] = useState('match')
  const [privacy, setPrivacy] = useState('')
  const [isPrivacyTouched, setIsPrivacyTouched] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const { Option } = Select
  const formRef = useRef()

  useEffect(() => {
    fetchVideoFromId(videoId)
  }, [videoId])

  useEffect(() => {
    setDaySelected('')
  }, [currentSeason.team])

  const fetchVideoFromId = async (videoId) => {
    const video = await callApi(`${coach._id}/robot/video/${videoId}`)
    setVideo(video)
  }

  const submitForm = async () => {
    try {
      if (formRef.current) {
        formRef.current.validateFields(async (errors, value) => {
          if (!errors) {
            if (!isEmpty(privacy)) {
              if (formChoice === 'custom') {
                const data = await callApi(`robot/video/${coach._id}/createCustomMatchWithVideo`, 'post', {
                  club: currentSeason.club._id,
                  team: currentSeason.team,
                  value,
                  privacy,
                  videoId: video._id,
                })
                setMatch({
                  matchId: data.match._id,
                  match: data.match,
                })
                notification.success({ message: i18n.t('MyRobot.upload_video.success_message'), duration: 4 })
                window.history.back()
              } else if (formChoice === 'training') {
                const data = await callApi(`robot/video/${coach._id}/createTrainingWithVideo`, 'post', {
                  club: currentSeason.club._id,
                  team: currentSeason.team,
                  value,
                  privacy,
                  videoId: video._id,
                })
                props.dispatch('trainings/setTraining', data.training)
                notification.success({ message: i18n.t('MyRobot.upload_video.success_message'), duration: 4 })
                window.history.back()
              }
            } else {
              setIsPrivacyTouched(false)
            }
          }
        })
      } else if (!isEmpty(daySelected) && !isEmpty(privacy)) {
        if (formChoice === 'match') {
          const data = await callApi(`robot/video/${coach._id}/updateMatchVideo`, 'post', {
            club: currentSeason.club._id,
            team: currentSeason.team,
            daySelected,
            privacy,
            videoId: video._id,
          })
          fetchMatch(data.matchId)
          notification.success({ message: i18n.t('MyRobot.upload_video.success_message'), duration: 4 })
          window.history.back()
        }
      } else {
        if (isEmpty(daySelected)) {
          setIsDaySelectedTouched(false)
        }
        if (isEmpty(privacy)) {
          setIsPrivacyTouched(false)
        }
      }
    } catch (err) {
      notification.error({ message: 'Error', description: err, duration: 4 })
    }
  }

  const handleDaySelect = id => {
    setDaySelected(id)
    setIsDaySelectedTouched(true)
  }

  const renderRobotForm = () => {
    if (formChoice === 'match') {
      return (<React.Fragment>
        <MissingMatchVideoSelect currentSeason={currentSeason} matches={props.matches} handleDaySelect={handleDaySelect}/>
        {!isDaySelectedTouched && <p style={{ color: 'red', padding: '0.3rem' }}>{i18n.t('MyRobot.form.no_day_error')}</p>}
        {!isEmpty(daySelected) && renderSelectedMatch()}
      </React.Fragment>)
    } else if (formChoice === 'custom') {
      return (<MatchForm ref={formRef} />)
    } else if (formChoice === 'training') {
      return (<TrainingForm ref={formRef} />)
    }
  }

  const renderSelectedMatch = () => {
    const match = props.matches[daySelected]
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'white' }}>
        <div style={{ width: 150 }}>
          <img src={match.clubHome.urlLogo} height={64} />
          <div>{match.clubHome.name}</div>
        </div>
        <div style={{ margin: '20px', fontWeight: 'bold', fontVariant: 'small-caps' }}>{i18n.t('Common_word.against')}</div>
        <div style={{ width: 150 }}>
          <img src={match.clubAway.urlLogo} height={64} />
          <div>{match.clubAway.name}</div>
        </div>
      </div>
    )
  }

  const managePrivacy = (privacySettings) => {
    setPrivacy({ type: privacySettings.privacy, whitelist: privacySettings.whitelist })
    setIsPrivacyTouched(true)
    setIsModalVisible(false)
  }

  const manageFormChoice = value => {
    setFormChoice(value)
    setDaySelected('')
    setPrivacy({})
  }

  return (
    <div id={'robot_video_container'}>
      <ClipContextProvider>
        <div id={'robot_video_player'}>
          <video src={video.urlCloudFront} controls />
          {screen.width <= 425
            && <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button onClick={() => setIsDrawerVisible(true)}>{i18n.t('MyRobot.assign_button')}</Button>
            </div>}
        </div>
      </ClipContextProvider>
      {screen.width <= 425 ? <Drawer
        placement='right'
        width={'100%'}
        closable
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        <div id={'robot_video_form'}>
          <h1 id={'robot_video_form_title'}>{i18n.t('MyRobot.form.choose_team')}</h1>
          <TeamSelect />
          <h1 id={'robot_video_form_title'}>{i18n.t('MyRobot.form.assign_video.title')}</h1>
          <Select onChange={value => manageFormChoice(value)} defaultValue={formChoice}>
            <Option value={'match'}>{i18n.t('MyRobot.form.assign_video.to_match')}</Option>
            <Option value={'custom'}>{i18n.t('MyRobot.form.assign_video.to_friendly_match')}</Option>
            <Option value={'training'}>{i18n.t('MyRobot.form.assign_video.to_training')}</Option>
          </Select>
          <h1 id={'robot_video_form_title'}>{i18n.t('MyRobot.form.complete_info')}</h1>
          {renderRobotForm()}
          <h1 id={'robot_video_form_title'}>{i18n.t('VideoPrivacyModal.video_privacy')}</h1>
          <Radio.Group id={'robot_video_privacy'} value={!isEmpty(privacy) ? privacy.type : ''}>
            <Radio.Button value='private' onClick={() => setIsModalVisible(true)}>{i18n.t('Common_word.private')}</Radio.Button>
            <Radio.Button value='public' onClick={e => managePrivacy({ privacy: e.target.value, whitelist: [] })}>{i18n.t('Common_word.public')}</Radio.Button>
            <VideoWhiteList modal visible={isModalVisible} onChange={managePrivacy}/>
          </Radio.Group>
          {!isPrivacyTouched && <p style={{ color: 'red', padding: '0.3rem' }}>{i18n.t('MyRobot.form.video_privacy_error')}</p>}
          <Button onClick={submitForm} style={{ marginTop: '1.5rem' }}>{i18n.t('Common_word.save')}</Button>
        </div>
      </Drawer>
        : <div id={'robot_video_form'}>
          <h1 id={'robot_video_form_title'}>{i18n.t('MyRobot.form.choose_team')}</h1>
          <TeamSelect />
          <h1 id={'robot_video_form_title'}>{i18n.t('MyRobot.form.assign_video.title')}</h1>
          <Select onChange={value => manageFormChoice(value)} defaultValue={formChoice}>
            <Option value={'match'}>{i18n.t('MyRobot.form.assign_video.to_match')}</Option>
            <Option value={'custom'}>{i18n.t('MyRobot.form.assign_video.to_friendly_match')}</Option>
            <Option value={'training'}>{i18n.t('MyRobot.form.assign_video.to_training')}</Option>
          </Select>
          <h1 id={'robot_video_form_title'}>{i18n.t('MyRobot.form.complete_info')}</h1>
          {renderRobotForm()}
          <h1 id={'robot_video_form_title'}>{i18n.t('VideoPrivacyModal.video_privacy')}</h1>
          <Radio.Group id={'robot_video_privacy'} value={!isEmpty(privacy) ? privacy.type : ''}>
            <Radio.Button value='private' onClick={() => setIsModalVisible(true)}>{i18n.t('Common_word.private')}</Radio.Button>
            <Radio.Button value='public' onClick={e => managePrivacy({ privacy: e.target.value, whitelist: [] })}>{i18n.t('Common_word.public')}</Radio.Button>
            <VideoWhiteList modal visible={isModalVisible} onChange={managePrivacy}/>
          </Radio.Group>
          {!isPrivacyTouched && <p style={{ color: 'red', padding: '0.3rem' }}>{i18n.t('MyRobot.form.video_privacy_error')}</p>}
          <Button onClick={submitForm} style={{ marginTop: '1.5rem' }}>{i18n.t('Common_word.save')}</Button>
        </div>}
    </div>
  )
}

export default (initialProps) => {
  const { dispatch, coach, coachSeason, matches } = useStoreon('coach', 'coachSeason', 'matches')
  const { currentSeason } = coachSeason
  const props = {
    ...initialProps,
    dispatch,
    coach,
    currentSeason,
    matches,
  }
  return <ManageRobotVideo {...props} />
}
