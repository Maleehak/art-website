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

async function main() {
  const artworks = await client.fetch('*[_type == "artwork"]{_id, title, price, currency}');
  console.log(`Found ${artworks.length} artworks. Updating all to ₨3,000 PKR...\n`);

  for (const art of artworks) {
    await client.patch(art._id).set({ price: 3000, currency: "PKR" }).commit();
    console.log(`  ✓ ${art.title}: ${art.currency} ${art.price} -> PKR 3,000`);
  }

  console.log("\nDone! All prices updated to ₨3,000 PKR.");
}

main().catch(console.error);
