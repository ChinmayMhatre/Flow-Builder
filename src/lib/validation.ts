import type { FlowNode, FlowEdge } from '../store/flowStore';

export interface ValidationError {
    nodeId?: string;
    edgeId?: string;
    message: string;
}

export const ALLOWED_CONDITIONS = [
    'always',
    'if_yes',
    'if_no',
    'valid_account',
    'account_created',
    'on_error',
    'user_silence'
] as const;

export function validateFlow(nodes: FlowNode[], edges: FlowEdge[]): ValidationError[] {
    const errors: ValidationError[] = [];

    // 1. Check if start node exists
    const startNodeExists = nodes.some((n) => n.data.isStartNode);
    if (!startNodeExists) {
        errors.push({
            message: 'The flow must have at least one Start Node.',
        });
    }

    // 2. Check each node for validation
    nodes.forEach((node) => {
        // Check missing descriptions
        if (!node.data.description || node.data.description.trim() === '') {
            errors.push({
                nodeId: node.id,
                message: 'Description is required.',
            });
        }

        // Check disconnected nodes (must have at least one incoming or outgoing edge if not start node)
        // Actually, maybe simple warnings are fine, but assignment says "Warn about disconnected nodes"
        const hasIncoming = edges.some((e) => e.target === node.id);
        const hasOutgoing = edges.some((e) => e.source === node.id);

        if (!node.data.isStartNode && !hasIncoming && !hasOutgoing) {
            errors.push({
                nodeId: node.id,
                message: 'Node is completely disconnected from the flow.',
            });
        }

        // Warn if a target node is missing 
        if (node.data.isStartNode && !hasOutgoing) {
            errors.push({
                nodeId: node.id,
                message: 'Start node has no outgoing connections.',
            });
        }

        // Enforce 1-1 condition mapping for outgoing edges
        const outgoingEdges = edges.filter((e) => e.source === node.id);
        const conditionSet = new Set<string>();
        outgoingEdges.forEach((edge) => {
            const condition = (edge.data?.condition || '').trim();

            if (condition && !ALLOWED_CONDITIONS.includes(condition as any)) {
                errors.push({
                    nodeId: node.id,
                    message: `Invalid condition "${condition}" on outgoing edge.`,
                });
            }

            if (conditionSet.has(condition)) {
                errors.push({
                    nodeId: node.id,
                    message: condition
                        ? `Multiple edges share the same condition: "${condition}"`
                        : `Multiple edges have an empty condition.`,
                });
            }
            conditionSet.add(condition);
        });
    });

    // 3. Node ID uniqueness is structurally guaranteed by Zustand unless we let them edit IDs.
    // We will check just in case.
    const idSet = new Set<string>();
    nodes.forEach((node) => {
        if (idSet.has(node.id)) {
            errors.push({
                nodeId: node.id,
                message: `Duplicate Node ID detected: ${node.id}`,
            });
        }
        idSet.add(node.id);
    });

    return errors;
}
