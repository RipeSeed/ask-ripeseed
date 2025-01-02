'use client'

import React, { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'

import { AddQuestions } from '@/apis/admin/knowledgeBase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/question-accordion'

export default function QuestionAccordion({
  askAnything,
}: {
  askAnything: boolean
}) {
  console.log(askAnything)
  const iconRefs = useRef<(HTMLInputElement | null)[]>([])
  const [questions, setQuestions] = useState<
    { title: string; icon: File | null }[]
  >([
    { title: '', icon: null },
    { title: '', icon: null },
    { title: '', icon: null },
  ])

  const handleOpenRef = (index: number) => {
    if (iconRefs.current[index]) {
      iconRefs.current[index]!.click()
    }
  }

  const handleFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (file.size > 5000000) {
        alert('File size should not exceed 5MB')
        return
      }

      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions]
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          icon: file,
        }
        return updatedQuestions
      })
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions]
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        title: value,
      }
      return updatedQuestions
    })
  }

  const { mutate } = useMutation({
    mutationFn: async ({
      askAnything,
      data,
    }: {
      askAnything: boolean
      data: FormData
    }) => {
      await AddQuestions(askAnything, data)
    },
  })

  const handleClick = () => {
    const form = new FormData()

    questions.forEach((question, index) => {
      if (!question.title.trim()) {
        throw new Error('Please Add Question title')
      }

      if (!question.icon) {
        throw new Error('Please Add Icon')
      }

      form.append('title', question.title)
      form.append('icon', question.icon)
    })

    mutate({ askAnything, data: form })
  }

  return (
    <div>
      <Accordion type='single' collapsible className='space-y-5'>
        {questions.map((question, index) => (
          <AccordionItem
            key={index}
            value={`item-${index + 1}`}
            className='rounded-2xl bg-dashboardPrimary px-2'
          >
            <AccordionTrigger>Question {index + 1}</AccordionTrigger>
            <AccordionContent className='flex items-center space-x-3 px-3'>
              <Input
                placeholder='Your Question here...'
                className='mt-2 bg-dashboardSecondary'
                value={question.title}
                onChange={(e) => handleInputChange(e, index)}
              />
              <input
                onChange={(e) => handleFiles(e, index)}
                className='hidden'
                type='file'
                ref={(el) => (iconRefs.current[index] = el)}
              />
              <Button
                onClick={() => handleOpenRef(index)}
                className='space-x-2 bg-dashboardSecondary font-normal text-black'
              >
                <Plus style={{ width: '20px', height: '20px' }} />
                <span className='text-sm'>Add icon</span>
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className='mt-3 flex items-center justify-end'>
        <Button
          className='bg-black text-dashboardSecondary'
          onClick={handleClick}
        >
          {askAnything ? 'Save AskAnything' : 'Save AskManifest'}
        </Button>
      </div>
    </div>
  )
}
