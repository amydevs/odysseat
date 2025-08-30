"use client";
import * as React from "react";
import Map, { Marker, Popup, type MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css' // Required CSS for MapLibre GL to render marker positions correctly
import { api } from "~/trpc/react";
import MapMarker from "./marker";

export default function HomeMap() {
    const { data: markers, isLoading } = api.recipe.getAll.useQuery({});
    const [popupInfo, setPopupInfo] = React.useState<NonNullable<typeof markers>[number] | null>(null);
    const mapRef = React.useRef<MapRef>(null);

    if (isLoading) {
        return <div>Wait up a sec...</div>;
    }

    return (
        <Map
            ref={mapRef}
            style={{ width: '50vw', height: '50vh' }}
            initialViewState={{
                longitude: 151.19930,
                latitude: -33.883993,
                zoom: 10
            }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=Y1LHHXeWTC4l0lTXoIC4"
        >
            {markers?.map((marker) => (
                <MapMarker
                    marker={marker}
                    onClick={(e, markerData) => {
                        setPopupInfo(markerData)
                    }}
                />
            ))}
            {
                popupInfo && <Popup
                    anchor="top"
                    longitude={(popupInfo.position[0])}
                    latitude={(popupInfo.position[1])}
                    onClose={() => setPopupInfo(null)}
                >
                    <img width="100%" src={popupInfo.thumbnailUrl!} />
                    <div className="text-foreground">{popupInfo.title}</div>
                </Popup>
            }
        </Map>
    );
}