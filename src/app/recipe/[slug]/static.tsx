"use client";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import "maplibre-gl/dist/maplibre-gl.css";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/fonts/inter.css";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import RecipeMarker from "~/components/map/recipe-marker";
import ExtendedMap from "~/components/map/extended-map";
import { authClient } from "~/auth/client";

export default function StaticRecipe({
  recipe,
  recipeContentHtml,
  className,
}: {
  recipe: inferRouterOutputs<AppRouter>["recipe"]["getById"];
  recipeContentHtml: string;
  className?: string;
}) {
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const session = authClient.useSession();
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="flex w-full max-w-full flex-col space-y-3 p-3 lg:max-w-7xl">
        <div>
          <h1 className="text-4xl font-bold lg:text-7xl">{recipe.title}</h1>
        </div>
        <div
          className="flex-1"
          dangerouslySetInnerHTML={{ __html: recipeContentHtml }}
        />
        <div
          className={cn(session.data?.user.id !== recipe.userId && "hidden")}
        >
          <Button className="w-full" asChild>
            <Link href={`/recipe/${recipe.id}/edit`}>Edit</Link>
          </Button>
        </div>
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
        <div
          className={cn(
            "h-0 transition-all lg:h-full lg:w-xl",
            isMapOpen && "h-80",
          )}
        >
          <ExtendedMap
            style={{ width: "36rem", height: "100%" }}
            longitude={recipe.position[0]}
            latitude={recipe.position[1]}
            initialViewState={{
              zoom: 5,
            }}
          >
            {recipe.position && <RecipeMarker recipe={recipe} />}
          </ExtendedMap>
        </div>
      </div>
    </div>
  );
}
