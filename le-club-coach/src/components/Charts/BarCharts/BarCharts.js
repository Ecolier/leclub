import React, { useState, useEffect } from 'react'
import { formatChartData } from '@/utils/chartsUtils'
import { Bar } from 'react-chartjs-2'
import { Card } from 'antd'

const BarCharts = props => {
  const { data, responsive, title, label } = props
  const [graphData, setGraphData] = useState({})
  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            stepSize: 1,
          },
        }],
    },
  }

  useEffect(() => {
    setGraphData(formatChartData(data, label, title) || {})
  }, [])

  return (<Card title={title}>
    <Bar options={options} data={graphData}/>
  </Card>)
}

export default BarCharts
