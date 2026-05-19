import { eq, and, isNull } from "drizzle-orm";
import { IRepository } from "../../domain/repositories/base.repository.js";

export class DrizzleBaseRepository<
  TTable extends Record<string, any>,
  TSelect = any,
  TInsert = any
> implements IRepository<TSelect, TInsert> {
  constructor(
    protected table: TTable,
    protected dbClient: any
  ) {}

  /**
   * Helper to automatically apply soft delete filter (isNull(deletedAt)) if it exists on the table.
   */
  protected applySoftDelete(whereClause?: any): any {
    const hasDeletedAt = "deletedAt" in this.table;
    if (!hasDeletedAt) {
      return whereClause;
    }

    const softDeleteFilter = isNull((this.table as any).deletedAt);
    if (!whereClause) {
      return softDeleteFilter;
    }

    return and(whereClause, softDeleteFilter);
  }

  async findById(id: string): Promise<TSelect | null> {
    const whereClause = this.applySoftDelete(eq((this.table as any).id, id));
    const [row] = await this.dbClient
      .select()
      .from(this.table)
      .where(whereClause);
    return row || null;
  }

  async findAll(filter?: any): Promise<TSelect[]> {
    const whereClause = this.applySoftDelete(filter);
    return await this.dbClient
      .select()
      .from(this.table)
      .where(whereClause);
  }

  async create(data: TInsert): Promise<TSelect> {
    const [row] = await this.dbClient
      .insert(this.table)
      .values(data)
      .returning();
    return row;
  }

  async createMany(data: TInsert[]): Promise<TSelect[]> {
    if (!data.length) return [];
    return await this.dbClient
      .insert(this.table)
      .values(data)
      .onConflictDoNothing()
      .returning();
  }

  async update(id: string, data: Partial<TInsert>): Promise<TSelect> {
    const whereClause = this.applySoftDelete(eq((this.table as any).id, id));
    const [row] = await this.dbClient
      .update(this.table)
      .set({ ...data, updatedAt: new Date() })
      .where(whereClause)
      .returning();
    return row;
  }

  async updateMany(filter: any, data: Partial<TInsert>): Promise<TSelect[]> {
    const whereClause = this.applySoftDelete(filter);
    return await this.dbClient
      .update(this.table)
      .set({ ...data, updatedAt: new Date() })
      .where(whereClause)
      .returning();
  }

  async delete(id: string): Promise<boolean> {
    const hasDeletedAt = "deletedAt" in this.table;
    const whereClause = eq((this.table as any).id, id);

    if (hasDeletedAt) {
      await this.dbClient
        .update(this.table)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(whereClause);
    } else {
      await this.dbClient
        .delete(this.table)
        .where(whereClause);
    }
    return true;
  }

  async deleteMany(filter: any): Promise<boolean> {
    const hasDeletedAt = "deletedAt" in this.table;
    const whereClause = this.applySoftDelete(filter);

    if (hasDeletedAt) {
      await this.dbClient
        .update(this.table)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(whereClause);
    } else {
      await this.dbClient
        .delete(this.table)
        .where(whereClause);
    }
    return true;
  }
}
