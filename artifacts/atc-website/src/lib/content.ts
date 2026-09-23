/** Contact details sourced from the ATC company profile. Verify before print or ads. */
export const company = {
  name: "Amara Trading Center",
  email: "info@amara.jo",
  /** WhatsApp is the formal trade contact channel. PLACEHOLDER number - confirm with Ahmad before launch. */
  whatsapp: { number: "962790000000", display: "+962 79 000 0000" },
  established: 1977,
  contactUnconfirmed: true,
  contactNote:
    "Phone numbers and the public inbox are from the company profile and should be confirmed before print or advertising.",
  showrooms: [
    {
      name: "Al-Bayader",
      role: "Flagship",
      addressLines: ["Industrial Area, 8th Circle", "Amman, Jordan"],
      phone: "+962 6 581 0000",
      hours: "Sat - Thu, 9AM - 6PM",
    },
    {
      name: "Al-Wehdat",
      role: "Trade & Retail",
      addressLines: ["Building Materials St.", "Amman, Jordan"],
      phone: "+962 6 477 0000",
      hours: "Sat - Thu, 8AM - 5PM",
    },
  ],
} as const;
