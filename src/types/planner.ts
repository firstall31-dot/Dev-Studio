import { taskPriorityEnum, taskStatusEnum, taskCategoryEnum } from "@shared/schema/planner";

export type TaskPriority = typeof taskPriorityEnum.enumValues[number];
export type TaskStatus = typeof taskStatusEnum.enumValues[number];
export type TaskCategory = typeof taskCategoryEnum.enumValues[number];

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
