import { Field, FieldDescription, FieldLabel } from "./ui/field";
import type { TextareaHTMLAttributes } from "react";
import { Textarea } from "./ui/textarea";

interface GlobalFieldTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    description?: string
}

export default function GlobalFieldTextArea({ label, description, ...props }: GlobalFieldTextAreaProps) {

    return (
        <Field>
            {label ? <FieldLabel htmlFor={label}>{label}</FieldLabel> : null}
            <Textarea {...props} />
            {description ?
                <FieldDescription>
                    {description}
                </FieldDescription> : null}
        </Field>
    )
}