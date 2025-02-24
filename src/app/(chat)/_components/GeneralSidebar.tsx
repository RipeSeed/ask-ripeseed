'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { EllipsisVertical, MessageSquare, Trash2 } from 'lucide-react'

import {
  Chat,
  clearMessagesByChat,
  deleteChat,
  getAllChats,
} from '@/app/(chat)/_lib/db'
import { truncateString } from '@/app/(chat)/_utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useStore from '../_utils/store/store'

export default function GeneralSideBar() {
  const router = useRouter()
  const pathname = usePathname()
  const id = Number(pathname.split('/')[2])
  const chatId = isNaN(id) ? null : id
  const { selectedChat, chats, setChats, setSelectedChat } = useStore()
  const closeRef = useRef<HTMLButtonElement>(null)

  const { data: allChats, refetch } = useQuery({
    queryKey: ['allChats'],
    queryFn: async () => {
      const result = await getAllChats()
      setChats(result)
      return result
    },
    enabled: !chats.length,
  })

  useEffect(() => {
    if (pathname === '/ask-anything') {
      setSelectedChat(undefined)
    }
  }, [useRouter])

  const handleCreateNewChat = async () => {
    setSelectedChat(undefined)
    router.push('/ask-anything/')
  }

  const handleSelectedChatChange = (chat: Chat) => {
    setSelectedChat(chat)
    router.push(`/ask-anything/${chat.id}`)
  }

  const onDelete = async (event: React.MouseEvent, chat: Chat) => {
    event.stopPropagation()

    await deleteChat({ id: chat.id! })
    await clearMessagesByChat({ chatId: chat.id! })

    const { data: updatedChats } = await refetch()
    const len = updatedChats?.length ?? 0
    if (!updatedChats || !updatedChats[0]) {
      setSelectedChat(undefined)
      router.push(`/ask-anything`)
      setChats([])
    } else {
      setSelectedChat(updatedChats[len - 1])
      router.push(`/ask-anything/${updatedChats[len - 1].id}`)
      setChats(updatedChats)
    }

    closeRef.current?.click()
  }

  return (
    <div className='h-screen bg-[#EBEBEB] text-white dark:bg-black'>
      <div className='h-[calc(100svh-96px)]'>
        <div className='pb-8 pt-7'>
          <div
            className='group cursor-pointer rounded-lg bg-[#E0E0E0] p-[16px] pl-[24px] transition duration-300 hover:bg-mintGreen dark:bg-[#404043] dark:hover:bg-mintGreen'
            onClick={handleCreateNewChat}
          >
            <div className='flex items-center gap-2'>
              <MessageSquare className='h-4 w-4 text-iconColor group-hover:text-black dark:text-[#D1D1D1] dark:opacity-50 dark:group-hover:opacity-100' />
              <span className='text-center font-medium text-black group-hover:text-black dark:text-white'>
                New Chat
              </span>
            </div>
          </div>
        </div>
        {/* Chat list */}
        <div className='h-[calc(100svh-96px-116px)] text-black dark:text-white'>
          <div className='py-3'>
            {chats.length > 0 && <span>Chat History</span>}
          </div>

          <div className='flex h-[calc(100svh-96px-116px-56px)] flex-col gap-2 overflow-y-auto overflow-x-hidden'>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`relative cursor-pointer p-2 dark:text-white ${
                  chatId === chat.id
                    ? 'rounded-full bg-[#E0E0E0] dark:bg-[#404043]'
                    : ''
                }`}
                onClick={() => handleSelectedChatChange(chat)}
              >
                <li className='flex list-none items-center gap-2'>
                  <MessageSquare className='h-[14px] text-black dark:text-white' />
                  <span className='text-black dark:text-white'>
                    {truncateString(chat.name, 18)}
                  </span>
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger className='focus:outline-none'>
                        <EllipsisVertical className='h-[14px] w-4 cursor-pointer text-black dark:text-white' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='absolute'>
                        <DropdownMenuItem
                          className='flex cursor-pointer items-center gap-2 focus:bg-[#E338612E] focus:text-[#E33861]'
                          onClick={(event) => onDelete(event, chat)}
                        >
                          <Trash2 className='h-3 w-3 text-[red]' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
