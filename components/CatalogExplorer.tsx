"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import Image from "next/image";

type GroupBy = "none" | "school" | "athlete";

export default function CatalogExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [galleryMap, setGalleryMap] = useState<Record<string, string[]>>({});
  const [page, setPage] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const SIZE_STOPS = ["XS", "S", "M", "L", "XL", "2XL"];
  const CATEGORY_OPTIONS = ["Tees", "Hoodies", "Hats", "Accessories"];
  const [sizeIndex, setSizeIndex] = useState<number>(2); // default to M

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', '8');
        if (query.trim()) params.set('name', query.trim());
        if (selectedSize) params.set('size', selectedSize);
        if (selectedCategory) params.set('category', selectedCategory);
        const apiUrl = '/api/products';
        const timestamp = Date.now();
        const forceTimestamp = forceRefresh;
        
        console.log('🔄 Loading products from:', `${apiUrl}?${params.toString()}`);
        
        const res = await fetch(`${apiUrl}?${params.toString()}&_t=${timestamp}&_force=${forceTimestamp}`, { 
          cache: "no-store",
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Force-Refresh': 'true'
          }
        });
        
        console.log('📡 API Response status:', res.status, res.ok);
        
        const data: Product[] = res.ok ? await res.json() : [];
        console.log('📦 Received products:', data.length, data.map(p => ({ id: p.id, name: p.name, price: p.price })));
        
        if (!cancelled) {
          if (data && data.length > 0) {
            setProducts(data);
            console.log('✅ Products set successfully');
          } else {
            setProducts([]);
            console.log('⚠️ No products found, setting empty array');
            // If we're on page 2+ and no products found, go back to page 1
            if (page > 1) {
              setPage(1);
            }
          }
        }
      } catch (e) {
        console.error('❌ Error loading products:', e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page, query, selectedSize, selectedCategory, refreshKey, forceRefresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.athleteName.toLowerCase().includes(q) ||
      p.school.toLowerCase().includes(q)
    );
  }, [products, query]);

  // Keep selectedSize in sync with the slider
  useEffect(() => {
    setSelectedSize(SIZE_STOPS[sizeIndex] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeIndex]);

  // Apply client-side filters for mock data as well
  const clientFiltered = useMemo(() => {
    return filtered.filter(p => {
      // Don't filter by size on frontend - backend already handles this
      if (selectedCategory && !(p.categories || []).includes(selectedCategory)) return false;
      return true;
    });
  }, [filtered, selectedCategory]);

  const grouped = useMemo(() => {
    if (groupBy === "none") return { All: clientFiltered } as Record<string, Product[]>;
    const key = groupBy === "school" ? (p: Product) => p.school : (p: Product) => p.athleteName;
    return clientFiltered.reduce<Record<string, Product[]>>((acc, p) => {
      const k = key(p) || "Unknown";
      (acc[k] ||= []).push(p);
      return acc;
    }, {});
  }, [clientFiltered, groupBy]);

  const groupKeys = useMemo(() => Object.keys(grouped).sort(), [grouped]);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-3 lg:col-span-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 h-fit sticky top-4">
          <div className="space-y-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-gray-100"
            />
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Group</div>
            <div className="inline-flex flex-wrap gap-2">
              <button className={`px-3 py-1.5 rounded-lg border text-sm ${groupBy === "none" ? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-neutral-700"}`} onClick={() => setGroupBy("none")} type="button">None</button>
              <button className={`px-3 py-1.5 rounded-lg border text-sm ${groupBy === "school" ? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-neutral-700"}`} onClick={() => setGroupBy("school")} type="button">By School</button>
              <button className={`px-3 py-1.5 rounded-lg border text-sm ${groupBy === "athlete" ? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-neutral-700"}`} onClick={() => setGroupBy("athlete")} type="button">By Player</button>
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Size</div>
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={SIZE_STOPS.length - 1}
                step={1}
                value={sizeIndex}
                onChange={(e) => { setSizeIndex(Number(e.target.value)); setPage(1); }}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 select-none">
                {SIZE_STOPS.map((s, i) => (
                  <span key={s} className={`${i === sizeIndex ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}>{s}</span>
                ))}
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => { setSelectedSize(""); setPage(1); }} className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600">All sizes</button>
              </div>
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Category</div>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full border rounded-lg px-3 py-2 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </aside>

        {/* Content */}
        <div className="md:col-span-9 lg:col-span-9">
          {groupBy === 'none' && (
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Showing 8 per page</div>
            <div className="inline-flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200" onClick={() => setPage(p => Math.max(1, p-1))} type="button">Prev</button>
              <span className="text-gray-700 dark:text-gray-300 text-sm">Page {page}</span>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200" onClick={() => setPage(p => p+1)} type="button">Next</button>
            </div>
          </div>
          )}

        {loading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        ) : clientFiltered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">No products found</div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Try adjusting your filters or add some products in the admin panel
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groupKeys.map((key) => (
              <div key={key}>
                {groupBy !== "none" && (
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{key}</h3>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {(groupBy === 'none' ? grouped[key].slice(0, 8) : grouped[key]).map((p) => (
                    <a key={p.id} href={`/catalog/${p.id}`} className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden block group">
                      <div className="h-56 bg-gray-200 dark:bg-neutral-700 flex items-center justify-center relative group">
                        {p.imageUrl || (p.images && p.images.length > 0) ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={p.imageUrl || p.images?.[0] || ''} 
                              alt={p.name} 
                              fill 
                              sizes="(min-width:1024px) 25vw, 50vw" 
                              className="object-cover transition-transform duration-300 group-hover:scale-105" 
                            />
                            {p.images && p.images.length > 1 && (
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                +{p.images.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">No image</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-1">
                          {p.athleteName ? (
                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs text-gray-700 dark:text-gray-200">
                              <span className="inline-block w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-700 relative">
                                <Image src={`/players/${(p.athleteName || '').toLowerCase().replace(/[^a-z0-9]+/g,'_')}.webp`} alt={p.athleteName} fill sizes="24px" className="object-cover" />
                              </span>
                              {p.athleteName}
                            </span>
                          ) : null}
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-2">{p.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{p.athleteName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-red-600 dark:text-red-400 font-bold">${p.price.toFixed(2)}</span>
                          {p.externalUrl && (
                            <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 font-semibold" onClick={(e) => e.stopPropagation()}>Buy</a>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
            {groupBy === 'none' && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200" onClick={() => setPage(p => Math.max(1, p-1))} type="button">Prev</button>
                <span className="text-gray-700 dark:text-gray-300 text-sm">Page {page}</span>
                <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-200" onClick={() => setPage(p => p+1)} type="button">Next</button>
              </div>
            )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}


