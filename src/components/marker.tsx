import * as React from "react";
import { Marker, type MarkerEvent } from 'react-map-gl/maplibre';
import { LngLat } from 'maplibre-gl'; // react-map-gl/maplibre only exports LngLat as type-only
import '../styles/marker.css';
// import { api } from "~/trpc/react";

interface MarkerData {
    id: number;
    userId: string;
    position: [number, number]; //[longitude, latitude]
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    thumbnailUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function MapMarker({
    marker,
    onClick,
    isSelected = false,
    isNewMarker = false,
    lastPos = null,
    zoomLevel = 10,
}: {
    marker: MarkerData;
    onClick?: (e: MarkerEvent<MouseEvent>, marker: MarkerData) => void;
    isSelected?: boolean;
    isNewMarker?: boolean;
    lastPos?: LngLat | null;
    zoomLevel?: number;
}) {
    const [markerDelay, setMarkerDelay] = React.useState(0);
    const [shouldAnimate, setShouldAnimate] = React.useState(false);
    React.useEffect(() => {
        let delay = 0;
        if (isNewMarker && lastPos && zoomLevel) {
            const markerLngLat = new LngLat(marker.position[0], marker.position[1]);
            const distance = markerLngLat.distanceTo(lastPos);
            delay = Math.min(1000, (distance * 0.000005 * (zoomLevel ** 2) - 50));
            setMarkerDelay(delay);
            setShouldAnimate(true);
            // console.log({ delay });
        }
    }, [isNewMarker, lastPos, marker.position]);

    const handleClick = (e: MarkerEvent<MouseEvent>) => {
        e.originalEvent.stopPropagation();
        onClick?.(e, marker);
    };
    return (
        <Marker
            key={marker.id}
            longitude={marker.position[0]}
            latitude={marker.position[1]}
            onClick={handleClick}
        >
            <div 
                className={`marker-container`}
                style={{
                    animationDelay: `${markerDelay}ms`,
                    animation: shouldAnimate ? `markerAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${markerDelay}ms both` : undefined,
                }}
            >
                <img 
                    src="/assets/Marker2.svg"
                    alt="Map marker" 
                    className="marker-icon"
                />
                {marker.thumbnailUrl && (
                    <img 
                        src={marker.thumbnailUrl}
                        alt="Thumbnail"
                        className="marker-thumbnail"
                    />
                )}
            </div>
        </Marker>
    );
}

export type { MarkerData };