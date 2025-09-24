import * as React from "react";
import type { ExtendedMapRef } from "~/components/map/extended-map";

export const ExtendedMapContext = React.createContext<{
  current?: ExtendedMapRef;
}>({ current: undefined });
