"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import React from "react";

// Our <Editor> component we can reuse later
export default function Editor({
  initialValue,
  onValueChange
}: {
  initialValue: any;
  onValueChange?: (data: any) => void
}) {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: initialValue,
  });

  // Renders the editor instance using a React component.
  return <BlockNoteView theme="light" onChange={async (editor) => onValueChange?.(editor.document)} editor={editor} />;
}