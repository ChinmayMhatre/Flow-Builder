import { useMemo, useState } from 'react';
import { useFlowStore } from '../store/flowStore';
import type { SchemaNode, SchemaEdge } from '../types/flow';
// @ts-ignore
import { default as SyntaxHighlighter } from 'react-syntax-highlighter/dist/esm/prism.js';
// @ts-ignore
import vscDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus.js';
import { Copy, Check, Code2, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

export function JSONPreview() {
    const { nodes, edges } = useFlowStore();
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(JSON.stringify(generatedSchema, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`flex flex-col border-t border-slate-200 bg-white transition-all duration-300 ease-in-out shrink-0 z-10 ${isOpen ? 'h-72' : 'h-[46px]'
                }`}
        >
            <div
                className="flex items-center justify-between px-4 py-2 border-b border-slate-100 cursor-pointer bg-white hover:bg-slate-50 transition-colors shrink-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-600" />
                    <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">JSON Preview</h2>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 flex items-center justify-center text-slate-400">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 custom-scrollbar text-xs bg-slate-100">
                <div className="relative h-full rounded-md border border-slate-700 bg-slate-900 shadow-md flex flex-col overflow-hidden group">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(e);
                        }}
                        variant="outline"
                        size="icon"
                        className={`absolute right-3 top-3 z-10 h-7 w-7 transition-all shadow-sm opacity-0 group-hover:opacity-100 ${copied
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700'
                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <SyntaxHighlighter
                            language="json"
                            style={vscDarkPlus}
                            customStyle={{
                                background: 'transparent',
                                padding: 0,
                                margin: 0,
                                fontSize: '0.75rem',
                                height: '100%',
                            }}
                            wrapLines={true}
                        >
                            {JSON.stringify(generatedSchema, null, 2)}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    );
}
