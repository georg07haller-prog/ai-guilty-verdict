import { base44 } from '@/api/base44Client';

/** Sends one funnel event. Never breaks the feature it is attached to. */
export function track(eventName, properties = {}) {
  try {
    base44.analytics.track({ eventName, properties });
  } catch (error) {
    console.error('Analytics event failed:', error);
  }
}