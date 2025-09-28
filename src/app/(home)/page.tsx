import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import HomeMap from "./map";
import { Button } from "~/components/ui/button";
import { auth } from "~/auth/server";
import { headers } from "next/headers";
import { cn } from "~/lib/utils";
import { redirect } from "next/navigation";
import { PlusIcon, UserIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export const metadata = {
  title: "Odysseat"
};

export default async function Home() {
  return (
    <HydrateClient>
      <main className="h-screen-minus-navbar">
        <HomeMap />
      </main>
    </HydrateClient>
  );
}
