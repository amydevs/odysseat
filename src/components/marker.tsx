import * as React from "react";
import { Marker, type MarkerEvent } from 'react-map-gl/maplibre';
// import { api } from "~/trpc/react";

interface MarkerData {
    id: number;
    userId: string;
    position: [number, number]; //[longitude, latitude]
    title: string;
    content: string;
    thumbnailUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function MapMarker({
    marker,
    onClick,
    // isSelected = false,
}: {
    marker: MarkerData;
    onClick?: (e: MarkerEvent<MouseEvent>, marker: MarkerData) => void;
    isSelected?: boolean;
}) {
    const handleClick = (e: MarkerEvent<MouseEvent>) => {
        e.originalEvent.stopPropagation();
        onClick?.(e, marker);
    };
    return (
        <Marker
            key={marker.id}
            longitude={(marker.position[0])}
            latitude={(marker.position[1])}
            onClick={handleClick}
        >
        </Marker>
    );
}

export type { MarkerData };