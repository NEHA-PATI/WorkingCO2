import { createClient } from '@sanity/client';
import { config } from './env.config.js';

export const sanityClient = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  apiVersion: config.sanity.apiVersion,
  token: config.sanity.token,
  useCdn: config.sanity.useCdn,
});

// Test connection
export const testSanityConnection = async () => {
  try {
    await sanityClient.fetch('*[_type == "post"][0]');
    console.log('✅ Sanity connection successful');
    return true;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error.message);
    return false;
  }
};
