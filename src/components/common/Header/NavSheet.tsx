'use client'

import { useState } from 'react'
import { MenuIcon } from 'lucide-react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { menuItems } from './constants'
import MenuView from './MenuView'
import { Menu } from './types'

export function NavSheet() {
  const [sheetOpen, setSheetOpen] = useState(false)
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={`right`} className='w-[320px]'>
        <NavigationMenu>
          <NavigationMenuList className='flex flex-col gap-2'>
            {menuItems.map((menuItem, i) => (
              <NavigationMenuItem
                key={i}
                className='rounded-full'
                onClick={() => setSheetOpen(false)}
              >
                <MenuView menuItem={menuItem as Menu} />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  )
}
