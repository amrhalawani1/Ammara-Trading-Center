export type Geo = { lat: number; lng: number };

/**
 * Approximate pins for the two Amman floors. Al-Bayader sits on the industrial edge of
 * 8th Circle; Al-Wehdat is on Building Materials Street. Replace with surveyed coordinates
 * once ATC confirms the exact door.
 */
export const SHOWROOM_GEO: Record<string, Geo> = {
  "Al-Bayader": { lat: 31.9586, lng: 35.8288 },
  "Al-Wehdat": { lat: 31.9218, lng: 35.9345 },
};

export const showroomGeo = (name: string): Geo | undefined => SHOWROOM_GEO[name];

const queryFor = (name: string, address: readonly string[], geo?: Geo) =>
  geo ? `${geo.lat},${geo.lng}` : `Amara Trading Center ${name}, ${address.join(", ")}`;

/** Google Maps search for a showroom, so directions work with or without pinned coordinates. */
export const mapsHref = (name: string, address: readonly string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryFor(name, address, showroomGeo(name)))}`;

/** Embeddable map centred on the branch. No API key; the iframe is the official Google embed. */
export const mapsEmbedSrc = (name: string, address: readonly string[]) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(queryFor(name, address, showroomGeo(name)))}&z=16&output=embed`;
