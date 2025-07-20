// 存储、读取、更新和删除附件

import { openDB, type IDBPDatabase } from 'idb';
import { type Attachment } from './TodoStorage';

const DB_NAME = 'todo-attachments-db';   // 数据库名称
const STORE_NAME = 'attachments';   // 存储名称
const DB_VERSION = 1;   // 数据库版本

// AttachmentDb
export class AttachmentDb {
    private dbPromise: Promise<IDBPDatabase>;

    constructor() {
        this.dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('todoId', 'todoId', { unique: false });
                }
            },
        });
    }

    // 添加附件
    async add(attachment: Attachment) {
        const db = await this.dbPromise;
        await db.put(STORE_NAME, attachment);
    }

    // 获取指定待办的附件
    async getByTodoId(todoId: string): Promise<Attachment[]> {
        const db = await this.dbPromise;
        return db.getAllFromIndex(STORE_NAME, 'todoId', todoId);
    }

    // 获取一个附件
    async get(id: string): Promise<Attachment | undefined> {
        const db = await this.dbPromise;
        return db.get(STORE_NAME, id);
    }

    // 删除附件
    async delete(id: string) {
        const db = await this.dbPromise;
        await db.delete(STORE_NAME, id);
    }

    // 清空所有附件
    async clear() {
        const db = await this.dbPromise;
        await db.clear(STORE_NAME);
    }
}