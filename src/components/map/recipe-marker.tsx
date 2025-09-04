"use client";
import Image from "next/image";
import * as React from "react";
import { Marker } from 'react-map-gl/maplibre';
import { LngLat } from 'maplibre-gl';
import { cn } from "~/lib/utils";
import markerIcon from "./marker-icon.svg";
import { useExtendedMap } from "~/hooks/use-extended-map";

export default function RecipeMarker({
    recipe,
    className,
    isNew,
    ...props
}: {
    recipe: {
        position: [number, number];
        thumbnailUrl: string | null;
    };
    isNew?: boolean;
} & Omit<React.ComponentProps<typeof Marker>, "longitude" | "latitude">) {
    const map = useExtendedMap();
    const [markerDelay, setMarkerDelay] = React.useState(0);
    const [shouldAnimate, setShouldAnimate] = React.useState(false);
    React.useEffect(() => {
        const mapInstance = map.current;
        const lastPos = mapInstance?.getLastCenter();
        if (mapInstance == null || !isNew) {
            return;
        }
        const zoomLevel = mapInstance.getZoom();
        let delay = 0;
        const markerLngLat = new LngLat(recipe.position[0], recipe.position[1]);
        const distance = lastPos != null ? markerLngLat.distanceTo(lastPos) : 0;
        delay = Math.min(1000, (distance * 0.000005 * (zoomLevel ** 2) - 50));
        setMarkerDelay(delay);
        setShouldAnimate(true);
    }, [isNew, recipe.position]);
    // const size = Math.floor(32 + (zoomLevel ?? 0) ** 2);
    return (
        <Marker
            longitude={recipe.position[0]}
            latitude={recipe.position[1]}
            className={cn("-translate-y-2/3", className)}
            {...props}
        >
            <div 
                className={`relative w-16 h-16 cursor-pointer opacity-0 transition ease-in-out hover:scale-125`}
                style={{
                    animationDelay: `${markerDelay}ms`,
                    animation: shouldAnimate ? `marker 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${markerDelay}ms both` : undefined,
                }}
            >
                {/* eslint-disable */}
                <Image 
                    alt="Map marker" 
                    src={markerIcon.src}
                    height={markerIcon.height}
                    width={markerIcon.width}
                />
                {/* eslint-enable */}
                {recipe.thumbnailUrl && (
                    <Image
                        width={48}
                        height={48}
                        src={recipe.thumbnailUrl}
                        alt="Thumbnail"
                        className="rounded-full w-15/16 h-15/16 left-1/2 -translate-x-1/2 top-1/48 absolute object-cover border-1 border-white"
                    />
                )}
            </div>
        </Marker>
    );
}