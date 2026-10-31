import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import type { TextareaHTMLAttributes } from "react";
import { Textarea } from "./ui/textarea";

interface GlobalFieldTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    description?: string
    error?: string
}

export default function GlobalFieldTextArea({ label, description, error, ...props }: GlobalFieldTextAreaProps) {

    return (
        <Field>
            {label ? <FieldLabel htmlFor={label}>{label}</FieldLabel> : null}
            <Textarea {...props} />
            {description ?
                <FieldDescription>
                    {description}
                </FieldDescription> : null}
                  {error ? <FieldError>{error}</FieldError> : null}
        </Field>
    )
}