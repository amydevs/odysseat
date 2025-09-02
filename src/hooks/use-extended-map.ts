import * as React from "react";
import { ExtendedMapContext } from "~/contexts/extended-map-context";

export function useExtendedMap() {
    const map = React.useContext(ExtendedMapContext);
    return map;
    // console.log(map.current, map.current?.getLastCenter);
    // return useMap() as ReturnType<typeof useMap> & { current?: ExtendedMapRef };
}