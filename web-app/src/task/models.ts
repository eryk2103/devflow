export const statuses = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = typeof statuses[number];

export const types = ["FEATURE", "BUG", "REFACTOR"] as const;
export type TaskType = typeof types[number];

export const priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type TaskPriority = typeof priorities[number];

export type Task = {
    id: number;
    projectId: number;
    name: string;
    status: TaskStatus;
    type: TaskType;
    priority: TaskPriority;
    description: string;
    createdAt: string;
}