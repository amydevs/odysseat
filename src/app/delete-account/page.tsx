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
import { useRouter } from "next/navigation";

const formSchema = z.object({
  confirmPassword: z.string()
});

export default function DeleteAccount() {
  const router = useRouter();
  const form = useForm({ schema: formSchema, defaultValues: {confirmPassword: ""} });
  const onSubmit = async (d: z.infer<typeof formSchema>) => {
    const { error } = await authClient.deleteUser({
      password: d.confirmPassword,
    });
    if (error) {
      form.setError("root", { message: error.message });
      return;
    }
    alert("Your account has been deleted");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="h-screen-minus-navbar flex items-center justify-center">
      <Form {...form}>
        <form
          className="relative mx-auto max-w-7xl"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-1">Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <RootFormMessage />
          </div>
          <Button type="submit">Delete Account</Button>
        </form>
      </Form>
    </main>
  );
}
