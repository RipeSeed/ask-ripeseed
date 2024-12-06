import { X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function DashboardSideBar() {
    return (
        <div className='flex-[2] bg-lime-300 h-full w-full'>
            <div className="contrainer h-full w-[90%] bg-red-300 m-auto pt-5">
                <div className="logo">
                    <Image src={`/logo/logo.svg`} width={150} height={150} alt="" />
                </div>
                <div className="links mt-8">
                    <ul className="links flex flex-col space-y-4">
                        <li className="listItem flex w-full bg-green-300 p-3 space-x-2">
                            <X />
                            <span className="itemtext">Summary</span>
                        </li>
                        <li className="listItem flex w-full bg-green-300 p-3 space-x-2">
                            <X />
                            <span className="itemtext">Summary</span>
                        </li>
                        <li className="listItem flex w-full bg-green-300 p-3 space-x-2">
                            <X />
                            <span className="itemtext">Summary</span>
                        </li>

                    </ul>

                </div>
                <div className="profile">

                </div>
            </div>

        </div>
    )
}
