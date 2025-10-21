import type { RouterInputs } from "~/trpc/react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { GeolocateControl } from "react-map-gl/maplibre";
import ExtendedMap from "../map/extended-map";
import RecipeMarker from "../map/recipe-marker";
import type React from "react";

export default function MapFormField(
  props: React.ComponentProps<typeof FormItem>,
) {
  const form = useFormContext<
    RouterInputs["recipe"]["create"] | RouterInputs["recipe"]["edit"]
  >();
  return (
    <FormField
      control={form.control}
      name="position"
      render={({ field }) => (
        <FormItem {...props}>
          <FormControl>
            <ExtendedMap
              style={{ height: "100%" }}
              initialViewState={{
                longitude: field.value?.[0],
                latitude: field.value?.[1],
                zoom: 5,
              }}
              onClick={(e) => {
                field.onChange([e.lngLat.lng, e.lngLat.lat]);
              }}
            >
              <GeolocateControl position="bottom-right" />
              {form.getValues().position != null && (
                <RecipeMarker
                  key={form.getValues().position?.join("")}
                  recipe={{
                    id: 0,
                    title: form.getValues().title!,
                    position: form.getValues().position!,
                    thumbnailUrl: form.getValues().thumbnailUrl ?? null,
                  }}
                />
              )}
            </ExtendedMap>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
