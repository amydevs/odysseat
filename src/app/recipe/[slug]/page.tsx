import * as React from 'react'
import { api } from '~/trpc/server';
import StaticRecipe from './static';
import { Button } from '~/components/ui/button';
import Link from 'next/link';

 
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const id = Number.parseInt(slug);
  const recipe = await api.recipe.getById({ id });
 
  return (
    <div className='auto-limit-w'>
      <StaticRecipe recipe={recipe} />
      <Button asChild>
        <Link href={`/recipe/${slug}/edit`}>
          Edit
        </Link>
      </Button>
    </div>
  )
}