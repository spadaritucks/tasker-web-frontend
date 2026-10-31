import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { CaretLeft, CaretRight } from "phosphor-react";
import dayjs from 'dayjs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/api/services/events/event.service";
import { GetWeekDays } from "@/utils/GetWeekDays";


interface CalendarWeek {
    week: number
    days: Array<{
        date: dayjs.Dayjs
        disabled: boolean
        blocked: boolean
    }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
    selectedDate?: Date | null,
    onDateSelected: (date: Date) => void,
    disableBlockedDates?: boolean,
}


export default function CalendarComponent({
    selectedDate,
    onDateSelected,
    disableBlockedDates = false,
}: CalendarProps) {

    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set('date', 1)
    })

    const shortWeekDay = GetWeekDays({
        short: true,
        year: currentDate.year(),
        month: currentDate.month(),
    })

    function handlePreviousMonth() {
        const previousMonthDate = currentDate.subtract(1, 'month')
        setCurrentDate(previousMonthDate)
    }

    function handleNextMonth() {
        const nextMonthDate = currentDate.add(1, 'month')
        setCurrentDate(nextMonthDate)
    }

    const currentMonth = currentDate.format('MMMM')
    const currentYear = currentDate.format('YYYY')
    const currentMonthNumber = currentDate.month() + 1

    const { data: blockedDates = [], isLoading: isLoadingBlockedDates } = useQuery<string[]>({
        queryKey: ['blocked-dates', currentDate.year(), currentMonthNumber],
        queryFn: async () => {
            const response = await EventService.GetBlockedDates(
                currentDate.year(),
                currentMonthNumber,
            )

            return response.data ?? []
        },
        retry: 3,
    })

    const calendarWeeks = useMemo(() => {

        const daysInMonthArray = Array.from({ length: currentDate.daysInMonth(), }).map((_, i) => {
            return currentDate.set('date', i + 1)
        })

        const firstWeekDay = currentDate.get('day')

        const previousMonthFillArray = Array.from({
            length: firstWeekDay
        }).map((_, i) => {
            return currentDate.subtract(i + 1, 'day')
        }).reverse()

        const lastDayInCurrentMonth = currentDate.set('date', currentDate.daysInMonth())
        const lastWeekDay = lastDayInCurrentMonth.get('day')

        const nextMonthFillArray = Array.from({
            length: 7 - (lastWeekDay + 1),
        }).map((_, i) => {
            return lastDayInCurrentMonth.add(i + 1, 'day')
        })

        const calendarDays = [
            ...previousMonthFillArray.map(date => {
                return { date, disabled: true, blocked: false }
            }),
            ...daysInMonthArray.map(date => {
                const blocked = blockedDates.includes(date.format('YYYY-MM-DD'))

                return {
                    date,
                    blocked,
                    disabled:
                        date.endOf('day').isBefore(dayjs()) ||
                        (disableBlockedDates && blocked)

                }
            }),
            ...nextMonthFillArray.map(date => {
                return { date, disabled: true, blocked: false }
            }),
        ]

        const calendarWeeks = calendarDays.reduce<CalendarWeeks>((weeks, _, i, original) => {
            const isNewWeek = i % 7 === 0
            if (isNewWeek) {
                weeks.push(
                    {
                        week: i / 7 + 1,
                        days: original.slice(i, i + 7),
                    }
                )
            }

            return weeks
        }, [],)

        return calendarWeeks
    }, [currentDate, blockedDates])

    return (
        <div className="flex flex-col gap-1.5 p-2">
            <div className="flex items-center justify-between">
                <h2 className="font-medium capitalize">
                    {currentMonth} <span className="text-muted-foreground">{currentYear}</span>
                </h2>
                <div className="flex bg-gray-200">
                    <Button className="cursor-pointer rounded-sm" onClick={handlePreviousMonth} title="Previous month">
                        <CaretLeft />
                    </Button>
                    <Button className="cursor-pointer rounded-sm" onClick={handleNextMonth} title="Next Month">
                        <CaretRight />
                    </Button>
                </div>
            </div>
            <Table className="w-full table-fixed">
                <TableHeader>
                    <TableRow className="text-sm font-medium text-muted-foreground">
                        {shortWeekDay.map((weekDay) => (
                            <TableHead key={weekDay} className="p-2 text-center">
                                {weekDay}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoadingBlockedDates ? (
                        <TableRow>
                            <td colSpan={7} className="p-6 text-center text-sm text-muted-foreground">
                                Carregando calendário...
                            </td>
                        </TableRow>
                    ) : (
                        calendarWeeks.map(({ week, days }) => (
                            <TableRow key={week}>
                                {days.map(({ date, disabled, blocked }) => {
                                    const isSelected = selectedDate
                                        ? dayjs(selectedDate).isSame(date, 'day')
                                        : false

                                    return (
                                        <td key={date.format('YYYY-MM-DD')} className="p-1 text-center">
                                            <Button
                                                type="button"
                                                variant={isSelected ? "default" : "ghost"}
                                                className={`h-10 w-full rounded-md ${blocked && !isSelected ? "bg-primary/10" : ""}`}
                                                onClick={() => onDateSelected(date.toDate())}
                                                disabled={disabled}
                                            >
                                                {date.date()}
                                            </Button>
                                        </td>
                                    )
                                })}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
