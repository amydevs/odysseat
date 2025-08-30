import * as c from "cheerio";
import * as geojson from "./countries.geo.json";
import * as fs from "node:fs";
import { bbox, multiPolygon, randomPosition } from "@turf/turf";

const includedCountries = [
    "Afghanistan",
    "Algeria",
    "Angola",
    "Antarctica",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Canada",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Denmark",
    "East Timor",
    "Ecuador",
    "Egypt",
    "Estonia",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "Gabon",
    "Georgia",
    "Germany",
    "Greece",
    "Greenland",
    "Guinea",
    "Guyana",
    "Haiti",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Italy",
    "Jamaica",
    "Japan",
    "Kenya",
    "Laos",
    "Latvia",
    "Lebanon",
    "Liberia",
    "Libya",
    "Macedonia",
    "Madagascar",
    "Malaysia",
    "Mali",
    "Malta",
    "Mexico",
    "Mongolia",
    "Morocco",
    "Myanmar",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Panama",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Romania",
    "Russia",
    "Senegal",
    "Sierra Leone",
    "Solomon Islands",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Thailand",
    "The Bahamas",
    "Togo",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vietnam",
    "Yemen",
];

const countryNameMap: Record<string, string> = {
    "United States of America": "America",
    "United Kingdom": "Britain",
}

const defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0"
}

const countryProms = geojson.features
    .filter((country) => includedCountries.includes(country.properties.name))
    .map(async (country) => {
        const countryName = countryNameMap[country.properties.name] ?? country.properties.name;
        const mp = multiPolygon(
            country.geometry.type === "MultiPolygon" ? country.geometry.coordinates : [country.geometry.coordinates] as any
        );
        const b = bbox(mp, { recompute: true });
        const position = randomPosition(b);
        const req = await fetch(`https://www.taste.com.au/search-recipes/?q=${countryName}&ct=recipes`, {
            headers: defaultHeaders
        });
        const text = await req.text();
        const $ = c.load(text);
        const resultsCount = Number.parseInt($(".number-results-found .count").text());
        if (resultsCount === 0) {
            return undefined;
        }
        const link = $(".main-content-container .list-items article a");
        return {
            countryName,
            coordinates: position,
            url: `https://www.taste.com.au${link.prop("href")}`,
        };
    })
    .filter(async (e) => (await e) != null);

const countryResults = await Promise.all(countryProms);

const recipeProms = countryResults.map(async (recipe) => {
    const res = await fetch(recipe!.url, { headers: defaultHeaders });
    const $ = c.load(await res.text());
    const title = $(".recipe-title-container h1").text().trim();
    $(".annotation").remove().replaceWith("").empty();
    const steps: string[] = [];
    $("ul.recipe-method-steps > li > .recipe-method-step-content").each((_, e) => { steps.push($(e).text().trim()) });
    const ingredients: string[] = [];
    $(".recipe-ingredients-section > ul > li > .ingredient-description").each((_, e) => { ingredients.push($(e).prop("data-raw-ingredient")) });
    let thumbnailUrl = $(".lead-image-block > img").prop("src");
    if (!thumbnailUrl?.startsWith("http")) {
        thumbnailUrl = `https://www.taste.com.au${thumbnailUrl}`;
    }
    return {
        title,
        steps,
        ingredients,
        coordinates: recipe!.coordinates,
        thumbnailUrl,
    };
});



await fs.promises.writeFile(
    import.meta.dirname + "/recipes.json",
    JSON.stringify(
        await Promise.all(recipeProms),
        null,
        4
    )
)