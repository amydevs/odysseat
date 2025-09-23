import { redirect, RedirectType } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/server"

export default async function RecipesPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { search } = await searchParams;
    const recipes = await api.recipe.getAll({
        title: search?.toString(),
    });
    const searchAction = async (data: FormData) => {
        "use server";
        const search = data.get("search");
        redirect(`/recipes?search=${search}`, RedirectType.push);
    }
    return <main className="max-w-7xl mx-auto">
        <form className="flex gap-1">
            <Input defaultValue={search} name="search" />
            <Button formAction={searchAction}>
                Search
            </Button>
        </form>
    </main>
}