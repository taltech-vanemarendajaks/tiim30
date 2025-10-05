"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  AlertCircle,
  DollarSign,
  Package,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

interface Product {
  id: number;
  organizationId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  organizationId: number;
}

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  maxQuantity: number;
  unitPrice: number;
}

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessingSale, setIsProcessingSale] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // Load cart from localStorage
    const savedCart = localStorage.getItem("pos-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("pos-cart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `/api/backend/inventory?categoryId=${selectedCategory}`
        : "/api/backend/inventory";

      const response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/backend/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.productId);

    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      if (product.quantity > 0) {
        setCart([...cart, {
          productId: product.productId,
          productName: product.productName,
          quantity: 1,
          maxQuantity: product.quantity,
          unitPrice: product.unitPrice
        }]);
      }
    }
  };

  const updateCartQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          return null; // Will be filtered out
        }
        if (newQuantity <= item.maxQuantity) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processSale = async () => {
    if (cart.length === 0) return;

    setIsProcessingSale(true);
    try {
      const saleRequest = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        notes: "POS Sale"
      };

      const response = await fetch("/api/backend/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to process sale");
      }

      const result = await response.json();

      // Clear cart and refresh products
      clearCart();
      fetchProducts();

      alert(`Sale processed successfully! Total: $${result.totalAmount}`);
    } catch (err) {
      alert(`Error processing sale: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsProcessingSale(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: "bg-red-100 text-red-800", label: "Out of Stock" };
    if (quantity < 10) return { color: "bg-yellow-100 text-yellow-800", label: "Low Stock" };
    return { color: "bg-green-100 text-green-800", label: "In Stock" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="rounded-lg bg-card p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-100">Point of Sales</h1>
            </div>
            <div className="text-sm text-gray-400">
              Products: {filteredProducts.length}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-950 border border-red-800 rounded-lg flex items-center gap-2 text-red-50">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="h-8"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-8"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Products Grid (70%) */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity);
                const inCart = cart.find(item => item.productId === product.productId);

                return (
                  <div
                    key={product.id}
                    className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-100 truncate flex-1">
                        {product.productName}
                      </h3>
                      <Package className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-green-400">${product.unitPrice.toFixed(2)}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Stock: {product.quantity}</span>
                      {inCart && (
                        <span className="text-blue-400">In cart: {inCart.quantity}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Sidebar (30%) */}
          <div className="w-80 bg-card rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-100">Cart</h2>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Your cart is empty</p>
                <p className="text-sm">Tap products to add them</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <div className="flex-1">
                        <p className="font-medium text-gray-100 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-400">
                          ${item.unitPrice} × {item.quantity} = ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, -1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, 1)}
                          className="h-6 w-6 p-0"
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.productId)}
                          className="h-6 w-6 p-0 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-600 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold text-gray-100">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={processSale}
                    disabled={isProcessingSale}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessingSale ? "Processing..." : "Sell"}
                  </Button>
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}