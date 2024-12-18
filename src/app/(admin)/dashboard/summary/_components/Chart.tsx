'use client'

import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { month: 'Jan', '2021': 600, '2020': 400, '2019': 100 },
  { month: 'Feb', '2021': 610, '2020': 405, '2019': 120 },
  { month: 'Mar', '2021': 630, '2020': 410, '2019': 150 },
  { month: 'Apr', '2021': 650, '2020': 420, '2019': 200 },
  { month: 'May', '2021': 700, '2020': 430, '2019': 250 },
  { month: 'Jun', '2021': 710, '2020': 450, '2019': 270 },
  { month: 'Jul', '2021': 720, '2020': 455, '2019': 220 },
  { month: 'Aug', '2021': 750, '2020': 470, '2019': 300 },
  { month: 'Sep', '2021': 740, '2020': 475, '2019': 310 },
  { month: 'Oct', '2021': 730, '2020': 480, '2019': 290 },
  { month: 'Nov', '2021': 750, '2020': 490, '2019': 330 },
  { month: 'Dec', '2021': 800, '2020': 500, '2019': 400 },
]

const Chart = () => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='color2021' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#FBCD8E' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#F9F1E6' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='color2020' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#F9F4EC' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#F9F5EF' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='color2019' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#F9F5EF' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#F9F7F4' stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey='month' />
        <YAxis />
        {/* <CartesianGrid /> */}
        <Tooltip />
        <Area
          type='monotone'
          dataKey='2021'
          stroke='#FF7F00'
          fillOpacity={1}
          fill='url(#color2021)'
        />
        <Area
          type='monotone'
          dataKey='2020'
          stroke='#FFA500'
          fillOpacity={1}
          fill='url(#color2020)'
        />
        <Area
          type='monotone'
          dataKey='2019'
          stroke='#FFB347'
          fillOpacity={1}
          fill='url(#color2019)'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default Chart
