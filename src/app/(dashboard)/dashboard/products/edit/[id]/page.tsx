"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, UploadCloud, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { useProducts } from "@/hooks/useProducts";
import { updateProduct } from "@/lib/products";
import type { ProductCategory, ProductFormData } from "@/types";
import { CATEGORY_LABELS } from "@/types";

const categories: ProductCategory[] = [
  "medicines",
  "syrups",
  "tubes",
  "cosmetics",
  "drips",
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const { id: productId } = use(params);
  const router = useRouter();
  const { products, loading: productsLoading, refresh } = useProducts();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploadedUrl, setImageUploadedUrl] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    category: "medicines",
    mrpRate: 0,
    sellingRate: 0,
    stockQuantity: 0,
    expiryDate: "",
    batchNumber: "",
  });

  const selectedProduct = products.find((p) => p.id === productId);

  // Pre-fill form with existing product data
  useEffect(() => {
    if (selectedProduct) {
      setForm({
        name: selectedProduct.name,
        category: selectedProduct.category,
        mrpRate: selectedProduct.mrpRate,
        sellingRate: selectedProduct.sellingRate,
        stockQuantity: selectedProduct.stockQuantity,
        expiryDate: selectedProduct.expiryDate,
        batchNumber: selectedProduct.batchNumber,
      });
      if (selectedProduct.imageUrl) {
        setImagePreview(selectedProduct.imageUrl);
        setImageUploadedUrl(selectedProduct.imageUrl);
      }
    }
  }, [selectedProduct]);

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setError("");

      try {
        setUploadingImage(true);
        setUploadProgress(20);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "medical-store");
        formData.append("cloud_name", "daowawj5g");
        formData.append("folder", "medical-store");

        setUploadProgress(60);

        const response = await fetch("https://api.cloudinary.com/v1_1/daowawj5g/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const resData = await response.json();
          throw new Error(resData.error?.message || "Image upload failed");
        }

        const data = await response.json();
        setUploadProgress(100);
        setImageUploadedUrl(data.secure_url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload image to Cloudinary");
        setImagePreview(selectedProduct?.imageUrl || null);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }

    try {
      setLoading(true);

      await updateProduct(productId, {
        ...form,
        imageUrl: imageUploadedUrl || undefined,
      });

      await refresh();
      setSuccess(true);

      setTimeout(() => {
        router.push(`/${form.category}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  if (productsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center space-y-4">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Product not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Toast Notification */}
      {success && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-6 py-4 text-white shadow-xl animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="h-5 w-5 animate-bounce" />
          <span className="font-medium">Product updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
          <PageHeader
            title={`Edit: ${selectedProduct.name}`}
            description="Update product information, pricing, and inventory details."
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns - Form Details */}
        <div className="space-y-8 lg:col-span-2">
          {/* Card 1: Basic Information */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all duration-300">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Paracetamol 500mg"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleInputChange("category", e.target.value as ProductCategory)}
                  className={inputClass}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Batch Number
                </label>
                <input
                  type="text"
                  required
                  value={form.batchNumber}
                  onChange={(e) => handleInputChange("batchNumber", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. BATCH-2026"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing and Stock */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all duration-300">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Pricing & Inventory
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  MRP Rate (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.mrpRate || ""}
                  onChange={(e) => handleInputChange("mrpRate", parseFloat(e.target.value) || 0)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Selling Rate (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.sellingRate || ""}
                  onChange={(e) => handleInputChange("sellingRate", parseFloat(e.target.value) || 0)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stockQuantity || ""}
                  onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value, 10) || 0)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={form.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image Upload */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all duration-300">
            <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Product Image
            </h2>

            <div className="flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative group w-full h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-xl p-4 text-center transition-colors mb-4 bg-gray-50/50 dark:bg-gray-900/50">
                  <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Upload to Cloudinary</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {uploadingImage && (
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 dark:bg-gray-800">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {imageUploadedUrl && !uploadingImage && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Uploaded to Cloudinary securely
                </p>
              )}
            </div>
          </div>

          {/* Submission */}
          <div className="flex flex-col gap-3">
            {error && (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImage} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
