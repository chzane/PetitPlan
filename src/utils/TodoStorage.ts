// 存储、读取、更新和删除待办事项数据

// 附件
export interface Attachment {
    id: string;   // 附件 ID
    type: 'image' | 'file' | 'link';   // 附件类型
    url: string;   // 附件地址
    name?: string;   // 附件名称
}

// 重复规则
export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

// todo 状态
export type TodoStatus = 'pending' | 'in-progress' | 'done' | 'cancelled';

// Todo
export interface TodoItem {
    id: string;   // Todo ID
    title: string;   // 待办标题
    content: string;   // 描述
    startDate?: string | null;   // 开始时间(ISO 格式)
    completedAt: string | null;   // 完成时间(ISO 格式)
    createdAt: string;   // 创建时间(ISO 格式)
    dueDate?: string | null;   // 截止时间(ISO 格式)
    priority?: number;   // 优先级，数值越小越重要
    tags?: string[];   // 标签
    attachments?: Attachment[];   // 附件
    location?: string;   // 位置（暂时为文字描述）
    recurrence?: RecurrenceRule;   // 重复规则
    status?: TodoStatus;   // 任务状态
    reminder?: string;   // 提醒时间
    subtasks?: TodoItem[];   // 子待办
}


export class TodoStorage {
    private static storageKey = 'todos';

    // 读取所有 todo
    static getTodos(): TodoItem[] {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as TodoItem[];
        } catch {
            console.warn('数据格式不正确');
            localStorage.removeItem(this.storageKey);
            return [];
        }
    }

    // 保存 todo
    static saveTodos(todos: TodoItem[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(todos));
    }

    // 添加一个 todo
    static addTodo(todo: TodoItem): void {
        const todos = this.getTodos();
        todos.push(todo);
        this.saveTodos(todos);
    }

    // 删除一个 todo（通过 id）
    static deleteTodo(id: string): void {
        const todos = this.getTodos().filter((t) => t.id !== id);
        this.saveTodos(todos);
    }

    // 更新一个 todo 的值（通过 id）
    static updateTodoField<K extends keyof TodoItem>(id: string, key: K, value: TodoItem[K]): void {
        const todos = this.getTodos();
        const index = todos.findIndex((t) => t.id === id);
        if (index === -1) return;

        todos[index] = {
            ...todos[index],
            [key]: value,
        };

        this.saveTodos(todos);
    }

    // 清空所有 todos
    static clear(): void {
        localStorage.removeItem(this.storageKey);
    }
}
