"use client";
import { z } from "zod/v4";
import { authClient } from "~/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememeberMe: z.boolean().default(false),
})

export default function LoginPage() {
    const form = useForm({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const res = await authClient.signIn.email(data);
    };
    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Email
                    </FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Password
                    </FormLabel>
                    <FormControl>
                        <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rememeberMe"
                render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                    <FormLabel>
                        Password
                    </FormLabel>
                    <FormControl>
                        <Checkbox onCheckedChange={onChange} value={`${value}`} {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit">Log In</Button>
        </form>
    </Form>;
}