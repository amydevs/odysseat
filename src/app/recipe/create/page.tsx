import * as React from 'react'
import CreatingRecipe from './editing';

 
export default async function BlogPostPage() { 
  return (
    <main className='h-screen-minus-navbar'>
      <CreatingRecipe />
    </main>
  )
}