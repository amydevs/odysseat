import * as React from "react";
import { api, HydrateClient } from "~/trpc/server";
import { ServerBlockNoteEditor } from "@blocknote/server-util";
import { Button } from "~/components/ui/button";
import StaticRecipe from "./static";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = Number.parseInt(slug);
  const recipe = await api.recipe.getById({ id });
  await api.recipe.getById.prefetch({ id });
  await api.comment.getByRecipeId.prefetch({ recipeId: id });
  const editor = ServerBlockNoteEditor.create();
  const blocks = await editor.tryParseMarkdownToBlocks(recipe.content);
  const html = await editor.blocksToFullHTML(blocks);

  return (
    <HydrateClient>
      <main className="min-h-screen-minus-navbar flex flex-col">
        <React.Suspense
          fallback={
            <Skeleton className="flex-1" />
          }
        >
          <StaticRecipe
            className="flex-1"
            recipeContentHtml={html}
            recipeId={id}
          />
        </React.Suspense>
      </main>
    </HydrateClient>
  );
}
