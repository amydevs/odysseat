import { UppyContext } from "@uppy/react";
import * as React from "react";

export function useUppy() {
  return React.useContext(UppyContext);
}
