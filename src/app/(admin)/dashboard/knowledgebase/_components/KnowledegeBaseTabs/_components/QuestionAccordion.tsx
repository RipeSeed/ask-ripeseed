import React from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/question-accordion'

export default function QuestionAccordion() {
  return (
    <div>
      <Accordion type='single' collapsible className='space-y-5'>
        <AccordionItem
          value='item-1'
          className='rounded-2xl bg-dashboardPrimary px-2'
        >
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-3 px-3'>
            <Input
              placeholder='Your Question here...'
              className='mt-2 bg-dashboardSecondary'
            />
            <Button className='bg-dashboardSecondary text-black'>
              <Plus />
              <span>Add icon</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value='item-2'
          className='rounded-2xl bg-dashboardPrimary px-2'
        >
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-3 px-3'>
            <Input
              placeholder='Your Question here...'
              className='mt-2 bg-dashboardSecondary'
            />
            <Button className='bg-dashboardSecondary text-black'>
              <Plus />
              <span>Add icon</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value='item-3'
          className='rounded-2xl bg-dashboardPrimary px-2'
        >
          <AccordionTrigger>Question 3</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-3 px-3'>
            <Input
              placeholder='Your Question here...'
              className='mt-2 bg-dashboardSecondary'
            />
            <Button className='bg-dashboardSecondary text-black'>
              <Plus />
              <span>Add icon</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
