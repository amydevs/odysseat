"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import {
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useTheme } from "next-themes";
import React from "react";

export default function MarkdownEditor({
  initialValue,
  onValueChange
}: {
  initialValue: string;
  onValueChange?: (data: string) => void
}) {
  const { theme } = useTheme();
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // disableExtensions: ["textColor"]
  });

  React.useEffect(() => {
    (async () => {
      editor.replaceBlocks(editor.document, await editor.tryParseMarkdownToBlocks(initialValue))
    })().catch(console.error)
  }, [])

   
  return <BlockNoteView style={{ "--bn-colors-editor-background": "var(--background)" } as object} theme={theme === "dark" ? "dark" : "light"} onChange={async (editor) => onValueChange?.(await editor.blocksToMarkdownLossy(editor.document))} editor={editor}>
    {/* <FormattingToolbarController formattingToolbar={() => <></>} /> */}
  </BlockNoteView>;
}