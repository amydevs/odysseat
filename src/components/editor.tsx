"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import {
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import React from "react";

// Our <Editor> component we can reuse later
export default function Editor({
  initialValue,
  onValueChange
}: {
  initialValue: string;
  onValueChange?: (data: string) => void
}) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // disableExtensions: ["textColor"]
  });

  React.useEffect(() => {
    (async () => {
      editor.replaceBlocks(editor.document, await editor.tryParseMarkdownToBlocks(initialValue))
    })().catch(console.error)
  }, [])

   
  return <BlockNoteView theme="light" onChange={async (editor) => onValueChange?.(await editor.blocksToMarkdownLossy(editor.document))} editor={editor}>
    {/* <FormattingToolbarController formattingToolbar={() => <></>} /> */}
  </BlockNoteView>;
}