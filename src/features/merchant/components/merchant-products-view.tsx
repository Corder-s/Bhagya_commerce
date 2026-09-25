"use client";

import { Edit2, Eye, Package, PackagePlus, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AddProductModal } from "@/features/merchant/components/add-product-modal";
import { StockUpdateModal } from "@/features/merchant/components/stock-update-modal";
import type { MerchantProduct } from "@/features/merchant/dashboard-types";
import { formatPrice } from "@/lib/format";
import { merchantDashboardService } from "@/services/merchant-dashboard.service";

export function MerchantProductsView() {
  const [products, setProducts] = React.useState<MerchantProduct[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [stockItem, setStockItem] = React.useState<{
    id: string;
    name: string;
    sku: string;
    currentStock: number;
  } | null>(null);

  const loadProducts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await merchantDashboardService.getProducts(undefined, {
        status: selectedStatus,
        search: searchQuery,
      });
      setProducts(data);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-display-sm font-bold text-ink">
            Product Catalogue
          </h1>
          <p className="text-body-sm text-ink-soft mt-0.5">
            Manage your artisan inventory, pricing, and live listings.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5 shrink-0"
        >
          <PackagePlus className="size-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "All Products" },
              { id: "published", label: "Published" },
              { id: "draft", label: "Drafts" },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedStatus === tab.id
                    ? "bg-[#C49A45] text-[#151515]"
                    : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              placeholder="Search by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-ink-soft text-body-sm animate-pulse">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="size-10 text-ink-soft mx-auto" />
            <h3 className="text-body-sm font-semibold text-ink">No products found</h3>
            <p className="text-caption text-ink-soft max-w-sm mx-auto">
              {searchQuery ? "No products match your search query." : "You haven't added any products yet."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-caption divide-y divide-line">
              <thead className="bg-surface-subtle text-ink-soft uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface text-ink">
                {products.map((p) => {
                  const isLowStock = p.stock > 0 && p.stock <= 5;
                  const isOutOfStock = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-surface-subtle/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex flex-col">
                          <span className="font-semibold text-body-sm text-ink truncate">
                            {p.name}
                          </span>
                          <span className="font-mono text-[11px] text-ink-soft">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-soft">{p.category}</td>
                      <td className="py-3.5 px-4 font-semibold font-display tabular-nums text-body-sm">
                        {formatPrice(p.price)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold tabular-nums text-xs px-2 py-0.5 rounded-md ${
                              isOutOfStock
                                ? "bg-danger/15 text-danger"
                                : isLowStock
                                  ? "bg-[#9A6A20]/15 text-[#9A6A20] dark:text-[#C49A45]"
                                  : "bg-surface-subtle text-ink font-mono"
                            }`}
                          >
                            {p.stock} units
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setStockItem({
                                id: p.id,
                                name: p.name,
                                sku: p.sku,
                                currentStock: p.stock,
                              })
                            }
                            title="Quick Adjust Stock"
                            className="text-ink-soft hover:text-gold p-1"
                          >
                            <RefreshCw className="size-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          tone={p.status === "published" ? "success" : "neutral"}
                          size="sm"
                        >
                          {p.status === "published" ? "Live" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setStockItem({
                              id: p.id,
                              name: p.name,
                              sku: p.sku,
                              currentStock: p.stock,
                            })
                          }
                          className="text-xs h-7 px-2"
                        >
                          Edit Stock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={loadProducts}
      />

      <StockUpdateModal
        item={stockItem}
        isOpen={Boolean(stockItem)}
        onClose={() => setStockItem(null)}
        onUpdated={loadProducts}
      />
    </div>
  );
}
