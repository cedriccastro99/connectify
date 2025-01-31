import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar/app-sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-screen h-screen'>
        <SidebarTrigger />
        <div className='flex flex-col m-5 p-5'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Layout;
