export default {
  name: "gallery",
  title: "Gallery",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Gallery Title",
      type: "string",
      validation: (Rule) => Rule.max(120),
    },
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alternative Text",
              type: "string",
              validation: (Rule) => Rule.required().max(120),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
              validation: (Rule) => Rule.max(180),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(2).max(12),
    },
    {
      name: "columns",
      title: "Desktop Columns",
      type: "number",
      initialValue: 3,
      validation: (Rule) => Rule.required().integer().min(2).max(4),
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0",
      count: "images",
    },
    prepare(selection) {
      const { title, media, count } = selection;
      return {
        title: title || "Gallery",
        subtitle: `${count?.length || 0} images`,
        media,
      };
    },
  },
};
