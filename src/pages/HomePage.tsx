// 主页
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import TodoCard from "@/components/TodoCard"
import type { TodoItem, TodoStatus } from "@/utils/TodoStorage"
import { Separator } from "@/components/ui/separator"
import { TodoStorage } from "@/utils/TodoStorage"
import {
    DndContext,
    closestCenter,
    useDroppable,
    useDraggable,
    DragOverlay,
} from "@dnd-kit/core"
import Icon from "@/components/Icon"
import { useTranslation } from "react-i18next"
import { t } from "i18next"


// 可拖拽区域
function DroppableColumn({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 min-w-[300px] p-2 rounded overflow-y-auto overflow-x-hidden"
            data-column-id={id}
        >
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

// 可拖拽的待办卡片
function DraggableTodoCard({ todo, classifyTodos }: { todo: TodoItem; classifyTodos: () => void }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: todo.id });
    const style = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    };

    return (
        <div ref={setNodeRef} {...attributes} style={style}>
            <div>
                <TodoCard todo={todo} refresh={classifyTodos} listeners={listeners ?? {}} />
            </div>
        </div>
    );
}

// 创建任务输入框
function CreateTodoInput({ onCreate }: { onCreate: (title: string) => void }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");   // 新任务标题

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isModifierPressed = isMac ? event.metaKey : event.ctrlKey;

        // 当按下了回车键+修饰键（command或者control）时，创建任务
        if (
            event.key === "Enter" &&
            isModifierPressed &&
            title.trim()
        ) {
            onCreate(title.trim());
            setTitle("");   // 清空输入框
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white p-6 shadow-md">
            <Input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("todo.createTodoTitle")}
            />
        </div>
    );
}

