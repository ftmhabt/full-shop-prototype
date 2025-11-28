"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FallbackImage } from "@/components/FallbackImage";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  slug: string;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setProducts(data.products || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || products.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          router.push(`/product/${products[selectedIndex].id}`);
          setShowDropdown(false);
          setQuery("");
        } else if (query.trim()) {
          router.push(`/search?query=${encodeURIComponent(query)}`);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        break;
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <>
      {/* دسکتاپ */}
      <div className="hidden sm:block flex-1 max-w-xl relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            className="cursor-pointer rounded-full mr-11"
            onClick={() => {
              if (query.trim()) {
                router.push(`/search?query=${encodeURIComponent(query)}`);
              }
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          <div className="relative w-full">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim() && products.length > 0 && setShowDropdown(true)}
              placeholder="جستجوی محصولات..."
              className="rounded-full w-full"
              autoComplete="off"
            />
            {/* Dropdown */}
            {showDropdown && products.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.slug)}
                    className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 ${
                      idx === selectedIndex ? "bg-gray-100 dark:bg-gray-800" : ""
                    }`}
                  >
                    {product.image && ( 
                      <div className="relative w-12 h-12">
                        <FallbackImage className="object-cover rounded" src={product.image || undefined} alt={product.name} fill />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showDropdown && query.trim() && !loading && products.length === 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg border z-50 p-4 text-center text-gray-600 dark:text-gray-400">
                محصولی یافت نشد
              </div>
            )}
          </div>
        </div>
      </div>

      {/* موبایل */}
      <div className="sm:hidden">
        <Drawer open={open} onOpenChange={setOpen} direction="top">
          <DrawerTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>جستجو</DrawerTitle>
            </DrawerHeader>
            <div className="flex items-start gap-2 mb-4">
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  if (query.trim()) {
                    router.push(`/search?query=${encodeURIComponent(query)}`);
                    setOpen(false);
                  }
                }}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              <div className="w-full">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی محصولات..."
                  className="rounded-full flex-1"
                  autoFocus
                />
                {/* Mobile Results */}
                <div className="max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        handleProductClick(product.id);
                        setOpen(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 rounded"
                    >
                      {product.image && (
                        <div className="relative w-12 h-12">
                          <FallbackImage className="object-cover rounded" src={product.image || undefined} alt={product.name} fill />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    </div>
                  ))}

                  {query.trim() && !loading && products.length === 0 && (
                    <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                      محصولی یافت نشد
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}