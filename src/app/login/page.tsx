"use client";
import Link from "next/link";

import { z } from "zod/v4";
import { authClient } from "~/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememeberMe: z.boolean().default(false),
})

export default function LoginPage() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const res = await authClient.signIn.email(data);
        if (res.error != null) {
            form.setError("root", { message: res.error.message });
            return;
        }
        router.push("/");
        router.refresh();
    };
    return ( 
        <main className="max-w-full flex justify-center items-center h-screen-minus-navbar">
            <Button className={"bg-red-600 absolute top-1 right-1"} asChild>
                <Link href={"/"}>x</Link>
            </Button>
            <Form {...form}>
            <form className="max-w-7xl relative mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
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
                                Remember Me
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
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
            </form>
            </Form>
        </main>
    );
}