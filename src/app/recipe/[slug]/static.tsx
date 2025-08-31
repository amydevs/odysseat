import { ServerBlockNoteEditor } from "@blocknote/server-util";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";

export default async function StaticRecipe({
  recipe,
}: {
  recipe: inferRouterOutputs<AppRouter>['recipe']['getById']
}) {
    const editor = ServerBlockNoteEditor.create();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    const html = await editor.blocksToFullHTML(recipe.content as any);
    return <main className='auto-limit-w' dangerouslySetInnerHTML={{ __html: html }}>
    </main>;
}