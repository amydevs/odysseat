"use client";
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

const formSchema = z.object({
  email: z.email(),
});

export default function ForgotPassword() {
  const form = useForm({resolver: zodResolver(formSchema),});
  const onSubmit = async (d: z.infer<typeof formSchema>) => {
    await authClient.requestPasswordReset({
      email: d.email,
      redirectTo: window.location.origin + "/resetPassword",
    });
    alert("hi!");
  }

  return (
    <main className="h-screen-minus-navbar flex items-center justify-center">
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
          <Button type="submit">Send Email</Button>
        </form>
      </Form>
    </main>
  );
}