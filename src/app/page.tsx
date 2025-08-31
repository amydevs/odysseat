import Link from "next/link";

import { LatestPost } from "~/components/post";
import { api, HydrateClient } from "~/trpc/server";
import HomeMap from "../components/homemap";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="h-screen">
          <HomeMap />
      </main>
    </HydrateClient>
  );
}
