import * as React from "react";
import { api } from "~/trpc/server";
import EditingRecipe from "./editing";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = Number.parseInt(slug);
  const recipe = await api.recipe.getById({ id });
  return {
    title: `Edit - ${recipe.title}`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  const { slug } = await params;
  const id = Number.parseInt(slug);
  const recipe = await api.recipe.getById({ id });

  if (recipe.userId !== session?.user.id) {
    redirect(`/recipe/${id}`);
  }

  return (
    <main className="min-h-screen-minus-navbar flex flex-col">
      <EditingRecipe className="flex-1" value={recipe} />
    </main>
  );
}
