"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function TiendaPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    // Get customer info from localStorage
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      const customer = JSON.parse(customerData);
      setCustomerId(customer.id);
    } else {
      // Redirect to auth if no customer logged in
      router.push("/auth");
      return;
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load products
    fetchProducts("");
  }, [router]);

  const fetchProducts = async (query: string) => {
    try {
      setLoading(true);
      // Fetch all products with optional search query
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Deduplicate products by ID
        const uniqueProducts = data.filter(
          (product: Product, index: number, self: Product[]) =>
            index === self.findIndex((p) => p.id === product.id)
        );
        setProducts(uniqueProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0 || quantity > product.stock) {
      alert(`Por favor selecciona una cantidad válida (1-${product.stock})`);
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity }];
      }
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event("cartUpdated"));
      return updatedCart;
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Farma</h1>
            <div className="flex items-center gap-4">
              <button className="rounded-full bg-orange-500 p-2 text-white hover:bg-orange-600">
                🛒 {cart.length}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("customer");
                  router.push("/auth");
                }}
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600"
            >
              Buscar
            </button>
          </div>
        </form>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  // Generate a consistent placeholder image based on product ID
  const imageUrl = `https://placehold.co/400x400/ff6b35/ffffff?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-lg font-bold text-orange-500">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Stock: {product.stock}</p>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))
            }
            className="w-20 rounded border border-gray-300 px-2 py-1 text-center dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => onAddToCart(product, quantity)}
            disabled={product.stock === 0}
            className="flex-1 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stock === 0 ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
