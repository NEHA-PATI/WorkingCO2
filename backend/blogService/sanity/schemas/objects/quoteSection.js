export default {
  name: "quoteSection",
  title: "Quote Section",
  type: "object",
  fields: [
    {
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(500),
    },
    {
      name: "author",
      title: "Attribution",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: "role",
      title: "Author Role",
      type: "string",
      validation: (Rule) => Rule.max(120),
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
      title: "author",
      subtitle: "quote",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      const shortQuote = subtitle ? `"${subtitle.slice(0, 60)}..."` : "Quote";
      return {
        title: title || "Quote Section",
        subtitle: shortQuote,
      };
    },
  },
};
