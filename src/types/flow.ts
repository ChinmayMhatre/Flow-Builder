export type EdgeData = Record<string, unknown> & {
    condition: string;
    parameters?: Record<string, string>;
};

export type NodeData = Record<string, unknown> & {
    description?: string;
    prompt: string;
    isStartNode?: boolean;
    error?: string;
};

// These are the raw JSON formats we need to export to match the assignment schema
export interface SchemaEdge {
    to_node_id: string;
    condition: string;
    parameters?: Record<string, string>;
}

export interface SchemaNode {
    id: string;
    description?: string;
    prompt: string;
    edges: SchemaEdge[];
}
