import { defineField, defineType } from "sanity";

export default defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "statement",
      title: "Artist Statement",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "photo",
      title: "Profile Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "studioPhotos",
      title: "Studio Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "twitter", title: "Twitter/X URL", type: "url" }),
      ],
    }),
  ],
});
