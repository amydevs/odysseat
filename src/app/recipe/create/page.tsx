import * as React from 'react'
import CreatingRecipe from './editing';

 
export default async function BlogPostPage() { 
  return (
    <main className='h-[calc(100vh-5rem)]'>
      <CreatingRecipe />
    </main>
  )
}