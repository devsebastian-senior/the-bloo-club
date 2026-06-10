import { track as vaTrack } from "@vercel/analytics";

/**
 * Funnel events. Thin wrapper so analytics failures never break the UI and
 * the provider can be swapped without touching call sites.
 *
 * Funnel: wizard_open → wizard_complete → plan_result → checkout_click
 * Side paths: plan_card_click, trial_click.
 */
export function track(
  name: string,
  data?: Record<string, string | number | boolean>
): void {
  try {
    vaTrack(name, data);
  } catch {
    // Analytics must never take the app down.
  }
}
