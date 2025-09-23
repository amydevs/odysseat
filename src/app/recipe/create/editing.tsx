'use client';

import * as React from 'react';
import type * as z from "zod/v4";
import { TRPCError } from '@trpc/server';
import { useForm, Form } from '~/components/ui/form';
import { api } from '~/trpc/react';
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useRouter } from 'next/navigation';
import RecipeForm from '~/components/editor/recipe-form';
import { zRecipeCreate } from '~/server/db/validators';

export default function CreatingRecipe() {
  const router = useRouter();
  const recipeCreateMutation = api.recipe.create.useMutation();
  const form = useForm({
    schema: zRecipeCreate,
  });
  const onSubmit = async (data: z.infer<typeof zRecipeCreate>) => {
    try {
      const recipe = await recipeCreateMutation.mutateAsync(data);
      router.push(`/recipe/${recipe.id}`);
    }
    catch (e: unknown) {
      if (e instanceof TRPCError) {
        form.setError("root", { message: e.message });
      }
    }
  }
  return (
    <Form {...form}>
      <RecipeForm className='flex justify-center min-h-full' onSubmit={form.handleSubmit(onSubmit)} />
    </Form>
  )
}