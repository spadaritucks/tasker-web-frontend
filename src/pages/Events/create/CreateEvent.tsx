import GlobalFieldInput from "@/components/GlobalFieldInput";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import HomeLayout from "@/layouts/HomeLayout";
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DatePicker from "@/components/DatePicker";
import GlobalFieldTextArea from "@/components/GlobalFieldTextArea";
import GlobalFieldSelect from "@/components/GlobalFieldSelect";
import GlobalFieldTagInput from "@/components/GlobalFieldTagInput";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { EventService } from "@/api/services/events/event.service";
import { queryClient } from "@/config/QueryClient";
import { useNavigate } from "react-router-dom";
import { EventType } from "@/enums/EventType";
import { RecurrenceFrequency } from "@/enums/RecurrenceFrequency";


const CreateEventSchema = z.object({
    title: z.string().min(1, "O título do evento é obrigatório"),
    description: z.string().optional(),
    eventType: z.number().int().min(0).max(3),
    startDate: z.date({ message: "Data de Inicio do evento é obrigatorio" }),
    endDate: z.date().optional(),
    startHour: z.string().optional(),
    endHour: z.string().optional(),
    recurrenceFrequency: z.number().int().min(0).max(3).optional(),
    recurrenceInterval: z.number().int().min(1).optional(),
    daysOfWeek: z.array(z.string()).optional(),
    recurrenceCount: z.number().int().positive().optional(),
    recurrenceUntil: z.date().optional(),
}).superRefine((data, context) => {
    const hasTime =
        data.eventType === EventType.Timed ||
        data.eventType === EventType.Recurring;

    if (hasTime) {
        if (!data.startHour) {
            context.addIssue({
                code: "custom",
                message: "O horário de início é obrigatório",
                path: ["startHour"],
            });
        }

        if (!data.endHour) {
            context.addIssue({
                code: "custom",
                message: "O horário de término é obrigatório",
                path: ["endHour"],
            });
        }

        if (data.startHour && data.endHour && data.endHour <= data.startHour) {
            context.addIssue({
                code: "custom",
                message: "O horário de término deve ser posterior ao horário de início",
                path: ["endHour"],
            });
        }

        return;
    }

    if (!data.endDate) {
        context.addIssue({
            code: "custom",
            message: "A data de término é obrigatória",
            path: ["endDate"],
        });
        return;
    }

    if (data.endDate < data.startDate) {
        context.addIssue({
            code: "custom",
            message: "A data de término deve ser posterior ou igual à data de início",
            path: ["endDate"],
        });
    }
});


type CreateEventFormData = z.infer<typeof CreateEventSchema>

