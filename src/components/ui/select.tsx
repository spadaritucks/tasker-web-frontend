import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "cn"

const Select = SelectPrimitive.Root

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
    return (
        <SelectPrimitive.Trigger
            className={cn(
                "flex h-9 w-full items-center justify-between rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon render={<ChevronDownIcon className="size-4 opacity-50" />} />
        </SelectPrimitive.Trigger>
    )
}

function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
    return <SelectPrimitive.Value {...props} />
}

function SelectContent({ className, children, ...props }: SelectPrimitive.Popup.Props) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Positioner sideOffset={6} className="z-50 outline-none">
                <SelectPrimitive.Popup
                    className={cn(
                        "min-w-(--anchor-width) overflow-hidden rounded-3xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/5",
                        className
                    )}
                    {...props}
                >
                    {children}
                </SelectPrimitive.Popup>
            </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
    )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
    return (
        <SelectPrimitive.Item
            className={cn(
                "relative flex w-full cursor-default items-center rounded-2xl py-2 pr-8 pl-3 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            <SelectPrimitive.ItemIndicator className="absolute right-2">
                <CheckIcon className="size-4" />
            </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
    )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
