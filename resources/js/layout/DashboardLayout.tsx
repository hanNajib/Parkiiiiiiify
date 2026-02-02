import React, { PropsWithChildren } from 'react'
import { SidebarLayout } from './SidebarLayout'

export const DashboardLayout = ({children}: PropsWithChildren) => {
  return (
    
    <SidebarLayout>
      {children}
    </SidebarLayout>
  )
}
