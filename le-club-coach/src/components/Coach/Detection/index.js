import React, { Component } from 'react'
import { useStoreon } from 'storeon/react'
import {
  Radio,
  Button,
  Modal,
  notification,
  Pagination,
  Table,
  Icon,
  Upload,
  Form,
  Select,
  Input,
  DatePicker,
} from 'antd'
import { callApi } from '@/utils/callApi'

import 'moment/locale/fr'
import moment from 'moment'
import { Formik } from 'formik'
import './detection.scss'
import i18n from 'i18n-js'
import '@/i18n'
import MobileTable from '../../MobileTable/MobileTable'
import MediaQuery from 'react-responsive'

moment.locale('fr')

const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

const formatDate = (data) => moment(data).format('Do MMMM YYYY')

const InputGroup = ({ children, ...props }) => {
  props.style = {
    ...props.style,
    display: 'flex',
    flexWrap: 'wrap',
  }
  return React.createElement('div', props, children)
}

const makeField = Component => ({ err, label, placeholder, children, ...rest }) => {
  const hasError = err
  return (
    <FormItem
      label={label}
      style={{ marginRight: 10 }}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={!!hasError}
      help={hasError && err}
    >
      <Component {...rest} children={children} placeholder={placeholder} style={{ width: '100%' }} />
    </FormItem>
  )
}

const AInput = makeField(Input)
const ATextArea = makeField(TextArea)
const ADate = makeField(DatePicker)

const createPlayersModalState = () => ({
  detection: undefined,
  page: 1,
  players: [],
  playersCount: 0,
  sortBy: 'subscribeDate',
  sortOrder: '1',
  submiting: false,
})

const PlayerHeader = (props) => {
  const { data } = props

  return (
    <div>
      <h2>{data.title}</h2>
    </div>
  )
}

const PlayerDetails = (props) => {
  const { data } = props

  return (
    <div>
      <p><b>{i18n.t('Common_word.about')}:</b> {data.about}</p>
      <p><b>{i18n.t('Common_word.location')}:</b> {data.location}</p>
      <p><b>{i18n.t('Common_word.date')}:</b> {formatDate(data.date)}</p>
      <p><b>{i18n.t('Common_word.link')}:</b> <a href={data.link}>{data.link}</a></p>
      <p><b>{i18n.t('Common_word.status')}:</b> <span style={{ color: data.isValidated ? 'green' : data.isValidated === false ? 'red' : 'orange' }}>{data.isValidated ? i18n.t('Common_word.validated') : data.isValidated === false ? i18n.t('Common_word.refused') : i18n.t('Common_word.waiting')}</span></p>
    </div>
  )
}

class Detection extends Component {

  componentDidMount () {
    this.changePage(this.state.page, 10)
  }

  state = {
    file: undefined,
    fileInfo: undefined,
    date: undefined,
    club: undefined,
    clubInput: undefined,
    editDectionModal: false,
    detections: [],
    detectionCount: 0,
    selectedDetectionEdit: undefined,

    page: 1,
    playersModal: createPlayersModalState(),
    createModal: false,
  }

  changePage = (page, limit) => {
    const offset = Math.max(page - 1, 0) * limit
    callApi(`coach/detections/${this.props.coach._id}?offset=${offset}&limit=${limit}`, 'get').then(result => {
      this.setState({
        detections: result.list,
        page,
        detectionCount: result.count,
      })
    })
  }

  changePlayersPage = (id, page) => {
    const limit = 10
    const offset = Math.max(page - 1, 0) * limit
    const sortBy = this.state.playersModal.sortBy
    const order = this.state.playersModal.sortOrder
    callApi(`coach/detection/${id}/players/${this.props.coach._id}?offset=${offset}&limit=${limit}&order=${order}&sort=${sortBy}`, 'get').then(({ players, count }) => {
      const playersModal = this.state.playersModal
      playersModal.detection = id
      playersModal.players = players
      playersModal.page = page
      playersModal.count = count
      this.setState({ playersModal })
    })
  }

  editDetection = (id) => {
    const d = this.state.detections.find(d => d._id === id)
    this.setState({
      selectedDetectionEdit: d,
      date: moment(d.date),
      clubInput: d.club && d.club.name,
      club: d.club,
    })
  }

