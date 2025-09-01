import Image from "next/image";
import * as React from "react";
import { Marker } from 'react-map-gl/maplibre';
import { LngLat } from 'maplibre-gl';
import { cn } from "~/lib/utils";
// import { api } from "~/trpc/react";

export default function RecipeMarker({
    recipe,
    className,
    isNewMarker,
    lastPos,
    zoomLevel,
    ...props
}: {
    recipe: {
        position: [number, number],
        thumbnailUrl: string | null,
    };
    isNewMarker?: boolean;
    lastPos?: LngLat | null;
    zoomLevel?: number;

} & Omit<React.ComponentProps<typeof Marker>, "longitude" | "latitude">) {
    const { markerDelay, shouldAnimate } = markerAnimation({
        isNewMarker,
        lastPos,
        zoomLevel,
        position: recipe.position,
    });
    return (
        <Marker
            longitude={recipe.position[0]}
            latitude={recipe.position[1]}
            className={cn("-translate-y-2/3", className)}
            {...props}
        >
            <div 
                className={`relative w-12 h-12 cursor-pointer opacity-0`}
                style={{
                    animationDelay: `${markerDelay}ms`,
                    animation: shouldAnimate ? `marker 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${markerDelay}ms both` : undefined,
                }}
            >
                <Image 
                    src="/assets/marker-icon.svg"
                    alt="Map marker" 
                    className="invert opacity-80"
                    width={909}
                    height={994}
                />
                {recipe.thumbnailUrl && (
                    <Image
                        width={48}
                        height={48}
                        src={recipe.thumbnailUrl}
                        alt="Thumbnail"
                        className="rounded-full w-3/4 h-3/4 left-1/2 -translate-x-1/2 top-1/8 absolute"
                    />
                )}
            </div>
        </Marker>
    );
}

function markerAnimation({
    isNewMarker,
    lastPos,
    zoomLevel,
    position,
}: {
    isNewMarker?: boolean;
    lastPos?: LngLat | null;
    zoomLevel?: number;
    position: [number, number];
}) {
    const [markerDelay, setMarkerDelay] = React.useState(0);
    const [shouldAnimate, setShouldAnimate] = React.useState(false);
    React.useEffect(() => {
        let delay = 0;
        if (isNewMarker && lastPos && zoomLevel) {
            const markerLngLat = new LngLat(position[0], position[1]);
            const distance = markerLngLat.distanceTo(lastPos);
            delay = Math.min(1000, (distance * 0.000005 * (zoomLevel ** 2) - 50));
            setMarkerDelay(delay);
            setShouldAnimate(true);
            // console.log({ delay });
        }
    }, [isNewMarker, lastPos, zoomLevel, position]);

    return { markerDelay, shouldAnimate };
}