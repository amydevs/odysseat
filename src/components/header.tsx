"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "~/lib/utils";
import MobileNavbar from "./mobile-navbar";
import { type Route } from "~/lib/types";
import { Menu, PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type { User } from "better-auth";
import UserDropdown from "./user-dropdown";
import { Button } from "~/components/ui/button";
import { Toggle } from "./ui/toggle";

const Header = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    routes: Array<Route>;
    user?: User;
  }
>(({ routes, user, className, ...props }, ref) => {
  const [mobileEnable, setMobileEnable] = React.useState(false);
  const pathname = usePathname();

  const processedRoutes = React.useMemo(
    () =>
      routes.map((e) => {
        let current = e.path === pathname;
        if (e.currentPathRegex != null) {
          current = new RegExp(e.currentPathRegex).test(pathname);
        }
        return {
          ...e,
          current,
        };
      }),
    [routes, pathname],
  );

  React.useEffect(() => {
    setMobileEnable(false);
  }, [pathname]);

  return (
    <>
      <div
        ref={ref}
        className={cn(
          `h-navbar bg-background z-50 flex gap-3 py-6 text-lg font-medium transition-all`,
          className,
          mobileEnable && "bg-background dark:bg-background shadow-none",
        )}
        {...props}
      >
        <div>
          <Link className="hover:text-primary transition-all" href="/">
            <span className="text-primary">Odysseat</span>
          </Link>
        </div>

        <nav className="ml-auto hidden gap-6 md:flex">
          {processedRoutes.map((route, i) => (
            <Link
              className={cn(
                "hover:text-primary transition-all",
                route.current && "text-primary",
              )}
              href={route.path}
              key={i}
            >
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex -translate-1 gap-1 md:ml-0">
          {user != null && (
            <Button variant={"ghost"} size={"icon"} asChild>
              <Link href={"/recipe/create"}>
                <PlusIcon />
              </Link>
            </Button>
          )}
          <UserDropdown user={user} />
          <Toggle
            className={cn(
              `transition-all md:hidden`,
              mobileEnable && "rotate-90",
            )}
            pressed={mobileEnable}
            onPressedChange={setMobileEnable}
            title="Toggle Nav Menu"
          >
            <Menu />
          </Toggle>
        </div>
      </div>

      <MobileNavbar
        routes={routes}
        className={cn(
          `auto-limit-w fixed inset-0 top-20 -z-10 max-h-screen transition-all md:hidden`,
          !mobileEnable && "-top-full",
        )}
      />
    </>
  );
});
Header.displayName = "Header";

export default Header;
