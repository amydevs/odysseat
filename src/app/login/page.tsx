"use client";
import Link from "next/link";

import { z } from "zod/v4";
import { authClient } from "~/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { useRouter } from "next/navigation";
import RootFormMessage from "~/components/form/root-form-message";
import { useEffect } from "react";
import Head from "next/head";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememeberMe: z.boolean().default(false),
});

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
  useEffect(() => {
  document.title = "Log In";
}, []);
  return (
    <main className="h-screen-minus-navbar flex items-center justify-center">
      <Button className={"absolute top-1 right-1 bg-red-600"} asChild>
        <Link href={"/"}>x</Link>
      </Button>
      <Form {...form}>
        <form
          className="relative mx-auto max-w-7xl"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-1">Email</FormLabel>
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
                <FormLabel className="pl-1">Password</FormLabel>
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
              <FormItem className="flex w-full justify-between p-2 pl-1">
                <FormLabel>Remember Me</FormLabel>
                <FormControl>
                  <Checkbox
                    onCheckedChange={onChange}
                    value={`${value}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Log In</Button>
          <RootFormMessage />
        </form>
      </Form>
    </main>
  );
}
