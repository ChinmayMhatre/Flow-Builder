import { useMemo } from 'react';
import { useFlowStore } from '../store/flowStore';
import type { SchemaNode, SchemaEdge } from '../types/flow';

export function JSONPreview() {
    const { nodes, edges } = useFlowStore();

    const generatedSchema = useMemo(() => {
        return nodes.map((node): SchemaNode => {
            // Find all connected edges originating from this node
            const nodeEdges = edges.filter((e) => e.source === node.id);

            // Convert them to the target SchemaEdge format
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

    return (
        <div className="flex h-1/3 flex-col border-t border-slate-200 bg-slate-900 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
                <h2 className="text-sm font-semibold tracking-wide text-white uppercase">Live JSON Preview</h2>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(generatedSchema, null, 2));
                        alert('Copied to clipboard!');
                    }}
                    className="rounded-md bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white border border-slate-700"
                >
                    Copy JSON
                </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 font-mono text-sm shadow-inner">
                <pre className="text-emerald-400">
                    {JSON.stringify(generatedSchema, null, 2)}
                </pre>
            </div>
        </div>
    );
}
