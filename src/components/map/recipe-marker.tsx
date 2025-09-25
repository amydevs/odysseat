"use client";
import Image from "next/image";
import * as React from "react";
import { Marker } from "react-map-gl/maplibre";
import { LngLat } from "maplibre-gl";
import { cn } from "~/lib/utils";
import markerIcon from "./marker-icon.svg";
import { useExtendedMap } from "~/hooks/use-extended-map";

export default function RecipeMarker({
  recipe,
  className,
  animate = true,
  onMouseDown,
  onMouseUp,
  ...props
}: {
  recipe: {
    position: [number, number];
    thumbnailUrl: string | null;
  };
  animate?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
} & Omit<React.ComponentProps<typeof Marker>, "longitude" | "latitude">) {
  const [expanded, setExpanded] = React.useState(false);
  const [mouseDown, setMouseDown] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseDown(true);
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setExpanded((v) => !v);
    setMouseDown(false);
    const mapInstance = map.current;
    if (mapInstance) {
      mapInstance.panTo(new LngLat(recipe.position[0], recipe.position[1]));
    }
    onMouseUp?.(e);
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
        {/* eslint-enable */}
        {recipe.thumbnailUrl && (
          <Image
            width={48}
            height={48}
            src={recipe.thumbnailUrl}
            alt="Thumbnail"
            className="absolute top-1/48 left-1/2 h-15/16 w-15/16 -translate-x-1/2 rounded-full border-1 border-white object-cover"
          />
        )}
      </div>
    </Marker>
  );
}
