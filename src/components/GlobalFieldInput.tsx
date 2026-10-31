import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import type { InputHTMLAttributes } from "react";

interface GlobalFieldInput extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    description?: string
    error? : string
}

export default function GlobalFieldInput({ label, description, error, ...props }: GlobalFieldInput) {

    return (
        <Field>
            {label ? <FieldLabel htmlFor={label}>{label}</FieldLabel> : null}
            <Input {...props} />
            {description ?
                <FieldDescription>
                    {description}
                </FieldDescription> : null}
                {error ? <FieldError>{error}</FieldError> : null}
        </Field>
    )
}