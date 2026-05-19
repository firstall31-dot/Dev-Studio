export interface IRepository<TSelect, TInsert> {
  findById(id: string): Promise<TSelect | null>;
  findAll(filter?: any): Promise<TSelect[]>;
  create(data: TInsert): Promise<TSelect>;
  createMany(data: TInsert[]): Promise<TSelect[]>;
  update(id: string, data: Partial<TInsert>): Promise<TSelect>;
  updateMany(filter: any, data: Partial<TInsert>): Promise<TSelect[]>;
  delete(id: string): Promise<boolean>;
  deleteMany(filter: any): Promise<boolean>;
}