  showDeleteConfirm = (id) => {
    Modal.confirm({
      title: `${name}`,
      content: <div><p>{i18n.t('Detection.delete.confirm')}?</p></div>,
      okText: i18n.t('Common_word.yes'),
      okType: 'danger',
      cancelText: i18n.t('Common_word.no'),
      onOk: () => {
        callApi(`coach/detection/${id}/delete/${this.props.coach._id}`, 'post').then(() => {
          notification.success({
            message: i18n.t('Detection.delete.success'),
            description: '',
          })
          this.changePage(this.state.page, 10)
        }).catch((error) => {
          notification.error({
            message: i18n.t('Common_word.500ErrorMessage'),
            description: error,
          })
        })
      },
    })
  }

  renderList () {
    const columns = [
      { title: i18n.t('Common_word.title'), dataIndex: 'title', key: 'title' },
      { title: i18n.t('Common_word.about'), dataIndex: 'about', key: 'about' },
      { title: i18n.t('Common_word.location'), dataIndex: 'location', key: 'loc' },
      { title: i18n.t('Detection.date'), dataIndex: 'date', render: formatDate, key: 'date' },
      { title: i18n.t('Common_word.link'), dataIndex: 'link', key: 'link', render: (data) => (<a href={data} target='_blank' style={{ color: 'dodgerblue' }}>{data}</a>) },
      { title: i18n.t('Common_word.status'), dataIndex: 'isValidated', key: 'isValidated', render: (data) => (<p style={{ color: data ? 'green' : data === false ? 'red' : 'orange' }}>{data ? i18n.t('Common_word.validated') : data === false ? i18n.t('Common_word.refused') : i18n.t('Common_word.waiting')}</p>) },
      {
        title: i18n.t('Common_word.action'),
        key: 'action',
        width: 200,
        render: (t, data) => (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button onClick={() => this.changePlayersPage(data._id, 1)} >{i18n.t('Common_word.players')}</Button>
            <Button onClick={() => { this.editDetection(data._id); this.setState({ editDectionModal: true }) }} >{i18n.t('Common_word.modify')}</Button>
            <Button type='danger' onClick={() => this.showDeleteConfirm(data._id)}>{i18n.t('Common_word.delete')}</Button>
          </div>
        ),
      },
    ]
    return (
      <MediaQuery minDeviceWidth='1200px'>
        {(matches) =>
          matches
            ? <Table bordered dataSource={this.state.detections} columns={columns} pagination={false} rowKey='_id' scroll={{ x: true }} />
            : <MobileTable
              dataSource={this.state.detections}
              InCollapse={PlayerDetails}
              InVisible={PlayerHeader}
              actions={[
                <div onActionClick={(data) => this.changePlayersPage(data._id, 1)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon type='user' key='ellipsis' style={{ marginRight: '10px' }}/>
                  <p>{i18n.t('Common_word.players')}</p>
                </div>,
                <div onActionClick={(data) => { this.editDetection(data._id); this.setState({ editDectionModal: true }) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon type='edit' key='ellipsis' style={{ marginRight: '10px' }}/>
                  <p>{i18n.t('Common_word.modify')}</p>
                </div>,
                <div onActionClick={(data) => this.showDeleteConfirm(data._id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon type='delete' key='ellipsis' style={{ marginRight: '10px', color: 'red' }}/>
                  <p>{i18n.t('Common_word.delete')}</p>
                </div>,
              ]}
            />
        }
      </MediaQuery>
    )
  }

  renderForm (opts = {}) {
    return (
      <Formik
        initialValues={opts.values}
        validate={this.validate}
        onSubmit={this.onSubmit}
      >
        {({
          values,
          errors,
          handleSubmit,
          handleChange,
        }) => (
          <form title='detectionForm' className='publicUpdate' onSubmit={handleSubmit}>
            <AInput
              value={values.title || ''}
              onChange={handleChange}
              err={errors.title}
              name='title'
              label={<span><span style={{ color: 'red' }}>*</span>{i18n.t('Common_word.title')}</span>}
              placeholder={i18n.t('Common_word.title')}
            />
            <ATextArea
              value={values.about || ''}
              onChange={handleChange}
              err={errors.about}
              rows={5}
              name='about'
              label={<span><span style={{ color: 'red' }}>*</span> À propos</span>}
              placeholder={i18n.t('Common_word.about')}
            />
            <InputGroup compact>
              <ADate
                value={this.state.date}
                onChange={date => this.setState({ date })}
                err={errors.about}
                name='date'
                label={<span><span style={{ color: 'red' }}>*</span>{i18n.t('Detection.date')}</span>}
                placeholder={i18n.t('Detection.date')}
              />
            </InputGroup>
            <AInput
              value={values.location || ''}
              onChange={handleChange}
              err={errors.about}
              name='location'
              label={<span><span style={{ color: 'red' }}>*</span>{i18n.t('Common_word.location')}</span>}
              placeholder={i18n.t('Common_word.location')}
            />
            <InputGroup compact>
              <AInput
                value={values.link || ''}
                onChange={handleChange}
                err={errors.link}
                name='link'
                label={<span>{i18n.t('Common_word.link')}</span>}
                placeholder={i18n.t('Common_word.link')}
              />
            </InputGroup>
            <Upload style={{ width: '100%' }} accept='image/*,video/*' multiple={false} onRemove={() => this.setState({ file: undefined, fileInfo: undefined })} beforeUpload={this.beforeFileUpload} fileList={this.state.fileInfo ? [this.state.fileInfo] : []}>
              <Button style={{ height: '70px' }}>
                <Icon type='upload' /> <h4>{i18n.t('Detection.media')}</h4>
              </Button>
            </Upload>
            <br />
            <Button type='primary' htmlType='submit' style={{ marginTop: '20px' }} loading={this.state.submiting}>
              { opts.submitMsg }
            </Button>
          </form>
        )}
      </Formik>
    )
  }

  resetForm = (resetForm) => {
    resetForm({})
    this.setState({
      date: undefined,
      selectedDetectionEdit: undefined,
      file: undefined,
      fileInfo: undefined,
      club: undefined,
      clubInput: undefined,
      createModal: false,
    })
  }

  onSubmit = (event, { resetForm }) => {
    this.setState({ submiting: true })
    const selected = this.state.selectedDetectionEdit || {}

    event.secondSuscribeDate = new Date()
    event.date = this.state.date
    if (this.state.clubInput && this.state.club) {
      event.club = this.state.club._id
    }

    if (this.state.file) {
      const formData = new FormData()
      for (const key in event) {
        if (event[key]) { formData.append(key, event[key]) }
      }
      formData.append('file', this.state.file)
      event = formData
    }

    let call
    if (selected._id) {
      call = callApi(`coach/detection/${selected._id}/edit/${this.props.coach._id}`, 'post', event)
      call.then(() => {
        notification.success({
          message: i18n.t('Detection.modify'),
        })
      })
    } else {
      call = callApi(`coach/detection/create/${this.props.coach._id}`, 'post', event)
      call.then(() => {
        notification.success({
          message: i18n.t('Detection.created.title'),
          description: i18n.t('Detection.created.description'),
        })
      })
    }

    call.then(() => {
      this.resetForm(resetForm)
      this.changePage(1, 10)
    }).catch((error) => {
      notification.error({
        message: i18n.t('Common_word.500ErrorMessage'),
        description: error,
      })
    }).finally(() => {
      this.setState({ submiting: false, editDectionModal: false })
    })
  }

  validate = values => {
    const errors = {}
    const requiredFields = ['title', 'about', 'location', 'date']
    requiredFields.forEach(field => { if (!values[field] && !this.state[field]) { errors[field] = i18n.t('Common_word.required') } })
    return errors
  }

  beforeFileUpload = (file) => {
    this.setState({
      file,
      fileInfo: {
        uid: file.uid,
        name: file.name,
        status: 'done',
        response: '{"status": "success"}',
        linkProps: '{"download": "image"}',
      },
    })
    return false
  }

  renderPlayersList = (players) => {
    const columns = [
      { title: i18n.t('Common_word.name'), dataIndex: 'name', key: 'name' },
      { title: i18n.t('Common_word.email'), dataIndex: 'email', key: 'email' },
      { title: i18n.t('Common_word.team'), dataIndex: 'team', key: 'team' },
      { title: i18n.t('Common_word.phone_number'), dataIndex: 'phone', key: 'phone' },
      { title: i18n.t('Common_word.snapchat'), dataIndex: 'snapchat', key: 'snapchat' },
      { title: i18n.t('Detection.subscribeDate'), dataIndex: 'subscribeDate', render: formatDate, key: 'sdate' },
    ]
    return (<Table dataSource={players} columns={columns} pagination={false} rowKey='_id' scroll={{ x: true }} />)
  }

  handlePlayersSortByChange = (value) => {
    const playersModal = this.state.playersModal
    playersModal.sortBy = value
    this.setState({ playersModal })
    this.changePlayersPage(playersModal.detection, 1)
  }

  handlePlayersSortOrderChange = (e) => {
    const playersModal = this.state.playersModal
    playersModal.sortOrder = e.target.value
    this.setState({ playersModal })
    this.changePlayersPage(playersModal.detection, 1)
  }

  renderEditForm () {
    const selected = this.state.selectedDetectionEdit
    const values = {
      title: selected.title,
      about: selected.about,
      location: selected.location,
      link: selected.link,
    }
    return this.renderForm({
      submitMsg: i18n.t('Common_word.modify'),
      values,
    })
  }
  renderPlayersModalContent = (players) => {
    return (
      <div>
        <div>
          <span>{i18n.t('Common_word.sortBy')}:</span>
          <Select defaultValue={this.state.playersModal.sortBy} onChange={this.handlePlayersSortByChange}>
            <Option value='subscribeDate'>{i18n.t('Detection.subscribeDate')}</Option>
            <Option value='team'>{i18n.t('Common_word.team')}</Option>
            <Option value='name'>{i18n.t('Common_word.name')}</Option>
            <Option value='email'>{i18n.t('Common_word.email')}</Option>
          </Select>
          <Radio.Group value={this.state.playersModal.sortOrder} onChange={this.handlePlayersSortOrderChange}>
            <Radio.Button value='1'>{i18n.t('Common_word.ascending')}</Radio.Button>
            <Radio.Button value='-1'>{i18n.t('Common_word.descending')}</Radio.Button>
          </Radio.Group>
        </div>
        { this.renderPlayersList(players) }
        <Pagination
          current={this.state.playersModal.page}
          total={this.state.playersModal.count}
          onChange={(page) => this.changePlayersPage(this.state.playersModal.detection, page)}
        />
      </div>
    )
  }

  renderPlayersModal () {
    return (
      <Modal
        title={i18n.t('Common_word.title')}
        width='80vw'
        visible={!!this.state.playersModal.detection}
        onCancel={() => {
          this.setState({ playersModal: createPlayersModalState() })
        }}
        footer={null}
      >
        {
          this.state.playersModal.players
            && (this.state.playersModal.players.length === 0
              ? (<span>{i18n.t('Detection.noPlayers')}</span>)
              : this.renderPlayersModalContent(this.state.playersModal.players))
        }
      </Modal>
    )
  }

  renderEditModal () {
    return (
      <Modal
        title={i18n.t('Common_word.title')}
        width='80vw'
        visible={this.state.editDectionModal}
        onCancel={() => {
          // this.resetForm()
          this.setState({ editDectionModal: false })
        }}
        footer={null}
      >{ this.state.selectedDetectionEdit && (this.renderEditForm())}
      </Modal>
    )
  }

  render () {
    const { createModal } = this.state
    return (
      <div className='leClub-coach-detection'>
        <h1>{i18n.t('Sider.profile_section.detection')}</h1>
        <hr/>
        <h2 style={{ fontSize: '1.2rem', marginTop: '10px' }}>{i18n.t('Sider.profile_section.my_detection')}</h2>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', margin: '10px 0' }}>
          <Button type='primary' onClick={() => this.setState({ createModal: true })} style={{ fontSize: '1rem', padding: '5px', height: 'auto', width: '100px' }}>
            <Icon type='plus' style={{ fontSize: '1rem', fontWeight: 'bold' }}/>
            {i18n.t('Common_word.add')}
          </Button>
        </div>
        { this.renderList() }
        <Pagination
          style={{ marginTop: '10px' }}
          current={this.state.page}
          total={this.state.detectionCount}
          onChange={this.changePage}
        />
        { this.renderPlayersModal() }
        { this.renderEditModal() }
        <Modal
          visible={createModal}
          title={i18n.t('Detection.new')}
          onCancel={() => { this.setState({ createModal: false }) }}
          footer={[
            <Button type='default' onClick={() => { this.setState({ createModal: false }) }}>{i18n.t('Common_word.back')}</Button>,
          ]}
          width={'800px'}
        >
          <div>
            {this.renderForm({ submitMsg: i18n.t('Common_word.create') })}
          </div>
        </Modal>
      </div>
    )
  }
}

export default (initialProps) => {
  const { dispatch, coach } = useStoreon('coach')
  const props = {
    ...initialProps,
    dispatch,
    coach,
  }
  return <Detection {...props} />
}
