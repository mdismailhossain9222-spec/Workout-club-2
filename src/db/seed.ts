/**
 * Seed payloads derived from the config files (single source of truth).
 * Feed these straight into supabase.from(table).upsert(rows).
 */
import { PRICE_MATRIX, PACKAGE_FEATURES, OFFER } from "@/config/pricing";
import { BRANCHES } from "@/config/branches";
import { TRAINERS } from "@/config/content";

export const packageRows = PRICE_MATRIX.map((p) => ({
  time_slot: p.time_slot,
  duration_months: p.duration_months,
  original_price_tk: p.original_price_tk,
  discounted_price_tk: p.discounted_price_tk,
  is_offer_active: OFFER.active,
  features: PACKAGE_FEATURES[p.duration_months],
  label: p.label ?? null,
}));

export const branchRows = BRANCHES.map((b) => ({
  slug: b.slug,
  name: b.name,
  address: b.address,
  phone: b.phone,
  map_query: b.mapQuery,
  lat: b.lat ?? null,
  lng: b.lng ?? null,
  photos: b.photos,
  facilities: b.facilities,
}));

export const trainerRows = TRAINERS.map((t) => ({
  name: t.name,
  role: t.role,
  specialty: t.specialty,
  photo: t.photo,
  is_founder: !!t.isFounder,
  is_featured: !!t.isFeatured,
  sort_order: t.sort,
  modes: t.modes,
}));
