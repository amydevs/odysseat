'use client';

import * as React from 'react';

import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { AIToolbarButton } from '~/components/ui/ai-toolbar-button';
import { AlignToolbarButton } from '~/components/ui/align-toolbar-button';
import { CommentToolbarButton } from '~/components/ui/comment-toolbar-button';
import { EmojiToolbarButton } from '~/components/ui/emoji-toolbar-button';
import { ExportToolbarButton } from '~/components/ui/export-toolbar-button';
import { FontColorToolbarButton } from '~/components/ui/font-color-toolbar-button';
import { FontSizeToolbarButton } from '~/components/ui/font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from '~/components/ui/history-toolbar-button';
import { ImportToolbarButton } from '~/components/ui/import-toolbar-button';
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from '~/components/ui/indent-toolbar-button';
import { InsertToolbarButton } from '~/components/ui/insert-toolbar-button';
import { LineHeightToolbarButton } from '~/components/ui/line-height-toolbar-button';
import { LinkToolbarButton } from '~/components/ui/link-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from '~/components/ui/list-toolbar-button';
import { MarkToolbarButton } from '~/components/ui/mark-toolbar-button';
import { MediaToolbarButton } from '~/components/ui/media-toolbar-button';
import { ModeToolbarButton } from '~/components/ui/mode-toolbar-button';
import { MoreToolbarButton } from '~/components/ui/more-toolbar-button';
import { TableToolbarButton } from '~/components/ui/table-toolbar-button';
import { ToggleToolbarButton } from '~/components/ui/toggle-toolbar-button';
import { ToolbarGroup } from '~/components/ui/toolbar';
import { TurnIntoToolbarButton } from '~/components/ui/turn-into-toolbar-button';

export function CustomToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup>

          {/* <ToolbarGroup>
            <AIToolbarButton tooltip="AI commands">
              <WandSparklesIcon />
            </AIToolbarButton>
          </ToolbarGroup>

          <ToolbarGroup>
            <ExportToolbarButton>
              <ArrowUpToLineIcon />
            </ExportToolbarButton>

            <ImportToolbarButton />
          </ToolbarGroup> */}

          <ToolbarGroup>
            {/* <InsertToolbarButton /> */}
            <TurnIntoToolbarButton />
            {/* <FontSizeToolbarButton /> */}
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.underline}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={KEYS.strikethrough}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
              <Code2Icon />
            </MarkToolbarButton>

            {/* <FontColorToolbarButton nodeType={KEYS.color} tooltip="Text color">
              <BaselineIcon />
            </FontColorToolbarButton>

            <FontColorToolbarButton
              nodeType={KEYS.backgroundColor}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </FontColorToolbarButton> */}
          </ToolbarGroup>

          <ToolbarGroup>
            {/* <AlignToolbarButton /> */}

            <NumberedListToolbarButton />
            <BulletedListToolbarButton />
            <TodoListToolbarButton />
            <ToggleToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <LinkToolbarButton />
            {/* <TableToolbarButton /> */}
            <EmojiToolbarButton />
          </ToolbarGroup>

          {/* <ToolbarGroup>
            <MediaToolbarButton nodeType={KEYS.img} />
            <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} />
          </ToolbarGroup> */}

          <ToolbarGroup>
            {/* <LineHeightToolbarButton /> */}
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MoreToolbarButton />
          </ToolbarGroup>
        </>
      )}

      <div className="grow" />

      {/* <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.highlight} tooltip="Highlight">
          <HighlighterIcon />
        </MarkToolbarButton>
        <CommentToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <ModeToolbarButton />
      </ToolbarGroup> */}
    </div>
  );
}
