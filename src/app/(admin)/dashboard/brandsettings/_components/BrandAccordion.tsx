import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export default function BrandAccordion() {
  return (
    <div>
      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent>
            <div className='top'>
              <h1 className='heading'>Upload Logo</h1>
              <div className='btn'>
                <div className='desc'>
                  <span className='text'>Click to select or drag and drop</span>
                  <span className='lighttext'>SVG,JPG or PNG (max15 MB)</span>
                </div>

                <Button>Upload</Button>
              </div>
            </div>
            <div className='center'>
              <h1 className='heading'>Add Description (Metadata)</h1>
              <div></div>
            </div>
            <div className='bottom'></div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Font Setting</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>External Links</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
