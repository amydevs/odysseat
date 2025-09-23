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
import { useUppy } from '~/hooks/use-uppy';
import dynamic from 'next/dynamic';
import { useUppyState } from '@uppy/react';
import MapFormField from './map-form-field';
import RootFormMessage from '../form/root-form-message';

const MarkdownEditor = dynamic(() => import("./markdown-editor"), { ssr: false });

export default function RecipeForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useFormContext<inferRouterInputs<AppRouter>['recipe']['create'] | inferRouterInputs<AppRouter>['recipe']['edit']>();
  console.log(form);
  const { uppy } = useUppy();
  const currentUploads = useUppyState(uppy!, (u) => u.currentUploads);
  const [currentUploadId, setCurrentUploadId] = React.useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  return (
    <form className={cn('flex justify-center', className)} {...props}>
      <div className='w-full max-w-full lg:max-w-7xl flex flex-col gap-3 p-3'>
        <div className='space-y-3'>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input className='text-4xl lg:text-7xl font-bold w-full appearance-none outline-none focus:ring-0' {...field} />
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
            <FormItem className='grid grid-cols-1 flex-1 -mx-3'>
              <FormControl>
                <MarkdownEditor initialValue={field.value ?? ""} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Save</Button>
        <RootFormMessage />
      </div>
      <div className='fixed bottom-0 left-0 right-0 lg:sticky lg:top-[var(--navbar-height)] lg:bottom-auto lg:max-h-screen-minus-navbar'>
        <div className='lg:hidden absolute right-3 -top-24 h-12'>
          <Button type='button' size="icon" onClick={() => setIsMapOpen(!isMapOpen)}>
            <GlobeIcon />
          </Button>
        </div>
        <MapFormField className={cn("transition-all h-0 lg:w-xl lg:h-full", isMapOpen && "h-80")} />
      </div>
    </form>
  )
}