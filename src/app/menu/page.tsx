"use client"; // This is needed for Client Components

import { useEffect, useState } from "react";
import Image from "next/image";

// Components
import Navbar from "../components/navbar";
import MenuItem from "../components/MenuItem";
import CategoryHeader from "../components/CategoryHeader";
import ScrollButtons from "../components/ScrollButtons";

interface MenuItem {
  name: string;
  quantity?: number;
  price?: number;
  spicy: boolean;
  details?: string;
  prices?: { [key: string]: number };
}

interface Menu {
  [category: string]: MenuItem[];
}

export default function MenuPage() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMenu() {
      const res = await fetch("/menu.json");
      const data: Menu = await res.json();
      setMenu(data);
      setCategories(Object.keys(data));
    }
    fetchMenu();
  }, []);

  if (!menu)
    return (
      <main>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-6">
            Restaurant Menu
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/loading.gif"
              width={20}
              height={20}
              alt="Loading icon"
              unoptimized
              priority
            />
            <p className="text-center text-(--foreground)">Loading menu...</p>
          </div>
        </div>
      </main>
    );

  return (
    <main>
      <Navbar />
      <div className="max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Restaurant Menu</h1>

        {/* Add scroll buttons */}
        <ScrollButtons categories={categories} />

        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-10 mt-4">
          {Object.entries(menu).map(
            ([category, items]: [string, MenuItem[]]) => (
              <div
                key={category}
                id={`category-${category}`} // Add ID for scroll targeting
                className="mb-8">
                <CategoryHeader category={category} />
                <ul className="mt-(--standardMenuMargin) space-y-4">
                  {items.map((item, index: number) =>
                    MenuItem({ item, index })
                  )}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}
