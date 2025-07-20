"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function isValidDate(date: Date | undefined) {
    return !!date && !isNaN(date.getTime())
}

export interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    className?: string
}

// 日期选择器
const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    ({ value: initialValue, onChange, placeholder, className }, ref) => {
        const [open, setOpen] = React.useState(false)
        const [date, setDate] = React.useState<Date | undefined>(initialValue)
        const [month, setMonth] = React.useState<Date | undefined>(initialValue)
        const [inputValue, setInputValue] = React.useState(
            initialValue ? format(initialValue, "yyyy-MM-dd HH:mm:ss") : ""
        )

        const [hours, setHours] = React.useState(initialValue?.getHours() ?? 0)
        const [minutes, setMinutes] = React.useState(initialValue?.getMinutes() ?? 0)
        const [seconds, setSeconds] = React.useState(initialValue?.getSeconds() ?? 0)

        const currentYear = new Date().getFullYear()

        const updateDateWithTime = (baseDate: Date | undefined) => {
            if (!baseDate) return undefined
            const newDate = new Date(baseDate)
            newDate.setHours(hours)
            newDate.setMinutes(minutes)
            newDate.setSeconds(seconds)
            return newDate
        }

        const handleSelect = (newDate: Date | undefined) => {
            const dateWithTime = updateDateWithTime(newDate)
            setDate(newDate)
            setInputValue(
                dateWithTime ? format(dateWithTime, "yyyy-MM-dd HH:mm:ss") : ""
            )
            setOpen(false)
            onChange?.(dateWithTime)
        }

        // 更新显示内容（只要时间变就更新）
        React.useEffect(() => {
            if (date) {
                const newDate = updateDateWithTime(date)
                setInputValue(format(newDate!, "yyyy-MM-dd HH:mm:ss"))
                onChange?.(newDate)
            }
        }, [hours, minutes, seconds])

        return (
            <div className={cn("relative flex flex-col gap-2", className)}>
                <div className="relative">
                    <Input
                        ref={ref}
                        value={inputValue}
                        placeholder={placeholder || "Select a date"}
                        className="bg-background pr-10"
                        onChange={(e) => {
                            const newValue = e.target.value
                            const parsedDate = new Date(newValue)
                            setInputValue(newValue)
                            if (isValidDate(parsedDate)) {
                                setDate(parsedDate)
                                setMonth(parsedDate)
                                setHours(parsedDate.getHours())
                                setMinutes(parsedDate.getMinutes())
                                setSeconds(parsedDate.getSeconds())
                                onChange?.(parsedDate)
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                                e.preventDefault()
                                setOpen(true)
                            }
                        }}
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            >
                                <CalendarIcon className="size-4" />
                                <span className="sr-only">Select date</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto overflow-hidden p-4"
                            align="end"
                            alignOffset={-8}
                            sideOffset={10}
                        >
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                month={month}
                                onMonthChange={setMonth}
                                onSelect={handleSelect}
                                fromYear={currentYear}
                                toYear={currentYear + 100}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />

                            <div className="mt-4 flex items-center gap-2">
                                {/* 小时 */}
                                <Select value={hours.toString()} onValueChange={(val) => setHours(Number(val))}>
                                    <SelectTrigger className="w-full flex-1 text-center">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground">:</span>
                                {/* 分钟 */}
                                <Select value={minutes.toString()} onValueChange={(val) => setMinutes(Number(val))}>
                                    <SelectTrigger className="w-full flex-1 text-center">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground">:</span>
                                {/* 秒钟 */}
                                <Select value={seconds.toString()} onValueChange={(val) => setSeconds(Number(val))}>
                                    <SelectTrigger className="w-full flex-1 text-center">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 60 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i.toString().padStart(2, "0")}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        )
    }
)

DatePicker.displayName = "DatePicker"
export default DatePicker