export default {
  name: "imageText",
  title: "Image + Text",
  type: "object",
  fields: [
    {
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    },
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
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "body",
      title: "Text Content",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: "heading",
      media: "image",
      position: "imagePosition",
    },
    prepare(selection) {
      const { title, media, position } = selection;
      return {
        title: title || "Image + Text",
        subtitle: `Image ${position || "left"}`,
        media,
      };
    },
  },
};
