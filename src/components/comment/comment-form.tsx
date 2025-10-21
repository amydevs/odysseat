"use client";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Rating, RatingButton } from '~/components/ui/shadcn-io/rating';
import { api } from "~/trpc/react";
import { useForm, Form, FormField, FormItem, FormControl, FormMessage } from "~/components/ui/form";
import { type zCommentCreate } from "~/server/db/validators";
import type * as z from "zod/v4";
import { TRPCError } from "@trpc/server";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { cn } from "~/lib/utils";
import RootFormMessage from "../form/root-form-message";

export default function CommentForm({
  className,
  disabled = false,
  ...props
}: React.ComponentProps<"form"> & { disabled?: boolean }) {
  const form = useFormContext<z.infer<typeof zCommentCreate>>();

  return (
    <form className={cn("space-y-3", className)} {...props}>
      <h2 className="text-2xl font-bold">Write a Review</h2>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                {...field}
                disabled={disabled}
                placeholder={disabled ? "Sign in to leave a review!" : "Write your review..."}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full items-center justify-between">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Rating value={field.value} onValueChange={field.onChange} readOnly={disabled}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton key={index} />
                  ))}
                </Rating>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!disabled ? (
          <Button type="submit">
            Submit Review
          </Button>
        ) : (
          <Button type="button" asChild>
            <Link href="/login">Log In to Review</Link>
          </Button>
        )}
      </div>
      { form.formState.errors.root && <RootFormMessage /> }
    </form>
  );
}