import { useState } from "react"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Icon from "@/components/Icon"
import type { TodoItem } from "@/utils/TodoStorage"
import { useTranslation } from "react-i18next"


interface TodoCardProps {
    todo: TodoItem;
    onComplete?: (id: string) => void;
}

// 待办事项卡片
function TodoCard({ todo, onComplete }: TodoCardProps) {
    const { t } = useTranslation();

    const [showDetailInfo, setShowDetailInfo] = useState(false);   // 是否显示详细信息
    const handleComplete = () => {
        if (onComplete) onComplete(todo.id);
    };

    return (
        <Card>
            <CardHeader
                onClick={e => {
                    if ((e.target as HTMLElement).closest("button")) return;   // 防止点击按钮的时候也触发显示详细
                    setShowDetailInfo(!showDetailInfo);
                }}
            >
                <CardTitle>
                    {todo.title}
                </CardTitle>
                <CardDescription>
                    {todo.content || t('todo.emptyContent')}
                </CardDescription>
                <CardAction>
                    <Button
                        variant="link"
                        size="sm"
                        onClick={handleComplete}
                        disabled={!!todo.completedAt}
                    >
                        {t('todo.viewDetails')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleComplete}
                        disabled={!!todo.completedAt}
                    >
                        {todo.completedAt ? t('todo.status.done') : t('todo.markAsDone')}
                    </Button>
                </CardAction>
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