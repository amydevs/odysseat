'use client';

import * as React from 'react';
import { TRPCError, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';
import { Form } from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { api } from '~/trpc/react';
import { cn } from '~/lib/utils';
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import RecipeForm from '~/components/editor/recipe-form';

export default function EditingRecipe({
  value,
  className
}: {
  value: inferRouterOutputs<AppRouter>['recipe']['getById'],
  className?: string;
}) {
  const recipeUpdateMutation = api.recipe.update.useMutation();
  const form = useForm<inferRouterInputs<AppRouter>['recipe']['update']>({
    defaultValues: value,
  });
  const onSubmit = async (data: inferRouterInputs<AppRouter>['recipe']['update']) => {
    try {
      await recipeUpdateMutation.mutateAsync(data);
    }
    catch (e: unknown) {
      if (e instanceof TRPCError) {
        form.setError("root", { message: e.message });
      }
    }
  }
  return (
    <Form {...form}>
      <RecipeForm className={cn('flex justify-center', className)} onSubmit={form.handleSubmit(onSubmit)} />
    </Form>
  )
}