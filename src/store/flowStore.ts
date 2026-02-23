import { create } from 'zustand';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
} from '@xyflow/react';
import type {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from '@xyflow/react';
import type { NodeData, EdgeData } from '../types/flow';

export type FlowNode = Node<NodeData>;
export type FlowEdge = Edge<EdgeData>;

interface FlowState {
    nodes: FlowNode[];
    edges: FlowEdge[];
    onNodesChange: OnNodesChange<FlowNode>;
    onEdgesChange: OnEdgesChange<FlowEdge>;
    onConnect: OnConnect;
    setNodes: (nodes: FlowNode[]) => void;
    setEdges: (edges: FlowEdge[]) => void;
    updateNodeData: (id: string, data: Partial<NodeData>) => void;
    updateEdgeData: (id: string, data: Partial<EdgeData>) => void;
    addNode: () => void;
}

const initialNodes: FlowNode[] = [
    {
        id: 'start-node',
        type: 'flow-card', // Our custom component name we'll build next
        position: { x: 250, y: 100 },
        data: {
            description: 'The beginning of the flow',
            prompt: 'Welcome! How can I help you?',
            isStartNode: true,
        },
    },
];

const initialEdges: FlowEdge[] = [];

export const useFlowStore = create<FlowState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,

    // React Flow required handlers
    onNodesChange: (changes: NodeChange<FlowNode>[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes) as FlowNode[],
        });
    },
    onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges) as FlowEdge[],
        });
    },
    onConnect: (connection: Connection) => {
        // Determine the default condition payload for a new edge
        const newEdgeData: EdgeData = {
            condition: 'always',
        };

        // Add that data to the standard xyflow edge 
        const edge: Edge = {
            ...connection,
            id: `${connection.source}-${connection.target}`,
            data: newEdgeData,
            type: 'default',
        };

        set({
            edges: addEdge(edge, get().edges) as FlowEdge[],
        });
    },

    // Manual setters
    setNodes: (nodes: FlowNode[]) => set({ nodes }),
    setEdges: (edges: FlowEdge[]) => set({ edges }),

    // Data updaters
    updateNodeData: (id: string, partialData: Partial<NodeData>) => {
        set({
            nodes: get().nodes.map((n) => {
                if (n.id === id) {
                    return { ...n, data: { ...n.data, ...partialData } as NodeData };
                }
                return n;
            }),
        });
    },

    updateEdgeData: (id: string, partialData: Partial<EdgeData>) => {
        set({
            edges: get().edges.map((e) => {
                if (e.id === id) {
                    return { ...e, data: { ...e.data, ...partialData } as EdgeData };
                }
                return e;
            }),
        });
    },

    addNode: () => {
        const id = `node_${Math.random().toString(36).substring(2, 9)}`;
        const newNode: FlowNode = {
            id,
            type: 'flow-card',
            position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
            data: {
                description: '',
                prompt: '',
                isStartNode: false,
            },
        };
        set({ nodes: [...get().nodes, newNode] });
    }
}));
