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
            initialValue ? format(initialValue, "MMMM dd, yyyy") : ""
        )
        const currentYear = new Date().getFullYear()

        const handleSelect = (date: Date | undefined) => {
            setDate(date)
            setInputValue(date ? format(date, "MMMM dd, yyyy") : "")
            setOpen(false)
            onChange?.(date)
        }

        return (
            <div className={cn("relative flex gap-2", className)}>
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
                        className="w-auto overflow-hidden p-0"
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
                    </PopoverContent>
                </Popover>
            </div>
        )
    }
)

DatePicker.displayName = "DatePicker"
export default DatePicker