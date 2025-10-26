import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Rating, RatingButton } from "~/components/ui/shadcn-io/rating";
import { api } from "~/trpc/server";
import { Separator } from "~/components/ui/separator";
import { authClient } from "~/auth/client";

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: userId } = await params;
  const user = await api.profileRouter.getById({ id: userId });
  const recipes = await api.recipe.getAll({
    userId,
  });

  const ratings = await api.recipe.getAverageRatings({
    recipeIds: recipes.map((r) => r.id),
  });

  async function deleteAccount() {
    const res = await authClient.deleteUser();
  }
  return (
    <main className="mx-auto max-w-7xl space-y-3 p-3">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-3xl">{user.name}</CardTitle>
          <span>{recipes.length} recipes</span>
        </CardHeader>
      </Card>
      <Separator />
      <h2 className="text-2xl font-bold">Recipes</h2>
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
      <div style={{ display: "block", textAlign: "center", textDecoration: "underline"}}>
        <a href="/delete-account">Delete Account</a>
      </div>
    </main>
  );
}
