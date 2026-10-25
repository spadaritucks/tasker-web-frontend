import { useState } from "react";
import { EventService } from "@/api/services/events/event.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialForm = {
    title: "",
    description: "",
    startDate: "",
    endDate: ""
};

export default function EventCreateForm() {
    const [form, setForm] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    function updateField(field: keyof typeof initialForm, value: string) {
        setForm((current) => ({ ...current, [field]: value }));
        setMessage(null);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);

        if (!form.title.trim() || !form.startDate || !form.endDate) {
            setMessage("Preencha título, início e término do evento.");
            return;
        }

        if (form.endDate <= form.startDate) {
            setMessage("O término deve ser posterior ao início.");
            return;
        }

        setIsSubmitting(true);

        try {
            await EventService.CreateEvent({
                title: form.title.trim(),
                description: form.description.trim() || undefined,
                startDate: form.startDate,
                endDate: form.endDate
            });

            setForm(initialForm);
            setMessage("Evento criado com sucesso.");
        } catch (error) {
            setMessage(error instanceof Error
                ? error.message
                : "Não foi possível criar o evento.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Novo evento</CardTitle>
                <CardDescription>
                    Crie um evento no Tasker e sincronize com o Google Calendar quando conectado.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="event-title">Título</Label>
                        <Input
                            id="event-title"
                            value={form.title}
                            onChange={(event) => updateField("title", event.target.value)}
                            placeholder="Ex.: Reunião de planejamento"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="event-description">Descrição</Label>
                        <Textarea
                            id="event-description"
                            value={form.description}
                            onChange={(event) => updateField("description", event.target.value)}
                            placeholder="Detalhes do evento"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="event-start">Início</Label>
                            <Input
                                id="event-start"
                                type="datetime-local"
                                value={form.startDate}
                                onChange={(event) => updateField("startDate", event.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="event-end">Término</Label>
                            <Input
                                id="event-end"
                                type="datetime-local"
                                value={form.endDate}
                                onChange={(event) => updateField("endDate", event.target.value)}
                            />
                        </div>
                    </div>

                    {message && (
                        <p className="text-sm text-muted-foreground" role="status">
                            {message}
                        </p>
                    )}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Criar evento"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
