"use client";
import { useState } from "react";
import { Settings } from "lucide-react";
export default function ChatHeader() {
    const [toggle, setToggle] = useState(false)

const toggleHandler = () =>{
    setToggle(!toggle)
  }
  return (
    <div className=" flex  justify-between border-b-[#ACACAC]  items-center py-6">
    <div></div>
    <div className="flex bg-[#E0E0E0] dark:bg-[#5E5E61] text-[#575757] dark:text-white  rounded-full">
      <a  href="/ask-ripeseed" className={`py-2 px-6 text-lg font-medium  cursor-pointer ${toggle ? "bg-crayola text-white rounded-full":""} `} onClick={toggleHandler}>Ask Ripeseed</a>
      <span className={`py-2 px-6 text-lg font-medium cursor-pointer ${toggle? "":"bg-crayola text-white rounded-full"}`}onClick={toggleHandler}>Ask Anything</span>
    </div>
    <div>
      
     <Settings className="mr-4 dark:text-white" />
      
      </div>
    </div> 
  )
}
