import React, { useContext } from 'react'
import { routes } from '@/routes/routes'
import { NavLink } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Cable, ChevronUp, User2 } from 'lucide-react'
import { AuthContext } from '@/context/Auth/AuthContext'

export function AppSidebar() {

  const authContext = useContext(AuthContext)

  const { state, actions } = authContext ?? {}
  const { handleLogout } = actions ?? {}
  const { user } = state ?? {}

  const filteredRoutes = routes.filter(route => {
    const regex = /users/;
    if (regex.test(route.path) && user?.role !== 'admin') {
      return false
    }
    return true
  })

  const handleLogoutClick = () => {
    handleLogout?.()
    window.location.href = '/'
  }

  const handleLogoClick = () => {
    window.location.href = '/'
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
        <div className="flex items-center space-x-3 px-4 py-2 hover:cursor-pointer" onClick={handleLogoClick}>
          <Cable/>
          <SidebarGroupLabel className="text-lg font-bold text-blue-600">
            Connectify
          </SidebarGroupLabel>
        </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map(
                item =>
                  item.in_sidebar && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.path}>
                          {item.icon && (
                            <span>{React.createElement(item.icon)}</span>
                          )}
                          {item.title}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {user?.email}
                  <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width]'>
                <DropdownMenuItem onClick={handleLogoutClick}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
