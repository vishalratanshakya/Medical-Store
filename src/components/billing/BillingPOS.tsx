"use client";

import { useRef, useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSale } from "@/lib/sales";
import { formatCurrency, generateInvoiceNumber, cn } from "@/lib/utils";
import type { CartItem, Product } from "@/types";
import { CATEGORY_LABELS } from "@/types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface BillingPOSProps {
  products: Product[];
  onSaleComplete: () => void;
}

const ITEMS_PER_PAGE = 15;

export function BillingPOS({ products, onSaleComplete }: BillingPOSProps) {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastInvoice, setLastInvoice] = useState<{
    number: string;
    items: CartItem[];
    total: number;
    date: string;
  } | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const availableProducts = products.filter((p) => p.stockQuantity > 0);
  const filteredProducts = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Reset pagination when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const startRange = filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRange = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) return prev;
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                lineTotal: (item.quantity + 1) * item.sellingRate,
                lineCost: (item.quantity + 1) * item.mrpRate,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          category: product.category,
          quantity: 1,
          sellingRate: product.sellingRate,
          mrpRate: product.mrpRate,
          lineTotal: product.sellingRate,
          lineCost: product.mrpRate,
          availableStock: product.stockQuantity,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.availableStock) return item;
          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.sellingRate,
            lineCost: newQty * item.mrpRate,
          };
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);
      const invoiceNumber = generateInvoiceNumber();
      await createSale(cart, invoiceNumber);
      setLastInvoice({
        number: invoiceNumber,
        items: [...cart],
        total: cartTotal,
        date: new Date().toISOString(),
      });
      setCart([]);
      onSaleComplete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!invoiceRef.current || !lastInvoice) return;

    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${lastInvoice.number}.pdf`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div ref={listRef} className="lg:col-span-2 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {displayedProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No available products found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {displayedProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {CATEGORY_LABELS[product.category]}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {formatCurrency(product.sellingRate)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stockQuantity}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages >= 1 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{startRange}</span> to{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{endRange}</span> of{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{filteredProducts.length}</span> products
                </div>

                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-2.5 py-1 text-xs"
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pNum = idx + 1;
                    return (
                      <Button
                        key={pNum}
                        size="sm"
                        variant={currentPage === pNum ? "primary" : "secondary"}
                        onClick={() => handlePageChange(pNum)}
                        className={cn("w-7 h-7 p-0 flex items-center justify-center rounded-lg text-xs", currentPage === pNum && "shadow-md shadow-blue-500/20")}
                      >
                        {pNum}
                      </Button>
                    );
                  })}

                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-2.5 py-1 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Cart ({cart.length})
            </h3>
          </div>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add products to cart
            </p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.sellingRate)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Complete Sale"}
              </Button>
            </div>
          )}
        </div>

        {lastInvoice && (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 dark:border-emerald-800 dark:from-emerald-950/40 dark:to-teal-950/40">
            <p className="mb-2 font-semibold text-emerald-800 dark:text-emerald-300">
              Sale Complete!
            </p>
            <p className="mb-3 text-sm text-emerald-700 dark:text-emerald-400">
              Invoice: {lastInvoice.number}
            </p>
            <Button onClick={downloadInvoice} variant="secondary" className="w-full">
              <Download className="h-4 w-4" />
              Download Invoice (PDF)
            </Button>
          </div>
        )}
      </div>

      {lastInvoice && (
        <div className="fixed -left-[9999px]">
          <div
            ref={invoiceRef}
            className="w-[400px] bg-white p-8 text-black"
          >
            <h1 className="text-xl font-bold">Medical Store Invoice</h1>
            <p className="mt-1 text-sm text-gray-600">
              Invoice: {lastInvoice.number}
            </p>
            <p className="text-sm text-gray-600">
              Date: {new Date(lastInvoice.date).toLocaleString("en-IN")}
            </p>
            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Rate</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {lastInvoice.items.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2">{item.productName}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.sellingRate)}
                    </td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between border-t pt-3 font-bold">
              <span>Grand Total</span>
              <span>{formatCurrency(lastInvoice.total)}</span>
            </div>
            <p className="mt-6 text-center text-xs text-gray-500">
              Thank you for your purchase!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
