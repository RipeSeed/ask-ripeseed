import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import { isPath } from './constants'
import type { Menu } from './types'

const MenuView = ({ menuItem }: { menuItem: Menu }) => {
  const pathname = usePathname()
  return (
    <NavigationMenuLink
      className={cn(navigationMenuTriggerStyle(), 'rounded-full')}
      asChild
    >
      <Link
        href={menuItem.href}
        className={`bg-white hover:text-primary focus:bg-white focus:text-primary ${
          isPath(menuItem.pathMatch, pathname)
            ? 'border border-primary !bg-crayola !text-white'
            : 'text-muted-foreground'
        }`}
      >
        {menuItem.title}
      </Link>
    </NavigationMenuLink>
  )
}

export default MenuView
