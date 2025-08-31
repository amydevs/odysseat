import Image from "next/image";
import * as React from "react";
import { Marker } from 'react-map-gl/maplibre';
import { cn } from "~/lib/utils";
// import { api } from "~/trpc/react";

export default function RecipeMarker({
    recipe,
    className,
    ...props
}: {
    recipe: {
        position: [number, number],
        thumbnailUrl: string | null,
    };
} & Omit<React.ComponentProps<typeof Marker>, "longitude" | "latitude">) {
    return (
        <Marker
            longitude={recipe.position[0]}
            latitude={recipe.position[1]}
            className={cn("-translate-y-2/3", className)}
            {...props}
        >
            <div 
                className={`relative w-12 h-12 cursor-pointer animate-marker`}
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