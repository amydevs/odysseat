'use client';

import * as React from 'react';
import { type inferRouterInputs } from '@trpc/server';
import type { AppRouter } from '~/server/api/root';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import { GlobeIcon, LoaderIcon } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import RecipeMarker from '~/components/map/recipe-marker';
import ExtendedMap, { type ExtendedMapRef } from '~/components/map/extended-map';
import { GeolocateControl } from 'react-map-gl/maplibre';
import { useUppy } from '~/hooks/use-uppy';
import dynamic from 'next/dynamic';
import { useUppyState } from '@uppy/react';

const MarkdownEditor = dynamic(() => import("./markdown-editor"), { ssr: false });

export default function RecipeForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useFormContext<inferRouterInputs<AppRouter>['recipe']['create'] | inferRouterInputs<AppRouter>['recipe']['update']>();
  const { uppy } = useUppy();
  const currentUploads = useUppyState(uppy!, (u) => u.currentUploads);
  const [currentUploadId, setCurrentUploadId] = React.useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const mapRef = React.useRef<ExtendedMapRef>(null);
  return (
    <form className={cn('flex justify-center', className)} {...props}>
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
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Replace Thumbnail</FormLabel>
                <FormControl>
                  <div className='flex gap-2 items-center'>
                    <Input type='file' onChange={async (e) => {
                      uppy!.cancelAll();
                      const file = e.currentTarget.files?.[0];
                      if (file == null) {
                        return;
                      }
                      const fileId = uppy!.addFile(file);
                      setCurrentUploadId(fileId);
                      
                      const uploadResults = await uppy!.upload();
                      const uploadedFile = uploadResults?.successful?.find((e) => e.id === fileId);
                      if (uploadedFile?.uploadURL == null) {
                        return;
                      }
                      onChange(uploadedFile.uploadURL);
                    }} />
                    <LoaderIcon className={cn("animate-spin", currentUploads[currentUploadId ?? ""] == null && "hidden")} />
                  </div>
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
                <MarkdownEditor initialValue={field.value ?? ""} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Save</Button>
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
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
  )
}