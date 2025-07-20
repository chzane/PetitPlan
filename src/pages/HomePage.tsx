// 主页
import { Button } from "@/components/ui/button"
import TodoCard from "@/components/TodoCard"

function HomePage() {
    return (
        <main className="p-6 space-y-6">
            {/* 顶部栏 */}
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">今天</h1>
                <Button variant="outline" size="sm">添加任务</Button>
            </header>

            {/* 今日任务列表 */}
            <section>
                <h2 className="text-lg font-semibold mb-2">待办事项</h2>
                <ul className="space-y-3">
                    <TodoCard
                        todo={{
                            id: "1",
                            title: "🛒 去菜市场买菜",
                            content: "胡萝卜、西兰花、番茄",
                            createdAt: new Date().toISOString(),
                            completedAt: "",
                            location: "北京",
                            tags: ["购物", "健康"],
                            dueDate: "2025-07-23T18:00:00.000Z"
                        }}
                        onComplete={(id) => console.log("完成待办：", id)}
                    />
                    <TodoCard
                        todo={{
                            id: "2",
                            title: "🔧 检查服务器状态",
                            content: "SolariiX HK 1 Server",
                            createdAt: new Date().toISOString(),
                            completedAt: "",
                            tags: ["运维"],
                            dueDate: "2025-07-23T18:00:00.000Z",
                            attachments: [
                                {
                                    id: '1_attachment_1',
                                    type: 'image',
                                    url: 'https://example.com/image.jpg',
                                    name: '服务器位置图片'
                                }
                            ]
                        }}
                        onComplete={(id) => console.log("完成待办：", id)}
                    />
                </ul>
            </section>
        </main>
    );
}

export default HomePage