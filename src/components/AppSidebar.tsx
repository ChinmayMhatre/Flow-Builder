import { useFlowStore } from '../store/flowStore';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    useSidebar,
} from './ui/sidebar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { useEffect } from 'react';

export function AppSidebar() {
    const { nodes, edges, updateNodeData, updateEdgeData } = useFlowStore();
    const { setOpen } = useSidebar();

    // React Flow sets 'selected: true' on nodes when clicked
    const selectedNode = nodes.find((n) => n.selected);

    useEffect(() => {
        if (selectedNode?.id) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [selectedNode?.id, setOpen]);

    if (!selectedNode) {
        return (
            <Sidebar collapsible="offcanvas" side="right" className="border-l border-slate-200">
                <SidebarHeader className="mt-12">
                    <h2 className="px-2 pt-2 text-lg font-semibold text-slate-800">Node Editor</h2>
                </SidebarHeader>
                <SidebarContent>
                    <div className="p-4 text-sm text-slate-500 text-center mt-4">
                        Select a node on the canvas to see its properties.
                    </div>
                </SidebarContent>
            </Sidebar>
        );
    }

    // Find all edges that originate from this node
    const outgoingEdges = edges.filter((e) => e.source === selectedNode.id);

    return (
        <Sidebar collapsible="offcanvas" side="right" className="border-l border-slate-200 bg-white">
            <SidebarHeader className="flex flex-col gap-2 p-4 mt-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Edit Node</h2>
                    {selectedNode.data.isStartNode && (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                            Start State
                        </Badge>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase text-slate-500 font-semibold mb-2">Properties</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col gap-6 px-2">
                        <div className="grid gap-2">
                            <Label className="text-slate-700">Node ID</Label>
                            <Input
                                value={selectedNode.id}
                                readOnly
                                title="Node ID cannot be changed"
                                className="bg-slate-50 text-slate-500 cursor-not-allowed text-sm"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-slate-700">Description</Label>
                            <Textarea
                                placeholder="Describe what this node does..."
                                value={selectedNode.data.description || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateNodeData(selectedNode.id, { description: e.target.value })}
                                className="resize-none h-20 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-slate-700">Prompt / Action</Label>
                            <Textarea
                                placeholder="Enter the main output or prompt..."
                                value={selectedNode.data.prompt || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateNodeData(selectedNode.id, { prompt: e.target.value })}
                                className="resize-none h-28 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4 pt-4 border-t border-slate-100">
                    <SidebarGroupLabel className="text-xs uppercase text-slate-500 font-semibold mb-2">
                        Outgoing Edges ({outgoingEdges.length})
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="px-2">
                        {outgoingEdges.length === 0 ? (
                            <p className="text-xs text-slate-500">No outgoing edges. Connect from the right handle to another node.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {outgoingEdges.map((edge) => (
                                    <div key={edge.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                To: {edge.target}
                                            </span>
                                        </div>
                                        <Select
                                            value={edge.data?.condition || 'always'}
                                            onValueChange={(val) => updateEdgeData(edge.id, { condition: val })}
                                        >
                                            <SelectTrigger className="h-8 text-xs bg-white focus:ring-1 focus:ring-blue-500">
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="always" className="text-xs">Always (Default)</SelectItem>
                                                <SelectItem value="on_error" className="text-xs">On Error</SelectItem>
                                                <SelectItem value="matches_intent" className="text-xs">Matches Intent</SelectItem>
                                                <SelectItem value="user_silence" className="text-xs">User Silence</SelectItem>
                                                <SelectItem value="is_authorized" className="text-xs">Is Authorized</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
