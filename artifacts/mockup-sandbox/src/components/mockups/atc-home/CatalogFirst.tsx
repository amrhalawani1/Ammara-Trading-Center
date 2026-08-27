import { ArrowUpRight, ChevronRight, Menu, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

type Product = { name: string; brand: string; category: string; detail: string; image: string; tag?: string };

const products: Product[] = [
  { name: "Lift-Up Systems", brand: "Blum", category: "Opening systems", detail: "Smooth, weightless motion for wall cabinets.", image: "/__mockup/images/atc-hero-kitchen.jpg", tag: "Most specified" },
  { name: "Drawer Systems", brand: "Hettich", category: "Opening systems", detail: "Precision runners with a quiet close.", image: "/__mockup/images/atc-showroom-wide.jpg" },
  { name: "Pantry Pull-Out", brand: "Kesseböhmer", category: "Storage", detail: "Make every centimetre of a tall cabinet work harder.", image: "/__mockup/images/atc-trade-workshop.jpg" },
  { name: "Lighting Profiles", brand: "Loox", category: "Lighting", detail: "A considered glow, built into the joinery.", image: "/__mockup/images/atc-showroom-wide.jpg", tag: "New arrival" },
];

const categories = ["All products", "Opening systems", "Storage", "Lighting", "Furniture fittings"];

function NavLink({ children, active = false, onClick }: { children: string; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`relative py-2 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${active ? "text-[#9c392b]" : "text-[#766e63] hover:text-[#292723]"}`}>
    {children}{active && <span className="absolute -bottom-1 left-0 h-px w-full bg-[#9c392b]" />}
  </button>;
}

function BrandMark() {
  return <div className="flex items-center gap-3"><div className="flex h-6 items-end gap-[3px]"><i className="h-3 w-[3px] -skew-x-12 bg-[#9c392b]" /><i className="h-5 w-[3px] -skew-x-12 bg-[#9c392b]" /><i className="h-4 w-[3px] -skew-x-12 bg-[#9c392b]" /></div><div><div className="font-serif text-[19px] leading-none tracking-[.24em] text-[#292723]">AMARA</div><div className="mt-1 text-[8px] font-bold uppercase tracking-[.25em] text-[#9c392b]">Trading Center</div></div></div>;
}

function ProductTile({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) {
  return <button onClick={() => onSelect(product)} className="group text-left">
    <div className="relative mb-4 aspect-[1.35/1] overflow-hidden bg-[#ded8ca]">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover grayscale-[35%] transition-transform duration-700 group-hover:scale-105" />
      {product.tag && <span className="absolute left-3 top-3 bg-[#f4f0e8] px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#9c392b]">{product.tag}</span>}
      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f0e8] text-[#9c392b] opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={16} /></span>
    </div>
    <div className="flex items-start justify-between gap-3"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#9c392b]">{product.brand}</p><h3 className="font-serif text-xl text-[#292723]">{product.name}</h3><p className="mt-2 max-w-[220px] text-xs leading-relaxed text-[#766e63]">{product.detail}</p></div><ChevronRight size={17} className="mt-1 shrink-0 text-[#9d9588] transition-transform group-hover:translate-x-1" /></div>
  </button>;
}

export function CatalogFirst() {
  const [selectedCategory, setSelectedCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const visibleProducts = useMemo(() => products.filter((p) => (selectedCategory === "All products" || p.category === selectedCategory) && `${p.name} ${p.brand}`.toLowerCase().includes(query.toLowerCase())), [selectedCategory, query]);

  return <div className="min-h-screen bg-[#f4f0e8] text-[#292723]" style={{ fontFamily: "var(--font-sans, 'DM Sans', sans-serif)" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap');
      .catalog-first * { box-sizing: border-box; } .catalog-first { font-family: 'DM Sans', sans-serif; } .catalog-first h1,.catalog-first h2,.catalog-first h3 { font-family: 'Playfair Display', serif; }
    `}</style>
    <div className="catalog-first">
      <header className="border-b border-[#d8d0c3] bg-[#f4f0e8]/95 px-5 py-5 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between"><a href="/" onClick={(e) => e.preventDefault()}><BrandMark /></a>
          <nav className="hidden items-center gap-8 md:flex"><NavLink active>Catalog</NavLink><NavLink>Brands</NavLink><NavLink>Trade</NavLink><NavLink>Showroom</NavLink><NavLink>About</NavLink><button className="ml-4 border border-[#9c392b] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#9c392b] transition-colors hover:bg-[#9c392b] hover:text-[#f4f0e8]">Trade inquiry</button></nav>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && <div className="mt-5 flex flex-col gap-3 border-t border-[#d8d0c3] pt-4 md:hidden"><NavLink active onClick={() => setMobileOpen(false)}>Catalog</NavLink><NavLink>Brands</NavLink><NavLink>Trade</NavLink><NavLink>Showroom</NavLink></div>}
      </header>

      <main className="mx-auto max-w-[1380px] px-5 md:px-10">
        <section className="grid gap-10 border-b border-[#d8d0c3] py-14 md:grid-cols-[1.1fr_.9fr] md:items-end md:py-24">
          <div><p className="mb-5 text-[10px] font-bold uppercase tracking-[.25em] text-[#9c392b]">The ATC specification library</p><h1 className="max-w-xl text-5xl leading-[1.02] md:text-7xl">Start with the <em className="text-[#9c392b]">detail.</em></h1></div>
          <div className="flex items-end justify-between gap-6 md:pb-1"><p className="max-w-sm text-sm leading-7 text-[#766e63]">A considered selection of systems and fittings for kitchens that are made to be lived with. Browse by what you are solving, not what you already know.</p><span className="hidden font-serif text-6xl text-[#d8d0c3] md:block">01</span></div>
        </section>
        <section className="flex flex-col gap-5 border-b border-[#d8d0c3] py-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-7 gap-y-3">{categories.map((category) => <NavLink key={category} active={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category}</NavLink>)}</div>
          <label className="flex items-center gap-3 border-b border-[#bcb3a5] pb-2 text-[#766e63]"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search systems or brands" className="w-52 bg-transparent text-xs outline-none placeholder:text-[#9d9588]" /></label>
        </section>
        <section className="grid gap-x-8 gap-y-14 py-12 sm:grid-cols-2 md:grid-cols-4 md:py-16">
          {visibleProducts.map((product) => <ProductTile key={product.name} product={product} onSelect={setSelected} />)}
          {visibleProducts.length === 0 && <div className="col-span-full border border-dashed border-[#bcb3a5] py-20 text-center"><SlidersHorizontal className="mx-auto mb-4 text-[#9c392b]" /><p className="font-serif text-2xl">Nothing in this edit yet.</p><p className="mt-2 text-sm text-[#766e63]">Try another search or category.</p></div>}
        </section>
        <section className="grid gap-8 border-t border-[#d8d0c3] py-16 md:grid-cols-[.8fr_1.2fr] md:py-24"><div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#9c392b]">Not sure where to begin?</p><h2 className="mt-4 max-w-sm text-4xl leading-tight">Bring us your plan.</h2></div><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><p className="max-w-md text-sm leading-7 text-[#766e63]">Our technical team can help translate a drawing, a mood, or a stubborn corner into the right system. Visit the showroom or send an inquiry.</p><button className="flex w-fit items-center gap-3 border-b border-[#9c392b] pb-2 text-[10px] font-bold uppercase tracking-widest text-[#9c392b]">Talk to a specialist <ArrowUpRight size={15} /></button></div></section>
      </main>
      <footer className="bg-[#292723] px-5 py-10 text-[#f4f0e8] md:px-10"><div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="font-serif text-xl tracking-[.22em]">AMARA</div><p className="mt-3 max-w-xs text-xs leading-5 text-[#bcb3a5]">Premium kitchen systems and furniture fittings. Amman, Jordan · Since 1977.</p></div><div className="text-xs text-[#bcb3a5]"><p>+962 6 581 0000</p><p className="mt-1">info@amara.jo</p></div></div></footer>
    </div>
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#292723]/60 p-5" onClick={() => setSelected(null)}><div className="grid w-full max-w-2xl gap-6 bg-[#f4f0e8] p-5 md:grid-cols-2 md:p-7" onClick={(e) => e.stopPropagation()}><img src={selected.image} alt={selected.name} className="h-full min-h-56 w-full object-cover" /><div className="flex flex-col justify-between py-2"><div><button onClick={() => setSelected(null)} className="float-right text-[#766e63]" aria-label="Close product details"><X size={18} /></button><p className="text-[10px] font-bold uppercase tracking-widest text-[#9c392b]">{selected.brand}</p><h2 className="mt-3 text-4xl">{selected.name}</h2><p className="mt-5 text-sm leading-7 text-[#766e63]">{selected.detail} Explore specifications, finishes, and compatible systems with our team.</p></div><button className="mt-8 flex items-center justify-between border-t border-[#d8d0c3] pt-4 text-left text-[10px] font-bold uppercase tracking-widest text-[#9c392b]">Request specifications <ArrowUpRight size={16} /></button></div></div></div>}
  </div>;
}