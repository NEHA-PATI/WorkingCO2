export default {
  name: "callToAction",
  title: "Call To Action",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(280),
    },
    {
      name: "buttonText",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    },
    {
      name: "buttonUrl",
      title: "Button URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ allowRelative: true }),
    },
    {
      name: "openInNewTab",
      title: "Open In New Tab",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "theme",
      title: "Theme",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "sectionLabel",
      title: "Accessibility Label",
      type: "string",
      description: "Used for aria-label in frontend rendering.",
      validation: (Rule) => Rule.max(120),
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "buttonText",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Call To Action",
        subtitle: subtitle ? `Button: ${subtitle}` : "Missing button text",
      };
    },
  },
};
