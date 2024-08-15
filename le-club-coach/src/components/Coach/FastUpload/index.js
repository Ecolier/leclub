import React from 'react'
import { useStoreon } from 'storeon/react'
import { Button, Divider, Upload, Icon, Select } from 'antd'
import { uploadVideo } from '@/actions/upload'
import MissingMatchVideoSelect from './missingMatchVideoSelect'
import i18n from 'i18n-js'
import '@/i18n'

const { Option } = Select

class FastUpload extends React.PureComponent {

  state = {
    fileList: [],
    selectedMatch: undefined,
  }

  getMissingVideoMatches = () => {
    const { team } = this.props.currentSeason
    return Object.keys(this.props.matches)
      .map(k => this.props.matches[k])
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

  handleRemove = file => {
    this.setState({
      fileList: this.state.fileList.filter(f => f.uid !== file.uid),
    })
  }

  handleAdd = file => {
    this.setState({
      fileList: [...this.state.fileList, file],
    })
  }

  handleUpload = () => {
    const coachId = this.props.coach._id
    const { season, team } = this.props.currentSeason

    this.props.dispatch(uploadVideo({
      coachId,
      season,
      teamId: team,
      files: this.state.fileList,
      matchId: this.state.selectedMatch,
      privacy: 'public',
      whitelist: [coachId],
    }))
    this.setState({
      fileList: [],
      selectedMatch: undefined,
    })
  }

  handleDaySelect = id => {
    this.setState({ selectedMatch: id })
  }

  // renderDaySelect = ({ matches }) => {
  //   return (
  //     <Select value={this.state.selectedMatch || 'Selectionne une journée'} onChange={this.handleDaySelect}>
  //       {matches.map(m => (
  //         <Option key={m._id} value={m._id}>Journ&eacute;e {m.day}</Option>
  //       ))}
  //     </Select>
  //   )
  // }

  renderUploadButton = () => {
    const disabled = (
      this.state.fileList.length === 0
      || this.state.selectedMatch === undefined
    )
    return (
      <Button onClick={this.handleUpload} disabled={disabled}>{i18n.t('FastUpload.send_button')}</Button>
    )
  }

  renderSelectedMatch = () => {
    const match = this.props.matches[this.state.selectedMatch]
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
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

  render () {
    const matches = this.getMissingVideoMatches()
    if (matches.length === 0) {
      return null
    }

    const uploadProps = {
      multiple: true,
      onRemove: this.handleRemove,
      beforeUpload: file => {
        this.handleAdd(file)
        return false
      },
      fileList: this.state.fileList,
    }

    const UploadButton = this.renderUploadButton
    const SelectedMatch = this.renderSelectedMatch

    return (
      <React.Fragment>
        <Upload.Dragger {...uploadProps}>
          <p className='ant-upload-drag-icon'>
            <Icon type='inbox' />
          </p>
          <p className='ant-upload-text'>{i18n.t('FastUpload.description')}</p>
          <p className='ant-upload-hint' />
          <Divider />
          <div onClick={evt => evt.stopPropagation()} style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 10 }}>
              <MissingMatchVideoSelect matches={matches} currentSeason={this.props.currentSeason} handleDaySelect={this.handleDaySelect}/>
            </div>

            {this.state.selectedMatch && (
              <div style={{ marginBottom: 10 }}>
                <SelectedMatch />
              </div>
            )}
            <div>
              <UploadButton />
            </div>
          </div>
        </Upload.Dragger>
      </React.Fragment>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach, coachSeason, matches } = useStoreon('coach', 'coachSeason', 'matches')
  return React.createElement(FastUpload, {
    ...initialProps,
    dispatch,
    coach,
    currentSeason: coachSeason.currentSeason,
    matches,
  })
}
