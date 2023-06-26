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

export interface Option {
  id?: number;
  uid: string;
  key: string;
  value: string;
}

export class SubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  tree!: Table<Tree>;
  option!: Table<Option>;

  constructor() {
    super('database');
    this.version(1).stores({
      tree: '++id, uid, path, pool, matrix, count', // Primary key and indexed props
      option: '++id, uid, key, value',
    });
  }
}

export const db = new SubClassedDexie();
