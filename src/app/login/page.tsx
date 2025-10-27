"use client";
import Link from "next/link";

import { z } from "zod/v4";
import { authClient } from "~/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { useRouter } from "next/navigation";
import RootFormMessage from "~/components/form/root-form-message";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
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
      <Form {...form}>
        <form
          className="relative mx-auto w-full max-w-xs"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-1">Email</FormLabel>
                <FormControl>
                  <Input placeholder="jane.doe@gmail.com" {...field} />
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
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
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
          <div className="mx-1 mb-2">
            <Link
              href={`/forgot-password?email=${form.watch("email")}`}
              className="text-sm underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button type="submit">Log In</Button>
          <RootFormMessage />
        </form>
      </Form>
    </main>
  );
}
