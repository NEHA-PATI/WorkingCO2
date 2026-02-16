export default {
  name: "fullWidthImage",
  title: "Full Width Image",
  type: "object",
  fields: [
    {
      name: "image",
      title: "Image",
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: "height",
      title: "Display Height",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      media: "image",
      subtitle: "image.caption",
      height: "height",
    },
    prepare(selection) {
      const { media, subtitle, height } = selection;
      return {
        title: "Full Width Image",
        subtitle: `${height || "medium"}${subtitle ? ` - ${subtitle}` : ""}`,
        media,
      };
    },
  },
};
