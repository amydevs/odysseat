import Link from "next/link";

import { LatestPost } from "~/components/post";
import { api, HydrateClient } from "~/trpc/server";
import HomeMap from "./map";

export default async function Home() {
  // void api.recipe.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="h-screen">
        <HomeMap />
      </main>
    </HydrateClient>
  );
}
