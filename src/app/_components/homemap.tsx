"use client";
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css' // Required CSS for MapLibre GL to render marker positions correctly
import { api } from "~/trpc/react";

export default function HomeMap() {
    const { data: markers, isLoading } = api.marker.getAll.useQuery({});

    if (isLoading) {
        return <div>Wait up a sec...</div>;
    }

    return (
        <Map
            style={{ width: '50vw', height: '50vh'}}
            initialViewState={{
              longitude: 151.19930,
              latitude: -33.883993,
              zoom: 10
            }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=Y1LHHXeWTC4l0lTXoIC4"
        >
            {markers?.map((marker) => (
                <Marker
                    key={marker.id}
                    longitude={parseFloat(marker.longitude)}
                    latitude={parseFloat(marker.latitude)}
                />
            ))}
        </Map>
    );
}