import { db } from "./index";
import { markers } from "./schema";

async function seed() {
    console.log("Seeeeeeding");
    await db.delete(markers);

    await db.insert(markers).values([
        {
            title: "UTS",
            description: "University",
            longitude: "151.19930",
            latitude: "-33.883993",
            rating: "0"
        },
        {
            title: "The Opera House",
            description: "Boat",
            longitude: "151.2153",
            latitude: "-33.8568",
            rating: "4.5",
        },
        {
            title: "Circular Quay",
            description: "Overpriced ice cream",
            longitude: "151.2111",
            latitude: "-33.8616",
            rating: "2"
        },
        {
            title: "Museum",
            description: "Has a bean outside it",
            longitude: "151.2093",
            latitude: "-33.8599",
            rating: "4.2"
        }
  ]);

    console.log("okay ❤️");
    console.log("yay ❤️");
    process.exit(0); // For some reason doesn't do this normally
}

seed().catch(console.error);