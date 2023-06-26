// db.ts
import Dexie, { Table } from 'dexie';

export interface Tree {
  id?: number;
  uid: string;
  path: string;
  pool: Blob;
  matrix: Blob;
  count: number;
}

export class SubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  tree!: Table<Tree>;

  constructor() {
    super('database');
    this.version(1).stores({
      tree: '++id, uid, path, pool, matrix, count' // Primary key and indexed props
    });
  }
}

export const db = new SubClassedDexie();
