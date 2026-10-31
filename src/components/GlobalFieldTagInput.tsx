import { useMemo, useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "./ui/combobox";

export type TagInputOption = {
    label: string;
    value: string;
};

interface GlobalFieldTagInputProps {
    id?: string;
    label?: string;
    description?: string;
    options: TagInputOption[];
    value: string[];
    onChange: (value: string[]) => void;
}

export default function GlobalFieldTagInput({
    id,
    label,
    description,
    options,
    value,
    onChange,
}: GlobalFieldTagInputProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const availableOptions = useMemo(
        () => options.filter((option) => !value.includes(option.value)),
        [options, value]
    );

    function addOption() {
        if (!selectedOption || value.includes(selectedOption)) {
            return;
        }

        onChange([...value, selectedOption]);
        setSelectedOption(null);
    }

    function removeOption(optionValue: string) {
        onChange(value.filter((item) => item !== optionValue));
    }

    return (
        <Field>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

            <div className="flex items-end gap-2">
                <Combobox
                    value={selectedOption}
                    onValueChange={(nextValue) => setSelectedOption(nextValue)}
                    itemToStringLabel={(optionValue) =>
                        options.find((option) => option.value === optionValue)?.label ?? optionValue
                    }
                >
                    <ComboboxInput
                        id={id}
                        className="flex-1"
                        placeholder="Selecione um dia"
                        disabled={availableOptions.length === 0}
                        showClear
                    />
                    <ComboboxContent>
                        <ComboboxList>
                            {availableOptions.map((option) => (
                                <ComboboxItem key={option.value} value={option.value}>
                                    {option.label}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>

                <Button
                    type="button"
                    size="icon"
                    aria-label="Adicionar dia"
                    onClick={addOption}
                    disabled={!selectedOption}
                >
                    <PlusIcon />
                </Button>
            </div>

            {value.length > 0 && (
                <Card size="sm" className="mt-3">
                    <CardContent className="flex flex-col gap-2">
                        {value.map((optionValue) => {
                            const option = options.find((item) => item.value === optionValue);

                            return (
                                <div
                                    key={optionValue}
                                    className="flex items-center justify-between rounded-2xl bg-muted/50 px-3 py-2"
                                >
                                    <span>{option?.label ?? optionValue}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        aria-label={`Remover ${option?.label ?? optionValue}`}
                                        onClick={() => removeOption(optionValue)}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {description ? <FieldDescription>{description}</FieldDescription> : null}
        </Field>
    );
}
