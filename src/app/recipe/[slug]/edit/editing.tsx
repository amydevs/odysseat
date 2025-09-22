'use client';

import * as z from "zod/v4";
import * as React from 'react';
import { TRPCError } from '@trpc/server';
import { useForm, Form } from '~/components/ui/form';
import { api, type RouterOutputs } from '~/trpc/react';
import { cn } from '~/lib/utils';
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import RecipeForm from '~/components/editor/recipe-form';
import { zRecipeEdit } from "~/server/db/validators";

export default function EditingRecipe({
  value,
  className
}: {
  value: RouterOutputs['recipe']['getById'],
  className?: string;
}) {
  const recipeUpdateMutation = api.recipe.edit.useMutation();
  const form = useForm({
    schema: zRecipeEdit,
    defaultValues: value,
  });
  const onSubmit = async (data: z.infer<typeof zRecipeEdit>) => {
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