import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import type { InputHTMLAttributes } from "react";

interface GlobalFieldInput extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    description?: string
}

export default function GlobalFieldInput({ label, description, ...props }: GlobalFieldInput) {

    return (
        <Field>
            {label ? <FieldLabel htmlFor={label}>{label}</FieldLabel> : null}
            <Input {...props} />
            {description ?
                <FieldDescription>
                    {description}
                </FieldDescription> : null}
        </Field>
    )
}