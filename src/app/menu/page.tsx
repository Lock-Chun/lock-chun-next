"use client"; // This is needed for Client Components

import { useEffect, useState } from "react";

// Components
import Navbar from "../components/navbar";

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

  useEffect(() => {
    async function fetchMenu() {
      const res = await fetch("/menu.json");
      const data: Menu = await res.json();
      setMenu(data);
    }
    fetchMenu();
  }, []);

  if (!menu) return <p className="text-center text-gray-600">Loading menu...</p>;

  return (
    <main>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Restaurant Menu</h1>
        {Object.entries(menu).map(([category, items]: [string, MenuItem[]]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold border-b-2 pb-2">{category}</h2>
            <ul className="mt-4 space-y-4">
              {items.map((item, index: number) => (
                <li key={index} className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <strong>{item.name}</strong> {item.spicy && <span className="text-red-500">🌶️</span>}
                      {item.details && <span className="text-sm text-gray-600"> - {item.details}</span>}
                      {item.quantity && <span className="text-sm text-gray-600"> ({item.quantity} pcs)</span>}
                    </div>
                    {item.price !== undefined && <span className="font-semibold">${item.price.toFixed(2)}</span>}
                  </div>
                  {item.prices && (
                    <div className="mt-2 text-sm text-gray-700">
                      Sizes: {Object.entries(item.prices).map(([size, price]) => (
                        <span key={size} className="mr-2">{size}: ${price.toFixed(2)}</span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
