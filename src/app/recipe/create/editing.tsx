'use client';

import * as React from 'react';
import { TRPCError, type inferRouterInputs } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';
import { Form } from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { api } from '~/trpc/react';
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useRouter } from 'next/navigation';
import RecipeForm from '~/components/editor/recipe-form';

export default function CreatingRecipe() {
  const router = useRouter();
  const recipeCreateMutation = api.recipe.create.useMutation();
  const form = useForm<inferRouterInputs<AppRouter>['recipe']['create']>();
  const onSubmit = async (data: inferRouterInputs<AppRouter>['recipe']['create']) => {
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