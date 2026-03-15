import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: "2024-01-01",
});

// --- Add CORS origins ---
async function addCorsOrigins() {
  const origins = ["http://localhost:3000", "http://localhost:3333"];
  for (const origin of origins) {
    try {
      const res = await fetch(
        `https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ origin, allowCredentials: true }),
        }
      );
      if (res.ok) {
        console.log(`CORS added: ${origin}`);
      } else {
        const text = await res.text();
        if (text.includes("already exists")) {
          console.log(`CORS already exists: ${origin}`);
        } else {
          console.warn(`CORS failed for ${origin}: ${text}`);
        }
      }
    } catch (err) {
      console.warn(`CORS error for ${origin}:`, err.message);
    }
  }
}

// --- Seed content ---
async function seedContent() {
  console.log("\nChecking existing content...");

  const existingCollections = await client.fetch('count(*[_type == "collection"])');
  if (existingCollections > 0) {
    console.log(`Already have ${existingCollections} collection(s), skipping seed.`);
    return;
  }

  console.log("Seeding initial content...\n");

  // Create collections
  const collections = [
    {
      _type: "collection",
      _id: "collection-abstract",
      title: "Abstract",
      slug: { _type: "slug", current: "abstract" },
      description: "Bold expressions of color and form that transcend the literal, inviting viewers into a world of pure visual emotion.",
      order: 1,
    },
    {
      _type: "collection",
      _id: "collection-figurative",
      title: "Figurative",
      slug: { _type: "slug", current: "figurative" },
      description: "Exploring the human form and emotion through expressive brushwork and intimate compositions.",
      order: 2,
    },
    {
      _type: "collection",
      _id: "collection-landscapes",
      title: "Landscapes",
      slug: { _type: "slug", current: "landscapes" },
      description: "Capturing light, atmosphere, and the quiet poetry of natural and urban spaces.",
      order: 3,
    },
  ];

  for (const col of collections) {
    await client.createOrReplace(col);
    console.log(`  Created collection: ${col.title}`);
  }

  // Create artworks
  const artworks = [
    {
      _type: "artwork",
      _id: "artwork-edge-of-seeing",
      title: "The Edge of Seeing",
      slug: { _type: "slug", current: "the-edge-of-seeing" },
      description: "An exploration of light through layered oils on canvas. The painting captures the liminal space between clarity and abstraction, where forms emerge and dissolve.",
      medium: "Oil on Canvas",
      dimensions: '36" × 48"',
      year: 2024,
      price: 4075,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-abstract" },
    },
    {
      _type: "artwork",
      _id: "artwork-luminescence",
      title: "Luminescence",
      slug: { _type: "slug", current: "luminescence" },
      description: "Soft washes of color capture the fleeting quality of twilight. The interplay between warm and cool tones creates a sense of gentle movement.",
      medium: "Acrylic on Canvas",
      dimensions: '24" × 30"',
      year: 2024,
      price: 1698,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-abstract" },
    },
    {
      _type: "artwork",
      _id: "artwork-somewhere-between",
      title: "Somewhere Between",
      slug: { _type: "slug", current: "somewhere-between" },
      description: "A meditation on the spaces between memory and reality. Mixed media layers build depth and texture, revealing and concealing in equal measure.",
      medium: "Mixed Media",
      dimensions: '30" × 40"',
      year: 2023,
      price: 1359,
      currency: "USD",
      status: "sold",
      featured: true,
      collection: { _type: "reference", _ref: "collection-figurative" },
    },
    {
      _type: "artwork",
      _id: "artwork-standstill",
      title: "Standstill",
      slug: { _type: "slug", current: "standstill" },
      description: "Capturing a moment of perfect stillness amid the chaos. The muted palette and careful composition create a contemplative atmosphere.",
      medium: "Oil on Canvas",
      dimensions: '40" × 50"',
      year: 2024,
      price: 2038,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-landscapes" },
    },
    {
      _type: "artwork",
      _id: "artwork-between-drops",
      title: "Between Drops",
      slug: { _type: "slug", current: "between-drops" },
      description: "The beauty found in rain-washed urban landscapes. Light refracts through water on glass, transforming the ordinary into prismatic wonder.",
      medium: "Oil on Panel",
      dimensions: '24" × 36"',
      year: 2023,
      price: 1698,
      currency: "USD",
      status: "available",
      featured: false,
      collection: { _type: "reference", _ref: "collection-landscapes" },
    },
    {
      _type: "artwork",
      _id: "artwork-passing-lights",
      title: "Passing Lights",
      slug: { _type: "slug", current: "passing-lights" },
      description: "City lights reflected in wet pavement after dark. The painting captures the romance and energy of urban nightscapes through impressionistic brushwork.",
      medium: "Oil on Canvas",
      dimensions: '36" × 48"',
      year: 2024,
      price: 2038,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-landscapes" },
    },
    {
      _type: "artwork",
      _id: "artwork-afterglow",
      title: "Afterglow",
      slug: { _type: "slug", current: "afterglow" },
      description: "The warm remnants of sunset linger across a tranquil horizon. Layers of transparent glazes create a luminous depth that shifts with viewing angle.",
      medium: "Oil on Canvas",
      dimensions: '30" × 40"',
      year: 2024,
      price: 1494,
      currency: "USD",
      status: "available",
      featured: true,
      collection: { _type: "reference", _ref: "collection-abstract" },
    },
    {
      _type: "artwork",
      _id: "artwork-watermarks",
      title: "Watermarks",
      slug: { _type: "slug", current: "watermarks" },
      description: "Inspired by the patterns water leaves on stone. Abstract forms suggest erosion, time, and the persistent shaping of surfaces by gentle forces.",
      medium: "Mixed Media on Canvas",
      dimensions: '48" × 60"',
      year: 2024,
      price: 2717,
      currency: "USD",
      status: "available",
      featured: false,
      collection: { _type: "reference", _ref: "collection-abstract" },
    },
  ];

  for (const art of artworks) {
    await client.createOrReplace(art);
    console.log(`  Created artwork: ${art.title}`);
  }

  // Create artist profile
  const artist = {
    _type: "artist",
    _id: "artist-profile",
    name: "The Artist",
    bio: "With a passion for capturing the ephemeral qualities of light and atmosphere, I create paintings that invite viewers into a world of quiet contemplation. My work draws from the interplay between reality and memory, finding beauty in the spaces between.\n\nWorking primarily in oils and mixed media, each piece begins as an exploration of color relationships and evolves through layers of paint, scraping, and reapplication. The process itself is as important as the finished work — each canvas carries the history of its creation.\n\nBased in Pakistan, I draw inspiration from both the vibrant local landscape and my travels abroad. My work has been exhibited in galleries across South Asia, the Middle East, and Europe.",
    statement: "I paint to understand the world. Each canvas is a question, and the act of painting is my way of searching for answers. I'm drawn to the moments just before and after — the anticipation of dawn, the lingering warmth after sunset, the breath between words. These thresholds are where I find the most truth.",
    socialLinks: {
      instagram: "https://instagram.com",
    },
  };

  await client.createOrReplace(artist);
  console.log(`  Created artist profile: ${artist.name}`);

  // Create sample blog posts
  const posts = [
    {
      _type: "blogPost",
      _id: "post-process-luminescence",
      title: "The Process Behind 'Luminescence'",
      slug: { _type: "slug", current: "process-behind-luminescence" },
      excerpt: "A look at how this piece evolved from a small sketch into a full-scale canvas, and the unexpected turns along the way.",
      publishedAt: "2024-12-15T00:00:00Z",
      tags: ["process", "studio"],
      body: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          children: [{ _type: "span", _key: "s1", text: "Every painting begins as a conversation — sometimes a whisper, sometimes a shout. This piece started with a single observation: the way late afternoon light catches the edge of a window and transforms the ordinary into something luminous." }],
          markDefs: [],
        },
        {
          _type: "block",
          _key: "b2",
          style: "normal",
          children: [{ _type: "span", _key: "s2", text: "I began with a small gouache sketch in my notebook, just trying to capture the color relationship between the warm amber of the light and the cool blue shadows it cast. That sketch sat in my notebook for weeks before I felt ready to scale it up." }],
          markDefs: [],
        },
        {
          _type: "block",
          _key: "b3",
          style: "normal",
          children: [{ _type: "span", _key: "s3", text: "The canvas went through several iterations. I scraped back the paint at least three times, each time getting closer to what I was after but never quite arriving. There's a tension in that process — the gap between what you see in your mind and what appears on the canvas — and I've learned to lean into it rather than fight it." }],
          markDefs: [],
        },
      ],
    },
    {
      _type: "blogPost",
      _id: "post-finding-inspiration",
      title: "Finding Inspiration in Everyday Light",
      slug: { _type: "slug", current: "finding-inspiration-everyday-light" },
      excerpt: "How the quality of light in ordinary moments — a window at dusk, rain on pavement — becomes the starting point for a painting.",
      publishedAt: "2024-11-28T00:00:00Z",
      tags: ["inspiration", "thoughts"],
      body: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          children: [{ _type: "span", _key: "s1", text: "The best paintings don't come from extraordinary moments. They come from paying attention to the ordinary — the way morning light falls across a kitchen table, or how streetlights create halos in fog." }],
          markDefs: [],
        },
        {
          _type: "block",
          _key: "b2",
          style: "normal",
          children: [{ _type: "span", _key: "s2", text: "I keep a small notebook with me at all times. Not for sketching (though I do that too), but for writing down observations about light. The color of shadows at 4pm in winter. The way a red wall reflects onto a white ceiling. These notes become the seeds for paintings months or even years later." }],
          markDefs: [],
        },
      ],
    },
    {
      _type: "blogPost",
      _id: "post-new-collection",
      title: "New Collection: Landscapes of Memory",
      slug: { _type: "slug", current: "new-collection-landscapes-of-memory" },
      excerpt: "Introducing my latest body of work exploring the landscapes we carry within us — places remembered, reimagined, and felt.",
      publishedAt: "2024-10-05T00:00:00Z",
      tags: ["collection", "announcement"],
      body: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          children: [{ _type: "span", _key: "s1", text: "I'm thrilled to share my newest collection, 'Landscapes of Memory'. This body of work represents a year-long exploration of how we remember places — not as photographs, but as emotional impressions layered with time and feeling." }],
          markDefs: [],
        },
        {
          _type: "block",
          _key: "b2",
          style: "normal",
          children: [{ _type: "span", _key: "s2", text: "Each painting in this collection begins with a real place, but through the process of painting, it transforms into something more personal. The hills become steeper, the light more golden, the shadows deeper — reflecting not what was, but what was felt." }],
          markDefs: [],
        },
      ],
    },
  ];

  for (const post of posts) {
    await client.createOrReplace(post);
    console.log(`  Created blog post: ${post.title}`);
  }

  console.log("\nSeeding complete!");
}

async function main() {
  console.log(`Setting up Sanity project: ${projectId}\n`);
  await addCorsOrigins();
  await seedContent();
  console.log("\nDone! Your Sanity project is ready.");
}

main().catch(console.error);
