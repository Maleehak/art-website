import { defineField, defineType } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      description: 'e.g. "Oil on Canvas", "Acrylic on Panel"',
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      description: 'e.g. 36" × 48"',
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "USD", value: "USD" },
          { title: "PKR", value: "PKR" },
          { title: "EUR", value: "EUR" },
          { title: "GBP", value: "GBP" },
        ],
      },
      initialValue: "USD",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Sold", value: "sold" },
          { title: "Reserved", value: "reserved" },
        ],
      },
      initialValue: "available",
    }),
    defineField({
      name: "collection",
      title: "Collection",
      type: "reference",
      to: [{ type: "collection" }],
    }),
    defineField({
      name: "image",
      title: "Main Image",
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
      name: "images",
      title: "Additional Images",
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
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "salePrice",
      title: "Sale Price",
      type: "number",
      description: "Discounted price during the flash sale",
      validation: (rule) => rule.min(0),
      group: "sale",
    }),
    defineField({
      name: "saleStart",
      title: "Sale Start Time",
      type: "datetime",
      description: "When the flash sale begins",
      group: "sale",
    }),
    defineField({
      name: "saleDurationHours",
      title: "Sale Duration (hours)",
      type: "number",
      description: "How long the sale lasts (1-24 hours)",
      validation: (rule) => rule.min(1).max(24),
      group: "sale",
    }),
  ],
  groups: [
    { name: "sale", title: "Flash Sale", default: false },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      status: "status",
    },
    prepare(selection) {
      const { title, media, status } = selection;
      return {
        title,
        subtitle: status?.toUpperCase(),
        media,
      };
    },
  },
});
