'use client'

import React, { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { AddBrandSettings } from '@/apis/admin/brandSettings'
import { useBrandStore } from '@/app/(chat)/_utils/store/brand-store'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export default function BrandAccordion() {
  const {
    theme,
    setTheme,
    fontSetting,
    externalLinks,
    setFontSetting,
    setExternalLinks,
    setLogoFile,
  } = useBrandStore()
  console.log(theme)
  console.log(fontSetting)
  console.log(externalLinks)

  const logoRef = useRef<HTMLInputElement | null>(null)
  // code related to external Links

  const handleInputChange = (
    index: number,
    field: keyof (typeof externalLinks)[number],
    value: string,
  ) => {
    const updatedLinks = [...externalLinks]
    updatedLinks[index][field] = value
    setExternalLinks(updatedLinks)
  }

  const addNewLink = () => {
    setExternalLinks([...externalLinks, { linkLabel: '', linkUrl: '' }])
  }

  const removeLink = (index: number) => {
    const updatedLinks = externalLinks.filter((_, i) => i !== index)
    setExternalLinks(updatedLinks)
  }

  // ------------------------------------>
  const handleLogo = () => {
    if (logoRef.current) {
      logoRef.current.click()
    }
  }

  return (
    <div>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent className='flex flex-col space-y-2'>
            {/* top section of the first question */}
            <div className='flex flex-col space-y-2'>
              <h1 className='py-3 text-[14px] text-dashboardSecondaryText'>
                Upload Logo
              </h1>
              <div className='flex items-center justify-between rounded border-[1px] border-dashed border-dashboardBorder p-2'>
                <div className='flex flex-col space-y-1'>
                  <span className='font-base text-xs'>
                    Click to select or drag and drop
                  </span>
                  <span className='text-[10px] font-light text-dashboardSecondaryText'>
                    SVG,JPG or PNG (max15 MB)
                  </span>
                </div>
                <input
                  ref={logoRef}
                  type='file'
                  name='logoUrl'
                  accept='.svg , .png, .jpg . jpeg'
                  className='hidden'
                  id=''
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files?.[0]) {
                      setLogoFile(e.target.files[0])
                    }
                  }}
                />
                <Button
                  onClick={handleLogo}
                  className='border-[2px] bg-transparent p-3 text-xs text-black shadow-none'
                >
                  Upload
                </Button>
              </div>
            </div>
            {/* center section of the second question */}
            <div className='flex flex-col space-y-2'>
              <h1 className='text-xs font-medium text-dashboardSecondaryText'>
                Add Description (Metadata)
              </h1>
              <input
                className='w-full rounded-lg border-2 border-solid border-dashboardBorder p-2 outline-none'
                type='text'
                name=''
                placeholder='SurgeAI - Generative, Powerful, No. 1'
                value={theme.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTheme({
                    description: e.target.value,
                  })
                }}
                id=''
              />
            </div>
            {/* bottom section of the third question */}
            {/* one */}
            <div className='flex flex-col space-y-2'>
              <h1 className='py-3 text-[14px] font-light text-dashboardSecondaryText text-gray-400'>
                Color Adjustments
              </h1>
              <div className='flex items-center justify-between rounded-lg border-2 border-solid border-dashboardBorder p-2'>
                <span className='text-xs'>History Pannel Background</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-light'>
                    {theme.colorAdjustments.historyPannelBackground}
                  </span>
                  <input
                    type='color'
                    name='historyPannelBackground'
                    id=''
                    onChange={(e: any) => {
                      setTheme({
                        ...theme,
                        colorAdjustments: {
                          ...theme.colorAdjustments,
                          [e.target.name]: e.target.value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              {/* two */}
              <div className='flex items-center justify-between rounded-lg border-2 border-solid border-dashboardBorder p-2'>
                <span className='text-xs'>Chat Background</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-light'>
                    {theme.colorAdjustments.chatBackground}
                  </span>
                  <input
                    type='color'
                    name='chatBackground'
                    id=''
                    onChange={(e: any) => {
                      setTheme({
                        ...theme,
                        colorAdjustments: {
                          ...theme.colorAdjustments,
                          [e.target.name]: e.target.value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
              {/* three */}
              <div className='flex items-center justify-between rounded-lg border-2 border-solid border-dashboardBorder p-2'>
                <span className='text-xs'>Chat User Bubble</span>
                <div className='flex items-center space-x-2'>
                  <span className='colortext text-xs font-light'>
                    {theme.colorAdjustments.chatUserBubble}
                  </span>
                  <input
                    type='color'
                    name='chatUserBubble'
                    id=''
                    onChange={(e: any) => {
                      setTheme({
                        ...theme,
                        colorAdjustments: {
                          ...theme.colorAdjustments,
                          [e.target.name]: e.target.value,
                        },
                      })
                    }}
                  />
                </div>
              </div>

              {/* four */}
              <div className='flex items-center justify-between rounded-lg border-2 border-solid border-dashboardBorder p-2'>
                <span className='text-xs'>Chat Bot Bubble</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-light'>
                    {theme.colorAdjustments.chatBotBubble}
                  </span>
                  <input
                    type='color'
                    name='chatBotBubble'
                    id=''
                    onChange={(e: any) => {
                      setTheme({
                        ...theme,
                        colorAdjustments: {
                          ...theme.colorAdjustments,
                          [e.target.name]: e.target.value,
                        },
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Font Setting</AccordionTrigger>
          <AccordionContent>
            {/* font setting first sectionl */}
            <div className='space-y-2'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>Primary Font</span>
                <p className='text-[10px] font-light'>Used in Headings</p>
              </div>
              <div className='flex flex-wrap items-center justify-between'>
                <select
                  name='fontFamily'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      primaryFont: {
                        ...fontSetting.primaryFont,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }}
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 text-xs outline-none'
                >
                  <option value='Poppins'>Poppins</option>
                  <option value='Arial'>Arial</option>
                  <option value='Verdana'>Verdana</option>
                  <option value='Tahoma'>Tahoma</option>
                  <option value='Georgia'>Georgia</option>
                  <option value='Garamond'>Garamond</option>
                  <option value='Courier New'>Courier New</option>
                  <option value='Brush Script MT'>Brush Script MT</option>
                  <option value='Times New Roman'>Times New Roman</option>
                  <option value='Roboto'>Roboto</option>
                  <option value='Open Sans'>Open Sans</option>
                  <option value='Lato'>Lato</option>
                  <option value='Montserrat'>Montserrat</option>
                  <option value='Raleway'>Raleway</option>
                  <option value='Oswald'>Oswald</option>
                  <option value='Ubuntu'>Ubuntu</option>
                  <option value='Merriweather'>Merriweather</option>
                  <option value='Playfair Display'>Playfair Display</option>
                  <option value='PT Sans'>PT Sans</option>
                  <option value='Comic Sans MS'>Comic Sans MS</option>
                  <option value='Impact'>Impact</option>
                  <option value='Lucida Console'>Lucida Console</option>
                  <option value='Trebuchet MS'>Trebuchet MS</option>
                  <option value='Noto Sans'>Noto Sans</option>
                  <option value='Overpass'>Overpass</option>
                  <option value='Source Sans Pro'>Source Sans Pro</option>
                </select>
                <select
                  name='fontWeight'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      primaryFont: {
                        ...fontSetting.primaryFont,
                        [e.target.name]: Number(e.target.value),
                      },
                    })
                  }}
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option value={400}>400</option>
                  <option value={500}>500 </option>
                  <option value={600}>600</option>
                  <option value={700}>700 </option>
                  <option value={800}>800</option>
                  <option value={900}>900</option>
                </select>
                <select
                  name='fontSize'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      primaryFont: {
                        ...fontSetting.primaryFont,
                        [e.target.name]: Number(e.target.value),
                      },
                    })
                  }}
                  id=''
                  className='mt-3 h-8 w-[48%] rounded-lg bg-dashboardPrimary p-2 outline-none'
                >
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={14}>14</option>
                  <option value={16}>16</option>
                  <option value={18}>18</option>
                  <option value={20}>20</option>
                  <option value={22}>22</option>
                  <option value={24}>24</option>
                  <option value={26}>26</option>
                  <option value={28}>28</option>
                  <option value={30}>30</option>
                  <option value={32}>32</option>
                  <option value={36}>36</option>
                  <option value={40}>40</option>
                  <option value={48}>48</option>
                  <option value={56}>56</option>
                  <option value={64}>64</option>
                  <option value={72}>72</option>
                  <option value={96}>96</option>
                </select>
              </div>
            </div>
            {/* font setting second section */}
            <div className='mt-3 flex flex-col space-y-2'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>Secondary Font</span>
                <p className='text-[10px] font-light'>
                  Used in Supportive texts
                </p>
              </div>
              <div className='flex flex-wrap items-center justify-between text-xs'>
                <select
                  name='fontFamily'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      secondaryFont: {
                        ...fontSetting.secondaryFont,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }}
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option value='Poppins'>Poppins</option>
                  <option value='Arial'>Arial</option>
                  <option value='Verdana'>Verdana</option>
                  <option value='Tahoma'>Tahoma</option>
                  <option value='Georgia'>Georgia</option>
                  <option value='Garamond'>Garamond</option>
                  <option value='Courier New'>Courier New</option>
                  <option value='Brush Script MT'>Brush Script MT</option>
                  <option value='Times New Roman'>Times New Roman</option>
                  <option value='Roboto'>Roboto</option>
                  <option value='Open Sans'>Open Sans</option>
                  <option value='Lato'>Lato</option>
                  <option value='Montserrat'>Montserrat</option>
                  <option value='Raleway'>Raleway</option>
                  <option value='Oswald'>Oswald</option>
                  <option value='Ubuntu'>Ubuntu</option>
                  <option value='Merriweather'>Merriweather</option>
                  <option value='Playfair Display'>Playfair Display</option>
                  <option value='PT Sans'>PT Sans</option>
                  <option value='Comic Sans MS'>Comic Sans MS</option>
                  <option value='Impact'>Impact</option>
                  <option value='Lucida Console'>Lucida Console</option>
                  <option value='Trebuchet MS'>Trebuchet MS</option>
                  <option value='Noto Sans'>Noto Sans</option>
                  <option value='Overpass'>Overpass</option>
                  <option value='Source Sans Pro'>Source Sans Pro</option>
                </select>
                <select
                  name='fontWeight'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      secondaryFont: {
                        ...fontSetting.secondaryFont,
                        [e.target.name]: Number(e.target.value),
                      },
                    })
                  }}
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option value={400}>400</option>
                  <option value={500}>500 </option>
                  <option value={600}>600</option>
                  <option value={700}>700 </option>
                  <option value={800}>800</option>
                  <option value={900}>900</option>
                </select>
                <select
                  name='fontSize'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      secondaryFont: {
                        ...fontSetting.secondaryFont,
                        [e.target.name]: Number(e.target.value),
                      },
                    })
                  }}
                  id=''
                  className='mt-3 h-8 w-[48%] rounded-lg bg-dashboardPrimary p-2 outline-none'
                >
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={14}>14</option>
                  <option value={16}>16</option>
                  <option value={18}>18</option>
                  <option value={20}>20</option>
                  <option value={22}>22</option>
                  <option value={24}>24</option>
                  <option value={26}>26</option>
                  <option value={28}>28</option>
                  <option value={30}>30</option>
                  <option value={32}>32</option>
                  <option value={36}>36</option>
                  <option value={40}>40</option>
                  <option value={48}>48</option>
                  <option value={56}>56</option>
                  <option value={64}>64</option>
                  <option value={72}>72</option>
                  <option value={96}>96</option>
                </select>
              </div>
            </div>
            {/* font setting third section */}
            <div className='mt-3 flex flex-col space-y-2'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>Chat Font</span>
                <p className='text-[10px] font-light'>
                  Used in user and generative ai chat response bubble
                </p>
              </div>
              <div className='flex flex-wrap items-center justify-between text-xs'>
                <select
                  name='fontFamily'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      chatFont: {
                        ...fontSetting.chatFont,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }}
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option value='Poppins'>Poppins</option>
                  <option value='Arial'>Arial</option>
                  <option value='Verdana'>Verdana</option>
                  <option value='Tahoma'>Tahoma</option>
                  <option value='Georgia'>Georgia</option>
                  <option value='Garamond'>Garamond</option>
                  <option value='Courier New'>Courier New</option>
                  <option value='Brush Script MT'>Brush Script MT</option>
                  <option value='Times New Roman'>Times New Roman</option>
                  <option value='Roboto'>Roboto</option>
                  <option value='Open Sans'>Open Sans</option>
                  <option value='Lato'>Lato</option>
                  <option value='Montserrat'>Montserrat</option>
                  <option value='Raleway'>Raleway</option>
                  <option value='Oswald'>Oswald</option>
                  <option value='Ubuntu'>Ubuntu</option>
                  <option value='Merriweather'>Merriweather</option>
                  <option value='Playfair Display'>Playfair Display</option>
                  <option value='PT Sans'>PT Sans</option>
                  <option value='Comic Sans MS'>Comic Sans MS</option>
                  <option value='Impact'>Impact</option>
                  <option value='Lucida Console'>Lucida Console</option>
                  <option value='Trebuchet MS'>Trebuchet MS</option>
                  <option value='Noto Sans'>Noto Sans</option>
                  <option value='Overpass'>Overpass</option>
                  <option value='Source Sans Pro'>Source Sans Pro</option>
                </select>
                <select
                  name='fontWeight'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      chatFont: {
                        ...fontSetting.chatFont,
                        [e.target.name]: Number(e.target.value),
                      },
                    })
                  }}
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option value={400}>400</option>
                  <option value={500}>500 </option>
                  <option value={600}>600</option>
                  <option value={700}>700 </option>
                  <option value={800}>800</option>
                  <option value={900}>900</option>
                </select>
                <select
                  name='fontSize'
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setFontSetting({
                      ...fontSetting,
                      chatFont: {
                        ...fontSetting.chatFont,
                        [e.target.name]: Number(e.target.value),
                      },
                    })
                  }}
                  id=''
                  className='bg-dashboardPrimaryp-2 mt-3 h-8 w-[48%] rounded-lg outline-none'
                >
                  <option value={10}>10</option>
                  <option value={12}>12</option>
                  <option value={14}>14</option>
                  <option value={16}>16</option>
                  <option value={18}>18</option>
                  <option value={20}>20</option>
                  <option value={22}>22</option>
                  <option value={24}>24</option>
                  <option value={26}>26</option>
                  <option value={28}>28</option>
                  <option value={30}>30</option>
                  <option value={32}>32</option>
                  <option value={36}>36</option>
                  <option value={40}>40</option>
                  <option value={48}>48</option>
                  <option value={56}>56</option>
                  <option value={64}>64</option>
                  <option value={72}>72</option>
                  <option value={96}>96</option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>External Links</AccordionTrigger>
          <AccordionContent className='flex flex-col items-center'>
            {externalLinks.map((link, index) => (
              <div
                key={index}
                className='w-full space-y-3 rounded-lg bg-dashboardPrimary px-3 py-3'
              >
                <div className='flex justify-between pt-2'>
                  <div className='flex flex-col space-y-1'>
                    <span className='text-xs'>Link {index + 1}</span>
                    <span className='text-[10px] text-gray-400'>
                      This will be displayed in the left navigation panel
                    </span>
                  </div>
                  <span
                    className='cursor-pointer text-xs text-red-500'
                    onClick={() => removeLink(index)}
                  >
                    Remove
                  </span>
                </div>
                <div>
                  <div className='flex flex-col space-y-2'>
                    <label htmlFor={`linkLabel-${index}`} className='text-xs'>
                      Link Label
                    </label>
                    <input
                      className='p-2 outline-none'
                      type='text'
                      name={`linkLabel-${index}`}
                      id={`linkLabel-${index}`}
                      placeholder='Type here'
                      value={link.linkLabel}
                      onChange={(e) =>
                        handleInputChange(index, 'linkLabel', e.target.value)
                      }
                    />
                  </div>
                  <div className='mt-2 flex flex-col space-y-2'>
                    <label htmlFor={`linkUrl-${index}`} className='text-xs'>
                      Insert Link
                    </label>
                    <input
                      className='p-2 outline-none'
                      type='text'
                      name={`linkUrl-${index}`}
                      id={`linkUrl-${index}`}
                      placeholder='Paste here'
                      value={link.linkUrl}
                      onChange={(e) =>
                        handleInputChange(index, 'linkUrl', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            {externalLinks.length < 3 ? (
              <div
                className='mt-3 flex cursor-pointer items-center justify-center space-x-2 p-1 text-sm text-dashboardPreviewText'
                onClick={addNewLink}
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                <span>Add another link</span>
              </div>
            ) : (
              <button className='mt-3 rounded-lg bg-green-500 px-4 py-2 text-white'>
                Save Links
              </button>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
