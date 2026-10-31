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
    endDate: z.date({ message: "Data de Final do evento é obrigatorio" }),
    recurrenceFrequency: z.number().int().min(0).max(3).optional(),
    recurrenceInterval: z.number().int().min(1).optional(),
    daysOfWeek: z.array(z.string()).optional(),
    recurrenceCount: z.number().int().positive().optional(),
    recurrenceUntil: z.date().optional(),
}).refine((data) => data.endDate >= data.startDate, {
    message: "A data de término deve ser posterior à data de início",
    path: ["endDate"],
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

    async function SubmitForm(data: CreateEventFormData) {
        await CreateEventMutation.mutateAsync({
            title: data.title,
            description: data.description,
            eventType: data.eventType as EventType,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
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
                                {...register("title")}
                            />
                            <GlobalFieldTextArea
                                label="Descrição do Evento"
                                placeholder="Aula de Ingles com a professora Maria Beatriz da D-Fluency as 08h00"
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
                                        label="Quantidade de ocorrências"
                                        {...register("recurrenceCount", { valueAsNumber: true })}
                                    />
                                </div>
                            )}
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        id="event-start-date"
                                        label="Data de início"
                                        onChange={field.onChange}
                                        value={field.value}
                                        description={errors.startDate?.message}
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
                                        onChange={field.onChange}
                                        value={field.value}
                                    />
                                )}
                            />


                        </FieldSet>
                    </FieldGroup>
                    <Button className="mt-4" type="submit" disabled={isSubmitting}>Finalizar</Button>
                </form>
            </section>
        </HomeLayout>
    )
}
