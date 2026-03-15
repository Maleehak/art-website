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
  const yearnings = await client.fetch(
    '*[_type == "artwork" && title == "Yearning"]{_id, title, slug, _createdAt}'
  );
  console.log("Found Yearning artworks:", JSON.stringify(yearnings, null, 2));

  if (yearnings.length > 1) {
    // Keep the one with id "artwork-yearning", delete the other
    const toDelete = yearnings.filter((a) => a._id !== "artwork-yearning");
    for (const doc of toDelete) {
      await client.delete(doc._id);
      console.log(`Deleted duplicate: ${doc._id}`);
    }
    console.log("Done! Duplicate removed.");
  } else {
    console.log("No duplicates found.");
  }
}

main().catch(console.error);
