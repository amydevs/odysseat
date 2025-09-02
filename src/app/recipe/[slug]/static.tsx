"use client";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import 'maplibre-gl/dist/maplibre-gl.css'
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import Map, { Marker, type MapRef } from 'react-map-gl/maplibre';
import { Button } from "~/components/ui/button";
import * as React from "react";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import RecipeMarker from "~/components/map/recipe-marker";
import { LngLat } from 'maplibre-gl';
import ExtendedMap from "~/components/map/extended-map";

export default function StaticRecipe({
  recipe,
  recipeContentHtml,
}: {
  recipe: inferRouterOutputs<AppRouter>['recipe']['getById'];
  recipeContentHtml: string,
}) {
    const [isMapOpen, setIsMapOpen] = React.useState(false);
    return <main className='flex justify-center min-h-[100vh]'>
        <div className='w-7xl flex flex-col space-y-3'>
          <div>
            <h1 className="font-bold text-6xl">{recipe.title}</h1>
          </div>
          <div className="flex-1" dangerouslySetInnerHTML={{ __html: recipeContentHtml }} />
          <div>
            <Button asChild>
              <Link href={`/recipe/${recipe.id}/edit`}>
                Edit
              </Link>
            </Button>
          </div>
        </div>
        <div className='fixed bottom-0 left-0 right-0 lg:sticky lg:top-0 lg:bottom-auto lg:max-h-[100vh]'>
          <div className='lg:hidden absolute right-3 -top-12 h-12'>
            <Button type='button' size="icon" onClick={() => setIsMapOpen(!isMapOpen)}>
              <GlobeIcon />
            </Button>
          </div>
          <div className={cn("transition-all h-0 lg:w-xl lg:h-full", isMapOpen && "h-80")}>
            <ExtendedMap
              style={{ width: '36rem', height: '100%' }}
              initialViewState={{
                longitude: recipe.position[0],
                latitude: recipe.position[1],
                zoom: 5
              }}
              mapStyle="https://api.maptiler.com/maps/streets/style.json?key=Y1LHHXeWTC4l0lTXoIC4"
            >
              {
                recipe.position && <RecipeMarker
                  recipe={recipe}
                  isNew={true}
                />
              }
            </ExtendedMap>
          </div>
        </div>
      </main>;
}