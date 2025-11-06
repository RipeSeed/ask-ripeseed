'use client'

import { useEffect } from 'react'

export function CalendlyWidget() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className='my-4 max-w-2xl'>
      <div className='mb-3'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100'>
          📅 Schedule a Meeting with Hashir Baig (Founder)
        </h3>
        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
          Choose a convenient time to discuss your project
        </p>
      </div>
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-zinc-900'>
        <div
          className='calendly-inline-widget'
          data-url='https://calendly.com/ripeseed/meeting'
          style={{ minWidth: '320px', height: '630px' }}
        />
      </div>
    </div>
  )
}
