import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import HomeMap from "./map";
import { Button } from "~/components/ui/button";
import { auth } from "~/auth/server";
import { headers } from "next/headers";
import { cn } from "~/lib/utils";
import { redirect } from "next/navigation";
import { PlusIcon, UserIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";

export default async function Home() {
  // void api.recipe.getAll.prefetch();
  const session = await auth.api.getSession({ headers: await headers() });

  const signOutAction = async () => {
    "use server";
    const res = await auth.api.signOut({ headers: await headers() });
    if (res.success) {
      redirect("/");
    }
  };

  return (
    <HydrateClient>
      <main className="h-screen relative">
        <HomeMap />
        <div className="absolute top-2 right-2">
          <div className={cn("flex gap-1 items-center justify-center", session?.user != null && "hidden")}>
            <Button className={cn(session?.user != null && "hidden")} asChild>
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button  asChild>
              <Link href={"/signup"}>Signup</Link>
            </Button>
          </div>
          <div className={cn("flex gap-1 items-center justify-center", session?.user == null && "hidden")}>
            <Button asChild>
              <Link href={"/recipe/create"}>
                <PlusIcon />
              </Link>
            </Button>
            <Tooltip>
              <TooltipTrigger>
                <Button size={"icon"}>
                  <UserIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{session?.user.username}</p>
              </TooltipContent>
            </Tooltip>
            <form action={signOutAction}>
              <Button type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
