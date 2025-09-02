import { useMap } from "react-map-gl/maplibre"
import type { ExtendedMapRef } from "~/components/map/extended-map";

export function useExtendedMap() {
    return useMap() as ReturnType<typeof useMap> & { current?: ExtendedMapRef };
}