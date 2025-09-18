"use client";

import { UppyContextProvider } from '@uppy/react';
import Uppy from '@uppy/core';
import Tus from "@uppy/tus";
import * as React from "react";

export default function UppyProvider({ children }: { children?: React.ReactNode }) {
    const [uppy] = React.useState(
        () => new Uppy()
            .use(Tus, { endpoint: "/api/upload" })
    );
    return <UppyContextProvider uppy={uppy}>
        {children}
    </UppyContextProvider>
}