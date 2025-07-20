import { Slider } from "@/components/ui/slider"
import { useTranslation } from "react-i18next"

// 优先级选择器
function PrioritySelect({
    value,
    onChange,
}: {
    value?: number
    onChange: (value?: number) => void
}) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t('todo.priorityMin')}
                </span>
                <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={value ? [value] : [3]}
                    onValueChange={(val) => onChange(val[0])}
                    className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t('todo.priorityMax')}
                </span>
            </div>
        </div>
    )
}

export default PrioritySelect
