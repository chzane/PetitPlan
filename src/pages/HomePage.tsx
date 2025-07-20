// 主页
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import TodoCard from "@/components/TodoCard"
import type { TodoItem } from "@/utils/TodoStorage"
import { TodoStorage } from "@/utils/TodoStorage"
import Icon from "@/components/Icon"
import { useTranslation } from "react-i18next"

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
    const [ncTodoList, setNcTodoList] = useState<TodoItem[]>([]);


    // 获取未完成的任务
    const setNotCompletedTodoList = () => {
        const todos = TodoStorage.getTodos()
            .filter(todo => !todo.completedAt)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNcTodoList(todos);
    };

    useEffect(() => {
        setNotCompletedTodoList();
    }, []);

    return (
        <main className="h-screen flex flex-col">
            {/* 顶部栏 */}
            <header className="h-[65px] flex items-center justify-between px-6">
                <h1 className="text-2xl font-bold">今天</h1>
            </header>

            {/* 今日任务列表 */}
            <section className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                <ul className="space-y-3 overflow-y-auto">
                    {ncTodoList.map((item) => (
                        <TodoCard
                            todo={item}
                            onComplete={(id) => console.log("完成待办：", id)}
                        />
                    ))}
                    {ncTodoList.length == 0 && (
                        <span className="flex flex-col items-center justify-center text-center text-neutral-400">
                            <Icon name="box" w="32px" h="32px" className="text-neutral-400" />
                            <span>空空如也，在下方输入框中创建新任务</span>
                        </span>
                    )}
                </ul>
            </section>

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
                            completedAt: null
                        };

                        TodoStorage.addTodo(newTodo);
                        setNcTodoList(prev => [...prev, newTodo]);
                    }}
                />
            </footer>
        </main>
    );
}

export default HomePage