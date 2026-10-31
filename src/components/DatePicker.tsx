"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "cn"


export interface DatePickerProps {
    id?: string
    label?: string
    description?: string
    placeholder?: string
    value?: string | Date | undefined
    onChange?: (date: Date | undefined) => void
    disabled?: boolean
    className?: string
    error?: string
}

export default function DatePicker({
    id = "date-picker",
    label = "Data",
    description,
    placeholder = "Selecione uma data",
    value,
    onChange,
    error,
    disabled = false,
    className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const dateValue = typeof value === "string" ? new Date(value) : value

    return (
        <Field>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    disabled={disabled}
                    render={
                        <Button
                            variant="outline"
                            id={id}
                            className={cn("w-full justify-between font-normal", className)}
                        >
                            {dateValue ? format(dateValue, "PPP") : placeholder}
                            <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                    }
                />
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        captionLayout="dropdown"
                        defaultMonth={dateValue}
                        onSelect={(date) => {
                            onChange?.(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            {error ? <FieldError>{error}</FieldError> : null}
        </Field>
    )
}
