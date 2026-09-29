/** Contact details sourced from the ATC company profile. Verify before print or ads. */
export const company = {
  name: "Amara Trading Center",
  email: "info@amara.jo",
  /** Public Instagram, from the company profile. */
  instagram: { handle: "@atc.jo", href: "https://www.instagram.com/atc.jo/" },
  /** WhatsApp is the formal trade contact channel. PLACEHOLDER number - confirm with Ahmad before launch. */
  whatsapp: { number: "962790000000", display: "+962 79 000 0000" },
  established: 1977,
  /** Partner brands ATC represents in Jordan (Notion "Brands" lists 32). The online catalogue carries fewer, so never count it. */
  partnerBrands: 30,
  showrooms: [
    {
      name: "Al-Bayader",
      role: "Flagship",
      addressLines: ["Industrial Area, 8th Circle", "Amman, Jordan"],
      phone: "+962 6 581 0000",
      hours: "Sat–Thu, 9 am–6 pm",
    },
    {
      name: "Al-Wehdat",
      role: "Trade & Retail",
      addressLines: ["Building Materials St.", "Amman, Jordan"],
      phone: "+962 6 477 0000",
      hours: "Sat–Thu, 8 am–5 pm",
    },
  ],
} as const;
