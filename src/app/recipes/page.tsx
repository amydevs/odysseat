import Image from "next/image";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
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
    return <main className="max-w-7xl mx-auto space-y-3 p-3">
        <form className="flex gap-1">
            <Input defaultValue={search} name="search" />
            <Button formAction={searchAction}>
                Search
            </Button>
        </form>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-3">
            {
                recipes.map((r) => (
                    <Card key={r.id}>
                        <CardHeader>
                            <Image alt={r.title} src={r.thumbnailUrl ?? ""} className="w-full aspect-video object-cover" width={400} height={300}  />
                            <CardTitle className="text-ellipsis whitespace-nowrap overflow-hidden">{r.title}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <Button asChild>
                                <Link href={`/recipe/${r.id}`}>
                                    View
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            }
        </div>
    </main>
}