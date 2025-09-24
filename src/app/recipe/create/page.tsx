import * as React from "react";
import CreatingRecipe from "./editing";
import { getSession } from "~/auth/server";
import { redirect } from "next/navigation";

export default async function BlogPostPage() {
  const session = await getSession();
  if (session?.user == null) {
    redirect("/login");
  }
  return (
    <main className="h-screen-minus-navbar">
      <CreatingRecipe />
    </main>
  );
}
