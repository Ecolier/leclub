import React, { useState } from 'react'
import { AutoComplete, Select } from 'antd'
import i18n from 'i18n-js'
import { get } from 'superagent'
import '@/i18n'

const { Option } = Select

const CountryFlag = (props) => {
  const country = props.country && props.country.toLowerCase()
  return (
    <img src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/4x3/${country}.svg`} height={12} style={{ margin: '0 10px' }} />
  )
}

const ClubLogo = (props) => {
  if (props.logo === undefined || (/logo_ok/).test(props.logo)) {
    return (
      <i className='fas fa-shield-alt' style={{ fontSize: 24, width: 32 }} />
    )
  }
  return (
    <img src={props.logo} height={32} width={32} />
  )
}

const ClubAutoComplete = props => {
  const [clubs, setClubs] = useState([])

  async function handleChange (value) {
    const res = await get(`${process.env.WEBHOOK_URL_CLUB}?name=${value || ''}`)
    setClubs(res.body.clubs || [])
  }

  function handleSelect (v) {
    props.onSelect && props.onSelect(v)
    props.onChange && props.onChange(v)
  }

  return (
    <AutoComplete
      dropdownMatchSelectWidth
      optionLabelProp='name'
      onChange={handleChange}
      onSelect={handleSelect}
      placeholder={i18n.t('ClubAutoComplete.placeholder')}
      dataSource={
        clubs.map(club => (
          <Option key={club._id.$oid} value={club._id.$oid} name={club.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 32 }}>
              <div>{club.name}</div>
              <div>
                <CountryFlag country={club.country} />
                <ClubLogo logo={club.urlLogo} />
              </div>
            </div>
          </Option>
        ))
      }
    />
  )
}

export default (props) => {
  return (
    <ClubAutoComplete {...props} />
  )
}
