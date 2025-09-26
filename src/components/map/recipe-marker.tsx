"use client";
import Image from "next/image";
import * as React from "react";
import { Marker } from "react-map-gl/maplibre";
import { LngLat } from "maplibre-gl";
import { cn } from "~/lib/utils";
import { useExtendedMap } from "~/hooks/use-extended-map";
import Link from "next/link";

export default function RecipeMarker({
  recipe,
  className,
  animate = true,
  expanded = false,
  onMouseDown,
  onMouseUp,
  ...props
}: {
  recipe: {
    id: number;
    title: string;
    position: [number, number];
    thumbnailUrl: string | null;
  };
  animate?: boolean;
  expanded?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
} & Omit<React.ComponentProps<typeof Marker>, "longitude" | "latitude">) {
  const map = useExtendedMap();
  const markerDelay = React.useMemo(() => {
    const mapInstance = map.current;
    const lastPos = mapInstance?.getLastCenter();
    if (mapInstance == null || !animate) {
      return;
    }
    const zoomLevel = mapInstance.getZoom();
    let delay = 0;
    const markerLngLat = new LngLat(recipe.position[0], recipe.position[1]);
    const distance = lastPos != null ? markerLngLat.distanceTo(lastPos) : 0;
    delay = Math.min(1000, distance * 0.000005 * zoomLevel ** 2 - 50);
    return delay;
  }, [animate, recipe.position, map.current]);

  return (
    <Marker
      longitude={recipe.position[0]}
      latitude={recipe.position[1]}
      className={cn("-translate-y-2/3", expanded && "z-50", className)}
      {...props}
    >
      <div
        className={cn(`relative h-16 w-16 cursor-pointer transition ease-in-out`, animate && "opacity-0", !expanded && "hover:scale-[1.15]")}
        style={{
          animationDelay: markerDelay != undefined ? `${markerDelay}ms` : undefined,
          transition: `0.2s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          animation:
            markerDelay != undefined
              ? `marker 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${markerDelay}ms both`
              : undefined,
        }}
      >
        {/* eslint-disable */}
        <svg className="text-background" viewBox="0 0 1783.38 1919.55">
          <path fill="currentColor" d="M891.69,1919.01c-3.54-1.35-58.81-22.61-139.12-63.28-76.25-38.62-191.32-103.14-306.44-191.21-129.38-98.97-232.46-206.9-306.39-320.78C47.35,1201.41.5,1049.32.5,891.69c0-120.31,23.56-237.02,70.03-346.89,44.89-106.12,109.14-201.43,190.99-283.28,81.85-81.85,177.15-146.1,283.28-190.99C654.67,24.06,771.38.5,891.69.5s237.02,23.56,346.89,70.03c106.12,44.89,201.43,109.14,283.28,190.99s146.1,177.15,190.99,283.28c46.47,109.87,70.03,226.58,70.03,346.89,0,157.63-46.85,309.72-139.24,452.05-73.93,113.88-177.01,221.81-306.39,320.78-115.12,88.07-230.19,152.59-306.44,191.21-80.31,40.68-135.58,61.93-139.12,63.28Z" />
        </svg>
        
        {/* eslint-enable */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 bg-background transition-all duration-300",
            expanded
              ? "h-56 w-64 rounded-3xl -translate-y-48"
              : "h-12 w-12 rounded-4xl -translate-y-1/2"
          )}
          style={{
            transition:
              "height 220ms, width 300ms, border-radius 300ms, translate 350ms"
          }}
        >
        {recipe.thumbnailUrl && (
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 transition-all duration-300 overflow-hidden",
              expanded
                ? "top-1/2 h-40 w-60 -translate-y-26 rounded-3xl"
                : "top-1/2 h-16 w-16 -translate-y-1/2 rounded-4xl border-2 border-background"
            )}
            style={{
              transition:
                "height 220ms, width 300ms, border-radius 300ms, translate 350ms"
            }}
          >
            <Image
              fill
              src={recipe.thumbnailUrl}
              alt="Thumbnail"
              className="object-cover"
            />
          </div>
        )}
          {expanded && (
            <Link
              href={`/recipe/${recipe.id}`}
              className="absolute text-base text-foreground hover:text-muted-foreground bottom-1 left-1/2 -translate-x-1/2 w-64 px-6 text-center line-clamp-2"
            >
              {recipe.title}
            </Link>
          )}
        </div>
      </div>
    </Marker>
  );
}
