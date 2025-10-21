"use client";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Rating, RatingButton } from '~/components/ui/shadcn-io/rating';
import { api } from "~/trpc/react";
import { useForm, Form, FormField, FormItem, FormControl, FormMessage } from "~/components/ui/form";
import { zCommentCreate } from "~/server/db/validators";
import type * as z from "zod/v4";
import { TRPCError } from "@trpc/server";
import Link from "next/link";

export default function ReviewSection({
  recipeId,
  isAuth,
}: {
  recipeId: number;
  isAuth: boolean;
}) {
  const commentCreateMutation = api.comment.create.useMutation();
  const { data: comments, refetch: fetchComments } = api.comment.getByRecipeId.useQuery({ 
    recipeId 
  });
  
  const form = useForm({
    schema: zCommentCreate,
    defaultValues: {
      recipeId,
      content: "",
      rating: 0,
    }
  });

  const onSubmit = async (data: z.infer<typeof zCommentCreate>) => {
    if (!isAuth) return;
    try {
      await commentCreateMutation.mutateAsync(data);
      form.reset({
        recipeId,
        content: "",
        rating: 0,
      });
      await fetchComments();
    } catch (e: unknown) {
      if (e instanceof TRPCError) {
        form.setError("root", { message: e.message });
      }
    }
  };

  return (
    <>
      <div>
        <div className="h-1 bg-muted-foreground rounded-full" />
        <div className="text-2xl font-bold pt-5"> Write a Review </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      {...field}
                      disabled={!isAuth}
                      placeholder={!isAuth ? "Sign in to leave a review" : "Write your review..."}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full justify-around">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Rating value={field.value} onValueChange={field.onChange} readOnly={!isAuth}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <RatingButton key={index} />
                        ))}
                      </Rating>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div /><div />
              {isAuth ? (
                <Button type="submit" className="w-100" disabled={commentCreateMutation.isPending}>
                  {commentCreateMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              ) : (
                <Button type="button" className="w-100" asChild>
                  <Link href="/login">Log In to Review</Link>
                </Button>
              )}
            </div>
            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}
          </form>
        </Form>
      </div>
      
      <div className="space-y-4 pt-6">
        <div className="h-1 bg-muted-foreground rounded-full" />
        <div className="text-2xl font-bold">Reviews ({comments?.length ?? 0})</div>
        {comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Rating value={comment.rating} readOnly>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RatingButton key={index} />
                    ))}
                  </Rating>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet :(</p>
        )}
      </div>
    </>
  );
}