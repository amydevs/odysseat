"use client";
import Image from "next/image";
import * as React from "react";
import { Marker } from "react-map-gl/maplibre";
import { LngLat } from "maplibre-gl";
import { cn } from "~/lib/utils";
import markerIcon from "./marker-icon.svg";
import { useExtendedMap } from "~/hooks/use-extended-map";
import Link from "next/link";

export default function RecipeMarker({
  recipe,
  className,
  animate = true,
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
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
} & Omit<React.ComponentProps<typeof Marker>, "longitude" | "latitude">) {
  const [mouseDown, setMouseDown] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const map = useExtendedMap();
  const [markerDelay, setMarkerDelay] = React.useState(0);
  const [shouldAnimate, setShouldAnimate] = React.useState(false);
  const lastLngLat = React.useRef<LngLat | undefined>(undefined);
  React.useEffect(() => {
    const mapInstance = map.current;
    const lastPos = mapInstance?.getLastCenter();
    if (mapInstance == null || !animate) {
      return;
    }
    if (lastLngLat.current === lastPos) {
      setShouldAnimate(false);
      return;
    }

    const zoomLevel = mapInstance.getZoom();
    let delay = 0;
    const markerLngLat = new LngLat(recipe.position[0], recipe.position[1]);
    const distance = lastPos != null ? markerLngLat.distanceTo(lastPos) : 0;
    delay = Math.min(1000, distance * 0.000005 * zoomLevel ** 2 - 50);
    setMarkerDelay(delay);
    setShouldAnimate(true);
    lastLngLat.current = lastPos;
  }, [animate, recipe.position[0], recipe.position[1]]);

  const handleMouseDown = () => {
    setMouseDown(true);
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    setExpanded((v) => !v);
  };

  const handleMouseEnter = () => {
    setHovered(true);
    setShouldAnimate(false);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMouseDown(false);
  };

  const pressHoverScale = mouseDown ? 0.95 : hovered ? 1.15 : 1;

  return (
    <Marker
      longitude={recipe.position[0]}
      latitude={recipe.position[1]}
      className={cn("-translate-y-2/3", className)}
      style={{ zIndex: expanded ? 10 : 0 }}
      {...props}
    >
      <div
        className={`relative h-16 w-16 cursor-pointer opacity-0 transition ease-in-out`}
        style={{
          animationDelay: `${markerDelay}ms`,
          transition: `0.2s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          animation:
            shouldAnimate && !hovered && !mouseDown
              ? `marker 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${markerDelay}ms both`
              : undefined,
          transform: `scale(${pressHoverScale})`,
          opacity: shouldAnimate ? 0 : 1,
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* eslint-disable */}
        <Image
          alt="Map marker"
          src={markerIcon.src}
          height={markerIcon.height}
          width={markerIcon.width}
        />
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 bg-white transition-all duration-300",
            expanded
              ? "h-56 w-64 rounded-3xl -translate-y-48"
              : "h-12 w-12 rounded-4xl -translate-y-1/2"
          )}
          style={{
            transition:
              "height 220ms, width 300ms, border-radius 300ms, translate 350ms"
          }}
        >
        {/* eslint-enable */}
        {recipe.thumbnailUrl && (
          <div
            className={cn(
              "absolute left-1/2 -translate-x-1/2 transition-all duration-300 overflow-hidden",
              expanded
                ? "top-1/2 h-40 w-60 -translate-y-26 rounded-3xl"
                : "top-1/2 h-16 w-16 -translate-y-1/2 rounded-4xl border-2 border-white"
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
              className="absolute bottom-1 left-0 right-0 px-6 text-gray-600 text-base hover:text-gray-900 transition-all duration-300 text-center line-clamp-2"  /* Need to figure out dark mode styling */
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
            >
              {recipe.title}
            </Link>
          )}
        </div>
      </div>
    </Marker>
  );
}
