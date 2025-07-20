import { useState, useEffect } from "react"
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Icon from "@/components/Icon"
import DatePicker from "@/components/DatePicker"
import TagInput from "@/components/TagInput"
import PrioritySelect from "@/components/PrioritySelect"

import { type TodoItem, TodoStorage } from "@/utils/TodoStorage"
import { parseISO } from "date-fns"

interface TodoDetailSheetProps {
    todo: TodoItem;
    setSheetIsOpen: (isOpen: boolean) => void;
};

interface TodoCardProps {
    todo: TodoItem;
    refresh?: () => void;
    listeners: React.HTMLAttributes<HTMLDivElement>;
}

// 待办任务详细信息侧边栏
export function TodoDetailSheet({ todo, setSheetIsOpen, children }: TodoDetailSheetProps & { children: React.ReactNode }) {
    const [data, setData] = useState<TodoItem>(todo);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    // 自动保存逻辑
    useEffect(() => {
        if (data.id) {
            TodoStorage.updateTodoField(data.id, "title", data.title || "UnKnown");
            TodoStorage.updateTodoField(data.id, "content", data.content);
            TodoStorage.updateTodoField(data.id, "dueDate", data.dueDate);
            TodoStorage.updateTodoField(data.id, "priority", data.priority);
            TodoStorage.updateTodoField(data.id, "tags", data.tags);
            TodoStorage.updateTodoField(data.id, "status", data.status);
            TodoStorage.updateTodoField(data.id, "location", data.location);

            if (data.status === "done") {
                const now = new Date().toISOString();
                TodoStorage.updateTodoField(data.id, "completedAt", now);
            }
        }
    }, [data]);

    useEffect(() => {
        setSheetIsOpen(open);   // 防止点击侧边栏也会更改是否显示详细信息
    }, [open]);

    const updateField = <K extends keyof TodoItem>(key: K, value: TodoItem[K]) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <div className="p-6 space-y-6 overflow-y-auto mt-6 max-h-full">
                    <div className="space-y-2">
                        <div>
                            <Input value={data.title} placeholder={t('todo.title')} onChange={(e) => updateField("title", e.target.value)} />
                        </div>

                        <div>
                            <Textarea value={data.content} placeholder={t('todo.content')} onChange={(e) => updateField("content", e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label className="mb-2">
                            {t('todo.dueDate')}
                        </Label>
                        <DatePicker
                            value={data.dueDate ? parseISO(data.dueDate) : undefined}
                            placeholder={t('todo.selectDueDatePlaceholder')}
                            onChange={(date) => updateField("dueDate", date?.toISOString() || null)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">
                            {t('todo.priority')}
                        </Label>
                        <PrioritySelect
                            value={data.priority}
                            onChange={(val) => updateField("priority", val)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">
                            {t('todo.tags')}
                        </Label>
                        <TagInput
                            value={data.tags}
                            onChange={(tags) => updateField("tags", tags)}
                        />
                    </div>

                    <div>
                        <Label className="mb-2">
                            {t('todo.location')}
                        </Label>
                        <Input value={data.location ?? ""} onChange={(e) => updateField("location", e.target.value)} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// 待办事项卡片
function TodoCard({ todo, refresh, listeners }: TodoCardProps) {
    const { t } = useTranslation();

    const [showDetailInfo, setShowDetailInfo] = useState(false);   // 是否显示详细信息
    const [sheetIsOpen, setSheetIsOpen] = useState(false);   // 侧边栏是否已经开启

    useEffect(() => {
        refresh?.();
    }, [sheetIsOpen]);

    return (
        <Card>
            <CardHeader className="flex flex-col space-y-2">
                <div className="flex justify-between items-start gap-2 w-full">
                    {/* 拖拽手柄 */}
                    <div {...listeners} style={{ cursor: "grab" }} className="flex items-center">
                        <span style={{ marginRight: 8, userSelect: "none" }}>⠿</span>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* 编辑按钮 */}
                        <TodoDetailSheet todo={todo} key={todo.id} setSheetIsOpen={setSheetIsOpen}>
                            <Button variant="ghost" className="h-[24px]">
                                {t("todo.edit")}
                            </Button>
                        </TodoDetailSheet>

                        {/* 状态切换/删除按钮 */}
                        {todo.status !== "done" ? (
                            <Button
                                variant="outline"
                                className="h-[24px]"
                                onClick={() => {
                                    let nextStatus: TodoItem["status"] | undefined;
                                    if (todo.status === "pending") {
                                        nextStatus = "in-progress";
                                    } else if (todo.status === "in-progress") {
                                        nextStatus = "done";
                                    }

                                    if (nextStatus) {
                                        TodoStorage.updateTodoField(todo.id, "status", nextStatus);
                                        if (nextStatus === "done") {
                                            TodoStorage.updateTodoField(todo.id, "completedAt", new Date().toISOString());
                                        }
                                        refresh?.();
                                    }
                                }}
                            >
                                {todo.status === "pending" ? (
                                    <>
                                        <Icon name="player-play" w="12px" h="12px" />
                                        {t("todo.start")}
                                    </>
                                ) : (
                                    <>
                                        <Icon name="flag" w="12px" h="12px" />
                                        {t("todo.markAsDone")}
                                    </>
                                )}
                            </Button>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant="destructive" className="h-[24px]">
                                        {t("todo.delete")}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t("dialog.deleteTodo.title")}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t("dialog.deleteTodo.description")}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t("dialog.deleteTodo.cancel")}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => {
                                                TodoStorage.deleteTodo(todo.id);
                                                refresh?.();
                                                toast(t("toast.todoDeleted"));
                                            }}
                                        >
                                            {t("dialog.deleteTodo.confirm")}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                {/* 标题和描述 */}
                <div
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest("button")) return;
                        if (sheetIsOpen) return;
                        setShowDetailInfo(!showDetailInfo);
                    }}
                    className="mt-2 w-full"
                >
                    <CardTitle>{todo.title}</CardTitle>
                    <CardDescription>
                        {(todo.content && todo.content.length > 100
                            ? todo.content.slice(0, 100) + "..."
                            : todo.content) || t("todo.emptyContent")}
                    </CardDescription>
                </div>
            </CardHeader>

            {showDetailInfo && (todo.dueDate || todo.location || (todo.tags?.length ?? 0) > 0 || (todo.attachments?.length ?? 0) > 0) && (
                <CardFooter className="text-sm">
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-4">
                            {/* 截止日期 */}
                            {todo.dueDate && (
                                <span className="flex items-center gap-1">
                                    <Icon name="calendar-time" w="14px" h="14px" />
                                    {t('todo.dueDateReminderSentence', { date: new Date(todo.dueDate).toLocaleString() })}
                                </span>
                            )}
                            {/* 位置 */}
                            {todo.location && (
                                <span className="flex items-center gap-1">
                                    <Icon name="map-pin" w="14px" h="14px" />
                                    {todo.location}
                                </span>
                            )}
                        </div>
                        {/* 标签 */}
                        {(todo.tags?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                {(todo.tags ?? []).map(tag => (
                                    <Badge key={tag} variant="secondary">
                                        # {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {/* 附件 */}
                        {(todo.attachments?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                                <span className="flex items-center gap-1">
                                    <Icon name="link" w="14px" h="14px" />
                                    {t('todo.addedAttachments', { num: todo.attachments?.length })}
                                </span>
                            </div>
                        )}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}

export default TodoCard