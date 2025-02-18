'use client'

import React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import AuthFirst from '../../../../../public/carousel-auth-first.svg'
import AuthSecond from '../../../../../public/carousel-auth-second.svg'
import AuthThird from '../../../../../public/carousel-auth-third.svg'

const images = [AuthFirst, AuthSecond, AuthThird]
export default function AuthCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  )
  return (
    <div className='absolute bottom-0 right-0 h-[80%] w-[80%] overflow-hidden'>
      <Carousel
        plugins={[plugin.current]}
        className='h-full w-full'
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((item, index) => (
            <CarouselItem key={index}>
              <div className='border-none'>
                <Card>
                  <CardContent className='flex aspect-square items-center justify-center'>
                    <Image
                      src={item}
                      alt={`Carousel image ${index + 1}`}
                      width={120}
                      height={120}
                      className='h-full w-full object-cover'
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
