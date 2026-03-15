import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

async function verify() {
  const artworks = await client.fetch(
    '*[_type == "artwork"] | order(title) { title, status, "collection": collection->title, "hasImage": defined(image.asset) }'
  );
  console.log("ARTWORKS:");
  artworks.forEach((a) =>
    console.log(`  ${a.title} | ${a.status} | ${a.collection} | image: ${a.hasImage}`)
  );

  const cols = await client.fetch(
    '*[_type == "collection"] | order(order) { title, "hasImage": defined(image.asset) }'
  );
  console.log("\nCOLLECTIONS:");
  cols.forEach((c) => console.log(`  ${c.title} | cover: ${c.hasImage}`));

  const artist = await client.fetch(
    '*[_type == "artist"][0] { name, "hasBio": defined(bio), "hasStatement": defined(statement) }'
  );
  console.log("\nARTIST:", JSON.stringify(artist, null, 2));
}

verify().catch(console.error);
