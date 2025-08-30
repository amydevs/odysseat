import { MarkdownPlugin } from "@platejs/markdown";
import type { inferRouterOutputs } from "@trpc/server";
import { createSlateEditor, PlateStatic } from "platejs";
import { BaseEditorKit } from "~/components/editor/editor-base-kit";
import type { AppRouter } from "~/server/api/root";

export default function StaticRecipe({
  recipe,
}: {
  recipe: inferRouterOutputs<AppRouter>['recipe']['getById']
}) {
    const editor = createSlateEditor({
        plugins: BaseEditorKit,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        value: (editor) => editor.getApi(MarkdownPlugin).markdown.deserialize(recipe.content)
    });
    return <main className='auto-limit-w'>
        <PlateStatic editor={editor} />
    </main>;
}