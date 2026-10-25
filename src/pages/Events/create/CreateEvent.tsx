import GlobalFieldInput from "@/components/GlobalFieldInput";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import HomeLayout from "@/layouts/HomeLayout";
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DatePicker from "@/components/DatePicker";
import GlobalFieldTextArea from "@/components/GlobalFieldTextArea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { EventService } from "@/api/services/events/event.service";
import { queryClient } from "@/config/QueryClient";
import { useNavigate } from "react-router-dom";

const CreateEventSchema = z.object({
    title: z.string({ message: "O Titulo do Evento é Obrigatorio " }),
    description: z.string().optional(),
    startDate: z.date({ message: "Data de Inicio do evento é obrigatorio" }),
    endDate: z.date({ message: "Data de Final do evento é obrigatorio" })
}).refine((data) => data.endDate >= data.startDate, {
    message: "A data de término deve ser posterior à data de início",
    path: ["endDate"],
});


type CreateEventFormData = z.infer<typeof CreateEventSchema>

export default function CreateEvent() {

    const { handleSubmit, register, formState: { isSubmitting, errors }, control } = useForm<CreateEventFormData>({
        resolver: zodResolver(CreateEventSchema)
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

    async function SubmitForm(data: CreateEventFormData) {
        await CreateEventMutation.mutateAsync({
            title: data.title,
            description: data.description,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString()
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