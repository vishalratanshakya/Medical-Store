"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { restockProduct } from "@/lib/products";
import type { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";

interface RestockModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RestockModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: RestockModalProps) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Enter a valid quantity");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await restockProduct(product.id, qty);
      setQuantity("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Restock failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setQuantity("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Restock: ${product?.name ?? ""}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {product && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current stock: <strong>{product.stockQuantity}</strong> units
          </p>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quantity to Add
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Restocking...
              </>
            ) : (
              "Confirm Restock"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
