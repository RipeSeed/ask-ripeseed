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
          className='bg-dashboardPrimary rounded-2xl px-2'
        >
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-3 px-3'>
            <Input
              placeholder='Your Question here...'
              className='bg-dashboardSecondary mt-2'
            />
            <Button className='bg-dashboardSecondary text-black'>
              <Plus />
              <span>Add icon</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value='item-2'
          className='bg-dashboardPrimary rounded-2xl px-2'
        >
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-3 px-3'>
            <Input
              placeholder='Your Question here...'
              className='bg-dashboardSecondary mt-2'
            />
            <Button className='bg-dashboardSecondary text-black'>
              <Plus />
              <span>Add icon</span>
            </Button>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value='item-3'
          className='bg-dashboardPrimary rounded-2xl px-2'
        >
          <AccordionTrigger>Question 3</AccordionTrigger>
          <AccordionContent className='flex items-center space-x-3 px-3'>
            <Input
              placeholder='Your Question here...'
              className='bg-dashboardSecondary mt-2'
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
