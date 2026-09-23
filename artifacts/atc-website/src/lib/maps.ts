/** Google Maps search for a showroom, by name and address, so directions work without pinned coordinates. */
export const mapsHref = (name: string, address: readonly string[]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Amara Trading Center ${name}, ${address.join(", ")}`)}`;
