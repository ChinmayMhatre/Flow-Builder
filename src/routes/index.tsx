import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '../components/Canvas'
import { AppSidebar } from '../components/AppSidebar'
import { JSONPreview } from '../components/JSONPreview'
import { SidebarProvider } from '../components/ui/sidebar'
import { TooltipProvider } from '../components/ui/tooltip'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full flex-row overflow-hidden bg-slate-50">
          <div className="flex flex-1 flex-col overflow-hidden bg-slate-100 relative">
            <div className="flex-1 relative">
              <Canvas />
            </div>
            <JSONPreview />
          </div>
          <AppSidebar />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
