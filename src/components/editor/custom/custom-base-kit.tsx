
import { AutoformatKit } from '~/components/editor/plugins/autoformat-kit'
import { BaseBasicBlocksKit } from '~/components/editor/plugins/basic-blocks-base-kit'
import { BaseBasicMarksKit } from '~/components/editor/plugins/basic-marks-base-kit'
import { BaseCalloutKit } from '~/components/editor/plugins/callout-base-kit'
import { BaseCodeBlockKit } from '~/components/editor/plugins/code-block-base-kit'
import { BaseDateKit } from '~/components/editor/plugins/date-base-kit'
import { BaseLinkKit } from '~/components/editor/plugins/link-base-kit'
import { BaseListKit } from '~/components/editor/plugins/list-base-kit'
import { MarkdownKit } from '~/components/editor/plugins/markdown-kit'
import { CustomToolbarButtons } from './custom-toolbar-buttons'
import { FixedToolbar } from '~/components/ui/fixed-toolbar';
import { createPlatePlugin } from 'platejs/react'

export const CustomBaseKit = [
    ...BaseBasicBlocksKit,
    ...BaseCodeBlockKit,
    ...BaseCalloutKit,
    ...BaseDateKit,
    ...BaseLinkKit,
    ...BaseBasicMarksKit,
    ...BaseListKit,
    ...MarkdownKit,
    ...AutoformatKit,
    createPlatePlugin({
        key: 'fixed-toolbar',
        render: {
            beforeEditable: () => (
                <FixedToolbar>
                    <CustomToolbarButtons />
                </FixedToolbar>
            ),
        },
    }),
];