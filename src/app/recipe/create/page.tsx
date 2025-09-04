import * as React from 'react'
import { api } from '~/trpc/server';
import CreatingRecipe from './editing';

 
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const id = Number.parseInt(slug);
  const recipe = await api.recipe.getById({ id });
 
  return (
    <main>
      <CreatingRecipe value={recipe} />
    </main>
  )
}