"use client";
import "maplibre-gl/dist/maplibre-gl.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import RecipeMarker from "~/components/map/recipe-marker";
import ExtendedMap from "~/components/map/extended-map";
import { authClient } from "~/auth/client";
import { api } from "~/trpc/react";
import { Rating, RatingButton } from "~/components/ui/shadcn-io/rating";
import type * as z from "zod/v4";
import { Form, useForm } from "~/components/ui/form";
import { zCommentCreate } from "~/server/db/validators";
import CommentForm from "~/components/comment/comment-form";
import { Separator } from "~/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function StaticRecipe({
  recipeId,
  recipeContentHtml,
  className,
}: {
  recipeId: number;
  recipeContentHtml: string;
  className?: string;
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const session = authClient.useSession();
  const [recipe] = api.recipe.getById.useSuspenseQuery({ id: recipeId });
  const recipeDeleteMutation = api.recipe.delete.useMutation();
  const commentsQuery = api.comment.getByRecipeId.useQuery({ recipeId });
  const commentCreateMutation = api.comment.create.useMutation({
    onSuccess: async () => {
      await utils.comment.getByRecipeId.invalidate({ recipeId: recipeId });
    },
  });
  const commentDeleteMutation = api.comment.delete.useMutation({
    onSuccess: async () => {
      await utils.comment.getByRecipeId.invalidate({ recipeId });
    },
  });

  const form = useForm({
    schema: zCommentCreate,
    defaultValues: {
      recipeId,
      content: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof zCommentCreate>) => {
    try {
      await commentCreateMutation.mutateAsync(data);
      form.reset({
        recipeId,
        content: "",
        rating: 0,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        form.setError("root", { message: e.message });
      }
    }
  };

  const onDelete = async () => {
    await recipeDeleteMutation.mutateAsync({ id: recipe.id });
    router.push("/");
  };

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="flex w-full max-w-full flex-col space-y-9 px-3 lg:max-w-7xl">
        <div className="min-h-screen-minus-navbar flex flex-col gap-3 py-3">
          <div>
            <h1 className="text-4xl font-bold lg:text-7xl">{recipe.title}</h1>
          </div>
          <div
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: recipeContentHtml }}
          />
          <div
            className={cn(
              "flex w-full gap-1",
              session.data?.user.role !== "admin" &&
                session.data?.user.id !== recipe.userId &&
                "hidden",
            )}
          >
            <Button className="flex-1" asChild>
              <Link href={`/recipe/${recipe.id}/edit`}>Edit</Link>
            </Button>
            <Button
              onClick={onDelete}
              variant={"destructive"}
              className={cn(
                "flex-1 cursor-pointer",
                session.data?.user.role !== "admin" && "hidden",
              )}
            >
              Delete
            </Button>
          </div>
        </div>
        <Separator
          className={cn(session.data?.user.id === recipe.userId && "hidden")}
        />
        <div
          className={cn(session.data?.user.id === recipe.userId && "hidden")}
        >
          <Form {...form}>
            <CommentForm
              onSubmit={form.handleSubmit(onSubmit, console.log)}
              disabled={session.data == null}
            />
          </Form>
        </div>
        <Separator />
        <div className="space-y-3 py-3">
          {commentsQuery.data?.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="flex items-center justify-between">
                <Rating value={comment.rating} readOnly>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RatingButton key={index} />
                  ))}
                </Rating>
                <span className="text-muted-foreground text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  {comment.userName}
                </p>
                {session.data?.user.id === comment.userId && (
                  <Button
                    size="sm"
                    disabled={commentDeleteMutation.isPending}
                    onClick={() =>
                      commentDeleteMutation.mutate({ id: comment.id })
                    }
                  >
                    Delete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
          {commentsQuery.data?.length === 0 && "No reviews found! :("}
          {commentsQuery.isFetching && <Skeleton className="h-32" />}
        </div>
      </div>
      <div className="lg:max-h-screen-minus-navbar fixed right-0 bottom-0 left-0 lg:sticky lg:top-[var(--navbar-height)] lg:bottom-auto">
        <div className="absolute -top-24 right-3 h-12 lg:hidden">
          <Button
            className="cursor-pointer"
            type="button"
            size="icon"
            onClick={() => setIsMapOpen(!isMapOpen)}
          >
            <GlobeIcon />
          </Button>
        </div>
        <div
          className={cn(
            "h-0 transition-all lg:h-full lg:w-xl",
            isMapOpen && "h-80",
          )}
        >
          <ExtendedMap
            style={{ height: "100%" }}
            longitude={recipe.position[0]}
            latitude={recipe.position[1]}
            initialViewState={{
              zoom: 5,
            }}
          >
            {recipe.position && <RecipeMarker recipe={recipe} />}
          </ExtendedMap>
        </div>
      </div>
    </div>
  );
}
