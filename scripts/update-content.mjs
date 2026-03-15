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

async function updateContent() {
  console.log("Updating site content...\n");

  // --- Update Artist Profile ---
  const artist = {
    _type: "artist",
    _id: "artist-profile",
    name: "Maleeha Khalid",
    bio: `Art has been my companion since childhood — I first picked up a brush at five years old, drawn to the way colors could capture what words couldn't. Life took me on a different path through engineering and software development, but the pull of painting never faded.

During the COVID-19 lockdowns, I rediscovered my creative voice. What began as a quiet return to the canvas became something deeper — a daily practice of observing, feeling, and translating the natural world into paint. The rain on a window, the golden haze of autumn, the stillness of a moonlit night — these moments became my subjects.

Balancing a full-time career in software engineering with my art practice isn't always easy, but I've come to see the two as complementary. Engineering taught me patience and precision; painting teaches me to let go and trust the process. Each canvas is a conversation between discipline and intuition.`,
    statement: `I paint what I feel when I stand still long enough to notice. The world is full of quiet beauty — rain tracing paths down glass, leaves surrendering to autumn, moonlight softening the edges of everything it touches. My work is an invitation to pause and see these moments the way I do: not as scenery, but as poetry.

Nature doesn't perform for us. It simply exists, endlessly creating patterns of light, color, and texture. I try to honor that honesty in my paintings — capturing not a photograph of a scene, but the emotion of being present within it. Every brushstroke carries a feeling, every palette choice reflects a mood.

My hope is that each piece creates a moment of stillness for the viewer — a breath between the noise of daily life.`,
    socialLinks: {
      instagram: "https://www.instagram.com/maleehakhalid_art/",
    },
  };

  await client.createOrReplace(artist);
  console.log("  ✓ Updated artist profile: Maleeha Khalid");

  // --- Delete old artworks first (they reference collections) ---
  const oldArtworks1 = await client.fetch('*[_type == "artwork"]._id');
  for (const id of oldArtworks1) {
    await client.delete(id);
  }
  console.log(`  ✓ Removed ${oldArtworks1.length} old artworks`);

  // --- Delete old blog posts ---
  const oldPosts1 = await client.fetch('*[_type == "blogPost"]._id');
  for (const id of oldPosts1) {
    await client.delete(id);
  }
  console.log(`  ✓ Removed ${oldPosts1.length} old blog posts`);

  // --- Delete old collections ---
  const oldCollections = await client.fetch('*[_type == "collection"]._id');
  for (const id of oldCollections) {
    await client.delete(id);
  }
  console.log(`  ✓ Removed ${oldCollections.length} old collections`);

  // --- Create new collections ---
  const collections = [
    {
      _type: "collection",
      _id: "collection-rain",
      title: "Rain",
      slug: { _type: "slug", current: "rain" },
      description: "The rhythm of rainfall — capturing the beauty of wet streets, misty windows, and the quiet introspection that comes with overcast skies.",
      order: 1,
    },
    {
      _type: "collection",
      _id: "collection-fall",
      title: "Fall",
      slug: { _type: "slug", current: "fall" },
      description: "The golden farewell of autumn — warm ochres, burnt siennas, and the bittersweet beauty of leaves letting go.",
      order: 2,
    },
    {
      _type: "collection",
      _id: "collection-moon",
      title: "Moon",
      slug: { _type: "slug", current: "moon" },
      description: "Nocturnal meditations — the gentle glow of moonlight transforming ordinary landscapes into dreamscapes of silver and shadow.",
      order: 3,
    },
    {
      _type: "collection",
      _id: "collection-nature",
      title: "Trees, Birds & Fog",
      slug: { _type: "slug", current: "trees-birds-fog" },
      description: "The quiet poetry of nature — solitary trees, birds in flight, and the soft embrace of morning fog dissolving the boundaries between earth and sky.",
      order: 4,
    },
  ];

  for (const col of collections) {
    await client.createOrReplace(col);
    console.log(`  ✓ Created collection: ${col.title}`);
  }

  // --- Create new artworks ---
  const artworks = [
    {
      _type: "artwork",
      _id: "artwork-rain-on-glass",
      title: "Rain on Glass",
      slug: { _type: "slug", current: "rain-on-glass" },
      description: "Raindrops trace their paths down a windowpane, blurring the world beyond into a soft wash of color and light. A meditation on the beauty found in rainy days.",
      medium: "Acrylic on Canvas",
      dimensions: '12" × 16"',
      year: 2024,
      price: 20,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-rain" },
    },
    {
      _type: "artwork",
      _id: "artwork-autumn-path",
      title: "Autumn Path",
      slug: { _type: "slug", current: "autumn-path" },
      description: "A winding path disappears beneath a canopy of golden and amber leaves, inviting the viewer to step into the warmth of an autumn afternoon.",
      medium: "Acrylic on Canvas",
      dimensions: '12" × 16"',
      year: 2024,
      price: 20,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-fall" },
    },
    {
      _type: "artwork",
      _id: "artwork-moonlit-silence",
      title: "Moonlit Silence",
      slug: { _type: "slug", current: "moonlit-silence" },
      description: "A full moon hangs low over a tranquil landscape, casting silver light across still water and sleeping trees. The world holds its breath.",
      medium: "Acrylic on Canvas",
      dimensions: '12" × 16"',
      year: 2024,
      price: 20,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-moon" },
    },
    {
      _type: "artwork",
      _id: "artwork-morning-fog",
      title: "Morning Fog",
      slug: { _type: "slug", current: "morning-fog" },
      description: "Trees emerge from a blanket of morning fog, their silhouettes soft and uncertain. A study in atmosphere and the beauty of things half-seen.",
      medium: "Acrylic on Canvas",
      dimensions: '12" × 16"',
      year: 2023,
      price: 20,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-nature" },
    },
    {
      _type: "artwork",
      _id: "artwork-rainy-street",
      title: "Rainy Street",
      slug: { _type: "slug", current: "rainy-street" },
      description: "Reflections shimmer on wet pavement as rain transforms an ordinary street into a canvas of mirrored light and muted color.",
      medium: "Acrylic on Canvas",
      dimensions: '12" × 16"',
      year: 2024,
      price: 20,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-rain" },
    },
    {
      _type: "artwork",
      _id: "artwork-birds-in-flight",
      title: "Birds in Flight",
      slug: { _type: "slug", current: "birds-in-flight" },
      description: "A flock of birds rises against a pale sky, their forms dancing between freedom and togetherness. A celebration of movement and the open sky.",
      medium: "Acrylic on Canvas",
      dimensions: '12" × 16"',
      year: 2023,
      price: 20,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-nature" },
    },
  ];

  for (const art of artworks) {
    await client.createOrReplace(art);
    console.log(`  ✓ Created artwork: ${art.title}`);
  }

  console.log("\n✓ All content updated successfully!");
  console.log("\nNext steps:");
  console.log("  1. Save your artwork images to: artwork-images/");
  console.log("  2. Tell me the filenames and I'll upload them to Sanity");
  console.log("  3. Or upload them directly at https://maleehak-art-gallery.sanity.studio/");
}

updateContent().catch(console.error);
