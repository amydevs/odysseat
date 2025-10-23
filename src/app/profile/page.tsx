import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Rating, RatingButton } from "~/components/ui/shadcn-io/rating";
import { api } from "~/trpc/server";
import { auth } from "~/auth/server";
import { headers } from "next/headers";
import { Separator } from "~/components/ui/separator";

export default async function RecipesPage({
  // searchParams,
}: {
  // searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // const { search, error } = await searchParams;
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  
  const recipes = await api.recipe.getAll({
    userId: sessionData?.user?.id,
  });

  const name = sessionData?.user?.name;

  const ratings = await api.recipe.getAverageRatings({
    recipeIds: recipes.map((r) => r.id),
  });
  return (
    <main className="mx-auto max-w-7xl space-y-3 p-3">
      <div className="bg-muted-foreground/20 rounded-2xl text-center align-bottom p-10 text-8xl ">
        Hello {name}!
      </div>
      <Separator />
      <h2 className="text-2xl font-bold">Your Recipes</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-3">
        {recipes.map((r) => {
          const avgRating = ratings.find(
            (rating) => rating.recipeId === r.id,
          )?.avgRating;
          const displayRating = avgRating ? Number(avgRating) : 0;
          return (
            <Card key={r.id}>
              <CardHeader>
                <Image
                  alt={r.title}
                  src={r.thumbnailUrl ?? ""}
                  className="aspect-video w-full object-cover"
                  width={400}
                  height={300}
                />
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {r.title}
                </CardTitle>
              </CardHeader>
              <CardFooter className="justify-between">
                <Button asChild>
                  <Link href={`/recipe/${r.id}`}>View</Link>
                </Button>
                {avgRating != null && (
                  <div className="flex items-center gap-0">
                    <span className="text-muted-foreground text-sm">
                      ({displayRating.toFixed(1)})
                    </span>
                    <Rating value={Math.round(displayRating)} readOnly>
                      {Array.from({ length: 1 }).map((_, index) => (
                        <RatingButton key={index} />
                      ))}
                    </Rating>
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}