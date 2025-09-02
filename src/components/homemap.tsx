"use client";
import * as React from "react";
import Map, { Popup, type MapRef } from 'react-map-gl/maplibre';
import { LngLat } from 'maplibre-gl';
import { api } from "~/trpc/react";
import { useDebouncedCallback } from "use-debounce";
import RecipeMarker from "./map/recipe-marker";
import Link from "next/link";
import Image from "next/image";
import 'maplibre-gl/dist/maplibre-gl.css' // Required CSS for MapLibre GL to render marker positions correctly

export default function HomeMap() {
    const mapRef = React.useRef<MapRef>(null);

    const [popupInfo, setPopupInfo] = React.useState<NonNullable<typeof markers>[number] | null>(null);

    const [currentPos, setCurrentPos] = React.useState<LngLat | null>(null);
    const [lastPos, setLastPos] = React.useState<LngLat | null>(null);
    const [newMarkerIds, setNewMarkerIds] = React.useState<Set<number>>(new Set());

    const [bounds, setBounds] = React.useState<{
        north: number;
        south: number;
        east: number;
        west: number;
    } | null>(null);

    const [bufferedMarkers, setBufferedMarkers] = React.useState<typeof markers>([]);
    const { data: markers, isLoading, isFetching } = api.recipe.getAll.useQuery(
        { bounds: bounds ?? undefined },
        { enabled: bounds != null }
    );
    
    React.useEffect(() => {
        if (markers != null && !isFetching && currentPos != null && lastPos != null) {
            setNewMarkerIds(new Set());
            const bufferedIds = new Set(bufferedMarkers?.map(marker => marker.id))
            for (const marker of markers) {
                if (!bufferedIds.has(marker.id)) {
                    setNewMarkerIds(prev => new Set(prev).add(marker.id))
                }
            }
            setBufferedMarkers(markers);
        }
    }, [markers, isFetching, bufferedMarkers]);

    const updateBounds = useDebouncedCallback(() => {
        const center = mapRef.current?.getCenter();
        setCurrentPos(center ?? null);
        if (mapRef.current) {
            const mapBounds = mapRef.current.getBounds();
            setBounds({
                north: mapBounds.getNorth(),
                south: mapBounds.getSouth(),
                east: mapBounds.getEast(),
                west: mapBounds.getWest(),
            });
        }
    }, 200);

    const handleMoveStart = () => {
        const start = mapRef.current?.getCenter() ?? null;
        setLastPos(start);
    };

    const displayMarkers = markers ?? bufferedMarkers;

    return (
        <Map
            ref={mapRef}
            style={{ width: '100%', height: '100%' }}
            initialViewState={{
                longitude: 151.19930,
                latitude: -33.883993,
                zoom: 5
            }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=Y1LHHXeWTC4l0lTXoIC4"
            onLoad={updateBounds}
            onMoveStart={handleMoveStart}
            onMove={updateBounds}
        >
            {displayMarkers?.map((marker) => (
                <RecipeMarker
                    key={marker.id} // Needs to stay marker.id so that recipes with same id doesnt rerender
                    recipe={marker}
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo(marker);
                    }}
                    lastPos={lastPos}
                    isNew={newMarkerIds.has(marker.id)}
                />
            ))}
            {
                popupInfo && <Popup
                    anchor="top"
                    longitude={(popupInfo.position[0])}
                    latitude={(popupInfo.position[1])}
                    onClose={() => setPopupInfo(null)}
                >
                    <Image alt={popupInfo.title} height={400} width={300} className="w-full" src={popupInfo.thumbnailUrl!} />
                    <Link href={`/recipe/${popupInfo.id}`} className="text-foreground">
                        {popupInfo.title}
                    </Link>
                </Popup>
            }
        </Map>
    );
}