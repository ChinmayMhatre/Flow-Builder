import { useMemo, useState } from 'react';
import { useFlowStore } from '../store/flowStore';
import type { SchemaNode, SchemaEdge } from '../types/flow';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2 } from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarProvider, useSidebar, SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';

function JSONPreviewContent() {
    const { nodes, edges } = useFlowStore();
    const [copied, setCopied] = useState(false);

    const generatedSchema = useMemo(() => {
        return nodes.map((node): SchemaNode => {
            const nodeEdges = edges.filter((e) => e.source === node.id);
            const formattedEdges: SchemaEdge[] = nodeEdges.map((e) => ({
                to_node_id: e.target,
                condition: e.data?.condition || '',
                ...(e.data?.parameters && { parameters: e.data.parameters as Record<string, string> }),
            }));

            return {
                id: node.id,
                description: node.data?.description,
                prompt: node.data?.prompt || '',
                edges: formattedEdges,
            };
        });
    }, [nodes, edges]);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(generatedSchema, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Sidebar side="right" collapsible="offcanvas" className="border-l border-slate-200 bg-white">
            <SidebarHeader className="border-b border-slate-100 bg-white px-4 py-4 flex flex-row items-center justify-between mt-12">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-600" />
                    <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">Live JSON</h2>
                </div>
                <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="icon"
                    className={`h-7 w-7 transition-colors  ${copied
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
            </SidebarHeader>
            <SidebarContent className="bg-slate-50/50 p-4 flex flex-col">
                <div className="flex-1 rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto overflow-x-scroll p-4 custom-scrollbar text-xs">
                        <SyntaxHighlighter
                            language="json"
                            style={vs}
                            customStyle={{
                                background: 'transparent',
                                padding: 0,
                                margin: 0,
                                fontSize: '0.75rem',
                                height: '100%',
                                border: 'none'
                            }}
                            wrapLines={true}
                        >
                            {JSON.stringify(generatedSchema, null, 2)}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}

function InteractiveRightTrigger() {
    const { state } = useSidebar();
    return (
        <div className="fixed top-4 right-4 z-50">
            <SidebarTrigger
                className={`bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-shadow ${state === 'collapsed' ? 'shadow-sm' : 'shadow-none'
                    }`}
            />
        </div>
    );
}

export function JSONPreview() {
    return (
        <SidebarProvider
            className="w-auto flex-none !min-h-0 h-full relative"
            defaultOpen={true}
            style={{ '--sidebar-width': '22rem' } as React.CSSProperties}
        >
            <InteractiveRightTrigger />
            <JSONPreviewContent />
        </SidebarProvider>
    );
}
