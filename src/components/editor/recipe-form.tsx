"use client";

import * as React from "react";
import { type inferRouterInputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { GlobeIcon, LoaderIcon } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { useUppy } from "~/hooks/use-uppy";
import dynamic from "next/dynamic";
import { useUppyState } from "@uppy/react";
import MapFormField from "./map-form-field";
import RootFormMessage from "../form/root-form-message";

const MarkdownEditor = dynamic(() => import("./markdown-editor"), {
  ssr: false,
});

export default function RecipeForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useFormContext<
    | inferRouterInputs<AppRouter>["recipe"]["create"]
    | inferRouterInputs<AppRouter>["recipe"]["edit"]
  >();
  console.log(form);
  const { uppy } = useUppy();
  const currentUploads = useUppyState(uppy!, (u) => u.currentUploads);
  const [currentUploadId, setCurrentUploadId] = React.useState<string | null>(
    null,
  );
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  return (
    <form className={cn("flex justify-center", className)} {...props}>
      <div className="flex w-full max-w-full flex-col gap-3 p-3 lg:max-w-7xl">
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <input
                    className="w-full appearance-none text-4xl font-bold outline-none focus:ring-0 lg:text-7xl"
                    {...field}
                  />
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
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={async (e) => {
                        uppy!.cancelAll();
                        const file = e.currentTarget.files?.[0];
                        if (file == null) {
                          return;
                        }
                        const fileId = uppy!.addFile(file);
                        setCurrentUploadId(fileId);

                        const uploadResults = await uppy!.upload();
                        const uploadedFile = uploadResults?.successful?.find(
                          (e) => e.id === fileId,
                        );
                        if (uploadedFile?.uploadURL == null) {
                          return;
                        }
                        onChange(uploadedFile.uploadURL);
                      }}
                    />
                    <LoaderIcon
                      className={cn(
                        "animate-spin",
                        currentUploads[currentUploadId ?? ""] == null &&
                          "hidden",
                      )}
                    />
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
            <FormItem className="-mx-3 grid flex-1 grid-cols-1">
              <FormControl>
                <MarkdownEditor
                  initialValue={field.value ?? ""}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
        <RootFormMessage />
      </div>
      <div className="lg:max-h-screen-minus-navbar fixed right-0 bottom-0 left-0 lg:sticky lg:top-[var(--navbar-height)] lg:bottom-auto">
        <div className="absolute -top-24 right-3 h-12 lg:hidden">
          <Button
            type="button"
            size="icon"
            onClick={() => setIsMapOpen(!isMapOpen)}
          >
            <GlobeIcon />
          </Button>
        </div>
        <MapFormField
          className={cn(
            "h-0 transition-all lg:h-full lg:w-xl",
            isMapOpen && "h-80",
          )}
        />
      </div>
    </form>
  );
}
