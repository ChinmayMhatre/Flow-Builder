import { createFileRoute } from '@tanstack/react-router'
import { Canvas } from '../components/Canvas'
import { Sidebar } from '../components/Sidebar'
import { JSONPreview } from '../components/JSONPreview'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-slate-50">
      {/* Left side: Main flow builder space */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
        <div className="flex-1 relative">
          <Canvas />
        </div>
        {/* Bottom Panel: Live Preview */}
        <JSONPreview />
      </div>

      {/* Right side: Properties Editor Sidebar */}
      <Sidebar />
    </div>
  )
}
