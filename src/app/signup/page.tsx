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
import { useRouter } from "next/navigation";
import RootFormMessage from "~/components/form/root-form-message";
import { Checkbox } from "~/components/ui/checkbox";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string(),
  rememberMe: z.boolean().default(false),
});

export default function SignupPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rememberMe: false
    }
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await authClient.signUp.email(data);
    if (res.error != null) {
      form.setError("root", { message: res.error.message });
      return;
    }
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    document.title = "Sign Up";
  }, []);

  return (
    <main className="h-screen-minus-navbar flex items-center justify-center">
      <Button className="absolute top-1 right-1 m-[0.5vh] bg-red-600" asChild>
        <Link href={"/"}>x</Link>
      </Button>
      <Form {...form}>
        <form
          className="mx-auto max-w-7xl p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
                <FormLabel>Name</FormLabel>
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
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Password</FormLabel>
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
            name="rememberMe"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="flex w-full justify-between p-2 pl-0">
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
          <Button type="submit">Sign Up</Button>
          <RootFormMessage />
        </form>
      </Form>
    </main>
  );
}
