'use client';

import * as React from 'react';
import { TRPCError, type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import { GlobeIcon } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { Editor } from './dynamic-editor';
import RecipeMarker from '~/components/map/recipe-marker';
import ExtendedMap, { type ExtendedMapRef } from '~/components/map/extended-map';
import { GeolocateControl } from 'react-map-gl/maplibre';

export default function EditingRecipe({
  value,
}: {
  value: inferRouterOutputs<AppRouter>['recipe']['getById']
}) {
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const recipeUpdateMutation = api.recipe.update.useMutation();
  const form = useForm<inferRouterInputs<AppRouter>['recipe']['update']>({
    defaultValues: value,
  });
  const mapRef = React.useRef<ExtendedMapRef>(null);
  const onSubmit = async (data: inferRouterInputs<AppRouter>['recipe']['update']) => {
    try {
      await recipeUpdateMutation.mutateAsync(data);
    }
    catch (e: unknown) {
      if (e instanceof TRPCError) {
        form.setError("root", { message: e.message });
      }
    }
  }
  return (
    <Form {...form}>
      <form className='flex justify-center min-h-[100vh]' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='w-7xl flex flex-col'>
          <div className='space-y-3 p-3'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input value={value ?? ""} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormControl>
                  <Editor initialValue={field.value ?? ""} onValueChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Save</Button>
        </div>
        <div className='fixed bottom-0 left-0 right-0 lg:sticky lg:top-0 lg:bottom-auto lg:max-h-[100vh]'>
          <div className='lg:hidden absolute right-3 -top-12 h-12'>
            <Button type='button' size="icon" onClick={() => setIsMapOpen(!isMapOpen)}>
              <GlobeIcon />
            </Button>
          </div>
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className={cn("transition-all h-0 lg:w-xl lg:h-full", isMapOpen && "h-80")}>
                <FormControl>
                  <ExtendedMap
                      style={{ height: '100%' }}
                      ref={mapRef}
                      initialViewState={{
                        longitude: field.value?.[0],
                        latitude: field.value?.[1],
                        zoom: 5
                      }}
                      onClick={(e) => {
                        field.onChange([e.lngLat.lng, e.lngLat.lat]);
                        mapRef.current?.getMap().triggerRepaint();
                      }}
                    >
                    <GeolocateControl position="bottom-right" />
                    {
                      form.getValues().position != null && <RecipeMarker
                        key={form.getValues().position?.join("")}
                        recipe={{
                          position: form.getValues().position!,
                          thumbnailUrl: form.getValues().thumbnailUrl ?? null
                        }}
                        isNew={true}
                      />
                    }
                  </ExtendedMap>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}