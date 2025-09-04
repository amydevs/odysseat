import * as React from 'react'
import { api } from '~/trpc/server';
import CreatingRecipe from './editing';

 
export default async function BlogPostPage() { 
  return (
    <main>
      <CreatingRecipe />
    </main>
  )
}