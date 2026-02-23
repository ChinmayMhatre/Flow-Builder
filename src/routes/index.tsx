import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '../components/Canvas'
import { AppSidebar } from '../components/AppSidebar'
import { JSONPreview } from '../components/JSONPreview'
import { SidebarProvider, SidebarTrigger, useSidebar } from '../components/ui/sidebar'
import { TooltipProvider } from '../components/ui/tooltip'

export const Route = createFileRoute('/')({ component: App })

function InteractiveTrigger() {
  const { state } = useSidebar()
  return (
    <div className="fixed top-4 left-4 z-50">
      <SidebarTrigger
        className={`bg-white border border-slate-200 transition-shadow ${state === 'collapsed' ? 'shadow-sm' : 'shadow-none'
          }`}
      />
    </div>
  )
}

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <InteractiveTrigger />
        <div className="flex h-screen w-full flex-row overflow-hidden bg-slate-50">
          <AppSidebar />
          <div className="flex flex-1 flex-row overflow-hidden bg-slate-100 relative">
            <div className="flex-1 relative">
              <Canvas />
            </div>
            <JSONPreview />
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
