import { Map, type LngLat, type MapRef } from "react-map-gl/maplibre";
import * as React from "react";

export type ExtendedMapRef = MapRef & {
    getLastCenter: () => LngLat | undefined
};

export type ExtendedMapProps = React.ComponentProps<typeof Map> & {
    ref?: React.Ref<ExtendedMapRef>
};

export default function ExtendedMap({ref, ...props}: ExtendedMapProps) {
    const lastPos = React.useRef<LngLat>(undefined);
    return <Map ref={(current) => {
        if (current == null) {
            return
        }
        Object.assign(current, {
            ...current,
            getLastCenter: () => lastPos.current,
        } satisfies ExtendedMapRef);
        const moveStartHandler = current.on('movestart', () => {
            lastPos.current = current.getCenter();
        });
        const cleanUpCb = () => {
            moveStartHandler.unsubscribe();
        };
        if (ref == null) {
            return cleanUpCb;
        }
        (ref as { current: ExtendedMapRef }).current = current as unknown as ExtendedMapRef;
        return cleanUpCb;
    }} {...props} />
}