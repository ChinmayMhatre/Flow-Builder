import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Play, MessageSquare, AlignLeft } from 'lucide-react';
import type { FlowNode } from '../../store/flowStore';

export function FlowCardNode({ data, selected, id }: NodeProps<FlowNode>) {
    const isStartNode = !!data.isStartNode;

    return (
        <div
            className={`relative min-w-[280px] rounded-xl border-2 bg-white p-4 shadow-sm transition-all ${selected
                    ? 'border-blue-500 shadow-md ring-4 ring-blue-500/20'
                    : data.error
                        ? 'border-red-500 shadow-md ring-4 ring-red-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                }`}
        >
            {/* Target Handle (Incoming connections) - Hidden for start node */}
            {!isStartNode && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="h-3 w-3 border-2 border-white bg-slate-400"
                />
            )}

            {/* Header section */}
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                    {isStartNode ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            <Play className="h-4 w-4" fill="currentColor" />
                        </div>
                    ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                    )}
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {isStartNode ? 'Start Node' : 'Step Node'}
                        </div>
                        <div className="text-sm font-medium text-slate-800">{id}</div>
                    </div>
                </div>
            </div>

            {/* Body Section */}
            <div className="space-y-3">
                {data.description && (
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                        <AlignLeft className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <p className="line-clamp-2 leading-snug">{data.description}</p>
                    </div>
                )}

                <div className="rounded-lg bg-slate-50 p-3">
                    <div className="mb-1 text-xs font-medium text-slate-400">Prompt</div>
                    <div className="text-sm text-slate-700">{data.prompt || 'No prompt set.'}</div>
                </div>
            </div>

            {/* Source Handle (Outgoing connections) */}
            <Handle
                type="source"
                position={Position.Right}
                className="h-3 w-3 border-2 border-white bg-blue-500"
            />
        </div>
    );
}