export default function CreateEvent() {

    const { handleSubmit, register, formState: { isSubmitting, errors }, control, watch } = useForm<CreateEventFormData>({
        resolver: zodResolver(CreateEventSchema),
        defaultValues: {
            eventType: EventType.Timed,
            recurrenceFrequency: RecurrenceFrequency.Weekly,
            recurrenceInterval: 1,
        },
    })

    const Navigate = useNavigate()

    const CreateEventMutation = useMutation({
        mutationFn: EventService.CreateEvent,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["events", "list"],
            })
            Navigate("/events", { replace: true })
        }
    })

    const selectedEventType = watch("eventType")

    function CombinateDateAndTime(date: Date, time: string) {
        const [hours, minutes] = time.split(":").map(Number);
        const result = new Date(date)
        result.setHours(hours, minutes, 0, 0)
        return result

    }

    async function SubmitForm(data: CreateEventFormData) {

        const hasTime =
            data.eventType === EventType.Timed ||
            data.eventType === EventType.Recurring;

        const startDate = hasTime && data.startHour
            ? CombinateDateAndTime(data.startDate, data.startHour)
            : data.startDate;
        const endDate = hasTime && data.endHour
            ? CombinateDateAndTime(data.startDate, data.endHour)
            : data.endDate!;

        await CreateEventMutation.mutateAsync({
            title: data.title,
            description: data.description,
            eventType: data.eventType as EventType,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            recurrency: data.eventType === EventType.Recurring
                ? {
                    frequency: (data.recurrenceFrequency ?? RecurrenceFrequency.Weekly) as RecurrenceFrequency,
                    interval: data.recurrenceInterval ?? 1,
                    daysOfWeek: data.daysOfWeek,
                    count: data.recurrenceCount,
                    until: data.recurrenceUntil?.toISOString(),
                }
                : undefined,
        })
    }


    return (
        <HomeLayout>
            <section className="w-full h-full flex flex-col items-start justify-start">
                <div className="w-full flex items-center justify-between p-4">
                    <div className="flex flex-col items-start justify-center">
                        <h2 className="text-2xl font-bold">Criar Tarefa</h2>
                        <p className="text-gray-400">Crie sua tarefa</p>
                    </div>
                </div>
                <form className="w-full flex flex-col items-center px-8" onSubmit={handleSubmit(SubmitForm)}>
                    <FieldGroup className="w-full">
                        <FieldSet className="grid grid-cols-2">
                            <GlobalFieldInput
                                label="Titulo do Evento"
                                placeholder="Aula de Ingles"
                                error={errors && errors.title ? errors.title.message : undefined}
                                {...register("title")}
                            />
                            <GlobalFieldTextArea
                                label="Descrição do Evento"
                                placeholder="Aula de Ingles com a professora Maria Beatriz da D-Fluency as 08h00"
                                error={errors && errors.description ? errors.description.message : undefined}
                                {...register("description")}
                            />
                            <Controller
                                name="eventType"
                                control={control}
                                render={({ field }) => (
                                    <GlobalFieldSelect
                                        id="event-type"
                                        name={field.name}
                                        label="Tipo do evento"
                                        error={errors && errors.eventType ? errors.eventType.message : undefined}
                                        value={String(field.value)}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        onBlur={field.onBlur}
                                        options={[
                                            { value: String(EventType.Timed), label: "Com horário" },
                                            { value: String(EventType.AllDay), label: "Dia inteiro" },
                                            { value: String(EventType.Range), label: "Período" },
                                            { value: String(EventType.Recurring), label: "Recorrente" },
                                        ]}
                                    />
                                )}
                            />
                            {selectedEventType === EventType.Recurring && (
                                <div className="col-span-2 grid gap-4 rounded-3xl border p-4 sm:grid-cols-2">
                                    <Controller
                                        name="recurrenceFrequency"
                                        control={control}
                                        render={({ field }) => (
                                            <GlobalFieldSelect
                                                id="recurrence-frequency"
                                                name={field.name}
                                                error={errors && errors.recurrenceFrequency ? errors.recurrenceFrequency.message : undefined}
                                                label="Frequência"
                                                value={String(field.value)}
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                onBlur={field.onBlur}
                                                options={[
                                                    { value: String(RecurrenceFrequency.Daily), label: "Diária" },
                                                    { value: String(RecurrenceFrequency.Weekly), label: "Semanal" },
                                                    { value: String(RecurrenceFrequency.Monthly), label: "Mensal" },
                                                    { value: String(RecurrenceFrequency.Yearly), label: "Anual" },
                                                ]}
                                            />
                                        )}
                                    />
                                    <GlobalFieldInput
                                        id="recurrence-interval"
                                        type="number"
                                        min={1}
                                        error={errors && errors.recurrenceInterval ? errors.recurrenceInterval.message : undefined}
                                        label="A cada quantos períodos?"
                                        {...register("recurrenceInterval", { valueAsNumber: true })}
                                    />
                                    <div className="sm:col-span-2">
                                        <Controller
                                            name="daysOfWeek"
                                            control={control}
                                            render={({ field }) => (
                                                <GlobalFieldTagInput
                                                    id="days-of-week"
                                                    label="Dias da semana"
                                                    error={errors && errors.daysOfWeek ? errors.daysOfWeek.message : undefined}
                                                    options={[
                                                        { label: "Segunda-feira", value: "MO" },
                                                        { label: "Terça-feira", value: "TU" },
                                                        { label: "Quarta-feira", value: "WE" },
                                                        { label: "Quinta-feira", value: "TH" },
                                                        { label: "Sexta-feira", value: "FR" },
                                                        { label: "Sábado", value: "SA" },
                                                        { label: "Domingo", value: "SU" },
                                                    ]}
                                                    value={field.value ?? []}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                    <GlobalFieldInput
                                        id="recurrence-count"
                                        type="number"
                                        min={1}
                                        error={errors && errors.recurrenceCount ? errors.recurrenceCount.message : undefined}
                                        label="Quantidade de ocorrências"
                                        {...register("recurrenceCount", { valueAsNumber: true })}
                                    />
                                </div>
                            )}

                            {selectedEventType && selectedEventType == EventType.Recurring ||
                                selectedEventType == EventType.Timed ?
                                (
                                    <>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    id="event-start-date"
                                                    label="Data de início"
                                                    error={errors && errors.startDate ? errors.startDate.message : undefined}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )

                                            }
                                        />
                                        <GlobalFieldInput
                                            id="event-start-hour"
                                            type="time"
                                            error={errors && errors.startHour ? errors.startHour.message : undefined}
                                            label="Inicio"
                                            {...register("startHour")}
                                        />
                                        <GlobalFieldInput
                                            id="event-end-hour"
                                            type="time"
                                            error={errors && errors.endHour ? errors.endHour.message : undefined}
                                            label="Fim"
                                            {...register("endHour")}
                                        />
                                    </>
                                )
                                :
                                (
                                    <>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    id="event-start-date"
                                                    label="Data de início"
                                                    error={errors && errors.startDate ? errors.startDate.message : undefined}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )

                                            }
                                        />
                                        <Controller
                                            name="endDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    id="event-end-date"
                                                    label="Data de término"
                                                    error={errors && errors.endDate ? errors.endDate.message : undefined}
                                                    onChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                    </>
                                )}

                        </FieldSet>
                    </FieldGroup>
                    <Button className="mt-4" type="submit" disabled={isSubmitting}>Finalizar</Button>
                </form>
            </section>
        </HomeLayout>
    )
}
