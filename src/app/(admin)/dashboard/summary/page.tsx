import React from 'react'
import Image from 'next/image'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Chart from './_components/Chart'
import { CircleChart } from './_components/CircleChart'

export default function Summary() {
  return (
    <div className='brand mx-auto h-full w-[95%]'>
      {/* buttons of the page */}
      <div className='top flex h-[15%] items-center justify-between'>
        <h1 className='heading text-3xl'>Summary</h1>
      </div>
      {/* bottom section of the page */}
      <div className='main flex h-[85%] w-full rounded-lg'>
        <div className='bottomLeft flex flex-[7] flex-col'>
          {/* top component of the bottomLeft */}
          <div className='leftTop flex flex-[3] items-center justify-between space-x-5 px-2'>
            {/* first card */}
            <div className='card flex w-1/3 flex-col space-y-8 rounded-lg bg-white p-3'>
              <div className='cardTop'>
                <Image
                  src={`/assets/summary/m1.svg`}
                  alt=''
                  width={40}
                  height={40}
                />
              </div>
              <div className='cardBottom flex justify-between space-x-3'>
                <div className='cardBottomLeft flex flex-col'>
                  <span className='user text-sm font-light text-gray-400'>
                    Total Users
                  </span>
                  <span className='users text-lg font-medium'>193.8K</span>
                </div>
                <div className='cardBottomRight flex items-end justify-center'>
                  <span className='total rounded-lg bg-green-200 p-1 text-xs font-light text-green-500'>
                    Total Users
                  </span>
                </div>
              </div>
            </div>
            {/* second Card */}
            <div className='card flex w-1/3 flex-col space-y-8 rounded-lg bg-white p-3'>
              <div className='cardTop'>
                <Image
                  src={`/assets/summary/m2.svg`}
                  alt=''
                  width={40}
                  height={40}
                />
              </div>
              <div className='cardBottom flex justify-between space-x-3'>
                <div className='cardBottomLeft flex flex-col'>
                  <span className='user text-sm font-light text-gray-400'>
                    Total Users
                  </span>
                  <span className='users text-lg font-medium'>193.8K</span>
                </div>
                <div className='cardBottomRight flex items-end justify-center'>
                  <span className='total rounded-lg bg-orange-100 p-1 text-xs font-light text-orange-400'>
                    Total Users
                  </span>
                </div>
              </div>
            </div>
            {/* third card */}
            <div className='card flex w-1/3 flex-col space-y-8 rounded-lg bg-white p-3'>
              <div className='cardTop'>
                <Image
                  src={`/assets/summary/m3.svg`}
                  alt=''
                  width={40}
                  height={40}
                />
              </div>
              <div className='cardBottom flex justify-between space-x-3'>
                <div className='cardBottomLeft flex flex-col'>
                  <span className='user text-sm font-light text-gray-400'>
                    Total Users
                  </span>
                  <span className='users text-lg font-medium'>193.8K</span>
                </div>
                <div className='cardBottomRight flex items-end justify-center'>
                  <span className='total rounded-lg bg-orange-100 p-1 text-xs font-light text-orange-400'>
                    Total Users
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* center component of the bottom Left */}
          <div className='leftcenter mt-2 flex-[5] space-y-3'>
            <span className='user text-sm font-light text-gray-400'>
              Total Users
            </span>
            <Separator />
            <div className='h-[80%]'>
              <Chart />
            </div>
          </div>
          {/* bottom component of the bottom Left */}
          <div className='leftBottom flex-[2] pt-5'>
            <div className='bottomCards flex items-center justify-between space-x-4 px-2'>
              {/* first card */}
              <div className='card flex w-1/3 justify-between space-x-3 rounded-lg bg-white p-3'>
                <div className='cardBottomLeft flex flex-col'>
                  <span className='user text-sm font-light text-gray-400'>
                    Total Users
                  </span>
                  <span className='users text-lg font-medium'>193.8K</span>
                </div>
                <div className='cardBottomRight flex items-end justify-center'>
                  <span className='total rounded-lg bg-orange-100 p-1 text-xs font-light text-orange-400'>
                    Total Users
                  </span>
                </div>
              </div>
              {/* second card */}
              <div className='card flex w-1/3 justify-between space-x-3 rounded-lg bg-white p-3'>
                <div className='cardBottomLeft flex flex-col'>
                  <span className='user text-sm font-light text-gray-400'>
                    Total Users
                  </span>
                  <span className='users text-lg font-medium'>193.8K</span>
                </div>
                <div className='cardBottomRight flex items-end justify-center'>
                  <span className='total rounded-lg bg-orange-100 p-1 text-xs font-light text-orange-400'>
                    Total Users
                  </span>
                </div>
              </div>
              {/* third card */}
              <div className='card flex w-1/3 justify-between space-x-3 rounded-lg bg-white p-3'>
                <div className='cardBottomLeft flex flex-col'>
                  <span className='user text-sm font-light text-gray-400'>
                    Total Users
                  </span>
                  <span className='users text-lg font-medium'>193.8K</span>
                </div>
                <div className='cardBottomRight flex items-end justify-center'>
                  <span className='total rounded-lg bg-orange-100 p-1 text-xs font-light text-orange-400'>
                    Total Users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* bottomRight */}
        <div className='bottomRight flex flex-[3] flex-col'>
          <div className='rightTop mt-4 flex-[1.5]'>
            <div className='text my-3 flex flex-col space-y-2'>
              <span className='heading text-lg font-medium'>
                Visited By Device
              </span>
              <span className='desc text-sm font-light'>
                Analyze users across multiple devices
              </span>
            </div>
            <div className='tab flex items-center justify-between'>
              <div className='box flex w-1/2 space-x-2 rounded-l-lg border-r-2 border-solid border-gray-200 bg-white px-6 py-2'>
                <Image
                  src={`/assets/summary/m4.svg`}
                  alt=''
                  width={40}
                  height={40}
                />
                <div className='text flex flex-col'>
                  <span className='num text-lg'>78%</span>
                  <span className='word text-sm font-light'>Web</span>
                </div>
              </div>
              <div className='box flex w-1/2 space-x-2 rounded-r-lg bg-white px-6 py-2'>
                <Image
                  src={`/assets/summary/m5.svg`}
                  alt=''
                  width={40}
                  height={40}
                />
                <div className='text flex flex-col'>
                  <span className='num text-lg'>78%</span>
                  <span className='word text-sm font-light'>Web</span>
                </div>
              </div>
            </div>
          </div>
          <div className='rightBottom flex flex-[4] flex-col rounded-lg bg-white px-3 pt-3'>
            {/* topRightBottom */}
            <div className='topRightBottom flex flex-[1] items-center justify-between'>
              <span className='text-base'>New Users</span>
              <Select>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Theme' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                  <SelectItem value='system'>System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* centerRightBottom */}
            <div className='centerRightBottom flex flex-[5] items-center justify-center'>
              <CircleChart />
            </div>
            {/* bottomRightBottom */}
            <div className='bottomRightBottom flex flex-[2] items-center justify-center'>
              <div className='tab flex items-center justify-between rounded-lg bg-gray-100'>
                <div className='box flex w-1/2 space-x-2 rounded-l-lg border-r-2 border-solid border-gray-200 px-6 py-2'>
                  <Image
                    src={`/assets/summary/m4.svg`}
                    alt=''
                    width={40}
                    height={40}
                  />
                  <div className='text flex flex-col'>
                    <span className='num text-lg'>78%</span>
                    <span className='word text-sm font-light'>Web</span>
                  </div>
                </div>
                <div className='box flex w-1/2 space-x-2 rounded-r-lg px-6 py-2'>
                  <Image
                    src={`/assets/summary/m5.svg`}
                    alt=''
                    width={40}
                    height={40}
                  />
                  <div className='text flex flex-col'>
                    <span className='num text-lg'>78%</span>
                    <span className='word text-sm font-light'>Web</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
