import { useMemo, useState, useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useFlowStore } from '../store/flowStore';
import { FlowCardNode } from './nodes/FlowCardNode';
import { validateFlow, type ValidationError } from '../lib/validation';
import { AlertCircle, Plus, Download, MousePointerClick, Play } from 'lucide-react';
import { ImportModal } from './ImportModal';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from './ui/context-menu';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const nodeTypes = {
    'flow-card': FlowCardNode,
};

export function Canvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
    } = useFlowStore();

    const [isImportOpen, setIsImportOpen] = useState(false);
    const [showMiniMap, setShowMiniMap] = useState(true);

    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    const handleValidate = () => {
        setValidationErrors(validateFlow(nodes, edges));
    };

    // Clear validation errors automatically when the user starts fixing the canvas
    useEffect(() => {
        if (validationErrors.length > 0) {
            setValidationErrors([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes, edges]);

    // We can pass validation errors to nodes by updating their data, or just use a derived approach.
    // For simplicity, we will pass global errors down if needed, but the xyflow nodes 
    // are only given `data`. Instead of syncing errors to Zustand, we dynamically inject 
    // them during render!
    const nodesWithErrors = useMemo(() => {
        return nodes.map((node) => {
            const nodeErrors = validationErrors.filter((e) => e.nodeId === node.id);
            if (nodeErrors.length > 0) {
                return { ...node, data: { ...node.data, error: nodeErrors[0].message } };
            }
            return { ...node, data: { ...node.data, error: undefined } };
        });
    }, [nodes, validationErrors]);


    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className="h-full w-full bg-slate-50 relative">
                    <ReactFlow
                        nodes={nodesWithErrors}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ maxZoom: 1, padding: 0.2 }}
                        className="validation-flow-canvas"
                    >
                        <Background variant={BackgroundVariant.Dots} gap={16} size={1.5} color="#cbd5e1" />
                        <Controls className="!mb-4 !ml-4 !shadow-md !rounded-lg" />
                        {showMiniMap && (
                            <MiniMap
                                className="!mb-4 !mr-4 !rounded-xl !shadow-md !border-2 !border-slate-100"
                                nodeColor={(node) => {
                                    return node.data.isStartNode ? '#10b981' : '#3b82f6';
                                }}
                            />
                        )}

                        <Panel position="top-left" className="!m-4 flex flex-col gap-3">
                            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm border border-slate-200">
                                <h1 className="text-sm font-bold text-slate-800">Visual Flow Builder</h1>
                            </div>

                            {validationErrors.length > 0 && (
                                <div className="max-w-md rounded-xl border border-red-200 bg-red-50/95 backdrop-blur-md p-3 shadow-sm flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        Flow Validation Errors ({validationErrors.length})
                                    </div>
                                    <ul className="text-xs text-red-600 list-disc pl-6 space-y-1">
                                        {validationErrors.slice(0, 3).map((err, i) => (
                                            <li key={i}>{err.message}</li>
                                        ))}
                                        {validationErrors.length > 3 && (
                                            <li>...and {validationErrors.length - 3} more errors</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </Panel>

                        <Panel position="top-right" className="!m-4 !mr-16">
                            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-sm border border-slate-200">
                                <button
                                    onClick={handleValidate}
                                    className="flex items-center gap-1.5 rounded-md border border-emerald-500 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100 shadow-sm"
                                >
                                    <Play className="h-3.5 w-3.5" />
                                    Validate
                                </button>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="minimap-mode"
                                        checked={showMiniMap}
                                        onCheckedChange={setShowMiniMap}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                    <Label htmlFor="minimap-mode" className="text-xs font-semibold text-slate-600 cursor-pointer">
                                        MiniMap
                                    </Label>
                                </div>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <button
                                    onClick={() => setIsImportOpen(true)}
                                    className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 shadow-sm"
                                >
                                    <Download className="h-3.5 w-3.5" />
                                    Import JSON
                                </button>
                            </div>
                        </Panel>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                            <Badge variant="outline" className="bg-white/90 backdrop-blur-md shadow-sm border-slate-200 text-slate-500 py-1.5 px-4 font-medium flex items-center gap-2">
                                <MousePointerClick className="h-3.5 w-3.5 text-slate-400" />
                                Right-click anywhere to manage canvas
                            </Badge>
                        </div>
                    </ReactFlow>

                    <ContextMenuContent className="w-56 bg-white border-slate-200 p-1 rounded-md">
                        <ContextMenuItem onClick={addNode} className="flex items-center gap-2 cursor-pointer py-2 text-slate-700 focus:bg-slate-100">
                            <Plus className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium font-sm">Add New Node</span>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 cursor-pointer py-2 text-slate-700 focus:bg-slate-100">
                            <Download className="h-4 w-4 text-blue-600" />
                            <span className="font-medium font-sm">Import JSON Schema</span>
                        </ContextMenuItem>
                    </ContextMenuContent>

                    <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
                </div>
            </ContextMenuTrigger>
        </ContextMenu>
    );
}
