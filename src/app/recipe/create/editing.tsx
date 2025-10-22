"use client";

import * as React from "react";
import type * as z from "zod/v4";
import { TRPCError } from "@trpc/server";
import { useForm, Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import "maplibre-gl/dist/maplibre-gl.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useRouter } from "next/navigation";
import RecipeForm from "~/components/editor/recipe-form";
import { zRecipeCreate } from "~/server/db/validators";
import { useEffect } from "react";

export default function CreatingRecipe() {
  const router = useRouter();
  const recipeCreateMutation = api.recipe.create.useMutation();
  const form = useForm({
    schema: zRecipeCreate,
    defaultValues: {
      content:
        "# Ingredients\n" +
        new Array(3).map((_, i) => `- ingredient ${i + 1}`).join("\n\n") +
        "\n# Steps\n" +
        new Array(3)
          .map((_, i) => `## Step ${i + 1}\nexample step ${i + 1}`)
          .join("\n\n"),
    },
  });
  const onSubmit = async (data: z.infer<typeof zRecipeCreate>) => {
    try {
      const recipe = await recipeCreateMutation.mutateAsync(data);
      router.push(`/recipe/${recipe.id}`);
    } catch (e: unknown) {
      if (e instanceof TRPCError) {
        form.setError("root", { message: e.message });
      }
    }
  };
  useEffect(() => {
    document.title = "New Recipe";
  }, []);
  return (
    <Form {...form}>
      <RecipeForm
        className="flex min-h-full justify-center"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </Form>
  );
}
