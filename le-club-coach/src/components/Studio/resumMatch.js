import { Table } from 'antd'
import React from 'react'

class ResumMatch extends React.Component {

  render () {
    const columns = [{
      title: 'THEME',
      dataIndex: 'theme',
      width: '10%',

    }, {
      title: 'AVANT MATCH',
      dataIndex: 'befforeMatch',
      width: '30%',
    },
    {
      title: 'MATCH',
      dataIndex: 'durringMatch',
      width: '30%',
    },
    {
      title: 'APRES MATCH',
      dataIndex: 'afterMatch',
      width: '30%',
    }]

    const data = []
    this.props.arrayInfoMatch[0].forEach((m, key) => {
      data.push({
        theme: this.props.arrayInfoMatch[0][key].title,
        befforeMatch: this.props.arrayInfoMatch[0][key].about,
        durringMatch: this.props.arrayInfoMatch[1][key].about,
        afterMatch: this.props.arrayInfoMatch[2][key].about,
        key,
      })
    })

    return (
      <Table
        columns={columns}
        dataSource={data}
        bordered
      />
    )
  }
}

export default ResumMatch
