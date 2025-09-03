"use client";
import { z } from "zod/v4";
import { authClient } from "~/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string(),
  rememeberMe: z.boolean().default(false),
});

export default function SignupPage() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const res = await authClient.signUp.email(data);
        if (res.error != null) {
            form.setError("root", { message: res.error.message });
            return;
        }
        router.push("/");
    };
    return <Form {...form}>
        <form className="max-w-7xl mx-auto p-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Username
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
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Name
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
            <Button type="submit">Sign Up</Button>
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        </form>
    </Form>;
}