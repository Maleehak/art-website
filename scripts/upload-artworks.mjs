import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

const IMAGES_DIR = resolve(__dirname, "..", "..", "artwork-images");

async function uploadImage(filename) {
  const filePath = resolve(IMAGES_DIR, filename);
  const stream = createReadStream(filePath);
  const contentType = filename.endsWith(".png") ? "image/png" : "image/jpeg";
  const asset = await client.assets.upload("image", stream, {
    filename,
    contentType,
  });
  console.log(`    Uploaded: ${filename} -> ${asset._id}`);
  return asset._id;
}

async function main() {
  console.log("=== Uploading Artwork Images & Creating Content ===\n");

  // --- Step 1: Delete old artworks ---
  console.log("Cleaning old artworks...");
  const oldArtworks = await client.fetch('*[_type == "artwork"]._id');
  for (const id of oldArtworks) {
    await client.delete(id);
  }
  console.log(`  Removed ${oldArtworks.length} old artworks\n`);

  // --- Step 2: Define artworks with real data ---
  const artworks = [
    {
      id: "artwork-its-raining",
      title: "It's Raining",
      slug: "its-raining",
      filename: "It's Raining - SOLD.jpg",
      alt: "City skyline through rain-covered window at night with bokeh lights",
      collection: "collection-rain",
      medium: "Acrylic on Canvas",
      status: "sold",
      featured: true,
      description:
        "A city skyline glimpsed through a rain-streaked window at night. Droplets trace silver paths down the glass while the lights of the city — amber, teal, crimson — scatter into soft bokeh beyond. The urban world dissolves into an impressionist dreamscape, reminding us that beauty often hides behind the rain we try to escape.",
    },
    {
      id: "artwork-abandoned",
      title: "Abandoned",
      slug: "abandoned",
      filename: "Abandoned - SOLD.jpg",
      alt: "Balcony overlooking lush green forest in the rain with tea cups on table",
      collection: "collection-rain",
      medium: "Acrylic on Canvas",
      status: "sold",
      featured: true,
      description:
        "A forgotten terrace overlooking a lush green forest, rain falling gently through the canopy. Two tea cups sit on a small wooden table — a quiet witness to a conversation interrupted and never resumed. The verdant forest beyond glows with an almost ethereal light, as if the rain has washed the world clean and left something more honest in its place.",
    },
    {
      id: "artwork-believer",
      title: "Believer",
      slug: "believer",
      filename: "Believer - SOLD.jpg",
      alt: "Lone boat on a still turquoise lake surrounded by mountains and dramatic clouds",
      collection: "collection-nature",
      medium: "Acrylic on Canvas",
      status: "sold",
      featured: true,
      description:
        "A solitary figure in a small boat drifts on glass-still water, dwarfed by towering mountains and a sky heavy with clouds. The lake mirrors everything — mountains, sky, solitude — in deep teals and midnight blues. It's a painting about faith in the journey, about the courage it takes to set out alone into the vast and the unknown.",
    },
    {
      id: "artwork-blindsided",
      title: "Blindsided",
      slug: "blindsided",
      filename: "Blindsided.jpg",
      alt: "View through rain-splattered windshield showing street scene with trees and tail lights",
      collection: "collection-rain",
      medium: "Acrylic on Canvas",
      status: "available",
      featured: true,
      price: 20,
      description:
        "The world through a rain-drenched windshield — buildings, trees, and tail lights blur into a cascade of color and water. Every raindrop becomes a tiny lens, refracting the familiar into something strange and beautiful. A moment of being caught off guard by the ordinary, of seeing everything differently because of a little rain.",
    },
    {
      id: "artwork-dont-belong",
      title: "Don't Belong",
      slug: "dont-belong",
      filename: "Don't Belong.jpg",
      alt: "Driving through pine-lined mountain road in the rain seen through windshield",
      collection: "collection-rain",
      medium: "Acrylic on Canvas",
      status: "available",
      featured: true,
      price: 20,
      description:
        "A mountain road cuts through towering pines as rain falls steadily, viewed from inside a car. The dashboard frames the bottom of the scene like a threshold between safety and wilderness. There's a tension between the human need to pass through and nature's quiet indifference — a reminder that some places aren't meant for staying.",
    },
    {
      id: "artwork-its-raining-ii",
      title: "It's Raining II",
      slug: "its-raining-ii",
      filename: "It's Raining (2) - SOLD.jpg",
      alt: "Mountains and teal lake with raindrops creating ripples on the water surface",
      collection: "collection-rain",
      medium: "Acrylic on Canvas",
      status: "sold",
      featured: true,
      description:
        "Rain meets a mountain lake in a study of teal and stone. Dark peaks slope down to water alive with ripples, each one a small event in an otherwise still world. The fog softens the boundary between mountain and sky, creating a landscape that feels both ancient and fleeting — caught in the moment between downpour and calm.",
    },
    {
      id: "artwork-on-the-brink",
      title: "On the Brink",
      slug: "on-the-brink",
      filename: "On the Brink - SOLD.jpg",
      alt: "Bare winter trees with bright red berries in a snowy foggy forest",
      collection: "collection-fall",
      medium: "Acrylic on Canvas",
      status: "sold",
      featured: true,
      description:
        "Bare trees stand sentinel in a winter forest, their dark trunks stark against snow and fog. A single branch holds the last red berries of autumn — vivid, defiant, refusing to let go. Fallen petals dot the snow below like drops of color on a blank page. It's a portrait of the moment between seasons, between holding on and letting go.",
    },
    {
      id: "artwork-reminiscence",
      title: "Reminiscence",
      slug: "reminiscence",
      filename: "Reminiscence.jpg",
      alt: "Winding mountain road through autumn foliage with orange-red colors and pine trees",
      collection: "collection-fall",
      medium: "Acrylic on Canvas",
      status: "available",
      featured: true,
      price: 20,
      description:
        "A road winds through mountains ablaze with autumn color — deep oranges, burnt sienna, and gold cascade down the hillsides while evergreen pines stand watch. Lavender mountains rise in the distance beneath a warm sky. It's a painting about looking back with warmth, about the roads we've traveled and the beauty we carry with us.",
    },
    {
      id: "artwork-secluded",
      title: "Secluded",
      slug: "secluded",
      filename: "Secluded - SOLD.png",
      alt: "Secluded natural landscape painting",
      collection: "collection-nature",
      medium: "Acrylic on Canvas",
      status: "sold",
      featured: false,
      description:
        "A hidden corner of the natural world, far from the noise and haste. This piece captures the quiet luxury of solitude — the kind of place you stumble upon and never want to leave. A celebration of the spaces that exist only for those willing to wander off the beaten path.",
    },
    {
      id: "artwork-yearning",
      title: "Yearning",
      slug: "yearning",
      filename: "Yearning.jpg",
      alt: "Hand pressed against rain-covered window with warm sunset glow behind",
      collection: "collection-rain",
      medium: "Acrylic on Canvas",
      status: "available",
      featured: true,
      price: 20,
      description:
        "A hand reaches toward a rain-streaked window, fingers splayed against the cold glass. Beyond the droplets, a warm sunset glows — amber and rose — impossibly close yet untouchable. It's a painting about longing, about the distance between where we are and where we want to be, separated by nothing more than a pane of glass and the weight of the rain.",
    },
  ];

  // --- Step 3: Upload images and create artworks ---
  for (const art of artworks) {
    console.log(`Processing: ${art.title}...`);

    let imageAssetId;
    try {
      imageAssetId = await uploadImage(art.filename);
    } catch (err) {
      console.error(`  ERROR uploading ${art.filename}:`, err.message);
      continue;
    }

    const doc = {
      _type: "artwork",
      _id: art.id,
      title: art.title,
      slug: { _type: "slug", current: art.slug },
      description: art.description,
      medium: art.medium,
      year: 2024,
      price: art.price || 0,
      currency: "USD",
      status: art.status,
      featured: art.featured,
      collection: { _type: "reference", _ref: art.collection },
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: imageAssetId },
        alt: art.alt,
      },
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ Created: ${art.title} (${art.status})\n`);
  }

  // --- Step 4: Set cover images for collections ---
  console.log("Setting collection cover images...");

  const collectionCovers = {
    "collection-rain": "artwork-its-raining",
    "collection-fall": "artwork-on-the-brink",
    "collection-nature": "artwork-believer",
  };

  for (const [colId, artId] of Object.entries(collectionCovers)) {
    const artDoc = await client.getDocument(artId);
    if (artDoc?.image?.asset) {
      await client.patch(colId).set({
        image: {
          _type: "image",
          asset: artDoc.image.asset,
        },
      }).commit();
      console.log(`  ✓ Set cover for ${colId}`);
    }
  }

  console.log("\n=== All done! ===");
  console.log("Content is now live at: https://maleehak-art-gallery.sanity.studio/");
  console.log("\nSummary:");

  const sold = artworks.filter((a) => a.status === "sold").length;
  const available = artworks.filter((a) => a.status === "available").length;
  console.log(`  Total artworks: ${artworks.length}`);
  console.log(`  Available for sale: ${available} ($20 each)`);
  console.log(`  Sold: ${sold}`);
}

main().catch(console.error);
