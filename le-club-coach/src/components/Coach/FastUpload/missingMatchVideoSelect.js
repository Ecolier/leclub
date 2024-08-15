import React, { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import { Select } from 'antd'
import i18n from 'i18n-js'
import '@/i18n'

const MissingMatchVideoSelect = props => {
  const { currentSeason, matches, handleDaySelect } = props
  const [missingVideoMatches, setMissingVideoMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const { Option } = Select

  useEffect(() => {
    setMissingVideoMatches(getMissingVideoMatches())
  }, [matches])

  useEffect(() => {
    setSelectedMatch(null)
  }, [currentSeason.team])

  const getMissingVideoMatches = () => {
    const { team } = currentSeason
    return Object.keys(matches)
      .map(k => matches[k])
      .filter(m => m.teamHome && m.teamAway)
      .filter(m => m.teamHome._id === team || m.teamAway._id === team)
      .filter(m => m.day !== undefined && m.upload === undefined)
      .filter(m => {
        const isHome = m.teamHome._id === team
        const video = isHome ? m.videoHome : m.videoAway
        return !video
      })
      .sort((a, b) => a.day - b.day)
  }

  const handleChange = id => {
    setSelectedMatch(id)
    handleDaySelect(id)
  }

  return (
    !isEmpty(missingVideoMatches) ? <Select value={selectedMatch || i18n.t('MissingMatchVideoSelect.placeholder')} onChange={handleChange}>
      {missingVideoMatches.map(m => (
        <Option key={m._id} value={m._id}>{i18n.t('Common_word.day')} {m.day}</Option>
      ))}
    </Select> : <p style={{ color: 'white', padding: '0.5rem' }}>{i18n.t('MissingMatchVideoSelect.disclaimer')}</p>
  )
}

export default MissingMatchVideoSelect
