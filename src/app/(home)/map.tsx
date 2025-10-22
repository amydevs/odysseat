"use client";
import * as React from "react";
import { LngLat } from "maplibre-gl";
import { GeolocateControl, Popup } from "react-map-gl/maplibre";
import { api } from "~/trpc/react";
import { useDebouncedCallback } from "use-debounce";
import RecipeMarker from "~/components/map/recipe-marker";
import "maplibre-gl/dist/maplibre-gl.css"; // Required CSS for MapLibre GL to render marker positions correctly
import ExtendedMap, {
  type ExtendedMapRef,
} from "~/components/map/extended-map";

export default function HomeMap() {
  const mapRef = React.useRef<ExtendedMapRef>(null);

  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const [bounds, setBounds] = React.useState<{
    northWest: LngLat;
    southEast: LngLat;
  } | null>(null);

  const { data: markers } = api.recipe.getAll.useQuery(
    {
      minPosition: bounds?.northWest.toArray(),
      maxPosition: bounds?.southEast.toArray(),
    },
    { enabled: bounds != null, placeholderData: (prev) => prev },
  );

  const updateBounds = useDebouncedCallback(() => {
    if (mapRef.current) {
      const mapBounds = mapRef.current.getBounds();
      setBounds({
        northWest: mapBounds.getNorthWest(),
        southEast: mapBounds.getSouthEast(),
      });
    }
  }, 200);

  return (
    <ExtendedMap
      ref={mapRef}
      style={{ width: "100%", height: "100%" }}
      initialViewState={{
        longitude: 151.1993,
        latitude: -33.883993,
        zoom: 5,
      }}
      onLoad={updateBounds}
      onMove={updateBounds}
    >
      <GeolocateControl position="bottom-right" />
      {markers?.map((marker) => (
        <RecipeMarker
          key={marker.id} // Needs to stay marker.id so that recipes with same id doesnt rerender
          recipe={marker}
          expanded={selectedId === marker.id}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedId(selectedId === marker.id ? null : marker.id);
            if (mapRef.current != null) {
              mapRef.current.panTo(
                new LngLat(marker.position[0], marker.position[1]),
              );
            }
          }}
        />
      ))}
    </ExtendedMap>
  );
}
