import type { ReactNode } from "react";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface GlobalFieldSelectOption {
    value: string;
    label: ReactNode;
}

interface GlobalFieldSelectProps {
    label?: string;
    description?: string;
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    disabled?: boolean;
    onValueChange?: (value: string | null) => void;
    onBlur?: () => void;
    options: GlobalFieldSelectOption[];
}

export default function GlobalFieldSelect({
    label,
    description,
    id,
    name,
    value,
    defaultValue,
    placeholder = "Selecione uma opção",
    disabled,
    onValueChange,
    onBlur,
    options,
}: GlobalFieldSelectProps) {
    const selectedOption = options.find((option) => option.value === value);

    return (
        <Field>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
            <Select
                name={name}
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger id={id} onBlur={onBlur}>
                    <SelectValue placeholder={placeholder}>
                        {selectedOption?.label ?? placeholder}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {description ? <FieldDescription>{description}</FieldDescription> : null}
        </Field>
    );
}
