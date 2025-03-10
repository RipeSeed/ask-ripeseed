import DashboardSideBar from './_components/DashboardSideBar/DashboardSideBar'

export default async function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <div className='flex h-screen w-screen'>
      <DashboardSideBar />
      <div className='flex-[8] overflow-y-auto bg-[#F9F9F9]'>{children}</div>
    </div>
  )
}
