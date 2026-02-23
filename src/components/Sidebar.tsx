import { useFlowStore } from '../store/flowStore';

export function Sidebar() {
    const { nodes, edges, updateNodeData, updateEdgeData } = useFlowStore();

    // React Flow sets 'selected: true' on nodes when clicked
    const selectedNode = nodes.find((n) => n.selected);

    if (!selectedNode) {
        return (
            <div className="flex h-full w-80 flex-col border-l border-slate-200 bg-white p-6 shadow-xl z-10 transition-all duration-300">
                <h2 className="text-lg font-semibold text-slate-800">Node Editor</h2>
                <div className="mt-4 flex flex-1 items-center text-center text-sm text-slate-500">
                    <p>Select a node on the canvas to see its properties here.</p>
                </div>
            </div>
        );
    }

    // Find all edges that originate from this node
    const outgoingEdges = edges.filter((e) => e.source === selectedNode.id);

    return (
        <div className="flex h-full w-80 flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-xl z-10 transition-all duration-300">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">Edit Node</h2>
                <div className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
                    {selectedNode.data.isStartNode ? 'Start State' : 'Intermediate State'}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Node ID</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={selectedNode.id}
                        readOnly // ID editing disabled temporarily for simplicity, can be implemented next
                        title="Node ID cannot be changed in this version"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={3}
                        placeholder="Describe what this node does..."
                        value={selectedNode.data.description || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Prompt / Action</label>
                    <textarea
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows={4}
                        placeholder="Enter the main output or prompt..."
                        value={selectedNode.data.prompt || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
                    />
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                    <h3 className="mb-3 text-sm font-semibold text-slate-800">Outgoing Edges ({outgoingEdges.length})</h3>

                    {outgoingEdges.length === 0 ? (
                        <p className="text-xs text-slate-500">No outgoing edges. Connect from the right handle of this node to another.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {outgoingEdges.map((edge) => (
                                <div key={edge.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            To: {edge.target}
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Condition (e.g. true)"
                                        className="w-full rounded bg-white px-2 py-1.5 text-sm border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 border shadow-sm"
                                        value={edge.data?.condition || ''}
                                        onChange={(e) => updateEdgeData(edge.id, { condition: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
