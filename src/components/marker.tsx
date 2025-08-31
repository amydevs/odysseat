import * as React from "react";
import { Marker, type MarkerEvent } from 'react-map-gl/maplibre';
// import { api } from "~/trpc/react";

interface MarkerData {
    id: number;
    userId: string;
    position: [number, number]; //[longitude, latitude]
    title: string;
    content: any;
    thumbnailUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export default function MapMarker({
    marker,
    onClick,
    isSelected = false,
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
            <div style={{ 
                position: 'relative', 
                width: '3vw', 
                height: '3vw', 
                cursor: 'pointer',
                transform: 'translate(0%, -50%)',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img 
                    src="/assets/Marker.svg"
                    alt="Map marker" 
                    className={`marker`}
                    style={{ 
                        width: '3vw', 
                        height: '3vw', 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: 0.8,
                        filter: 'invert(100%)',
                    }}
                />
                {marker.thumbnailUrl && (
                    <img 
                        src={marker.thumbnailUrl}
                        alt="Thumbnail"
                        style={{
                            width: '2vw',
                            height: '2vw',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '4px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            objectFit: 'cover',
                            border: '1px solid white'
                        }}
                    />
                )}
            </div>
        </Marker>
    );
}

export type { MarkerData };