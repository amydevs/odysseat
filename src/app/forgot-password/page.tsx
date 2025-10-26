"use client";
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
import RootFormMessage from "~/components/form/root-form-message";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.email(),
});

export default function ForgotPassword() {
  const searchParams = useSearchParams();
  const form = useForm({ schema: formSchema, defaultValues: { email: searchParams.get("email") } });
  const onSubmit = async (d: z.infer<typeof formSchema>) => {
    const { error } = await authClient.requestPasswordReset({
      email: d.email,
      redirectTo: "/reset-password",
    });
    if (error) {
      form.setError("root", { message: error.message });
      return;
    }
    alert("A password reset email has been sent");
  };

  return (
    <main className="h-screen-minus-navbar flex items-center justify-center">
      <Form {...form}>
        <form
          className="relative mx-auto max-w-xs w-full"
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
          <div>
            <RootFormMessage />
          </div>
          <Button type="submit">Send Email</Button>
        </form>
      </Form>
    </main>
  );
}
