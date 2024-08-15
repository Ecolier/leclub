import React, { useState, useEffect } from 'react'
import { StoreContext, connectStoreon, customContext, useStoreon } from 'storeon/react' 
import { Spin, Icon, Card, Tooltip, Popconfirm, notification } from 'antd'
import { callApi } from '@/utils/callApi.js'
import { isEmpty } from 'lodash'
import moment from 'moment'
import './style.scss'
import i18n from 'i18n-js'
import '@/i18n'

const RobotVideos = props => {
  const { coach } = props
  const [robotVideos, setRobotVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRobotVideos()
  }, [])

  const fetchRobotVideos = async () => {
    setRobotVideos(await callApi(`coach/${coach._id}/robot`))
    setIsLoading(false)
  }

  const manageVideo = videoId => {
    props.dispatch(router.navigate, `/coach/robot/${videoId}`)
  }

  const deleteRobotVideo = async matchTmpRobotId => {
    try {
      const result = await callApi(`robot/${coach._id}/delete/${matchTmpRobotId}`, 'delete')
      setRobotVideos(await callApi(`coach/${coach._id}/robot`))
      notification.success({ message: result.message, duration: 4 })
    } catch (err) {
      notification.error({ message: err, duration: 4 })
    }
  }

  const renderRobotVideos = () => {
    if (!isEmpty(robotVideos)) {
      return robotVideos.map((video, i) => (
        <div key={i} className={'video_card'}>
          <Card cover={<video>
            <source src={video.urlCloudFront}/>
          </video>} actions={[
            <Tooltip>
              <div onClick={() => manageVideo(video._id)}>
                <Icon type='play-circle' style={{ color: '#EA178C' }}/>
                <div style={{ color: '#EA178C' }}>{i18n.t('Common_word.editing')}</div>
              </div>
            </Tooltip>,
            <Popconfirm
              title={i18n.t('MyRobot.deleteVideoConfirm')}
              onConfirm={() => deleteRobotVideo(video._id)}
              okText={i18n.t('Common_word.yes')}
              cancelText={i18n.t('Common_word.no')}
            >
              <div style={{ width: '100%', height: '100%' }}>
                <Tooltip>
                  <Icon type='close' key='close' style={{ color: '#FF0000' }}/>
                  <div style={{ color: '#FF0000' }}>{i18n.t('Common_word.delete')}</div>
                </Tooltip>
              </div>
            </Popconfirm>,
          ]}>
            <p>{i18n.t('MyRobot.video')} {moment(video.createdAt).format('DD/MM/YYYY')}</p>
          </Card>
        </div>
      ))
    }
    return (<p style={{ paddingLeft: '0.5rem' }}>{i18n.t('MyRobot.disclaimer')}</p>)
  }

  return (
    <div id={'robot_video_list_container'}>
      <h1>{i18n.t('MyRobot.title')}</h1>
      {!isLoading ? <div id={'robot_video_list'}>{renderRobotVideos()}</div>
        : <Spin indicator={<Icon type='loading' style={{ fontSize: 24 }} spin/>} />}
    </div>
  )
}

export default initialProps => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <RobotVideos {...props} />
}
