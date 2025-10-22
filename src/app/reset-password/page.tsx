"use client";
import Link from "next/link";
import { z } from "zod/v4";
import { authClient } from "~/auth/client";
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
import { useSearchParams } from "next/navigation";
import RootFormMessage from "~/components/form/root-form-message";

const formSchema = z.object({
  password: z.string(),
});

export default function ResetPassword() {
  const form = useForm({ schema: formSchema });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (!token) {
    return (<h1>umm no token idk</h1>);
  }
  const onSubmit = async (d: z.infer<typeof formSchema>) => {
    try {
      const { data , error } = await authClient.resetPassword({
        newPassword: d.password,
        token,
      });
      if (error) {
        console.log("Failed to reset password: ", error);
      }
      else {
        alert("Your password has been changed successfully!");
      }
    }
    catch (error) {
      console.log("Error: ", error);
    }
    
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="pl-1">New password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Reset Password</Button>
          <RootFormMessage />
        </form>
      </Form>
    </main>
  );
}