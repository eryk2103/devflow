import type { Task } from "./task/models";

export const PROJECTS_DATA = [
    {
        "id": 1,
        "name": "Apollo CRM"
    },
    {
        "id": 2,
        "name": "Nova Analytics - analytics platform for modern web apps"
    },
    {
        "id": 3,
        "name": "PixelForge Studio"
    },
    {
        "id": 4,
        "name": "CloudSync Platform"
    },
    {
        "id": 5,
        "name": "TaskFlow Pro"
    },
    {
        "id": 6,
        "name": "QuantumPay API"
    },
    {
        "id": 7,
        "name": "Insight Dashboard"
    },
    {
        "id": 8,
        "name": "SecureVault"
    },
    {
        "id": 9,
        "name": "Orbit Scheduler"
    },
    {
        "id": 10,
        "name": "Echo Support System"
    }
]

export const PROJECT_DATA = {
    id: 1,
    name: "TaskFlow",
    description:
        "TaskFlow is a project management platform that helps teams organize tasks, track deadlines, collaborate in real time, and monitor progress through customizable dashboards and reporting tools."
}
export const TASK_DATA: Task = {
    id: 1,
    name: "Design login page",
    status: "TODO",
    projectId: 1,
    type: "BUG",
    priority: "HIGH",
    description: "Task description",
    createdAt: "08-05-2026 12:00"
}

export const TASKS_DATA: Task[] = [
    {
        id: 1,
        name: "Design login page",
        status: "TODO",
        projectId: 1,
        type: "BUG",
        priority: "HIGH",
        description: "Task description",
        createdAt: "08-05-2026 12:00"
    },
    {
        id: 2,
        name: "Implement authentication API",
        status: "IN_PROGRESS",
        projectId: 1,
        type: "BUG",
        priority: "HIGH",
        description: "Task description",
        createdAt: "08-05-2026 12:00"
    },
    {
        id: 3,
        name: "Create database schema",
        status: "DONE",
        projectId: 1,
        type: "BUG",
        priority: "HIGH",
        description: "Task description",
        createdAt: "08-05-2026 12:00"
    },
    {
        id: 4,
        name: "Add unit tests for services",
        status: "TODO",
        projectId: 1,
        type: "BUG",
        priority: "HIGH",
        description: "Task description",
        createdAt: "08-05-2026 12:00"
    }
];