"use client";

import type { User } from "better-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { UserIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { authClient } from "~/auth/client";
import { useRouter } from "next/navigation";
import { Toggle } from "./ui/toggle";
import React from "react";

const ThemeSwitch = dynamic(() => import("./theme-switch"), { ssr: false });

export default function UserDropdown({ user }: { user?: User }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Toggle pressed={open}>
          <UserIcon />
        </Toggle>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user == null ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={"/login"}>Log In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/signup"}>Sign Up</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>Welcome, {user.name}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                router.push("/");
                router.refresh();
              }}
            >
              Logout
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <ThemeSwitch>
          {(theme) => (
            <DropdownMenuItem
              onClick={() => {
                const newTheme =
                  theme.resolvedTheme == "dark" ? "light" : "dark";
                theme.setTheme(newTheme);
              }}
              className="hover:text-primary"
              title="Toggle Theme"
              role="switch"
              aria-checked={theme.resolvedTheme == "dark"}
            >
              {theme.resolvedTheme == "dark" ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
          )}
        </ThemeSwitch>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
