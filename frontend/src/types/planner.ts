import type { TaskPriority, TaskStatus, TaskCategory } from "@shared/enums";

export type { TaskPriority, TaskStatus, TaskCategory };

export interface PlannerTask {
  id: string;
  date: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  order: number;
  estimatedMinutes?: number;
  createdAt: number;
  updatedAt: number;
}
