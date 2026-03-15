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
  const drafts = await client.fetch('*[_id in path("drafts.**")]{_id, _type, title}');
  console.log(`Found ${drafts.length} draft documents:\n`);

  for (const doc of drafts) {
    console.log(`  - ${doc._type}: ${doc.title || doc._id}`);
    await client.delete(doc._id);
    console.log(`    ✓ Deleted`);
  }

  if (drafts.length === 0) {
    console.log("  No drafts found — everything is clean.");
  } else {
    console.log(`\nDone! Removed ${drafts.length} draft documents.`);
  }
}

main().catch(console.error);
