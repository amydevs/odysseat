import { useFormContext } from "react-hook-form"
import { cn } from "~/lib/utils";

export default function RootFormMessage({ children, className, ...props }: React.ComponentProps<"p">) {
    const form = useFormContext();
    return <p
        className={cn("text-[0.8rem] font-medium text-destructive", className)}
        {...props}
    >
        {children ?? form.formState.errors.root?.message}
    </p>
}