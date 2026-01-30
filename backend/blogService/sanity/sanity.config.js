import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Blog CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'wc1ubkix',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    deskTool()
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Custom actions for workflow (future ready)
    actions: (prev, context) => {
      if (context.schemaType === 'post') {
        return prev
      }
      return prev
    },
  },
})
