import * as React from 'react'
import { api } from '~/trpc/server';
import { ServerBlockNoteEditor } from '@blocknote/server-util';
import { Button } from '~/components/ui/button';
import StaticRecipe from './static';
import Link from 'next/link';

 
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const id = Number.parseInt(slug);
  const recipe = await api.recipe.getById({ id });
  const editor = ServerBlockNoteEditor.create();
  const blocks = await editor.tryParseMarkdownToBlocks(recipe.content);
  const html = await editor.blocksToFullHTML(blocks);
 
  return (
    <main className='min-h-screen-minus-navbar flex flex-col'>
      <StaticRecipe className='flex-1' recipeContentHtml={html} recipe={recipe} />
    </main>
  )
}