// 主页
function HomePage() {
    const [pendingTodos, setPendingTodos] = useState<TodoItem[]>([]);
    const [inProgressTodos, setInProgressTodos] = useState<TodoItem[]>([]);
    const [doneTodos, setDoneTodos] = useState<TodoItem[]>([]);
    const [activeTodo, setActiveTodo] = useState<TodoItem | null>(null);


    // 获取任务列表
    const classifyTodos = () => {
        const todos = TodoStorage.getTodos();

        const sortByPriorityAndDeadline = (a: TodoItem, b: TodoItem) => {
            // 先按 priority 升序
            if ((a.priority ?? 3) !== (b.priority ?? 3)) {
                return (a.priority ?? 3) - (b.priority ?? 3);
            }

            // 按照截止时间升序（早的排前面）
            const deadlineA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
            const deadlineB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
            return deadlineA - deadlineB;
        };

        // 排序已完成任务，新的排前面
        const sortByCompletedTimeDesc = (a: TodoItem, b: TodoItem) => {
            const completedAtA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
            const completedAtB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
            return completedAtB - completedAtA;
        };

        const pending = todos
            .filter(todo => todo.status === "pending" && !todo.completedAt)
            .sort(sortByPriorityAndDeadline);

        const inProgress = todos
            .filter(todo => todo.status === "in-progress" && !todo.completedAt)
            .sort(sortByPriorityAndDeadline);

        const done = todos
            .filter(todo => todo.status === "done" || !!todo.completedAt)
            .sort(sortByCompletedTimeDesc);

        setPendingTodos(pending);
        setInProgressTodos(inProgress);
        setDoneTodos(done);
    };

    useEffect(() => {
        classifyTodos();
    }, []);

    return (
        <main className="h-screen flex flex-col">
            {/* 顶部栏 */}
            <header className="h-[65px] flex items-center justify-between px-6">
                <h1 className="text-2xl font-bold">今天</h1>
            </header>

            {/* 任务列表 */}
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={({ active }) => {
                    // 记录当前拖拽的 todo
                    const allTodos = [...pendingTodos, ...inProgressTodos, ...doneTodos];
                    const draggedTodo = allTodos.find((t) => t.id === active.id);
                    setActiveTodo(draggedTodo ?? null);
                }}
                onDragEnd={({ active, over }) => {
                    setActiveTodo(null);   // 拖拽结束，清空
                    if (active && over && active.id !== over.id) {
                        const columnIds = ["pending", "in-progress", "done"];
                        if (!columnIds.includes(over.id as string)) return;

                        // 获取所有 todo
                        const allTodos = [...pendingTodos, ...inProgressTodos, ...doneTodos];
                        const draggedTodo = allTodos.find((t) => t.id === active.id);

                        if (draggedTodo && draggedTodo.status !== over.id) {
                            TodoStorage.updateTodoField(draggedTodo.id, "status", over.id as TodoStatus);
                            if (over.id === "done") {
                                TodoStorage.updateTodoField(draggedTodo.id, "completedAt", new Date().toISOString());
                            } else {
                                // 如果不是 done，清空 completedAt
                                TodoStorage.updateTodoField(draggedTodo.id, "completedAt", null);
                            }
                            classifyTodos(); // 重新分类要刷新，否则无法更改卡片上的状态
                        }
                    }
                }}
                onDragCancel={() => setActiveTodo(null)} // 拖拽取消时清空
            >
                <section className="flex flex-1 overflow-x-hidden px-6 py-4 gap-4">
                    <DroppableColumn id="pending" title={t('todo.status.pending')}>
                        {pendingTodos.map(todo => (
                            <DraggableTodoCard key={todo.id} todo={todo} classifyTodos={classifyTodos} />
                        ))}
                        {pendingTodos.length == 0 && (
                            <span className="flex flex-col items-center justify-center text-center text-neutral-400">
                                <Icon name="box" w="32px" h="32px" className="text-neutral-400" />
                                <span>{t('todo.emptyTodoList')}</span>
                            </span>
                        )}
                    </DroppableColumn>

                    <Separator orientation="vertical" />

                    <DroppableColumn id="in-progress" title={t('todo.status.inProgress')}>
                        {inProgressTodos.map(todo => (
                            <DraggableTodoCard key={todo.id} todo={todo} classifyTodos={classifyTodos} />
                        ))}
                        {inProgressTodos.length == 0 && (
                            <span className="flex flex-col items-center justify-center text-center text-neutral-400">
                                <Icon name="box" w="32px" h="32px" className="text-neutral-400" />
                                <span>{t('todo.emptyTodoList')}</span>
                            </span>
                        )}
                    </DroppableColumn>

                    <Separator orientation="vertical" />

                    <DroppableColumn id="done" title={t('todo.status.done')}>
                        {doneTodos.map(todo => (
                            <DraggableTodoCard key={todo.id} todo={todo} classifyTodos={classifyTodos} />
                        ))}
                        {doneTodos.length == 0 && (
                            <span className="flex flex-col items-center justify-center text-center text-neutral-400">
                                <Icon name="box" w="32px" h="32px" className="text-neutral-400" />
                                <span>{t('todo.emptyTodoList')}</span>
                            </span>
                        )}
                    </DroppableColumn>
                </section>

                <DragOverlay>
                    {activeTodo ? (
                        <div style={{ minWidth: 280, maxWidth: 340 }}>
                            <TodoCard todo={activeTodo} refresh={() => { }} listeners={{}} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>


            {/* 创建任务输入框 */}
            <footer className="h-[80px] w-full border-t bg-white px-6 flex items-center">
                <CreateTodoInput
                    onCreate={(title) => {
                        console.log("创建任务: ", title);

                        const newTodo: TodoItem = {
                            id: crypto.randomUUID(),
                            title: title,
                            content: "",
                            createdAt: new Date().toISOString(),
                            completedAt: null,
                            status: "pending"
                        };

                        TodoStorage.addTodo(newTodo);
                        setPendingTodos(prev => [...prev, newTodo]);
                    }}
                />
            </footer>
        </main>
    );
}

export default HomePage