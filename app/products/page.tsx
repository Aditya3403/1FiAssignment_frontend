"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BarLoader from "@/components/loader";
import { IoMdArrowDropdown } from "react-icons/io";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBrand, setShowBrand] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  let filteredProducts = products.filter((p) => {
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchColor = selectedColors.length === 0 || selectedColors.includes(p.color);
    return matchBrand && matchColor;
  });

  if (sortOption === "low-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.ourPrice - b.ourPrice);
  } else if (sortOption === "high-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.ourPrice - a.ourPrice);
  } else if (sortOption === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 bg-[#f5f5f5] dark:bg-[#111] text-black dark:text-white transition">
      <div className="max-w-7xl mx-auto w-full">

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">Smartphones</h1>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-4 justify-between mb-6">

          {/* LEFT FILTERS */}
          <div className="flex flex-wrap gap-3">

            {/* BRAND */}
            <div className="relative">
              <button
                onClick={() => setShowBrand(!showBrand)}
                className="flex items-center px-3 py-2 rounded-md bg-gray-200 dark:bg-[#2e2e2e] text-xs sm:text-sm font-medium"
              >
                Brand <IoMdArrowDropdown className="ml-1" />
              </button>

              {showBrand && (
                <div className="absolute z-10 mt-2 w-40 bg-white dark:bg-[#1c1c1c] shadow-lg rounded-md border p-2">
                  {["Apple", "Samsung", "OnePlus"].map((b) => (
                    <label key={b} className="flex items-center gap-2 py-1 text-xs sm:text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => handleBrandChange(b)}
                      />
                      {b}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* COLOR */}
            <div className="relative">
              <button
                onClick={() => setShowColor(!showColor)}
                className="flex items-center px-3 py-2 rounded-md bg-gray-200 dark:bg-[#2e2e2e] text-xs sm:text-sm font-medium"
              >
                Color <IoMdArrowDropdown className="ml-1" />
              </button>

              {showColor && (
                <div className="absolute z-10 mt-2 w-40 bg-white dark:bg-[#1c1c1c] shadow-lg rounded-md border p-2">
                  {["Orange", "Blue", "White", "Titanium"].map((c) => (
                    <label key={c} className="flex items-center gap-2 py-1 text-xs sm:text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(c)}
                        onChange={() => handleColorChange(c)}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SORT */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center px-3 py-2 rounded-md bg-gray-200 dark:bg-[#2e2e2e] text-xs sm:text-sm font-medium"
            >
              Sort By <IoMdArrowDropdown className="ml-1" />
            </button>

            {showSort && (
              <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-[#1c1c1c] shadow-lg rounded-md border p-2 text-xs sm:text-sm">
                <p className="py-1 cursor-pointer hover:underline" onClick={() => setSortOption("")}>
                  Relevancy
                </p>
                <p className="py-1 cursor-pointer hover:underline" onClick={() => setSortOption("low-high")}>
                  Price: Low → High
                </p>
                <p className="py-1 cursor-pointer hover:underline" onClick={() => setSortOption("high-low")}>
                  Price: High → Low
                </p>
                <p className="py-1 cursor-pointer hover:underline" onClick={() => setSortOption("rating")}>
                  Rating
                </p>
              </div>
            )}
          </div>

        </div>

        {/* FILTER TAGS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedBrands.map((b) => (
            <span
              key={b}
              className="px-3 py-1 bg-teal-400 text-black text-xs sm:text-sm rounded-full cursor-pointer"
              onClick={() => handleBrandChange(b)}
            >
              {b} ✕
            </span>
          ))}

          {selectedColors.map((c) => (
            <span
              key={c}
              className="px-3 py-1 bg-teal-400 text-black text-xs sm:text-sm rounded-full cursor-pointer"
              onClick={() => handleColorChange(c)}
            >
              {c} ✕
            </span>
          ))}

          {(selectedBrands.length > 0 || selectedColors.length > 0) && (
            <button
              onClick={() => {
                setSelectedBrands([]);
                setSelectedColors([]);
              }}
              className="underline text-xs sm:text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {/* LOADER */}
        {loading && (
          <div className="flex justify-center items-center h-60">
            <BarLoader />
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <Link
                href={`/products/${p.slug}`}
                key={p._id}
                className="rounded-lg p-4 bg-white dark:bg-[#1c1c1c] shadow hover:shadow-lg transition border border-gray-200 dark:border-[#2e2e2e] flex flex-col"
              >
                <img
                  src={p.thumbnail}
                  className="w-full h-40 sm:h-48 md:h-52 lg:h-56 object-contain"
                  alt={p.name}
                />

                <h3 className="mt-3 font-semibold text-sm sm:text-base truncate">
                  {p.name}
                </h3>

                <p className="text-base sm:text-lg font-bold mt-1">
                  ₹{p.ourPrice.toLocaleString("en-IN")}
                  <span className="text-gray-500 dark:text-gray-400 line-through text-xs sm:text-sm ml-2">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </p>

                <p className="text-green-500 text-xs sm:text-sm mt-1">
                  {p.rating} ★
                </p>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="mt-10 text-center text-gray-400">No products found.</p>
        )}

      </div>
    </div>
  );
}
