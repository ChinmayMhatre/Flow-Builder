import { useState } from 'react';
import { useFlowStore } from '../store/flowStore';
import type { FlowNode, FlowEdge } from '../store/flowStore';
import { X, FileJson } from 'lucide-react';
import dagre from 'dagre';

export function ImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { setNodes, setEdges } = useFlowStore();

    if (!isOpen) return null;

    const handleImport = () => {
        try {
            setError(null);
            const parsedData = JSON.parse(jsonInput);

            if (!Array.isArray(parsedData)) {
                throw new Error('Imported JSON must be an array of Node objects.');
            }

            const newNodes: FlowNode[] = [];
            const newEdges: FlowEdge[] = [];
            // To arrange them somewhat nicely instead of stacked
            let currentX = 100;
            let currentY = 100;

            let startNodeIdentified = false;

            parsedData.forEach((node: any, idx: number) => {
                if (!node.id || typeof node.id !== 'string') {
                    throw new Error(`Node at index ${idx} is missing a valid string "id".`);
                }

                // Heuristic: identify the start node. Assignment says "Visually mark one node as the start node."
                // We'll assume the first node is the start node if it's not explicitly labeled.
                let isStartNode = false;
                if (!startNodeIdentified) {
                    isStartNode = true;
                    startNodeIdentified = true;
                }

                newNodes.push({
                    id: node.id,
                    type: 'flow-card',
                    position: { x: currentX, y: currentY },
                    data: {
                        description: node.description || undefined,
                        prompt: node.prompt || '',
                        isStartNode,
                    }
                });

                // stagger them
                currentX += 300;
                if (currentX > 1000) { currentX = 100; currentY += 250; }

                if (Array.isArray(node.edges)) {
                    node.edges.forEach((edge: any, edgeIdx: number) => {
                        if (!edge.to_node_id) {
                            throw new Error(`Edge at index ${edgeIdx} in node "${node.id}" is missing "to_node_id".`);
                        }
                        newEdges.push({
                            id: `${node.id}-${edge.to_node_id}`,
                            source: node.id,
                            target: edge.to_node_id,
                            type: 'default',
                            label: edge.condition || '',
                            data: {
                                condition: edge.condition || '',
                                parameters: edge.parameters,
                            }
                        });
                    });
                }
            });

            // Auto-layout nodes using Dagre instead of grid overlaps
            const dagreGraph = new dagre.graphlib.Graph();
            dagreGraph.setDefaultEdgeLabel(() => ({}));
            dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 250, ranksep: 500 }); // Increase spacing heavily

            newNodes.forEach((node) => {
                // Approximate width and height for calculating distances (giving it extra padding)
                dagreGraph.setNode(node.id, { width: 350, height: 250 });
            });

            newEdges.forEach((edge) => {
                // Dagre can sometimes struggle with self-loops in basic directed layouts, 
                // so we only pass non-self connecting edges to the layout math router
                if (edge.source !== edge.target) {
                    dagreGraph.setEdge(edge.source, edge.target);
                }
            });

            dagre.layout(dagreGraph);

            const layoutedNodes = newNodes.map((node) => {
                const nodeWithPosition = dagreGraph.node(node.id);
                return {
                    ...node,
                    position: {
                        x: nodeWithPosition?.x !== undefined ? nodeWithPosition.x - 350 / 2 : Math.random() * 200, // shift to center
                        y: nodeWithPosition?.y !== undefined ? nodeWithPosition.y - 250 / 2 : Math.random() * 200,
                    },
                };
            });

            setNodes(layoutedNodes);
            setEdges(newEdges);
            setJsonInput('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Syntax error: The provided string is not valid JSON.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-4 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <FileJson className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Import Flow JSON</h2>
                </div>

                <p className="mb-4 text-sm text-slate-500">
                    Paste a JSON array of Node objects to completely replace the canvas. Validates structure automatically.
                </p>

                <textarea
                    className="h-64 w-full resize-none rounded-lg border border-slate-300 p-4 font-mono text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-inner"
                    placeholder="[\n  {\n    &#34;id&#34;: &#34;node_1&#34;,\n    &#34;prompt&#34;: &#34;Hello world&#34;,\n    &#34;edges&#34;: []\n  }\n]"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                />

                {error && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        <strong>Import Error:</strong> {error}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
                    >
                        Import JSON
                    </button>
                </div>
            </div>
        </div>
    );
}
