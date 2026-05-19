export class PlannerMapper {
  static toDomain(entity: any) {
    if (!entity) return entity;
    return {
      id: entity.id,
      date: entity.date,
      title: entity.title,
      description: entity.description || undefined,
      priority: entity.priority || "medium",
      status: entity.status || "todo",
      category: entity.category || "general",
      order: entity.order ?? 0,
      estimatedMinutes: entity.estimatedMinutes ?? undefined,
      tags: entity.tags || [],
      slug: entity.slug || "",
      createdAt: new Date(entity.createdAt).getTime(),
      updatedAt: new Date(entity.updatedAt).getTime(),
    };
  }
}
