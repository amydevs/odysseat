import Link from "next/link";
import React from "react";
import { cn } from "~/lib/utils";
import { type Route } from "~/lib/types";

const MobileNavbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    routes: Array<Route>;
  }
>(({ routes, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("bg-background text-lg font-medium", className)}
    {...props}
  >
    <nav className="flex flex-col gap-6">
      {routes.map((route, i) => (
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
  </div>
));
MobileNavbar.displayName = "MobileNavbar";

export default MobileNavbar;
