/* eslint-disable no-unused-vars */
export interface Repository<N extends { id: string }> {
  getAll(): Promise<N[]>;
  getById(id: N['id']): Promise<N>;
  create(newData: Omit<N, 'id'>): Promise<N>;
  update(id: N['id'], newData: Partial<N>): Promise<N>;
  delete(id: string): Promise<void>;
  search?({ key, value }: { key: string; value: string }): Promise<N[]>;
}
